//// PROJE DETAY SAYFALARI (Portfolio)
const PROJECTS = {
    1: { title: { tr: "Neon Şehir Manzarası", en: "Neon City Landscape" }, desc: { tr: "Siberpunk tema ile oluşturulmuş gelecek şehir vizyonu.", en: "Future city vision with cyberpunk theme." }, img: "img/proje1.jpg", category: "cyberpunk" },
    2: { title: { tr: "Robot Portresi", en: "Robot Portrait" }, desc: { tr: "Yapay zeka destekli robot karakter tasarımı.", en: "AI-assisted robot character design." }, img: "img/proje2.jpg", category: "karakter" },
    3: { title: { tr: "Sanal Evren", en: "Virtual Universe" }, desc: { tr: "Dijital sanat ve soyut görsel üretimi.", en: "Digital art and abstract visual generation." }, img: "img/proje3.jpg", category: "soyut" },
    4: { title: { tr: "Mekanik Bulutlar", en: "Mechanical Clouds" }, desc: { tr: "Steampunk ve futuristik karışımı konsept.", en: "Steampunk and futuristic blend concept." }, img: "img/proje4.jpg", category: "mimari" },
    5: { title: { tr: "Holografik İkon", en: "Holographic Icon" }, desc: { tr: "3D holografik efekt ile logo tasarımı.", en: "Logo design with 3D holographic effect." }, img: "img/proje5.jpg", category: "logo" },
    6: { title: { tr: "Dijital Orman", en: "Digital Forest" }, desc: { tr: "Doğa ve teknoloji sentezinde görsel.", en: "Visual in nature and technology synthesis." }, img: "img/proje6.jpg", category: "doga" },
    7: { title: { tr: "Gece Şehri", en: "Night City" }, desc: { tr: "Neon ışıklarla aydınlanan futuristik metropol manzarası.", en: "Futuristic metropolis illuminated by neon lights." }, img: "img/proje7.jpg", category: "cyberpunk" },
    8: { title: { tr: "Android Portresi", en: "Android Portrait" }, desc: { tr: "Sibernetic devrelerle bezenmiş insansı AI figürü.", en: "Humanoid AI figure with glowing cybernetic circuits." }, img: "img/proje8.jpg", category: "karakter" },
    9: { title: { tr: "Veri Evreni", en: "Data Universe" }, desc: { tr: "Neural ağ ve veri akışlarının soyut görselleştirmesi.", en: "Abstract visualization of neural networks and data streams." }, img: "img/proje9.jpg", category: "soyut" },
    10: { title: { tr: "Buhar Makinesi", en: "Steam Engine" }, desc: { tr: "Steampunk mimari: dişliler ve pirinç yapılar.", en: "Steampunk architecture: gears and brass structures." }, img: "img/proje10.jpg", category: "mimari" },
    11: { title: { tr: "Hologram Sembol", en: "Hologram Symbol" }, desc: { tr: "Prismatik holografik ikon, neon glow efekti.", en: "Prismatic holographic icon with neon glow effect." }, img: "img/proje11.jpg", category: "logo" },
    12: { title: { tr: "Biyolüminesan Orman", en: "Bioluminescent Forest" }, desc: { tr: "Teknoloji ve doğanın buluştuğu büyülü manzara.", en: "Magical landscape where technology meets nature." }, img: "img/proje12.jpg", category: "doga" }
};
const GALLERY_CATEGORIES = [
    { id: "all", tr: "Tümü", en: "All" },
    { id: "cyberpunk", tr: "Cyberpunk", en: "Cyberpunk" },
    { id: "mimari", tr: "Mimari", en: "Architecture" },
    { id: "logo", tr: "Logo", en: "Logo" },
    { id: "karakter", tr: "Karakter", en: "Character" },
    { id: "soyut", tr: "Soyut", en: "Abstract" },
    { id: "doga", tr: "Doğa", en: "Nature" }
];

let currentLang = localStorage.getItem("lang") || "tr";
let modalCurrentProject = 1;
let modalViewingProjects = false;
let vantaEffect = null;

// 4. Sesli Sistem Arayüzü – Ambient uğultu, bip, hoş geldin AI sesi
let audioCtx = null;
let ambientGain = null;
let ambientStarted = false;

function getAudioCtx() {
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    return audioCtx;
}

function playBeep() {
    if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const run = () => {
        try {
            const ctx = getAudioCtx();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.frequency.value = 880;
            osc.type = "sine";
            gain.gain.setValueAtTime(0.9, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
            osc.start(ctx.currentTime);
            osc.stop(ctx.currentTime + 0.15);
        } catch (_) {}
    };
    try {
        const ctx = getAudioCtx();
        if (ctx.state === "suspended") {
            ctx.resume().then(run);
        } else {
            run();
        }
    } catch (_) { run(); }
}

function startAmbientHum() {
    if (ambientStarted || (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches)) return;
    const run = () => {
        try {
            const ctx = getAudioCtx();
            const osc1 = ctx.createOscillator();
            const osc2 = ctx.createOscillator();
            ambientGain = ctx.createGain();
            osc1.connect(ambientGain);
            osc2.connect(ambientGain);
            ambientGain.connect(ctx.destination);
            osc1.frequency.value = 60;
            osc2.frequency.value = 90;
            osc1.type = "sine";
            osc2.type = "triangle";
            ambientGain.gain.value = 0.25;
            osc1.start();
            osc2.start();
            ambientStarted = true;
        } catch (_) {}
    };
    try {
        const ctx = getAudioCtx();
        if (ctx.state === "suspended") {
            ctx.resume().then(run);
        } else {
            run();
        }
    } catch (_) { run(); }
}

function playWelcomeVoice() {
    if (sessionStorage.getItem("omerai_welcome_played") === "1") return;
    if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!window.speechSynthesis) return;
    const doSpeak = () => {
        const u = new SpeechSynthesisUtterance(currentLang === "tr" ? "Sisteme hoş geldin patron, üretim hattı hazır." : "Welcome to the system, boss, the production line is ready.");
        u.rate = 0.9;
        u.pitch = 1;
        u.volume = 1;
        try {
            const voices = speechSynthesis.getVoices();
            const trVoice = voices.find(v => v.lang.startsWith("tr"));
            if (trVoice) u.voice = trVoice;
        } catch (_) {}
        u.onend = () => sessionStorage.setItem("omerai_welcome_played", "1");
        speechSynthesis.speak(u);
    };
    if (speechSynthesis.getVoices().length) doSpeak();
    else speechSynthesis.onvoiceschanged = () => { doSpeak(); speechSynthesis.onvoiceschanged = null; };
}

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

// Dinamik arka plan (Vanta NET + Dark Matter partiküller)
function initVanta() {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const isLight = document.documentElement.getAttribute("data-theme") === "light";
    if (isLight) {
        if (darkMatterRAF) { cancelAnimationFrame(darkMatterRAF); darkMatterRAF = null; }
        document.getElementById("vanta-bg")?.style.setProperty("visibility", "visible");
        if (typeof VANTA !== "undefined") {
            if (vantaEffect) vantaEffect.destroy();
            vantaEffect = VANTA.NET({
                el: "#vanta-bg", mouseControls: true, touchControls: true,
                color: 0x1e90ff, backgroundColor: 0xf1f5f9,
                points: 12, maxDistance: 22, spacing: 18
            });
        }
    } else {
        if (vantaEffect) { vantaEffect.destroy(); vantaEffect = null; }
        document.getElementById("vanta-bg")?.style.setProperty("visibility", "hidden");
        initDarkMatter();
    }
}

// Karanlık Madde - Vanta Black + fare etrafında dağılan neon mavi partiküller
let darkMatterRAF = null;
function initDarkMatter() {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (darkMatterRAF) cancelAnimationFrame(darkMatterRAF);
    const canvas = document.getElementById("dark-matter-canvas");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let mouseX = -999, mouseY = -999;
    const particles = [];
    const N = 80;
    const MOUSE_RADIUS = 180;
    const SCATTER_FORCE = 0.08;

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        if (particles.length === 0) {
            for (let i = 0; i < N; i++) {
                particles.push({
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height,
                    vx: (Math.random() - 0.5) * 0.5,
                    vy: (Math.random() - 0.5) * 0.5,
                    r: Math.random() * 1.5 + 0.5
                });
            }
        } else {
            for (let p of particles) {
                p.x = Math.min(p.x, canvas.width);
                p.y = Math.min(p.y, canvas.height);
            }
        }
    }
    window.addEventListener("resize", resize);
    resize();

    function setMouse(x, y) { mouseX = x; mouseY = y; }
    document.addEventListener("mousemove", function(e) { setMouse(e.clientX, e.clientY); });
    document.addEventListener("touchmove", function(e) { if (e.touches[0]) setMouse(e.touches[0].clientX, e.touches[0].clientY); }, { passive: true });
    document.addEventListener("mouseleave", function() { mouseX = -999; mouseY = -999; });

    function animate() {
        ctx.fillStyle = "#05050c";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        for (let i = 0; i < particles.length; i++) {
            const p = particles[i];
            const dx = mouseX - p.x;
            const dy = mouseY - p.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < MOUSE_RADIUS && dist > 0) {
                const f = (1 - dist / MOUSE_RADIUS) * SCATTER_FORCE;
                p.vx -= (dx / dist) * f;
                p.vy -= (dy / dist) * f;
            }
            p.vx *= 0.98;
            p.vy *= 0.98;
            p.x += p.vx;
            p.y += p.vy;
            if (p.x < 0 || p.x > canvas.width) p.vx *= -0.5;
            if (p.y < 0 || p.y > canvas.height) p.vy *= -0.5;
            p.x = Math.max(0, Math.min(canvas.width, p.x));
            p.y = Math.max(0, Math.min(canvas.height, p.y));
        }
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const a = particles[i], b = particles[j];
                const d = Math.hypot(a.x - b.x, a.y - b.y);
                if (d < 90) {
                    ctx.beginPath();
                    ctx.moveTo(a.x, a.y);
                    ctx.lineTo(b.x, b.y);
                    ctx.strokeStyle = `rgba(34, 211, 238, ${0.08 * (1 - d / 90)})`;
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            }
        }
        for (let p of particles) {
            const dx = mouseX - p.x;
            const dy = mouseY - p.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            const glow = dist < MOUSE_RADIUS ? 0.4 * (1 - dist / MOUSE_RADIUS) : 0;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(34, 211, 238, ${0.35 + glow})`;
            ctx.fill();
        }
        darkMatterRAF = requestAnimationFrame(animate);
    }
    animate();
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
        const totalProjects = Object.keys(PROJECTS).length;
        modalCurrentProject = ((modalCurrentProject - 1 + direction + totalProjects) % totalProjects) + 1;
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

// Sistem Günlüğü - AI Agent otonom durum güncellemeleri
const LOG_SOURCES = ["Agent_Alpha", "Agent_Beta", "Agent_Gamma", "System", "Neural_Core"];
const LOG_MESSAGES_TR = [
    "Yeni bir siberpunk görsel mühürlendi.",
    "Logo tasarımı tamamlandı.",
    "Veri trafiği %{n} arttı, çekirdek stabilize ediliyor.",
    "Neural link güçlendirildi.",
    "Karakter prototipi işlendi.",
    "Mimari render kuyruğa alındı.",
    "İşlem kapasitesi optimize edildi.",
    "Görsel üretim pipeline aktif.",
    "AI modeli güncellendi.",
    "Kullanıcı oturumu tespit edildi.",
    "Bellek düzenlemesi tamamlandı.",
    "Yeni müşteri talebi işleniyor.",
    "Holografik render tamamlandı.",
];
const LOG_MESSAGES_EN = [
    "A new cyberpunk visual was sealed.",
    "Logo design completed.",
    "Data traffic increased by %{n}%, core stabilizing.",
    "Neural link reinforced.",
    "Character prototype processed.",
    "Architecture render queued.",
    "Processing capacity optimized.",
    "Image generation pipeline active.",
    "AI model updated.",
    "User session detected.",
    "Memory defragmentation complete.",
    "New customer request processing.",
    "Holographic render completed.",
];
function addSystemLogEntry() {
    const container = document.getElementById("system-log-entries");
    if (!container) return;
    const now = new Date();
    const time = "[" + String(now.getHours()).padStart(2,"0") + ":" + String(now.getMinutes()).padStart(2,"0") + "]";
    const source = LOG_SOURCES[Math.floor(Math.random() * LOG_SOURCES.length)];
    const msgPool = currentLang === "tr" ? LOG_MESSAGES_TR : LOG_MESSAGES_EN;
    let msg = msgPool[Math.floor(Math.random() * msgPool.length)];
    if (msg.includes("%{n}")) msg = msg.replace("%{n}", Math.floor(Math.random() * 20) + 5);
    const entry = document.createElement("div");
    entry.className = "system-log-entry";
    entry.innerHTML = `<span class="log-time">${time}</span> <span class="log-source">${source}:</span> ${msg}`;
    container.insertBefore(entry, container.firstChild);
    while (container.children.length > 6) container.removeChild(container.lastChild);
}
function initSystemLog() {
    const container = document.getElementById("system-log-entries");
    if (!container) return;
    addSystemLogEntry();
    setTimeout(() => addSystemLogEntry(), 500);
    setTimeout(() => addSystemLogEntry(), 1200);
    setInterval(addSystemLogEntry, 8000 + Math.random() * 7000);
}

// Matrix Terminal - Processed Data sayacı (canlı, rastgele artan – fabrika veri işliyor)
function initProcessedDataCounter() {
    const el = document.getElementById("processed-data");
    if (!el) return;
    let count = 0;
    const tick = () => {
        count += Math.floor(Math.random() * 4) + 2;
        el.textContent = count.toLocaleString("tr-TR");
    };
    tick();
    setInterval(tick, 180 + Math.random() * 120);
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
                    const serialNo = getNextSerial();
                    createSealedImageDataUrl(dataUrl, serialNo).then(sealedUrl => {
                        box.innerHTML += `<p class="chat-msg bot"><b>🤖 Asistan:</b> İşte mühürlediğim görsel (Seri No: #${serialNo}):</p><div class="chat-image-wrapper"><img src="${sealedUrl}" alt="ÖMER.AI mühürlü" class="chat-generated-img" onclick="showGeneratedImage(this.src)"></div>`;
                        saveToGallery(sealedUrl, serialNo);
                        box.scrollTop = box.scrollHeight;
                        playBeep();
                    });
                } else {
                    box.innerHTML += `<p class="chat-msg bot"><b>🤖 Asistan:</b> ${data.error || (currentLang === "tr" ? "Görsel üretilemedi." : "Image generation failed.")}</p>`;
                    playBeep();
                }
                box.scrollTop = box.scrollHeight;
            })
            .catch(() => {
                typingEl.remove();
                box.innerHTML += `<p class="chat-msg bot"><b>🤖 Asistan:</b> ${currentLang === "tr" ? "Görsel API bağlantı hatası." : "Image API connection error."}</p>`;
                box.scrollTop = box.scrollHeight;
                playBeep();
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
                playBeep();
            })
            .catch(() => {
                typingEl.remove();
                box.innerHTML += `<p class="chat-msg bot"><b>🤖 Asistan:</b> ${currentLang === "tr" ? "Bağlantı hatası." : "Connection error."}</p>`;
                box.scrollTop = box.scrollHeight;
                playBeep();
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
                playBeep();
            })
            .catch(() => {
                typingEl.remove();
                box.innerHTML += `<p class="chat-msg bot"><b>🤖 Asistan:</b> ${currentLang === "tr" ? "Haber servisi hatası." : "News service error."}</p>`;
                box.scrollTop = box.scrollHeight;
                playBeep();
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
        playBeep();
    })
    .catch(() => {
        typingEl.remove();
        box.innerHTML += `<p class="chat-msg bot"><b>🤖 Asistan:</b> ${currentLang === "tr" ? "Bağlantı hatası. Tekrar dene." : "Connection error. Try again."}</p>`;
        box.scrollTop = box.scrollHeight;
        playBeep();
    })
    .finally(() => { if (input) { input.disabled = false; input.focus(); } });
}

// 3. Slider Mekanizması
let currentSlide = 0;
let currentGalleryFilter = "all";

function getFilteredProjectIds() {
    if (currentGalleryFilter === "all") return [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
    return Object.keys(PROJECTS).filter(id => PROJECTS[id].category === currentGalleryFilter).map(Number);
}

function renderFilteredSlides() {
    const track = document.getElementById("slider-track");
    if (!track) return;
    const ids = getFilteredProjectIds();
    track.innerHTML = ids.map(id => {
        const p = PROJECTS[id];
        return `<div class="slide" data-project="${id}" data-category="${p.category}" onclick="openProjectDetail(${id})"><img src="${p.img}" alt="AI ${id}"></div>`;
    }).join("");
    const n = ids.length || 1;
    track.style.setProperty("--slide-count", String(n));
    track.style.width = `${n * 100}%`;
    track.style.transform = "translateX(0)";
    currentSlide = 0;
}
function setupGalleryFilters() {
    document.querySelectorAll(".filter-btn").forEach(btn => {
        btn.addEventListener("click", function() {
            document.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
            this.classList.add("active");
            currentGalleryFilter = this.dataset.filter || "all";
            renderFilteredSlides();
        });
    });
}

function moveSlider(direction) {
    const track = document.getElementById('slider-track');
    const slides = document.querySelectorAll('.slide');
    if (track && slides.length > 0) {
        currentSlide = (currentSlide + direction + slides.length) % slides.length;
        const pct = (currentSlide / slides.length) * 100;
        track.style.transform = `translateX(-${pct}%)`;
    }
}

// 🚀 EKLEME: Otonom Slider (5 saniyede bir kendi kayar)
setInterval(() => {
    const slides = document.querySelectorAll('.slide');
    if (slides.length > 1) moveSlider(1);
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
        playBeep();
        startAmbientHum();
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
    initVanta();
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

// Mühür Sertifikasyon Sistemi – Seri no + indirildiğinde profesyonel bant
const SERIAL_KEY = "omerai_seal_serial";
function getNextSerial() {
    let n = parseInt(localStorage.getItem(SERIAL_KEY) || "4948", 10);
    n++;
    localStorage.setItem(SERIAL_KEY, String(n));
    return n;
}
function createSealedImageDataUrl(dataUrl, serialNo) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.onload = () => {
            const c = document.createElement("canvas");
            const bandH = Math.max(56, Math.floor(img.height * 0.12));
            c.width = img.width;
            c.height = img.height + bandH;
            const ctx = c.getContext("2d");
            ctx.drawImage(img, 0, 0);
            ctx.fillStyle = "rgba(0, 20, 40, 0.98)";
            ctx.fillRect(0, img.height, c.width, bandH);
            ctx.strokeStyle = "#22d3ee";
            ctx.lineWidth = 2;
            ctx.strokeRect(0, img.height, c.width, bandH);
            ctx.fillStyle = "#22d3ee";
            ctx.font = "bold 18px Consolas, Monaco, monospace";
            ctx.textAlign = "left";
            ctx.shadowColor = "rgba(34, 211, 238, 0.6)";
            ctx.shadowBlur = 8;
            ctx.fillText("ÖMER.AI Fabrikası - Seri No: #" + serialNo, 20, img.height + bandH / 2 + 6);
            ctx.shadowBlur = 0;
            const qrSize = Math.min(40, bandH - 12);
            const qrX = c.width - qrSize - 16;
            const qrY = img.height + (bandH - qrSize) / 2;
            ctx.fillStyle = "#fff";
            ctx.fillRect(qrX, qrY, qrSize, qrSize);
            ctx.strokeStyle = "#22d3ee";
            ctx.strokeRect(qrX, qrY, qrSize, qrSize);
            const cell = Math.floor(qrSize / 8);
            for (let i = 0; i < 8; i++) for (let j = 0; j < 8; j++) {
                if ((i + j + serialNo) % 3 !== 0) {
                    ctx.fillStyle = "#000";
                    ctx.fillRect(qrX + i * cell, qrY + j * cell, cell, cell);
                }
            }
            resolve(c.toDataURL("image/png"));
        };
        img.onerror = () => reject(new Error("Image load failed"));
        img.src = dataUrl;
    });
}

// Görsel galeri kaydetme – üretilen görselleri localStorage'a ekle
const GALLERY_KEY = "omerai_generated_gallery";
function getSavedGallery() {
    try { return JSON.parse(localStorage.getItem(GALLERY_KEY) || "[]"); } catch { return []; }
}
function saveToGallery(src, serialNo) {
    const g = getSavedGallery();
    g.push({ src, serialNo: serialNo || 0, id: Date.now() });
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
function loadPatronunGundemi() {
    const contentEl = document.getElementById("patronun-gundemi-content");
    const refreshBtn = document.getElementById("patronun-gundemi-refresh");
    if (!contentEl) return;
    function setLoading(loading) {
        contentEl.classList.toggle("loading", loading);
        if (refreshBtn) refreshBtn.disabled = loading;
        if (loading) contentEl.textContent = currentLang === "tr" ? "Haftalık AI bülteni yükleniyor..." : "Loading AI bulletin...";
    }
    function render(data) {
        const txt = (data && data.summary) ? data.summary : (currentLang === "tr" ? "Bülten yüklenemedi. Yenile butonuna tıkla." : "Could not load bulletin. Click Refresh.");
        contentEl.textContent = txt;
        contentEl.classList.remove("loading");
    }
    setLoading(true);
    fetch("/api/ai-news-bulletin").then(r => r.json()).then(data => {
        setLoading(false);
        render(data);
    }).catch(() => {
        setLoading(false);
        contentEl.textContent = currentLang === "tr" ? "Bülten yüklenemedi. Yenile butonuna tıkla." : "Could not load bulletin. Click Refresh.";
    });
    if (refreshBtn) refreshBtn.onclick = function() { loadPatronunGundemi(); };
}
function renderGeneratedGallery() {
    const container = document.getElementById("generated-gallery");
    if (!container) return;
    const g = getSavedGallery();
    container.innerHTML = g.map((item, i) => `
        <div class="generated-gallery-item" data-gallery-index="${i}">
            <button class="gallery-delete-btn" data-index="${i}" title="${currentLang === 'tr' ? 'Sil' : 'Delete'}">×</button>
            <img src="${item.src}" alt="ÖMER.AI mühürlü görsel">
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
    const projectImgs = [1,2,3,4,5,6,7,8,9,10,11,12].map(i => `img/proje${i}.jpg`);
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

    initVanta();
    setTimeout(playWelcomeVoice, 1200);
    function audioUnlock() {
        try {
            const ctx = getAudioCtx();
            if (ctx.state === "suspended") {
                ctx.resume().then(() => {
                    startAmbientHum();
                    if (sessionStorage.getItem("omerai_welcome_played") !== "1") setTimeout(playWelcomeVoice, 400);
                });
            } else {
                startAmbientHum();
                if (sessionStorage.getItem("omerai_welcome_played") !== "1") setTimeout(playWelcomeVoice, 400);
            }
        } catch (_) {}
    }
    document.addEventListener("click", audioUnlock, { once: true });
    document.addEventListener("keydown", audioUnlock, { once: true });
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) document.body.classList.add("no-motion");
    else {
        const cg = document.getElementById("cursor-glow");
        if (cg) {
            let rafId;
            function moveGlow(e) {
                if (rafId) cancelAnimationFrame(rafId);
                rafId = requestAnimationFrame(function() {
                    cg.style.left = e.clientX + "px";
                    cg.style.top = e.clientY + "px";
                    cg.classList.add("active");
                    rafId = null;
                });
            }
            document.addEventListener("mousemove", moveGlow);
            document.addEventListener("mouseenter", moveGlow);
            document.documentElement.addEventListener("mouseleave", function() { cg.classList.remove("active"); });
        }
    }

    currentLang = localStorage.getItem("lang") || "tr";
    applyLang();
    document.getElementById("lang-toggle").textContent = currentLang === "tr" ? "🌐 EN" : "🌐 TR";

    initProcessedDataCounter();
    initSystemLog();
    renderGeneratedGallery();
    renderLiveStream();
    renderFilteredSlides();
    setupGalleryFilters();
    loadPatronunGundemi();
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

    // Görsel üret butonu + Mühür sertifikasyonu + Galeriye ekle
    const genBtn = document.getElementById("generate-image-btn");
    const promptInput = document.getElementById("prompt-input");
    const loadingEl = document.getElementById("loading-indicator");
    const imgOut = document.getElementById("generated-image");
    const imgPlaceholder = document.getElementById("image-placeholder");
    const sealedContainer = document.getElementById("sealed-image-container");
    const addGalleryBtn = document.getElementById("add-to-gallery-btn");
    const downloadBtn = document.getElementById("download-sealed-btn");
    const sealSerialEl = document.getElementById("seal-serial");
    const sealQrEl = document.getElementById("seal-qr");
    const styleSelect = document.getElementById("style-select");

    function drawSealQR(el, serialNo) {
        if (!el) return;
        const c = document.createElement("canvas");
        c.width = 48; c.height = 48;
        const ctx = c.getContext("2d");
        ctx.fillStyle = "#fff";
        ctx.fillRect(0, 0, 48, 48);
        ctx.strokeStyle = "#22d3ee";
        ctx.lineWidth = 2;
        ctx.strokeRect(0, 0, 48, 48);
        const cell = 6;
        for (let i = 0; i < 8; i++) for (let j = 0; j < 8; j++) {
            if ((i + j + serialNo) % 3 !== 0) {
                ctx.fillStyle = "#000";
                ctx.fillRect(i * cell, j * cell, cell, cell);
            }
        }
        el.innerHTML = "";
        el.appendChild(c);
    }

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
            if (sealedContainer) sealedContainer.style.display = "none";
            if (imgPlaceholder) imgPlaceholder.style.display = "block";
            if (addGalleryBtn) addGalleryBtn.style.display = "none";
            if (downloadBtn) downloadBtn.style.display = "none";

            fetch("/api/generate-image", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ prompt })
            }).then(res => res.json().then(data => ({ ok: res.ok, data }))).then(({ ok, data }) => {
                if (loadingEl) loadingEl.style.display = "none";
                if (ok && data.image) {
                    if (useHD) spendTokens(2);
                    const dataUrl = "data:image/png;base64," + data.image;
                    const serialNo = getNextSerial();

                    imgOut.src = dataUrl;
                    imgOut.onclick = () => showGeneratedImage(dataUrl);
                    if (sealSerialEl) sealSerialEl.textContent = "#" + serialNo;
                    drawSealQR(sealQrEl, serialNo);
                    if (imgPlaceholder) imgPlaceholder.style.display = "none";
                    if (sealedContainer) sealedContainer.style.display = "inline-block";
                    if (downloadBtn) {
                        downloadBtn.style.display = "inline-block";
                        downloadBtn.onclick = () => {
                            createSealedImageDataUrl(dataUrl, serialNo).then(sealedUrl => {
                                const a = document.createElement("a");
                                a.href = sealedUrl;
                                a.download = "omerai-fabrika-seri-" + serialNo + ".png";
                                a.click();
                            });
                        };
                    }
                    if (addGalleryBtn) {
                        addGalleryBtn.style.display = "inline-block";
                        addGalleryBtn.onclick = () => {
                            createSealedImageDataUrl(dataUrl, serialNo).then(sealedUrl => {
                                saveToGallery(sealedUrl, serialNo);
                                addGalleryBtn.style.display = "none";
                                if (downloadBtn) downloadBtn.style.display = "none";
                                alert(currentLang === "tr" ? "Mühürlü görsel galeriye eklendi!" : "Sealed image added to gallery!");
                            });
                        };
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
    if (downloadBtn) downloadBtn.style.cursor = "pointer";
});
