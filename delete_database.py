import mysql.connector
import os
from dotenv import load_dotenv

load_dotenv()

db_name = os.getenv("DB_NAME")
host = os.getenv("DB_HOST", "localhost")
if host == "db":
    host = "localhost"

confirmation = input(f"⚠️ Dette vil SLETTE hele databasen '{db_name}'. Er du sikker? (ja/nej): ")
if confirmation.lower() != "ja":
    print("Annulleret.")
    exit()

try:
    conn = mysql.connector.connect(
        host=host,
        port=int(os.getenv("DB_PORT", 3306)),
        user=os.getenv("DB_USER"),
        password=os.getenv("DB_PASSWORD")
    )
    cursor = conn.cursor()
    cursor.execute(f"DROP DATABASE IF EXISTS `{db_name}`")
    print(f"✅ Databasen '{db_name}' blev slettet.")
except mysql.connector.Error as err:
    print(f"[!] Fejl: {err}")
finally:
    cursor.close()
    conn.close()
