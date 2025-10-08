import random

def generate_slide_contents(topic: str, num_slides: int = 5):
    """
    Generate simple, local slide content (offline, no external API).
    Each slide will have a generated title and body text.
    """

    titles = [
        "Introduction to",
        "Understanding the Basics of",
        "Key Concepts in",
        "Applications of",
        "Challenges and Future of",
        "Case Study on",
        "Overview of",
        "Advantages of",
        "Disadvantages of",
        "Conclusion on"
    ]

    slide_data = []
    for i in range(num_slides):
        title = f"{random.choice(titles)} {topic}"
        body = (
            f"This slide covers important aspects of {topic.lower()} including its "
            f"background, current developments, and potential impact in the future."
        )
        slide_data.append({"title": title, "body": body})

    return slide_data
