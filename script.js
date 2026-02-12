//// 1. Projelere Kaydırma Fonksiyonu
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

// 4. Sohbet kutusu aç/kapa
function toggleChat() {
    const chat = document.getElementById("ai-chat-widget");
    const toggleBtn = document.getElementById("chat-toggle-btn");
    if (!chat || !toggleBtn) return;
    const isOpen = chat.classList.contains("chat-open");
    if (isOpen) {
        chat.classList.remove("chat-open");
        chat.classList.add("chat-closed");
        toggleBtn.classList.add("visible");
        localStorage.setItem("chatOpen", "false");
    } else {
        chat.classList.add("chat-open");
        chat.classList.remove("chat-closed");
        toggleBtn.classList.remove("visible");
        localStorage.setItem("chatOpen", "true");
    }
}

// 4b. Tema (Karanlık/Aydınlık) Yönetimi
function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute("data-theme");
    const targetTheme = currentTheme === "light" ? "dark" : "light";
    document.documentElement.setAttribute("data-theme", targetTheme);
    localStorage.setItem("theme", targetTheme);
}

// 5. Form doğrulama – e-posta formatı, boş alan kontrolü
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}
function validateContactForm(name, email, message) {
    const errors = [];
    if (!name || !name.trim()) errors.push("Ad alanı boş olamaz.");
    if (!email || !email.trim()) errors.push("E-posta alanı boş olamaz.");
    else if (!validateEmail(email)) errors.push("Geçerli bir e-posta adresi girin.");
    if (!message || !message.trim()) errors.push("Mesaj alanı boş olamaz.");
    return errors;
}

document.addEventListener("DOMContentLoaded", function() {
    const savedTheme = localStorage.getItem("theme") || "dark";
    document.documentElement.setAttribute("data-theme", savedTheme);

    const chatOpen = localStorage.getItem("chatOpen");
    const chat = document.getElementById("ai-chat-widget");
    const toggleBtn = document.getElementById("chat-toggle-btn");
    if (chat && toggleBtn) {
        if (chatOpen === "false") {
            chat.classList.add("chat-closed");
            toggleBtn.classList.add("visible");
        } else {
            chat.classList.add("chat-open");
            chat.classList.remove("chat-closed");
        }
    }

    const form = document.getElementById("contact-form");
    if (form) {
        form.addEventListener("submit", function(event) {
            event.preventDefault();

            const name = form.querySelector('input[type="text"]').value;
            const email = form.querySelector('input[type="email"]').value;
            const message = form.querySelector('textarea').value;

            const errors = validateContactForm(name, email, message);
            if (errors.length > 0) {
                alert(errors.join("\n"));
                return;
            }

            const submitBtn = form.querySelector('button');
            submitBtn.disabled = true;
            submitBtn.innerText = "Mühürleniyor...";

            fetch("/api/telegram", {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: name.trim(), email: email.trim(), message: message.trim() })
            })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    alert("Mührün Telegram hattına fırlatıldı patron! 🚀");
                    form.reset();
                } else {
                    alert(data.error || "Mesaj iletilemedi.");
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

    // Görsel üret butonu (Imagen 4.0 – backend API bağlandığında URL güncellenir)
    const genBtn = document.getElementById("generate-image-btn");
    const promptInput = document.getElementById("prompt-input");
    const loadingEl = document.getElementById("loading-indicator");
    const imgOut = document.getElementById("generated-image");
    const imgPlaceholder = document.getElementById("image-placeholder");
    if (genBtn && promptInput) {
        genBtn.addEventListener("click", function() {
            const prompt = promptInput.value.trim();
            if (!prompt) {
                alert("Lütfen görsel açıklaması yazın.");
                return;
            }
            if (loadingEl) loadingEl.style.display = "block";
            if (imgOut) { imgOut.style.display = "none"; imgOut.src = ""; }
            if (imgPlaceholder) imgPlaceholder.style.display = "block";
            // TODO: Backend'de Imagen/Gen API endpoint'i hazır olunca fetch ile buraya bağlan
            setTimeout(function() {
                if (loadingEl) loadingEl.style.display = "none";
                alert("Görsel üretimi için backend API henüz bağlı değil. Endpoint hazır olunca burada fetch ile bağlanacak.");
            }, 600);
        });
    }
});
