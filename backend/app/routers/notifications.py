from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from ..database import get_db
from ..models.all_models import Notifications, Users
from ..services.security import get_current_user_obj
from pydantic import BaseModel
from datetime import datetime

class NotificationOut(BaseModel):
    notification_id: int
    notification_type: str
    title: str
    content: str
    is_read: bool
    created_at: datetime
    order_id: int | None = None
    rental_id: int | None = None

    class Config:
        from_attributes = True

router = APIRouter(
    prefix="/api/notifications",
    tags=["Notifications"]
)

@router.get("", response_model=List[NotificationOut])
def get_user_notifications(
    db: Session = Depends(get_db),
    current_user: Users = Depends(get_current_user_obj)
):
    """Get all notifications for the current user."""
    notifications = db.query(Notifications).filter(
        Notifications.user_id == current_user.user_id
    ).order_by(Notifications.created_at.desc()).limit(50).all()
    return notifications

@router.post("/{notification_id}/read")
def mark_as_read(
    notification_id: int,
    db: Session = Depends(get_db),
    current_user: Users = Depends(get_current_user_obj)
):
    """Mark a notification as read."""
    notification = db.query(Notifications).filter(
        Notifications.notification_id == notification_id,
        Notifications.user_id == current_user.user_id
    ).first()
    
    if not notification:
        raise HTTPException(status_code=404, detail="Notification not found")
        
    notification.is_read = True
    db.commit()
    return {"status": "success"}

@router.post("/read-all")
def mark_all_as_read(
    db: Session = Depends(get_db),
    current_user: Users = Depends(get_current_user_obj)
):
    """Mark all notifications as read."""
    db.query(Notifications).filter(
        Notifications.user_id == current_user.user_id,
        Notifications.is_read == False
    ).update({"is_read": True})
    db.commit()
    return {"status": "success"}
