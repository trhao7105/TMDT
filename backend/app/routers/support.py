from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy.orm import joinedload
from sqlalchemy import func
from typing import List

from ..database import get_db
from ..models.all_models import SupportTickets, SupportMessages, Users
from ..services.security import get_current_user_obj
from ..schemas.support import (
    SupportTicketCreate,
    SupportTicketOut,
    SupportTicketWithMessagesOut,
    SupportMessageCreate,
    SupportMessageOut
)

router = APIRouter(
    prefix="/api/support",
    tags=["Support"]
)

@router.get("/tickets", response_model=List[SupportTicketOut])
def get_user_tickets(
    db: Session = Depends(get_db),
    current_user: Users = Depends(get_current_user_obj)
):
    """Get all support tickets for the current user."""
    tickets = db.query(SupportTickets).filter(SupportTickets.user_id == current_user.user_id).order_by(SupportTickets.created_at.desc()).all()
    return tickets

@router.post("/tickets", response_model=SupportTicketOut)
def create_ticket(
    ticket: SupportTicketCreate,
    db: Session = Depends(get_db),
    current_user: Users = Depends(get_current_user_obj)
):
    """Create a new support ticket."""
    new_ticket = SupportTickets(
        user_id=current_user.user_id,
        subject=ticket.subject,
        category=ticket.category,
        priority=ticket.priority,
        ticket_status='open'
    )
    db.add(new_ticket)
    db.commit()
    db.refresh(new_ticket)
    return new_ticket

@router.get("/tickets/{ticket_id}", response_model=SupportTicketWithMessagesOut)
def get_ticket(
    ticket_id: int,
    db: Session = Depends(get_db),
    current_user: Users = Depends(get_current_user_obj)
):
    """Get a specific ticket with its messages."""
    ticket = db.query(SupportTickets).options(joinedload(SupportTickets.support_messages)).filter(
        SupportTickets.ticket_id == ticket_id,
        SupportTickets.user_id == current_user.user_id
    ).first()
    
    if not ticket:
        raise HTTPException(status_code=404, detail="Ticket not found or unauthorized")
        
    return ticket

@router.post("/tickets/{ticket_id}/messages", response_model=SupportMessageOut)
def add_ticket_message(
    ticket_id: int,
    message: SupportMessageCreate,
    db: Session = Depends(get_db),
    current_user: Users = Depends(get_current_user_obj)
):
    """Add a message to an existing ticket."""
    ticket = db.query(SupportTickets).filter(
        SupportTickets.ticket_id == ticket_id,
        SupportTickets.user_id == current_user.user_id
    ).first()
    
    if not ticket:
        raise HTTPException(status_code=404, detail="Ticket not found or unauthorized")
        
    new_message = SupportMessages(
        ticket_id=ticket.ticket_id,
        sender_id=current_user.user_id,
        message_content=message.message_content
    )
    db.add(new_message)
    
    # Update ticket timestamp or status if needed
    ticket.updated_at = func.current_timestamp()
    
    db.commit()
    db.refresh(new_message)
    return new_message
