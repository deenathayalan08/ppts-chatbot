import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from app.routes import generate, edit, upload  # Absolute imports

app = FastAPI(title="PPT Chatbot Backend")

# Allow CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(generate.router, prefix="")  # direct access to /generate
app.include_router(edit.router, prefix="/edit")
app.include_router(upload.router, prefix="/upload")

# Create and serve static directories
os.makedirs("generated_files", exist_ok=True)
os.makedirs("uploads", exist_ok=True)
app.mount("/generated_files", StaticFiles(directory="generated_files"), name="generated_files")
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

@app.get("/")
def home():
    return {"message": "PPT Chatbot Backend is running successfully 🚀"}
