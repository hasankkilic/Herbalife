/* ============================================================
   LOKASYON ŞİMŞEK — Resmi İçerik Sayfaları
   (Ürün Güvenliği S.S.S. / Tarifler / Makaleler)
   İçerikler data/*.json dosyalarındadır ve resmi Herbalife
   Türkiye sitesinden araclar/icerik-guncelle.py ile çekilir.
   ============================================================ */
const SAYFA = document.body.dataset.sayfa; // "sss" | "tarifler" | "makaleler"

const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => (
  { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]
));

function veriYukle(dosya, isleyici) {
  fetch(`data/${dosya}?v=` + Date.now(), { cache: "no-store" })
    .then((r) => (r.ok ? r.json() : Promise.reject(new Error("HTTP " + r.status))))
    .then(isleyici)
    .catch(() => {
      document.getElementById("icerikAlani").innerHTML =
        '<p class="muted-note">❌ İçerik yüklenemedi. Lütfen sayfayı yenileyin.</p>';
    });
}

/* ---------- Ürün Güvenliği S.S.S. ---------- */
if (SAYFA === "sss") {
  veriYukle("sss.json", (liste) => {
    const alan = document.getElementById("icerikAlani");
    alan.innerHTML = "";
    alan.className = "faq";
    liste.forEach((s) => {
      const d = document.createElement("details");
      d.className = "faq-item";
      d.innerHTML =
        `<summary>${esc(s.baslik)}</summary>` +
        `<div class="resmi-icerik" style="padding:0 1.4rem 1.3rem">${s.icerikHtml}` +
        `<p class="icerik-kaynak">Kaynak: <a href="${esc(s.resmiSayfa)}" target="_blank" rel="noopener">herbalife.com resmi cevabı ↗</a></p></div>`;
      alan.appendChild(d);
    });

    const ara = document.getElementById("icerikAra");
    ara.addEventListener("input", () => {
      const q = ara.value.trim().toLocaleLowerCase("tr");
      let gorunen = 0;
      alan.querySelectorAll(".faq-item").forEach((item) => {
        const uygun = !q || item.textContent.toLocaleLowerCase("tr").includes(q);
        item.style.display = uygun ? "" : "none";
        if (uygun) gorunen++;
      });
      document.getElementById("icerikSayac").textContent =
        q ? `${gorunen} soru bulundu` : "";
    });
  });
}

/* ---------- Tarifler ---------- */
if (SAYFA === "tarifler") {
  veriYukle("tarifler.json", (liste) => {
    const alan = document.getElementById("icerikAlani");
    alan.innerHTML = "";
    alan.className = "icerik-grid";
    liste.forEach((t) => {
      const kart = document.createElement("article");
      kart.className = "icerik-card";
      kart.innerHTML =
        `<div class="icerik-img"><img src="${esc(t.gorsel)}" alt="${esc(t.baslik)}" loading="lazy"></div>` +
        `<div class="icerik-body">` +
        `<h3>${esc(t.baslik)}</h3>` +
        `<p class="icerik-ozet">${esc(t.ozet)}</p>` +
        `<details><summary>Tarifi Gör</summary><div class="resmi-icerik">${t.icerikHtml}` +
        `<p class="icerik-kaynak">Kaynak: <a href="${esc(t.resmiSayfa)}" target="_blank" rel="noopener">herbalife.com ↗</a></p></div></details>` +
        `</div>`;
      alan.appendChild(kart);
    });
  });
}

/* ---------- Makaleler ---------- */
if (SAYFA === "makaleler") {
  let makaleler = [];
  const okuyucu = document.getElementById("okuyucu");

  function makaleAc(i) {
    const m = makaleler[i];
    document.getElementById("okuyucuGorsel").src = m.gorsel;
    document.getElementById("okuyucuGorsel").alt = m.baslik;
    document.getElementById("okuyucuBaslik").textContent = m.baslik;
    document.getElementById("okuyucuIcerik").innerHTML = m.icerikHtml;
    document.getElementById("okuyucuKaynak").href = m.resmiSayfa;
    okuyucu.hidden = false;
    document.body.style.overflow = "hidden";
    okuyucu.querySelector(".okuyucu-panel").scrollTop = 0;
  }

  function okuyucuKapat() {
    okuyucu.hidden = true;
    document.body.style.overflow = "";
  }

  document.getElementById("okuyucuKapat").addEventListener("click", okuyucuKapat);
  okuyucu.addEventListener("click", (e) => { if (e.target === okuyucu) okuyucuKapat(); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape" && !okuyucu.hidden) okuyucuKapat(); });

  veriYukle("makaleler.json", (liste) => {
    makaleler = liste;
    const alan = document.getElementById("icerikAlani");
    alan.innerHTML = "";
    alan.className = "icerik-grid";
    liste.forEach((m, i) => {
      const kart = document.createElement("article");
      kart.className = "icerik-card";
      kart.innerHTML =
        `<div class="icerik-img"><img src="${esc(m.gorsel)}" alt="${esc(m.baslik)}" loading="lazy"></div>` +
        `<div class="icerik-body">` +
        `<h3>${esc(m.baslik)}</h3>` +
        `<p class="icerik-ozet">${esc(m.ozet)}</p>` +
        `<button class="btn btn-outline" data-i="${i}" type="button">Devamını Oku</button>` +
        `</div>`;
      alan.appendChild(kart);
    });
    alan.addEventListener("click", (e) => {
      const b = e.target.closest("button[data-i]");
      if (b) makaleAc(parseInt(b.dataset.i, 10));
    });
  });
}

/* ---------- Ortak: mobil menü, menü gölgesi, yıl ---------- */
const navToggle = document.getElementById("navToggle");
const navLinks = document.getElementById("navLinks");
navToggle.addEventListener("click", () => {
  const open = navLinks.classList.toggle("open");
  navToggle.classList.toggle("open", open);
  navToggle.setAttribute("aria-expanded", open);
});
window.addEventListener("scroll", () => {
  document.getElementById("navbar").classList.toggle("scrolled", window.scrollY > 10);
}, { passive: true });
document.getElementById("year").textContent = new Date().getFullYear();
