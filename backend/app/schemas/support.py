from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class SupportMessageCreate(BaseModel):
    message_content: str

class SupportMessageOut(BaseModel):
    message_id: int
    ticket_id: int
    sender_id: int
    message_content: str
    created_at: datetime

    class Config:
        from_attributes = True

class SupportTicketCreate(BaseModel):
    subject: str
    category: str
    priority: Optional[str] = "normal"

class SupportTicketOut(BaseModel):
    ticket_id: int
    user_id: int
    subject: str
    category: str
    priority: str
    ticket_status: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class SupportTicketWithMessagesOut(SupportTicketOut):
    support_messages: List[SupportMessageOut] = []

    class Config:
        from_attributes = True
