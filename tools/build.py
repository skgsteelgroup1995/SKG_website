"""Assemble site/*.html from src/. Run tools/prerender.mjs afterwards to fill the HTML for SEO."""
import hashlib, html, json, os, re
from PIL import Image
R = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
cfg = json.load(open(f'{R}/src/site.json', encoding='utf-8'))
S = f'{R}/site'
os.makedirs(f'{S}/assets', exist_ok=True)
for f in os.listdir(f'{S}/assets'):
    if f.endswith('.js'): os.remove(f'{S}/assets/{f}')

def hashed(name, content):
    h = hashlib.sha1(content.encode()).hexdigest()[:8]
    fn = f'{name}.{h}.js'
    open(f'{S}/assets/{fn}', 'w', encoding='utf-8').write(content)
    return f'/assets/{fn}'

runtime = hashed('runtime', open(f'{R}/src/runtime.js', encoding='utf-8').read())
glob_css = open(f'{R}/src/global.css', encoding='utf-8').read()
base = cfg['siteUrl'].rstrip('/')

# --- icons / OG image (from the SKG logo + storefront photo) ---
logo = Image.open(f'{R}/raw/92b2c5d7ce1c7a1fbce0bd3d8b8f94fa.png').convert('RGBA')
def square(sz, pad):
    c = Image.new('RGBA', (sz, sz), (255, 255, 255, 255))
    w = sz - 2 * pad; l = logo.resize((w, round(logo.height * w / logo.width)), Image.LANCZOS)
    c.alpha_composite(l, (pad, (sz - l.height) // 2)); return c
square(180, 12).convert('RGB').save(f'{S}/apple-touch-icon.png')
square(192, 12).convert('RGB').save(f'{S}/icon-192.png')
square(48, 2).save(f'{S}/favicon.ico', sizes=[(48, 48), (32, 32), (16, 16)])
square(32, 1).convert('RGB').save(f'{S}/favicon-32.png')
og = Image.open(f'{R}/raw/a74cd2409343f8cb2f66c8b446df27d2.jpg').convert('RGB')
W, H = 1200, 630; sc = max(W / og.width, H / og.height)
og = og.resize((round(og.width * sc), round(og.height * sc)), Image.LANCZOS)
og = og.crop(((og.width - W) // 2, (og.height - H) // 2, (og.width - W) // 2 + W, (og.height - H) // 2 + H)).convert('RGBA')
badge = Image.new('RGBA', (360, 170), (255, 255, 255, 240)); lw = 320
l = logo.resize((lw, round(logo.height * lw / logo.width)), Image.LANCZOS)
badge.alpha_composite(l, (20, (170 - l.height) // 2)); og.alpha_composite(badge, (40, 40))
bar = Image.new('RGBA', (W, 14), (168, 1, 1, 255)); og.alpha_composite(bar, (0, H - 14))
og.convert('RGB').save(f'{S}/og-image.jpg', quality=85)

LD = {"@context": "https://schema.org", "@type": "HardwareStore", "name": "บริษัท สหเจริญกิจ สตีล กรุ๊ป จำกัด",
      "alternateName": ["SKG Steel", "SAHACHAROENKIT STEEL GROUP CO.,LTD"], "url": base + '/', "logo": base + '/icon-192.png', "image": base + '/og-image.jpg',
      "telephone": ["+66811043733", "+6629930166"], "email": "skg.steelgroup1995@gmail.com", "foundingDate": "1995",
      "address": {"@type": "PostalAddress", "streetAddress": "139 หมู่ที่ 21 ถนนนิมิตใหม่ ตำบลลำลูกกา", "addressLocality": "อำเภอลำลูกกา", "addressRegion": "ปทุมธานี", "postalCode": "12150", "addressCountry": "TH"},
      "hasMap": "https://maps.app.goo.gl/seg3NwcKhmWYtKRW7",
      "openingHoursSpecification": [{"@type": "OpeningHoursSpecification", "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"], "opens": "08:00", "closes": "17:00"},
                                     {"@type": "OpeningHoursSpecification", "dayOfWeek": "Saturday", "opens": "08:00", "closes": "13:00"}],
      "sameAs": ["https://www.instagram.com/skg.steel/", "https://www.facebook.com/profile.php?id=61595573434478", "https://line.me/R/ti/p/@skg.steel"]}

PAGE = '''<!doctype html>
<html lang="th">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="format-detection" content="telephone=no, email=no, address=no">
<title>{title}</title>
<meta name="description" content="{desc}">
<link rel="canonical" href="{url}">
<meta name="theme-color" content="#A80101">
<meta property="og:type" content="website">
<meta property="og:locale" content="th_TH">
<meta property="og:site_name" content="{site}">
<meta property="og:title" content="{title}">
<meta property="og:description" content="{desc}">
<meta property="og:url" content="{url}">
<meta property="og:image" content="{base}/og-image.jpg">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="/favicon.ico" sizes="any">
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32.png">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Kanit:wght@500;600;700&amp;family=IBM+Plex+Sans+Thai:wght@400;500;600&amp;display=swap" rel="stylesheet">
{extra}<style>
{css}
{gcss}html{{scroll-behavior:smooth}}
</style>
</head>
<body>
<div id="app"><!--PRERENDER--></div>
<template id="tpl">{tpl}</template>
<script>window.SKG_FORM_ENDPOINT = {endpoint};</script>
<script src="{runtime}" defer></script>
<script src="{pagejs}" defer></script>
</body>
</html>
'''
urls = []
for r, p in cfg['pages'].items():
    tpl = open(f'{R}/src/pages/{r}.tpl.html', encoding='utf-8').read().strip()
    js = open(f'{R}/src/pages/{r}.js', encoding='utf-8').read()
    css = open(f'{R}/src/pages/{r}.css', encoding='utf-8').read()
    pagejs = hashed(r, '(function (DCLogic) {\n' + js + 'SKG.boot(Component);\n})(SKG.DCLogic);\n')
    url = base + (p['path'] if p['path'] != '/' else '/')
    extra = ''
    if r == 'home':
        extra = '<link rel="preload" as="image" href="/images/hero-1-storefront.webp" fetchpriority="high">\n'
        extra += '<script type="application/ld+json">' + json.dumps(LD, ensure_ascii=False) + '</script>\n'
    out = PAGE.format(title=html.escape(p['title']), desc=html.escape(p['description']), url=url, base=base, site=html.escape(cfg['siteName']),
                      extra=extra, css=css.strip(), gcss=glob_css, tpl=tpl, endpoint=json.dumps(cfg['formEndpoint']), runtime=runtime, pagejs=pagejs)
    fn = 'index.html' if r == 'home' else f'{r}.html'
    # keep a previous prerender if present
    old = f'{S}/{fn}'
    open(old, 'w', encoding='utf-8').write(out)
    urls.append((url, '1.0' if r == 'home' else ('0.3' if r == 'privacy' else '0.8')))
open(f'{S}/sitemap.xml', 'w').write('<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
    ''.join(f'  <url><loc>{u}</loc><priority>{pr}</priority></url>\n' for u, pr in urls) + '</urlset>\n')
open(f'{S}/robots.txt', 'w').write(f'User-agent: *\nAllow: /\n\nSitemap: {base}/sitemap.xml\n')
# remove images no page references (e.g. the hidden 'wip' gallery)
refs = ''.join(open(f'{R}/src/pages/{f}', encoding='utf-8').read() for f in os.listdir(f'{R}/src/pages'))
for f in os.listdir(f'{S}/images'):
    if f'/images/{f}' not in refs: os.remove(f'{S}/images/{f}'); print('removed unused', f)
print('built', [u for u, _ in urls])
