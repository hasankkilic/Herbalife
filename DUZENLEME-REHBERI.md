# LokasyON Şimşek — Site Düzenleme Rehberi

Bu site 3 dosyadan oluşur, hiçbir kurulum/program gerektirmez:

| Dosya | Ne işe yarar |
|---|---|
| `index.html` | Tüm metinler ve içerik |
| `css/style.css` | Tasarım ve renkler |
| `js/main.js` | Menü, form, animasyonlar |
| `js/calculator.js` | Kalori/BMI/makro hesaplama aracı |

## 1. Güncel bilgiler (işlendi ✅)

Şu bilgiler siteye işlenmiş durumdadır — değişirse aşağıdaki gibi güncelleyin:

- **Telefon / WhatsApp: 0555 007 02 69** — değişirse `js/main.js` en üstündeki `WHATSAPP_NUMBER` satırını ve `index.html` içinde `905550070269` ile `0 555 007 02 69` yazan yerleri (Ctrl+H ile) değiştirin.
- **Adres: Turgut Özal Mah. 2125. Cadde İntro Plaza No: 11, Batıkent/ANKARA** — değişirse `index.html` içinde aratıp değiştirin; İletişim bölümündeki Google Haritalar kutusunun adresi de `maps?q=...` satırındadır.
- **Marka: LokasyON Şimşek** — logo, menü ve footer'da SVG olarak çizilidir; renkleri `css/style.css` üstündeki değişkenlerden ayarlanır.
- **Çalışma düzeni:** Sabit saat yerine "Gelmeden önce lütfen arayın" notu kullanılıyor.

## 2. İsteğe bağlı düzenlemeler

- **Çalışma saatleri:** `09.00 – 20.00` yazan yerleri aratın.
- **İstatistikler (500+ üye, 8+ yıl vb.):** `index.html` içinde `data-count="500"` gibi değerleri gerçek rakamlarla değiştirin.
- **Üye yorumları:** `id="testimonialTrack"` bölümündeki yorumları gerçek üye yorumlarıyla değiştirin (izin alarak!).
- **Fotoğraflar:** Şu an Unsplash'ten ücretsiz stok fotoğraflar kullanılıyor. Kendi fotoğraflarınızı kullanmak için proje içine `img` klasörü açıp fotoğrafları oraya koyun, sonra `index.html` içindeki `https://images.unsplash.com/...` adreslerini `img/dosyaadi.jpg` ile değiştirin. **Kendi mekân ve etkinlik fotoğraflarınız siteyi çok daha inandırıcı yapar — şiddetle tavsiye edilir.**
- **Renkler:** `css/style.css` dosyasının en üstündeki `:root` bölümünden tüm renkleri tek yerden değiştirebilirsiniz.
- **Hesaplama aracı:** "Hesaplama" bölümü ziyaretçinin BMI, günlük kalori (Mifflin-St Jeor formülü) ve makro ihtiyacını hesaplar; "Sonuçlarımı WhatsApp'tan Gönder" butonu sonuçları doğrudan size iletir — yani araç aynı zamanda müşteri kazanma kanalıdır. Formüller `js/calculator.js` içindedir; grafik için Chart.js internetten (CDN) yüklenir, ekstra kurulum gerekmez.

## 3. Siteyi internete koymak (ücretsiz)

En kolay yol — **Netlify Drop**:
1. https://app.netlify.com/drop adresine gidin (ücretsiz üyelik).
2. `mete` klasörünü olduğu gibi sayfaya sürükleyip bırakın.
3. Site anında `xxx.netlify.app` adresinde yayında! İsterseniz kendi alan adınızı (ör. `simsekwellness.com`) bağlayabilirsiniz.

Alternatifler: Vercel (vercel.com), GitHub Pages, ya da herhangi bir hosting firmasına dosyaları FTP ile yüklemek.

## 4. Yasal not

Footer'daki "Bağımsız Herbalife Üyesi" açıklaması bilinçli olarak eklendi — Herbalife üyelerinin kendi sitelerinde bu tür bir açıklama bulundurması beklenir ve siteye profesyonellik/güvenilirlik katar. Silmemenizi öneririz. Ayrıca "Herbalife" logo ve görsellerini resmi izin olmadan kullanmamaya dikkat edin; bu site bu yüzden kendi markası ("Şimşek Wellness") üzerine kuruldu.
