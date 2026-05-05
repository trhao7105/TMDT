from app.database import SessionLocal
from app.models.all_models import RentalOrders, RentalOrderItems

db = SessionLocal()
order = db.query(RentalOrders).filter(RentalOrders.order_code == 'ORD-184C2186').first()
if order:
    # Double check no items
    items = db.query(RentalOrderItems).filter(RentalOrderItems.order_id == order.order_id).all()
    if not items:
        print(f"Deleting corrupted order {order.order_code} (ID: {order.order_id})")
        db.delete(order)
        db.commit()
    else:
        print(f"Order {order.order_code} has items, not deleting.")
else:
    print("Corrupted order not found.")
