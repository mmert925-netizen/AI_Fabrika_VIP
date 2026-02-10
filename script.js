// ==========================================
// ÖMER.AI FABRİKA KONTROL MERKEZİ - V125
// SADECE MOD VE MAİL DÜZELTMESİ YAPILDI
// ==========================================

// 1. TERCÜMAN SİSTEMİ (Türkçe -> AI Dili)
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
    return processed;
}

// 2. MOD DEĞİŞTİRME (KESİN ÇÖZÜM)
function toggleTheme() {
    const html = document.documentElement;
    // Mevcut temayı kontrol et, yoksa 'dark' olarak kabul et
    const currentTheme = html.getAttribute("data-theme") || "dark";
    const newTheme = currentTheme === "light" ? "dark" : "light";
    
    // Temayı sayfaya uygula ve hafızaya kaydet
    html.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme);
}

// 3. CANLI VERİ AKIŞI
function updateStats() {
    const dataStat = document.getElementById('stat-data');
    const projectStat = document.getElementById('stat-projects');
    let dataVal = 1.20;
    let projVal = 142;

    if(dataStat && projectStat) {
        setInterval(() => {
            dataVal += Math.random() * 0.03;
            if(Math.random() > 0.85) projVal += 1;
            dataStat.innerText = dataVal.toFixed(2) + " TB";
            projectStat.innerText = projVal;
        }, 2500);
    }
}

// 4. SLIDER VE KAYDIRMA SİSTEMİ
let currentSlide = 0;
function moveSlider(dir) {
    const track = document.getElementById('slider-track');
    const slides = document.querySelectorAll('.slide');
    if(track && slides.length) {
        currentSlide = (currentSlide + dir + slides.length) % slides.length;
        track.style.transform = `translateX(-${currentSlide * 100}%)`;
    }
}
function scrollProjects() { 
    document.getElementById('ai-gallery')?.scrollIntoView({behavior:'smooth'}); 
}

// --- ANA SİSTEM ÇALIŞTIRICI ---
document.addEventListener("DOMContentLoaded", function() {
    // 1. Kayıtlı Temayı Yükle
    const savedTheme = localStorage.getItem("theme") || "dark";
    document.documentElement.setAttribute("data-theme", savedTheme);

    // 2. Sistemleri Başlat
    updateStats();
    setInterval(() => moveSlider(1), 5000);

    // 3. TELEGRAM MESAJ SİSTEMİ (MAIL DÜZELTİLDİ)
    const form = document.getElementById("contact-form");
    if (form) {
        form.addEventListener("submit", function(event) {
            event.preventDefault();
            const submitBtn = form.querySelector('button');
            submitBtn.innerText = "Mühürleniyor...";
            
            const name = form.querySelector('input[type="text"]').value;
            // DÜZELTME: Mail kutusunu bul ve değerini al
            const emailInput = form.querySelector('input[type="email"]');
            const email = emailInput ? emailInput.value : "Girilmedi";
            const message = form.querySelector('textarea').value;

            // DÜZELTME: Mail adresi Telegram metnine mühürlendi
            const text = `🚀 *Webden Mesaj!*\n👤 *Ad:* ${name}\n📧 *E-posta:* ${email}\n📝 *Mesaj:* ${message}`;

            fetch(`https://api.telegram.org/bot8385745600:AAFRf0-qUiy8ooJfvzGcn_MpL77YXONGHis/sendMessage`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ chat_id: '7076964315', text: text, parse_mode: 'Markdown' })
            }).then(() => {
                alert("Mühür ve E-posta Telegram'a fırlatıldı patron!");
                form.reset();
            }).finally(() => {
                submitBtn.innerText = "Mührü Gönder";
            });
        });
    }

    // 4. AI GÖRSEL ÜRETİM HATTI
    const genBtn = document.getElementById('generate-image-btn');
    const promptInput = document.getElementById('prompt-input');
    const genImg = document.getElementById('generated-image');
    const placeholder = document.getElementById('image-placeholder');

    if(genBtn) {
        genBtn.addEventListener('click', () => {
            const rawPrompt = promptInput.value.trim();
            if(!rawPrompt) return alert("Hayalini yaz patron!");

            genBtn.innerText = "Üretiliyor...";
            genBtn.disabled = true;
            placeholder.innerText = "Tercüme ediliyor ve 8K mühürleniyor...";
            genImg.style.display = "none";

            const translated = translatePrompt(rawPrompt);
            const quality = "photorealistic, masterpiece, 8k, highly detailed, sharp focus";
            const seed = Math.floor(Math.random() * 999999);
            const url = `https://image.pollinations.ai/prompt/${encodeURIComponent(translated + ", " + quality)}?width=1024&height=1024&model=flux&seed=${seed}&nologo=true`;

            const imgTester = new Image();
            imgTester.src = url;
            imgTester.onload = () => {
                genImg.src = url;
                genImg.style.display = "block";
                placeholder.style.display = "none";
                genBtn.innerText = "Görseli Mühürle (Üret)";
                genBtn.disabled = false;
            };
            imgTester.onerror = () => {
                alert("Üretim bandında hata veya limit doldu!");
                genBtn.disabled = false;
            };
        });
    }
});
