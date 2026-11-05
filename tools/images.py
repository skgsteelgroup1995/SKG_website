"""Convert extracted raw images to WebP (SVG copied as-is) under site/images, and rewrite __IMG_id__ tokens in src/ to real paths."""
import json, os, re, shutil, glob
from PIL import Image
root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
names = json.load(open(f'{root}/tools/names.json'))
info = json.load(open(f'{root}/raw/info.json'))
os.makedirs(f'{root}/site/images', exist_ok=True)
paths = {}
for k, (ext, size, _) in info.items():
    n = names[k]
    if ext == 'svg':
        shutil.copy(f'{root}/raw/{k}.svg', f'{root}/site/images/{n}.svg'); paths[k] = f'/images/{n}.svg'; continue
    im = Image.open(f'{root}/raw/{k}.{ext}')
    im = im.convert('RGBA' if im.mode in ('RGBA', 'LA', 'P') else 'RGB')
    cap = 1000 if n.startswith('about-wire') else (1600 if n.startswith('hero') else 2000)
    if im.width > cap: im = im.resize((cap, round(im.height * cap / im.width)), Image.LANCZOS)
    lossless = n.startswith(('logo', 'line-qr'))
    im.save(f'{root}/site/images/{n}.webp', 'WEBP', quality=(70 if n.startswith('hero-4') else 80 if n.startswith('hero') else 86), method=6, lossless=lossless)
    paths[k] = f'/images/{n}.webp'
for f in glob.glob(f'{root}/src/pages/*'):
    t = open(f, encoding='utf-8').read()
    t2 = re.sub(r'__IMG_([0-9a-f]{32})__', lambda m: paths[m.group(1)], t)
    if t2 != t: open(f, 'w', encoding='utf-8').write(t2)
print('done')
