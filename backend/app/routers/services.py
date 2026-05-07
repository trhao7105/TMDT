from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List, Dict, Any
from ..database import get_db
from ..models.all_models import StorageSizes, ServiceTypes, DurationOptions, ProtectionPlans, AddonServices, StorageUnits

router = APIRouter(
    prefix="/api/services",
    tags=["Services"]
)

@router.get("/sizes")
def get_storage_sizes(db: Session = Depends(get_db)):
    sizes = db.query(StorageSizes, ServiceTypes).join(ServiceTypes).filter(StorageSizes.status == 'active').all()
    
    # Count available units per size
    available_counts = dict(
        db.query(StorageUnits.size_id, func.count(StorageUnits.unit_id))
        .filter(StorageUnits.status == 'available')
        .group_by(StorageUnits.size_id)
        .all()
    )
    
    package_storages = []
    self_storages = []
    
    for size, service in sizes:
        features = []
        if service.service_code == 'FULL_SERVICE':
            features = [
                "Đóng gói & vận chuyển chuyên nghiệp",
                "Lưu trữ trong kho hiện đại",
                "Giao trả hàng hóa theo nhu cầu",
                "Kiểm soát nhiệt độ & độ ẩm",
            ]
        elif service.service_code == 'SELF_STORAGE':
            features = [
                "Truy cập vào kho 24/7",
                "Tủ đựng đồ riêng biệt",
                "Được bảo vệ chuyên nghiệp",
                "Hàng hóa khách tự mang đến",
            ]
        else:
            features = ["Truy cập 24/7", "Bảo mật cao"]
            
        data = {
            "id": size.size_code,
            "name": size.size_name,
            "dimension": f"{size.volume_m3}m³",
            "description": size.description or "",
            "price": float(size.base_price),
            "features": features,
            "popular": size.size_code in ['S', '3M3'],
            "availableUnits": available_counts.get(size.size_id, 0)
        }
        
        if service.service_code == 'FULL_SERVICE':
            package_storages.append(data)
        elif service.service_code == 'SELF_STORAGE':
            self_storages.append(data)
            
    return {
        "packageStorages": package_storages,
        "selfStorages": self_storages
    }

@router.get("/options")
def get_service_options(db: Session = Depends(get_db)):
    durations = db.query(DurationOptions).filter(DurationOptions.status == 'active').all()
    duration_options = [
        {
            "id": str(d.duration_id),
            "label": d.duration_name,
            "value": float(d.duration_months),
            "multiplier": float(d.multiplier),
            "popular": d.duration_months == 1
        }
        for d in durations
    ]
    
    protections = db.query(ProtectionPlans).filter(ProtectionPlans.status == 'active').all()
    protection_plans = [
        {
            "id": str(p.protection_plan_id),
            "name": p.plan_name,
            "price": float(p.monthly_price),
            "features": p.coverage_description.split("\n") if p.coverage_description else [],
            "popular": "Silver" in p.plan_name
        }
        for p in protections
    ]
    
    addons = db.query(AddonServices).filter(AddonServices.status == 'active').all()
    additional_services = [
        {
            "id": str(a.addon_id),
            "name": a.addon_name,
            "description": a.description or "",
            "basePrice": float(a.base_price),
            "unit": a.unit_name or "đơn vị",
            "requiresInput": a.pricing_type != 'fixed',
            "inputLabel": "Số lượng" if a.pricing_type == 'per_box' else "Khoảng cách (km)",
            "inputUnit": f"{float(a.extra_price)}đ" if a.extra_price else ""
        }
        for a in addons
    ]
    
    return {
        "durationOptions": duration_options,
        "protectionPlans": protection_plans,
        "additionalServices": additional_services
    }
