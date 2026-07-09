# LokasyON Şimşek — Site Düzenleme Rehberi

Bu site 3 dosyadan oluşur, hiçbir kurulum/program gerektirmez:

| Dosya | Ne işe yarar |
|---|---|
| `index.html` | Tüm metinler ve içerik |
| `css/style.css` | Tasarım ve renkler |
| `js/main.js` | Menü, form, animasyonlar |
| `js/calculator.js` | Kalori/BMI/makro hesaplama aracı |
| `data/yorumlar.json` | Üye yorumları (admin panelinden yönetilir) |
| `admin.html` + `js/admin.js` | Yorum yönetim paneli |
| `hesaplama.html` + `js/calculator.js` | Kalori/BMI/makro hesaplayıcı sayfası |
| `iletisim.html` | İletişim, randevu formu ve harita sayfası |
| `urunler.html` + `js/urunler.js` + `data/urunler.json` | Herbalife ürün kataloğu sayfası |
| `tarifler.html`, `makaleler.html`, `urun-sss.html` + `js/kaynaklar.js` | Resmi tarifler, makaleler ve ürün güvenliği S.S.S. sayfaları |
| `data/tarifler.json`, `data/makaleler.json`, `data/sss.json` | Bu sayfaların içerikleri (resmi siteden) |
| `araclar/urunler-guncelle.py` | Ürün kataloğunu resmi siteden yeniden çekme betiği |
| `araclar/icerik-guncelle.py` | Tarif/makale/SSS içeriklerini yeniden çekme betiği |

## 1. Güncel bilgiler (işlendi ✅)

Şu bilgiler siteye işlenmiş durumdadır — değişirse aşağıdaki gibi güncelleyin:

- **Telefon / WhatsApp: 0555 007 02 69** — değişirse `js/main.js` en üstündeki `WHATSAPP_NUMBER` satırını ve `index.html` içinde `905550070269` ile `0 555 007 02 69` yazan yerleri (Ctrl+H ile) değiştirin.
- **Adres: Turgut Özal Mah. 2128. Sk. No: 2B (İntro Plaza), Batıkent/ANKARA** — değişirse `iletisim.html` ve `index.html` (footer) içinde aratıp değiştirin. Haritadaki işaret işletmenin Google kaydına bağlıdır; adres metni değişse de işaret Google Business Profile üzerinden yönetilir.
- **Marka: LokasyON Şimşek** — logo, menü ve footer'da SVG olarak çizilidir; renkleri `css/style.css` üstündeki değişkenlerden ayarlanır.
- **Çalışma düzeni:** Sabit saat yerine "Gelmeden önce lütfen arayın" notu kullanılıyor.

## 2. İsteğe bağlı düzenlemeler

- **Çalışma saatleri:** `09.00 – 20.00` yazan yerleri aratın.
- **İstatistikler (500+ üye, 8+ yıl vb.):** `index.html` içinde `data-count="500"` gibi değerleri gerçek rakamlarla değiştirin.
- **Üye yorumları:** Kod bilgisi GEREKMEZ — sitedeki `admin.html` sayfasını açın (ör. `siteadresi/admin.html`). İlk kullanımda sayfadaki adımları izleyerek GitHub erişim anahtarı oluşturup yapıştırın; sonrasında yorum ekleme/silme/düzenleme/sıralama tamamen paneldendir. "Kaydet ve Yayınla" düğmesi değişikliği doğrudan GitHub'a işler, site 1-2 dakikada güncellenir. (Yorumları yayınlarken üyeden izin almayı unutmayın.)
- **Fotoğraflar:** Şu an Unsplash'ten ücretsiz stok fotoğraflar kullanılıyor. Kendi fotoğraflarınızı kullanmak için proje içine `img` klasörü açıp fotoğrafları oraya koyun, sonra `index.html` içindeki `https://images.unsplash.com/...` adreslerini `img/dosyaadi.jpg` ile değiştirin. **Kendi mekân ve etkinlik fotoğraflarınız siteyi çok daha inandırıcı yapar — şiddetle tavsiye edilir.**
- **Renkler:** `css/style.css` dosyasının en üstündeki `:root` bölümünden tüm renkleri tek yerden değiştirebilirsiniz.
- **Resmi içerik sayfaları:** Menüdeki "Herbalife" açılır listesinde Ürünler, Tarifler, Makaleler ve Ürün Güvenliği S.S.S. sayfaları var; tüm metinler resmi Herbalife Türkiye sitesinden birebir alınır. **Güncelleme OTOMATİKTİR:** her pazartesi sabahı GitHub, resmi siteyi tarayıp yeni/değişen ürün ve içerikleri kendiliğinden siteye işler (repo → Actions sekmesinden izlenebilir; "Run workflow" ile istediğiniz an elle de tetiklenir). Bilgisayardan elle çalıştırmak isterseniz: `python araclar/urunler-guncelle.py` ve `python araclar/icerik-guncelle.py`.
- **Ürün kataloğu:** `urunler.html` sayfası, resmi Herbalife Türkiye sitesindeki tüm ürünleri (ad, açıklama, görsel) `data/urunler.json` dosyasından gösterir. Herbalife kataloğa ürün ekleyip çıkardıkça güncellemek için bilgisayarda `python araclar/urunler-guncelle.py` çalıştırıp değişikliği GitHub'a gönderin. Her üründeki "Bilgi / Sipariş" düğmesi ürün adıyla hazır WhatsApp mesajı açar.
- **Hesaplama aracı:** "Hesaplama" bölümü ziyaretçinin BMI, günlük kalori (Mifflin-St Jeor formülü) ve makro ihtiyacını hesaplar; "Sonuçlarımı WhatsApp'tan Gönder" butonu sonuçları doğrudan size iletir — yani araç aynı zamanda müşteri kazanma kanalıdır. Formüller `js/calculator.js` içindedir; grafik için Chart.js internetten (CDN) yüklenir, ekstra kurulum gerekmez.

## 3. Yayın durumu

Site **GitHub Pages ile yayında**: https://lokasyonsimsek.com/

- `main` dalına gönderilen (push edilen) her değişiklik 1-2 dakika içinde otomatik yayınlanır.
- Yorum paneli: https://lokasyonsimsek.com/admin.html — kullanımı için `YORUM-EKLEME-REHBERI.md` dosyasına bakın.
- Alan adı `lokasyonsimsek.com` Namecheap'ten alındı ve GitHub Pages'e bağlandı (DNS: 4 A kaydı + www CNAME). Eski `hasankkilic.github.io/Herbalife` adresi otomatik olarak yeni adrese yönlenir.

## 4. Yasal not

Footer'daki "Bağımsız Herbalife Üyesi" açıklaması bilinçli olarak eklendi — Herbalife üyelerinin kendi sitelerinde bu tür bir açıklama bulundurması beklenir ve siteye profesyonellik/güvenilirlik katar. Silmemenizi öneririz. Ayrıca "Herbalife" logo ve görsellerini resmi izin olmadan kullanmamaya dikkat edin; bu site bu yüzden kendi markası ("LokasyON Şimşek") üzerine kuruldu.
