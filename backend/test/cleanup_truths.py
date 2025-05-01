import mysql.connector
import os
from dotenv import load_dotenv

# Indlæs .env for databaseoplysninger
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

# Før vi sletter, viser vi hvor mange dubletter der er
print("Tjekker for dubletter...")

cursor.execute("""
    SELECT url, timestamp, COUNT(*)
    FROM truths
    GROUP BY url, timestamp
    HAVING COUNT(*) > 1
""")

dupes = cursor.fetchall()
print(f"Antal dublette grupper fundet: {len(dupes)}")

# Slet dubletter (behold den med lavest id)
print("Sletter dubletter...")
cursor.execute("""
    DELETE t1 FROM truths t1
    JOIN truths t2
    ON t1.url = t2.url AND t1.timestamp = t2.timestamp
    WHERE t1.id > t2.id
""")

print(f"{cursor.rowcount} dubletter slettet.")
conn.commit()
cursor.close()
conn.close()
