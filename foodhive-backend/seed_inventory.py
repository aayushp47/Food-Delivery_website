from database import SessionLocal
from models import InventoryItem


STARTER_INVENTORY = [
    {"item": "Tomatoes", "category": "Vegetables", "stock": 142, "unit": "kg", "reorder_level": 60, "supplier": "Fresh Valley Farms", "status": "Healthy"},
    {"item": "Onions", "category": "Vegetables", "stock": 84, "unit": "kg", "reorder_level": 65, "supplier": "North Market Co.", "status": "Watch"},
    {"item": "Potatoes", "category": "Vegetables", "stock": 48, "unit": "kg", "reorder_level": 70, "supplier": "Harvest Link", "status": "Low"},
    {"item": "Fresh Milk", "category": "Dairy", "stock": 28, "unit": "litres", "reorder_level": 35, "supplier": "Sunrise Dairy", "status": "Low"},
    {"item": "Paneer", "category": "Dairy", "stock": 36, "unit": "kg", "reorder_level": 25, "supplier": "Sunrise Dairy", "status": "Healthy"},
    {"item": "Red Chili", "category": "Spices", "stock": 15, "unit": "kg", "reorder_level": 20, "supplier": "Spice Hub", "status": "Low"},
    {"item": "Turmeric", "category": "Spices", "stock": 26, "unit": "kg", "reorder_level": 18, "supplier": "Spice Hub", "status": "Healthy"},
    {"item": "Rice", "category": "Grains", "stock": 110, "unit": "kg", "reorder_level": 90, "supplier": "A1 Grain Supply", "status": "Healthy"},
    {"item": "Flour", "category": "Grains", "stock": 62, "unit": "kg", "reorder_level": 55, "supplier": "A1 Grain Supply", "status": "Watch"},
    {"item": "Coriander", "category": "Herbs", "stock": 12, "unit": "bunches", "reorder_level": 20, "supplier": "Green Basket", "status": "Low"},
    {"item": "Chicken", "category": "Proteins", "stock": 34, "unit": "kg", "reorder_level": 40, "supplier": "Metro Meats", "status": "Watch"},
    {"item": "Butter", "category": "Dairy", "stock": 17, "unit": "kg", "reorder_level": 25, "supplier": "Sunrise Dairy", "status": "Low"},
]


def seed_inventory():

    db = SessionLocal()

    try:
        if db.query(InventoryItem).count() == 0:
            db.add_all(InventoryItem(**item) for item in STARTER_INVENTORY)
            db.commit()
    finally:
        db.close()