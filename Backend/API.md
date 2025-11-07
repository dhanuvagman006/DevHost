
| Page | Purpose | Key API Endpoints |
|------|----------|------------------|
| **Register** | Create a retailer DB | `POST /create-db` |
| **Inventory** | Add, view, and price items | `POST /add-item/:userId`, `GET /getItems/:userId`, `POST /set-price/:userId` |
| **Agents** | Manage delivery agents | `POST /addDeliveryAgent/:userId`, `GET /getDeliveryAgents/:userId` |
| **Billing** | Create bills and reduce stock | `POST /bill/:userId`, `GET /stock/:userId` |
| **Pricing** | Auto price update via demand | `POST /dynamic-pricing/:userId` |
| **Forecast** | AI demand forecasting | `POST /forecast` |
| **Analytics** | Performance metrics | `GET /analytics/:userId`, `GET /top-sold/:userId` |
| **Regional** | Top sellers by nearby retailers | `GET /regional-top/:country` |
| **Replenish** | Auto restock suggestions | `POST /replenish/check/:userId` |
| **Dashboard** | Overview of all modules | Combines all above |

---

## 🧩 Components Overview

| Component | Description | Linked API |
|------------|--------------|------------|
| `AddItemForm` | Add product to inventory | `POST /add-item/:userId` |
| `InventoryTable` | Show current inventory | `GET /getItems/:userId` |
| `AddAgentForm` | Add delivery agent | `POST /addDeliveryAgent/:userId` |
| `AgentsList` | List all agents | `GET /getDeliveryAgents/:userId` |
| `BillingForm` | Process billing | `POST /bill/:userId` |
| `DynamicPricingForm` | Apply price optimization | `POST /dynamic-pricing/:userId` |
| `ForecastForm` | Predict stock/demand | `POST /forecast` |
| `AnalyticsTable` | View KPI metrics | `GET /analytics/:userId` |
| `TopSoldLastYear` | Top products from last year | `GET /top-sold/:userId` |
| `RegionalTopTable` | Nearby retailers’ top sellers | `GET /regional-top/:country` |
| `ReplenishmentChecker` | Auto restock | `POST /replenish/check/:userId` |

---