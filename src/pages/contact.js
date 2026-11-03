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
send(form) {
if (this.state.sending) return;
const v = (id) => ((form.querySelector('#' + id) || {}).value || '').trim();
const data = { 'ชื่อ-นามสกุล': v('nm'), 'เบอร์โทรศัพท์': v('ph'), 'รายการสินค้าและจำนวน': v('it'), _subject: 'ขอใบเสนอราคาจากเว็บไซต์ – ' + v('nm'), _template: 'table', _captcha: 'false', _honey: '' };
this.setState({ sending: true, error: false, phone: v('ph') });
fetch(window.SKG_FORM_ENDPOINT, { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify(data) })
.then((r) => r.json().catch(() => ({})).then((j) => { if (!r.ok || j.success === false || j.success === 'false') throw new Error(j.message || 'send failed'); }))
.then(() => { try { sessionStorage.removeItem('skgQuote'); } catch (er) {} this.setState({ sending: false, sent: true }); const cd = document.querySelector('.card'); if (cd) cd.scrollIntoView({ behavior: 'smooth', block: 'start' }); })
.catch(() => this.setState({ sending: false, error: true }));
}
renderVals() {
return {
accent: this.props.accent ?? '#A80101',
sent: this.state.sent,
notSent: !this.state.sent,
phone: this.state.phone || 'ที่ให้ไว้',
onItems: (e) => { this.fit(e.target); try { sessionStorage.setItem('skgQuote', e.target.value); } catch (er) {} },
onPhone: (e) => this.setState({ phone: e.target.value }),
sending: this.state.sending,
error: this.state.error,
btnLabel: this.state.sending ? 'กำลังส่ง…' : 'ส่งเพื่อขอราคา',
btnOpacity: this.state.sending ? '0.7' : '1',
submit: (e) => { e.preventDefault(); this.send(e.target); },
reset: () => this.setState({ sent: false, phone: '', error: false })
};
}
}
