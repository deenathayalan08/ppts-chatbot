from fastapi import APIRouter, HTTPException
from app.models.schemas import Slide
from pptx import Presentation
import os
from app.config import UPLOAD_FOLDER
import logging

router = APIRouter()

@router.post("/")
async def edit_slide(slide_number: int, text: str, filename: str):
    file_path = os.path.join(UPLOAD_FOLDER, filename)
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="File not found")

    try:
        prs = Presentation(file_path)
        if slide_number < 1 or slide_number > len(prs.slides):
            raise HTTPException(status_code=400, detail="Invalid slide number")
        
        slide = prs.slides[slide_number - 1]
        if slide.shapes.title:
            slide.shapes.title.text = text
        if len(slide.placeholders) > 1:
            slide.placeholders[1].text = text
        
        prs.save(file_path)
        logging.info(f"Slide {slide_number} updated in {filename}")
        return {"message": f"Slide {slide_number} updated successfully!"}
    
    except Exception as e:
        logging.error(f"Error editing slide: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")
