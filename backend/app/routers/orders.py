from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List, Optional, Any
from datetime import datetime, timedelta, timezone
from ..database import get_db
from ..models.all_models import RentalOrders, RentalOrderItems, Users, StorageSizes, DurationOptions, ProtectionPlans, StorageUnits
from ..services.security import get_current_user
import uuid

router = APIRouter(
    prefix="/api/orders",
    tags=["Orders"]
)

class OrderPayload(BaseModel):
    storage_id: str # the size_code
    service_type: str # package or self
    duration_id: str
    protection_plan_id: str
    additional_services: List[dict]
    total_price: float

@router.post("/checkout")
def checkout_order(payload: OrderPayload, db: Session = Depends(get_db), current_user: str = Depends(get_current_user)):
    user = db.query(Users).filter(Users.email == current_user).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
        
    order_code = f"ORD-{str(uuid.uuid4())[:8].upper()}"
    service_type_id = 1 if payload.service_type == "package" else 2
    
    # Resolve size_id first
    size = db.query(StorageSizes).filter(StorageSizes.size_code == payload.storage_id).first()
    if not size:
        raise HTTPException(status_code=400, detail="Storage size not found")
    size_id = size.size_id

    # Find an available unit of this size
    # We use location_id=1 as default for now as per current logic
    unit = db.query(StorageUnits).filter(
        StorageUnits.size_id == size_id,
        StorageUnits.status == 'available',
        StorageUnits.location_id == 1 
    ).first()

    if not unit:
        raise HTTPException(status_code=400, detail="No available units for this size in this location")

    new_order = RentalOrders(
        user_id=user.user_id,
        service_type_id=service_type_id,
        location_id=1, # Default location
        order_code=order_code,
        order_status='pending_payment',
        total_amount=payload.total_price
    )
    
    db.add(new_order)
    db.flush() # Use flush to get order_id
    
    duration_id = int(payload.duration_id) if payload.duration_id.isdigit() else 1
    protection_plan_id = int(payload.protection_plan_id) if payload.protection_plan_id.isdigit() else 1

    # Look up actual duration to compute correct end_time
    duration = db.query(DurationOptions).filter(DurationOptions.duration_id == duration_id).first()
    duration_months = float(duration.duration_months) if duration else 1.0
    duration_multiplier = float(duration.multiplier) if duration else 1.0
    duration_days = int(duration_months * 30.44)

    start_time = datetime.now(timezone.utc)
    end_time = start_time + timedelta(days=duration_days)

    new_item = RentalOrderItems(
        order_id=new_order.order_id,
        unit_id=unit.unit_id, # Use the actual available unit
        size_id=size_id,
        duration_id=duration_id,
        protection_plan_id=protection_plan_id,
        start_time=start_time,
        end_time=end_time,
        base_price=payload.total_price,
        duration_multiplier=duration_multiplier,
        storage_fee=payload.total_price,
        protection_fee=0
    )
    
    # Update unit status to reserved
    unit.status = 'reserved'
    
    db.add(new_item)
    db.commit()
    
    return {
        "status": "success",
        "order_id": new_order.order_id,
        "order_code": new_order.order_code
    }

@router.get("/my-orders")
def get_my_orders(db: Session = Depends(get_db), current_user: str = Depends(get_current_user)):
    user = db.query(Users).filter(Users.email == current_user).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
        
    orders = db.query(RentalOrders).filter(RentalOrders.user_id == user.user_id).order_by(RentalOrders.created_at.desc()).all()
    
    result = []
    for order in orders:
        # Get the first item
        item = db.query(RentalOrderItems).filter(RentalOrderItems.order_id == order.order_id).first()
        
        # Skip incomplete orders to prevent showing N/A
        if not item:
            continue
            
        storage_name = "Kho lưu trữ"
        dimension = "N/A"
        duration_label = "1 tháng"
        protection_name = "Basic"
        
        size = db.query(StorageSizes).filter(StorageSizes.size_id == item.size_id).first()
        if size:
            storage_name = size.size_name
            dimension = f"{size.volume_m3}m³"
            
        duration = db.query(DurationOptions).filter(DurationOptions.duration_id == item.duration_id).first()
        if duration:
            duration_label = duration.duration_name
            
        protection = db.query(ProtectionPlans).filter(ProtectionPlans.protection_plan_id == item.protection_plan_id).first()
        if protection:
            protection_name = protection.plan_name
                
        # Compute actual status based on end_time (more accurate than DB order_status alone)
        now = datetime.now(timezone.utc)
        if order.order_status in ['cancelled', 'failed']:
            computed_status = "cancelled"
        elif item.end_time and item.end_time < now:
            computed_status = "expired"
        elif order.order_status in ['paid', 'active', 'pending_payment']:
            computed_status = "confirmed"
        elif order.order_status == 'completed':
            computed_status = "expired"
        else:
            computed_status = "pending"

        result.append({
            "id": order.order_code,
            "status": computed_status,
            "storage": {
                "name": storage_name,
                "dimension": dimension
            },
            "duration": {
                "label": duration_label
            },
            "protectionPlan": {
                "name": protection_name
            },
            "finalTotal": float(order.total_amount),
            "paymentMethod": "card",
            "createdAt": order.created_at.isoformat(),
            "startTime": item.start_time.isoformat() if item.start_time else None,
            "endTime": item.end_time.isoformat() if item.end_time else None,
        })
        
    return result
