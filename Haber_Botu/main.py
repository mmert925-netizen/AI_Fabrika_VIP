import feedparser
import newspaper
from newspaper import Article
import nltk
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize, sent_tokenize
import heapq

nltk.download('punkt')
nltk.download('stopwords')


def fetch_news(rss_url):
    """RSS kaynağından haberleri çeker."""
    feed = feedparser.parse(rss_url)
    news_items = []
    for entry in feed.entries:
        news_items.append({
            'title': entry.title,
            'link': entry.link
        })
    return news_items


def summarize_article(url, num_sentences=3):
    """Bir makaleyi özetler."""
    try:
        article = Article(url)
        article.download()
        article.parse()
        article.nlp()
        text = article.text
    except Exception as e:
        print(f"Makale ayrıştırılırken hata: {e}")
        return None

    stopWords = set(stopwords.words("turkish"))
    words = word_tokenize(text)

    freqTable = dict()
    for word in words:
        word = word.lower()
        if word in stopWords:
            continue
        if word in freqTable:
            freqTable[word] += 1
        else:
            freqTable[word] = 1

    sentences = sent_tokenize(text)
    sentenceValue = dict()

    for sentence in sentences:
        for word, freq in freqTable.items():
            if word in sentence.lower():
                if sentence in sentenceValue:
                    sentenceValue[sentence] += freq
                else:
                    sentenceValue[sentence] = freq

    sumValues = 0
    for sentence in sentenceValue:
        sumValues += sentenceValue[sentence]

    average = 0
    if len(sentenceValue) > 0:  # Check for empty dictionary
        average = sumValues / len(sentenceValue)

    summary = ''
    for sentence in sentences:
        if (sentence in sentenceValue) and (sentenceValue[sentence] > (1.2 * average)):
            summary += " " + sentence

    if not summary:  # Eğer yüksek skorlu cümle bulunmadıysa, ilk num_sentences cümleyi al
        summary = " ".join(sentences[:num_sentences]) if len(sentences) > 0 else "Özet bulunamadı."


    return summary


def main():
    """Ana fonksiyon."""
    rss_feeds = [
        "https://www.aa.com.tr/tr/rss/default?cat=guncel", # Anadolu Ajansı Güncel Haberler
        "https://www.haberturk.com/rss/kategori/gundem.xml",  # Habertürk Gündem
        "https://www.sozcu.com.tr/kategori/gundem/feed/"  # Sözcü Gündem
    ]

    print("Son Dakika Haberleri:")

    for rss_url in rss_feeds:
        news_items = fetch_news(rss_url)
        for item in news_items:
            print("-" * 40)
            print(f"Başlık: {item['title']}")
            print(f"Kaynak: {item['link']}")
            summary = summarize_article(item['link'])
            if summary:
                print(f"Özet: {summary}")
            else:
                print("Özet oluşturulamadı.")
            print("-" * 40)


if __name__ == "__main__":
    main()