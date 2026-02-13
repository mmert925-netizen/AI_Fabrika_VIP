//// TOAST BİLDİRİMLERİ – alert() yerine geçici bildirimler
function showToast(message, type = "info") {
    const container = document.getElementById("toast-container");
    if (!container) return;
    const toast = document.createElement("div");
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    container.appendChild(toast);
    requestAnimationFrame(() => toast.classList.add("toast-visible"));
    const t = setTimeout(() => {
        toast.classList.remove("toast-visible");
        setTimeout(() => toast.remove(), 300);
    }, 3500);
    toast.onclick = () => { clearTimeout(t); toast.classList.remove("toast-visible"); setTimeout(() => toast.remove(), 300); };
}

//// API CACHE – Sık kullanılan GET çağrılarını kısa süreli cache'leme
const API_CACHE = new Map();
const CACHE_TTL_MS = 2 * 60 * 1000; // 2 dakika
function fetchWithCache(url, options = {}) {
    if (options.method && options.method !== "GET") return fetch(url, options);
    const cached = API_CACHE.get(url);
    if (cached && Date.now() < cached.expires) return Promise.resolve(cached.response.clone());
    return fetch(url, options).then(res => {
        const clone = res.clone();
        API_CACHE.set(url, { response: clone, expires: Date.now() + CACHE_TTL_MS });
        return res;
    });
}

//// ÖLÇÜM VE ANALİZ – Conversion tracking, A/B test
function trackEvent(category, action, label, value) {
    if (typeof gtag === "function") {
        gtag("event", action, { event_category: category, event_label: label || "", value: value || 0 });
    }
}
function initABTest() {
    const key = "omerai_ab_variant";
    let v = localStorage.getItem(key);
    if (!v) { v = Math.random() < 0.5 ? "A" : "B"; localStorage.setItem(key, v); }
    const heroH1 = document.querySelector(".hero-text-wrap h1");
    const heroP = document.querySelector(".hero-text-wrap p");
    const ctaBtn = document.getElementById("sistem-baslat-btn");
    if (v === "B" && heroH1) {
        heroH1.setAttribute("data-tr", "AI ile Geleceği Kodla");
        heroH1.setAttribute("data-en", "Code the Future with AI");
        heroH1.textContent = currentLang === "tr" ? "AI ile Geleceği Kodla" : "Code the Future with AI";
    }
    if (v === "B" && heroP) {
        heroP.setAttribute("data-tr", "Görselleri mühürle, projeleri hayata geçir.");
        heroP.setAttribute("data-en", "Seal visuals, bring projects to life.");
        heroP.textContent = currentLang === "tr" ? "Görselleri mühürle, projeleri hayata geçir." : "Seal visuals, bring projects to life.";
    }
    if (v === "B" && ctaBtn) {
        ctaBtn.setAttribute("data-tr", "Hemen Başla");
        ctaBtn.setAttribute("data-en", "Get Started");
        ctaBtn.textContent = currentLang === "tr" ? "Hemen Başla" : "Get Started";
    }
    trackEvent("ab_test", "variant_shown", "hero_" + v);
}

//// WebP + srcset – responsive görsel HTML
const IMG_SIZES_SLIDER = "(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 800px";
const IMG_SIZES_GRID = "(max-width: 768px) 50vw, 400px";
function getProjePictureHtml(id, loading = "lazy", alt = "AI", sizes = IMG_SIZES_SLIDER) {
    const srcset = `img/proje${id}-400.webp 400w, img/proje${id}-800.webp 800w, img/proje${id}-1200.webp 1200w`;
    return `<picture><source type="image/webp" srcset="${srcset}" sizes="${sizes}"><img src="img/proje${id}.jpg" alt="${alt} ${id}" loading="${loading}" decoding="async"></picture>`;
}
function getProjeImgOrPicture(src, alt = "Live") {
    const m = src && src.match(/img\/proje(\d+)\.jpg/);
    if (m) return getProjePictureHtml(Number(m[1]), "lazy", "AI", IMG_SIZES_GRID);
    return `<img src="${src}" alt="${alt}" loading="lazy" decoding="async">`;
}

//// PROJE DETAY SAYFALARI (Portfolio)
const PROJECTS = {
    1: { title: { tr: "Neon Şehir Manzarası", en: "Neon City Landscape" }, desc: { tr: "Siberpunk tema ile oluşturulmuş gelecek şehir vizyonu.", en: "Future city vision with cyberpunk theme." }, img: "img/proje1.jpg", category: "cyberpunk", techStack: ["Gemini Imagen", "Photoshop", "Figma"] },
    2: { title: { tr: "Robot Portresi", en: "Robot Portrait" }, desc: { tr: "Yapay zeka destekli robot karakter tasarımı.", en: "AI-assisted robot character design." }, img: "img/proje2.jpg", category: "karakter", techStack: ["Imagen 4.0", "Stable Diffusion", "Blender"] },
    3: { title: { tr: "Sanal Evren", en: "Virtual Universe" }, desc: { tr: "Dijital sanat ve soyut görsel üretimi.", en: "Digital art and abstract visual generation." }, img: "img/proje3.jpg", category: "soyut", techStack: ["Gemini", "DALL·E", "Figma"] },
    4: { title: { tr: "Mekanik Bulutlar", en: "Mechanical Clouds" }, desc: { tr: "Steampunk ve futuristik karışımı konsept.", en: "Steampunk and futuristic blend concept." }, img: "img/proje4.jpg", category: "mimari", techStack: ["Blender", "Imagen", "Unity"] },
    5: { title: { tr: "Holografik İkon", en: "Holographic Icon" }, desc: { tr: "3D holografik efekt ile logo tasarımı.", en: "Logo design with 3D holographic effect." }, img: "img/proje5.jpg", category: "logo", techStack: ["Figma", "Illustrator", "Imagen"] },
    6: { title: { tr: "Dijital Orman", en: "Digital Forest" }, desc: { tr: "Doğa ve teknoloji sentezinde görsel.", en: "Visual in nature and technology synthesis." }, img: "img/proje6.jpg", category: "doga", techStack: ["Imagen 4.0", "Photoshop", "Cinema 4D"] },
    7: { title: { tr: "Gece Şehri", en: "Night City" }, desc: { tr: "Neon ışıklarla aydınlanan futuristik metropol manzarası.", en: "Futuristic metropolis illuminated by neon lights." }, img: "img/proje7.jpg", category: "cyberpunk", techStack: ["Gemini Imagen", "After Effects", "Vercel"] },
    8: { title: { tr: "Android Portresi", en: "Android Portrait" }, desc: { tr: "Sibernetic devrelerle bezenmiş insansı AI figürü.", en: "Humanoid AI figure with glowing cybernetic circuits." }, img: "img/proje8.jpg", category: "karakter", techStack: ["Imagen", "Midjourney", "Python"] },
    9: { title: { tr: "Veri Evreni", en: "Data Universe" }, desc: { tr: "Neural ağ ve veri akışlarının soyut görselleştirmesi.", en: "Abstract visualization of neural networks and data streams." }, img: "img/proje9.jpg", category: "soyut", techStack: ["TensorFlow", "Three.js", "Gemini"] },
    10: { title: { tr: "Buhar Makinesi", en: "Steam Engine" }, desc: { tr: "Steampunk mimari: dişliler ve pirinç yapılar.", en: "Steampunk architecture: gears and brass structures." }, img: "img/proje10.jpg", category: "mimari", techStack: ["Blender", "Substance", "Unreal"] },
    11: { title: { tr: "Hologram Sembol", en: "Hologram Symbol" }, desc: { tr: "Prismatik holografik ikon, neon glow efekti.", en: "Prismatic holographic icon with neon glow effect." }, img: "img/proje11.jpg", category: "logo", techStack: ["Figma", "Imagen", "React"] },
    12: { title: { tr: "Biyolüminesan Orman", en: "Bioluminescent Forest" }, desc: { tr: "Teknoloji ve doğanın buluştuğu büyülü manzara.", en: "Magical landscape where technology meets nature." }, img: "img/proje12.jpg", category: "doga", techStack: ["Imagen 4.0", "Photoshop", "Node.js"] }
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

// 4. Sesli Sistem Arayüzü – Bip, hoş geldin AI sesi (ambient kaldırıldı – kötü ses)
let audioCtx = null;

function getAudioCtx() {
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    return audioCtx;
}

function isSoundEnabled() {
    return localStorage.getItem("omerai_sound_enabled") === "1";
}

function playBeep() {
    if (!isSoundEnabled()) return;
    const run = () => {
        try {
            const ctx = getAudioCtx();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.frequency.value = 880;
            osc.type = "sine";
            gain.gain.setValueAtTime(0.5, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);
            osc.start(ctx.currentTime);
            osc.stop(ctx.currentTime + 0.12);
        } catch (_) {}
    };
    try {
        const ctx = getAudioCtx();
        if (ctx.state === "suspended") ctx.resume().then(run);
        else run();
    } catch (_) { run(); }
}

function toggleSound() {
    const currentlyOn = isSoundEnabled();
    if (currentlyOn) {
        localStorage.removeItem("omerai_sound_enabled");
        const btn = document.getElementById("sound-toggle");
        if (btn) { btn.textContent = "🔇"; btn.title = "Ses kapalı – tıkla aç"; }
    } else {
        localStorage.setItem("omerai_sound_enabled", "1");
        try {
            const ctx = getAudioCtx();
            if (ctx.state === "suspended") ctx.resume().then(runSoundOn);
            else runSoundOn();
        } catch (_) { runSoundOn(); }
    }
}
function runSoundOn() {
    try {
        playBeep();
        if (sessionStorage.getItem("omerai_welcome_played") !== "1") setTimeout(playWelcomeVoice, 400);
        const btn = document.getElementById("sound-toggle");
        if (btn) { btn.textContent = "🔊"; btn.title = "Ses açık – tıkla kapat"; }
    } catch (_) {}
}

function playWelcomeVoice() {
    if (sessionStorage.getItem("omerai_welcome_played") === "1") return;
    if (!isSoundEnabled()) return;
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

// 5. Matrix Modu (Easter Egg) – O tuşu: kod modu, glitch, görseller ASCII art
let matrixModeActive = false;
const ASCII_CHARS = " .:-=+*#%@";

function imageToAscii(img, cols = 60) {
    return new Promise((resolve) => {
        const draw = () => {
            try {
                const canvas = document.createElement("canvas");
                const ctx = canvas.getContext("2d");
                const w = img.naturalWidth || img.width;
                const h = img.naturalHeight || img.height;
                if (!w || !h) { resolve(""); return; }
                const ratio = h / w;
                const rows = Math.floor(cols * ratio * 0.5);
                canvas.width = cols;
                canvas.height = rows;
                ctx.drawImage(img, 0, 0, cols, rows);
                const data = ctx.getImageData(0, 0, cols, rows).data;
                let out = "";
                for (let y = 0; y < rows; y++) {
                    for (let x = 0; x < cols; x++) {
                        const i = (y * cols + x) * 4;
                        const r = data[i], g = data[i + 1], b = data[i + 2];
                        const bright = (r + g + b) / 3 / 255;
                        const idx = Math.min(Math.floor(bright * ASCII_CHARS.length), ASCII_CHARS.length - 1);
                        out += ASCII_CHARS[idx];
                    }
                    out += "\n";
                }
                resolve(out);
            } catch (_) { resolve(""); }
        };
        if (img.complete && img.naturalWidth) draw();
        else img.onload = draw;
    });
}

function activateMatrixMode() {
    if (matrixModeActive) return;
    matrixModeActive = true;
    document.body.classList.add("matrix-mode");
    const allImgs = document.querySelectorAll("img[src]:not([src=''])");
    const imgs = Array.from(allImgs).slice(0, 8);
    const backups = [];
    let done = 0;
    const total = imgs.length;
    imgs.forEach((img) => {
        const src = img.src;
        if (!src) {
            done++;
            if (done >= total) scheduleRevert(backups);
            return;
        }
        const wrapper = img.parentElement;
        const w = Math.max(img.offsetWidth || 200, 80);
        const h = Math.max(img.offsetHeight || 150, 60);
        const pre = document.createElement("pre");
        pre.className = "matrix-ascii";
        pre.style.width = w + "px";
        pre.style.height = h + "px";
        pre.style.minWidth = "80px";
        pre.style.minHeight = "60px";
        imageToAscii(img, 50).then((ascii) => {
            pre.textContent = ascii;
            wrapper.insertBefore(pre, img);
            img.style.display = "none";
            backups.push({ img, pre, wrapper });
            done++;
            if (done >= total) scheduleRevert(backups);
        }).catch(() => {
            done++;
            if (done >= total) scheduleRevert(backups);
        });
    });
    if (total === 0) scheduleRevert([]);
}

function scheduleRevert(backups) {
    setTimeout(() => {
        backups.forEach(({ img, pre, wrapper }) => {
            img.style.display = "";
            pre.remove();
        });
        document.body.classList.remove("matrix-mode");
        matrixModeActive = false;
    }, 2800);
}

// 7. Ghost in the Machine – Gizli terminal komutları
const GHOST_COMMANDS = ["override_49", "admin_omer"];
function triggerGhostIfCommand() {
    const input = document.getElementById("terminal-input");
    const vipSection = document.getElementById("vip-uretim-hatti");
    if (!input || !vipSection) return false;
    const cmd = (input.value || "").trim().toLowerCase();
    if (!GHOST_COMMANDS.includes(cmd)) return false;
    input.value = "";
    const overlay = document.createElement("div");
    overlay.className = "ghost-red-overlay ghost-red-soft";
    document.body.appendChild(overlay);
    setTimeout(() => overlay.remove(), 1600);
    vipSection.style.display = "flex";
    vipSection.setAttribute("aria-hidden", "false");
    vipSection.querySelector(".vip-content")?.focus();
    return true;
}
function onTerminalAction() {
    trackEvent("conversion", "cta_click", "sistem_baslat");
    if (triggerGhostIfCommand()) return;
    document.getElementById("ai-lab")?.scrollIntoView({ behavior: "smooth" });
}
function initGhostCommands() {
    const input = document.getElementById("terminal-input");
    if (!input) return;
    input.addEventListener("keydown", function(e) {
        if (e.key !== "Enter") return;
        triggerGhostIfCommand();
    });
    const startBtn = document.getElementById("sistem-baslat-btn");
    if (startBtn) startBtn.addEventListener("click", onTerminalAction);
}
function closeVipSection() {
    const vip = document.getElementById("vip-uretim-hatti");
    if (vip) {
        vip.style.display = "none";
        vip.setAttribute("aria-hidden", "true");
    }
}

// 8. Live GPU Load Simülasyonu – Sanal işlem gücü waveform
function initGpuLoadSimulation() {
    const canvas = document.getElementById("gpu-load-canvas");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const w = canvas.width, h = canvas.height;
    let currentLoad = 0.08;
    let targetLoad = 0.08;
    let coolingDown = false;
    const history = [];
    const historyLen = 60;
    for (let i = 0; i < historyLen; i++) history.push(0.08);

    function draw() {
        if (coolingDown) targetLoad = Math.max(0.05, targetLoad - 0.008);
        else if (targetLoad > 0.08) targetLoad = Math.min(0.98, targetLoad + 0.15);
        currentLoad += (targetLoad - currentLoad) * 0.12;
        history.push(currentLoad);
        if (history.length > historyLen) history.shift();

        ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
        ctx.fillRect(0, 0, w, h);
        ctx.strokeStyle = "rgba(34, 211, 238, 0.9)";
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        const step = w / (historyLen - 1);
        history.forEach((v, i) => {
            const x = i * step;
            const y = h - v * h * 0.92 - 2;
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        });
        ctx.stroke();
    }

    function loop() {
        draw();
        requestAnimationFrame(loop);
    }
    loop();

    window.gpuLoadPeak = function() { targetLoad = 0.95; coolingDown = false; };
    window.gpuLoadCoolDown = function() { coolingDown = true; };
}

// 9. Dinamik Teklif ve Proje Sihirbazı
const WIZARD_ESTIMATES = {
    project: { website: 10, "ai-bot": 18, "image-ai": 14, mobile: 22, ecommerce: 16, automation: 12, other: 15 },
    scope: { simple: 0.7, medium: 1, complex: 1.4 },
    urgency: { normal: 1, urgent: 0.85, critical: 0.75 }
};
function initDemoPrompts() {
    document.querySelectorAll(".demo-chip:not(.web-demo)").forEach(btn => {
        btn.addEventListener("click", function() {
            const prompt = this.getAttribute("data-prompt");
            const input = document.getElementById("prompt-input");
            if (input && prompt) {
                input.value = prompt;
                input.focus();
                document.getElementById("ai-lab")?.scrollIntoView({ behavior: "smooth", block: "center" });
                trackEvent("engagement", "demo_prompt_click", "image_" + (this.textContent || "").trim());
            }
        });
    });
    document.querySelectorAll(".demo-chip.web-demo").forEach(btn => {
        btn.addEventListener("click", function() {
            const prompt = this.getAttribute("data-prompt");
            const input = document.getElementById("web-prompt-input");
            if (input && prompt) {
                input.value = prompt;
                input.focus();
                document.getElementById("web-sablon-lab")?.scrollIntoView({ behavior: "smooth", block: "center" });
                trackEvent("engagement", "demo_prompt_click", "web_" + (this.textContent || "").trim());
            }
        });
    });
}

function initProjectWizard() {
    const wizard = document.getElementById("project-wizard");
    if (!wizard) return;
    const steps = wizard.querySelectorAll(".wizard-step");
    const progressBar = document.getElementById("wizard-progress-bar");
    const stepIndicator = document.getElementById("wizard-step-indicator");
    const backBtn = document.getElementById("wizard-back");
    const wizardDataEl = document.getElementById("wizard-data");

    let currentStep = 1;
    const answers = { project: null, scope: null, urgency: null };

    function goToStep(step) {
        currentStep = step;
        steps.forEach(s => {
            s.classList.toggle("active", parseInt(s.dataset.step) === step);
        });
        if (progressBar) progressBar.style.width = (step / 4) * 100 + "%";
        if (stepIndicator) stepIndicator.textContent = step + "/4";
        if (backBtn) backBtn.style.display = step > 1 ? "inline-block" : "none";

        if (step === 4) {
            const days = calcEstimate();
            const complexity = calcComplexity();
            const elDays = document.getElementById("wizard-estimate-days");
            const elComplexity = document.getElementById("wizard-complexity");
            if (elDays) elDays.textContent = days + " " + (currentLang === "tr" ? "gün" : "days");
            if (elComplexity) elComplexity.textContent = "%" + complexity;
            const labels = { website: "Web", "ai-bot": "AI Bot", "image-ai": "Görsel AI", mobile: "Mobil", ecommerce: "E-ticaret", automation: "Otomasyon", other: "Diğer" };
            const scopeLabels = { simple: "Basit", medium: "Orta", complex: "Karmaşık" };
            const urgencyLabels = { normal: "Normal", urgent: "Acil", critical: "Çok acil" };
            const summary = `${labels[answers.project] || answers.project} | ${scopeLabels[answers.scope]} | ${urgencyLabels[answers.urgency]} → ${days} gün, %${complexity} karmaşıklık`;
            if (wizardDataEl) wizardDataEl.value = summary;
        }
    }

    function calcEstimate() {
        const base = WIZARD_ESTIMATES.project[answers.project] || 12;
        const scopeMult = WIZARD_ESTIMATES.scope[answers.scope] || 1;
        const urgencyMult = WIZARD_ESTIMATES.urgency[answers.urgency] || 1;
        return Math.round(base * scopeMult * urgencyMult);
    }

    function calcComplexity() {
        const projMap = { website: 45, "ai-bot": 75, "image-ai": 65, mobile: 80, ecommerce: 60, automation: 55, other: 50 };
        const scopeMap = { simple: 25, medium: 50, complex: 80 };
        const base = projMap[answers.project] || 50;
        const scopeAdd = scopeMap[answers.scope] || 50;
        return Math.min(95, Math.round((base + scopeAdd) / 2));
    }

    wizard.querySelectorAll(".wizard-option").forEach(btn => {
        btn.addEventListener("click", function() {
            const step = parseInt(btn.closest(".wizard-step")?.dataset.step || 1);
            const value = btn.dataset.value;
            if (step === 1) answers.project = value;
            else if (step === 2) answers.scope = value;
            else if (step === 3) answers.urgency = value;
            btn.closest(".wizard-options")?.querySelectorAll(".wizard-option").forEach(b => b.classList.remove("selected"));
            btn.classList.add("selected");
            if (step < 4) goToStep(step + 1);
        });
    });

    if (backBtn) backBtn.addEventListener("click", () => goToStep(Math.max(1, currentStep - 1)));
    wizard.querySelector(".wizard-back-btn")?.addEventListener("click", () => goToStep(3));
}

// 6. Neuro-Sync Adaptif Arayüz – Laboratuvarda vakit geçirince fabrika kaynakları oraya aktarılır
function initNeuroSync() {
    if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const lab = document.getElementById("ai-lab");
    if (!lab) return;
    let labTimer = null;
    let labFocused = false;
    const LAB_DURATION_MS = 5500;

    const observer = new IntersectionObserver((entries) => {
        const ent = entries[0];
        if (!ent) return;
        const inLab = ent.isIntersecting && ent.intersectionRatio >= 0.25;
        if (inLab) {
            if (!labTimer) {
                labTimer = setTimeout(() => {
                    labFocused = true;
                    document.body.classList.add("neuro-sync-lab");
                    labTimer = null;
                }, LAB_DURATION_MS);
            }
        } else {
            if (labTimer) { clearTimeout(labTimer); labTimer = null; }
            if (labFocused) {
                labFocused = false;
                document.body.classList.remove("neuro-sync-lab");
            }
        }
    }, { threshold: [0, 0.1, 0.25, 0.5] });

    observer.observe(lab);
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
    const el = document.getElementById("token-count");     const badge = document.getElementById("token-badge");
    const hdCheck = document.getElementById("hd-mode-check");
    const prev = parseInt(el?.textContent || "0", 10);
    const next = getTokens();
    if (el) {
        animateCount(el, prev, next, 300);
        el.classList.remove("token-pulse");
        void el.offsetWidth;
        el.classList.add("token-pulse");
        setTimeout(() => el.classList.remove("token-pulse"), 500);
    }
    if (badge && next > prev) badge.classList.add("counter-glow");
    if (badge) setTimeout(() => badge.classList.remove("counter-glow"), 600);
    if (hdCheck) {
        hdCheck.disabled = next < 10;
        hdCheck.title = next >= 10 ? (currentLang === "tr" ? "HD görsel için 2 mühür harcanır" : "2 tokens for HD image") : (currentLang === "tr" ? "10+ mühür gerekli" : "10+ tokens required");
    }
}
function animateCount(el, from, to, duration) {
    if (from === to) { el.textContent = to; return; }
    const start = performance.now();
    const step = (now) => {
        const t = Math.min((now - start) / duration, 1);
        const eased = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
        const val = Math.round(from + (to - from) * eased);
        el.textContent = val.toLocaleString ? val.toLocaleString("tr-TR") : val;
        if (t < 1) requestAnimationFrame(step);
        else el.textContent = to.toLocaleString ? to.toLocaleString("tr-TR") : to;
    };
    requestAnimationFrame(step);
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

// Dinamik arka plan (Vanta NET + Dark Matter partiküller) – mobilde devre dışı (performans)
function initVanta() {
    if (window.OMERAI_MOBILE) return;
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
    if (window.OMERAI_MOBILE) return;
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
    const techEl = document.getElementById("project-modal-tech");
    if (techEl) {
        const stack = p.techStack || [];
        const label = currentLang === "tr" ? "Teknoloji:" : "Tech Stack:";
        techEl.innerHTML = stack.length ? `<span class="project-tech-label">${label}</span> ` + stack.map(t => `<span class="project-tech-tag">${t}</span>`).join("") : "";
        techEl.style.display = stack.length ? "block" : "none";
    }
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

// Health Check Panel – Telegram, Imagen, Vercel gerçek durum
function updateHealthPanel(data) {
    if (!data?.services) return;
    const onlineStr = currentLang === "tr" ? "Çevrimiçi" : "Online";
    ["telegram", "imagen", "vercel"].forEach(key => {
        const s = data.services[key];
        const statusEl = document.getElementById("health-" + key);
        const msEl = document.getElementById("health-" + key + "-ms");
        if (!statusEl) return;
        const statusClass = s?.status || "unknown";
        statusEl.textContent = s?.status === "online" ? onlineStr : (s?.message || "—");
        statusEl.className = "health-service-status " + statusClass;
        if (msEl) msEl.textContent = s?.latency != null ? s.latency + "ms" : "";
    });
}
function fetchHealthCheck() {
    const t0 = Date.now();
    fetchWithCache("/api/health")
        .then(r => r.json())
        .then(data => {
            if (data.services?.vercel && data.services.vercel.latency == null) {
                data.services.vercel.latency = Date.now() - t0;
            }
            updateHealthPanel(data);
        })
        .catch(() => {
            updateHealthPanel({
                services: {
                    telegram: { status: "offline", latency: null, message: "—" },
                    imagen: { status: "offline", latency: null, message: "—" },
                    vercel: { status: "offline", latency: null, message: "—" }
                }
            });
        });
}
function initHealthCheck() {
    fetchHealthCheck();
    const refreshBtn = document.getElementById("health-check-refresh");
    if (refreshBtn) refreshBtn.addEventListener("click", () => { refreshBtn.classList.add("spinning"); setTimeout(() => refreshBtn.classList.remove("spinning"), 500); fetchHealthCheck(); });
    setInterval(fetchHealthCheck, 60000);
}

// Matrix Terminal - Processed Data sayacı (canlı, rastgele artan – fabrika veri işliyor)
function initProcessedDataCounter() {
    const el = document.getElementById("processed-data");
    if (!el) return;
    let count = 0;
    const tick = () => {
        const prev = count;
        count += Math.floor(Math.random() * 4) + 2;
        el.textContent = count.toLocaleString("tr-TR");
        el.classList.remove("counter-pulse");
        void el.offsetWidth;
        el.classList.add("counter-pulse");
        setTimeout(() => el.classList.remove("counter-pulse"), 400);
    };
    tick();
    setInterval(tick, 180 + Math.random() * 120);
}

// 2. ÖMER.AI Asistan – Gemini tabanlı gerçek AI sohbet + özel yetenekler
let chatHistory = [];

// Markdown → HTML (güvenli, XSS korumalı)
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}
function parseMarkdown(text) {
    if (!text || typeof text !== 'string') return '';
    let s = escapeHtml(text);
    s = s.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    s = s.replace(/\*(.+?)\*/g, '<em>$1</em>');
    s = s.replace(/`([^`]+)`/g, '<code>$1</code>');
    s = s.replace(/\n/g, '<br>');
    return s;
}

// Önerilen sorular (yanıta göre bağlamsal)
function getSuggestedQuestions(lastReply) {
    const t = (lastReply || '').toLowerCase();
    const suggestions = [];
    if (/fiyat|paket|₺|tl/.test(t)) {
        suggestions.push(currentLang === "tr" ? "Proje ne kadar sürer?" : "How long does a project take?");
        suggestions.push(currentLang === "tr" ? "Ödeme nasıl yapılır?" : "How do I pay?");
    }
    if (/görsel|resim|imagen/.test(t) || suggestions.length === 0) {
        suggestions.push(currentLang === "tr" ? "Bana bir görsel çiz" : "Draw me an image");
    }
    if (/web|site|tasarım/.test(t) || suggestions.length < 2) {
        suggestions.push(currentLang === "tr" ? "Web tasarımı yap" : "Create a web design");
    }
    if (/proje|sergi/.test(t) || suggestions.length < 3) {
        suggestions.push(currentLang === "tr" ? "Projeler hakkında bilgi ver" : "Tell me about projects");
    }
    return [...new Set(suggestions)].slice(0, 3);
}

function quickAction(type) {
    const msgs = {
        görsel: currentLang === "tr" ? "Bana bir neon şehir görseli çiz" : "Draw me a neon city image",
        proje: currentLang === "tr" ? "Sergideki projeler hakkında bilgi ver" : "Tell me about the gallery projects",
        post: currentLang === "tr" ? "ÖMER.AI hakkında sosyal medya postu yaz" : "Write a social media post about ÖMER.AI",
        web: currentLang === "tr" ? "Web tasarımı yap restoran için landing page" : "Web design a landing page for a restaurant",
        haber: currentLang === "tr" ? "Güncel haber özeti ver" : "Give me today's news summary",
        fiyat: currentLang === "tr" ? "Fiyatlar ve paketler hakkında bilgi ver" : "Tell me about pricing and packages",
        yardim: currentLang === "tr" ? "Ne yapabilirsin? Hangi komutları kullanabilirim?" : "What can you do? What commands can I use?",
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

function isWebDesignRequest(text) {
    const t = text.toLowerCase();
    return /web tasarım|web tasarımı|site tasarım|html sayfa|landing page|web şablon|web template|web sayfa|site yap/i.test(t) || t.includes('web tasarım');
}

function extractWebPrompt(text) {
    let cleaned = text.replace(/(web tasarımı?|site tasarım|html sayfa|landing page|web şablon|web template|web sayfa|site yap)\s*(yap|oluştur|üret|for|make|create)?\s*/gi, '').trim();
    cleaned = cleaned.replace(/^(bana|bir|for me|için|please)\s+/gi, '').trim();
    return cleaned || 'Modern landing page';
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
        if (typeof window.gpuLoadPeak === "function") window.gpuLoadPeak();
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
                if (typeof window.gpuLoadCoolDown === "function") window.gpuLoadCoolDown();
                box.scrollTop = box.scrollHeight;
            })
            .catch(() => {
                typingEl.remove();
                if (typeof window.gpuLoadCoolDown === "function") window.gpuLoadCoolDown();
                box.innerHTML += `<p class="chat-msg bot"><b>🤖 Asistan:</b> ${currentLang === "tr" ? "Görsel API bağlantı hatası." : "Image API connection error."}</p>`;
                box.scrollTop = box.scrollHeight;
                playBeep();
            })
            .finally(() => { if (input) { input.disabled = false; input.focus(); } });
        return;
    }

    // Web tasarımı / HTML şablon üretimi
    if (isWebDesignRequest(userText)) {
        const prompt = extractWebPrompt(userText);
        if (typeof window.gpuLoadPeak === "function") window.gpuLoadPeak();
        fetch("/api/generate-web", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ prompt }) })
            .then(res => res.json())
            .then(data => {
                typingEl.remove();
                if (data.html) {
                    const safeHtml = data.html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
                    const blob = new Blob([safeHtml], { type: 'text/html' });
                    const url = URL.createObjectURL(blob);
                    const previewId = 'web-preview-' + Date.now();
                    box.innerHTML += `<p class="chat-msg bot"><b>🤖 Asistan:</b> ${currentLang === "tr" ? "İşte mühürlediğim web şablonu:" : "Here's your web template:"}</p>
                        <div class="chat-web-preview"><iframe id="${previewId}" sandbox="allow-same-origin" title="Önizleme" style="width:100%;height:280px;border:1px solid var(--border-color);border-radius:8px;background:#fff;"></iframe>
                        <div class="chat-web-actions"><a href="${url}" download="omerai-web-sablon.html" class="neon-button add-gallery-btn" style="display:inline-block;margin-top:8px;text-decoration:none;">${currentLang === "tr" ? "📥 HTML İndir" : "📥 Download HTML"}</a></div></div>`;
                    const iframe = document.getElementById(previewId);
                    if (iframe) {
                        iframe.srcdoc = safeHtml;
                    }
                    box.scrollTop = box.scrollHeight;
                    playBeep();
                } else {
                    box.innerHTML += `<p class="chat-msg bot"><b>🤖 Asistan:</b> ${data.error || (currentLang === "tr" ? "Web şablonu üretilemedi." : "Web template generation failed.")}</p>`;
                    playBeep();
                }
                if (typeof window.gpuLoadCoolDown === "function") window.gpuLoadCoolDown();
                box.scrollTop = box.scrollHeight;
            })
            .catch(() => {
                typingEl.remove();
                if (typeof window.gpuLoadCoolDown === "function") window.gpuLoadCoolDown();
                box.innerHTML += `<p class="chat-msg bot"><b>🤖 Asistan:</b> ${currentLang === "tr" ? "Web API bağlantı hatası." : "Web API connection error."}</p>`;
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
                box.innerHTML += `<p class="chat-msg bot"><b>🤖 Asistan:</b> <span class="bot-reply-content">${parseMarkdown(post)}</span></p>`;
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
        fetchWithCache("/api/news-summary")
            .then(res => res.json())
            .then(data => {
                typingEl.remove();
                const summary = data.summary || data.error || (currentLang === "tr" ? "Haber çekilemedi." : "Could not fetch news.");
                box.innerHTML += `<p class="chat-msg bot"><b>🤖 Asistan:</b> <span class="bot-reply-content">${parseMarkdown(summary)}</span></p>`;
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
        box.innerHTML += `<p class="chat-msg bot"><b>🤖 Asistan:</b> <span class="bot-reply-content">${parseMarkdown(reply)}</span></p>`;
        const suggestions = getSuggestedQuestions(reply);
        if (suggestions.length > 0) {
            window._lastSuggestions = suggestions;
            const chips = suggestions.map((s, i) => `<button class="suggestion-chip" data-idx="${i}" onclick="sendMessage(window._lastSuggestions?.[this.dataset.idx]||'')">${escapeHtml(s)}</button>`).join('');
            box.innerHTML += `<div class="suggestion-chips">${chips}</div>`;
        }
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
        return `<div class="slide" data-project="${id}" data-category="${p.category}" onclick="openProjectDetail(${id})">${getProjePictureHtml(id, "lazy", "AI")}</div>`;
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
        showToast(currentLang === "tr" ? "Tarayıcınız sesli komut desteklemiyor. Chrome önerilir." : "Your browser does not support voice commands. Chrome recommended.", "warn");
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

// Sesli giriş – input yanındaki mikrofondan doğrudan sohbet
function startChatVoiceInput(e) {
    if (e) e.stopPropagation();
    const rec = getVoiceRecognition();
    if (!rec) {
        showToast(currentLang === "tr" ? "Tarayıcınız sesli giriş desteklemiyor. Chrome önerilir." : "Your browser doesn't support voice input. Chrome recommended.", "warn");
        return;
    }
    const btn = document.getElementById("chat-mic-btn");
    if (btn) btn.classList.add("listening");
    rec.lang = currentLang === "tr" ? "tr-TR" : "en-US";
    rec.continuous = false;
    rec.interimResults = false;
    rec.onresult = (ev) => {
        const text = (ev.results[0][0].transcript || "").trim();
        if (text) sendMessage(text);
    };
    rec.onend = () => { if (btn) btn.classList.remove("listening"); };
    rec.onerror = () => { if (btn) btn.classList.remove("listening"); };
    rec.start();
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
function showChatWelcome() {
    const box = document.getElementById("chat-box");
    if (!box || box.children.length > 0) return;
    const welcome = currentLang === "tr"
        ? "Merhaba patron! 👋 Ben ÖMER.AI Asistan. Görsel üretebilir, web şablonu mühürleyebilir, post yazabilir, fiyat/süre tahmini verebilirim. Ne yapmamı istersin?"
        : "Hello boss! 👋 I'm ÖMER.AI Assistant. I can generate images, create web templates, write posts, give price/time estimates. What would you like?";
    box.innerHTML = `<p class="chat-msg bot"><b>🤖 Asistan:</b> <span class="bot-reply-content">${parseMarkdown(welcome)}</span></p>`;
    const suggestions = currentLang === "tr"
        ? ["Bana bir görsel çiz", "Fiyatlar nedir?", "Web tasarımı yap"]
        : ["Draw me an image", "What are the prices?", "Create a web design"];
    window._lastSuggestions = suggestions;
    const chips = suggestions.map((s, i) => `<button class="suggestion-chip" data-idx="${i}" onclick="sendMessage(window._lastSuggestions?.[this.dataset.idx]||'')">${escapeHtml(s)}</button>`).join('');
    box.innerHTML += `<div class="suggestion-chips">${chips}</div>`;
}

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
        chat.classList.add("chat-open");
        chat.classList.remove("chat-closed");
        toggleBtn.classList.remove("visible");
        localStorage.setItem("chatOpen", "true");
        showChatWelcome();
        trackEvent("engagement", "chat_opened", "conversion");
    }
}

// 4b. Tema (Karanlık/Aydınlık) Yönetimi
// Cookie banner (KVKK)
function acceptCookies() {
    localStorage.setItem("omerai_cookies_accepted", "1");
    const banner = document.getElementById("cookie-banner");
    if (banner) banner.classList.add("hidden");
}
function initCookieBanner() {
    if (localStorage.getItem("omerai_cookies_accepted") === "1") {
        const banner = document.getElementById("cookie-banner");
        if (banner) banner.classList.add("hidden");
    }
}

// Newsletter formu
function initNewsletterForm() {
    const form = document.getElementById("newsletter-form");
    if (!form) return;
    form.addEventListener("submit", function(e) {
        e.preventDefault();
        const email = form.querySelector('input[type="email"]').value.trim();
        if (!email) return;
        trackEvent("conversion", "newsletter_subscribe", "email_signup");
        showToast(currentLang === "tr" ? "Aboneliğiniz alındı! Teşekkürler." : "Subscription received! Thank you.", "success");
        form.reset();
    });
}

// Mobil hamburger menü
function toggleMobileNav() {
    const menu = document.getElementById("nav-menu");
    const btn = document.getElementById("nav-hamburger");
    if (!menu || !btn) return;
    menu.classList.toggle("open");
    btn.classList.toggle("open");
    btn.setAttribute("aria-expanded", menu.classList.contains("open"));
}

// Menü linkine tıklanınca mobil menüyü kapat
document.addEventListener("click", function(e) {
    if (window.innerWidth > 768) return;
    const menu = document.getElementById("nav-menu");
    const btn = document.getElementById("nav-hamburger");
    if (menu?.classList.contains("open") && e.target.closest("nav a")) {
        menu.classList.remove("open");
        if (btn) { btn.classList.remove("open"); btn.setAttribute("aria-expanded", "false"); }
    }
});

// Yukarı çık butonu
function scrollToTop() {
    window.scrollTo({ top: 0, behavior: "smooth" });
}
function initBackToTop() {
    const btn = document.getElementById("back-to-top");
    if (!btn) return;
    window.addEventListener("scroll", () => {
        btn.classList.toggle("visible", window.scrollY > 400);
    });
}

const SECTION_LABELS = { home: { tr: "Ana Sayfa", en: "Home" }, "ai-gallery": { tr: "AI Sergi", en: "AI Gallery" }, "live-stream": { tr: "Canlı Akış", en: "Live Stream" }, "ai-lab": { tr: "AI Laboratuvarı", en: "AI Lab" }, "web-sablon-lab": { tr: "Web Şablon", en: "Web Template" }, hizmetler: { tr: "Hizmetler", en: "Services" }, fiyatlandirma: { tr: "Fiyatlar", en: "Pricing" }, referanslar: { tr: "Referanslar", en: "References" }, testimonials: { tr: "Yorumlar", en: "Reviews" }, portal: { tr: "Müşteri Portalı", en: "Client Portal" }, iletisim: { tr: "İletişim", en: "Contact" }, blog: { tr: "Blog", en: "Blog" } };
function initBreadcrumb() {
    const bc = document.getElementById("breadcrumb");
    if (!bc) return;
    function update() {
        const hash = _activeSectionId || (location.hash || "#home").slice(1);
        const labels = SECTION_LABELS[hash];
        const homeLabel = currentLang === "tr" ? "Ana Sayfa" : "Home";
        const currentLabel = labels ? (labels[currentLang] || labels.tr) : hash;
        bc.innerHTML = hash === "home" ? `<a href="#home">${homeLabel}</a>` : `<a href="#home">${homeLabel}</a><span class="breadcrumb-sep">›</span><span>${currentLabel}</span>`;
    }
    window.updateBreadcrumb = update;
    update();
    window.addEventListener("hashchange", update);
    window.addEventListener("scroll", () => { if (document.querySelector("#nav-menu a.nav-active")) update(); });
}

let _activeSectionId = "home";
function initScrollSpy() {
    const navLinks = document.querySelectorAll("#nav-menu a[href^='#']");
    const targetIds = [...navLinks].map(a => (a.getAttribute("href") || "").slice(1)).filter(Boolean);
    const observed = targetIds.map(id => document.getElementById(id)).filter(Boolean);
    if (!observed.length || !navLinks.length) return;
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            const id = entry.target.id;
            _activeSectionId = id;
            navLinks.forEach(a => {
                const href = (a.getAttribute("href") || "").slice(1);
                a.classList.toggle("nav-active", href === id);
            });
            if (typeof window.updateBreadcrumb === "function") window.updateBreadcrumb();
        });
    }, { rootMargin: "-30% 0px -60% 0px", threshold: 0 });
    observed.forEach(el => observer.observe(el));
}

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
    if (typeof window.updateBreadcrumb === "function") window.updateBreadcrumb();
    document.querySelectorAll("[data-tr], [data-en], [data-title-tr], [data-title-en]").forEach(el => {
        if (el.hasAttribute("data-placeholder-tr") || el.hasAttribute("data-placeholder-en")) {
            const ph = el.getAttribute("data-placeholder-" + currentLang) || el.getAttribute("data-placeholder-tr");
            if (ph) el.placeholder = ph;
        } else if (el.hasAttribute("data-title-tr") || el.hasAttribute("data-title-en")) {
            const t = el.getAttribute("data-title-" + currentLang) || el.getAttribute("data-title-tr");
            if (t) el.title = t;
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
const PORTAL_STORAGE_KEY = "omerai_portal_session";
function initPortalClient() {
    const loginEl = document.getElementById("portal-login");
    const dashboardEl = document.getElementById("portal-dashboard");
    const loginBtn = document.getElementById("portal-login-btn");
    const logoutBtn = document.getElementById("portal-logout");
    const orderInput = document.getElementById("portal-order-code");

    function openDashboard(projectStage) {
        const stage = Math.min(4, Math.max(1, projectStage || 4));
        if (loginEl) loginEl.style.display = "none";
        if (dashboardEl) dashboardEl.style.display = "block";
        const bar = document.getElementById("portal-progress-bar");
        const downloads = document.getElementById("portal-downloads");
        if (bar) bar.style.width = (stage / 4) * 100 + "%";
        document.querySelectorAll(".portal-stage").forEach((el, i) => {
            el.classList.toggle("active", i + 1 === stage);
            el.classList.toggle("completed", i + 1 < stage);
        });
        if (downloads) downloads.style.display = stage >= 4 ? "block" : "none";
        localStorage.setItem(PORTAL_STORAGE_KEY, JSON.stringify({ stage, ts: Date.now() }));
    }

    function closeDashboard() {
        if (loginEl) loginEl.style.display = "block";
        if (dashboardEl) dashboardEl.style.display = "none";
        localStorage.removeItem(PORTAL_STORAGE_KEY);
    }

    const session = (() => { try { return JSON.parse(localStorage.getItem(PORTAL_STORAGE_KEY) || "{}"); } catch { return {}; }})();
    if (session.stage && session.ts && Date.now() - session.ts < 86400000) {
        openDashboard(session.stage);
    }

    if (loginBtn && orderInput) {
        loginBtn.addEventListener("click", () => {
            const v = (orderInput.value || "").trim().toLowerCase();
            if (v === "demo" || v === "demo@omer.ai" || v === "demo@omer.ai".replace(".", "")) {
                openDashboard(4);
            } else if (v) {
                openDashboard(v.length > 3 ? 2 : 1);
            } else {
                showToast(currentLang === "tr" ? "Lütfen sipariş kodu veya e-posta girin." : "Please enter order code or email.", "warn");
            }
        });
        orderInput.addEventListener("keypress", (e) => { if (e.key === "Enter") loginBtn.click(); });
    }
    if (logoutBtn) logoutBtn.addEventListener("click", closeDashboard);

    document.getElementById("portal-dl-logo")?.addEventListener("click", () => {
        const serial = getNextSerial();
        const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="256" height="128" viewBox="0 0 256 128"><rect fill="#0f172a" width="256" height="128"/><text x="128" y="72" font-family="Consolas,monospace" font-size="32" fill="#22d3ee" text-anchor="middle">ÖMER.AI</text><text x="128" y="100" font-family="Consolas,monospace" font-size="10" fill="#22d3ee" text-anchor="middle">Seri No: #${serial}</text></svg>`;
        const blob = new Blob([svg], { type: "image/svg+xml" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "omerai-fabrika-logo-seri-" + serial + ".svg";
        a.click();
        URL.revokeObjectURL(url);
    });
    document.getElementById("portal-dl-code")?.addEventListener("click", () => {
        const serial = getNextSerial();
        const code = `/* ÖMER.AI Fabrikası - Mühürlü Kod - Seri No: #${serial} */
/* ${new Date().toISOString()} */

// Örnek modül - ÖMER.AI üretimi
export default function omeraiModule() {
  return "ÖMER.AI - Gelecek Burada Mühürlendi.";
}
`;
        const blob = new Blob([code], { type: "text/plain" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "omerai-fabrika-kod-seri-" + serial + ".js";
        a.click();
        URL.revokeObjectURL(url);
    });
    document.getElementById("portal-dl-visual")?.addEventListener("click", () => {
        const serial = getNextSerial();
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.onload = () => {
            createSealedImageDataUrl(img.src, serial).then(sealedUrl => {
                const a = document.createElement("a");
                a.href = sealedUrl;
                a.download = "omerai-fabrika-gorsel-seri-" + serial + ".png";
                a.click();
            });
        };
        img.src = "img/proje1.jpg";
    });
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
    const skeletonEl = document.getElementById("patronun-gundemi-skeleton");
    const refreshBtn = document.getElementById("patronun-gundemi-refresh");
    if (!contentEl) return;
    function setLoading(loading) {
        if (skeletonEl) skeletonEl.style.display = loading ? "block" : "none";
        contentEl.style.display = loading ? "none" : "block";
        contentEl.classList.toggle("loading", loading);
        if (refreshBtn) refreshBtn.disabled = loading;
        if (loading) contentEl.textContent = currentLang === "tr" ? "Haftalık AI bülteni yükleniyor..." : "Loading AI bulletin...";
    }
    function render(data) {
        const txt = (data && data.summary) ? data.summary : (currentLang === "tr" ? "Bülten yüklenemedi. Yenile butonuna tıkla." : "Could not load bulletin. Click Refresh.");
        contentEl.textContent = txt;
        contentEl.classList.remove("loading");
        setLoading(false);
    }
    setLoading(true);
    fetchWithCache("/api/ai-news-bulletin").then(r => r.json()).then(data => {
        render(data);
    }).catch(() => {
        contentEl.textContent = currentLang === "tr" ? "Bülten yüklenemedi. Yenile butonuna tıkla." : "Could not load bulletin. Click Refresh.";
        setLoading(false);
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
            <img src="${item.src}" alt="ÖMER.AI mühürlü görsel" loading="lazy" decoding="async">
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
    const items = allImages.map(src => `<div class="live-stream-item">${getProjeImgOrPicture(src, "Live")}</div>`).join("");
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
    const techEl = document.getElementById("project-modal-tech");
    if (techEl) { techEl.innerHTML = ""; techEl.style.display = "none"; }
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
    if (window.OMERAI_MOBILE) document.body.classList.add("mobile-view");
    const savedTheme = localStorage.getItem("theme") || "dark";
    document.documentElement.setAttribute("data-theme", savedTheme);

    initVanta();
    setTimeout(playWelcomeVoice, 1200);
    function audioUnlock() {
        try {
            if (!isSoundEnabled()) return;
            const ctx = getAudioCtx();
            if (ctx.state === "suspended") {
                ctx.resume().then(() => {
                    playBeep();
                    if (sessionStorage.getItem("omerai_welcome_played") !== "1") setTimeout(playWelcomeVoice, 400);
                });
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

    initGhostCommands();
    if (!window.OMERAI_MOBILE) initGpuLoadSimulation();
    initBackToTop();
    initScrollSpy();
    initBreadcrumb();
    initCookieBanner();
    initNewsletterForm();
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/sw.js').catch(() => {});
    }
    initNeuroSync();
    initProcessedDataCounter();
    initSystemLog();
    initHealthCheck();
    initPortalClient();
    renderGeneratedGallery();
    renderLiveStream();
    renderFilteredSlides();
    setupGalleryFilters();
    loadPatronunGundemi();
    updateTokenUI();
    if (getTokens() === 0) addTokens(3);
    const soundBtn = document.getElementById("sound-toggle");
    if (soundBtn) {
        soundBtn.textContent = isSoundEnabled() ? "🔊" : "🔇";
        soundBtn.title = isSoundEnabled() ? "Ses açık – tıkla kapat" : "Ses kapalı – tıkla aç";
    }
    document.addEventListener("keydown", function(e) {
        if ((e.key === "o" || e.key === "O") && !e.ctrlKey && !e.metaKey && !e.altKey) activateMatrixMode();
    });
    setInterval(checkTimeTokens, 120000);

    const chatOpen = localStorage.getItem("chatOpen");
    const chat = document.getElementById("ai-chat-widget");
    const toggleBtn = document.getElementById("chat-toggle-btn");
    if (chat && toggleBtn) {
        const forceClosedMobile = window.OMERAI_MOBILE;
        if (forceClosedMobile || chatOpen === "false") {
            chat.classList.add("chat-closed");
            chat.classList.remove("chat-open");
            toggleBtn.classList.add("visible");
        } else {
            chat.classList.remove("chat-closed");
            chat.classList.add("chat-open");
            toggleBtn.classList.remove("visible");
            showChatWelcome();
        }
    }

    // Proje Sihirbazı
    initProjectWizard();
    initDemoPrompts();
    initABTest();

    const form = document.getElementById("contact-form");
    if (form) {
        form.addEventListener("submit", function(event) {
            event.preventDefault();

            const name = (form.elements.name || form.querySelector('input[name="name"]') || form.querySelector('input[type="text"]'))?.value || "";
            const email = (form.elements.email || form.querySelector('input[name="email"]') || form.querySelector('input[type="email"]'))?.value || "";
            const message = (form.elements.message || form.querySelector('textarea[name="message"]') || form.querySelector('textarea'))?.value || "";

            const errors = validateContactForm(name, email, message);
            if (errors.length > 0) {
                showToast(errors.join(" "), "warn");
                return;
            }

            const submitBtn = form.querySelector('button[type="submit"]');
            submitBtn.disabled = true;
            submitBtn.textContent = submitBtn.getAttribute("data-loading-" + (currentLang || "tr")) || submitBtn.getAttribute("data-loading-tr") || "Mühürleniyor...";

            const TELEGRAM_BOT_TOKEN = '8385745600:AAFRf0-qUiy8ooJfvzGcn_MpL77YXONGHis';
            const TELEGRAM_CHAT_ID = '7076964315';
            const wizardData = document.getElementById("wizard-data")?.value;
            const wizardPart = wizardData ? `\n📋 *Sihirbaz:* ${wizardData}` : "";
            const text = `🚀 *Yeni Web Mesajı!*\n\n👤 *Ad:* ${name.trim()}\n📧 *E-posta:* ${email.trim()}\n📝 *Mesaj:* ${(message || "-").trim()}${wizardPart}`;

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
                    trackEvent("conversion", "contact_form_submit", "telegram_success");
                    showToast("Mührün Telegram hattına fırlatıldı patron! 🚀 +5 Dijital Mühür kazandın!", "success");
                    form.reset();
                    const wizard = document.getElementById("project-wizard");
                    if (wizard) {
                        wizard.querySelectorAll(".wizard-option").forEach(b => b.classList.remove("selected"));
                        wizard.querySelectorAll(".wizard-step").forEach(s => s.classList.remove("active"));
                        const step1 = wizard.querySelector(".wizard-step[data-step='1']");
                        if (step1) step1.classList.add("active");
                        const pb = document.getElementById("wizard-progress-bar");
                        const si = document.getElementById("wizard-step-indicator");
                        if (pb) pb.style.width = "25%";
                        if (si) si.textContent = "1/4";
                        const backBtn = document.getElementById("wizard-back");
                        if (backBtn) backBtn.style.display = "none";
                    }
                } else {
                    showToast("Hata: Mesaj iletilemedi. Token veya ID kontrolü gerek.", "error");
                }
            })
            .catch(error => {
                console.error('Hata:', error);
                showToast("Bağlantı hatası oluştu!", "error");
            })
            .finally(() => {
                submitBtn.disabled = false;
                submitBtn.textContent = submitBtn.getAttribute("data-" + (currentLang || "tr")) || submitBtn.getAttribute("data-tr") || "Mührü Gönder";
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
            trackEvent("engagement", "generate_image_click", "conversion");
            let prompt = promptInput.value.trim();
            if (!prompt) {
                showToast(currentLang === "tr" ? "Lütfen görsel açıklaması yazın." : "Please enter an image description.", "warn");
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
            if (typeof window.gpuLoadPeak === "function") window.gpuLoadPeak();

            fetch("/api/generate-image", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ prompt })
            }).then(res => res.json().then(data => ({ ok: res.ok, data }))).then(({ ok, data }) => {
                if (loadingEl) loadingEl.style.display = "none";
                if (typeof window.gpuLoadCoolDown === "function") window.gpuLoadCoolDown();
                if (ok && data.image) {
                    trackEvent("conversion", "generate_image_success", "image_created");
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
                                showToast(currentLang === "tr" ? "Mühürlü görsel galeriye eklendi!" : "Sealed image added to gallery!", "success");
                            });
                        };
                    }
                } else {
                    showToast(data.error || (currentLang === "tr" ? "Görsel üretilemedi." : "Image generation failed."), "error");
                }
            }).catch(() => {
                if (loadingEl) loadingEl.style.display = "none";
                if (typeof window.gpuLoadCoolDown === "function") window.gpuLoadCoolDown();
                showToast("Görsel üretimi için backend API henüz bağlı değil.", "error");
            });
        });
    }

    if (addGalleryBtn) addGalleryBtn.style.cursor = "pointer";
    if (downloadBtn) downloadBtn.style.cursor = "pointer";

    // Web Şablon Laboratuvarı
    const webGenBtn = document.getElementById("generate-web-btn");
    const webPromptInput = document.getElementById("web-prompt-input");
    const webLoadingEl = document.getElementById("web-loading-indicator");
    const webPreviewWrapper = document.getElementById("web-preview-wrapper");
    const webPlaceholder = document.getElementById("web-placeholder");
    const webIframe = document.getElementById("web-preview-iframe");
    const webDownloadBtn = document.getElementById("web-download-btn");
    const webCodeToggle = document.getElementById("web-code-toggle");
    const webCodeOutput = document.getElementById("web-code-output");

    let lastGeneratedHtml = null;

    if (webGenBtn && webPromptInput) {
        webGenBtn.addEventListener("click", function() {
            trackEvent("engagement", "generate_web_click", "conversion");
            const prompt = webPromptInput.value.trim() || (currentLang === "tr" ? "Modern landing page" : "Modern landing page");
            if (webLoadingEl) webLoadingEl.style.display = "block";
            if (webPreviewWrapper) webPreviewWrapper.style.display = "none";
            if (webPlaceholder) webPlaceholder.style.display = "block";
            if (typeof window.gpuLoadPeak === "function") window.gpuLoadPeak();

            fetch("/api/generate-web", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ prompt })
            }).then(res => res.json()).then(data => {
                if (webLoadingEl) webLoadingEl.style.display = "none";
                if (typeof window.gpuLoadCoolDown === "function") window.gpuLoadCoolDown();
                if (data.html) {
                    trackEvent("conversion", "generate_web_success", "template_created");
                    lastGeneratedHtml = data.html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
                    if (webPlaceholder) webPlaceholder.style.display = "none";
                    if (webPreviewWrapper) webPreviewWrapper.style.display = "block";
                    if (webIframe) webIframe.srcdoc = lastGeneratedHtml;
                    if (webCodeOutput) {
                        webCodeOutput.textContent = lastGeneratedHtml;
                        webCodeOutput.style.display = "none";
                    }
                    if (webCodeToggle) webCodeToggle.textContent = (webCodeToggle.getAttribute("data-" + (currentLang || "tr")) || webCodeToggle.getAttribute("data-tr") || "📄 Kodu Göster");
                } else {
                    showToast(data.error || (currentLang === "tr" ? "Web şablonu üretilemedi." : "Web template generation failed."), "error");
                }
            }).catch(() => {
                if (webLoadingEl) webLoadingEl.style.display = "none";
                if (typeof window.gpuLoadCoolDown === "function") window.gpuLoadCoolDown();
                showToast(currentLang === "tr" ? "Web API bağlantı hatası." : "Web API connection error.", "error");
            });
        });
    }

    if (webDownloadBtn) {
        webDownloadBtn.addEventListener("click", function() {
            if (!lastGeneratedHtml) return;
            const blob = new Blob([lastGeneratedHtml], { type: "text/html" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = "omerai-web-sablon-" + Date.now() + ".html";
            a.click();
            URL.revokeObjectURL(url);
        });
    }

    if (webCodeToggle) {
        webCodeToggle.addEventListener("click", function() {
            if (!webCodeOutput) return;
            const isHidden = webCodeOutput.style.display === "none" || !webCodeOutput.style.display;
            webCodeOutput.style.display = isHidden ? "block" : "none";
            webCodeToggle.textContent = isHidden
                ? (currentLang === "tr" ? "🙈 Kodu Gizle" : "🙈 Hide Code")
                : (webCodeToggle.getAttribute("data-tr") || "📄 Kodu Göster");
        });
    }
});
