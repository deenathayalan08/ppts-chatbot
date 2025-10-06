from fastapi import APIRouter, UploadFile, File, HTTPException
from fastapi.responses import FileResponse
from pptx import Presentation
import shutil
import os

router = APIRouter()

EDIT_DIR = os.path.join(os.getcwd(), "uploads")
os.makedirs(EDIT_DIR, exist_ok=True)

@router.post("/download/")
async def download_edited_ppt(file: UploadFile = File(...)):
    if not file.filename:
        raise HTTPException(status_code=400, detail="No file uploaded")

    # Save uploaded file temporarily
    file_path = os.path.join(EDIT_DIR, file.filename)
    with open(file_path, "wb") as f:
        shutil.copyfileobj(file.file, f)

    # Return the file as response
    return FileResponse(file_path, filename=file.filename)
