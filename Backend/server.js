const express = require('express');
const { MongoClient, ObjectId } = require("mongodb");
const cors = require("cors");
require("dotenv").config();
const PORT = 5000;

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
  } catch (err) {
    console.error("MongoDB Connection Failed:", err);
  }
}
connectCluster();

app.post("/create-db", async (req, res) => {
  const { username } = req.body;
  if (!username) return res.status(400).json({ error: "Username is required" });
  try {
    const usersDB = client.db("UserDB");
    const usersCollection = usersDB.collection("users");
    const userExists = await usersCollection.findOne({ username });
    if (userExists) return res.status(400).json({ error: "User already exists" });

    const result = await usersCollection.insertOne({ username, createdAt: new Date() });
    const userId = result.insertedId;

    const db = client.db(username);
    await db.createCollection("inventory");

    res.status(201).json({ message: `Database '${username}' created`, userId });
  } catch (err) {
    console.error("Error creating DB:", err);
    res.status(500).json({ error: "Failed to create database" });
  }
});

app.post("/add-item/:userId", async (req, res) => {
  const { userId } = req.params;
  const { itemName, quantity, expiryDate } = req.body;
  if (!itemName || !quantity || !expiryDate)
    return res.status(400).json({ error: "Missing required fields" });

  try {
    const usersDB = client.db("UserDB");
    const user = await usersDB.collection("users").findOne({ _id: new ObjectId(userId) });
    if (!user) return res.status(404).json({ error: "User not found" });

    const userDB = client.db(user.username);
    const result = await userDB.collection("inventory").insertOne({
      Item_Name: itemName,
      Quantity: quantity,
      Expiry_Date: expiryDate,
      createdAt: new Date(),
    });

    res.status(201).json({ message: "Item added successfully", itemId: result.insertedId });
  } catch (err) {
    console.error("Error adding item:", err);
    res.status(500).json({ error: "Failed to add item" });
  }
});

app.get('/', (req, res) => {
  res.json('Hello from Express API');
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
