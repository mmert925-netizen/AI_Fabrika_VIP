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
let vantaEffect = null;

// ÖMER.AI Token / Dijital Mühür Sistemi
const TOKEN_KEY = "omerai_tokens";
const TOKEN_SESSION_KEY = "omerai_session_minutes";
const TOKEN_SESSION_MAX = 5;

function getTokens() {
    return parseInt(localStorage.getItem(TOKEN_KEY) || "0", 10);
}
function addTokens(n) {
    const t = getTokens() + n;
    localStorage.setItem(TOKEN_KEY, String(Math.max(0, t)));
    updateTokenUI();
    return t;
}
function spendTokens(n) {
    const t = Math.max(0, getTokens() - n);
    localStorage.setItem(TOKEN_KEY, String(t));
    updateTokenUI();
    return t;
}
function updateTokenUI() {
    const el = document.getElementById("token-count");
    const hdCheck = document.getElementById("hd-mode-check");
    if (el) el.textContent = getTokens();
    if (hdCheck) {
        hdCheck.disabled = getTokens() < 10;
        hdCheck.title = getTokens() >= 10 ? (currentLang === "tr" ? "HD görsel için 2 mühür harcanır" : "2 tokens for HD image") : (currentLang === "tr" ? "10+ mühür gerekli" : "10+ tokens required");
    }
}
function checkTimeTokens() {
    let minutes = parseInt(sessionStorage.getItem(TOKEN_SESSION_KEY) || "0", 10);
    const now = Date.now();
    const last = parseInt(sessionStorage.getItem("omerai_last_check") || now, 10);
    const elapsed = Math.floor((now - last) / 60000);
    if (elapsed >= 2 && minutes < TOKEN_SESSION_MAX) {
        minutes++;
        sessionStorage.setItem(TOKEN_SESSION_KEY, String(minutes));
        addTokens(1);
    }
    sessionStorage.setItem("omerai_last_check", String(now));
}

// Dinamik arka plan (Vanta NET - fare tepkili neon mesh)
function initVanta() {
    if (typeof VANTA === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (vantaEffect) vantaEffect.destroy();
    const isLight = document.documentElement.getAttribute("data-theme") === "light";
    vantaEffect = VANTA.NET({
        el: "#vanta-bg",
        mouseControls: true,
        touchControls: true,
        gyroControls: false,
        minHeight: 200,
        minWidth: 200,
        scale: 1,
        scaleMobile: 1,
        color: isLight ? 0x1e90ff : 0x22d3ee,
        backgroundColor: isLight ? 0xf1f5f9 : 0x1e3a4f,
        points: 12,
        maxDistance: 22,
        spacing: 18
    });
}

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

// 2. ÖMER.AI Asistan – Gemini tabanlı gerçek AI sohbet + özel yetenekler
let chatHistory = [];

function quickAction(type) {
    const msgs = {
        görsel: currentLang === "tr" ? "Bana bir neon şehir görseli çiz" : "Draw me a neon city image",
        proje: currentLang === "tr" ? "Sergideki projeler hakkında bilgi ver" : "Tell me about the gallery projects",
        post: currentLang === "tr" ? "ÖMER.AI hakkında sosyal medya postu yaz" : "Write a social media post about ÖMER.AI",
        haber: currentLang === "tr" ? "Güncel haber özeti ver" : "Give me today's news summary",
        fiyat: currentLang === "tr" ? "Fiyatlar ve paketler hakkında bilgi ver" : "Tell me about pricing and packages",
        iletisim: currentLang === "tr" ? "İletişime nasıl geçebilirim?" : "How can I get in touch?"
    };
    sendMessage(msgs[type] || msgs.görsel);
}

function isImageRequest(text) {
    const t = text.toLowerCase();
    return /çiz|görsel|resim|draw|image|generate|üret|mühürle/.test(t) && t.length > 5;
}

function extractImagePrompt(text) {
  let cleaned = text.replace(/(çiz|görsel|resim|draw|image|generate|üret|mühürle)[\s\w]*/gi, '').trim();
    cleaned = cleaned.replace(/^(bana|bir|for me|için|please)\s+/gi, '').trim();
    return cleaned || text;
}

function sendMessage(customText) {
    const input = document.getElementById('user-input');
    const box = document.getElementById('chat-box');
    
    const userText = (customText || (input && input.value.trim()) || "").trim();
    if (!userText) return;

    if (input) { input.value = ''; input.disabled = true; }

    box.innerHTML += `<p class="chat-msg user"><b>Sen:</b> ${userText}</p>`;
    box.scrollTop = box.scrollHeight;

    const typingEl = document.createElement('p');
    typingEl.className = 'chat-msg bot typing';
    typingEl.innerHTML = '<b>🤖 Asistan:</b> <span class="typing-dots">...</span>';
    box.appendChild(typingEl);
    box.scrollTop = box.scrollHeight;

    // Görsel üretimi isteği
    if (isImageRequest(userText)) {
        const prompt = extractImagePrompt(userText);
        fetch("/api/generate-image", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ prompt }) })
            .then(res => res.json())
            .then(data => {
                typingEl.remove();
                if (data.image) {
                    const dataUrl = "data:image/png;base64," + data.image;
                    box.innerHTML += `<p class="chat-msg bot"><b>🤖 Asistan:</b> İşte mühürlediğim görsel:</p><div class="chat-image-wrapper"><img src="${dataUrl}" alt="Üretilen" class="chat-generated-img" onclick="showGeneratedImage(this.src)"></div>`;
                    saveToGallery(dataUrl);
                } else {
                    box.innerHTML += `<p class="chat-msg bot"><b>🤖 Asistan:</b> ${data.error || (currentLang === "tr" ? "Görsel üretilemedi." : "Image generation failed.")}</p>`;
                }
                box.scrollTop = box.scrollHeight;
            })
            .catch(() => {
                typingEl.remove();
                box.innerHTML += `<p class="chat-msg bot"><b>🤖 Asistan:</b> ${currentLang === "tr" ? "Görsel API bağlantı hatası." : "Image API connection error."}</p>`;
                box.scrollTop = box.scrollHeight;
            })
            .finally(() => { if (input) { input.disabled = false; input.focus(); } });
        return;
    }

    // Sosyal medya postu
    if (/post|sosyal medya|instagram|linkedin|twitter|tweet/i.test(userText)) {
        const topic = userText.replace(/(post|sosyal medya|instagram|linkedin|twitter|tweet)\s*(yaz|için|hakkında)?\s*/gi, '').trim() || 'ÖMER.AI Fabrika';
        fetch("/api/social-post", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ topic }) })
            .then(res => res.json())
            .then(data => {
                typingEl.remove();
                const post = data.post || data.error || (currentLang === "tr" ? "Post üretilemedi." : "Could not generate post.");
                box.innerHTML += `<p class="chat-msg bot"><b>🤖 Asistan:</b> ${post}</p>`;
                chatHistory.push({ role: 'user', text: userText });
                chatHistory.push({ role: 'model', text: post });
                if (chatHistory.length > 10) chatHistory = chatHistory.slice(-10);
                box.scrollTop = box.scrollHeight;
            })
            .catch(() => {
                typingEl.remove();
                box.innerHTML += `<p class="chat-msg bot"><b>🤖 Asistan:</b> ${currentLang === "tr" ? "Bağlantı hatası." : "Connection error."}</p>`;
                box.scrollTop = box.scrollHeight;
            })
            .finally(() => { if (input) { input.disabled = false; input.focus(); } });
        return;
    }

    // Haber özeti
    if (/haber|güncel|news|özet/i.test(userText)) {
        fetch("/api/news-summary")
            .then(res => res.json())
            .then(data => {
                typingEl.remove();
                const summary = data.summary || data.error || (currentLang === "tr" ? "Haber çekilemedi." : "Could not fetch news.");
                box.innerHTML += `<p class="chat-msg bot"><b>🤖 Asistan:</b> ${summary}</p>`;
                chatHistory.push({ role: 'user', text: userText });
                chatHistory.push({ role: 'model', text: summary });
                if (chatHistory.length > 10) chatHistory = chatHistory.slice(-10);
                box.scrollTop = box.scrollHeight;
            })
            .catch(() => {
                typingEl.remove();
                box.innerHTML += `<p class="chat-msg bot"><b>🤖 Asistan:</b> ${currentLang === "tr" ? "Haber servisi hatası." : "News service error."}</p>`;
                box.scrollTop = box.scrollHeight;
            })
            .finally(() => { if (input) { input.disabled = false; input.focus(); } });
        return;
    }

    // Normal sohbet (Gemini)
    fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userText, history: chatHistory })
    })
    .then(res => res.json())
    .then(data => {
        typingEl.remove();
        const reply = data.reply || data.error || (currentLang === "tr" ? "Bir yanıt alınamadı." : "Could not get a response.");
        box.innerHTML += `<p class="chat-msg bot"><b>🤖 Asistan:</b> ${reply}</p>`;
        chatHistory.push({ role: 'user', text: userText });
        chatHistory.push({ role: 'model', text: reply });
        if (chatHistory.length > 10) chatHistory = chatHistory.slice(-10);
        box.scrollTop = box.scrollHeight;
    })
    .catch(() => {
        typingEl.remove();
        box.innerHTML += `<p class="chat-msg bot"><b>🤖 Asistan:</b> ${currentLang === "tr" ? "Bağlantı hatası. Tekrar dene." : "Connection error. Try again."}</p>`;
        box.scrollTop = box.scrollHeight;
    })
    .finally(() => { if (input) { input.disabled = false; input.focus(); } });
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

// 3b. Sesli Komut (Voice Seal) – Web Speech API
let voiceSealActive = false;
let speechRecognition = null;

function getVoiceRecognition() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    return SpeechRecognition ? new SpeechRecognition() : null;
}

function toggleVoiceSeal() {
    const btn = document.getElementById("voice-seal-btn");
    const statusEl = document.getElementById("voice-seal-status");
    if (!btn) return;

    if (voiceSealActive) {
        stopVoiceSeal();
        return;
    }

    const rec = getVoiceRecognition();
    if (!rec) {
        alert(currentLang === "tr" ? "Tarayıcınız sesli komut desteklemiyor. Chrome önerilir." : "Your browser does not support voice commands. Chrome recommended.");
        return;
    }

    rec.lang = currentLang === "tr" ? "tr-TR" : "en-US";
    rec.continuous = false;
    rec.interimResults = false;

    rec.onstart = () => {
        voiceSealActive = true;
        btn.classList.add("listening");
        if (statusEl) { statusEl.style.display = "block"; statusEl.textContent = currentLang === "tr" ? "Dinliyorum..." : "Listening..."; }
    };
    rec.onend = () => {
        voiceSealActive = false;
        btn.classList.remove("listening");
        if (statusEl) statusEl.style.display = "none";
    };
    rec.onresult = (e) => {
        const text = (e.results[0][0].transcript || "").trim();
        if (!text) return;
        if (statusEl) { statusEl.textContent = '"' + text + '"'; setTimeout(() => { statusEl.style.display = "none"; }, 2000); }
        executeVoiceCommand(text);
    };
    rec.onerror = () => {
        voiceSealActive = false;
        btn.classList.remove("listening");
        if (statusEl) statusEl.style.display = "none";
    };

    speechRecognition = rec;
    rec.start();
}

function stopVoiceSeal() {
    if (speechRecognition) {
        speechRecognition.stop();
        speechRecognition = null;
    }
    voiceSealActive = false;
    const btn = document.getElementById("voice-seal-btn");
    if (btn) btn.classList.remove("listening");
    const statusEl = document.getElementById("voice-seal-status");
    if (statusEl) statusEl.style.display = "none";
}

function ensureChatOpen() {
    const chat = document.getElementById("ai-chat-widget");
    if (chat && chat.classList.contains("chat-closed")) toggleChat();
}

function executeVoiceCommand(text) {
    const t = text.toLowerCase();
    if (/sohbet|chat|aç|open/.test(t) && t.length < 15) {
        toggleChat();
        return;
    }
    if (/proje|sergi|gallery/.test(t) && !/görsel|çiz|resim/.test(t)) {
        document.getElementById("ai-gallery")?.scrollIntoView({ behavior: "smooth" });
        return;
    }
    if (/laboratuvar|lab|görsel üret/.test(t)) {
        document.getElementById("ai-lab")?.scrollIntoView({ behavior: "smooth" });
        return;
    }
    if (/iletişim|contact|form/.test(t)) {
        document.getElementById("iletisim")?.scrollIntoView({ behavior: "smooth" });
        return;
    }
    ensureChatOpen();
    setTimeout(() => sendMessage(text), 300);
}

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
    if (typeof VANTA !== "undefined") initVanta();
}

// 4c. Çoklu Dil (TR / EN)
function toggleLang() {
    currentLang = currentLang === "tr" ? "en" : "tr";
    localStorage.setItem("lang", currentLang);
    applyLang();
    updateTokenUI();
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
    renderLiveStream();
}
function removeFromGallery(index) {
    const g = getSavedGallery();
    g.splice(index, 1);
    localStorage.setItem(GALLERY_KEY, JSON.stringify(g));
    renderGeneratedGallery();
    renderLiveStream();
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
function renderLiveStream() {
    const track = document.getElementById("live-stream-track");
    if (!track) return;
    const projectImgs = [1,2,3,4,5,6].map(i => `img/proje${i}.jpg`);
    const generated = getSavedGallery().map(g => g.src);
    const allImages = [...projectImgs, ...generated];
    if (allImages.length === 0) {
        track.innerHTML = '<p class="live-stream-empty" style="color:var(--text-color); opacity:0.7;">' + (currentLang === "tr" ? "Görsel üretmeye başla!" : "Start generating images!") + '</p>';
        return;
    }
    const items = allImages.map(src => `<div class="live-stream-item"><img src="${src}" alt="Live"></div>`).join("");
    track.innerHTML = items + items;
    track.querySelectorAll(".live-stream-item").forEach(el => {
        el.onclick = () => {
            const img = el.querySelector("img");
            if (img && img.src) showGeneratedImage(img.src);
        };
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

    if (typeof VANTA !== "undefined") initVanta();
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) document.body.classList.add("no-motion");
    else {
        const cg = document.getElementById("cursor-glow");
        if (cg) {
            let rafId;
            document.addEventListener("mousemove", function(e) {
                if (rafId) cancelAnimationFrame(rafId);
                rafId = requestAnimationFrame(function() {
                    cg.style.left = e.clientX + "px";
                    cg.style.top = e.clientY + "px";
                    cg.classList.add("active");
                    rafId = null;
                });
            });
            document.addEventListener("mouseleave", function() { cg.classList.remove("active"); });
        }
    }

    currentLang = localStorage.getItem("lang") || "tr";
    applyLang();
    document.getElementById("lang-toggle").textContent = currentLang === "tr" ? "🌐 EN" : "🌐 TR";

    renderGeneratedGallery();
    renderLiveStream();
    updateTokenUI();
    if (getTokens() === 0) addTokens(3);
    setInterval(checkTimeTokens, 120000);

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

            const TELEGRAM_BOT_TOKEN = '8385745600:AAFRf0-qUiy8ooJfvzGcn_MpL77YXONGHis';
            const TELEGRAM_CHAT_ID = '7076964315';
            const text = `🚀 *Yeni Web Mesajı!*\n\n👤 *Ad:* ${name.trim()}\n📧 *E-posta:* ${email.trim()}\n📝 *Mesaj:* ${message.trim()}`;

            fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    chat_id: TELEGRAM_CHAT_ID,
                    text: text,
                    parse_mode: 'Markdown'
                })
            })
            .then(response => {
                if (response.ok) {
                    addTokens(5);
                    alert("Mührün Telegram hattına fırlatıldı patron! 🚀 +5 Dijital Mühür kazandın!");
                    form.reset();
                } else {
                    alert("Hata: Mesaj iletilemedi. Token veya ID kontrolü gerek.");
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

            const hdCheck = document.getElementById("hd-mode-check");
            const useHD = hdCheck && hdCheck.checked && getTokens() >= 2;
            if (useHD) prompt = "highly detailed, 8k resolution, professional quality, sharp focus, " + prompt;

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
                    if (useHD) spendTokens(2);
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
