from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from database import engine
from database import Base
from sqlalchemy import inspect
from sqlalchemy import text

import models
from seed_dishes import seed_dishes

from routes.dishes import router as dishes_router
from routes.checkout import router as checkout_router
from routes.inventory import router as inventory_router
from routes.auth import router as auth_router
from routes.reservations import router as reservations_router
from seed_inventory import seed_inventory


app = FastAPI(
    title="FoodHive API",
    description="Backend API for the FoodHive food delivery application",
    version="1.0.0"
)

# --------------------------------
# CORS
# --------------------------------

app.add_middleware(
    CORSMiddleware,

    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173"
    ],

    allow_origin_regex=r"https?://(localhost|127\.0\.0\.1):\d+",

    allow_credentials=True,

    allow_methods=["*"],

    allow_headers=["*"]
)


# --------------------------------
# Create database tables
# --------------------------------

Base.metadata.create_all(
    bind=engine
)


def ensure_order_columns():

    inspector = inspect(engine)
    columns = {
        column["name"]
        for column in inspector.get_columns("orders")
    }

    with engine.begin() as connection:
        if "delivery_instructions" not in columns:
            connection.execute(text(
                "ALTER TABLE orders ADD COLUMN delivery_instructions TEXT NULL"
            ))

        if "scheduled_delivery" not in columns:
            connection.execute(text(
                "ALTER TABLE orders ADD COLUMN scheduled_delivery DATETIME NULL"
            ))


ensure_order_columns()
seed_dishes()
seed_inventory()


# --------------------------------
# Register routers

app.include_router(
    dishes_router
)

app.include_router(
    checkout_router
)

app.include_router(
    inventory_router
)

app.include_router(
    auth_router
)

app.include_router(
    reservations_router
)


# --------------------------------
# Home
# --------------------------------

@app.get("/")
def home():

    return {
        "message": "Welcome to FoodHive API"
    }


# --------------------------------
# Health check
# --------------------------------

@app.get("/health")
def health_check():

    return {
        "status": "healthy"
    }