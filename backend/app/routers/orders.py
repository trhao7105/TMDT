from fastapi import APIRouter, Depends, HTTPException, status, Request
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List, Optional, Any
from datetime import datetime, timedelta, timezone
from ..database import get_db
from ..models.all_models import RentalOrders, RentalOrderItems, Users, StorageSizes, DurationOptions, ProtectionPlans, StorageUnits, Locations
from ..services.security import get_current_user
import uuid
import stripe
import os
import httpx
from dotenv import load_dotenv

load_dotenv()
stripe.api_key = os.getenv("STRIPE_SECRET_KEY")
endpoint_secret = os.getenv("STRIPE_WEBHOOK_SECRET")

# SePay Config
SEPAY_BANK_ID = os.getenv("SEPAY_BANK_ID", "MB")
SEPAY_ACCOUNT_NO = os.getenv("SEPAY_ACCOUNT_NO", "123456789")
SEPAY_ACCOUNT_NAME = os.getenv("SEPAY_ACCOUNT_NAME", "ILOCKER STORAGE")
SEPAY_WEBHOOK_TOKEN = os.getenv("SEPAY_WEBHOOK_TOKEN", "default_token")

router = APIRouter(
    prefix="/api/orders",
    tags=["Orders"]
)

class OrderPayload(BaseModel):
    storage_id: str # the size_code
    location_id: int
    service_type: str # package or self
    duration_id: str
    protection_plan_id: str
    additional_services: List[str]
    total_price: float
    payment_method: Optional[str] = "card"

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

    location_id = int(payload.location_id) if payload.location_id.isdigit() else 1
    
    # Find an available unit of this size
    unit = db.query(StorageUnits).filter(
        StorageUnits.size_id == size_id,
        StorageUnits.status == 'available',
        StorageUnits.location_id == location_id 
    ).first()

    if not unit:
        raise HTTPException(status_code=400, detail="No available units for this size in this location")

    new_order = RentalOrders(
        user_id=user.user_id,
        service_type_id=service_type_id,
        location_id=location_id,
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
    duration_label = duration.duration_name if duration else "1 tháng"
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
    
    # 1. STRIPE PAYMENT
    if payload.payment_method == "card":
        try:
            checkout_session = stripe.checkout.Session.create(
                payment_method_types=['card'],
                line_items=[
                    {
                        'price_data': {
                            'currency': 'vnd',
                            'product_data': {
                                'name': f"Thuê kho iLocker - {size.size_name}",
                                'description': f"Thời hạn: {duration_label}",
                            },
                            'unit_amount': int(payload.total_price),
                        },
                        'quantity': 1,
                    },
                ],
                mode='payment',
                success_url='http://localhost:5173/dashboard?payment=success',
                cancel_url='http://localhost:5173/checkout?payment=cancel',
                client_reference_id=order_code,
                customer_email=current_user,
            )
            
            db.commit()
            
            return {
                "status": "success",
                "payment_method": "stripe",
                "order_code": new_order.order_code,
                "checkout_url": checkout_session.url
            }
        except Exception as e:
            db.rollback()
            raise HTTPException(status_code=500, detail=f"Stripe error: {str(e)}")

    # 2. SEPAY PAYMENT (VietQR)
    elif payload.payment_method == "sepay":
        # Generate VietQR URL
        # Format: https://img.vietqr.io/image/<BANK_ID>-<ACCOUNT_NO>-<TEMPLATE>.png?amount=<AMOUNT>&addInfo=<DESCRIPTION>&accountName=<ACCOUNT_NAME>
        description = f"ILOCKER {order_code}"
        qr_url = f"https://img.vietqr.io/image/{SEPAY_BANK_ID}-{SEPAY_ACCOUNT_NO}-compact2.png?amount={int(payload.total_price)}&addInfo={description}&accountName={SEPAY_ACCOUNT_NAME}"
        
        db.commit()
        
        return {
            "status": "success",
            "payment_method": "sepay",
            "order_code": new_order.order_code,
            "qr_url": qr_url,
            "description": description,
            "bank_name": SEPAY_BANK_ID,
            "account_no": SEPAY_ACCOUNT_NO,
            "account_name": SEPAY_ACCOUNT_NAME,
            "amount": payload.total_price
        }

    else:
        db.commit()
        return {
            "status": "success",
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

        # Get unit and location info
        unit_code = "N/A"
        access_pin = "N/A"
        location_name = "N/A"
        location_address = "N/A"
        
        unit = db.query(StorageUnits).filter(StorageUnits.unit_id == item.unit_id).first()
        if unit:
            unit_code = unit.unit_code
            # Mock an access pin if not exists in DB (or use unit_code as base)
            access_pin = f"PIN-{unit.unit_id:04d}"
            
        location = db.query(Locations).filter(Locations.location_id == order.location_id).first()
        if location:
            location_name = location.location_name
            location_address = location.address

        result.append({
            "id": order.order_code,
            "status": computed_status,
            "storage": {
                "name": storage_name,
                "dimension": dimension,
                "unit_code": unit_code,
                "access_pin": access_pin
            },
            "location": {
                "name": location_name,
                "address": location_address
            },
            "duration": {
                "id": str(item.duration_id),
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

class ExtendPayload(BaseModel):
    duration_id: str
    extra_price: float

@router.post("/{order_code}/extend")
def extend_rental(order_code: str, payload: ExtendPayload, db: Session = Depends(get_db), current_user: str = Depends(get_current_user)):
    user = db.query(Users).filter(Users.email == current_user).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
        
    order = db.query(RentalOrders).filter(RentalOrders.order_code == order_code, RentalOrders.user_id == user.user_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
        
    item = db.query(RentalOrderItems).filter(RentalOrderItems.order_id == order.order_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Order item not found")
        
    duration_id = int(payload.duration_id) if payload.duration_id.isdigit() else 1
    duration = db.query(DurationOptions).filter(DurationOptions.duration_id == duration_id).first()
    if not duration:
        raise HTTPException(status_code=400, detail="Invalid duration")
        
    # Calculate new end time
    duration_months = float(duration.duration_months)
    duration_days = int(duration_months * 30.44)
    
    if item.end_time:
        item.end_time = item.end_time + timedelta(days=duration_days)
    else:
        item.end_time = datetime.now(timezone.utc) + timedelta(days=duration_days)
        
    # Update total amount
    order.total_amount += payload.extra_price
    
    db.commit()
    
    return {"status": "success", "new_end_time": item.end_time.isoformat()}

@router.post("/webhook")
async def stripe_webhook(request: Request, db: Session = Depends(get_db)):
    payload = await request.body()
    sig_header = request.headers.get("stripe-signature")
    event = None

    try:
        event = stripe.Webhook.construct_event(
            payload, sig_header, endpoint_secret
        )
    except ValueError as e:
        # Invalid payload
        raise HTTPException(status_code=400, detail="Invalid payload")
    except stripe.error.SignatureVerificationError as e:
        # Invalid signature
        raise HTTPException(status_code=400, detail="Invalid signature")

    # Handle the checkout.session.completed event
    if event['type'] == 'checkout.session.completed':
        session = event['data']['object']
        order_code = session.get('client_reference_id')
        
        if order_code:
            order = db.query(RentalOrders).filter(RentalOrders.order_code == order_code).first()
            if order:
                order.order_status = 'paid'
                db.commit()
                print(f"✅ Order {order_code} marked as PAID via webhook")

    return {"status": "success"}

@router.post("/webhook/sepay")
async def sepay_webhook(request: Request, db: Session = Depends(get_db)):
    # SePay sends data as a standard JSON payload
    data = await request.json()
    
    # In production, verify SEPAY_WEBHOOK_TOKEN in headers or query
    # if request.headers.get("Authorization") != f"Bearer {SEPAY_WEBHOOK_TOKEN}":
    #     raise HTTPException(status_code=401, detail="Unauthorized")

    content = data.get("content", "")
    amount = data.get("transferAmount", 0)
    
    # Try to find order code in content (e.g. "ILOCKER ORD-123456")
    import re
    match = re.search(r"ORD-[A-Z0-9]+", content)
    
    if match:
        order_code = match.group(0)
        order = db.query(RentalOrders).filter(RentalOrders.order_code == order_code).first()
        
        if order:
            # Optionally check amount
            # if float(amount) >= float(order.total_amount):
            order.order_status = 'paid'
            db.commit()
            print(f"✅ Order {order_code} marked as PAID via SePay webhook")
            
    return {"status": "success"}
