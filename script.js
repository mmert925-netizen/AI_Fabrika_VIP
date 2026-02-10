// ÖMER.AI FABRİKA KONTROL MERKEZİ - V70 - TAMAMEN DÜZELTİLMİŞ SÜRÜM

function scrollProjects() {
    const gallery = document.getElementById('ai-gallery');
    if(gallery) gallery.scrollIntoView({ behavior: 'smooth' });
}

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

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute("data-theme");
    const targetTheme = currentTheme === "light" ? "dark" : "light";
    document.documentElement.setAttribute("data-theme", targetTheme);
    localStorage.setItem("theme", targetTheme);
}

function sendMessage() {
    const input = document.getElementById('user-input');
    const box = document.getElementById('chat-box');
    if(input && input.value.trim() !== "") {
        box.innerHTML += `<p style="color: #38bdf8; margin-bottom: 8px;"><b>Sen:</b> ${input.value}</p>`;
        setTimeout(() => {
            box.innerHTML += `<p style="color: #f8fafc; margin-bottom: 8px;"><b>🤖 Bot:</b> Üretim bandı aktif, her şey kontrolümde patron!</p>`;
            box.scrollTop = box.scrollHeight;
        }, 800);
        input.value = '';
    }
}

document.addEventListener("DOMContentLoaded", function() {
    // TEMA YÜKLEME
    const savedTheme = localStorage.getItem("theme") || "dark";
    document.documentElement.setAttribute("data-theme", savedTheme);

    // TELEGRAM HATTI
    const form = document.getElementById("contact-form");
    if (form) {
        form.addEventListener("submit", function(event) {
            event.preventDefault();
            const submitBtn = form.querySelector('button');
            const text = `🚀 *Yeni Mesaj!* \n👤 *Ad:* ${form.querySelector('input[type="text"]').value} \n📝 *Mesaj:* ${form.querySelector('textarea').value}`;
            
            fetch(`https://api.telegram.org/bot8385745600:AAFRf0-qUiy8ooJfvzGcn_MpL77YXONGHis/sendMessage`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ chat_id: '7076964315', text: text, parse_mode: 'Markdown' })
            }).then(() => {
                alert("Mühür Telegram'a fırlatıldı!");
                form.reset();
            });
        });
    }

    // AI LABORATUVARI - HIZLI VE KALİTELİ ÜRETİM
    const generateBtn = document.getElementById('generate-image-btn');
    const promptInput = document.getElementById('prompt-input');
    const generatedImage = document.getElementById('generated-image');
    const imagePlaceholder = document.getElementById('image-placeholder');

    if (generateBtn) {
        generateBtn.addEventListener('click', function() {
            const prompt = promptInput.value.trim();
            if (!prompt) return alert('Prompt gir patron!');

            generateBtn.disabled = true;
            generateBtn.innerText = "Mühürleniyor...";
            imagePlaceholder.innerText = "Yüksek Kaliteli Eser Üretiliyor...";
            generatedImage.style.display = "none";

            // Daha kaliteli ve hızlı motor (Stable Diffusion XL üzerinden)
            const seed = Math.floor(Math.random() * 999999);
            const finalPrompt = encodeURIComponent("hyperrealistic, high definition, " + prompt);
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
        });
    }
});
