from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .database import engine, Base
from .models.user import User
from .routers import auth

# Initialize the database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="iClocker Backend API")

# Configure CORS for the frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Root endpoint
@app.get("/")
def read_root():
    return {"message": "Welcome to iClocker API System"}

# Include routers
app.include_router(auth.router)
