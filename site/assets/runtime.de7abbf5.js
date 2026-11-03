/* SKG mini runtime — renders <template id="tpl"> with the page Component (same engine as the prototype).
   The HTML is prerendered for SEO / fast first paint; on load this patches it in place and attaches events. */
(function () {
  'use strict';
  var pending = false, cur = null, tpl = null, root = null;
  function DCLogic(props) { this.props = props || {}; this.state = {}; }
  DCLogic.prototype.setState = function (p, cb) { var v = typeof p === 'function' ? p(this.state, this.props) : p; this.state = Object.assign({}, this.state, v); schedule(); if (cb) cb(); };
  DCLogic.prototype.forceUpdate = function () { schedule(); };

  function lookup(path, scope) {
    path = path.trim();
    if (path === 'true') return true; if (path === 'false') return false;
    if (/^-?\d+(\.\d+)?$/.test(path)) return Number(path);
    var parts = path.split('.'), v = scope;
    for (var i = 0; i < parts.length; i++) { if (v == null) return undefined; v = v[parts[i]]; }
    return v;
  }
  var WHOLE = /^\s*\{\{([^}]+)\}\}\s*$/;
  function interp(str, scope) {
    var m = str.match(WHOLE); if (m) return lookup(m[1], scope);
    return str.replace(/\{\{([^}]+)\}\}/g, function (_, p) { var v = lookup(p, scope); return v == null ? '' : String(v); });
  }
  function build(node, scope, out) {
    if (node.nodeType === 3) { var tx = node.data.indexOf('{{') >= 0 ? interp(node.data, scope) : node.data; out.push(document.createTextNode(tx == null ? '' : String(tx))); return; }
    if (node.nodeType !== 1) return;
    if (node.localName === 'template' && node.hasAttribute('data-sc')) {
      var kind = node.getAttribute('data-sc'), kids = node.content.childNodes;
      if (kind === 'if') { if (interp(node.getAttribute('value') || '', scope)) for (var i = 0; i < kids.length; i++) build(kids[i], scope, out); }
      else {
        var list = interp(node.getAttribute('list') || '', scope) || [], as = node.getAttribute('as') || 'item';
        list.forEach(function (item, idx) { var s2 = Object.create(scope); s2[as] = item; s2.$index = idx; for (var j = 0; j < kids.length; j++) build(kids[j], s2, out); });
      }
      return;
    }
    var el = document.createElementNS(node.namespaceURI, node.localName), ev = {};
    for (var a = 0; a < node.attributes.length; a++) {
      var at = node.attributes[a], name = at.name;
      if (name.indexOf('hint-') === 0) continue;
      if (/^on[a-z]+$/.test(name) && WHOLE.test(at.value)) { var fn = interp(at.value, scope); if (typeof fn === 'function') ev[name.slice(2)] = fn; continue; }
      var v = at.value.indexOf('{{') >= 0 ? interp(at.value, scope) : at.value;
      if (v === false || v == null) continue;
      el.setAttribute(name, v === true ? '' : String(v));
    }
    el.__ev = ev; for (var t in ev) el['on' + t] = ev[t];
    var src = node.localName === 'template' ? node.content.childNodes : node.childNodes, ch = [];
    for (var k = 0; k < src.length; k++) build(src[k], scope, ch);
    ch.forEach(function (c) { el.appendChild(c); });
    out.push(el);
  }
  function morph(parent, kids) {
    for (var i = 0; i < kids.length; i++) {
      var n = kids[i], o = parent.childNodes[i];
      if (!o) { parent.appendChild(n); continue; }
      if (o.nodeType !== n.nodeType || o.nodeName !== n.nodeName) { parent.replaceChild(n, o); continue; }
      if (n.nodeType === 3) { if (o.data !== n.data) o.data = n.data; continue; }
      if (o.nodeType !== 1) continue;
      Array.prototype.slice.call(o.attributes).forEach(function (x) { if (!n.hasAttribute(x.name)) o.removeAttribute(x.name); });
      Array.prototype.forEach.call(n.attributes, function (x) { if (o.getAttribute(x.name) !== x.value) o.setAttribute(x.name, x.value); });
      if ((o.localName === 'input' || o.localName === 'textarea') && n.hasAttribute('value') && o.value !== n.getAttribute('value')) o.value = n.getAttribute('value');
      var oe = o.__ev || {}, ne = n.__ev || {};
      for (var t in oe) if (!(t in ne)) o['on' + t] = null;
      for (var t2 in ne) o['on' + t2] = ne[t2];
      o.__ev = ne;
      if (o.localName === 'iframe') continue; // never touch a loaded map
      morph(o, Array.prototype.slice.call(n.childNodes));
    }
    while (parent.childNodes.length > kids.length) parent.removeChild(parent.lastChild);
  }
  function render() {
    pending = false; if (!cur) return;
    var vals = cur.renderVals() || {}, out = [], kids = tpl.content.childNodes;
    for (var i = 0; i < kids.length; i++) build(kids[i], vals, out);
    morph(root, out);
  }
  function schedule() { if (!pending) { pending = true; Promise.resolve().then(render); } }

  window.SKG = {
    DCLogic: DCLogic,
    boot: function (Comp) {
      root = document.getElementById('app'); tpl = document.getElementById('tpl');
      cur = new Comp({});
      render();
      if (cur.componentDidMount) cur.componentDidMount();
      document.documentElement.classList.add('js-ready');
    }
  };
})();
