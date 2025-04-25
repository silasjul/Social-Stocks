import mysql.connector
import os
from dotenv import load_dotenv

# Indlæs miljøvariabler fra .env
load_dotenv()

host = os.getenv("DB_HOST", "localhost")
if host == "db":
    host = "localhost"  # fallback til lokal kørsel

conn = mysql.connector.connect(
    host=host,
    port=int(os.getenv("DB_PORT", 3306)),
    user=os.getenv("DB_USER"),
    password=os.getenv("DB_PASSWORD"),
    database=os.getenv("DB_NAME")
)

cursor = conn.cursor()

print("---- Latest 5 truths ----")
cursor.execute("SELECT url, timestamp FROM truths ORDER BY timestamp DESC LIMIT 5")
for row in cursor.fetchall():
    print(row)

print("---- Amount of truths ----")
cursor.execute("SELECT COUNT(*) FROM truths")
count = cursor.fetchone()[0]
print(count)

print("\n---- Scraper State ----")
cursor.execute("SELECT * FROM scraper_state")
for row in cursor.fetchall():
    print(row)

cursor.close()
conn.close()
