import re, os
P = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'src/pages')
def rd(n): return open(f'{P}/{n}', encoding='utf-8').read()
def wr(n, t): open(f'{P}/{n}', 'w', encoding='utf-8').write(t)
LINKS = {'Main.dc.html': '/', 'Products.dc.html': '/products', 'About.dc.html': '/about', 'Contact.dc.html': '/contact', 'Privacy.dc.html': '/privacy'}
MAP_SRC = 'https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d1075.5994956123586!2d100.7509434!3d13.9270919!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x311d7bb445ded477%3A0xf992be846803da0f!2z4Lia4Lij4Li04Lip4Lix4LiXIOC4quC4q-C5gOC4iOC4o-C4tOC4jeC4geC4tOC4iCDguKrguJXguLXguKUg4LiI4Liz4LiB4Lix4LiU!5e1!3m2!1sth!2sth!4v1793691354616!5m2!1sth!2sth'
EAGER = ('alt="SKG"', 'alt="LINE" width="18"', 'class="{{s.cls}}"', 'class="aimg-main"', 'src="{{photo}}"', 'src="{{dwg}}"')
for r in ['home', 'products', 'about', 'contact', 'privacy']:
    t = rd(f'{r}.tpl.html')
    for a, b in LINKS.items():
        t = t.replace(f'href="{a}#', f'href="{b}#').replace(f'href="{a}"', f'href="{b}"')
    t = t.replace(' target="_top"', '')
    t = t.replace('href="https://maps.app.goo.gl/seg3NwcKhmWYtKRW7"', 'href="https://maps.app.goo.gl/seg3NwcKhmWYtKRW7" target="_blank" rel="noopener"')
    def lazy(m):
        tag = m.group(0)
        if 'loading=' in tag or any(e in tag for e in EAGER): return tag.replace('<img ', '<img decoding="async" ', 1) if 'decoding=' not in tag else tag
        return tag.replace('<img ', '<img loading="lazy" decoding="async" ', 1)
    t = re.sub(r'<img [^>]*>', lazy, t)
    if r == 'about':
        t = re.sub(r'\n<section class="wip".*?</section>\n', '\n', t, flags=re.S)
    if r == 'home':
        t = re.sub(r'<div class="ph" style="flex: 1 1 520px; min-width: 0; min-height: 340px;[^"]*">.*?</div>',
            '<div class="mapbox" style="flex: 1 1 520px; min-width: 0; min-height: 340px; background: #EEF0F1; border: 1px solid #E2E4E6; overflow: hidden"><iframe title="แผนที่ร้าน สหเจริญกิจ สตีล กรุ๊ป" src="' + MAP_SRC + '" loading="lazy" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen="" style="border: 0; width: 100%; height: 100%; min-height: 340px; display: block"></iframe></div>', t, flags=re.S)
    if r == 'contact':
        t = re.sub(r'<div style="height: 240px; border-radius: 6px; border: 1px solid #E2E4E6; background-color: #EEF0F1;.*?นำทางด้วย Google Maps</a>\n</div>',
            '<div style="border-radius: 6px; border: 1px solid #E2E4E6; overflow: hidden; display: flex; flex-direction: column">\n<iframe title="แผนที่ร้าน สหเจริญกิจ สตีล กรุ๊ป" src="' + MAP_SRC + '" loading="lazy" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen="" style="border: 0; width: 100%; height: 280px; display: block; background: #EEF0F1"></iframe>\n'
            '<div style="padding: 14px 16px; display: flex; flex-wrap: wrap; gap: 10px 16px; align-items: center; justify-content: space-between; background: #FFFFFF"><span style="display: flex; flex-direction: column; line-height: 1.4"><span style="font-weight: 600; color: #2E3236">สหเจริญกิจ สตีล กรุ๊ป</span><span style="font-size: 14px; color: #4A4F55">ถ.นิมิตใหม่ อ.ลำลูกกา</span></span>'
            '<a href="https://maps.app.goo.gl/seg3NwcKhmWYtKRW7" target="_blank" rel="noopener" style="background: #2E3236; color: #FFFFFF; text-decoration: none; padding: 10px 18px; font-weight: 600; font-size: 14px">นำทางด้วย Google Maps</a></div>\n</div>', t, flags=re.S)
        # form: names for submission, error + sending states
        t = t.replace('<input id="nm" required=""', '<input id="nm" name="name" required=""')
        t = t.replace('<input id="ph" required=""', '<input id="ph" name="phone" required=""')
        t = t.replace('<textarea id="it" onInput', '<textarea id="it" name="items" onInput')
        t = t.replace('<button class="sendq" type="submit" style="',
            '<template data-sc="if" value="{{error}}" hint-placeholder-val="{{false}}"><div role="alert" style="background: #FBECEC; border: 1px solid #E8A3A3; color: #7A0000; padding: 14px 16px; line-height: 1.6">ส่งข้อมูลไม่สำเร็จ กรุณาลองใหม่อีกครั้ง หรือโทร <a href="tel:0811043733" style="color: #7A0000; font-weight: 600">081-104-3733</a> / LINE <a href="https://line.me/R/ti/p/@skg.steel" target="_blank" rel="noopener" style="color: #7A0000; font-weight: 600">@skg.steel</a></div></template>\n'
            '<button class="sendq" type="submit" disabled="{{sending}}" aria-busy="{{sending}}" style="opacity: {{btnOpacity}}; ')
        t = t.replace('min-height: 48px">ส่งเพื่อขอราคา</button>', 'min-height: 48px">{{btnLabel}}</button>')
    wr(f'{r}.tpl.html', t)

# about.js: drop gallery logic (section removed)
wr('about.js', '''class Component extends DCLogic {
componentDidMount() {
document.addEventListener('touchstart', function () {}, { passive: true });
}
renderVals() {
return { accent: this.props.accent ?? '#A80101' };
}
}
''')
# contact.js: real submission
c = rd('contact.js')
c = c.replace("this.state = { sent: false, phone: '' };", "this.state = { sent: false, phone: '', sending: false, error: false };")
c = c.replace("submit: (e) => { e.preventDefault(); try { sessionStorage.removeItem('skgQuote'); } catch (er) {} this.setState({ sent: true }); },",
"""sending: this.state.sending,
error: this.state.error,
btnLabel: this.state.sending ? 'กำลังส่ง…' : 'ส่งเพื่อขอราคา',
btnOpacity: this.state.sending ? '0.7' : '1',
submit: (e) => { e.preventDefault(); this.send(e.target); },""")
c = c.replace("reset: () => this.setState({ sent: false, phone: '' })", "reset: () => this.setState({ sent: false, phone: '', error: false })")
c = c.replace("renderVals() {", """send(form) {
if (this.state.sending) return;
const v = (id) => ((form.querySelector('#' + id) || {}).value || '').trim();
const data = { 'ชื่อ-นามสกุล': v('nm'), 'เบอร์โทรศัพท์': v('ph'), 'รายการสินค้าและจำนวน': v('it'), _subject: 'ขอใบเสนอราคาจากเว็บไซต์ – ' + v('nm'), _template: 'table', _captcha: 'false', _honey: '' };
this.setState({ sending: true, error: false, phone: v('ph') });
fetch(window.SKG_FORM_ENDPOINT, { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify(data) })
.then((r) => r.json().catch(() => ({})).then((j) => { if (!r.ok || j.success === false || j.success === 'false') throw new Error(j.message || 'send failed'); }))
.then(() => { try { sessionStorage.removeItem('skgQuote'); } catch (er) {} this.setState({ sending: false, sent: true }); window.scrollTo({ top: 0, behavior: 'smooth' }); })
.catch(() => this.setState({ sending: false, error: true }));
}
renderVals() {""", 1)
wr('contact.js', c)
print('ok')
