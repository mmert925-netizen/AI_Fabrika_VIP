//// PROJE DETAY SAYFALARI (Portfolio)
const PROJECTS = {
    1: { title: { tr: "Neon Şehir Manzarası", en: "Neon City Landscape" }, desc: { tr: "Siberpunk tema ile oluşturulmuş gelecek şehir vizyonu.", en: "Future city vision with cyberpunk theme." }, img: "img/proje1.jpg" },
    2: { title: { tr: "Robot Portresi", en: "Robot Portrait" }, desc: { tr: "Yapay zeka destekli robot karakter tasarımı.", en: "AI-assisted robot character design." }, img: "img/proje2.jpg" },
    3: { title: { tr: "Sanal Evren", en: "Virtual Universe" }, desc: { tr: "Dijital sanat ve soyut görsel üretimi.", en: "Digital art and abstract visual generation." }, img: "img/proje3.jpg" },
    4: { title: { tr: "Mekanik Bulutlar", en: "Mechanical Clouds" }, desc: { tr: "Steampunk ve futuristik karışımı konsept.", en: "Steampunk and futuristic blend concept." }, img: "img/proje4.jpg" },
    5: { title: { tr: "Holografik İkon", en: "Holographic Icon" }, desc: { tr: "3D holografik efekt ile logo tasarımı.", en: "Logo design with 3D holographic effect." }, img: "img/proje5.jpg" },
    6: { title: { tr: "Dijital Orman", en: "Digital Forest" }, desc: { tr: "Doğa ve teknoloji sentezinde görsel.", en: "Visual in nature and technology synthesis." }, img: "img/proje6.jpg" }
};

let currentLang = localStorage.getItem("lang") || "tr";
let modalCurrentProject = 1;
let modalViewingProjects = false;

function modalNav(direction) {
    const modal = document.getElementById("project-modal");
    if (!modal || !modal.classList.contains("modal-open")) return;
    if (modal.classList.contains("modal-fullscreen")) {
        const content = modal.querySelector(".project-modal-content");
        if (content) {
            const scrollAmount = 150;
            content.scrollLeft += direction * scrollAmount;
        }
    } else {
        modalViewingProjects = true;
        modalCurrentProject = ((modalCurrentProject - 1 + direction + 6) % 6) + 1;
        openProjectDetail(modalCurrentProject);
    }
}

function openProjectDetail(id) {
    const p = PROJECTS[id];
    if (!p) return;
    modalCurrentProject = id;
    modalViewingProjects = true;
    const modal = document.getElementById("project-modal");
    document.getElementById("project-modal-img").src = p.img;
    document.getElementById("project-modal-title").textContent = p.title[currentLang] || p.title.tr;
    document.getElementById("project-modal-desc").textContent = p.desc[currentLang] || p.desc.tr;
    modal.classList.add("modal-open");
    modal.classList.remove("modal-fullscreen");
    document.body.style.overflow = "hidden";
}
function closeProjectDetail(e) {
    if (e && e.target !== e.currentTarget) return;
    const modal = document.getElementById("project-modal");
    modal.classList.remove("modal-open", "modal-fullscreen");
    document.body.style.overflow = "";
}

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

// 4c. Çoklu Dil (TR / EN)
function toggleLang() {
    currentLang = currentLang === "tr" ? "en" : "tr";
    localStorage.setItem("lang", currentLang);
    applyLang();
    document.getElementById("lang-toggle").textContent = currentLang === "tr" ? "🌐 EN" : "🌐 TR";
}
function applyLang() {
    document.querySelectorAll("[data-tr], [data-en]").forEach(el => {
        if (el.hasAttribute("data-placeholder-tr") || el.hasAttribute("data-placeholder-en")) {
            const ph = el.getAttribute("data-placeholder-" + currentLang) || el.getAttribute("data-placeholder-tr");
            if (ph) el.placeholder = ph;
        } else if (el.hasAttribute("data-tr") || el.hasAttribute("data-en")) {
            const txt = el.getAttribute("data-" + currentLang) || el.getAttribute("data-tr");
            if (txt) el.textContent = txt;
        }
    });
}

// Görsel galeri kaydetme – üretilen görselleri localStorage'a ekle
const GALLERY_KEY = "omerai_generated_gallery";
function getSavedGallery() {
    try { return JSON.parse(localStorage.getItem(GALLERY_KEY) || "[]"); } catch { return []; }
}
function saveToGallery(src) {
    const g = getSavedGallery();
    g.push({ src, id: Date.now() });
    localStorage.setItem(GALLERY_KEY, JSON.stringify(g));
    renderGeneratedGallery();
}
function removeFromGallery(index) {
    const g = getSavedGallery();
    g.splice(index, 1);
    localStorage.setItem(GALLERY_KEY, JSON.stringify(g));
    renderGeneratedGallery();
}
function renderGeneratedGallery() {
    const container = document.getElementById("generated-gallery");
    if (!container) return;
    const g = getSavedGallery();
    container.innerHTML = g.map((item, i) => `
        <div class="generated-gallery-item" data-gallery-index="${i}">
            <button class="gallery-delete-btn" data-index="${i}" title="${currentLang === 'tr' ? 'Sil' : 'Delete'}">×</button>
            <img src="${item.src}" alt="Kaydedilmiş görsel">
        </div>
    `).join("");
    container.querySelectorAll(".generated-gallery-item").forEach(el => {
        const idx = parseInt(el.dataset.galleryIndex);
        el.querySelector(".gallery-delete-btn").onclick = (e) => { e.stopPropagation(); removeFromGallery(idx); };
        el.onclick = (e) => { if (!e.target.classList.contains("gallery-delete-btn")) showGeneratedImage(getSavedGallery()[idx].src); };
    });
}
function showGeneratedImage(src) {
    modalViewingProjects = false;
    const modal = document.getElementById("project-modal");
    document.getElementById("project-modal-img").src = src;
    document.getElementById("project-modal-title").textContent = currentLang === "tr" ? "Üretilen Görsel" : "Generated Image";
    document.getElementById("project-modal-desc").textContent = currentLang === "tr" ? "AI Laboratuvarı'nda üretildi." : "Generated in AI Lab.";
    modal.classList.add("modal-open", "modal-fullscreen");
    document.body.style.overflow = "hidden";
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

    currentLang = localStorage.getItem("lang") || "tr";
    applyLang();
    document.getElementById("lang-toggle").textContent = currentLang === "tr" ? "🌐 EN" : "🌐 TR";

    renderGeneratedGallery();

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

    // Görsel üret butonu + Stil seçeneği + Galeriye ekle
    const genBtn = document.getElementById("generate-image-btn");
    const promptInput = document.getElementById("prompt-input");
    const loadingEl = document.getElementById("loading-indicator");
    const imgOut = document.getElementById("generated-image");
    const imgPlaceholder = document.getElementById("image-placeholder");
    const addGalleryBtn = document.getElementById("add-to-gallery-btn");
    const styleSelect = document.getElementById("style-select");

    if (genBtn && promptInput) {
        genBtn.addEventListener("click", function() {
            let prompt = promptInput.value.trim();
            if (!prompt) {
                alert(currentLang === "tr" ? "Lütfen görsel açıklaması yazın." : "Please enter an image description.");
                return;
            }
            const styleVal = styleSelect ? styleSelect.value : "";
            if (styleVal) prompt = styleVal + ", " + prompt;

            if (loadingEl) loadingEl.style.display = "block";
            if (imgOut) { imgOut.style.display = "none"; imgOut.src = ""; }
            if (imgPlaceholder) imgPlaceholder.style.display = "block";
            if (addGalleryBtn) addGalleryBtn.style.display = "none";

            fetch("/api/generate-image", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ prompt })
            }).then(res => res.json().then(data => ({ ok: res.ok, data }))).then(({ ok, data }) => {
                if (loadingEl) loadingEl.style.display = "none";
                if (ok && data.image) {
                    const dataUrl = "data:image/png;base64," + data.image;
                    imgOut.src = dataUrl;
                    imgOut.style.display = "block";
                    imgOut.onclick = () => showGeneratedImage(dataUrl);
                    if (imgPlaceholder) imgPlaceholder.style.display = "none";
                    if (addGalleryBtn) {
                        addGalleryBtn.style.display = "inline-block";
                        addGalleryBtn.onclick = () => { saveToGallery(dataUrl); addGalleryBtn.style.display = "none"; alert(currentLang === "tr" ? "Galeriye eklendi!" : "Added to gallery!"); };
                    }
                } else {
                    alert(data.error || (currentLang === "tr" ? "Görsel üretilemedi." : "Image generation failed."));
                }
            }).catch(() => {
                if (loadingEl) loadingEl.style.display = "none";
                alert("Görsel üretimi için backend API henüz bağlı değil.");
            });
        });
    }

    if (addGalleryBtn) addGalleryBtn.style.cursor = "pointer";
});
