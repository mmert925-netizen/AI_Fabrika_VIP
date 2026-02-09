// 1. Projelere Kaydırma Fonksiyonu
function scrollProjects() {
    const gallery = document.getElementById('ai-gallery');
    if(gallery) {
        gallery.scrollIntoView({ behavior: 'smooth' });
    }
}

// 2. ÖMER.AI Asistan Mesajlaşma Sistemi
function sendMessage() {
    const input = document.getElementById('user-input');
    const box = document.getElementById('chat-box');
    
    if(input && input.value.trim() !== "") {
        const userMsg = input.value.toLowerCase();
        box.innerHTML += `<p style="color: #38bdf8; margin-bottom: 8px;"><b>Sen:</b> ${input.value}</p>`;
        
        let botResponse = "Şu an projeler üzerinde mühürleme yapıyorum patron, sana nasıl yardımcı olabilirim?";
        
        if(userMsg.includes("selam") || userMsg.includes("merhaba")) {
            botResponse = "Merhaba! ÖMER.AI Yazılım Fabrikası'na hoş geldin.";
        } else if(userMsg.includes("proje")) {
            botResponse = "Yapay zeka modelleri ve otonom yazılımlar üretiyoruz. Sergimize göz atabilirsin!";
        } else if(userMsg.includes("iletişim")) {
            botResponse = "Formu doldurup 'Mührü Gönder' dersen mesajın doğrudan telefonuma düşer.";
        }

        setTimeout(() => {
            box.innerHTML += `<p style="color: #f8fafc; margin-bottom: 8px;"><b>🤖 Bot:</b> ${botResponse}</p>`;
            box.scrollTop = box.scrollHeight;
        }, 800);
        
        input.value = '';
    }
}

// 3. Slider Mekanizması
let currentSlide = 0;
function moveSlider(direction) {
    const track = document.getElementById('slider-track');
    const slides = document.querySelectorAll('.slide');
    if(track && slides.length > 0) {
        currentSlide = (currentSlide + direction + slides.length) % slides.length;
        track.style.transform = `translateX(-${currentSlide * 100}%)`;
    }
}

// 🚀 EKLEME: Otonom Slider (5 saniyede bir kendi kayar)
setInterval(() => {
    moveSlider(1);
}, 5000);

// 4. Tema (Karanlık/Aydınlık) Yönetimi
function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute("data-theme");
    const targetTheme = currentTheme === "light" ? "dark" : "light";
    document.documentElement.setAttribute("data-theme", targetTheme);
    localStorage.setItem("theme", targetTheme);
}

// 5. TELEGRAM MESAJ HATTI 🚀
const TELEGRAM_BOT_TOKEN = '8385745600:AAFRf0-qUiy8ooJfvzGcn_MpL77YXONGHis'; 
const TELEGRAM_CHAT_ID = '7076964315'; 

document.addEventListener("DOMContentLoaded", function() {
    const savedTheme = localStorage.getItem("theme") || "dark";
    document.documentElement.setAttribute("data-theme", savedTheme);

    const form = document.getElementById("contact-form");
    if (form) {
        form.addEventListener("submit", function(event) {
            event.preventDefault();
            
            // Butonu geçici olarak devre dışı bırak (Çift gönderimi önler)
            const submitBtn = form.querySelector('button');
            submitBtn.disabled = true;
            submitBtn.innerText = "Mühürleniyor...";

            const name = form.querySelector('input[type="text"]').value;
            const email = form.querySelector('input[type="email"]').value;
            const message = form.querySelector('textarea').value;

            const text = `🚀 *Yeni Web Mesajı!*\n\n👤 *Ad:* ${name}\n📧 *E-posta:* ${email}\n📝 *Mesaj:* ${message}`;

            fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    chat_id: TELEGRAM_CHAT_ID,
                    text: text,
                    parse_mode: 'Markdown'
                })
            })
            .then(response => {
                if(response.ok) {
                    alert("Mührün Telegram hattına fırlatıldı patron! 🚀");
                    form.reset();
                } else {
                    alert("Hata: Mesaj iletilemedi. Token veya ID kontrolü gerek.");
                }
            })
            .catch(error => {
                console.error('Hata:', error);
                alert("Bağlantı hatası oluştu!");
            })
            .finally(() => {
                submitBtn.disabled = false;
                submitBtn.innerText = "Mührü Gönder";
            });
        });
    }

    const chatInput = document.getElementById('user-input');
    if(chatInput) {
        chatInput.addEventListener("keypress", function(event) {
            if (event.key === "Enter") sendMessage();
        });
    }
});