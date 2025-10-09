from fastapi import APIRouter, Query, UploadFile, File
from fastapi.responses import JSONResponse
from app.utils.pptx_helper import generate_ppt_from_topic, update_slide
import os
import uuid

router = APIRouter(prefix="/generate", tags=["Generate PPT"])

OUTPUT_DIR = "generated_files"
UPLOAD_DIR = "uploads"
os.makedirs(OUTPUT_DIR, exist_ok=True)
os.makedirs(UPLOAD_DIR, exist_ok=True)

# --- Generate / Preview PPT ---
@router.post("")
async def generate_ppt(
    topic: str = Query(..., description="Topic for the PPT"),
    slides: int = Query(5, description="Number of slides to generate"),
    preview: bool = Query(True, description="Return preview or actual file"),
):
    try:
        slide_data = generate_ppt_from_topic(topic, num_slides=slides)

        if preview:
            # Return slides as JSON for preview
            return {"slides": slide_data}

        # Save PPT file
        file_id = str(uuid.uuid4())[:8]
        filename = f"{topic.replace(' ', '_')}_{file_id}.pptx"
        file_path = os.path.join(OUTPUT_DIR, filename)
        generate_ppt_from_topic(topic, num_slides=slides, save_path=file_path)

        file_url = f"http://127.0.0.1:8000/generated_files/{filename}"
        return {"file_url": file_url, "filename": filename}

    except Exception as e:
        print(f"Error generating PPT: {e}")
        return JSONResponse(content={"error": str(e)}, status_code=500)

# --- Upload Sample PPT ---
@router.post("/upload")
async def upload_sample_ppt(file: UploadFile = File(...)):
    try:
        file_path = os.path.join(UPLOAD_DIR, file.filename)
        with open(file_path, "wb") as f:
            f.write(await file.read())
        return {"message": "Template uploaded successfully", "filename": file.filename}

    except Exception as e:
        return JSONResponse(content={"error": str(e)}, status_code=500)

# --- Update Slide ---
@router.post("/update_slide")
async def edit_slide_api(
    filename: str = Query(...),
    slide_number: int = Query(...),
    title: str = Query(...),
    text: str = Query(...),
):
    try:
        file_path = update_slide(filename, slide_number, title, text, folder=OUTPUT_DIR)
        return {"message": f"Slide {slide_number} updated successfully!", "file_path": file_path}
    except Exception as e:
        return JSONResponse(content={"error": str(e)}, status_code=500)
