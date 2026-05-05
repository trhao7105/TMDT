from app.database import SessionLocal
from app.models.all_models import RentalOrders, RentalOrderItems

db = SessionLocal()
order = db.query(RentalOrders).filter(RentalOrders.order_code == 'ORD-184C2186').first()
if order:
    print(f"Order: {order.order_id}, total_amount: {order.total_amount}")
    items = db.query(RentalOrderItems).filter(RentalOrderItems.order_id == order.order_id).all()
    print(f"Items: {items}")
else:
    print("Order not found")
