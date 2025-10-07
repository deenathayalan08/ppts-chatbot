from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import generate, upload, edit
import logging

# --- Setup logging ---
logging.basicConfig(level=logging.INFO)

# --- Create FastAPI app ---
app = FastAPI(title="PPT Chatbot API")

# --- CORS (allow frontend) ---
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # adjust in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Include routers ---
app.include_router(generate.router, prefix="/generate", tags=["Generate"])
app.include_router(upload.router, prefix="/upload", tags=["Upload"])
app.include_router(edit.router, prefix="/edit", tags=["Edit"])

# --- Root endpoint ---
@app.get("/")
def root():
    return {"message": "PPT Chatbot Backend is running 🚀"}
