// ==========================================
// ÖMER.AI FABRİKA KONTROL MERKEZİ - V100 (FULL)
// TÜRKÇE AI ENTEGRASYONU + TELEGRAM + CHAT + SLIDER
// ==========================================

// 1. OTOMATİK TERCÜMAN SİSTEMİ (Türkçe -> AI Dili)
// Yapay zekanın "karadelik" yerine "kilise" çizmesini engellemek için kurulan köprü.
function translatePrompt(text) {
    const dict = {
        "karadelik": "black hole, event horizon, singularity, space nebula, cinematic lighting, 8k",
        "araba": "luxury supercar, futuristic racing car, hyper-realistic, 8k",
        "kedi": "cyberpunk neon cat, high detail fur, 4k resolution",
        "deniz": "dramatic ocean waves, sunset, hyper-realistic, 8k",
        "orman": "mystical ancient forest, volumetric lighting, photorealistic, cinematic",
        "robot": "advanced humanoid robot, glowing blue parts, intricate mechanical detail, masterpiece",
        "ev": "modern glass villa on a cliff, architecture masterpiece, cinematic lighting",
        "uzay": "deep space, galaxies, stars and planets, high resolution, 8k",
        "aslan": "majestic lion, golden lighting, sharp focus, 8k",
        "kurt": "white wolf in snow, cinematic lighting, sharp focus, masterpiece"
    };
    
    let processed = text.toLowerCase();
    for (let key in dict) {
        if (processed.includes(key)) return dict[key];
    }
    // Sözlükte yoksa en azından kaliteli olması için olduğu gibi gönderilir.
    return processed;
}

// 2. PROJELERE YUMUŞAK KAYDIRMA
function scrollProjects() {
    const gallery = document.getElementById('ai-gallery');
    if(gallery) gallery.scrollIntoView({ behavior: 'smooth' });
}

// 3. SLIDER MEKANİZMASI (Otonom)
let currentSlide = 0;
function moveSlider(direction) {
    const track = document.getElementById('slider-track');
    const slides = document.querySelectorAll('.slide');
    if(track && slides.length > 0) {
        currentSlide = (currentSlide + direction + slides.length) % slides.length;
        track.style.transform = `translateX(-${currentSlide * 100}%)`;
    }
}
// 5 saniyede bir otomatik kayar
setInterval(() => moveSlider(1), 5000);

// 4. TEMA YÖNETİMİ
function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute("data-theme");
    const targetTheme = currentTheme === "light" ? "dark" : "light";
    document.documentElement.setAttribute("data-theme", targetTheme);
    localStorage.setItem("theme", targetTheme);
}

// 5. ÖMER.AI ASİSTAN CHAT SİSTEMİ
function sendMessage() {
    const input = document.getElementById('user-input');
    const box = document.getElementById('chat-box');
    if(input && input.value.trim() !== "") {
        const userMsg = input.value.toLowerCase();
        box.innerHTML += `<p style="color: #38bdf8; margin-bottom: 8px;"><b>Sen:</b> ${input.value}</p>`;
        
        let botResponse = "Üretim bandındayım patron, her şey kontrolümde!";
        if(userMsg.includes("selam") || userMsg.includes("merhaba")) botResponse = "Merhaba patron! Fabrikaya hoş geldin.";
        else if(userMsg.includes("proje")) botResponse = "AI ve yazılım projelerimiz jilet gibi hazır! Sergimize bakabilirsin.";
        else if(userMsg.includes("iletişim")) botResponse = "Formu doldurursan mesajın Telegram üzerinden bana ulaşacak.";

        setTimeout(() => {
            box.innerHTML += `<p style="color: #f8fafc; margin-bottom: 8px;"><b>🤖 Bot:</b> ${botResponse}</p>`;
            box.scrollTop = box.scrollHeight;
        }, 600);
        input.value = '';
    }
}

// --- ANA ÇALIŞTIRICI (Sayfa Yüklendiğinde) ---
document.addEventListener("DOMContentLoaded", function() {
    const savedTheme = localStorage.getItem("theme") || "dark";
    document.documentElement.setAttribute("data-theme", savedTheme);

    // 6. TELEGRAM MESAJ HATTI ENTEGRASYONU
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

            fetch(`https://api.telegram.org/bot8385745600:AAFRf0-qUiy8ooJfvzGcn_MpL77YXONGHis/sendMessage`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ chat_id: '7076964315', text: text, parse_mode: 'Markdown' })
            }).then(() => {
                alert("Mührün Telegram hattına fırlatıldı patron! 🚀");
                form.reset();
            }).finally(() => {
                submitBtn.disabled = false;
                submitBtn.innerText = "Mührü Gönder";
            });
        });
    }

    // 7. ULTRA KALİTE AI ÜRETİM HATTI (TÜRKÇE DESTEKLİ)
    const generateBtn = document.getElementById('generate-image-btn');
    const promptInput = document.getElementById('prompt-input');
    const generatedImage = document.getElementById('generated-image');
    const imagePlaceholder = document.getElementById('image-placeholder');

    if (generateBtn) {
        generateBtn.addEventListener('click', function() {
            const rawPrompt = promptInput.value.trim();
            if (!rawPrompt) return alert('Lütfen bir görsel açıklaması girin patron!');

            generateBtn.disabled = true;
            generateBtn.innerText = "Mühürleniyor...";
            imagePlaceholder.innerText = "Tercüme ediliyor ve yüksek kalite üretiliyor...";
            generatedImage.style.display = "none";

            // Çeviri ve Kalite Arttırma (Prompt Engineering)
            const translated = translatePrompt(rawPrompt);
            const qualityTags = "photorealistic, masterpiece, 8k resolution, highly detailed, cinematic lighting, sharp focus, hyper-realistic";
            const finalPrompt = encodeURIComponent(translated + ", " + qualityTags);
            const seed = Math.floor(Math.random() * 999999);
            
            // Yüksek Kalite Flux Motoru
            const imageUrl = `https://image.pollinations.ai/prompt/${finalPrompt}?width=1024&height=1024&model=flux&seed=${seed}&nologo=true`;

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
                alert("Üretim bandı durdu, tekrar deneyin!");
                generateBtn.disabled = false;
                generateBtn.innerText = "Görseli Mühürle (Üret)";
                imagePlaceholder.innerText = "Bir hata oluştu.";
            };
        });
    }
});
