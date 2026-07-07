/* ============================================================
   LOKASYON ŞİMŞEK — Yorum Yönetim Paneli
   data/yorumlar.json dosyasını GitHub API üzerinden okur ve
   günceller; sunucu gerektirmez. Repo değişirse aşağıyı düzenleyin.
   ============================================================ */
const OWNER = "hasankkilic";
const REPO = "Herbalife";
const FILE_PATH = "data/yorumlar.json";
const BRANCH = "main";
const TOKEN_KEY = "ls_gh_token";

/* Panel şifresinin SHA-256 özeti (şifrenin kendisi kodda yer almaz).
   Şifreyi değiştirmek için: yeni şifrenin SHA-256 özetini hesaplayıp
   aşağıdaki değeri güncelleyin (ör. https://emn178.github.io/online-tools/sha256.html). */
const PASS_HASH = "de1bd3ea4471744db798a3fad55038657a3b90ee3f0f3b7e7cfa87dbdf4422bb";
const PASS_KEY = "ls_admin_unlocked";

let yorumlar = [];
let fileSha = null;

const tokenInput = document.getElementById("tokenInput");
const connectBtn = document.getElementById("connectBtn");
const disconnectBtn = document.getElementById("disconnectBtn");
const connStatus = document.getElementById("connStatus");
const listEl = document.getElementById("yorumList");
const saveStatus = document.getElementById("saveStatus");

const utf8ToB64 = (s) => btoa(String.fromCharCode(...new TextEncoder().encode(s)));

function getToken() {
  return localStorage.getItem(TOKEN_KEY) || "";
}

function setStatus(el, cls, html) {
  el.className = "status " + cls;
  el.innerHTML = html;
}

function apiHeaders() {
  const h = { Accept: "application/vnd.github+json" };
  const t = getToken();
  if (t) h.Authorization = "Bearer " + t;
  return h;
}

/* ---------- Bağlantı ---------- */
async function connect(token) {
  try {
    const res = await fetch("https://api.github.com/user", {
      headers: { Accept: "application/vnd.github+json", Authorization: "Bearer " + token },
    });
    if (!res.ok) throw new Error("Anahtar doğrulanamadı (HTTP " + res.status + ")");
    const user = await res.json();
    localStorage.setItem(TOKEN_KEY, token);
    setStatus(connStatus, "ok", `✅ Bağlandı: <strong>${user.login}</strong> — artık kaydedebilirsiniz.`);
    refreshConnUi();
  } catch (e) {
    setStatus(connStatus, "err", "❌ " + e.message + ". Anahtarı kontrol edip tekrar deneyin.");
  }
}

function refreshConnUi() {
  const connected = !!getToken();
  disconnectBtn.style.display = connected ? "" : "none";
  connectBtn.textContent = connected ? "Yeniden Bağlan" : "Bağlan";
  if (connected && !connStatus.classList.contains("ok")) {
    setStatus(connStatus, "info", "🔑 Kayıtlı anahtar bulundu; doğrudan kaydedebilirsiniz.");
  }
}

connectBtn.addEventListener("click", () => {
  const t = tokenInput.value.trim();
  if (!t) {
    setStatus(connStatus, "err", "❌ Önce anahtarı yapıştırın.");
    return;
  }
  connect(t);
});

disconnectBtn.addEventListener("click", () => {
  localStorage.removeItem(TOKEN_KEY);
  tokenInput.value = "";
  connStatus.className = "status";
  refreshConnUi();
});

/* ---------- Yorumları yükle ----------
   Okuma raw.githubusercontent.com üzerinden yapılır (anahtar ve
   istek limiti gerektirmez). Kaydetme sırasında dosyanın güncel
   sha'sı anahtarla API'den alınır. */
async function loadYorumlar() {
  try {
    const url = `https://raw.githubusercontent.com/${OWNER}/${REPO}/${BRANCH}/${FILE_PATH}?t=${Date.now()}`;
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) throw new Error("Dosya okunamadı (HTTP " + res.status + ")");
    yorumlar = await res.json();
    renderList();
  } catch (e) {
    listEl.innerHTML = `<p class="muted-note">❌ Yorumlar yüklenemedi: ${e.message}. Sayfayı yenileyip tekrar deneyin.</p>`;
  }
}

async function fetchSha() {
  const url = `https://api.github.com/repos/${OWNER}/${REPO}/contents/${FILE_PATH}?ref=${BRANCH}&t=${Date.now()}`;
  const res = await fetch(url, { headers: apiHeaders(), cache: "no-store" });
  if (!res.ok) throw new Error("Dosya bilgisi alınamadı (HTTP " + res.status + ")");
  return (await res.json()).sha;
}

/* ---------- Liste arayüzü ---------- */
function renderList() {
  listEl.innerHTML = "";
  if (yorumlar.length === 0) {
    listEl.innerHTML = '<p class="muted-note">Henüz yorum yok — "Yeni Yorum Ekle" ile başlayın.</p>';
  }
  yorumlar.forEach((y, i) => {
    const item = document.createElement("div");
    item.className = "yorum-item";
    item.innerHTML = `
      <div class="form-row3">
        <div><label>Ad Soyad</label><input type="text" data-f="ad" data-i="${i}" value=""></div>
        <div><label>Program</label><input type="text" data-f="program" data-i="${i}" value=""></div>
        <div><label>Süre</label><input type="text" data-f="sure" data-i="${i}" value="" placeholder="örn. 3 ay"></div>
        <div><label>Yıldız</label>
          <select data-f="yildiz" data-i="${i}">
            <option value="5">★★★★★</option>
            <option value="4">★★★★</option>
            <option value="3">★★★</option>
          </select>
        </div>
      </div>
      <div><label>Yorum</label><textarea rows="3" data-f="yorum" data-i="${i}"></textarea></div>
      <div class="yorum-tools">
        <button class="tool-btn" data-act="up" data-i="${i}" type="button" ${i === 0 ? "disabled" : ""}>↑ Yukarı</button>
        <button class="tool-btn" data-act="down" data-i="${i}" type="button" ${i === yorumlar.length - 1 ? "disabled" : ""}>↓ Aşağı</button>
        <button class="tool-btn danger" data-act="del" data-i="${i}" type="button">🗑 Sil</button>
      </div>`;
    // Değerleri innerHTML yerine property olarak ata (tırnak/karakter sorunlarına karşı)
    item.querySelector('[data-f="ad"]').value = y.ad || "";
    item.querySelector('[data-f="program"]').value = y.program || "";
    item.querySelector('[data-f="sure"]').value = y.sure || "";
    item.querySelector('[data-f="yildiz"]').value = String(y.yildiz || 5);
    item.querySelector('[data-f="yorum"]').value = y.yorum || "";
    listEl.appendChild(item);
  });
}

listEl.addEventListener("input", (e) => {
  const f = e.target.dataset.f;
  if (!f) return;
  const i = parseInt(e.target.dataset.i, 10);
  yorumlar[i][f] = f === "yildiz" ? parseInt(e.target.value, 10) : e.target.value;
});

listEl.addEventListener("click", (e) => {
  const act = e.target.dataset.act;
  if (!act) return;
  const i = parseInt(e.target.dataset.i, 10);
  if (act === "del") {
    if (!confirm(`"${yorumlar[i].ad}" yorumunu silmek istediğinize emin misiniz?`)) return;
    yorumlar.splice(i, 1);
  } else if (act === "up" && i > 0) {
    [yorumlar[i - 1], yorumlar[i]] = [yorumlar[i], yorumlar[i - 1]];
  } else if (act === "down" && i < yorumlar.length - 1) {
    [yorumlar[i + 1], yorumlar[i]] = [yorumlar[i], yorumlar[i + 1]];
  }
  renderList();
});

document.getElementById("addBtn").addEventListener("click", () => {
  yorumlar.push({ ad: "", yildiz: 5, yorum: "", program: "Kilo Verme Programı", sure: "" });
  renderList();
  listEl.lastElementChild.scrollIntoView({ behavior: "smooth", block: "center" });
  listEl.lastElementChild.querySelector("input").focus();
});

/* ---------- Kaydet ---------- */
document.getElementById("saveBtn").addEventListener("click", async () => {
  if (!getToken()) {
    setStatus(saveStatus, "err", "❌ Kaydetmek için önce yukarıdan GitHub anahtarınızla bağlanın.");
    return;
  }
  const eksik = yorumlar.find((y) => !y.ad.trim() || !y.yorum.trim());
  if (eksik) {
    setStatus(saveStatus, "err", "❌ Ad ve yorum alanları boş bırakılamaz.");
    return;
  }
  setStatus(saveStatus, "info", "⏳ Kaydediliyor…");
  try {
    fileSha = await fetchSha();
    const body = {
      message: "Yorumlar guncellendi (yorum yonetim paneli)",
      content: utf8ToB64(JSON.stringify(yorumlar, null, 2) + "\n"),
      sha: fileSha,
      branch: BRANCH,
    };
    const res = await fetch(`https://api.github.com/repos/${OWNER}/${REPO}/contents/${FILE_PATH}`, {
      method: "PUT",
      headers: apiHeaders(),
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || "HTTP " + res.status);
    }
    const out = await res.json();
    fileSha = out.content.sha;
    setStatus(saveStatus, "ok",
      `✅ Kaydedildi! Değişiklikler 1-2 dakika içinde sitede görünür. ` +
      `<a href="${out.commit.html_url}" target="_blank" rel="noopener">Commit'i gör</a>`);
  } catch (e) {
    setStatus(saveStatus, "err", "❌ Kaydedilemedi: " + e.message +
      (e.message.includes("409") || e.message.toLowerCase().includes("match")
        ? " — Sayfayı yenileyip tekrar deneyin (dosya başka yerden değişmiş olabilir)."
        : ""));
  }
});

/* ---------- Şifre kilidi ---------- */
const lockScreen = document.getElementById("lockScreen");
const panelContent = document.getElementById("panelContent");
const passInput = document.getElementById("passInput");
const lockStatus = document.getElementById("lockStatus");

async function sha256Hex(s) {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(s));
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

function unlockPanel() {
  lockScreen.hidden = true;
  panelContent.hidden = false;
  refreshConnUi();
  loadYorumlar();
}

async function tryUnlock() {
  const val = passInput.value;
  if (!val) return;
  if (!window.crypto || !crypto.subtle) {
    setStatus(lockStatus, "err", "❌ Tarayıcı desteklemiyor; sayfayı https adresinden açın.");
    return;
  }
  if ((await sha256Hex(val)) === PASS_HASH) {
    localStorage.setItem(PASS_KEY, PASS_HASH);
    unlockPanel();
  } else {
    passInput.value = "";
    setStatus(lockStatus, "err", "❌ Şifre yanlış, tekrar deneyin.");
  }
}

document.getElementById("unlockBtn").addEventListener("click", tryUnlock);
passInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") tryUnlock();
});

/* ---------- Başlat ---------- */
if (localStorage.getItem(PASS_KEY) === PASS_HASH) {
  unlockPanel();
} else {
  passInput.focus();
}
