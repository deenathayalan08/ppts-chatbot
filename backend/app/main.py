from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import generate, upload, edit

app = FastAPI(title="PPT Chatbot API")

# --- CORS setup ---
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Include Routers ---
app.include_router(generate.router, prefix="/generate", tags=["Generate"])
app.include_router(upload.router, prefix="/upload", tags=["Upload"])
app.include_router(edit.router, prefix="/edit", tags=["Edit"])

@app.get("/")
def root():
    return {"message": "PPT Chatbot Backend is Running 🚀"}
