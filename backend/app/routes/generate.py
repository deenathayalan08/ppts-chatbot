from fastapi import APIRouter, UploadFile, Form, Query
from fastapi.responses import JSONResponse
import os
from app.utils.pptx_helper import (
    generate_ppt_from_topic,
    update_slide,
    add_image_to_slide,
    add_video_to_slide
)

router = APIRouter()
GENERATED_FOLDER = "generated_files"
os.makedirs(GENERATED_FOLDER, exist_ok=True)

# --- Generate PPT with preview support ---
@router.post("/generate")
async def generate_ppt(
    topic: str = Query(...),
    slides: int = Query(5),
    theme: str = Query("classic"),
    preview: bool = Query(False),
    audience: str = Query("Beginner"),
    purpose: str = Query("Informative"),
    tone: str = Query("Formal"),
    autoMedia: bool = Query(False)
):
    try:
        file_name = f"{topic.replace(' ', '_')}.pptx"
        save_path = os.path.join(GENERATED_FOLDER, file_name)

        # Generate slide data
        slides_data = generate_ppt_from_topic(
            topic, num_slides=slides, theme=theme, save_path=save_path
        )

        if preview:
            for slide in slides_data:
                slide["media_suggestion"] = "Chart/Image suggestion"  # Placeholder
            return JSONResponse({"slides": slides_data})

        return JSONResponse({
            "message": "PPT generated successfully",
            "file_name": file_name,
            "slides_data": slides_data
        })
    except Exception as e:
        return JSONResponse({"error": str(e)}, status_code=500)


# --- Update slide ---
@router.post("/update-slide")
async def update_slide_content(
    filename: str = Form(...),
    slide_number: int = Form(...),
    title: str = Form(...),
    text: str = Form(...)
):
    try:
        path = update_slide(filename, slide_number, title, text)
        return {"message": "Slide updated successfully", "file_path": path}
    except Exception as e:
        return {"error": str(e)}


# --- Add media ---
@router.post("/add-media")
async def add_media_to_slide(
    filename: str = Form(...),
    slide_number: int = Form(...),
    file: UploadFile = None,
    media_type: str = Form("image")
):
    try:
        if not file:
            return {"error": "No file uploaded"}

        file_path = os.path.join(GENERATED_FOLDER, file.filename)
        with open(file_path, "wb") as f:
            f.write(await file.read())

        if media_type.lower() == "video":
            updated_path = add_video_to_slide(filename, slide_number, file_path)
        else:
            updated_path = add_image_to_slide(filename, slide_number, file_path)

        return {"message": f"{media_type.capitalize()} added successfully", "file_path": updated_path}
    except Exception as e:
        return {"error": str(e)}
