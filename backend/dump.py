from app.database import SessionLocal
from app.models.all_models import RentalOrders, RentalOrderItems, StorageSizes

db = SessionLocal()
orders = db.query(RentalOrders).all()
print("Orders:")
for o in orders:
    items = db.query(RentalOrderItems).filter(RentalOrderItems.order_id == o.order_id).all()
    print(f"Order ID: {o.order_id}, Code: {o.order_code}, Items count: {len(items)}")
    for i in items:
        size = db.query(StorageSizes).filter(StorageSizes.size_id == i.size_id).first()
        print(f"  Item ID: {i.item_id}, Size ID: {i.size_id}, Size: {size.size_name if size else 'None'}, Volume: {size.volume_m3 if size else 'None'}")
