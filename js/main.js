/* ============================================================
   ŞİMŞEK WELLNESS — Etkileşimler
   ÖNEMLİ: Aşağıdaki numarayı kendi WhatsApp numaranızla değiştirin.
   Format: ülke kodu + numara, başında + veya 0 OLMADAN.
   ============================================================ */
const WHATSAPP_NUMBER = "905555555555";

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
const track = document.getElementById("testimonialTrack");
const slides = track.children;
const dotsWrap = document.getElementById("sliderDots");
let currentSlide = 0;
let autoTimer;

for (let i = 0; i < slides.length; i++) {
  const dot = document.createElement("button");
  dot.setAttribute("aria-label", `Yorum ${i + 1}`);
  dot.addEventListener("click", () => goToSlide(i));
  dotsWrap.appendChild(dot);
}

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

document.getElementById("prevSlide").addEventListener("click", () => goToSlide(currentSlide - 1));
document.getElementById("nextSlide").addEventListener("click", () => goToSlide(currentSlide + 1));
goToSlide(0);

/* ---------- Randevu formu → WhatsApp ---------- */
document.getElementById("contactForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const name = document.getElementById("fname").value.trim();
  const phone = document.getElementById("fphone").value.trim();
  const service = document.getElementById("fservice").value;
  const msg = document.getElementById("fmsg").value.trim();

  let text = `Merhaba, web sitenizden yazıyorum.\n\n`;
  text += `👤 Ad Soyad: ${name}\n`;
  text += `📞 Telefon: ${phone}\n`;
  text += `🎯 İlgilendiğim hizmet: ${service}\n`;
  if (msg) text += `📝 Mesaj: ${msg}\n`;
  text += `\nRandevu almak istiyorum.`;

  window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`, "_blank");
});

/* ---------- Yıl ---------- */
document.getElementById("year").textContent = new Date().getFullYear();
