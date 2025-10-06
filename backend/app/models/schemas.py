from pydantic import BaseModel
from typing import List, Optional

class Slide(BaseModel):
    title: str
    body: str

class PPTRequest(BaseModel):
    topic: str
    slides: Optional[List[Slide]] = None
