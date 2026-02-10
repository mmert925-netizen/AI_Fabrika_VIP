// ÖMER.AI FABRİKA - AKILLI SİSTEM

// 1. Slider Mekanizması (Yan Yana Kaydırma)
let currentSlide = 0;
function moveSlider(direction) {
    const track = document.getElementById('slider-track');
    const slides = document.querySelectorAll('.slide');
    if (track && slides.length > 0) {
        currentSlide = (currentSlide + direction + slides.length) % slides.length;
        track.style.transform = `translateX(-${currentSlide * 100}%)`;
    }
}

// Otomatik Slayt (5 saniyede bir)
setInterval(() => moveSlider(1), 5000);

// 2. Ücretsiz Görsel Üretimi (Pollinations)
document.addEventListener("DOMContentLoaded", function() {
    const generateBtn = document.getElementById('generate-image-btn');
    const promptInput = document.getElementById('prompt-input');
    const generatedImage = document.getElementById('generated-image');
    const loader = document.getElementById('loading-indicator');

    if (generateBtn) {
        generateBtn.addEventListener('click', () => {
            const prompt = promptInput.value.trim();
            if (!prompt) return alert("Patron bir şeyler yaz!");

            loader.style.display = 'block';
            generatedImage.style.display = 'none';

            // Ücretsiz motor (seed ekledik ki her seferinde farklı resim gelsin)
            const url = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=1024&height=1024&seed=${Math.random()}`;
            
            generatedImage.src = url;
            generatedImage.onload = () => {
                loader.style.display = 'none';
                generatedImage.style.display = 'block';
            };
        });
    }
});