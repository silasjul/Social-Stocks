from bs4 import BeautifulSoup
from datetime import datetime
from models import Truth
from typing import List, Tuple

def parse_truths(pages: List[str], last_href: str, last_time: datetime) -> Tuple[List[Truth], str, datetime]:
    truths = []
    stop = False
    newest_href = last_href
    newest_time = last_time

    for page in pages:
        soup = BeautifulSoup(page, "html.parser")
        links = soup.select('a.status-info__meta-item[href]:not([href="#"])')
        texts = soup.select('div.status__content > p')

        for i in range(len(links)):
            href = links[i]['href']
            text = texts[i].get_text(strip=True) if i < len(texts) else ""
            time_text = links[i].get_text(strip=True)

            try:
                parsed_time = datetime.strptime(time_text, "%B %d, %Y, %I:%M %p")
                rounded = parsed_time.replace(second=0, microsecond=0)
            except:
                continue

            if href == last_href and rounded == last_time:
                stop = True
                print(f"[i] Hit latest truth: {href} @ {parsed_time}")
                break

            truths.append(Truth(href, text, parsed_time))

            if not newest_time or rounded > newest_time:
                newest_time = rounded
                newest_href = href

        if stop:
            print("[i] Stopped since last saved truth is found.")
            break

    return truths, newest_href, newest_time
