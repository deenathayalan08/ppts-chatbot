from fastapi import APIRouter, HTTPException, Query
from fastapi.responses import FileResponse, JSONResponse
from pptx import Presentation
import os
from app.config import UPLOAD_FOLDER
from app.models.ai_model import generate_slide_contents  # dummy AI

router = APIRouter()

@router.post("/")
async def generate_ppt(topic: str = Query(...), preview: bool = Query(True)):
    try:
        slides_data = generate_slide_contents(topic)  # Returns list of dicts

        if preview:
            return JSONResponse(content={"slides": slides_data})

        # Create actual PPT
        prs = Presentation()
        for slide_content in slides_data:
            slide = prs.slides.add_slide(prs.slide_layouts[1])
            slide.shapes.title.text = slide_content["title"]
            slide.placeholders[1].text = slide_content["body"]

        safe_topic = "".join(c if c.isalnum() else "_" for c in topic).lower()
        filename = f"{safe_topic}.pptx"
        filepath = os.path.join(UPLOAD_FOLDER, filename)
        prs.save(filepath)

        return FileResponse(filepath, filename=filename)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
