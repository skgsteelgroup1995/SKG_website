class Component extends DCLogic {
constructor(props) {
super(props);
this.state = { sent: false, phone: '', sending: false, error: false };
}
fit(el) {
if (!el) return;
el.style.height = 'auto';
el.style.height = (el.scrollHeight + 2) + 'px';
}
componentDidMount() {
document.addEventListener('touchstart', function () {}, { passive: true });
this.restoreFields();
let txt = '', last = '';
try { txt = sessionStorage.getItem('skgQuote') || ''; last = sessionStorage.getItem('skgQuoteLast') || ''; sessionStorage.removeItem('skgQuoteLast'); } catch (e) {}
const el = document.getElementById('it');
if (!el || !txt) return;
el.value = txt;
this.fit(el);
if (last) {
const at = txt.lastIndexOf(last);
if (at >= 0) { const pos = at + last.lastIndexOf('จำนวน ') + 6; setTimeout(() => { try { el.scrollIntoView({ block: 'center' }); el.focus({ preventScroll: true }); el.setSelectionRange(pos, pos); } catch (e) {} }, 60); }
}
}
saveFields() {
const o = {};
['nm', 'ph', 'dl'].forEach((id) => { const el = document.getElementById(id); if (el) o[id] = el.value; });
try { sessionStorage.setItem('skgForm', JSON.stringify(o)); } catch (e) {}
}
restoreFields() {
let o = null;
try { o = JSON.parse(sessionStorage.getItem('skgForm') || 'null'); } catch (e) {}
if (!o) return;
['nm', 'ph', 'dl'].forEach((id) => { const el = document.getElementById(id); if (el && o[id] && !el.value) el.value = o[id]; });
if (o.ph) this.setState({ phone: o.ph });
}
send(form) {
if (this.state.sending) return;
const v = (id) => ((form.querySelector('#' + id) || {}).value || '').trim();
const data = { 'ชื่อ-นามสกุล': v('nm'), 'เบอร์โทรศัพท์': v('ph'), 'สถานที่จัดส่ง': v('dl') || '-', 'รายการสินค้าและจำนวน': v('it'), _subject: 'ขอใบเสนอราคาจากเว็บไซต์ – ' + v('nm'), _template: 'table', _captcha: 'false', _honey: '' };
this.setState({ sending: true, error: false, phone: v('ph') });
fetch(window.SKG_FORM_ENDPOINT, { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify(data) })
.then((r) => r.json().catch(() => ({})).then((j) => { if (!r.ok || j.success === false || j.success === 'false') throw new Error((j.message || 'send failed') + ' [HTTP ' + r.status + ']'); }))
.then(() => { try { sessionStorage.removeItem('skgQuote'); sessionStorage.removeItem('skgForm'); } catch (er) {} this.setState({ sending: false, sent: true }); const cd = document.querySelector('.card'); if (cd) cd.scrollIntoView({ behavior: 'smooth', block: 'start' }); })
.catch((err) => { const m = String((err && err.message) || err || ''); try { console.error('quote form:', m); } catch (e) {} this.setState({ sending: false, error: true, errMsg: m.slice(0, 200) }); });
}
renderVals() {
return {
accent: this.props.accent ?? '#A80101',
sent: this.state.sent,
notSent: !this.state.sent,
phone: this.state.phone || 'ที่ให้ไว้',
onItems: (e) => { this.fit(e.target); try { sessionStorage.setItem('skgQuote', e.target.value); } catch (er) {} },
onPhone: (e) => { this.saveFields(); this.setState({ phone: e.target.value }); },
onField: () => this.saveFields(),
sending: this.state.sending,
error: this.state.error,
errMsg: this.state.errMsg || '',
btnLabel: this.state.sending ? 'กำลังส่ง…' : 'ส่งเพื่อขอราคา',
btnOpacity: this.state.sending ? '0.7' : '1',
submit: (e) => { e.preventDefault(); this.send(e.target); },
reset: () => this.setState({ sent: false, phone: '', error: false })
};
}
}
