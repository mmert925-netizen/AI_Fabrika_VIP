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
            box.innerHTML += `<p style="color: #f8fafc; margin-bottom: 8px;"><b>🤖 Bot:</b> Emredersin patron, üretim hattı hazır!</p>`;
            box.scrollTop = box.scrollHeight;
        }, 800);
        input.value = '';
    }
}

// 3. Slider Mekanizması (Slayt Gibi Kayar)
let currentSlide = 0;
function moveSlider(direction) {
    const track = document.getElementById('slider-track');
    const slides = document.querySelectorAll('.slide');
    
    // Eğer slider HTML'de yoksa hata vermesin diye kontrol
    if(track && slides.length > 0) {
        currentSlide = (currentSlide + direction + slides.length) % slides.length;
        // %100 genişlikte kaydırma yapar
        track.style.transform = `translateX(-${currentSlide * 100}%)`;
    }
}
// 5 saniyede bir otomatik kayar
setInterval(() => moveSlider(1), 5000);

// 4. Tema Yönetimi
function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute("data-theme");
    const targetTheme = currentTheme === "light" ? "dark" : "light";
    document.documentElement.setAttribute("data-theme", targetTheme);
    localStorage.setItem("theme", targetTheme);
}

// 5. 🚀 GARANTİ ÇALIŞAN AI MOTORU (Pollinations)
// Artık Unsplash yok, burası yazdığını gerçekten çizer.
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
                alert('Patron, boş kağıda resim çizilmez! Bir şeyler yaz.');
                return;
            }

            loadingIndicator.style.display = 'block';
            generateBtn.disabled = true;
            generateBtn.innerText = "Üretim Başladı...";
            generatedImage.style.display = 'none';
            if(imagePlaceholder) imagePlaceholder.style.display = 'none';

            // ⚡ KRİTİK DEĞİŞİKLİK: Unsplash yerine Pollinations AI
            // seed=${Math.random()} ekledik ki her seferinde farklı resim gelsin.
            const randomSeed = Math.floor(Math.random() * 10000);
            const imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=1024&height=1024&seed=${randomSeed}&nologo=true`;

            // Resim Kaynağını Ata
            generatedImage.src = imageUrl;

            // Resim Yüklendiğinde
            generatedImage.onload = () => {
                loadingIndicator.style.display = 'none';
                generatedImage.style.display = 'block';
                generateBtn.disabled = false;
                generateBtn.innerText = "Yeniden Üret";
            };

            // Hata Olursa (İnternet kopuksa vs.)
            generatedImage.onerror = () => {
                loadingIndicator.style.display = 'none';
                generateBtn.disabled = false;
                generateBtn.innerText = "Tekrar Dene";
                alert("Bağlantıda sorun var patron, tekrar dene!");
            };
        });
    }
});