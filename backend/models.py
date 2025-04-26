from dataclasses import dataclass
from datetime import datetime
from typing import Optional

@dataclass
class Truth:
    href: str
    content: Optional[str]
    timestamp: datetime
    is_retruth: bool = False
    media_url: Optional[str] = None