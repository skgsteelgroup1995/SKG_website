"""One-time: pull page sources + images out of the prototype HTML."""
import base64, io, json, os, re, sys
from PIL import Image

proto, out = sys.argv[1], sys.argv[2]
s = open(proto, encoding='utf-8').read()
pages = json.loads(re.search(r'var PAGES = (\{.*?\});\nvar IMG', s, re.S).group(1))
imgs = json.loads(re.search(r'var IMG = (\{.*?\});\n', s, re.S).group(1))
os.makedirs(out + '/src/pages', exist_ok=True)
for r, p in pages.items():
    open(f'{out}/src/pages/{r}.tpl.html', 'w', encoding='utf-8').write(p['tpl'].strip() + '\n')
    open(f'{out}/src/pages/{r}.js', 'w', encoding='utf-8').write(p['js'].strip() + '\n')
for m in re.finditer(r'<style data-route="(\w+)" media="not all">\n(.*?)</style>', s, re.S):
    open(f'{out}/src/pages/{m.group(1)}.css', 'w', encoding='utf-8').write(m.group(2))
g = re.search(r'<style>\n(.*?)</style>', s, re.S).group(1)
open(f'{out}/src/global.css', 'w', encoding='utf-8').write(g)
used = set(re.findall(r'__IMG_([0-9a-f]{32})__', json.dumps(pages)))
info = {}
os.makedirs(out + '/raw', exist_ok=True)
for k, v in imgs.items():
    if k not in used: continue
    mt, b = re.match(r'data:image/([a-z+]+);base64,(.*)', v, re.S).groups()
    data = base64.b64decode(b)
    ext = {'svg+xml': 'svg', 'jpeg': 'jpg', 'png': 'png'}[mt]
    open(f'{out}/raw/{k}.{ext}', 'wb').write(data)
    size = None
    if ext != 'svg':
        size = Image.open(io.BytesIO(data)).size
    info[k] = [ext, size, len(data)]
json.dump(info, open(out + '/raw/info.json', 'w'), indent=1)
print(len(used), 'used images')
for k, v in info.items(): print(k, v)
