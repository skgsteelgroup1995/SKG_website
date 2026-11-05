(function (DCLogic) {
class Component extends DCLogic {
constructor(props) {
super(props);
this.state = { slide: 0, anim: 'slow' };
}
componentDidMount() {
document.addEventListener('touchstart', function () {}, { passive: true });
this.spot = (e) => { const c = e.target && e.target.closest ? e.target.closest('.bestcard') : null; if (!c) return; const r = c.getBoundingClientRect(); c.style.setProperty('--x', (e.clientX - r.left) + 'px'); c.style.setProperty('--y', (e.clientY - r.top) + 'px'); };
this.lit = (e) => { this.spot(e); if (e.pointerType === 'mouse') return; const c = e.target && e.target.closest ? e.target.closest('.bestcard') : null; if (!c) return; document.querySelectorAll('.bestcard.lit').forEach(x => { if (x !== c) x.classList.remove('lit'); }); c.classList.add('lit'); clearTimeout(c._lt); c._lt = setTimeout(() => c.classList.remove('lit'), 1200); };
document.addEventListener('pointermove', this.spot, { passive: true });
document.addEventListener('pointerdown', this.lit, { passive: true });
this.timer = setInterval(() => this.go(this.state.slide + 1), 6000);
this.hero = document.querySelector('.heroimg');
if (this.hero) {
this.zone = this.hero.closest('section') || this.hero;
this.ts = (e) => {
const t = e.touches[0]; const hr = this.hero.getBoundingClientRect(); if (t.clientX < hr.left || t.clientX > hr.right || t.clientY < hr.top || t.clientY > hr.bottom || (e.target.closest && e.target.closest('a,button'))) { this.sx = null; return; } this.sx = t.clientX; this.sy = t.clientY; this.st = Date.now(); this.lx = t.clientX; this.drag = null;
clearTimeout(this.snap); clearTimeout(this.endT); clearInterval(this.timer); cancelAnimationFrame(this.raf);
const tr = this.hero.querySelector('.track'), w = this.hero.clientWidth || 1;
let px = -100 * (this.state.slide + 1) / 100 * w;
try { const m = new DOMMatrixReadOnly(getComputedStyle(tr).transform); if (m) px = m.m41; } catch (er) {}
let pos = -px / w - 1;
if (pos > 7.5) { pos -= 8; px += 8 * w; }
if (pos < -0.5) { pos += 8; px -= 8 * w; }
this.base = pos; this.px0 = px; this.tr = tr;
if (tr) { tr.style.transition = 'none'; tr.style.transform = 'translate3d(' + px + 'px,0,0)'; }
};
this.tm = (e) => {
if (this.sx == null) return;
const t = e.touches[0], dx = t.clientX - this.sx, dy = t.clientY - this.sy;
this.lx = t.clientX;
if (this.drag == null) { if (Math.abs(dx) < 5 && Math.abs(dy) < 5) return; this.drag = Math.abs(dx) * 1.4 > Math.abs(dy); }
if (!this.drag) return;
cancelAnimationFrame(this.raf);
this.raf = requestAnimationFrame(() => { if (this.tr) this.tr.style.transform = 'translate3d(' + (this.px0 + dx) + 'px,0,0)'; });
};
this.te = (e) => {
if (this.sx == null) return;
cancelAnimationFrame(this.raf);
const t = e.changedTouches && e.changedTouches[0], ex = t ? t.clientX : this.lx, dx = ex - this.sx, w = this.hero.clientWidth || 1, dt = Date.now() - (this.st || 0);
const wasDrag = this.drag; this.sx = null; this.drag = null;
const tr = this.tr;
let n = Math.round(this.base);
if (wasDrag && (Math.abs(dx) > Math.min(45, w * 0.12) || (Math.abs(dx) > 18 && dt < 300))) n = Math.round(this.base) + (dx < 0 ? 1 : -1);
const dist = Math.abs((n + 1) * w + this.px0 + (wasDrag ? dx : 0));
const ms = Math.round(Math.max(220, Math.min(420, dist / w * 520)));
if (tr) { tr.style.transition = 'transform ' + ms + 'ms cubic-bezier(.22,.61,.36,1)'; tr.style.transform = 'translate3d(' + (-(n + 1) * w) + 'px,0,0)'; }
this.endT = setTimeout(() => {
const k = n >= 8 ? n - 8 : (n < 0 ? n + 8 : n);
if (tr) { tr.style.transition = 'none'; tr.style.transform = 'translateX(' + (-100 * (k + 1)) + '%)'; }
this.setState({ slide: k, anim: 'none' });
requestAnimationFrame(() => requestAnimationFrame(() => { if (tr) tr.style.transition = ''; }));
}, ms + 20);
this.timer = setInterval(() => this.go(this.state.slide + 1), 6000);
};
this.zone.addEventListener('touchstart', this.ts, { passive: true });
this.zone.addEventListener('touchmove', this.tm, { passive: true });
this.zone.addEventListener('touchend', this.te, { passive: true });
this.zone.addEventListener('touchcancel', this.te, { passive: true });
}
}
componentWillUnmount() {
document.removeEventListener('pointermove', this.spot); document.removeEventListener('pointerdown', this.lit);
clearInterval(this.timer);
clearTimeout(this.snap); clearTimeout(this.endT);
if (this.zone) { this.zone.removeEventListener('touchstart', this.ts); this.zone.removeEventListener('touchmove', this.tm); this.zone.removeEventListener('touchend', this.te); this.zone.removeEventListener('touchcancel', this.te); }
}
go(n, fast) {
clearTimeout(this.snap);
this.setState({ slide: n, anim: fast ? 'fast' : 'slow' });
const d = fast ? 450 : 1700;
if (n >= 8) this.snap = setTimeout(() => this.setState({ slide: 0, anim: 'none' }), d);
if (n < 0) this.snap = setTimeout(() => this.setState({ slide: 7, anim: 'none' }), d);
}
renderVals() {
const PICS = [
{ src: '/images/hero-1-storefront.jpg', alt: 'หน้าร้านบริษัท สหเจริญกิจ สตีล จำกัด ถนนนิมิตใหม่ ลำลูกกา' },
{ src: '/images/hero-2-rebar-stock.jpg', pos: '50% 81%', alt: 'กองเหล็กเส้นพร้อมส่งในคลัง SKG' },
{ src: '/images/hero-3-wire-coils.jpg', pos: '50% 0%', alt: 'ม้วนลวดและเหล็กเส้นกลมในคลัง SKG' },
{ src: '/images/hero-4-wiremesh.jpg', alt: 'แผงไวร์เมชพร้อมส่ง' },
{ src: '/images/hero-5-tie-wire.jpg', alt: 'ม้วนลวดผูกเหล็กพร้อมส่งในคลัง SKG' },
{ src: '/images/hero-6-loading.jpg', alt: 'เหล็กกล่อง ไวร์เมช และลวด เตรียมขึ้นรถขนส่ง' },
{ src: '/images/hero-7-warehouse.jpg', alt: 'สต็อกเหล็กหลากชนิดในโกดัง SKG' },
{ src: '/images/hero-8-crane.jpg', pos: '50% 48%', alt: 'รถเครนบรรทุกเหล็กในโกดัง SKG' }
];
const slides = [PICS[7]].concat(PICS, [PICS[0]]).map(p => ({ src: p.src, alt: p.alt, cls: p.cls || '', pos: p.pos || '50% 50%' }));
const cur = ((this.state.slide % 8) + 8) % 8;
const dots = PICS.map((p, i) => ({
label: 'รูปที่ ' + (i + 1), on: i === cur ? 'true' : 'false',
style: 'height: 8px; border: none; padding: 0; cursor: pointer; border-radius: 4px; transition: width 0.3s; ' + (i === cur ? 'width: 26px; background: #FFFFFF;' : 'width: 8px; background: rgba(255,255,255,0.5);'),
pick: () => { clearInterval(this.timer); this.go(i); this.timer = setInterval(() => this.go(this.state.slide + 1), 6000); }
}));
const slideX = -100 * (this.state.slide + 1);
const snapCls = this.state.anim === 'none' ? 'snap' : (this.state.anim === 'fast' ? 'fast' : '');
const IMG_REBAR = '/images/cat-deformed-bar.jpg', IMG_ROUND = '/images/cat-round-bar.jpg', IMG_BOX = '/images/cat-box-tube.jpg', IMG_C = '/images/cat-c-channel.jpg', IMG_WIRE = '/images/cat-tie-wire.jpg';
const catsRaw = [
{name:'เหล็กเส้นข้ออ้อย',count:8,img:IMG_REBAR},{name:'เหล็กเส้นกลม',count:4,img:IMG_ROUND},{name:'เหล็กกล่อง',count:27,img:IMG_BOX},
{name:'เหล็กตัว C',count:13,img:IMG_C},{name:'เหล็กท่อดำ',count:15,img:'/images/cat-black-pipe.jpg'},{name:'เหล็กฉาก',count:6,img:'/images/cat-angle.jpg'},
{name:'เหล็กแบน',count:4,img:'/images/cat-flat-bar.jpg'},{name:'เหล็กแผ่น',count:2,img:'/images/cat-plate.jpg'},{name:'ไวร์เมช',count:6,img:'/images/cat-wiremesh.jpg'},
{name:'เหล็กปลอก',count:2,img:'/images/cat-stirrup.jpg'},{name:'ลวดผูกเหล็ก',count:1,img:IMG_WIRE},{name:'ตะปู',count:2,img:'/images/cat-nail.jpg'}
];
const cats = catsRaw.map((c, i) => ({ ...c, img: c.img || '', hasImg: !!c.img, noImg: !c.img, go: () => { try { sessionStorage.setItem('skgCat', 'c' + i); } catch (e) {} } }));
const best = [
{cat:'เหล็กเส้นข้ออ้อย',spec:'SD.40 Ø 12 มม.',meta:'ยาว 10 ม.'},
{cat:'เหล็กเส้นข้ออ้อย',spec:'SD.40 Ø 16 มม.',meta:'ยาว 10 ม.'},
{cat:'เหล็กเส้นข้ออ้อย',spec:'SD.40 Ø 20 มม.',meta:'ยาว 10 ม.'},
{cat:'เหล็กเส้นกลม',spec:'SR.24 Ø 6 มม.',meta:'ยาว 10 ม.'},
{cat:'เหล็กเส้นกลม',spec:'SR.24 Ø 8 มม.',meta:'ยาว 10 ม.'},
{cat:'เหล็กเส้นกลม',spec:'SR.24 Ø 9 มม.',meta:'ยาว 10 ม.'},
{cat:'ลวด',spec:'ลวดผูกเหล็ก',meta:''}
];
const WIRE = IMG_WIRE;
const quote = (b) => { const isWire = b.cat === 'ลวด'; const line = (isWire ? b.spec : b.cat + ' ' + b.spec) + (b.meta ? ' ' + b.meta : '') + ' จำนวน  ' + (isWire ? 'ขด' : 'เส้น'); try { const prev = (sessionStorage.getItem('skgQuote') || '').replace(/\s+$/, ''); if (prev.split('\n').indexOf(line) < 0) sessionStorage.setItem('skgQuote', prev ? prev + '\n' + line : line); sessionStorage.setItem('skgQuoteLast', line); } catch (e) {} };
const bestImg = best.map((b) => ({ ...b, img: b.cat === 'ลวด' ? WIRE : (b.cat === 'เหล็กเส้นกลม' ? IMG_ROUND : IMG_REBAR), ask: () => quote(b) }));
return { accent: this.props.accent ?? '#A80101', cats, best: bestImg, slides, dots, slideX, snapCls };
}
}
SKG.boot(Component);
})(SKG.DCLogic);
