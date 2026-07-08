# -*- coding: utf-8 -*-
# ============================================================
# Herbalife TR resmi urun katalogunu ceker → data/urunler.json
#
# Kullanim (proje klasorunde):  python araclar/urunler-guncelle.py
# Herbalife yeni urun ekledikce bu betigi calistirip degisikligi
# GitHub'a gondermeniz yeterli; urunler.html sayfasi otomatik okur.
#
# Not: SADECE resmi sitedeki metin ve gorseller alinir,
# hicbir icerik elle eklenmez/degistirilmez.
# ============================================================
import json, re, time, urllib.request, os

SITEMAP = "https://www.herbalife.com/tr-tr/products_sitemap.xml"
OUT = os.path.join(os.path.dirname(__file__), "..", "data", "urunler.json")
HDRS = {"User-Agent": "Mozilla/5.0 (compatible; site-build/1.0)"}

def fetch(url):
    req = urllib.request.Request(url, headers=HDRS)
    with urllib.request.urlopen(req, timeout=30) as r:
        return r.read().decode("utf-8", "replace")

xml = fetch(SITEMAP)
urls = re.findall(r"<loc>([^<]+)</loc>", xml)
print(f"{len(urls)} urun bulundu", flush=True)

urunler = []
for i, url in enumerate(urls):
    try:
        html = fetch(url)
        m = re.search(r'<script id="__NEXT_DATA__" type="application/json">(.*?)</script>', html, re.S)
        v = json.loads(m.group(1))["props"]["pageProps"]["productDetails"]["productData"]["variant"]
        a = v.get("aemresponse") or {}
        attrs = (a.get("attributes") or {})
        flavor = ", ".join((attrs.get("flavor") or {}).get("values") or [])
        size = ", ".join((attrs.get("size1") or {}).get("values") or [])
        img = ((a.get("defaultImage") or {}).get("desktopImage") or {}).get("_publishUrl") or ""
        tabs = []
        for t in (a.get("productTabs") or []):
            desc = ((t.get("description") or {}).get("html") or "").strip()
            if t.get("title") and desc:
                tabs.append({"baslik": t["title"], "html": desc})
        urunler.append({
            "sku": v.get("sku", ""),
            "ad": ((v.get("name") or {}).get("tr-TR")) or v.get("productName", ""),
            "kategori": v.get("category_name", "") or "diger",
            "aroma": flavor,
            "boyut": size,
            "ozet": (a.get("metaDescription") or "").strip(),
            "gorsel": img,
            "resmiSayfa": url,
            "sekmeler": tabs,
        })
        print(f"[{i+1}/{len(urls)}] {v.get('sku','?')} ok", flush=True)
        time.sleep(0.25)
    except Exception as e:
        print(f"[{i+1}/{len(urls)}] HATA {url}: {e}", flush=True)

with open(OUT, "w", encoding="utf-8") as f:
    json.dump(urunler, f, ensure_ascii=False, indent=2)
print(f"\nYazildi: {os.path.abspath(OUT)} ({len(urunler)} urun)")
