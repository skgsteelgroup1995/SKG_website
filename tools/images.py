"""Copy the original image files to site/images unchanged (no resizing, no re-compression),
and rewrite any __IMG_id__ tokens in src/ to the real paths."""
import json, os, re, shutil, glob
root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
names = json.load(open(f'{root}/tools/names.json'))
info = json.load(open(f'{root}/raw/info.json'))
os.makedirs(f'{root}/site/images', exist_ok=True)
paths = {}
for k, (ext, size, _) in info.items():
    n = names[k]
    shutil.copyfile(f'{root}/raw/{k}.{ext}', f'{root}/site/images/{n}.{ext}')
    paths[k] = f'/images/{n}.{ext}'
for f in glob.glob(f'{root}/src/pages/*'):
    t = open(f, encoding='utf-8').read()
    t2 = re.sub(r'__IMG_([0-9a-f]{32})__', lambda m: paths[m.group(1)], t)
    if t2 != t: open(f, 'w', encoding='utf-8').write(t2)
print('done')
