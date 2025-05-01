import mysql.connector
import os
import time
from models import Truth

def get_connection():
    for _ in range(10):
        try:
            return mysql.connector.connect(
                host=os.getenv("DB_HOST"),
                port=int(os.getenv("DB_PORT", 3306)),
                user=os.getenv("DB_USER"),
                password=os.getenv("DB_PASSWORD"),
                database=os.getenv("DB_NAME")
            )
        except mysql.connector.Error as err:
            print(f"[!] DB not ready yet: {err}")
            time.sleep(3)
    raise Exception("Could not connect to DB after 10 tries")

def insert_truth(truth: Truth):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("""
        INSERT IGNORE INTO truths (url, content, timestamp)
        VALUES (%s, %s, %s)
    """, (truth.href, truth.content, truth.timestamp))
    conn.commit()
    cursor.close()
    conn.close()

def get_last_scraped_href_and_time():
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT last_href, last_scraped_time FROM scraper_state WHERE id = 1")
    row = cursor.fetchone()
    cursor.close()
    conn.close()
    return row if row else (None, None)

def insert_truths(truths: list[Truth]):
    if not truths:
        return
    
    # Reverse to ensure newest truths is last inserted
    truths.reverse()

    conn = get_connection()
    cursor = conn.cursor()

    data = [(t.href, t.content, t.timestamp) for t in truths]
    cursor.executemany("""
                       INSERT IGNORE INTO truths (url, content, timestamp)
                       VALUES (%s, %s, %s)
                       """, data)
    conn.commit()
    cursor.close()
    conn.close()


def update_last_scraped_href_and_time(href, timestamp):
    conn = get_connection()
    cursor = conn.cursor()
    timestamp = timestamp.replace(second=0, microsecond=0)
    cursor.execute("""
        INSERT INTO scraper_state (id, last_href, last_scraped_time)
        VALUES (1, %s, %s)
        ON DUPLICATE KEY UPDATE
            last_href = VALUES(last_href),
            last_scraped_time = VALUES(last_scraped_time)
    """, (href, timestamp))
    conn.commit()
    cursor.close()
    conn.close()

def get_truths_count():
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT COUNT(*) FROM truths")
    count = cursor.fetchone()[0]
    cursor.close()
    conn.close()
    return count

def get_all_truths():
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT url,content,timestamp FROM truths ORDER BY timestamp DESC")
    rows = cursor.fetchall()
    cursor.close()
    conn.close()
    return [Truth(href=row[0], content=row[1], timestamp=row[2]) for row in rows]

