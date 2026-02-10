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
            box.innerHTML += `<p style="color: #f8fafc; margin-bottom: 8px;"><b>🤖 Bot:</b> Ücretsiz üretim hattı emrinde patron!</p>`;
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

// 5. 🚀 ÜCRETSİZ GÖRSEL MOTORU (Anahtar Gerektirmez)
document.addEventListener("DOMContentLoaded", function() {
    const generateBtn = document.getElementById('generate-image-btn');
    const promptInput = document.getElementById('prompt-input');
    const loadingIndicator = document.getElementById('loading-indicator');
    const generatedImage = document.getElementById('generated-image');
    const imagePlaceholder = document.getElementById('image-placeholder');

    if (generateBtn) {
        generateBtn.addEventListener('click', () => {
            const prompt = promptInput.value.trim();
            if (!prompt) {
                alert('Ne üretmemi istersin patron?');
                return;
            }

            loadingIndicator.style.display = 'block';
            generateBtn.disabled = true;
            generateBtn.innerText = "Görsel Bulunuyor...";
            generatedImage.style.display = 'none';
            imagePlaceholder.style.display = 'none';

            // Yazdığın kelimeye göre dev kütüphaneden en iyi resmi çeker
            const imageUrl = `https://source.unsplash.com/featured/1024x1024?${encodeURIComponent(prompt)}`;

            // Resim yüklendiğinde
            generatedImage.src = imageUrl;
            generatedImage.onload = () => {
                loadingIndicator.style.display = 'none';
                generatedImage.style.display = 'block';
                generateBtn.disabled = false;
                generateBtn.innerText = "Görseli Mühürle (Üret)";
            };

            // Hata durumunda (Nadir olur)
            generatedImage.onerror = () => {
                loadingIndicator.style.display = 'none';
                generateBtn.disabled = false;
                generateBtn.innerText = "Tekrar Dene";
                imagePlaceholder.style.display = 'block';
                imagePlaceholder.innerText = "Görsel bulunamadı, başka bir şey yaz patron!";
            };
        });
    }
});