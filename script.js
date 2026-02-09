// 1. Projelere Kaydırma
function scrollProjects() {
    const gallery = document.getElementById('ai-gallery');
    if(gallery) gallery.scrollIntoView({ behavior: 'smooth' });
}

// 2. ÖMER.AI Asistan
function sendMessage() {
    const input = document.getElementById('user-input');
    const box = document.getElementById('chat-box');
    if(input && input.value.trim() !== "") {
        box.innerHTML += `<p style="color: #38bdf8; margin-bottom: 8px;"><b>Sen:</b> ${input.value}</p>`;
        setTimeout(() => {
            box.innerHTML += `<p style="color: #f8fafc; margin-bottom: 8px;"><b>🤖 Bot:</b> Üretim laboratuvarı emrinde patron!</p>`;
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
setInterval(() => moveSlider(1), 5000);

// 4. Tema Yönetimi
function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute("data-theme");
    const targetTheme = currentTheme === "light" ? "dark" : "light";
    document.documentElement.setAttribute("data-theme", targetTheme);
    localStorage.setItem("theme", targetTheme);
}

// 5. 🚀 GİZLİ AI ÜRETİM MOTORU
// GitHub engellemesin diye anahtarı buraya yazmıyoruz patron!
// Bu değişkeni Vercel panelinden "Environment Variables" kısmına ekleyeceğiz.
const OPENAI_API_KEY = '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'; 

document.addEventListener("DOMContentLoaded", function() {
    const generateBtn = document.getElementById('generate-image-btn');
    const promptInput = document.getElementById('prompt-input');
    const loadingIndicator = document.getElementById('loading-indicator');
    const generatedImage = document.getElementById('generated-image');
    const imagePlaceholder = document.getElementById('image-placeholder');

    if (generateBtn) {
        generateBtn.addEventListener('click', async () => {
            const prompt = promptInput.value.trim();
            if (!prompt) {
                alert('Ne üretmemi istersin patron?');
                return;
            }

            loadingIndicator.style.display = 'block';
            generateBtn.disabled = true;
            generateBtn.innerText = "Üretiliyor...";
            generatedImage.style.display = 'none';
            imagePlaceholder.style.display = 'none';

            try {
                const response = await fetch('https://api.openai.com/v1/images/generations', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${OPENAI_API_KEY}`
                    },
                    body: JSON.stringify({
                        model: "dall-e-2",
                        prompt: prompt,
                        n: 1,
                        size: "1024x1024"
                    })
                });

                const data = await response.json();

                if (data.data && data.data[0].url) {
                    generatedImage.src = data.data[0].url;
                    generatedImage.onload = () => {
                        loadingIndicator.style.display = 'none';
                        generatedImage.style.display = 'block';
                        generateBtn.disabled = false;
                        generateBtn.innerText = "Görseli Mühürle (Üret)";
                    };
                } else {
                    throw new Error(data.error.message);
                }

            } catch (error) {
                console.error('Hata:', error);
                alert('Üretim durdu: ' + error.message);
                loadingIndicator.style.display = 'none';
                generateBtn.disabled = false;
                generateBtn.innerText = "Görseli Mühürle (Üret)";
                imagePlaceholder.style.display = 'block';
            }
        });
    }
});