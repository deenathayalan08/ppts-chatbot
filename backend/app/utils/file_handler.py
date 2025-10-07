import os
from fastapi import UploadFile
from app.config import UPLOAD_FOLDER

os.makedirs(UPLOAD_FOLDER, exist_ok=True)

async def save_file(file: UploadFile) -> str:
    file_path = os.path.join(UPLOAD_FOLDER, file.filename)
    with open(file_path, "wb") as f:
        f.write(await file.read())
    return file_path
