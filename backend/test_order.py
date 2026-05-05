from app.database import SessionLocal
from app.models.all_models import RentalOrders, RentalOrderItems, StorageSizes, Users
from datetime import datetime, timedelta
import uuid

db = SessionLocal()
user = db.query(Users).first()

order_code = f"ORD-{str(uuid.uuid4())[:8].upper()}"
new_order = RentalOrders(
    user_id=user.user_id,
    service_type_id=1,
    location_id=1,
    order_code=order_code,
    order_status='pending_payment',
    total_amount=100000
)
db.add(new_order)
db.commit()
db.refresh(new_order)

try:
    new_item = RentalOrderItems(
        order_id=new_order.order_id,
        unit_id=1,
        size_id=1,
        duration_id=1,
        protection_plan_id=1,
        start_time=datetime.utcnow(),
        end_time=datetime.utcnow() + timedelta(days=30),
        base_price=100000,
        duration_multiplier=1.0,
        storage_fee=100000,
        protection_fee=0
    )
    db.add(new_item)
    db.commit()
    print("Success")
except Exception as e:
    print(f"Error: {e}")
