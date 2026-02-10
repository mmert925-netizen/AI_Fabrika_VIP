// ÖMER.AI FABRİKA KONTROL MERKEZİ - V600 (Görsel Üretim Aktif)

// 1. Projelere Kaydırma
function scrollProjects() {
    const gallery = document.getElementById('ai-gallery');
    if(gallery) gallery.scrollIntoView({ behavior: 'smooth' });
}

// 2. Slider Mekanizması
let currentSlide = 0;
function moveSlider(direction) {
    const track = document.getElementById('slider-track');
    const slides = document.querySelectorAll('.slide');
    if(track && slides.length > 0) {
        currentSlide = (currentSlide + direction + slides.length) % slides.length;
        track.style.transform = `translateX(-${currentSlide * 100}%)`;
    }
}
setInterval(() => moveSlider(1), 5000);

// 3. Tema Yönetimi
function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute("data-theme");
    const targetTheme = currentTheme === "light" ? "dark" : "light";
    document.documentElement.setAttribute("data-theme", targetTheme);
    localStorage.setItem("theme", targetTheme);
}

// 4. Asistan Mesajlaşma
function sendMessage() {
    const input = document.getElementById('user-input');
    const box = document.getElementById('chat-box');
    if(input && input.value.trim() !== "") {
        const userMsg = input.value.toLowerCase();
        box.innerHTML += `<p style="color: #38bdf8; margin-bottom: 8px;"><b>Sen:</b> ${input.value}</p>`;
        let botResponse = "Şu an projeler üzerinde mühürleme yapıyorum patron, sana nasıl yardımcı olabilirim?";
        if(userMsg.includes("selam") || userMsg.includes("merhaba")) botResponse = "Merhaba! ÖMER.AI Yazılım Fabrikası'na hoş geldin.";
        else if(userMsg.includes("proje")) botResponse = "Yapay zeka modelleri ve otonom yazılımlar üretiyoruz. Sergimize göz atabilirsin!";
        else if(userMsg.includes("iletişim")) botResponse = "Formu doldurup 'Mührü Gönder' dersen mesajın doğrudan telefonuma düşer.";
        
        setTimeout(() => {
            box.innerHTML += `<p style="color: #f8fafc; margin-bottom: 8px;"><b>🤖 Bot:</b> ${botResponse}</p>`;
            box.scrollTop = box.scrollHeight;
        }, 800);
        input.value = '';
    }
}

// --- ANA ÇALIŞTIRICI (DOM Content Loaded) ---
document.addEventListener("DOMContentLoaded", function() {
    const savedTheme = localStorage.getItem("theme") || "dark";
    document.documentElement.setAttribute("data-theme", savedTheme);

    // TELEGRAM HATTI
    const TELEGRAM_BOT_TOKEN = '8385745600:AAFRf0-qUiy8ooJfvzGcn_MpL77YXONGHis'; 
    const TELEGRAM_CHAT_ID = '7076964315'; 
    const form = document.getElementById("contact-form");
    if (form) {
        form.addEventListener("submit", function(event) {
            event.preventDefault();
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
                body: JSON.stringify({ chat_id: TELEGRAM_CHAT_ID, text: text, parse_mode: 'Markdown' })
            }).then(() => {
                alert("Mührün Telegram hattına fırlatıldı patron! 🚀");
                form.reset();
            }).finally(() => {
                submitBtn.disabled = false;
                submitBtn.innerText = "Mührü Gönder";
            });
        });
    }

    // 🚨 AI GÖRSEL ÜRETİM MOTORU (Imagen 4.0 Simülasyonu)
    const generateBtn = document.getElementById('generate-image-btn');
    const promptInput = document.getElementById('prompt-input');
    const generatedImage = document.getElementById('generated-image');
    const imagePlaceholder = document.getElementById('image-placeholder');

    if (generateBtn) {
        generateBtn.addEventListener('click', function() {
            const prompt = promptInput.value.trim();
            if (!prompt) {
                alert('Lütfen bir görsel açıklaması girin patron!');
                return;
            }

            generateBtn.disabled = true;
            generateBtn.innerText = "Mühürleniyor...";
            imagePlaceholder.innerText = "Fabrika üretim yapıyor, lütfen bekle...";
            imagePlaceholder.style.display = "block";
            generatedImage.style.display = "none";

            const encodedPrompt = encodeURIComponent(prompt);
            // Ücretsiz, hızlı ve API key istemeyen Flux motoru
            const imageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=800&height=600&model=flux&nologo=true&seed=${Math.floor(Math.random() * 1000)}`;

            const img = new Image();
            img.src = imageUrl;
            img.onload = function() {
                generatedImage.src = imageUrl;
                generatedImage.style.display = "block";
                imagePlaceholder.style.display = "none";
                generateBtn.disabled = false;
                generateBtn.innerText = "Görseli Mühürle (Üret)";
            };
            img.onerror = function() {
                alert("Üretim bandında hata oluştu!");
                generateBtn.disabled = false;
                generateBtn.innerText = "Görseli Mühürle (Üret)";
            };
        });
    }
});
