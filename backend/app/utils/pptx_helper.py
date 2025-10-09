from pptx import Presentation
import os

def generate_slide_content(topic: str, slide_number: int):
    """
    Create default content for a slide.
    """
    return {
        "title": f"{topic} - Slide {slide_number}",
        "body": f"Content for slide {slide_number} about {topic}."
    }

def generate_ppt_from_topic(topic: str, num_slides: int = 5, save_path: str = None):
    """
    Generate slide data or full PPT file.
    """
    slides = [generate_slide_content(topic, i+1) for i in range(num_slides)]

    if save_path:
        prs = Presentation()
        for slide in slides:
            slide_layout = prs.slide_layouts[1]
            s = prs.slides.add_slide(slide_layout)
            s.shapes.title.text = slide["title"]
            s.placeholders[1].text = slide["body"]
        prs.save(save_path)
        return save_path

    return slides

def update_slide(filename: str, slide_number: int, title: str, body: str, folder: str = "generated_files"):
    """
    Update a specific slide in an existing PPT file.
    """
    file_path = os.path.join(folder, filename)
    if not os.path.exists(file_path):
        raise FileNotFoundError(f"{filename} not found in {folder}")

    prs = Presentation(file_path)
    if slide_number < 1 or slide_number > len(prs.slides):
        raise ValueError("Invalid slide number")

    slide = prs.slides[slide_number - 1]
    slide.shapes.title.text = title
    slide.placeholders[1].text = body
    prs.save(file_path)
    return file_path
