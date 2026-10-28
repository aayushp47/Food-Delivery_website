from database import SessionLocal
import models

DISHES = [
    {"name": "Grand Veg Combo", "price": 399, "description": "Paneer tikka, veg biryani, naan and a refreshing beverage.", "image": "/images/grand-combo.jpeg", "type": "veg", "category": "Combos"},
    {"name": "Royal Chicken Combo", "price": 499, "description": "Chicken tikka, chicken biryani, butter naan and a beverage.", "image": "/images/chicken-combo.jpeg", "type": "nonveg", "category": "Combos"},
    {"name": "Paneer Tikka", "price": 249, "description": "Soft paneer marinated with aromatic spices and grilled to perfection.", "image": "/images/paneer-tikka.jpeg", "type": "veg", "category": "Starters"},
    {"name": "Chicken Tikka", "price": 319, "description": "Juicy chicken pieces marinated with Indian spices and grilled.", "image": "/images/chicken-tikka.jpeg", "type": "nonveg", "category": "Starters"},
    {"name": "Veg Manchurian", "price": 219, "description": "Crispy vegetable balls tossed in a spicy Indo-Chinese sauce.", "image": "/images/veg-manchurian.jpeg", "type": "veg", "category": "Starters"},
    {"name": "Paneer Butter Masala", "price": 289, "description": "Creamy tomato gravy with soft paneer and aromatic Indian spices.", "image": "/images/paneer-butter.jpeg", "type": "veg", "category": "Main Course"},
    {"name": "Butter Chicken", "price": 349, "description": "Tender chicken cooked in a rich and creamy tomato gravy.", "image": "/images/butter-chicken.jpeg", "type": "nonveg", "category": "Main Course"},
    {"name": "Veg Biryani", "price": 229, "description": "Aromatic basmati rice cooked with fresh vegetables and spices.", "image": "/images/veg-biryani.jpeg", "type": "veg", "category": "Biryani"},
    {"name": "Chicken Biryani", "price": 329, "description": "Fragrant basmati rice layered with spiced chicken and saffron.", "image": "/images/chicken-biryani.jpeg", "type": "nonveg", "category": "Biryani"},
    {"name": "Margherita Pizza", "price": 249, "description": "Classic pizza topped with tomato sauce, mozzarella and herbs.", "image": "/images/margherita-pizza.jpeg", "type": "veg", "category": "Pizzas"},
    {"name": "Farmhouse Pizza", "price": 329, "description": "Loaded with fresh vegetables, mozzarella and Italian herbs.", "image": "/images/farmhouse-pizza.jpeg", "type": "veg", "category": "Pizzas"},
    {"name": "Chocolate Brownie", "price": 160, "description": "Warm chocolate brownie served with vanilla ice cream.", "image": "/images/brownie.jpeg", "type": "veg", "category": "Desserts"},
    {"name": "Gulab Jamun", "price": 120, "description": "Soft and warm gulab jamuns served with sweet syrup.", "image": "/images/gulab-jamun.jpeg", "type": "veg", "category": "Desserts"},
    {"name": "Fresh Lime Soda", "price": 99, "description": "Refreshing lime soda with a perfect balance of sweet and tangy.", "image": "/images/lime-soda.jpeg", "type": "veg", "category": "Beverages"},
    {"name": "Cold Coffee", "price": 149, "description": "Chilled creamy coffee topped with a light layer of foam.", "image": "/images/cold-coffee.jpeg", "type": "veg", "category": "Beverages"},
]


def seed_dishes():
    db = SessionLocal()
    try:
        if db.query(models.Dish).count() > 0:
            print("Dishes already exist; nothing was changed.")
            return
        db.add_all(models.Dish(**dish) for dish in DISHES)
        db.commit()
        print(f"Restored {len(DISHES)} dishes.")
    finally:
        db.close()


if __name__ == "__main__":
    seed_dishes()
