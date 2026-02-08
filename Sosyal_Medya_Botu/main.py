import re
import textwrap

def makaleyi_tweet_e_donustur(makale, tweet_uzunlugu=280):
    """
    Bir makaleyi bir dizi tweet'e dönüştürür.

    Args:
        makale: Makale metni.
        tweet_uzunlugu: Her bir tweet'in maksimum uzunluğu.

    Returns:
        Bir tweet dizisi.
    """

    # Makaleyi cümlelere ayır.
    cumleler = re.split(r'(?<!\w\.\w.)(?<![A-Z][a-z]\.)(?<=\.|\?)\s', makale)

    tweetler = []
    gecerli_tweet = ""
    for cumle in cumleler:
        if len(gecerli_tweet) == 0:
            gecerli_tweet = cumle
        elif len(gecerli_tweet) + len(cumle) + 1 <= tweet_uzunlugu:  # +1 boşluk için
            gecerli_tweet += " " + cumle
        else:
            tweetler.append(gecerli_tweet)
            gecerli_tweet = cumle

    if gecerli_tweet:
        tweetler.append(gecerli_tweet)

    return tweetler

def makaleyi_instagram_altyazisina_donustur(makale, altyazi_uzunlugu=2200):
    """
    Bir makaleyi tek bir Instagram başlığına dönüştürür.

    Args:
        makale: Makale metni.
        altyazi_uzunlugu: Altyazının maksimum uzunluğu.

    Returns:
        Bir Instagram başlığı.
    """

    # Çok uzunsa makaleyi kes.
    if len(makale) > altyazi_uzunlugu:
        makale = makale[:altyazi_uzunlugu - 3] + "..."

    return makale

def makaleyi_instagram_carousel_e_donustur(makale, slide_uzunlugu=240):
    """
    Bir makaleyi Instagram Carousel(Döngü)'e dönüştürür.

    Args:
        makale: Makale metni.
        slide_uzunlugu: Her bir slide'ın maksimum uzunluğu.

    Returns:
        Bir slide dizisi.
    """

    slide_metinleri = textwrap.wrap(makale, width=slide_uzunlugu, break_long_words=False)
    return slide_metinleri


if __name__ == '__main__':
    makale_metni = """Bu bir deneme makalesidir.  Amaç, bu makaleyi tweet'lere dönüştürebilen bir işlevi test etmektir. Bu aynı zamanda çok uzun cümleleri de test etmelidir.  Mesela, çok ama çok çok çok çok çok çok çok çok çok çok çok çok çok çok çok çok çok çok çok çok çok çok çok çok çok çok çok çok çok çok çok çok çok çok çok çok çok çok çok çok çok çok çok çok çok çok çok uzun bir cümlemiz var. Bir şeyler test etmeliyiz. Bu iyi mi?"""

    # Twitter test
    tweetler = makaleyi_tweet_e_donustur(makale_metni)
    print("--- Twitter Tweetleri ---")
    for i, tweet in enumerate(tweetler):
        print(f"Tweet {i+1}: {tweet}\n")

    # Instagram başlık testi
    instagram_altyazisi = makaleyi_instagram_altyazisina_donustur(makale_metni)
    print("--- Instagram Altyazısı ---")
    print(instagram_altyazisi + "\n")

    #Instagram carousel testi
    instagram_carousel_slidelari = makaleyi_instagram_carousel_e_donustur(makale_metni)
    print("--- Instagram Carousel Slaytları ---")
    for i, slide in enumerate(instagram_carousel_slidelari):
        print(f"Slayt {i+1}: {slide}\n")