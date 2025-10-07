import uvicorn
from app.main import app

if __name__ == "__main__":
    uvicorn.run(
        "app.main:app",  # app instance inside main.py
        host="127.0.0.1",
        port=8000,
        reload=True
    )
