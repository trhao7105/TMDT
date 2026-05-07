"""
Cleanup script: Delete all old incorrect rental order data.
Usage: python cleanup_orders.py
"""
import os
from dotenv import load_dotenv
from sqlalchemy import create_engine, text

load_dotenv()
DATABASE_URL = os.getenv("DATABASE_URL")

engine = create_engine(DATABASE_URL, connect_args={
    "keepalives": 1,
    "keepalives_idle": 60,
    "connect_timeout": 10,
})

# Delete in FK dependency order (children first, parents last)
DELETE_STEPS = [
    ("unit_access_logs",     "DELETE FROM unit_access_logs"),
    ("access_credentials",   "DELETE FROM access_credentials"),
    ("support_messages",     "DELETE FROM support_messages"),
    ("support_tickets",      "DELETE FROM support_tickets"),
    ("notifications",        "DELETE FROM notifications"),
    ("payment_webhooks",     "DELETE FROM payment_webhooks"),
    ("payments",             "DELETE FROM payments"),
    ("order_addons",         "DELETE FROM order_addons"),
    ("rentals",              "DELETE FROM rentals"),
    ("rental_order_items",   "DELETE FROM rental_order_items"),
    ("rental_orders",        "DELETE FROM rental_orders"),
]

with engine.begin() as conn:
    print("=== STARTING CLEANUP ===\n")
    total = 0
    for label, sql in DELETE_STEPS:
        result = conn.execute(text(sql))
        count = result.rowcount
        total += count
        print(f"  [{label}] Deleted {count} rows")
    print(f"\n=== DONE: {total} total rows deleted ===")
    print("Config data (sizes, durations, protections, locations) kept intact.")
