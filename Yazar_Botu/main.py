import random
import nltk
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize
import spacy
import re

nltk.download('stopwords', quiet=True)
nltk.download('punkt', quiet=True)
nlp = spacy.load("en_core_web_sm")

def generate_article(topic, keywords, num_sentences=25):
    """
    Generates a SEO-optimized article on a given topic.

    Args:
        topic (str): The main topic of the article.
        keywords (list): A list of relevant keywords to include in the article.
        num_sentences (int): The desired number of sentences in the article.

    Returns:
        str: The generated article.
    """

    stop_words = set(stopwords.words('english'))
    word_tokens = word_tokenize(topic)
    filtered_topic = [w for w in word_tokens if not w.lower() in stop_words]
    base_sentences = [
        f"Understanding the significance of {topic} in today's world.",
        f"Exploring the key aspects of {topic}.",
        f"Why {topic} matters more than ever.",
        f"A deep dive into the complexities of {topic}.",
        f"Unlocking the potential of {topic} for future advancements.",
        f"The evolution and future of {topic}.",
        f" Examining the benefits and challenges associated with {topic}.",
        f" Delving into the history and impact of {topic}.",
         f" Analyzing the latest trends and developments in the field of {topic}.",
        f" Discovering the hidden secrets and fascinating facts about {topic}."

    ]


    sentences = []
    sentences.append(base_sentences[0])
    sentences.append(f"In this article, we will delve into {topic} and understand its core principles.")
    num_keywords_added = 0
    for _ in range(num_sentences -2 ):

        sentence = random.choice(base_sentences) + " "
        kw_index = num_keywords_added % len(keywords)
        keyword = keywords[kw_index]

        sentence += f"Key considerations for {topic} includes {keyword}."

        if random.random() < 0.3: # Add some variety
            sentence += f" This aspect is crucial for optimizing {topic} efforts."
        if random.random() < 0.2:
            sentence += f" Many people are now searching for {topic} and {keyword} advice."

        sentences.append(sentence)
        num_keywords_added += 1
    sentences.append(f"In conclusion, {topic} plays a vital role, and understanding the key aspects like {keywords[0]} and {keywords[1]} is essential.")
    article = " ".join(sentences)

    # Basic cleanup and SEO-friendly formatting
    article = re.sub(r'\s+', ' ', article).strip() # Remove extra spaces

    return article



if __name__ == '__main__':
    topic = "Sustainable Energy Solutions"
    keywords = ["renewable energy", "solar power", "wind energy", "energy storage", "carbon footprint reduction"]
    article = generate_article(topic, keywords, num_sentences=25)
    print(article)