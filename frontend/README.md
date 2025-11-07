# Folkspace 

A Climate-Responsive AI Platform for sustainable retail, built in a 28-hour hackathon.

![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)

---

##  The Problem

Nordic retailers face a dual challenge:
1.  **Unpredictable climate events** disrupt traditional demand forecasting, leading to stock mismatches.
2.  **Strict sustainability regulations** impose penalties for food and product waste, pressuring retailers to optimize their inventory.

Traditional retail systems are not equipped to dynamically respond to sudden weather changes or manage the shelf-life of perishable goods at scale, leading to significant financial losses and environmental waste.

##  Our Solution

**Folkspace** is an intelligent, climate-aware dashboard that helps store managers forecast demand, optimize inventory, and implement dynamic pricing in real-time.

By combining historical sales data with live weather forecasts, Folkspace provides actionable insights to:
* **Reduce Waste:** Automatically suggest markdowns for items nearing expiry.
* **Boost Profit:** Optimize pricing based on predicted demand and shelf-life.
* **Ensure Compliance:** Help retailers meet sustainability goals by minimizing overstock.


*(A brief video of our demo and pitch will be linked here)*

---

##  Key Features (MVP)

* **Climate-Aware Demand Forecasting:** A model that predicts item demand using historical sales and weather API inputs (e.g., adjusting forecasts down for a coming storm).
* **Dynamic Pricing Module:** Generates automatic price suggestions based on stock levels, shelf-life, and demand (e.g., markdowns for perishables, "eco-premiums" for high-carbon items).
* **Smart Inventory Dashboard:** A clean UI showing current stock, forecasted demand, and recommended reorder quantities.
* **Waste-Alert System:** Actively flags items close to expiry with a suggested action (e.g., "Time for a 15% discount") to promote quick sale.
* **Simulated Data Integration:** Demonstrates pulling from a mock ERP (JSON) and pushing reorder suggestions.

---

##  System Architecture

Our architecture is a lean, demo-friendly microservice model designed for a rapid hackathon sprint.



1.  **Frontend (React):** A single-page application that provides the user dashboard, charts, and alerts. It communicates with the backend via REST API calls.
2.  **Backend (Node/Express):** A central API that handles data requests, manages database operations, and calls the AI engine for insights. It exposes endpoints like `/forecast`, `/price`, and `/inventory`.
3.  **AI/Pricing Engine (Python/Node):** A simple microservice that computes forecasts and pricing rules. It fetches data from external weather APIs to factor climate data into its logic.
4.  **Database (MongoDB Atlas):** A NoSQL database (using the free tier) to store mock inventory, sales history, and pricing rules.
5.  **External APIs:** We integrate with a free weather API (like OpenWeatherMap) to pull real-time climate data.

---

##  Tech Stack

| Category | Technology | Purpose |
| :--- | :--- | :--- |
| **Frontend** | React (Vite) | Core UI framework |
| | Material-UI / Bootstrap | Rapid component styling |
| | Recharts / Chart.js | Data visualization (forecast graphs) |
| **Backend** | Node.js | Runtime environment |
| | Express.js | API framework |
| | Mongoose | MongoDB object modeling |
| **AI & Data** | Python (Flask/FastAPI) | ML microservice for forecasting |
| | Scikit-learn / Pandas | Basic model training & data handling |
| **Database** | MongoDB Atlas | Free-tier cloud NoSQL database |
| **APIs & Services** | OpenWeatherMap | Real-time weather data |
| **Deployment** | Vercel / Netlify | Frontend hosting |
| | Heroku / Render | Backend hosting |

---

## ⚙️ Getting Started

Follow these instructions to get a local copy up and running.

### Prerequisites

* Node.js (v18+)
* Python (v3.9+)
* A MongoDB Atlas account (and your connection string)

### Installation & Running

1.  **Clone the repo:**
    ```bash
    git clone [https://github.com/your-username/folkspace.git](https://github.com/your-username/folkspace.git)
    cd folkspace
    ```

2.  **Setup Backend (Server):**
    * Navigate to the server directory: `cd server`
    * Install dependencies: `npm install`
    * Create a `.env` file and add your database URI:
        ```
        MONGO_URI=your_mongodb_atlas_connection_string
        PORT=5000
        ```
    * Run the server: `npm start`

3.  **Setup AI Engine (if separate):**
    * Navigate to the AI engine directory: `cd engine`
    * Install dependencies: `pip install -r requirements.txt`
    * Run the Python service: `python app.py`

4.  **Setup Frontend (Client):**
    * Navigate to the client directory (from root): `cd client`
    * Install dependencies: `npm install`
    * Run the client: `npm run dev` (for Vite) or `npm start` (for CRA)

Your application should now be running locally at `http://localhost:3000`.

---

##  The Team

* **Frontend Lead:** Responsible for React components, UI/UX, and chart integration.
* **Backend/API Lead:** Responsible for Node/Express server, MongoDB schemas, and API logic.
* **Data/AI Lead:** Responsible for mock datasets, the forecasting model, and pricing rules.
* **QA & Presenter:** Responsible for end-to-end testing, presentation slides, and demo script.

---

##  Future Roadmap

Given more time, we would expand Folkspace's capabilities:

* **Advanced ML Models:** Implement more complex models (like LSTMs) for higher-fidelity forecasting.
* **Blockchain Traceability:** Integrate blockchain to provide transparent supply-chain tracking for high-value or organic goods.
* **IoT Sensor Integration:** Connect with in-store IoT sensors (temp, humidity) to get real-time spoilage data.
* **AR Inventory View:** An augmented reality overlay for store employees to visually identify items needing action.
* **Voice Query Interface:** A simple voice-powered assistant ("Folkspace, what's the forecast for bread today?").
