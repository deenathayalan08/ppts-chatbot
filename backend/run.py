# backend/run.py
import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import generate, upload, edit

app = FastAPI(title="PPT Chatbot API")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routers
app.include_router(generate.router, prefix="/generate", tags=["Generate"])
app.include_router(upload.router, prefix="/upload", tags=["Upload"])
app.include_router(edit.router, prefix="/edit", tags=["Edit"])

@app.get("/")
def home():
    return {"message": "PPT Chatbot Backend is running 🚀"}

if __name__ == "__main__":
    uvicorn.run(
        "run:app",
        host="127.0.0.1",
        port=8000,
        reload=True
    )
