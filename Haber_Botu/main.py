
import os
os.system('pip install feedparser')
import feedparser
import requests
from google import genai
from dotenv import load_dotenv

load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
TELEGRAM_BOT_TOKEN = os.getenv("TELEGRAM_BOT_TOKEN")
TELEGRAM_CHAT_ID = os.getenv("TELEGRAM_CHAT_ID")

if not all([GEMINI_API_KEY, TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID]):
    raise ValueError("Eksik environment variable: GEMINI_API_KEY, TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID")

client = genai.Client(api_key=GEMINI_API_KEY)

def haber_islem():
    kaynak = "https://www.cnnturk.com/feed/66/index.rss"
    headers = {'User-Agent': 'Mozilla/5.0'}
    res = requests.get(kaynak, headers=headers)
    feed = feedparser.parse(res.content)
    if feed.entries:
        baslik = feed.entries[0].title
        prompt = f"Bu haberi kısa özetle: {baslik}"
        ai_res = client.models.generate_content(model='gemini-2.0-flash', contents=prompt)
        requests.post(f"https://api.telegram.org/bot{TELEGRAM_BOT_TOKEN}/sendMessage", 
                      json={"chat_id": TELEGRAM_CHAT_ID, "text": ai_res.text})
haber_islem()
