def generate_ppt_from_topic(topic: str, num_slides: int = 5, save_path: str = None):
    slides = []
    for i in range(1, num_slides + 1):
        slide_data = {
            "title": f"{topic} - Slide {i}",
            "body": "Generated content here..." 
        }
        slides.append(slide_data)

    if save_path:
        from pptx import Presentation
        prs = Presentation()
        for slide in slides:
            slide_layout = prs.slide_layouts[1]
            slide_obj = prs.slides.add_slide(slide_layout)
            slide_obj.shapes.title.text = slide["title"]
            slide_obj.placeholders[1].text = slide["body"]
        prs.save(save_path)
        return save_path

    return slides
