# -*- coding: utf-8 -*-
# ============================================================
# Herbalife TR resmi sitesinden icerik ceker:
#   - Sik Sorulan Sorular  → data/sss.json
#   - Tarifler             → data/tarifler.json
#   - Makaleler            → data/makaleler.json
#
# Kullanim (proje klasorunde):  python araclar/icerik-guncelle.py
# SADECE resmi sitedeki metinler alinir, hicbir icerik elle yazilmaz.
# ============================================================
import json, re, time, urllib.request, os
import html as htmllib
from html.parser import HTMLParser

BASE = "https://www.herbalife.com"
HDRS = {"User-Agent": "Mozilla/5.0 (compatible; site-build/1.0)"}
VERI = os.path.join(os.path.dirname(__file__), "..", "data")

def fetch(url):
    req = urllib.request.Request(url, headers=HDRS)
    with urllib.request.urlopen(req, timeout=30) as r:
        return r.read().decode("utf-8", "replace")

class MainExtractor(HTMLParser):
    """<main> icindeki cmp-text bloklarinin HTML icerigini sirayla toplar."""
    def __init__(self):
        super().__init__(convert_charrefs=False)
        self.in_main = 0
        self.capture = 0
        self.parts = []
        self.buf = []
    def handle_starttag(self, tag, attrs):
        cls = dict(attrs).get("class", "")
        if tag == "main":
            self.in_main = 1
        if not self.in_main:
            return
        if self.capture:
            if tag == "div":
                self.capture += 1
            self.buf.append(self.get_starttag_text())
        elif "cmp-text" in cls and tag == "div":
            self.capture = 1
            self.buf = []
    def handle_endtag(self, tag):
        if self.capture:
            if tag == "div":
                self.capture -= 1
                if self.capture == 0:
                    self.parts.append("".join(self.buf))
                    return
            self.buf.append(f"</{tag}>")
        if tag == "main":
            self.in_main = 0
    def handle_data(self, d):
        if self.capture: self.buf.append(d)
    def handle_entityref(self, n):
        if self.capture: self.buf.append(f"&{n};")
    def handle_charref(self, n):
        if self.capture: self.buf.append(f"&#{n};")

def temizle(s, entity_coz=False):
    s = re.sub(r"[​‌﻿]", "", s or "").strip()
    return htmllib.unescape(s) if entity_coz else s

def sayfa_cek(url):
    html = fetch(url)
    h1 = re.search(r"<h1[^>]*>(.*?)</h1>", html, re.S)
    baslik = temizle(re.sub(r"<[^>]+>", "", h1.group(1)), True) if h1 else ""
    if not baslik:  # h1 yoksa <title>'dan al (" | Herbalife ..." son eki atilir)
        t = re.search(r"<title[^>]*>(.*?)</title>", html, re.S)
        if t:
            baslik = temizle(re.sub(r"<[^>]+>", "", t.group(1)).split("|")[0], True)
    og = re.search(r'property="og:description" content="([^"]*)"', html)
    img = re.search(r'property="og:image" content="([^"]*)"', html)
    p = MainExtractor(); p.feed(html)
    icerik = "\n".join(p.parts)
    icerik = re.sub(r"<h1[^>]*>.*?</h1>", "", icerik, flags=re.S)   # baslik zaten ayri
    icerik = re.sub(r'(href|src)="/', r'\1="' + BASE + "/", icerik)  # goreli linkleri mutlak yap
    icerik = temizle(icerik)
    return {
        "slug": url.rstrip("/").split("/")[-1],
        "baslik": baslik,
        "ozet": temizle(og.group(1), True) if og else "",
        "gorsel": img.group(1) if img else "",
        "icerikHtml": icerik,
        "resmiSayfa": url,
    }

def grup_cek(urls, dosya):
    veri = []
    gorulen = set()
    urls = [u for u in urls if not (u in gorulen or gorulen.add(u))]
    for i, u in enumerate(urls):
        try:
            veri.append(sayfa_cek(u))
            print(f"  [{i+1}/{len(urls)}] ok  {u.split('/')[-1]}", flush=True)
            time.sleep(0.25)
        except Exception as e:
            print(f"  [{i+1}/{len(urls)}] HATA {u}: {e}", flush=True)
    # ayni baslikli sayfalari (dil varyantlari vb.) tekille
    benzersiz, bas_gorulen = [], set()
    for x in veri:
        anahtar = x["baslik"].lower()
        if anahtar and anahtar in bas_gorulen:
            continue
        bas_gorulen.add(anahtar)
        benzersiz.append(x)
    veri = benzersiz
    yol = os.path.join(VERI, dosya)
    with open(yol, "w", encoding="utf-8") as f:
        json.dump(veri, f, ensure_ascii=False, indent=2)
    print(f"Yazildi: {os.path.abspath(yol)} ({len(veri)} kayit)\n")

# --- URL listeleri sitemap'lerden ---
diger = fetch(BASE + "/tr-tr/other_sitemap.xml")
sss_urls = [u for u in re.findall(r"<loc>([^<]+)</loc>", diger)
            if "/sik-sorulan-sorular/" in u]

wellness = fetch(BASE + "/tr-tr/wellness-resources_sitemap.xml")
tarif_urls = [u for u in re.findall(r"<loc>([^<]+)</loc>", wellness)
              if "/wellness-kaynaklari/tarifler/" in u]
makale_urls = [u for u in re.findall(r"<loc>([^<]+)</loc>", wellness)
               if "/wellness-kaynaklari/makaleler/" in u]

print(f"SSS: {len(sss_urls)} | Tarif: {len(tarif_urls)} | Makale: {len(makale_urls)}\n")
print("Sik Sorulan Sorular cekiliyor...")
grup_cek(sss_urls, "sss.json")
print("Tarifler cekiliyor...")
grup_cek(tarif_urls, "tarifler.json")
print("Makaleler cekiliyor...")
grup_cek(makale_urls, "makaleler.json")
