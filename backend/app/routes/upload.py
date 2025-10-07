from fastapi import APIRouter, UploadFile, File, HTTPException
import os
import shutil
from app.config import UPLOAD_FOLDER

router = APIRouter()

@router.post("/")
async def upload_file(file: UploadFile = File(...)):
    if not file.filename:
        raise HTTPException(status_code=400, detail="No file uploaded")

    file_location = os.path.join(UPLOAD_FOLDER, file.filename)
    try:
        with open(file_location, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error saving file: {str(e)}")

    return {"filename": file.filename, "message": "File uploaded successfully!"}
