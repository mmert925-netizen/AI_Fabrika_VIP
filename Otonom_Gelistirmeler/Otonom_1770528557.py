def patron_burada_mi():
  """Kullanıcının patronun ofiste olup olmadığını sorgulayan ve buna göre çıktı veren bir fonksiyon."""

  yanit = input("Patron ofiste mi? (Evet/Hayır): ").lower()

  if yanit == "evet":
    print("Patron burada.")
  elif yanit == "hayır":
    print("Patron burada değil.")
  else:
    print("Geçersiz giriş. Lütfen 'Evet' veya 'Hayır' girin.")

if __name__ == "__main__":
  patron_burada_mi()