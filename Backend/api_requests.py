import requests
import json
from datetime import date, timedelta, datetime

BASE_URL = "http://localhost:5000"

def create_retailer(session):
    """Creates a new retailer."""
    url = f"{BASE_URL}/create-db"
    # Add timestamp to make username unique
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    payload = {
        "username": f"nordic_retail_{timestamp}",
        "email": "mmanishrshetty@gmail.com",
        "region": "sweden"
    }
    try:
        response = session.post(url, json=payload)
        response.raise_for_status()
        data = response.json()
        print("Retailer created successfully:", data)
        return data.get("userId")
    except requests.exceptions.RequestException as e:
        print(f"Error creating retailer: {e}")
        return None

def add_inventory(session, user_id):
    """Adds inventory items for a retailer."""
    url = f"{BASE_URL}/add-item/{user_id}"
    items = [
        {"product_name": "shampoo", "quantity": 100, "expiryDate": (date.today() + timedelta(days=365)).isoformat(), "country": "sweden", "month": 11, "cost_price": 25, "selling_price": 50, "current_price": 48.99, "sales": 50},
        {"product_name": "soap", "quantity": 200, "expiryDate": (date.today() + timedelta(days=730)).isoformat(), "country": "sweden", "month": 11, "cost_price": 10, "selling_price": 20, "current_price": 18.50, "sales": 150},
        {"product_name": "lotion", "quantity": 15, "expiryDate": (date.today() + timedelta(days=180)).isoformat(), "country": "denmark", "month": 11, "cost_price": 40, "selling_price": 70, "current_price": 65.00, "sales": 10}
    ]
    for item in items:
        try:
            response = session.post(url, json=item)
            response.raise_for_status()
            print(f"Added item '{item['product_name']}' successfully:", response.json())
        except requests.exceptions.RequestException as e:
            print(f"Error adding item '{item['product_name']}': {e}")

def add_delivery_agent(session, user_id):
    """Adds a delivery agent for a retailer."""
    url = f"{BASE_URL}/addDeliveryAgent/{user_id}"
    payload = {
        "delivery_name": "Speedy Gonzales",
        "delivery_number": "123-456-7890",
        "location": "stockholm"
    }
    try:
        response = session.post(url, json=payload)
        response.raise_for_status()
        print("Delivery agent added successfully:", response.json())
    except requests.exceptions.RequestException as e:
        print(f"Error adding delivery agent: {e}")

def add_distributor(session):
    """Adds global distributors for multiple cities."""
    url = f"{BASE_URL}/distributors"
    
    # Add distributors for multiple cities
    distributors_data = [
        {
            "location": "oslo",
            "distributors": [
                {
                    "name": "Nordic Distributors Inc.",
                    "contact": "555-1234",
                    "email": "dhanushinsit@gmail.com"
                }
            ]
        },
        {
            "location": "stockholm",
            "distributors": [
                {
                    "name": "Stockholm Supply Co.",
                    "contact": "555-5678",
                    "email": "dhanushinsit@gmail.com"
                }
            ]
        },
        {
            "location": "copenhagen",
            "distributors": [
                {
                    "name": "Copenhagen Distribution Ltd.",
                    "contact": "555-9012",
                    "email": "dhanushinsit@gmail.com"
                }
            ]
        }
    ]
    
    for payload in distributors_data:
        try:
            response = session.post(url, json=payload)
            response.raise_for_status()
            print(f"Distributor added successfully for {payload['location']}.")
        except requests.exceptions.RequestException as e:
            print(f"Error adding distributor for {payload['location']}: {e}")

def get_inventory(session, user_id):
    """Gets all inventory for a retailer."""
    url = f"{BASE_URL}/getItems/{user_id}"
    try:
        response = session.get(url)
        response.raise_for_status()
        print("Inventory retrieved successfully:", response.json())
    except requests.exceptions.RequestException as e:
        print(f"Error getting inventory: {e}")

def perform_forecast(session):
    """Performs a sales forecast."""
    url = f"{BASE_URL}/forecast"
    payload = {
        "country": "sweden",
        "product_name": "shampoo",
        "month": 12,
        "avg_price": 49,
        "promotion": 0,
        "previous_sales": 50,
        "season_index": 1.1,
        "economic_index": 1.0,
        "stock_level": 100
    }
    try:
        response = session.post(url, json=payload)
        response.raise_for_status()
        print("Forecast performed successfully:", response.json())
    except requests.exceptions.RequestException as e:
        print(f"Error performing forecast: {e}")

def create_bill(session, user_id):
    """Creates a bill for a customer."""
    url = f"{BASE_URL}/bill/{user_id}"
    payload = {
        "items": [
            {"product_name": "shampoo", "country": "sweden", "quantity": 2},
            {"product_name": "soap", "country": "sweden", "quantity": 5}
        ]
    }
    try:
        response = session.post(url, json=payload)
        response.raise_for_status()
        print("Bill created successfully:", response.json())
    except requests.exceptions.RequestException as e:
        print(f"Error creating bill: {e}")

def check_low_stock(session, user_id):
    """Checks for low-stock items."""
    url = f"{BASE_URL}/low-stock/{user_id}?threshold=20"
    try:
        response = session.get(url)
        response.raise_for_status()
        print("Low stock check performed successfully:", response.json())
    except requests.exceptions.RequestException as e:
        print(f"Error checking low stock: {e}")

def place_restock_order(session, user_id):
    """Places a restock order."""
    url = f"{BASE_URL}/restock-order"
    payload = {
        "userId": user_id,
        "city": "stockholm",
        "order_items": [
            {"product_name": "lotion", "quantity": 50}
        ]
    }
    try:
        response = session.post(url, json=payload)
        response.raise_for_status()
        print("Restock order placed successfully:", response.json())
    except requests.exceptions.RequestException as e:
        print(f"Error placing restock order: {e}")


if __name__ == "__main__":
    session = requests.Session()
    
    print("--- 1. Creating Retailer ---")
    user_id = create_retailer(session)
    
    if user_id:
        print("\n--- 2. Adding Inventory ---")
        add_inventory(session, user_id)
        
        print("\n--- 3. Adding Delivery Agent ---")
        add_delivery_agent(session, user_id)
        
        print("\n--- 4. Adding Distributor ---")
        add_distributor(session)
        
        print("\n--- 5. Getting Inventory ---")
        get_inventory(session, user_id)
        
        print("\n--- 6. Performing Forecast ---")
        perform_forecast(session)
        
        print("\n--- 7. Creating Bill ---")
        create_bill(session, user_id)
        
        print("\n--- 8. Checking Low Stock ---")
        check_low_stock(session, user_id)
        
        print("\n--- 9. Placing Restock Order ---")
        place_restock_order(session, user_id)
        
        print("\n--- API requests simulation completed. ---")
