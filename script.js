```javascript
document.addEventListener("DOMContentLoaded", function() {
    const form = document.getElementById("contactForm");
    const formMessage = document.getElementById("form-message");

    form.addEventListener("submit", function(event) {
        event.preventDefault(); // Sayfanın yenilenmesini engelle

        // Form verilerini al
        const name = document.getElementById("name").value;
        const email = document.getElementById("email").value;
        const message = document.getElementById("message").value;

        // Basit validasyon (sunucu tarafında da yapılmalı)
        if (!name || !email || !message) {
            formMessage.textContent = "Lütfen tüm alanları doldurun.";
            formMessage.style.color = "red";
            return;
        }

        // Form verilerini işleme (burada sunucuya gönderme simüle ediliyor)
        console.log("Form Gönderildi:");
        console.log("Ad:", name);
        console.log("E-posta:", email);
        console.log("Mesaj:", message);

        formMessage.textContent = "Mesajınız başarıyla gönderildi!";
        formMessage.style.color = "green";

        // Formu sıfırla
        form.reset();
    });
});
```// script.js içine eklenecek Telegram mühürleme kodu
const TELEGRAM_BOT_TOKEN = '8385745600:AAFRf0-qUiy8ooJfvzGcn_MpL77YXONGHis'; // Telegram'dan aldığın token
const TELEGRAM_CHAT_ID = '7076964315';     // Kendi chat ID'n

document.getElementById('contact-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const ad = this.querySelector('input[type="text"]').value;
    const eposta = this.querySelector('input[type="email"]').value;
    const mesaj = this.querySelector('textarea').value;
    
    const tamMesaj = `🚀 *Yeni Mühürlü Mesaj!*\n\n👤 *Gönderen:* ${ad}\n📧 *E-posta:* ${eposta}\n📝 *Mesaj:* ${mesaj}`;

    fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            chat_id: TELEGRAM_CHAT_ID,
            text: tamMesaj,
            parse_mode: 'Markdown'
        })
    })
    .then(response => {
        if (response.ok) {
            alert('Mesaj başarıyla mühürlendi ve Patrona iletildi! 🚀');
            this.reset();
        } else {
            alert('Mühürleme hatası! Lütfen tekrar dene.');
        }
    });
});