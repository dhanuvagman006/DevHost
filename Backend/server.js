const express = require("express");
// const tls = require('tls');
// tls.DEFAULT_MIN_VERSION = 'TLSv1.2';
// tls.DEFAULT_MAX_VERSION = 'TLSv1.2';
// console.log('OpenSSL:', process.versions.openssl, 'TLS range:', tls.DEFAULT_MIN_VERSION, '→', tls.DEFAULT_MAX_VERSION);

const { MongoClient, ObjectId } = require("mongodb");
const cors = require("cors");
// const cacheMiddleware = require("./middleware/cacheMiddleware");
// const { clearCache } = require("./utils/cacheUtils");


require("dotenv").config();
const nodemailer = require("nodemailer");
const PORT = process.env.PORT || 5000;


const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});


async function sendEmailAlert(to, subject, html) {
  try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM || `"Nordic Retail System" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });
    console.log(`Email sent to ${to}: ${info.messageId}`);
  } catch (err) {
    console.error(" Failed to send email alert:", err.message);
  }
}

const countryMap = { denmark: 0, finland: 1, iceland: 2, norway: 3, sweden: 4 };
const productMap = {
  conditioner: 0,
  detergent: 1,
  lotion: 2,
  shampoo: 3,
  soap: 4,
  toothpaste: 5,
};
function encodeCountry(c) {
  if (!c) return -1;
  return countryMap[(c + "").toLowerCase()] ?? -1;
}
function encodeProduct(p) {
  if (!p) return -1;
  return productMap[(p + "").toLowerCase()] ?? -1;
}

function random_forest(productCode, month, countryCode) {
  if (productCode < 0 || countryCode < 0 || !month) return 0;
  const seed = productCode * 97 + countryCode * 53 + Number(month) * 11;
  const base = 200 + (seed % 200);
  const seasonal = [0, 0, 10, 25, 40, 50, 35, 20, 5, 0, -5, -10][(month - 1) % 12] || 0;
  return Math.max(0, Math.round(base + seasonal));
}

if (!process.env.MONGO_URI) {
  console.error("Missing MONGO_URI in .env");
  process.exit(1);
}

const client = new MongoClient(process.env.MONGO_URI, {
  tls: true,
  tlsAllowInvalidCertificates: false,
  serverSelectionTimeoutMS: 10000,
});

const app = express();
app.use(express.json());
app.use(cors());

async function connectCluster() {
  try {
    await client.connect();
    console.log("Connected to MongoDB Cluster");
    const usersDB = client.db("UserDB");
    await usersDB.collection("users").createIndex({ username: 1 }, { unique: true });
    console.log("Ensured index: UserDB.users.username");
  } catch (err) {
    console.error("MongoDB Connection Failed:", err);
    process.exit(1);
  }
}
connectCluster();

async function getUserAndDBByUserId(userId) {
  const usersDB = client.db("UserDB");
  const user = await usersDB.collection("users").findOne({ _id: new ObjectId(userId) });
  if (!user) return { user: null, userDB: null };
  const userDB = client.db(user.username);

  await userDB.collection("delivery_agents").createIndex({ location: 1, delivery_name: 1 });
  await userDB.collection("inventory").createIndex({ product_name: 1, country: 1, month: 1 });
  await userDB.collection("current_stock").createIndex({ product_name: 1, country: 1 }, { unique: true });

  return { user, userDB };
}

app.get("/", (_req, res) => {
  res.json({ ok: true, service: "Nordic Retail Backend", time: new Date().toISOString() });
});

app.post("/create-db", async (req, res) => {
  const { username, email, region } = req.body || {};
  if (!username) return res.status(400).json({ error: "Username is required" });

  try {
    const usersDB = client.db("UserDB");
    const users = usersDB.collection("users");

    const existing = await users.findOne({ username });
    if (existing) return res.status(400).json({ error: "User already exists" });

    const result = await users.insertOne({
      username,
      email: email || null,
      region: region || null,
      createdAt: new Date(),
    });

    const userDB = client.db(username);
    await userDB.createCollection("inventory").catch(() => {});
    await userDB.createCollection("delivery_agents").catch(() => {});
    await userDB.createCollection("current_stock").catch(() => {}); // NEW

    await userDB.collection("delivery_agents").createIndex({ location: 1, delivery_name: 1 });
    await userDB.collection("inventory").createIndex({ product_name: 1, country: 1, month: 1 });
    await userDB.collection("current_stock").createIndex({ product_name: 1, country: 1 }, { unique: true }); // NEW

    res.status(201).json({
      message: `Database '${username}' created`,
      userId: result.insertedId,
    });
  } catch (err) {
    console.error("Error creating DB:", err);
    res.status(500).json({ error: "Failed to create database" });
  }
});


app.post("/add-item/:userId", async (req, res) => {
  const { userId } = req.params;
  const {
    product_name,
    quantity,
    expiryDate,
    country,
    month,
    cost_price,
    selling_price,
    current_price, 
    sales,
  } = req.body || {};

  if (!product_name || quantity == null || !country || !month) {
    return res.status(400).json({
      error: "Missing required fields: product_name, quantity, country, month",
    });
  }

  try {
    const { user, userDB } = await getUserAndDBByUserId(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    const doc = {
      product_name,
      Quantity: Number(quantity),
      Expiry_Date: expiryDate || null,
      country,
      month: Number(month),
      cost_price: cost_price != null ? Number(cost_price) : null,
      selling_price: selling_price != null ? Number(selling_price) : null,
      sales: sales != null ? Number(sales) : 0,
      createdAt: new Date(),
    };

    const result = await userDB.collection("inventory").insertOne(doc);

    await userDB.collection("current_stock").updateOne(
      { product_name, country },
      {
        $inc: { quantity: Number(quantity) },
        $setOnInsert: { createdAt: new Date() },
        ...(current_price != null ? { $set: { current_price: Number(current_price), updatedAt: new Date() } } : { $set: { updatedAt: new Date() } }),
      },
      { upsert: true }
    );
    res.status(201).json({ message: "Item added successfully", itemId: result.insertedId });
  } catch (err) {
    console.error("Error adding item:", err);
    res.status(500).json({ error: "Failed to add item" });
  }
});

app.get("/getItems/:userId", async (req, res) => {
  const { userId } = req.params;
  try {
    const { user, userDB } = await getUserAndDBByUserId(userId);
    if (!user) return res.status(404).json({ error: "User not found" });
    const items = await userDB.collection("inventory").find().toArray();
    res.status(200).json({ items });
  } catch (err) {
    console.error("Error fetching items:", err);
    res.status(500).json({ error: "Failed to fetch items" });
  }
});

app.post("/addDeliveryAgent/:userId", async (req, res) => {
  const { userId } = req.params;
  const { delivery_name, delivery_number, location } = req.body || {};

  if (!delivery_name || !delivery_number || !location) {
    return res.status(400).json({ error: "Missing required fields: delivery_name, delivery_number, location" });
  }

  try {
    const { user, userDB } = await getUserAndDBByUserId(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    const result = await userDB.collection("delivery_agents").insertOne({
      delivery_name,
      delivery_number,
      location,
      createdAt: new Date(),
    });

    res.status(201).json({
      message: `Delivery Agent added successfully for ${location}`,
      agentId: result.insertedId,
    });
  } catch (err) {
    console.error("Error adding Agent:", err);
    res.status(500).json({ error: "Failed to add Agent" });
  }
});

app.get("/getDeliveryAgents/:userId", async (req, res) => {
  const { userId } = req.params;
  const { location } = req.query;

  try {
    const { user, userDB } = await getUserAndDBByUserId(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    const query = {};
    if (location) {
      query.location = { $regex: new RegExp(location, "i") };
    }
    const agents = await userDB.collection("delivery_agents").find(query).toArray();
    res.status(200).json({ agents });
  } catch (err) {
    console.error("Error fetching agents:", err);
    res.status(500).json({ error: "Failed to fetch agents" });
  }
});

app.get("/getDeliveryAgentsByLocation/:userId/:location", async (req, res) => {
  const { userId, location } = req.params;
  try {
    const { user, userDB } = await getUserAndDBByUserId(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    const agents = await userDB
      .collection("delivery_agents")
      .find({ location: { $regex: new RegExp(location, "i") } })
      .toArray();

    if (agents.length === 0) {
      return res.status(404).json({ message: `No agents found in ${location}` });
    }
    res.status(200).json({ location, agents });
  } catch (err) {
    console.error("Error fetching agents by location:", err);
    res.status(500).json({ error: "Failed to fetch agents by location" });
  }
});

app.post("/forecast", async (req, res) => {
  try {
    const { country, product_name, month, avg_price, promotion, previous_sales, season_index, economic_index, stock_level } = req.body;

    if (!country || !product_name || !month) {
      return res.status(400).json({ error: "Missing required fields: country, product_name, month" });
    }

    const pythonResponse = await fetch("http://localhost:8000/forecast", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        product_name,
        month,
        country,
        avg_price: avg_price || 50,
        promotion: promotion || 0,
        previous_sales: previous_sales || 300,
        season_index: season_index || 0.8,
        economic_index: economic_index || 1.0,
        stock_level: stock_level || 400,
      }),
    });

    const data = await pythonResponse.json();

    if (!pythonResponse.ok || !data.success) {
      return res.status(500).json({
        success: false,
        message: "Forecast service failed",
        details: data.error || "Unknown error from Python service",
      });
    }

    res.status(200).json({
      success: true,
      source: "python-ml",
      forecasted_sales: data.forecasted_sales,
      suggested_stock: data.suggested_stock,
      note: "Predicted by Python ML microservice",
    });
  } catch (error) {
    console.error("Error calling Python forecast service:", error);
    res.status(500).json({
      success: false,
      message: "Failed to connect to ML microservice",
      error: error.message,
    });
  }
});

app.get("/analytics/:userId", async (req, res) => {
  const { userId } = req.params;
  try {
    const { user, userDB } = await getUserAndDBByUserId(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    const summary = await userDB.collection("inventory").aggregate([
      {
        $group: {
          _id: { product_name: "$product_name", country: "$country" },
          totalSales: { $sum: { $ifNull: ["$sales", 0] } },
          avgPrice: { $avg: { $ifNull: ["$selling_price", 0] } },
          avgStockQty: { $avg: { $ifNull: ["$Quantity", 0] } },
          countMonths: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          product_name: "$_id.product_name",
          country: "$_id.country",
          totalSales: 1,
          avgPrice: { $round: ["$avgPrice", 2] },
          avgStockQty: { $round: ["$avgStockQty", 2] },
          countMonths: 1,
        },
      },
      { $sort: { country: 1, product_name: 1 } },
    ]).toArray();

    res.status(200).json({ success: true, summary });
  } catch (err) {
    console.error("Error generating analytics:", err);
    res.status(500).json({ error: "Failed to generate analytics" });
  }
});


app.post("/set-price/:userId", async (req, res) => {
  const { userId } = req.params;
  const { product_name, country, current_price } = req.body || {};
  if (!product_name || !country || current_price == null) {
    return res.status(400).json({ error: "product_name, country, current_price are required" });
  }

  try {
    const { user, userDB } = await getUserAndDBByUserId(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    const r = await userDB.collection("current_stock").updateOne(
      { product_name, country },
      {
        $set: { current_price: Number(current_price), updatedAt: new Date() },
        $setOnInsert: { quantity: 0, createdAt: new Date() },
      },
      { upsert: true }
    );
    res.json({ success: true, upserted: !!r.upsertedId });
  } catch (e) {
    console.error("Error setting price:", e);
    res.status(500).json({ error: "Failed to set price" });
  }
});

app.get("/stock/:userId", async (req, res) => {
  const { userId } = req.params;
  const { product_name, country } = req.query;

  try {
    const { user, userDB } = await getUserAndDBByUserId(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    const q = {};
    if (product_name) q.product_name = product_name;
    if (country) q.country = country;

    const docs = await userDB.collection("current_stock").find(q).sort({ country: 1, product_name: 1 }).toArray();
    res.json({ success: true, stock: docs });
  } catch (e) {
    console.error("Error getting stock:", e);
    res.status(500).json({ error: "Failed to get stock" });
  }
});

app.post("/bill/:userId", async (req, res) => {
  const { userId } = req.params;
  const { items } = req.body || {};
  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: "items[] required" });
  }

  try {
    const { user, userDB } = await getUserAndDBByUserId(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    const results = [];
    let grandTotal = 0;

    for (const it of items) {
      const { product_name, country } = it;
      const qty = Number(it.quantity || 0);
      if (!product_name || !country || qty <= 0) {
        results.push({ product_name, country, ok: false, error: "Invalid line" });
        continue;
      }

      const updated = await userDB.collection("current_stock").findOneAndUpdate(
        { product_name, country },
        { $inc: { quantity: -qty }, $set: { updatedAt: new Date() } },
        { returnDocument: "after", upsert: true }
      );

      const doc = updated.value || { quantity: 0, current_price: 0 };

      if (doc.quantity < 0) {
        await userDB.collection("current_stock").updateOne(
          { product_name, country },
          { $set: { quantity: 0, updatedAt: new Date() } }
        );
        doc.quantity = 0;
      }

      const price = Number(doc.current_price || 0);
      const lineTotal = price * qty;
      grandTotal += lineTotal;

      // ⚠️ STOCK ALERT SECTION
      if (doc.quantity <= 10) {
        // If retailer has an email
        if (user.email) {
          const subject =
            doc.quantity === 0
              ? `🚨 OUT OF STOCK: ${product_name} (${country})`
              : `⚠️ LOW STOCK ALERT: ${product_name} (${country})`;

          const html = `
            <div style="font-family:Arial,sans-serif;padding:15px;background:#f9f9f9;border-radius:10px">
              <h2>${subject}</h2>
              <p>Dear <strong>${user.username}</strong>,</p>
              <p>Your product <b>${product_name}</b> in <b>${country}</b> ${
                doc.quantity === 0
                  ? "has run out of stock."
                  : `has only <b>${doc.quantity}</b> units left.`
              }</p>
              <p>Please restock soon to avoid missed sales.</p>
              <hr />
              <small style="color:#888">Automated Alert • Nordic Retail System</small>
            </div>
          `;
          await sendEmailAlert(user.email, subject, html);
        }

        console.warn(
          `[STOCK-ALERT] userId=${userId} product="${product_name}" country="${country}" remaining=${doc.quantity}`
        );

        // Optional: log in alerts collection
        await userDB.collection("alerts").insertOne({
          type: doc.quantity === 0 ? "out-of-stock" : "low-stock",
          product_name,
          country,
          remaining_qty: doc.quantity,
          sentAt: new Date(),
        });
      }

      results.push({
        product_name,
        country,
        sold_qty: qty,
        price_each: price,
        line_total: Number(lineTotal.toFixed(2)),
        remaining_qty: doc.quantity,
      });
    }

    res.json({
      success: true,
      items: results,
      grand_total: Number(grandTotal.toFixed(2)),
      message: "Billing completed, stock updated, and alerts sent if required.",
    });
  } catch (e) {
    console.error("Error in /bill:", e);
    res.status(500).json({ error: "Failed to complete billing" });
  }
});


app.post("/dynamic-pricing/:userId", async (req, res) => {
  const { userId } = req.params;
  const { product_name, country } = req.body;

  if (!product_name || !country)
    return res.status(400).json({ error: "product_name and country are required" });

  try {
    const { user, userDB } = await getUserAndDBByUserId(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    const stockDoc = await userDB.collection("current_stock").findOne({ product_name, country });
    if (!stockDoc) return res.status(404).json({ error: "Item not found in current stock" });

    const currentStock = stockDoc.quantity || 0;
    const basePrice = stockDoc.current_price || stockDoc.selling_price || 50;
    const costPrice = stockDoc.cost_price || 30;

    const pythonResponse = await fetch("http://localhost:8000/forecast", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        product_name,
        country,
        month: new Date().getMonth() + 1,
        avg_price: basePrice,
        previous_sales: stockDoc.sales || 300,
        stock_level: currentStock,
      }),
    });

    const forecastData = await pythonResponse.json();
    const predictedDemand = forecastData.forecasted_sales || 300;

    const ratio = currentStock / predictedDemand;
    let newPrice = basePrice;
    let reason = "";

    if (ratio < 0.5) { newPrice *= 1.10; reason = "High demand / low stock"; }
    else if (ratio < 0.8) { newPrice *= 1.05; reason = "Moderate demand"; }
    else if (ratio > 1.5) { newPrice *= 0.90; reason = "Overstock"; }
    else if (ratio > 1.2) { newPrice *= 0.95; reason = "Slight overstock"; }
    else { reason = "Stable demand"; }

    if (newPrice < costPrice * 1.1) {
      newPrice = costPrice * 1.1;
      reason += " | Adjusted to minimum profit margin.";
    }

    newPrice = Number(newPrice.toFixed(2));

    await userDB.collection("current_stock").updateOne(
      { product_name, country },
      { $set: { current_price: newPrice, updatedAt: new Date() } }
    );

    res.json({
      success: true,
      product_name,
      country,
      old_price: basePrice,
      new_price: newPrice,
      predicted_demand: predictedDemand,
      current_stock: currentStock,
      stock_demand_ratio: Number(ratio.toFixed(2)),
      reason,
      note: "Dynamic pricing updated successfully."
    });

  } catch (err) {
    console.error("Error in /dynamic-pricing:", err);
    res.status(500).json({ error: "Failed to apply dynamic pricing" });
  }
});

app.get("/top-sold/:userId",async (req, res) => {
  const { userId } = req.params;
  const limit = Number(req.query.limit) || 5;

  try {
    const { user, userDB } = await getUserAndDBByUserId(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    const now = new Date();
    const currentMonth = now.getMonth() + 1;
    const lastYear = now.getFullYear() - 1;

    const topSold = await userDB.collection("inventory").aggregate([
      {
        $addFields: {
          year: { $year: "$createdAt" },
          month: { $toInt: "$month" },
        },
      },
      {
        $match: {
          year: lastYear,
          month: currentMonth,
          sales: { $gt: 0 },
        },
      },
      {
        $group: {
          _id: { product_name: "$product_name", country: "$country" },
          totalSales: { $sum: "$sales" },
          avgPrice: { $avg: "$selling_price" },
          avgStock: { $avg: "$Quantity" },
        },
      },
      { $sort: { totalSales: -1 } },
      { $limit: limit },
      {
        $project: {
          _id: 0,
          product_name: "$_id.product_name",
          country: "$_id.country",
          totalSales: 1,
          avgPrice: { $round: ["$avgPrice", 2] },
          avgStock: { $round: ["$avgStock", 2] },
        },
      },
    ]).toArray();

    res.json({
      success: true,
      year: lastYear,
      month: currentMonth,
      count: topSold.length,
      topSold,
      note: `Top ${limit} sold products for ${lastYear}-${currentMonth}`,
    });
  } catch (err) {
    console.error("Error in /top-sold:", err);
    res.status(500).json({ error: "Failed to fetch top sold products" });
  }
});


app.get("/regional-top/:country",async (req, res) => {
  const { country } = req.params;
  const limit = Number(req.query.limit) || 5;

  if (!country) return res.status(400).json({ error: "country parameter is required" });

  try {
    const usersDB = client.db("UserDB");
    const retailers = await usersDB.collection("users").find({ region: { $regex: new RegExp(country, "i") } }).toArray();

    if (!retailers.length) {
      return res.status(404).json({ error: `No retailers found in ${country}` });
    }

    const aggregated = {};

    for (const retailer of retailers) {
      const db = client.db(retailer.username);
      const inventory = db.collection("inventory");

      const results = await inventory.aggregate([
        { $match: { country: { $regex: new RegExp(country, "i") }, sales: { $gt: 0 } } },
        {
          $group: {
            _id: "$product_name",
            totalSales: { $sum: "$sales" },
            avgPrice: { $avg: "$selling_price" },
            retailers: { $addToSet: retailer.username },
          },
        },
      ]).toArray();

      for (const r of results) {
        if (!aggregated[r._id]) {
          aggregated[r._id] = {
            product_name: r._id,
            totalSales: r.totalSales,
            avgPrice: r.avgPrice,
            retailers: r.retailers,
          };
        } else {
          aggregated[r._id].totalSales += r.totalSales;
          aggregated[r._id].avgPrice = (aggregated[r._id].avgPrice + r.avgPrice) / 2;
          aggregated[r._id].retailers = Array.from(new Set([...aggregated[r._id].retailers, ...r.retailers]));
        }
      }
    }

    // Convert to sorted array
    const topRegional = Object.values(aggregated)
      .sort((a, b) => b.totalSales - a.totalSales)
      .slice(0, limit);

    res.json({
      success: true,
      region: country,
      count: topRegional.length,
      topRegional,
      note: `Top ${limit} sold products in ${country} across nearby retailers.`,
    });

  } catch (err) {
    console.error("Error in /regional-top:", err);
    res.status(500).json({ error: "Failed to get regional top-sold products" });
  }
});


app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
