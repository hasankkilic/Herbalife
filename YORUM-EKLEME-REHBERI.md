# 📝 Yorum Ekleme Rehberi — LokasyON Şimşek

Bu rehber, sitedeki **üye yorumlarını** nasıl ekleyip değiştireceğinizi anlatır.
Kod bilgisi gerekmez; her şey panel üzerinden yapılır.

## Adresler

| Ne | Adres |
|---|---|
| 🌐 Site | https://lokasyonsimsek.com/ |
| ⚙️ Yorum Paneli | https://lokasyonsimsek.com/admin.html |

> Panel adresini telefonunuzun/bilgisayarınızın yer imlerine (favorilere) ekleyin.
> Bu adresi müşterilerle paylaşmayın.

## 🔒 Panel şifresi

Panel açıldığında önce **panel şifresi** sorulur. Şifreyi site sahibinden öğrenin
(güvenlik nedeniyle bu belgede yazmıyor). Şifre bir kez girildikten sonra aynı
telefon/bilgisayarda bir daha sorulmaz.

---

## 🔑 İlk kurulum (sadece 1 kez yapılır)

Panelin kayıt yapabilmesi için GitHub'dan ücretsiz bir "erişim anahtarı" almanız gerekir.

1. **GitHub hesabı:** github.com'da hesabınız yoksa ücretsiz açın.
2. **Yetki:** Hesabınızın `hasankkilic/Herbalife` deposunda yazma yetkisi olmalı.
   Repo sahibi (Hasan) sizi şuradan ekleyebilir:
   *GitHub → Herbalife reposu → Settings → Collaborators → Add people → (sizin kullanıcı adınız)*.
   Size gelen davet e-postasını kabul edin. *(Anahtarı Hasan kendi hesabından oluşturup size da verebilir; o zaman bu adım gerekmez.)*
3. **Anahtar oluşturma:** Şu adrese gidin: https://github.com/settings/personal-access-tokens/new
   - **Token name:** `yorum-paneli` yazın.
   - **Expiration:** *Custom* seçip 1 yıl sonrasını seçin (süre dolunca aynı adımlarla yenisi alınır).
   - **Repository access:** *Only select repositories* → **hasankkilic/Herbalife** seçin.
   - **Permissions → Repository permissions → Contents:** **Read and write** yapın.
   - En altta **Generate token** düğmesine basın.
   - Ekranda çıkan `github_pat_...` ile başlayan uzun yazıyı **kopyalayın** (bu yazı bir daha gösterilmez!).
4. **Panele bağlanma:** Yorum panelini açın, en üstteki kutuya anahtarı yapıştırıp **Bağlan** deyin.
   "✅ Bağlandı" yazısını görünce kurulum bitmiştir. Anahtar bu tarayıcıda hatırlanır;
   aynı telefon/bilgisayardan bir daha girmeniz gerekmez.

⚠️ **Anahtarı kimseyle paylaşmayın** — anahtara sahip olan herkes sitedeki yorumları değiştirebilir.

---

## ➕ Yeni yorum böyle eklenir

1. Paneli açın: https://lokasyonsimsek.com/admin.html
2. **"+ Yeni Yorum Ekle"** düğmesine basın; listenin sonuna boş bir kart eklenir.
3. Kartı doldurun:
   - **Ad Soyad:** Üyenin adı + soyad baş harfi yazın, örn. `Ayşe K.` *(gizlilik için soyadı kısaltın)*
   - **Program:** örn. `Kilo Verme Programı`, `Kilo Alma Programı`, `Sporcu Beslenmesi`, `Cilt Bakımı`
   - **Süre:** örn. `3 ay`
   - **Yıldız:** genellikle ★★★★★
   - **Yorum:** Üyenin kendi cümleleriyle deneyimi, örn:
     > 3 ayda 20 kilo verdim ama en önemlisi aç kalmadım. Haftalık ölçümler sayesinde motivasyonum hiç düşmedi.
4. **"💾 Kaydet ve Yayınla"** düğmesine basın.
5. "✅ Kaydedildi!" yazısını bekleyin. **1-2 dakika içinde** sitede görünür.
   (Hemen görünmezse sayfayı Ctrl+F5 ile yenileyin.)

💡 **Önemli:** Yorumu yayınlamadan önce üyeden mutlaka izin alın.

## ✏️ Düzenleme, silme, sıralama

- **Düzenlemek için:** karttaki yazıyı doğrudan değiştirin → *Kaydet ve Yayınla*.
- **Silmek için:** kartın altındaki **🗑 Sil** → onaylayın → *Kaydet ve Yayınla*.
- **Sıralamak için:** **↑ Yukarı / ↓ Aşağı** düğmeleri → *Kaydet ve Yayınla*.
  Listenin en üstündeki yorum, sitede ilk gösterilen yorumdur.

> Kaydet demeden sayfayı kapatırsanız değişiklikler kaybolur — panel yalnızca
> *Kaydet ve Yayınla* düğmesine bastığınızda kayıt yapar.

---

## ❓ Sorun giderme

| Sorun | Çözüm |
|---|---|
| "Kaydetmek için önce bağlanın" | Yukarıdaki kutuya anahtarınızı yapıştırıp **Bağlan** deyin. |
| "Anahtar doğrulanamadı" | Anahtarı eksik kopyalamış olabilirsiniz; baştan sona seçip tekrar yapıştırın. Süresi dolduysa yeni anahtar alın (İlk kurulum → 3. adım). |
| "Kaydedilemedi: HTTP 404 / 403" | Hesabınızın repoda yazma yetkisi yok — repo sahibinin sizi Collaborator olarak eklemesi gerekir. |
| Kaydettim ama sitede görünmüyor | 1-2 dakika bekleyip site sayfasını **Ctrl+F5** (telefonda: tarayıcı menüsünden yenile) ile açın. |
| "Dosya başka yerden değişmiş olabilir" | Sayfayı yenileyin (güncel yorumlar gelir), değişikliğinizi tekrar yapıp kaydedin. |

Teknik bir sorun olursa siteyi yapan kişiye ulaşın. 🌿
