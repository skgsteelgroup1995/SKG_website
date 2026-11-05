class Component extends DCLogic {
constructor(props) {
super(props);
let start = 'c0';
try { const v = sessionStorage.getItem('skgCat'); if (v) { sessionStorage.removeItem('skgCat'); start = v; } } catch (e) {}
this.state = { cat: start, q: '' };
}
componentDidMount() {
document.addEventListener('touchstart', function () {}, { passive: true });
}
renderVals() {
const accent = this.props.accent ?? '#A80101';
const DATA = [{"id":"c0","name":"เหล็กเส้นข้ออ้อย","items":[{"s":"SD.40 Ø 12 มม.","l":"10 ม.","u":"เส้น","b":true},{"s":"SD.40 Ø 12 มม.","l":"12 ม.","u":"เส้น","b":false},{"s":"SD.40 Ø 16 มม.","l":"10 ม.","u":"เส้น","b":true},{"s":"SD.40 Ø 16 มม.","l":"12 ม.","u":"เส้น","b":false},{"s":"SD.40 Ø 20 มม.","l":"10 ม.","u":"เส้น","b":true},{"s":"SD.40 Ø 20 มม.","l":"12 ม.","u":"เส้น","b":false},{"s":"SD.40 Ø 25 มม.","l":"10 ม.","u":"เส้น","b":false},{"s":"SD.40 Ø 25 มม.","l":"12 ม.","u":"เส้น","b":false}]},{"id":"c1","name":"เหล็กเส้นกลม","items":[{"s":"SR.24 Ø 6 มม.","l":"10 ม.","u":"เส้น","b":true},{"s":"SR.24 Ø 8 มม.","l":"10 ม.","u":"เส้น","b":true},{"s":"SR.24 Ø 9 มม.","l":"10 ม.","u":"เส้น","b":true},{"s":"SR.24 Ø 12 มม.","l":"10 ม.","u":"เส้น","b":false}]},{"id":"c2","name":"เหล็กกล่อง","items":[{"s":"1\" x 1\" หนา 1.2 มม.","l":"6 ม.","u":"เส้น"},{"s":"1\" x 1\" หนา 1.5 มม.","l":"6 ม.","u":"เส้น"},{"s":"1\" x 1\" หนา 2.3 มม.","l":"6 ม.","u":"เส้น"},{"s":"1\" x 2\" หนา 1.5 มม.","l":"6 ม.","u":"เส้น"},{"s":"1\" x 2\" หนา 2.3 มม.","l":"6 ม.","u":"เส้น"},{"s":"1 ½\" x 1 ½\" หนา 1.5 มม.","l":"6 ม.","u":"เส้น"},{"s":"1 ½\" x 1 ½\" หนา 2.3 มม.","l":"6 ม.","u":"เส้น"},{"s":"1 ½\" x 3\" หนา 1.5 มม.","l":"6 ม.","u":"เส้น"},{"s":"1 ½\" x 3\" หนา 2.3 มม.","l":"6 ม.","u":"เส้น"},{"s":"2\" x 2\" หนา 1.5 มม.","l":"6 ม.","u":"เส้น"},{"s":"2\" x 2\" หนา 2.3 มม.","l":"6 ม.","u":"เส้น"},{"s":"3\" x 3\" หนา 1.8 มม.","l":"6 ม.","u":"เส้น"},{"s":"3\" x 3\" หนา 2.3 มม.","l":"6 ม.","u":"เส้น"},{"s":"4\" x 2\" หนา 1.5 มม.","l":"6 ม.","u":"เส้น"},{"s":"4\" x 2\" หนา 2.3 มม.","l":"6 ม.","u":"เส้น"},{"s":"4\" x 2\" หนา 3.2 มม.","l":"6 ม.","u":"เส้น"},{"s":"4\" x 4\" หนา 2.0 มม.","l":"6 ม.","u":"เส้น"},{"s":"4\" x 4\" หนา 2.3 มม.","l":"6 ม.","u":"เส้น"},{"s":"4\" x 4\" หนา 3.2 มม.","l":"6 ม.","u":"เส้น"},{"s":"5\" x 2\" หนา 2.3 มม.","l":"6 ม.","u":"เส้น"},{"s":"5\" x 2\" หนา 3.2 มม.","l":"6 ม.","u":"เส้น"},{"s":"5\" x 3\" หนา 2.3 มม.","l":"6 ม.","u":"เส้น"},{"s":"5\" x 3\" หนา 3.2 มม.","l":"6 ม.","u":"เส้น"},{"s":"5\" x 5\" หนา 3.2 มม.","l":"6 ม.","u":"เส้น"},{"s":"6\" x 2\" หนา 2.3 มม.","l":"6 ม.","u":"เส้น"},{"s":"6\" x 2\" หนา 3.2 มม.","l":"6 ม.","u":"เส้น"},{"s":"6\" x 6\" หนา 3.2 มม.","l":"6 ม.","u":"เส้น"}]},{"id":"c3","name":"เหล็กตัว C","items":[{"s":"75 x 45 x 15 มม. หนา 1.6 มม.","l":"6 ม.","u":"เส้น"},{"s":"75 x 45 x 15 มม. หนา 2.0 มม.","l":"6 ม.","u":"เส้น"},{"s":"75 x 45 x 15 มม. หนา 2.3 มม.","l":"6 ม.","u":"เส้น"},{"s":"100 x 50 x 20 มม. หนา 1.6 มม.","l":"6 ม.","u":"เส้น"},{"s":"100 x 50 x 20 มม. หนา 2.0 มม.","l":"6 ม.","u":"เส้น"},{"s":"100 x 50 x 20 มม. หนา 2.3 มม.","l":"6 ม.","u":"เส้น"},{"s":"100 x 50 x 20 มม. หนา 3.2 มม.","l":"6 ม.","u":"เส้น"},{"s":"125 x 50 x 20 มม. หนา 2.3 มม.","l":"6 ม.","u":"เส้น"},{"s":"125 x 50 x 20 มม. หนา 3.2 มม.","l":"6 ม.","u":"เส้น"},{"s":"150 x 50 x 20 มม. หนา 2.3 มม.","l":"6 ม.","u":"เส้น"},{"s":"150 x 50 x 20 มม. หนา 3.2 มม.","l":"6 ม.","u":"เส้น"},{"s":"150 x 65 x 20 มม. หนา 2.3 มม.","l":"6 ม.","u":"เส้น"},{"s":"150 x 75 x 25 มม. หนา 3.2 มม.","l":"6 ม.","u":"เส้น"}]},{"id":"c4","name":"เหล็กท่อดำ","items":[{"s":"Ø 1\" หนา 1.5 มม.","l":"6 ม.","u":"เส้น"},{"s":"Ø 1\" หนา 2.3 มม.","l":"6 ม.","u":"เส้น"},{"s":"Ø 1 ½\" หนา 1.5 มม.","l":"6 ม.","u":"เส้น"},{"s":"Ø 1 ½\" หนา 2.3 มม.","l":"6 ม.","u":"เส้น"},{"s":"Ø 2\" หนา 1.5 มม.","l":"6 ม.","u":"เส้น"},{"s":"Ø 2\" หนา 2.0 มม.","l":"6 ม.","u":"เส้น"},{"s":"Ø 2\" หนา 2.3 มม.","l":"6 ม.","u":"เส้น"},{"s":"Ø 2\" หนา 3.2 มม.","l":"6 ม.","u":"เส้น"},{"s":"Ø 2 ½\" หนา 3.2 มม.","l":"6 ม.","u":"เส้น"},{"s":"Ø 3\" หนา 2.0 มม.","l":"6 ม.","u":"เส้น"},{"s":"Ø 3\" หนา 2.3 มม.","l":"6 ม.","u":"เส้น"},{"s":"Ø 3\" หนา 3.2 มม.","l":"6 ม.","u":"เส้น"},{"s":"Ø 3 ½\" หนา 3.2 มม.","l":"6 ม.","u":"เส้น"},{"s":"Ø 4\" หนา 2.3 มม.","l":"6 ม.","u":"เส้น"},{"s":"Ø 4\" หนา 3.2 มม.","l":"6 ม.","u":"เส้น"}]},{"id":"c5","name":"เหล็กฉาก","items":[{"s":"1\" หนา 3 มม.","l":"6 ม.","u":"เส้น"},{"s":"1 ½\" หนา 3 มม.","l":"6 ม.","u":"เส้น"},{"s":"2\" หนา 4 มม.","l":"6 ม.","u":"เส้น"},{"s":"2\" หนา 6 มม.","l":"6 ม.","u":"เส้น"},{"s":"3\" หนา 6 มม.","l":"6 ม.","u":"เส้น"},{"s":"4\" หนา 10 มม.","l":"6 ม.","u":"เส้น"}]},{"id":"c6","name":"เหล็กแบน","items":[{"s":"2\" หนา 4 มม.","l":"6 ม.","u":"เส้น"},{"s":"2\" หนา 6 มม.","l":"6 ม.","u":"เส้น"},{"s":"3\" หนา 6 มม.","l":"6 ม.","u":"เส้น"},{"s":"4\" หนา 9 มม.","l":"6 ม.","u":"เส้น"}]},{"id":"c7","name":"เหล็กแผ่น","items":[{"s":"6\" x 6\" หนา 6 มม.","l":"–","u":"แผ่น"},{"s":"8\" x 8\" หนา 4 มม.","l":"–","u":"แผ่น"}]},{"id":"c8","name":"ไวร์เมช","items":[{"s":"Ø 3 มม. ตาราง 0.20 x 0.20 ม.","l":"–","u":"ตร.ม. / ม้วน"},{"s":"Ø 4 มม. ตาราง 0.20 x 0.20 ม.","l":"–","u":"ตร.ม. / ม้วน"},{"s":"Ø 6 มม. ตาราง 0.15 x 0.15 ม.","l":"–","u":"ตร.ม. / ม้วน"},{"s":"Ø 6 มม. ตาราง 0.20 x 0.20 ม.","l":"–","u":"ตร.ม. / ม้วน"},{"s":"Ø 8 มม. ตาราง 0.20 x 0.20 ม.","l":"–","u":"ตร.ม. / ม้วน"},{"s":"Ø 8 มม. ตาราง 0.25 x 0.25 ม.","l":"–","u":"ตร.ม. / ม้วน"}]},{"id":"c9","name":"เหล็กปลอก","items":[{"s":"0.15 x 0.15 ม.","l":"–","u":"ตัว"},{"s":"0.15 x 0.35 ม.","l":"–","u":"ตัว"}]},{"id":"c10","name":"ลวดผูกเหล็ก","items":[{"s":"ลวดผูกเหล็ก","l":"–","u":"ขด","b":true}]},{"id":"c11","name":"ตะปู","items":[{"s":"2 ½\"","l":"–","u":"กล่อง"},{"s":"3\"","l":"–","u":"กล่อง"}]}];
const base = 'width: 100%; display: flex; justify-content: space-between; align-items: center; gap: 8px; padding: 13px 18px; font: inherit; font-size: 16px; text-align: left; cursor: pointer; border: none; border-top: 1px solid #E2E4E6; min-height: 48px;';
const cats = DATA.map((c) => {
const on = c.id === this.state.cat;
return {
name: c.name, count: c.items.length, on: on ? 'true' : 'false',
style: base + (on ? 'background: ' + accent + '; color: #FFFFFF; font-weight: 600;' : 'background: #FFFFFF; color: #2E3236;'),
pick: () => { this.setState({ cat: c.id, q: '' }); }
};
});
const cur = DATA.find((c) => c.id === this.state.cat) || DATA[0];
const q = this.state.q.trim().toLowerCase();
const label = (c, r) => { const pre = c.name; return r.s.indexOf(pre) === 0 ? r.s : pre + ' ' + r.s; };
const toRow = (c, r) => { const hasL = !!r.l && r.l !== '–' && r.l !== '-'; const s = label(c, r); const line = s + (hasL ? ' ยาว ' + r.l : '') + ' จำนวน  ' + (r.u || ''); return { s: s, l: hasL ? r.l : '-', hasL: hasL, u: r.u, b: !!r.b, ask: () => { try { const prev = (sessionStorage.getItem('skgQuote') || '').replace(/\s+$/, ''); if (prev.split('\n').indexOf(line) < 0) sessionStorage.setItem('skgQuote', prev ? prev + '\n' + line : line); sessionStorage.setItem('skgQuoteLast', line); } catch (e) {} } }; };
const words = q.split(/\s+/).filter(Boolean);
const match = (c, r) => { const hay = (c.name + ' ' + label(c, r)).toLowerCase(); return words.every((w) => hay.indexOf(w) >= 0); };
const total = DATA.reduce((n, c) => n + c.items.length, 0);
const rows = q
? DATA.reduce((acc, c) => acc.concat(c.items.filter((r) => match(c, r)).map((r) => toRow(c, r))), [])
: cur.items.map((r) => toRow(cur, r));
const title = q ? ('ผลการค้นหา “' + this.state.q.trim() + '”') : cur.name;
const PRODUCT_SHOTS = { c0: 1, c1: 1, c2: 1, c3: 1, c4: 1, c5: 1, c6: 1, c7: 1, c8: 1, c9: 1, c10: 1, c11: 1 };
const photoFit = PRODUCT_SHOTS[cur.id] ? 'contain' : 'cover';
const PHOTOS = { c0: '/images/cat-deformed-bar.jpg', c1: '/images/cat-round-bar.jpg', c2: '/images/cat-box-tube.jpg', c3: '/images/cat-c-channel.jpg', c4: '/images/cat-black-pipe.jpg', c5: '/images/cat-angle.jpg', c6: '/images/cat-flat-bar.jpg', c7: '/images/cat-plate.jpg', c8: '/images/cat-wiremesh.jpg', c9: '/images/cat-stirrup.jpg', c10: '/images/cat-tie-wire.jpg', c11: '/images/cat-nail.jpg' };
const photo = q ? '' : (PHOTOS[cur.id] || '');
const DWG = { c2: ['/images/dwg-box-tube.svg', 'B = ด้านกว้าง · H = ด้านสูง · t = ความหนา'], c3: ['/images/dwg-c-channel.svg', 'H = ความสูง · B = ปีก · C = ขอบพับ · t = ความหนา'], c4: ['/images/dwg-black-pipe.svg', 'D = เส้นผ่านศูนย์กลาง · t = ความหนา'], c5: ['/images/dwg-angle.svg', 'H, B = ความยาวขา · t = ความหนา'], c6: ['/images/dwg-flat-bar.svg', 'b = ความกว้าง · t = ความหนา'] };
const dw = q ? null : DWG[cur.id];
return {
photo, photoFit, hasPhoto: !!photo, noPhoto: !photo && !q,
hasDwg: !!dw, dwg: dw ? dw[0] : '', dwgCap: dw ? dw[1] : '', dwgAlt: dw ? ('หน้าตัด' + cur.name + ' ' + dw[1]) : '',
accent, cats, cur, rows, title, q: this.state.q, notSearch: !q,
empty: rows.length === 0,
shownLabel: q ? ('พบ ' + rows.length + ' จากทั้งหมด ' + total + ' รายการ') : (cur.items.length + ' รายการ'),
onSearch: (e) => this.setState({ q: e.target.value }),
hasQ: this.state.q.length > 0,
clearQ: () => { this.setState({ q: '' }); const el = document.getElementById('q'); if (el) { el.value = ''; el.focus(); } }
};
}
}
