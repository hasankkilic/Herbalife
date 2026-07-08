/* ============================================================
   ŞİMŞEK WELLNESS — Etkileşimler
   ÖNEMLİ: Aşağıdaki numarayı kendi WhatsApp numaranızla değiştirin.
   Format: ülke kodu + numara, başında + veya 0 OLMADAN.
   ============================================================ */
const WHATSAPP_NUMBER = "905550070269";

/* ---------- Mobil menü ---------- */
const navToggle = document.getElementById("navToggle");
const navLinks = document.getElementById("navLinks");

navToggle.addEventListener("click", () => {
  const open = navLinks.classList.toggle("open");
  navToggle.classList.toggle("open", open);
  navToggle.setAttribute("aria-expanded", open);
});

navLinks.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("open");
    navToggle.classList.remove("open");
    navToggle.setAttribute("aria-expanded", "false");
  });
});

/* ---------- Kaydırınca menüye gölge ---------- */
const navbar = document.getElementById("navbar");
window.addEventListener("scroll", () => {
  navbar.classList.toggle("scrolled", window.scrollY > 10);
}, { passive: true });

/* ---------- Aktif menü bağlantısı ---------- */
const sections = document.querySelectorAll("section[id]");
const menuAnchors = navLinks.querySelectorAll("a");

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    menuAnchors.forEach((a) => {
      a.classList.toggle("active", a.getAttribute("href") === `#${entry.target.id}`);
    });
  });
}, { rootMargin: "-40% 0px -55% 0px" });

sections.forEach((s) => sectionObserver.observe(s));

/* ---------- Görünme animasyonu ---------- */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll(".reveal").forEach((el) => revealObserver.observe(el));

/* ---------- Sayaç animasyonu ---------- */
function animateCounter(el) {
  const target = parseInt(el.dataset.count, 10);
  const duration = 1600;
  const start = performance.now();

  function tick(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.round(target * eased).toLocaleString("tr-TR");
    if (progress < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      animateCounter(entry.target);
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll(".stat-number").forEach((el) => counterObserver.observe(el));

/* ---------- Yorum slaytı ---------- */
/* Yorumlar data/yorumlar.json dosyasından yüklenir ve admin.html
   üzerinden güncellenebilir. Dosya yüklenemezse (ör. internetsiz
   yerel açılış) HTML içindeki gömülü yorumlar gösterilmeye devam eder. */
const track = document.getElementById("testimonialTrack");
const slides = track.children;
const dotsWrap = document.getElementById("sliderDots");
let currentSlide = 0;
let autoTimer;

function goToSlide(index) {
  currentSlide = (index + slides.length) % slides.length;
  track.style.transform = `translateX(-${currentSlide * 100}%)`;
  dotsWrap.querySelectorAll("button").forEach((d, i) => {
    d.classList.toggle("active", i === currentSlide);
  });
  restartAuto();
}

function restartAuto() {
  clearInterval(autoTimer);
  autoTimer = setInterval(() => goToSlide(currentSlide + 1), 6000);
}

function initSlider() {
  dotsWrap.innerHTML = "";
  for (let i = 0; i < slides.length; i++) {
    const dot = document.createElement("button");
    dot.setAttribute("aria-label", `Yorum ${i + 1}`);
    dot.addEventListener("click", () => goToSlide(i));
    dotsWrap.appendChild(dot);
  }
  goToSlide(0);
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, (c) => (
    { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]
  ));
}

document.getElementById("prevSlide").addEventListener("click", () => goToSlide(currentSlide - 1));
document.getElementById("nextSlide").addEventListener("click", () => goToSlide(currentSlide + 1));
initSlider();

fetch("data/yorumlar.json?v=" + Date.now(), { cache: "no-store" })
  .then((r) => (r.ok ? r.json() : Promise.reject()))
  .then((list) => {
    if (!Array.isArray(list) || list.length === 0) return;
    track.innerHTML = "";
    list.forEach((y) => {
      const q = document.createElement("blockquote");
      q.className = "slide";
      const stars = "★".repeat(Math.min(Math.max(parseInt(y.yildiz, 10) || 5, 1), 5));
      q.innerHTML =
        `<div class="stars">${stars}</div>` +
        `<p>"${escapeHtml(y.yorum)}"</p>` +
        `<footer><strong>${escapeHtml(y.ad)}</strong>` +
        `<span>${escapeHtml(y.program)}${y.sure ? " • " + escapeHtml(y.sure) : ""}</span></footer>`;
      track.appendChild(q);
    });
    initSlider();
  })
  .catch(() => {});

/* ---------- Yıl ---------- */
/* (Randevu formu iletisim.html sayfasına taşındı; kodu js/kaynaklar.js içindedir.) */
document.getElementById("year").textContent = new Date().getFullYear();
