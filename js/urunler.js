/* ============================================================
   LOKASYON ŞİMŞEK — Herbalife Ürün Kataloğu
   Ürün verileri data/urunler.json dosyasındadır ve resmi
   Herbalife Türkiye sitesinden alınmıştır (bkz. scraper notu).
   ============================================================ */
const WHATSAPP_NUMBER = "905550070269";

/* Kategori kodu → görünen ad */
const KATEGORI_ADLARI = {
  "protein": "Protein Shake'ler",
  "protein-destegi": "Protein Desteği",
  "protein-atistirmaliklari": "Protein Atıştırmalıkları",
  "takviye-edici-gidalar": "Takviye Edici Gıdalar",
  "sivi-alimi": "Sıvı Alımı",
  "kafein-destegi": "Kafein Desteği",
  "cilt-bakimi": "Cilt Bakımı",
  "cilt-destegi": "Cilt Desteği",
  "vucut-bakimi": "Vücut Bakımı",
  "sac-bakimi": "Saç Bakımı",
  "sporcu-beslenmesi": "Sporcu Beslenmesi",
  "enerji": "Enerji",
  "metabolizma": "Metabolizma",
  "lif-takviyesi": "Lif Takviyesi",
  "normal-kalp-fonksiyonu": "Kalp Sağlığı",
  "genel-wellness": "Genel Wellness",
  "aksesuarlar": "Aksesuarlar",
};

const grid = document.getElementById("urunGrid");
const filtreWrap = document.getElementById("urunFiltreler");
const araInput = document.getElementById("urunAra");
const sayacEl = document.getElementById("urunSayac");

let urunler = [];
let aktifKategori = "hepsi";

const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => (
  { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]
));

const katAdi = (k) => KATEGORI_ADLARI[k] || k;

function waLink(u) {
  const text = `Merhaba! ${u.ad} (${u.sku}) ürünü hakkında bilgi ve fiyat almak istiyorum.`;
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
}

function render() {
  const q = araInput.value.trim().toLocaleLowerCase("tr");
  const liste = urunler.filter((u) => {
    if (aktifKategori !== "hepsi" && u.kategori !== aktifKategori) return false;
    if (!q) return true;
    const hedef = `${u.ad} ${u.aroma} ${katAdi(u.kategori)} ${u.ozet}`.toLocaleLowerCase("tr");
    return hedef.includes(q);
  });

  sayacEl.textContent = liste.length
    ? `${liste.length} ürün gösteriliyor`
    : "Aramanıza uygun ürün bulunamadı.";

  grid.innerHTML = "";
  liste.forEach((u) => {
    const card = document.createElement("article");
    card.className = "urun-card";

    const altBilgi = [u.aroma, u.boyut].filter(Boolean).join(" • ");
    const sekmeler = (u.sekmeler || []).map((s) =>
      `<details class="urun-sekme"><summary>${esc(s.baslik)}</summary><div class="urun-sekme-icerik">${s.html}</div></details>`
    ).join("");

    card.innerHTML = `
      <div class="urun-img">
        <img src="${esc(u.gorsel)}" alt="${esc(u.ad)}" loading="lazy">
        <span class="urun-kat">${esc(katAdi(u.kategori))}</span>
      </div>
      <div class="urun-body">
        <h3>${esc(u.ad)}</h3>
        ${altBilgi ? `<p class="urun-alt">${esc(altBilgi)}</p>` : ""}
        <p class="urun-ozet">${esc(u.ozet)}</p>
        <div class="urun-detaylar">${sekmeler}</div>
        <div class="urun-actions">
          <a class="btn btn-primary" href="${waLink(u)}" target="_blank" rel="noopener">💬 Bilgi / Sipariş</a>
          <a class="btn btn-ghost" href="${esc(u.resmiSayfa)}" target="_blank" rel="noopener">Resmi Sayfa ↗</a>
        </div>
      </div>`;
    grid.appendChild(card);
  });
}

function filtreleriKur() {
  const sayilar = {};
  urunler.forEach((u) => { sayilar[u.kategori] = (sayilar[u.kategori] || 0) + 1; });
  const kategoriler = Object.keys(sayilar).sort((a, b) => sayilar[b] - sayilar[a]);

  const hepsi = document.createElement("button");
  hepsi.className = "filtre-chip active";
  hepsi.dataset.kat = "hepsi";
  hepsi.textContent = `Tümü (${urunler.length})`;
  filtreWrap.appendChild(hepsi);

  kategoriler.forEach((k) => {
    const b = document.createElement("button");
    b.className = "filtre-chip";
    b.dataset.kat = k;
    b.textContent = `${katAdi(k)} (${sayilar[k]})`;
    filtreWrap.appendChild(b);
  });

  filtreWrap.addEventListener("click", (e) => {
    const b = e.target.closest(".filtre-chip");
    if (!b) return;
    aktifKategori = b.dataset.kat;
    filtreWrap.querySelectorAll(".filtre-chip").forEach((c) => c.classList.toggle("active", c === b));
    render();
  });
}

araInput.addEventListener("input", render);

fetch("data/urunler.json?v=" + Date.now(), { cache: "no-store" })
  .then((r) => (r.ok ? r.json() : Promise.reject(new Error("HTTP " + r.status))))
  .then((list) => {
    urunler = list;
    filtreleriKur();
    render();
  })
  .catch(() => {
    grid.innerHTML = '<p class="muted-note">❌ Ürünler yüklenemedi. Lütfen sayfayı yenileyin.</p>';
  });

/* ---------- Mobil menü + yıl ---------- */
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
