from fastapi import APIRouter, Query, UploadFile, File
from fastapi.responses import JSONResponse
from app.utils.pptx_helper import generate_ppt_from_topic
import os
import uuid

router = APIRouter(prefix="/generate", tags=["Generate PPT"])

OUTPUT_DIR = "generated_files"
os.makedirs(OUTPUT_DIR, exist_ok=True)


@router.post("")  # No trailing slash for consistency
async def generate_ppt(
    topic: str = Query(..., description="Topic for the PPT"),
    slides: int = Query(5, description="Number of slides to generate"),
    preview: bool = Query(True, description="Return preview or actual file"),
):
    try:
        # Generate slide content
        slide_data = generate_ppt_from_topic(topic, num_slides=slides)

        if preview:
            return {"slides": slide_data}

        # Save final PPT
        file_id = str(uuid.uuid4())[:8]
        filename = f"{topic.replace(' ', '_')}_{file_id}.pptx"
        file_path = os.path.join(OUTPUT_DIR, filename)

        generate_ppt_from_topic(topic, num_slides=slides, save_path=file_path)

        file_url = f"http://127.0.0.1:8000/generated_files/{filename}"
        return {"file_url": file_url}

    except Exception as e:
        print(f"Error generating PPT: {e}")
        return JSONResponse(content={"error": str(e)}, status_code=500)


@router.post("/upload")
async def upload_sample_ppt(file: UploadFile = File(...)):
    try:
        UPLOAD_DIR = "uploads"
        os.makedirs(UPLOAD_DIR, exist_ok=True)

        file_path = os.path.join(UPLOAD_DIR, file.filename)
        with open(file_path, "wb") as f:
            f.write(await file.read())

        return {"message": "Template uploaded successfully", "filename": file.filename}

    except Exception as e:
        return JSONResponse(content={"error": str(e)}, status_code=500)
