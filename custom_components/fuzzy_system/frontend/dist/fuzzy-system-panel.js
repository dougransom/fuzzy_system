/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const rt = globalThis, ht = rt.ShadowRoot && (rt.ShadyCSS === void 0 || rt.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, gt = Symbol(), _t = /* @__PURE__ */ new WeakMap();
let Tt = class {
  constructor(t, s, a) {
    if (this._$cssResult$ = !0, a !== gt) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = t, this.t = s;
  }
  get styleSheet() {
    let t = this.o;
    const s = this.t;
    if (ht && t === void 0) {
      const a = s !== void 0 && s.length === 1;
      a && (t = _t.get(s)), t === void 0 && ((this.o = t = new CSSStyleSheet()).replaceSync(this.cssText), a && _t.set(s, t));
    }
    return t;
  }
  toString() {
    return this.cssText;
  }
};
const Ut = (e) => new Tt(typeof e == "string" ? e : e + "", void 0, gt), R = (e, ...t) => {
  const s = e.length === 1 ? e[0] : t.reduce((a, i, n) => a + ((r) => {
    if (r._$cssResult$ === !0) return r.cssText;
    if (typeof r == "number") return r;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + r + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(i) + e[n + 1], e[0]);
  return new Tt(s, e, gt);
}, Bt = (e, t) => {
  if (ht) e.adoptedStyleSheets = t.map((s) => s instanceof CSSStyleSheet ? s : s.styleSheet);
  else for (const s of t) {
    const a = document.createElement("style"), i = rt.litNonce;
    i !== void 0 && a.setAttribute("nonce", i), a.textContent = s.cssText, e.appendChild(a);
  }
}, xt = ht ? (e) => e : (e) => e instanceof CSSStyleSheet ? ((t) => {
  let s = "";
  for (const a of t.cssRules) s += a.cssText;
  return Ut(s);
})(e) : e;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const { is: Vt, defineProperty: Dt, getOwnPropertyDescriptor: Lt, getOwnPropertyNames: qt, getOwnPropertySymbols: Ht, getPrototypeOf: Wt } = Object, dt = globalThis, $t = dt.trustedTypes, Gt = $t ? $t.emptyScript : "", Jt = dt.reactiveElementPolyfillSupport, K = (e, t) => e, ot = { toAttribute(e, t) {
  switch (t) {
    case Boolean:
      e = e ? Gt : null;
      break;
    case Object:
    case Array:
      e = e == null ? e : JSON.stringify(e);
  }
  return e;
}, fromAttribute(e, t) {
  let s = e;
  switch (t) {
    case Boolean:
      s = e !== null;
      break;
    case Number:
      s = e === null ? null : Number(e);
      break;
    case Object:
    case Array:
      try {
        s = JSON.parse(e);
      } catch {
        s = null;
      }
  }
  return s;
} }, ft = (e, t) => !Vt(e, t), zt = { attribute: !0, type: String, converter: ot, reflect: !1, useDefault: !1, hasChanged: ft };
Symbol.metadata ??= Symbol("metadata"), dt.litPropertyMetadata ??= /* @__PURE__ */ new WeakMap();
let G = class extends HTMLElement {
  static addInitializer(t) {
    this._$Ei(), (this.l ??= []).push(t);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(t, s = zt) {
    if (s.state && (s.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(t) && ((s = Object.create(s)).wrapped = !0), this.elementProperties.set(t, s), !s.noAccessor) {
      const a = Symbol(), i = this.getPropertyDescriptor(t, a, s);
      i !== void 0 && Dt(this.prototype, t, i);
    }
  }
  static getPropertyDescriptor(t, s, a) {
    const { get: i, set: n } = Lt(this.prototype, t) ?? { get() {
      return this[s];
    }, set(r) {
      this[s] = r;
    } };
    return { get: i, set(r) {
      const l = i?.call(this);
      n?.call(this, r), this.requestUpdate(t, l, a);
    }, configurable: !0, enumerable: !0 };
  }
  static getPropertyOptions(t) {
    return this.elementProperties.get(t) ?? zt;
  }
  static _$Ei() {
    if (this.hasOwnProperty(K("elementProperties"))) return;
    const t = Wt(this);
    t.finalize(), t.l !== void 0 && (this.l = [...t.l]), this.elementProperties = new Map(t.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(K("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(K("properties"))) {
      const s = this.properties, a = [...qt(s), ...Ht(s)];
      for (const i of a) this.createProperty(i, s[i]);
    }
    const t = this[Symbol.metadata];
    if (t !== null) {
      const s = litPropertyMetadata.get(t);
      if (s !== void 0) for (const [a, i] of s) this.elementProperties.set(a, i);
    }
    this._$Eh = /* @__PURE__ */ new Map();
    for (const [s, a] of this.elementProperties) {
      const i = this._$Eu(s, a);
      i !== void 0 && this._$Eh.set(i, s);
    }
    this.elementStyles = this.finalizeStyles(this.styles);
  }
  static finalizeStyles(t) {
    const s = [];
    if (Array.isArray(t)) {
      const a = new Set(t.flat(1 / 0).reverse());
      for (const i of a) s.unshift(xt(i));
    } else t !== void 0 && s.push(xt(t));
    return s;
  }
  static _$Eu(t, s) {
    const a = s.attribute;
    return a === !1 ? void 0 : typeof a == "string" ? a : typeof t == "string" ? t.toLowerCase() : void 0;
  }
  constructor() {
    super(), this._$Ep = void 0, this.isUpdatePending = !1, this.hasUpdated = !1, this._$Em = null, this._$Ev();
  }
  _$Ev() {
    this._$ES = new Promise((t) => this.enableUpdating = t), this._$AL = /* @__PURE__ */ new Map(), this._$E_(), this.requestUpdate(), this.constructor.l?.forEach((t) => t(this));
  }
  addController(t) {
    (this._$EO ??= /* @__PURE__ */ new Set()).add(t), this.renderRoot !== void 0 && this.isConnected && t.hostConnected?.();
  }
  removeController(t) {
    this._$EO?.delete(t);
  }
  _$E_() {
    const t = /* @__PURE__ */ new Map(), s = this.constructor.elementProperties;
    for (const a of s.keys()) this.hasOwnProperty(a) && (t.set(a, this[a]), delete this[a]);
    t.size > 0 && (this._$Ep = t);
  }
  createRenderRoot() {
    const t = this.shadowRoot ?? this.attachShadow(this.constructor.shadowRootOptions);
    return Bt(t, this.constructor.elementStyles), t;
  }
  connectedCallback() {
    this.renderRoot ??= this.createRenderRoot(), this.enableUpdating(!0), this._$EO?.forEach((t) => t.hostConnected?.());
  }
  enableUpdating(t) {
  }
  disconnectedCallback() {
    this._$EO?.forEach((t) => t.hostDisconnected?.());
  }
  attributeChangedCallback(t, s, a) {
    this._$AK(t, a);
  }
  _$ET(t, s) {
    const a = this.constructor.elementProperties.get(t), i = this.constructor._$Eu(t, a);
    if (i !== void 0 && a.reflect === !0) {
      const n = (a.converter?.toAttribute !== void 0 ? a.converter : ot).toAttribute(s, a.type);
      this._$Em = t, n == null ? this.removeAttribute(i) : this.setAttribute(i, n), this._$Em = null;
    }
  }
  _$AK(t, s) {
    const a = this.constructor, i = a._$Eh.get(t);
    if (i !== void 0 && this._$Em !== i) {
      const n = a.getPropertyOptions(i), r = typeof n.converter == "function" ? { fromAttribute: n.converter } : n.converter?.fromAttribute !== void 0 ? n.converter : ot;
      this._$Em = i;
      const l = r.fromAttribute(s, n.type);
      this[i] = l ?? this._$Ej?.get(i) ?? l, this._$Em = null;
    }
  }
  requestUpdate(t, s, a, i = !1, n) {
    if (t !== void 0) {
      const r = this.constructor;
      if (i === !1 && (n = this[t]), a ??= r.getPropertyOptions(t), !((a.hasChanged ?? ft)(n, s) || a.useDefault && a.reflect && n === this._$Ej?.get(t) && !this.hasAttribute(r._$Eu(t, a)))) return;
      this.C(t, s, a);
    }
    this.isUpdatePending === !1 && (this._$ES = this._$EP());
  }
  C(t, s, { useDefault: a, reflect: i, wrapped: n }, r) {
    a && !(this._$Ej ??= /* @__PURE__ */ new Map()).has(t) && (this._$Ej.set(t, r ?? s ?? this[t]), n !== !0 || r !== void 0) || (this._$AL.has(t) || (this.hasUpdated || a || (s = void 0), this._$AL.set(t, s)), i === !0 && this._$Em !== t && (this._$Eq ??= /* @__PURE__ */ new Set()).add(t));
  }
  async _$EP() {
    this.isUpdatePending = !0;
    try {
      await this._$ES;
    } catch (s) {
      Promise.reject(s);
    }
    const t = this.scheduleUpdate();
    return t != null && await t, !this.isUpdatePending;
  }
  scheduleUpdate() {
    return this.performUpdate();
  }
  performUpdate() {
    if (!this.isUpdatePending) return;
    if (!this.hasUpdated) {
      if (this.renderRoot ??= this.createRenderRoot(), this._$Ep) {
        for (const [i, n] of this._$Ep) this[i] = n;
        this._$Ep = void 0;
      }
      const a = this.constructor.elementProperties;
      if (a.size > 0) for (const [i, n] of a) {
        const { wrapped: r } = n, l = this[i];
        r !== !0 || this._$AL.has(i) || l === void 0 || this.C(i, void 0, n, l);
      }
    }
    let t = !1;
    const s = this._$AL;
    try {
      t = this.shouldUpdate(s), t ? (this.willUpdate(s), this._$EO?.forEach((a) => a.hostUpdate?.()), this.update(s)) : this._$EM();
    } catch (a) {
      throw t = !1, this._$EM(), a;
    }
    t && this._$AE(s);
  }
  willUpdate(t) {
  }
  _$AE(t) {
    this._$EO?.forEach((s) => s.hostUpdated?.()), this.hasUpdated || (this.hasUpdated = !0, this.firstUpdated(t)), this.updated(t);
  }
  _$EM() {
    this._$AL = /* @__PURE__ */ new Map(), this.isUpdatePending = !1;
  }
  get updateComplete() {
    return this.getUpdateComplete();
  }
  getUpdateComplete() {
    return this._$ES;
  }
  shouldUpdate(t) {
    return !0;
  }
  update(t) {
    this._$Eq &&= this._$Eq.forEach((s) => this._$ET(s, this[s])), this._$EM();
  }
  updated(t) {
  }
  firstUpdated(t) {
  }
};
G.elementStyles = [], G.shadowRootOptions = { mode: "open" }, G[K("elementProperties")] = /* @__PURE__ */ new Map(), G[K("finalized")] = /* @__PURE__ */ new Map(), Jt?.({ ReactiveElement: G }), (dt.reactiveElementVersions ??= []).push("2.1.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const mt = globalThis, wt = (e) => e, lt = mt.trustedTypes, St = lt ? lt.createPolicy("lit-html", { createHTML: (e) => e }) : void 0, Mt = "$lit$", O = `lit$${Math.random().toFixed(9).slice(2)}$`, Ot = "?" + O, Qt = `<${Ot}>`, V = document, Y = () => V.createComment(""), tt = (e) => e === null || typeof e != "object" && typeof e != "function", bt = Array.isArray, Zt = (e) => bt(e) || typeof e?.[Symbol.iterator] == "function", ut = `[ 	
\f\r]`, X = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, kt = /-->/g, At = />/g, U = RegExp(`>|${ut}(?:([^\\s"'>=/]+)(${ut}*=${ut}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), It = /'/g, Ct = /"/g, Rt = /^(?:script|style|textarea|title)$/i, Nt = (e) => (t, ...s) => ({ _$litType$: e, strings: t, values: s }), o = Nt(1), J = Nt(2), Q = Symbol.for("lit-noChange"), _ = Symbol.for("lit-nothing"), Et = /* @__PURE__ */ new WeakMap(), B = V.createTreeWalker(V, 129);
function jt(e, t) {
  if (!bt(e) || !e.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return St !== void 0 ? St.createHTML(t) : t;
}
const Xt = (e, t) => {
  const s = e.length - 1, a = [];
  let i, n = t === 2 ? "<svg>" : t === 3 ? "<math>" : "", r = X;
  for (let l = 0; l < s; l++) {
    const d = e[l];
    let p, c, u = -1, h = 0;
    for (; h < d.length && (r.lastIndex = h, c = r.exec(d), c !== null); ) h = r.lastIndex, r === X ? c[1] === "!--" ? r = kt : c[1] !== void 0 ? r = At : c[2] !== void 0 ? (Rt.test(c[2]) && (i = RegExp("</" + c[2], "g")), r = U) : c[3] !== void 0 && (r = U) : r === U ? c[0] === ">" ? (r = i ?? X, u = -1) : c[1] === void 0 ? u = -2 : (u = r.lastIndex - c[2].length, p = c[1], r = c[3] === void 0 ? U : c[3] === '"' ? Ct : It) : r === Ct || r === It ? r = U : r === kt || r === At ? r = X : (r = U, i = void 0);
    const f = r === U && e[l + 1].startsWith("/>") ? " " : "";
    n += r === X ? d + Qt : u >= 0 ? (a.push(p), d.slice(0, u) + Mt + d.slice(u) + O + f) : d + O + (u === -2 ? l : f);
  }
  return [jt(e, n + (e[s] || "<?>") + (t === 2 ? "</svg>" : t === 3 ? "</math>" : "")), a];
};
class et {
  constructor({ strings: t, _$litType$: s }, a) {
    let i;
    this.parts = [];
    let n = 0, r = 0;
    const l = t.length - 1, d = this.parts, [p, c] = Xt(t, s);
    if (this.el = et.createElement(p, a), B.currentNode = this.el.content, s === 2 || s === 3) {
      const u = this.el.content.firstChild;
      u.replaceWith(...u.childNodes);
    }
    for (; (i = B.nextNode()) !== null && d.length < l; ) {
      if (i.nodeType === 1) {
        if (i.hasAttributes()) for (const u of i.getAttributeNames()) if (u.endsWith(Mt)) {
          const h = c[r++], f = i.getAttribute(u).split(O), y = /([.?@])?(.*)/.exec(h);
          d.push({ type: 1, index: n, name: y[2], strings: f, ctor: y[1] === "." ? Yt : y[1] === "?" ? te : y[1] === "@" ? ee : pt }), i.removeAttribute(u);
        } else u.startsWith(O) && (d.push({ type: 6, index: n }), i.removeAttribute(u));
        if (Rt.test(i.tagName)) {
          const u = i.textContent.split(O), h = u.length - 1;
          if (h > 0) {
            i.textContent = lt ? lt.emptyScript : "";
            for (let f = 0; f < h; f++) i.append(u[f], Y()), B.nextNode(), d.push({ type: 2, index: ++n });
            i.append(u[h], Y());
          }
        }
      } else if (i.nodeType === 8) if (i.data === Ot) d.push({ type: 2, index: n });
      else {
        let u = -1;
        for (; (u = i.data.indexOf(O, u + 1)) !== -1; ) d.push({ type: 7, index: n }), u += O.length - 1;
      }
      n++;
    }
  }
  static createElement(t, s) {
    const a = V.createElement("template");
    return a.innerHTML = t, a;
  }
}
function Z(e, t, s = e, a) {
  if (t === Q) return t;
  let i = a !== void 0 ? s._$Co?.[a] : s._$Cl;
  const n = tt(t) ? void 0 : t._$litDirective$;
  return i?.constructor !== n && (i?._$AO?.(!1), n === void 0 ? i = void 0 : (i = new n(e), i._$AT(e, s, a)), a !== void 0 ? (s._$Co ??= [])[a] = i : s._$Cl = i), i !== void 0 && (t = Z(e, i._$AS(e, t.values), i, a)), t;
}
class Kt {
  constructor(t, s) {
    this._$AV = [], this._$AN = void 0, this._$AD = t, this._$AM = s;
  }
  get parentNode() {
    return this._$AM.parentNode;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  u(t) {
    const { el: { content: s }, parts: a } = this._$AD, i = (t?.creationScope ?? V).importNode(s, !0);
    B.currentNode = i;
    let n = B.nextNode(), r = 0, l = 0, d = a[0];
    for (; d !== void 0; ) {
      if (r === d.index) {
        let p;
        d.type === 2 ? p = new it(n, n.nextSibling, this, t) : d.type === 1 ? p = new d.ctor(n, d.name, d.strings, this, t) : d.type === 6 && (p = new se(n, this, t)), this._$AV.push(p), d = a[++l];
      }
      r !== d?.index && (n = B.nextNode(), r++);
    }
    return B.currentNode = V, i;
  }
  p(t) {
    let s = 0;
    for (const a of this._$AV) a !== void 0 && (a.strings !== void 0 ? (a._$AI(t, a, s), s += a.strings.length - 2) : a._$AI(t[s])), s++;
  }
}
class it {
  get _$AU() {
    return this._$AM?._$AU ?? this._$Cv;
  }
  constructor(t, s, a, i) {
    this.type = 2, this._$AH = _, this._$AN = void 0, this._$AA = t, this._$AB = s, this._$AM = a, this.options = i, this._$Cv = i?.isConnected ?? !0;
  }
  get parentNode() {
    let t = this._$AA.parentNode;
    const s = this._$AM;
    return s !== void 0 && t?.nodeType === 11 && (t = s.parentNode), t;
  }
  get startNode() {
    return this._$AA;
  }
  get endNode() {
    return this._$AB;
  }
  _$AI(t, s = this) {
    t = Z(this, t, s), tt(t) ? t === _ || t == null || t === "" ? (this._$AH !== _ && this._$AR(), this._$AH = _) : t !== this._$AH && t !== Q && this._(t) : t._$litType$ !== void 0 ? this.$(t) : t.nodeType !== void 0 ? this.T(t) : Zt(t) ? this.k(t) : this._(t);
  }
  O(t) {
    return this._$AA.parentNode.insertBefore(t, this._$AB);
  }
  T(t) {
    this._$AH !== t && (this._$AR(), this._$AH = this.O(t));
  }
  _(t) {
    this._$AH !== _ && tt(this._$AH) ? this._$AA.nextSibling.data = t : this.T(V.createTextNode(t)), this._$AH = t;
  }
  $(t) {
    const { values: s, _$litType$: a } = t, i = typeof a == "number" ? this._$AC(t) : (a.el === void 0 && (a.el = et.createElement(jt(a.h, a.h[0]), this.options)), a);
    if (this._$AH?._$AD === i) this._$AH.p(s);
    else {
      const n = new Kt(i, this), r = n.u(this.options);
      n.p(s), this.T(r), this._$AH = n;
    }
  }
  _$AC(t) {
    let s = Et.get(t.strings);
    return s === void 0 && Et.set(t.strings, s = new et(t)), s;
  }
  k(t) {
    bt(this._$AH) || (this._$AH = [], this._$AR());
    const s = this._$AH;
    let a, i = 0;
    for (const n of t) i === s.length ? s.push(a = new it(this.O(Y()), this.O(Y()), this, this.options)) : a = s[i], a._$AI(n), i++;
    i < s.length && (this._$AR(a && a._$AB.nextSibling, i), s.length = i);
  }
  _$AR(t = this._$AA.nextSibling, s) {
    for (this._$AP?.(!1, !0, s); t !== this._$AB; ) {
      const a = wt(t).nextSibling;
      wt(t).remove(), t = a;
    }
  }
  setConnected(t) {
    this._$AM === void 0 && (this._$Cv = t, this._$AP?.(t));
  }
}
class pt {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(t, s, a, i, n) {
    this.type = 1, this._$AH = _, this._$AN = void 0, this.element = t, this.name = s, this._$AM = i, this.options = n, a.length > 2 || a[0] !== "" || a[1] !== "" ? (this._$AH = Array(a.length - 1).fill(new String()), this.strings = a) : this._$AH = _;
  }
  _$AI(t, s = this, a, i) {
    const n = this.strings;
    let r = !1;
    if (n === void 0) t = Z(this, t, s, 0), r = !tt(t) || t !== this._$AH && t !== Q, r && (this._$AH = t);
    else {
      const l = t;
      let d, p;
      for (t = n[0], d = 0; d < n.length - 1; d++) p = Z(this, l[a + d], s, d), p === Q && (p = this._$AH[d]), r ||= !tt(p) || p !== this._$AH[d], p === _ ? t = _ : t !== _ && (t += (p ?? "") + n[d + 1]), this._$AH[d] = p;
    }
    r && !i && this.j(t);
  }
  j(t) {
    t === _ ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, t ?? "");
  }
}
class Yt extends pt {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(t) {
    this.element[this.name] = t === _ ? void 0 : t;
  }
}
class te extends pt {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(t) {
    this.element.toggleAttribute(this.name, !!t && t !== _);
  }
}
class ee extends pt {
  constructor(t, s, a, i, n) {
    super(t, s, a, i, n), this.type = 5;
  }
  _$AI(t, s = this) {
    if ((t = Z(this, t, s, 0) ?? _) === Q) return;
    const a = this._$AH, i = t === _ && a !== _ || t.capture !== a.capture || t.once !== a.once || t.passive !== a.passive, n = t !== _ && (a === _ || i);
    i && this.element.removeEventListener(this.name, this, a), n && this.element.addEventListener(this.name, this, t), this._$AH = t;
  }
  handleEvent(t) {
    typeof this._$AH == "function" ? this._$AH.call(this.options?.host ?? this.element, t) : this._$AH.handleEvent(t);
  }
}
class se {
  constructor(t, s, a) {
    this.element = t, this.type = 6, this._$AN = void 0, this._$AM = s, this.options = a;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(t) {
    Z(this, t);
  }
}
const ie = mt.litHtmlPolyfillSupport;
ie?.(et, it), (mt.litHtmlVersions ??= []).push("3.3.3");
const ae = (e, t, s) => {
  const a = s?.renderBefore ?? t;
  let i = a._$litPart$;
  if (i === void 0) {
    const n = s?.renderBefore ?? null;
    a._$litPart$ = i = new it(t.insertBefore(Y(), n), n, void 0, s ?? {});
  }
  return i._$AI(e), i;
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const yt = globalThis;
class z extends G {
  constructor() {
    super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
  }
  createRenderRoot() {
    const t = super.createRenderRoot();
    return this.renderOptions.renderBefore ??= t.firstChild, t;
  }
  update(t) {
    const s = this.render();
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(t), this._$Do = ae(s, this.renderRoot, this.renderOptions);
  }
  connectedCallback() {
    super.connectedCallback(), this._$Do?.setConnected(!0);
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this._$Do?.setConnected(!1);
  }
  render() {
    return Q;
  }
}
z._$litElement$ = !0, z.finalized = !0, yt.litElementHydrateSupport?.({ LitElement: z });
const ne = yt.litElementPolyfillSupport;
ne?.({ LitElement: z });
(yt.litElementVersions ??= []).push("4.2.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const re = { attribute: !0, type: String, converter: ot, reflect: !1, hasChanged: ft }, oe = (e = re, t, s) => {
  const { kind: a, metadata: i } = s;
  let n = globalThis.litPropertyMetadata.get(i);
  if (n === void 0 && globalThis.litPropertyMetadata.set(i, n = /* @__PURE__ */ new Map()), a === "setter" && ((e = Object.create(e)).wrapped = !0), n.set(s.name, e), a === "accessor") {
    const { name: r } = s;
    return { set(l) {
      const d = t.get.call(this);
      t.set.call(this, l), this.requestUpdate(r, d, e, !0, l);
    }, init(l) {
      return l !== void 0 && this.C(r, void 0, e, l), l;
    } };
  }
  if (a === "setter") {
    const { name: r } = s;
    return function(l) {
      const d = this[r];
      t.call(this, l), this.requestUpdate(r, d, e, !0, l);
    };
  }
  throw Error("Unsupported decorator location: " + a);
};
function v(e) {
  return (t, s) => typeof s == "object" ? oe(e, t, s) : ((a, i, n) => {
    const r = i.hasOwnProperty(n);
    return i.constructor.createProperty(n, a), r ? Object.getOwnPropertyDescriptor(i, n) : void 0;
  })(e, t, s);
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function g(e) {
  return v({ ...e, state: !0, attribute: !1 });
}
function L(e) {
  return (t) => (typeof customElements < "u" && !customElements.get(e) && customElements.define(e, t), t);
}
const ct = R`
  :host {
    --fuzzy-primary: var(--primary-color, #0284c7);
    --fuzzy-primary-hover: var(--primary-color-hover, #0369a1);
    --fuzzy-accent: var(--accent-color, #f59e0b);
    --fuzzy-success: var(--success-color, #10b981);
    --fuzzy-warning: var(--warning-color, #f59e0b);
    --fuzzy-danger: var(--error-color, #ef4444);
    --fuzzy-bg: var(--primary-background-color, #0f172a);
    --fuzzy-card-bg: var(--card-background-color, rgba(30, 41, 59, 0.7));
    --fuzzy-card-border: var(--divider-color, rgba(255, 255, 255, 0.08));
    --fuzzy-text: var(--primary-text-color, #f8fafc);
    --fuzzy-text-secondary: var(--secondary-text-color, #94a3b8);
    --fuzzy-glass-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.3);
    --fuzzy-radius-lg: 16px;
    --fuzzy-radius-md: 10px;
    --fuzzy-radius-sm: 6px;
    font-family: var(--ha-font-family, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif);
    color: var(--fuzzy-text);
  }

  .container {
    padding: 24px;
    max-width: 1400px;
    margin: 0 auto;
    box-sizing: border-box;
  }

  /* Glassmorphic Cards */
  .card {
    background: var(--fuzzy-card-bg);
    border: 1px solid var(--fuzzy-card-border);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    border-radius: var(--fuzzy-radius-lg);
    box-shadow: var(--fuzzy-glass-shadow);
    padding: 24px;
    transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
  }

  .card:hover {
    border-color: rgba(2, 132, 199, 0.4);
    transform: translateY(-2px);
    box-shadow: 0 12px 40px 0 rgba(0, 0, 0, 0.4);
  }

  /* Typography */
  h1, h2, h3, h4, p {
    margin: 0;
  }

  .title-lg {
    font-size: 24px;
    font-weight: 700;
    letter-spacing: -0.02em;
    background: linear-gradient(135deg, #fff 0%, #cbd5e1 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  .subtitle {
    font-size: 14px;
    color: var(--fuzzy-text-secondary);
    margin-top: 4px;
  }

  /* Badges & Chips */
  .badge {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-size: 11px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    padding: 4px 10px;
    border-radius: 9999px;
  }

  .badge-cyan {
    background: rgba(6, 182, 212, 0.15);
    color: #38bdf8;
    border: 1px solid rgba(6, 182, 212, 0.3);
  }

  .badge-amber {
    background: rgba(245, 158, 11, 0.15);
    color: #fbbf24;
    border: 1px solid rgba(245, 158, 11, 0.3);
  }

  .badge-emerald {
    background: rgba(16, 185, 129, 0.15);
    color: #34d399;
    border: 1px solid rgba(16, 185, 129, 0.3);
  }

  .badge-purple {
    background: rgba(168, 85, 247, 0.15);
    color: #c084fc;
    border: 1px solid rgba(168, 85, 247, 0.3);
  }

  .badge-rose {
    background: rgba(244, 63, 94, 0.15);
    color: #fb7185;
    border: 1px solid rgba(244, 63, 94, 0.3);
  }

  .chip {
    display: inline-flex;
    align-items: center;
    font-size: 12px;
    padding: 4px 10px;
    background: rgba(255, 255, 255, 0.05);
    border-radius: var(--fuzzy-radius-sm);
    color: var(--fuzzy-text-secondary);
  }

  /* Buttons */
  .btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 10px 18px;
    border-radius: var(--fuzzy-radius-md);
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    border: none;
    transition: all 0.2s ease;
    outline: none;
  }

  .btn-primary {
    background: linear-gradient(135deg, #0284c7 0%, #0369a1 100%);
    color: white;
    box-shadow: 0 4px 14px rgba(2, 132, 199, 0.35);
  }

  .btn-primary:hover {
    background: linear-gradient(135deg, #0369a1 0%, #075985 100%);
    box-shadow: 0 6px 20px rgba(2, 132, 199, 0.5);
    transform: translateY(-1px);
  }

  .btn-secondary {
    background: rgba(255, 255, 255, 0.08);
    color: var(--fuzzy-text);
    border: 1px solid var(--fuzzy-card-border);
  }

  .btn-secondary:hover {
    background: rgba(255, 255, 255, 0.14);
    border-color: rgba(255, 255, 255, 0.2);
  }

  .btn-danger {
    background: rgba(239, 68, 68, 0.15);
    color: #fca5a5;
    border: 1px solid rgba(239, 68, 68, 0.3);
  }

  .btn-danger:hover {
    background: rgba(239, 68, 68, 0.25);
    color: white;
  }

  .btn-icon {
    padding: 8px;
    border-radius: 50%;
    background: transparent;
    color: var(--fuzzy-text-secondary);
  }

  .btn-icon:hover {
    background: rgba(255, 255, 255, 0.1);
    color: var(--fuzzy-text);
  }

  /* Form Inputs */
  .form-group {
    margin-bottom: 18px;
  }

  .form-label {
    display: block;
    font-size: 13px;
    font-weight: 500;
    color: var(--fuzzy-text-secondary);
    margin-bottom: 6px;
  }

  .input-text, .input-select, .input-textarea {
    width: 100%;
    padding: 10px 14px;
    border-radius: var(--fuzzy-radius-md);
    background: rgba(15, 23, 42, 0.6);
    border: 1px solid var(--fuzzy-card-border);
    color: var(--fuzzy-text);
    font-size: 14px;
    box-sizing: border-box;
    transition: border-color 0.2s ease, box-shadow 0.2s ease;
  }

  .input-text:focus, .input-select:focus, .input-textarea:focus {
    outline: none;
    border-color: var(--fuzzy-primary);
    box-shadow: 0 0 0 3px rgba(2, 132, 199, 0.25);
  }

  /* Modal Backdrop */
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.65);
    backdrop-filter: blur(8px);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 999;
    padding: 16px;
  }

  .modal-content {
    background: var(--fuzzy-bg);
    border: 1px solid var(--fuzzy-card-border);
    border-radius: var(--fuzzy-radius-lg);
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
    width: 100%;
    max-width: 600px;
    max-height: 90vh;
    overflow-y: auto;
    padding: 28px;
    box-sizing: border-box;
  }
`, le = "fuzzy_system/systems/list", de = "fuzzy_system/systems/save", pe = "fuzzy_system/systems/delete", ce = "fuzzy_system/simulate", ue = "fuzzy_system/templates/list", he = "fuzzy_system/templates/instantiate";
async function ge(e) {
  const t = await e.callWS({
    type: le
  });
  return Array.isArray(t) ? t : t.systems || [];
}
async function fe(e, t, s) {
  return e.callWS({
    type: de,
    system_id: t.system_id,
    name: t.name,
    description: t.description,
    inference: t.inference,
    defuzzifier: t.defuzzifier,
    expose_system_sensor: t.expose_system_sensor ?? !0,
    max_updates_per_period: t.max_updates_per_period ?? 20,
    update_period: t.update_period ?? 0.05,
    epsilon: t.epsilon ?? 0.01,
    inputs: t.inputs,
    outputs: t.outputs,
    rules: t.rules,
    entry_id: s
  });
}
async function me(e, t) {
  return e.callWS({
    type: pe,
    entry_id: t
  });
}
async function be(e) {
  return (await e.callWS({
    type: ue
  })).templates || [];
}
async function ye(e, t, s, a) {
  return e.callWS({
    type: he,
    template_id: t,
    system_id: s,
    name: a
  });
}
async function ve(e, t, s) {
  const a = await e.callWS({
    type: ce,
    system_config: t,
    inputs: s
  }), i = a?.results || a;
  if (!i) return {};
  if (i.defuzzified_values) {
    const n = {}, r = Object.keys(t.outputs || {});
    for (const l of r) {
      const d = i.aggregated_sets?.[l] || [];
      let p = i.universes?.[l] || [];
      if ((!p || p.length === 0) && d.length > 0) {
        const c = t.outputs[l]?.range || [0, 100], h = (c[1] - c[0]) / (d.length - 1 || 1);
        p = Array.from({ length: d.length }, (f, y) => c[0] + y * h);
      }
      n[l] = {
        defuzzified_value: i.defuzzified_values[l],
        dominant_term: i.dominant_terms?.[l] || "",
        term_activations: i.term_activations?.[l] || {},
        term_memberships: i.term_memberships?.[l] || {},
        rule_strengths: i.rule_strengths || [],
        universe: p,
        aggregated_set: d
      };
    }
    return n;
  }
  return i;
}
var _e = Object.defineProperty, xe = Object.getOwnPropertyDescriptor, N = (e, t, s, a) => {
  for (var i = a > 1 ? void 0 : a ? xe(t, s) : t, n = e.length - 1, r; n >= 0; n--)
    (r = e[n]) && (i = (a ? r(t, s, i) : r(i)) || i);
  return a && i && _e(t, s, i), i;
};
let A = class extends z {
  constructor() {
    super(...arguments), this.universe = [], this.aggregatedSet = [], this.defuzzifier = "cog", this.dominantTerm = "", this.unit = "", this.outputName = "";
  }
  render() {
    if (!this.universe || this.universe.length === 0)
      return o`
        <div class="graph-card">
          <div style="text-align: center; color: var(--fuzzy-text-secondary); padding: 20px 0; font-size: 12px;">
            Awaiting inference evaluation data...
          </div>
        </div>
      `;
    const e = this.universe[0], t = this.universe[this.universe.length - 1], s = t - e || 1, a = 640, i = 190, n = 36, r = 24, l = 20, d = 28, p = a - n - r, c = i - l - d, u = ($) => n + ($ - e) / s * p, h = ($) => l + (1 - Math.max(0, Math.min(1, $))) * c, f = this.aggregatedSet || [], y = [], x = Math.max(1, Math.floor(this.universe.length / 140));
    for (let $ = 0; $ < this.universe.length; $ += x) {
      const S = this.universe[$], k = f[$] ?? 0;
      y.push([u(S), h(k)]);
    }
    const q = this.universe.length - 1;
    y.push([u(this.universe[q]), h(f[q] ?? 0)]);
    const E = y.reduce(
      ($, [S, k], W) => W === 0 ? `M ${S} ${k}` : `${$} L ${S} ${k}`,
      ""
    ), F = `${E} L ${n + p} ${l + c} L ${n} ${l + c} Z`, H = this.defuzzifiedValue !== void 0 && !isNaN(this.defuzzifiedValue), M = H ? u(Math.max(e, Math.min(t, this.defuzzifiedValue))) : 0;
    return o`
      <div class="graph-card">
        <div class="graph-header">
          <div class="graph-title">
            <span>📈</span>
            <span>${this.outputName || "Aggregated Output Distribution"}</span>
          </div>
          <div class="header-badges">
            ${this.dominantTerm ? o`<span class="badge-dominant">Dominant: ${this.dominantTerm}</span>` : ""}
            ${H ? o`
                  <span class="badge-crisp">
                    ${this.defuzzifier.toUpperCase()}: ${this.defuzzifiedValue.toFixed(2)} ${this.unit}
                  </span>
                ` : ""}
          </div>
        </div>

        <svg viewBox="0 0 ${a} ${i}" preserveAspectRatio="xMidYMid meet">
          <defs>
            <linearGradient id="aggGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="#38bdf8" stop-opacity="0.55" />
              <stop offset="60%" stop-color="#0284c7" stop-opacity="0.25" />
              <stop offset="100%" stop-color="#0f172a" stop-opacity="0.05" />
            </linearGradient>
          </defs>

          <!-- Horizontal Grid lines at mu = 0.5, 1.0 -->
          <line class="grid-line" x1=${n} y1=${h(0.5)} x2=${n + p} y2=${h(0.5)} />
          <line class="grid-line" x1=${n} y1=${h(1)} x2=${n + p} y2=${h(1)} />

          <!-- Axes -->
          <line class="axis-line" x1=${n} y1=${l} x2=${n} y2=${l + c} />
          <line class="axis-line" x1=${n} y1=${l + c} x2=${n + p} y2=${l + c} />

          <!-- Y-axis labels -->
          <text class="axis-text" x=${n - 6} y=${h(1) + 3} text-anchor="end">1.0</text>
          <text class="axis-text" x=${n - 6} y=${h(0.5) + 3} text-anchor="end">0.5</text>
          <text class="axis-text" x=${n - 6} y=${h(0) + 3} text-anchor="end">0.0</text>

          <!-- X-axis labels -->
          <text class="axis-text" x=${n} y=${i - 10} text-anchor="start">${e.toFixed(0)}</text>
          <text class="axis-text" x=${n + p / 2} y=${i - 10} text-anchor="middle">
            ${(e + s / 2).toFixed(1)}
          </text>
          <text class="axis-text" x=${n + p} y=${i - 10} text-anchor="end">
            ${t.toFixed(0)} ${this.unit}
          </text>

          <!-- Aggregated Fuzzy Set Area & Stroke -->
          <path d=${F} fill="url(#aggGradient)" />
          <path d=${E} fill="none" stroke="#38bdf8" stroke-width="2.2" stroke-linecap="round" />

          <!-- Defuzzified Crisp Slice Line -->
          ${H ? J`
                <g>
                  <line
                    class="defuzz-line"
                    x1=${M}
                    y1=${l}
                    x2=${M}
                    y2=${l + c}
                  />
                  <circle class="pulse-marker" cx=${M} cy=${l + c} r="4.5" />
                  <rect
                    x=${Math.min(n + p - 90, Math.max(n, M - 45))}
                    y=${l - 18}
                    width="90"
                    height="18"
                    rx="4"
                    fill="#0284c7"
                  />
                  <text
                    x=${Math.min(n + p - 45, Math.max(n + 45, M))}
                    y=${l - 5}
                    text-anchor="middle"
                    fill="#ffffff"
                    font-size="10"
                    font-weight="700"
                    font-family="monospace"
                  >
                    ${this.defuzzifiedValue.toFixed(1)} ${this.unit}
                  </text>
                </g>
              ` : J``}
        </svg>
      </div>
    `;
  }
};
A.styles = R`
    :host {
      display: block;
      width: 100%;
      user-select: none;
    }

    .graph-card {
      background: #060913;
      border: 1px solid rgba(56, 189, 248, 0.25);
      border-radius: 12px;
      padding: 14px 16px 12px;
      box-shadow: inset 0 2px 10px rgba(0, 0, 0, 0.5), 0 4px 16px rgba(2, 132, 199, 0.15);
    }

    .graph-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 10px;
      flex-wrap: wrap;
      gap: 8px;
    }

    .graph-title {
      font-size: 13px;
      font-weight: 700;
      color: #38bdf8;
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .header-badges {
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .badge-crisp {
      background: rgba(16, 185, 129, 0.15);
      border: 1px solid rgba(16, 185, 129, 0.35);
      color: #34d399;
      font-size: 11px;
      font-weight: 700;
      padding: 3px 8px;
      border-radius: 6px;
    }

    .badge-dominant {
      background: rgba(245, 158, 11, 0.15);
      border: 1px solid rgba(245, 158, 11, 0.35);
      color: #fbbf24;
      font-size: 11px;
      font-weight: 600;
      padding: 3px 8px;
      border-radius: 6px;
    }

    svg {
      width: 100%;
      height: auto;
      display: block;
      overflow: visible;
    }

    .axis-line {
      stroke: rgba(255, 255, 255, 0.15);
      stroke-width: 1;
    }

    .grid-line {
      stroke: rgba(255, 255, 255, 0.05);
      stroke-dasharray: 2 3;
      stroke-width: 1;
    }

    .axis-text {
      fill: #94a3b8;
      font-size: 10px;
      font-family: monospace;
    }

    .defuzz-line {
      stroke: #38bdf8;
      stroke-width: 2.5;
      filter: drop-shadow(0 0 6px rgba(56, 189, 248, 0.8));
    }

    .pulse-marker {
      fill: #38bdf8;
      filter: drop-shadow(0 0 6px rgba(56, 189, 248, 0.9));
    }
  `;
N([
  v({ type: Array })
], A.prototype, "universe", 2);
N([
  v({ type: Array })
], A.prototype, "aggregatedSet", 2);
N([
  v({ type: Number })
], A.prototype, "defuzzifiedValue", 2);
N([
  v({ type: String })
], A.prototype, "defuzzifier", 2);
N([
  v({ type: String })
], A.prototype, "dominantTerm", 2);
N([
  v({ type: String })
], A.prototype, "unit", 2);
N([
  v({ type: String })
], A.prototype, "outputName", 2);
A = N([
  L("fuzzy-aggregated-graph")
], A);
var $e = Object.defineProperty, ze = Object.getOwnPropertyDescriptor, j = (e, t, s, a) => {
  for (var i = a > 1 ? void 0 : a ? ze(t, s) : t, n = e.length - 1, r; n >= 0; n--)
    (r = e[n]) && (i = (a ? r(t, s, i) : r(i)) || i);
  return a && i && $e(t, s, i), i;
};
let I = class extends z {
  constructor() {
    super(...arguments), this._systems = [], this._searchQuery = "", this._loading = !1, this._error = "", this._showTemplateModal = !1, this._expandedWaveforms = {};
  }
  _toggleWaveform(e, t) {
    const s = `${e}_${t}`;
    this._expandedWaveforms = {
      ...this._expandedWaveforms,
      [s]: !this._expandedWaveforms[s]
    };
  }
  async connectedCallback() {
    super.connectedCallback(), this.hass && await this.refresh();
  }
  willUpdate(e) {
    e.has("hass") && this.hass && this._systems.length === 0 && !this._loading && this.refresh();
  }
  async refresh() {
    if (this.hass) {
      this._loading = !0, this._error = "";
      try {
        this._systems = await ge(this.hass);
      } catch (e) {
        this._error = e.message || "Failed to load fuzzy systems";
      } finally {
        this._loading = !1;
      }
    }
  }
  _filteredSystems() {
    if (!this._searchQuery.trim()) return this._systems;
    const e = this._searchQuery.toLowerCase();
    return this._systems.filter(
      (t) => t.name.toLowerCase().includes(e) || t.system_id.toLowerCase().includes(e) || t.description.toLowerCase().includes(e)
    );
  }
  _handleCreateBlank() {
    this.dispatchEvent(
      new CustomEvent("create-system", {
        bubbles: !0,
        composed: !0
      })
    );
  }
  _handleEdit(e) {
    this.dispatchEvent(
      new CustomEvent("edit-system", {
        detail: { systemId: e.system_id, entryId: e.entry_id, config: e.config },
        bubbles: !0,
        composed: !0
      })
    );
  }
  async _handleDelete(e) {
    if (e.entry_id && confirm(`Are you sure you want to delete '${e.name}'?`))
      try {
        await me(this.hass, e.entry_id), await this.refresh();
      } catch (t) {
        alert(t.message || "Failed to delete system");
      }
  }
  _findOutputSensor(e, t) {
    if (!this.hass?.states) return null;
    const s = e.toLowerCase(), a = t.toLowerCase(), i = [
      `sensor.fuzzy_${s}_${a}`,
      `sensor.${s}_${a}`,
      `sensor.fuzzy_${a}`
    ];
    for (const n of i)
      if (this.hass.states[n])
        return { entityId: n, stateObj: this.hass.states[n] };
    for (const [n, r] of Object.entries(this.hass.states)) {
      if (!n.startsWith("sensor.") || n.endsWith("_set") || n.endsWith("_status")) continue;
      if ((r.attributes || {}).system === e && (n.endsWith(`_${a}`) || n.includes(a)))
        return { entityId: n, stateObj: r };
    }
    return null;
  }
  _getInputsStatus(e) {
    const t = e.config?.inputs || {}, s = Object.keys(t).length;
    let a = 0;
    for (const i of Object.values(t))
      i.entity_id && i.entity_id.trim() && a++;
    return { total: s, bound: a };
  }
  _openMoreInfo(e, t) {
    t.stopPropagation(), this.dispatchEvent(
      new CustomEvent("hass-more-info", {
        detail: { entityId: e },
        bubbles: !0,
        composed: !0
      })
    );
  }
  _renderLiveOutputs(e) {
    const t = e.config?.outputs || {}, s = Object.keys(t);
    if (s.length === 0) return o``;
    const a = this._getInputsStatus(e);
    return o`
      <div class="card-live-outputs">
        <div class="live-outputs-header">
          <span class="live-outputs-title">Live Runtime Outputs</span>
          ${a.total > 0 && a.bound < a.total ? o`
                <span
                  class="chip"
                  style="color: #fbbf24; background: rgba(245, 158, 11, 0.1); font-size: 11px;"
                  title="Some input antecedents do not have live sensor entities bound yet"
                >
                  ⚠️ ${a.total - a.bound} unbound input${a.total - a.bound > 1 ? "s" : ""}
                </span>
              ` : o`
                <span
                  class="chip"
                  style="color: #34d399; background: rgba(52, 211, 153, 0.1); font-size: 11px;"
                  title="Inputs bound to live sensors; rules actively evaluating"
                >
                  🟢 Reactive
                </span>
              `}
        </div>

        <div class="live-outputs-list">
          ${s.map((i) => {
      const n = this._findOutputSensor(e.system_id, i), r = t[i] || {}, l = n?.stateObj?.attributes?.unit_of_measurement || r.unit_of_measurement || "", d = n?.stateObj?.attributes?.dominant_term, p = n?.stateObj?.state, c = p !== void 0 && p !== "unknown" && p !== "unavailable" && !isNaN(parseFloat(p)), u = !!this._expandedWaveforms[`${e.system_id}_${i}`];
      if (n && c) {
        const h = parseFloat(p).toFixed(1);
        return o`
                <div style="display: inline-flex; align-items: center; gap: 4px;">
                  <button
                    class="output-badge live-active"
                    @click=${(f) => this._openMoreInfo(n.entityId, f)}
                    title="Entity: ${n.entityId} — Click to view Home Assistant history graph and diagnostic attributes"
                  >
                    <span class="pulse-dot"></span>
                    <span class="output-name">${i}:</span>
                    <span class="output-value">${h}${l ? ` ${l}` : ""}</span>
                    ${d ? o`<span class="dominant-term">(${d})</span>` : ""}
                  </button>
                  <button
                    class="btn btn-secondary"
                    style="padding: 2px 7px; font-size: 11px; border-radius: 9999px; height: 26px; line-height: 1;"
                    title="${u ? "Hide live waveform graph" : "View live aggregated fuzzy set waveform"}"
                    @click=${(f) => {
          f.stopPropagation(), this._toggleWaveform(e.system_id, i);
        }}
                  >
                    📈 ${u ? "Hide" : "Graph"}
                  </button>
                </div>
              `;
      }
      return o`
              <div
                class="output-badge live-idle"
                title="${n ? `Entity: ${n.entityId} (State: ${p})` : "Sensor entity not yet registered in Home Assistant"}"
              >
                <span class="idle-dot"></span>
                <span class="output-name">${i}:</span>
                <span class="output-value" style="color: var(--fuzzy-text-secondary);">
                  ${p === "unavailable" ? "Unavailable" : "Awaiting inputs"}
                </span>
              </div>
            `;
    })}
        </div>

        ${s.map((i) => {
      if (!this._expandedWaveforms[`${e.system_id}_${i}`]) return "";
      const n = this._findOutputSensor(e.system_id, i), r = t[i] || {}, l = n?.stateObj?.attributes?.unit_of_measurement || r.unit_of_measurement || "", d = n?.stateObj?.attributes?.universe || [], p = n?.stateObj?.attributes?.aggregated_set || [], c = n?.stateObj?.state, u = c !== void 0 && !isNaN(parseFloat(c)), h = n?.stateObj?.attributes?.dominant_term || "";
      return o`
            <div style="margin-top: 12px;">
              <fuzzy-aggregated-graph
                .universe=${d}
                .aggregatedSet=${p}
                .defuzzifiedValue=${u ? parseFloat(c) : void 0}
                .defuzzifier=${e.defuzzifier}
                .dominantTerm=${h}
                .unit=${l}
                .outputName=${i}
              ></fuzzy-aggregated-graph>
            </div>
          `;
    })}
      </div>
    `;
  }
  render() {
    const e = this._filteredSystems();
    return o`
      <div class="header-row">
        <div>
          <h1 class="title-lg">Fuzzy Logic Controllers</h1>
          <p class="subtitle">Declarative linguistic rule engines with Mamdani and Sugeno inference</p>
        </div>

        <div class="actions-group">
          <input
            class="input-text search-box"
            type="text"
            placeholder="Search systems..."
            .value=${this._searchQuery}
            @input=${(t) => this._searchQuery = t.target.value}
          />
          <button class="btn btn-secondary" @click=${() => this._showTemplateModal = !0}>
            ⚡ Templates
          </button>
          <button class="btn btn-primary" @click=${this._handleCreateBlank}>
            + Create System
          </button>
        </div>
      </div>

      ${this._error ? o`<div style="color: var(--fuzzy-danger); margin-bottom: 16px;">${this._error}</div>` : ""}

      ${e.length === 0 && !this._loading ? o`
            <div class="empty-state">
              <h3 style="font-size: 18px; font-weight: 600; margin-bottom: 8px;">No Fuzzy Systems Found</h3>
              <p class="subtitle" style="margin-bottom: 20px;">
                ${this._searchQuery ? "No controllers match your search." : "Get started by using a starter template or creating a blank controller."}
              </p>
              <button class="btn btn-primary" @click=${() => this._showTemplateModal = !0}>
                Browse Starter Templates
              </button>
            </div>
          ` : o`
            <div class="systems-grid">
              ${e.map(
      (t) => o`
                  <div class="card">
                    <div class="card-header">
                      <div>
                        <div class="card-title">${t.name}</div>
                        <div class="card-id">${t.system_id}</div>
                      </div>
                      <span class="badge ${t.source === "yaml" ? "badge-purple" : "badge-emerald"}">
                        ${t.source === "yaml" ? "YAML" : "UI"}
                      </span>
                    </div>

                    ${t.description ? o`<p class="subtitle" style="margin-bottom: 12px;">${t.description}</p>` : ""}

                    <div class="card-badges">
                      <span class="badge ${t.inference === "sugeno" ? "badge-amber" : "badge-cyan"}">
                        ${t.inference}
                      </span>
                      <span class="badge" style="background: rgba(255,255,255,0.06); color: var(--fuzzy-text-secondary);">
                        ${t.defuzzifier}
                      </span>
                      ${t.max_updates_per_period ? o`<span class="badge" style="background: rgba(16,185,129,0.1); color: #34d399;" title="Rate limiter budget">
                            ⏱️ ${t.max_updates_per_period} / ${t.update_period}s
                          </span>` : ""}
                    </div>

                    ${this._renderLiveOutputs(t)}

                    <div class="card-metrics">
                      <span class="chip">${t.input_count} inputs</span>
                      <span class="chip">${t.output_count} outputs</span>
                      <span class="chip">${t.rule_count} rules</span>
                      ${t.epsilon !== void 0 ? o`<span class="chip">ε = ${t.epsilon}</span>` : ""}
                    </div>

                    <div class="card-actions">
                      <button class="btn btn-secondary" @click=${() => this._handleEdit(t)}>
                        ${t.source === "yaml" ? "Inspect" : "Edit"}
                      </button>
                      ${t.source === "config_entry" ? o`
                            <button class="btn btn-danger" @click=${() => this._handleDelete(t)}>
                              Delete
                            </button>
                          ` : ""}
                    </div>
                  </div>
                `
    )}
            </div>
          `}

      ${this._showTemplateModal ? o`
            <fuzzy-template-modal
              .hass=${this.hass}
              @close=${() => this._showTemplateModal = !1}
              @template-instantiated=${(t) => {
      this._showTemplateModal = !1, this.dispatchEvent(
        new CustomEvent("edit-system", {
          detail: { config: t.detail.system },
          bubbles: !0,
          composed: !0
        })
      );
    }}
            ></fuzzy-template-modal>
          ` : ""}
    `;
  }
};
I.styles = [
  ct,
  R`
      .header-row {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 24px;
        flex-wrap: wrap;
        gap: 16px;
      }

      .actions-group {
        display: flex;
        gap: 10px;
        flex-wrap: wrap;
      }

      .search-box {
        max-width: 320px;
        position: relative;
      }

      .systems-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
        gap: 20px;
      }

      .card-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        margin-bottom: 12px;
      }

      .card-title {
        font-size: 18px;
        font-weight: 700;
        color: var(--fuzzy-text);
      }

      .card-id {
        font-size: 12px;
        color: var(--fuzzy-text-secondary);
        font-family: monospace;
      }

      .card-badges {
        display: flex;
        gap: 6px;
        flex-wrap: wrap;
        margin-bottom: 14px;
      }

      .card-metrics {
        display: flex;
        gap: 8px;
        flex-wrap: wrap;
        margin-bottom: 18px;
        padding-top: 10px;
        border-top: 1px solid var(--fuzzy-card-border);
      }

      .card-live-outputs {
        background: rgba(15, 23, 42, 0.45);
        border: 1px solid var(--fuzzy-card-border);
        border-radius: var(--fuzzy-radius-md);
        padding: 12px 14px;
        margin: 12px 0;
      }

      .live-outputs-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 8px;
        flex-wrap: wrap;
        gap: 6px;
      }

      .live-outputs-title {
        font-size: 11px;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        color: var(--fuzzy-text-secondary);
      }

      .live-outputs-list {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
      }

      .output-badge {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        padding: 5px 12px;
        border-radius: 9999px;
        font-size: 12px;
        font-weight: 500;
        cursor: pointer;
        border: 1px solid transparent;
        transition: all 0.2s ease;
        background: transparent;
        color: var(--fuzzy-text);
      }

      .output-badge.live-active {
        background: rgba(16, 185, 129, 0.12);
        border-color: rgba(16, 185, 129, 0.35);
        color: #34d399;
      }

      .output-badge.live-active:hover {
        background: rgba(16, 185, 129, 0.22);
        border-color: rgba(16, 185, 129, 0.6);
        transform: translateY(-1px);
        box-shadow: 0 2px 8px rgba(16, 185, 129, 0.25);
      }

      .output-badge.live-idle {
        background: rgba(255, 255, 255, 0.04);
        border-color: var(--fuzzy-card-border);
        color: var(--fuzzy-text-secondary);
        cursor: default;
      }

      .output-name {
        font-weight: 600;
        color: var(--fuzzy-text);
      }

      .output-value {
        font-weight: 700;
      }

      .dominant-term {
        font-size: 11px;
        opacity: 0.85;
        font-style: italic;
      }

      .pulse-dot {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: #10b981;
        box-shadow: 0 0 8px #10b981;
        display: inline-block;
        animation: pulse 2s infinite;
      }

      .idle-dot {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: #64748b;
        display: inline-block;
      }

      @keyframes pulse {
        0% {
          transform: scale(0.95);
          box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7);
        }
        70% {
          transform: scale(1);
          box-shadow: 0 0 0 6px rgba(16, 185, 129, 0);
        }
        100% {
          transform: scale(0.95);
          box-shadow: 0 0 0 0 rgba(16, 185, 129, 0);
        }
      }

      .card-actions {
        display: flex;
        justify-content: flex-end;
        gap: 8px;
      }

      .empty-state {
        text-align: center;
        padding: 60px 20px;
        background: var(--fuzzy-card-bg);
        border: 1px dashed var(--fuzzy-card-border);
        border-radius: var(--fuzzy-radius-lg);
      }
    `
];
j([
  v({ attribute: !1 })
], I.prototype, "hass", 2);
j([
  g()
], I.prototype, "_systems", 2);
j([
  g()
], I.prototype, "_searchQuery", 2);
j([
  g()
], I.prototype, "_loading", 2);
j([
  g()
], I.prototype, "_error", 2);
j([
  g()
], I.prototype, "_showTemplateModal", 2);
j([
  g()
], I.prototype, "_expandedWaveforms", 2);
I = j([
  L("fuzzy-system-catalog")
], I);
var we = Object.defineProperty, Se = Object.getOwnPropertyDescriptor, at = (e, t, s, a) => {
  for (var i = a > 1 ? void 0 : a ? Se(t, s) : t, n = e.length - 1, r; n >= 0; n--)
    (r = e[n]) && (i = (a ? r(t, s, i) : r(i)) || i);
  return a && i && we(t, s, i), i;
};
function Pt(e, t, s, a) {
  switch (e.toLowerCase()) {
    case "trimf": {
      const [i, n, r] = t;
      return s <= i || s >= r ? 0 : s === n ? 1 : s < n ? (s - i) / (n - i || 1e-6) : (r - s) / (r - n || 1e-6);
    }
    case "trapmf": {
      const [i, n, r, l] = t;
      return s <= i || s >= l ? 0 : s >= n && s <= r ? 1 : s < n ? (s - i) / (n - i || 1e-6) : (l - s) / (l - r || 1e-6);
    }
    case "gaussmf": {
      const [i, n] = t, r = n || 1;
      return Math.exp(-0.5 * Math.pow((s - i) / r, 2));
    }
    case "sigmf": {
      const [i, n] = t;
      return 1 / (1 + Math.exp(-i * (s - n)));
    }
    case "gbellmf": {
      const [i, n, r] = t;
      return 1 / (1 + Math.pow(Math.abs((s - r) / (i || 1e-6)), 2 * (n || 1)));
    }
    case "singleton":
    case "constant": {
      const [i] = t, n = (a || 100) * 0.015;
      return Math.abs(s - i) <= n ? 1 : 0;
    }
    default:
      return 0;
  }
}
const nt = [
  { stroke: "#38bdf8", fill: "rgba(56, 189, 248, 0.15)" },
  // cyan
  { stroke: "#34d399", fill: "rgba(52, 211, 153, 0.15)" },
  // emerald
  { stroke: "#fbbf24", fill: "rgba(251, 191, 36, 0.15)" },
  // amber
  { stroke: "#c084fc", fill: "rgba(192, 132, 252, 0.15)" },
  // purple
  { stroke: "#fb7185", fill: "rgba(251, 113, 133, 0.15)" },
  // rose
  { stroke: "#60a5fa", fill: "rgba(96, 165, 250, 0.15)" },
  // blue
  { stroke: "#a3e635", fill: "rgba(163, 230, 53, 0.15)" }
  // lime
];
let D = class extends z {
  constructor() {
    super(...arguments), this.range = [0, 100], this.terms = {};
  }
  render() {
    const e = Number.isFinite(this.range[0]) ? this.range[0] : 0, t = Number.isFinite(this.range[1]) && this.range[1] > e ? this.range[1] : e + 100, s = t - e || 1, a = 600, i = 180, n = 36, r = 24, l = 16, d = 28, p = a - n - r, c = i - l - d, u = (x) => n + (x - e) / s * p, h = (x) => l + (1 - Math.max(0, Math.min(1, x))) * c, f = Object.keys(this.terms || {}), y = 120;
    return o`
      <div class="canvas-container">
        <svg viewBox="0 0 ${a} ${i}" preserveAspectRatio="xMidYMid meet">
          <!-- Horizontal Grid lines at mu = 0.0, 0.5, 1.0 -->
          <line class="grid-line" x1=${n} y1=${h(0.5)} x2=${n + p} y2=${h(0.5)} />
          <line class="grid-line" x1=${n} y1=${h(1)} x2=${n + p} y2=${h(1)} />

          <!-- Axes -->
          <line class="axis-line" x1=${n} y1=${l} x2=${n} y2=${l + c} />
          <line class="axis-line" x1=${n} y1=${l + c} x2=${n + p} y2=${l + c} />

          <!-- Y-axis tick labels -->
          <text class="axis-text" x=${n - 6} y=${h(1) + 3} text-anchor="end">1.0</text>
          <text class="axis-text" x=${n - 6} y=${h(0.5) + 3} text-anchor="end">0.5</text>
          <text class="axis-text" x=${n - 6} y=${h(0) + 3} text-anchor="end">0.0</text>

          <!-- X-axis tick labels -->
          <text class="axis-text" x=${n} y=${i - 10} text-anchor="start">${e}</text>
          <text class="axis-text" x=${n + p / 2} y=${i - 10} text-anchor="middle">
            ${(e + s / 2).toFixed(1)}
          </text>
          <text class="axis-text" x=${n + p} y=${i - 10} text-anchor="end">
            ${t} ${this.unit || ""}
          </text>

          <!-- Curves for each membership term -->
          ${f.map((x, q) => {
      const E = this.terms[x];
      if (!E || !E.params) return J``;
      const F = nt[q % nt.length], H = [];
      for (let S = 0; S <= y; S++) {
        const k = e + S / y * s, W = Pt(E.type, E.params, k, s);
        H.push([u(k), h(W)]);
      }
      const M = H.reduce(
        (S, [k, W], Ft) => Ft === 0 ? `M ${k} ${W}` : `${S} L ${k} ${W}`,
        ""
      ), $ = `${M} L ${n + p} ${l + c} L ${n} ${l + c} Z`;
      return J`
              <g>
                <path class="curve-fill" d=${$} fill=${F.fill} />
                <path class="curve-path" d=${M} fill="none" stroke=${F.stroke} />
              </g>
            `;
    })}

          <!-- Current Value Marker (if provided) -->
          ${this.currentValue !== void 0 && !isNaN(this.currentValue) ? (() => {
      const x = u(Math.max(e, Math.min(t, this.currentValue)));
      return J`
                  <g>
                    <line
                      class="current-val-line"
                      x1=${x}
                      y1=${l}
                      x2=${x}
                      y2=${l + c}
                    />
                    <circle cx=${x} cy=${l + c} r="4" fill="#f43f5e" />
                    <text
                      class="axis-text"
                      x=${x}
                      y=${l - 4}
                      text-anchor="middle"
                      fill="#f43f5e"
                      font-weight="700"
                    >
                      ${this.currentValue.toFixed(1)}${this.unit ? ` ${this.unit}` : ""}
                    </text>
                  </g>
                `;
    })() : J``}
        </svg>

        <!-- Color Legend -->
        <div class="legend-row">
          ${f.map((x, q) => {
      const E = this.terms[x], F = nt[q % nt.length];
      return o`
              <div class="legend-item" style="color: ${F.stroke};">
                <span class="legend-swatch" style="background: ${F.stroke};"></span>
                <span>${x}</span>
                <span style="opacity: 0.6; font-size: 10px;">(${E.type})</span>
              </div>
            `;
    })}
        </div>
      </div>
    `;
  }
};
D.styles = R`
    :host {
      display: block;
      width: 100%;
      user-select: none;
    }

    .canvas-container {
      background: #090d16;
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 10px;
      padding: 12px 14px 10px;
      box-shadow: inset 0 2px 8px rgba(0, 0, 0, 0.4);
    }

    svg {
      width: 100%;
      height: auto;
      display: block;
      overflow: visible;
    }

    .axis-line {
      stroke: rgba(255, 255, 255, 0.15);
      stroke-width: 1;
    }

    .grid-line {
      stroke: rgba(255, 255, 255, 0.05);
      stroke-dasharray: 2 3;
      stroke-width: 1;
    }

    .axis-text {
      fill: #94a3b8;
      font-size: 10px;
      font-family: monospace;
    }

    .curve-path {
      stroke-width: 2.2;
      stroke-linejoin: round;
      stroke-linecap: round;
      transition: all 0.2s ease;
    }

    .curve-fill {
      transition: all 0.2s ease;
    }

    .current-val-line {
      stroke: #f43f5e;
      stroke-width: 2;
      stroke-dasharray: 4 3;
    }

    .legend-row {
      display: flex;
      flex-wrap: wrap;
      gap: 12px;
      margin-top: 10px;
      padding-top: 8px;
      border-top: 1px solid rgba(255, 255, 255, 0.06);
    }

    .legend-item {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      font-size: 11px;
      font-weight: 600;
    }

    .legend-swatch {
      width: 10px;
      height: 10px;
      border-radius: 3px;
    }
  `;
at([
  v({ type: Array })
], D.prototype, "range", 2);
at([
  v({ type: Object })
], D.prototype, "terms", 2);
at([
  v({ type: Number })
], D.prototype, "currentValue", 2);
at([
  v({ type: String })
], D.prototype, "unit", 2);
D = at([
  L("fuzzy-curve-canvas")
], D);
var ke = Object.defineProperty, Ae = Object.getOwnPropertyDescriptor, b = (e, t, s, a) => {
  for (var i = a > 1 ? void 0 : a ? Ae(t, s) : t, n = e.length - 1, r; n >= 0; n--)
    (r = e[n]) && (i = (a ? r(t, s, i) : r(i)) || i);
  return a && i && ke(t, s, i), i;
};
let m = class extends z {
  constructor() {
    super(...arguments), this.source = "config_entry", this._activeTab = "general", this._rawJson = "", this._saving = !1, this._error = "", this._successMsg = "", this._simInputs = {}, this._simResults = null, this._simulating = !1, this._simError = "", this._showAddInputModal = !1, this._newInputEntityId = "", this._newInputVarName = "", this._newInputMin = 0, this._newInputMax = 100, this._newInputTermsPreset = "3_terms", this._newInputModalError = "", this._showRuleBuilderModal = !1, this._editingRuleIndex = -1, this._builderConditions = [], this._builderConsequent = {
      variable: "",
      term: "",
      isConstant: !1,
      constantValue: 0
    }, this._ruleBuilderError = "", this._rulesViewMode = "visual";
  }
  connectedCallback() {
    super.connectedCallback(), this._initForm();
  }
  willUpdate(e) {
    e.has("systemConfig") && this.systemConfig && this._initForm();
  }
  _initForm() {
    this.systemConfig ? this._config = JSON.parse(JSON.stringify(this.systemConfig)) : this._config = {
      system_id: "",
      name: "",
      description: "",
      inference: "mamdani",
      defuzzifier: "cog",
      expose_system_sensor: !0,
      max_updates_per_period: 20,
      update_period: 0.05,
      epsilon: 0.01,
      inputs: {},
      outputs: {},
      rules: []
    }, this._rawJson = JSON.stringify(this._config, null, 2), this._initSimInputs();
  }
  _initSimInputs(e = !1) {
    const t = {};
    for (const [s, a] of Object.entries(this._config?.inputs || {})) {
      const i = Number.isFinite(a.range?.[0]) ? a.range[0] : 0, n = Number.isFinite(a.range?.[1]) && a.range[1] > i ? a.range[1] : i + 100, r = this._simInputs[s];
      if (!e && r !== void 0 && r >= i && r <= n)
        t[s] = r;
      else if (a.entity_id && this.hass?.states?.[a.entity_id]) {
        const l = parseFloat(this.hass.states[a.entity_id].state);
        t[s] = isNaN(l) ? (i + n) / 2 : l;
      } else a.default !== void 0 ? t[s] = a.default : t[s] = (i + n) / 2;
    }
    this._simInputs = t;
  }
  _syncSimWithLiveHass() {
    const e = { ...this._simInputs };
    for (const [t, s] of Object.entries(this._config.inputs || {}))
      if (s.entity_id && this.hass?.states?.[s.entity_id]) {
        const a = parseFloat(this.hass.states[s.entity_id].state);
        isNaN(a) || (e[t] = a);
      }
    this._simInputs = e, this._runSimulation();
  }
  _onSimInputChange(e, t) {
    this._simInputs = { ...this._simInputs, [e]: t }, this._simDebounceTimer && clearTimeout(this._simDebounceTimer), this._simDebounceTimer = window.setTimeout(() => {
      this._runSimulation();
    }, 50);
  }
  async _runSimulation() {
    if (this.hass) {
      this._simulating = !0, this._simError = "";
      try {
        const e = await ve(this.hass, this._config, this._simInputs);
        this._simResults = e;
      } catch (e) {
        this._simError = e?.message || String(e);
      } finally {
        this._simulating = !1, this.requestUpdate();
      }
    }
  }
  _findOutputSensor(e) {
    if (!this.hass?.states || !this._config.system_id) return null;
    const s = `sensor.fuzzy_${this._config.system_id.toLowerCase()}_${e.toLowerCase()}`;
    return this.hass.states[s] || null;
  }
  _handleBack() {
    this.dispatchEvent(new CustomEvent("back", { bubbles: !0, composed: !0 }));
  }
  _handleInferenceChange(e) {
    this._config.inference = e, e === "sugeno" ? this._config.defuzzifier = "weighted_average" : this._config.defuzzifier = "cog", this.requestUpdate();
  }
  async _handleSave() {
    if (this._error = "", this._successMsg = "", !this._config.system_id || !this._config.system_id.trim()) {
      this._error = "System Identifier is required.", this._activeTab = "general";
      return;
    }
    if (!this._config.name || !this._config.name.trim()) {
      this._error = "System Name is required.", this._activeTab = "general";
      return;
    }
    if (this._activeTab === "raw")
      try {
        this._config = JSON.parse(this._rawJson);
      } catch (e) {
        this._error = `Invalid JSON: ${e.message}`;
        return;
      }
    this._config.rules && (this._config.rules = this._config.rules.map((e) => typeof e == "string" ? e.trim() : e).filter((e) => {
      if (!e) return !1;
      if (typeof e == "string") {
        const t = e.toUpperCase();
        return t !== "IF THEN" && t !== "IF  THEN" && !t.match(/^IF\s*THEN\s*$/);
      }
      return !0;
    })), this._saving = !0;
    try {
      const e = await fe(this.hass, this._config, this.entryId);
      this._successMsg = `System '${e.system_id}' saved successfully!`, this.dispatchEvent(
        new CustomEvent("system-saved", {
          detail: { systemId: e.system_id, entryId: e.entry_id },
          bubbles: !0,
          composed: !0
        })
      );
    } catch (e) {
      this._error = e.message || "Failed to save fuzzy system.";
    } finally {
      this._saving = !1;
    }
  }
  // --- Inputs Handlers ---
  _openAddInputModal() {
    this._newInputEntityId = "", this._newInputVarName = "", this._newInputMin = 0, this._newInputMax = 100, this._newInputTermsPreset = "3_terms", this._newInputModalError = "", this._showAddInputModal = !0;
  }
  _onNewInputEntitySelected(e) {
    if (this._newInputEntityId = e, !e) return;
    const t = e.split(".")[1]?.replace(/[^a-z0-9_]/g, "_") || "";
    (!this._newInputVarName || this._newInputVarName.trim() === "") && (this._newInputVarName = t);
    const s = this.hass?.states ? this.hass.states[e] : null;
    if (s?.attributes) {
      const a = s.attributes.unit_of_measurement;
      a === "°C" ? (this._newInputMin = 10, this._newInputMax = 35) : a === "°F" ? (this._newInputMin = 50, this._newInputMax = 95) : a === "%" ? (this._newInputMin = 0, this._newInputMax = 100) : a === "lx" || a === "lux" ? (this._newInputMin = 0, this._newInputMax = 1e3) : a === "ppm" ? (this._newInputMin = 400, this._newInputMax = 2e3) : (a === "W" || a === "kW") && (this._newInputMin = 0, this._newInputMax = 5e3);
    }
    this.requestUpdate();
  }
  _confirmAddInput() {
    this._newInputModalError = "";
    const e = (this._newInputVarName || "").trim().toLowerCase().replace(/[^a-z0-9_]/g, "_");
    if (!e) {
      this._newInputModalError = "Please specify a linguistic variable name.";
      return;
    }
    if (this._config.inputs && this._config.inputs[e]) {
      this._newInputModalError = `An input variable named '${e}' already exists.`;
      return;
    }
    const t = Number.isFinite(this._newInputMin) ? this._newInputMin : 0, s = Number.isFinite(this._newInputMax) && this._newInputMax > t ? this._newInputMax : t + 100, a = s - t;
    let i;
    this._newInputTermsPreset === "5_terms" ? i = {
      very_low: { type: "trapmf", params: [t, t, t + a * 0.15, t + a * 0.3] },
      low: { type: "trimf", params: [t + a * 0.15, t + a * 0.35, t + a * 0.55] },
      medium: { type: "trimf", params: [t + a * 0.35, t + a * 0.5, t + a * 0.65] },
      high: { type: "trimf", params: [t + a * 0.45, t + a * 0.65, t + a * 0.85] },
      very_high: { type: "trapmf", params: [t + a * 0.7, t + a * 0.85, s, s] }
    } : i = {
      low: { type: "trapmf", params: [t, t, t + a * 0.25, t + a * 0.5] },
      medium: { type: "trimf", params: [t + a * 0.25, t + a * 0.5, t + a * 0.75] },
      high: { type: "trapmf", params: [t + a * 0.5, t + a * 0.75, s, s] }
    }, this._config.inputs || (this._config.inputs = {}), this._config.inputs[e] = {
      entity_id: this._newInputEntityId || "",
      range: [t, s],
      resolution: 100,
      default: t,
      terms: i
    }, this._showAddInputModal = !1, this.requestUpdate();
  }
  _getAvailableEntities() {
    if (!this.hass?.states) return [];
    const e = [];
    for (const [t, s] of Object.entries(this.hass.states)) {
      const a = t.split(".")[0];
      (a === "sensor" || a === "input_number" || a === "number" || a === "climate" || a === "weather") && e.push({
        entity_id: t,
        friendly_name: s.attributes?.friendly_name || t,
        unit: s.attributes?.unit_of_measurement || "",
        state: s.state
      });
    }
    return e.sort((t, s) => t.friendly_name.localeCompare(s.friendly_name)), e;
  }
  _renderEntityPicker(e, t, s) {
    const a = !!customElements.get("ha-entity-picker"), i = this._getAvailableEntities();
    return a ? o`
        <ha-entity-picker
          .hass=${this.hass}
          .value=${e || ""}
          ?disabled=${t}
          .includeDomains=${["sensor", "input_number", "number", "climate", "weather"]}
          @value-changed=${(n) => s(n.detail.value || "")}
        ></ha-entity-picker>
      ` : o`
      <div style="position: relative;">
        <input
          class="input-text"
          type="text"
          list="ha-fuzzy-entities"
          .value=${e || ""}
          ?disabled=${t}
          placeholder="Search entities (e.g. sensor.temperature)..."
          @input=${(n) => s(n.target.value)}
        />
        <datalist id="ha-fuzzy-entities">
          ${i.map(
      (n) => o`
              <option value=${n.entity_id}>
                ${n.friendly_name} (${n.state} ${n.unit})
              </option>
            `
    )}
        </datalist>
      </div>
    `;
  }
  _renderEntityStatusTag(e) {
    if (!e || !e.trim())
      return o`
        <span class="badge badge-amber" title="This variable has no live sensor bound yet">
          ⚠️ Unbound (Add entity to track live values)
        </span>
      `;
    const t = this.hass?.states ? this.hass.states[e] : null;
    if (!t)
      return o`
        <span class="badge" style="background: rgba(239,68,68,0.15); color: #f87171;">
          ❓ ${e} (Not found in HA)
        </span>
      `;
    const s = t.attributes?.unit_of_measurement || "";
    return o`
      <span class="badge badge-emerald" title="Live sensor state in Home Assistant">
        🟢 Live: ${t.state} ${s}
      </span>
    `;
  }
  _removeInput(e) {
    confirm(`Delete input variable '${e}'?`) && (delete this._config.inputs[e], this.requestUpdate());
  }
  // --- Outputs Handlers ---
  _addOutput() {
    const e = prompt("Enter output variable name (e.g., fan_speed):");
    if (!e || !e.trim()) return;
    const t = e.trim().toLowerCase().replace(/[^a-z0-9_]/g, "_");
    if (this._config.outputs[t]) {
      alert(`Output '${t}' already exists.`);
      return;
    }
    this._config.outputs[t] = {
      range: [0, 100],
      resolution: 100,
      defuzzifier: this._config.inference === "sugeno" ? "weighted_average" : "cog",
      epsilon: this._config.epsilon ?? 0.01,
      unit_of_measurement: "%",
      terms: {
        low: { type: "trimf", params: [0, 0, 50] },
        medium: { type: "trimf", params: [25, 50, 75] },
        high: { type: "trimf", params: [50, 100, 100] }
      }
    }, this.requestUpdate();
  }
  _removeOutput(e) {
    confirm(`Delete output variable '${e}'?`) && (delete this._config.outputs[e], this.requestUpdate());
  }
  // --- Rules Handlers & Visual Builder ---
  _parseRuleToBuilder(e) {
    if (!e || !e.trim()) return null;
    const t = e.trim().match(/^IF\s+(.+)\s+THEN\s+(.+)$/i);
    if (!t) return null;
    const s = t[1].trim(), i = t[2].trim().match(/^([a-zA-Z0-9_]+)\s*(?:IS|=)\s*(.+)$/i);
    if (!i) return null;
    const n = i[1].trim(), r = i[2].trim(), l = parseFloat(r), d = !isNaN(l) && isFinite(l) && !r.match(/[a-zA-Z]/), p = s.split(/\s+(AND|OR)\s+/i), c = [];
    let u = "AND";
    for (let h = 0; h < p.length; h++) {
      const f = p[h].trim();
      if (!f) continue;
      if (f.toUpperCase() === "AND") {
        u = "AND";
        continue;
      }
      if (f.toUpperCase() === "OR") {
        u = "OR";
        continue;
      }
      const y = f.match(
        /^([a-zA-Z0-9_]+)\s+IS\s+(?:(not|very|somewhat|extremely|slightly)\s+)?([a-zA-Z0-9_]+)$/i
      );
      if (!y) return null;
      c.push({
        variable: y[1].trim(),
        hedge: (y[2] || "").trim().toLowerCase(),
        term: y[3].trim(),
        connector: c.length === 0 ? "AND" : u
      });
    }
    return c.length === 0 ? null : {
      conditions: c,
      consequent: {
        variable: n,
        term: d ? "" : r,
        isConstant: d,
        constantValue: d ? l : 0
      }
    };
  }
  _compileRuleString(e, t) {
    const s = [];
    e.forEach((n, r) => {
      const l = n.hedge ? `${n.hedge} ` : "", d = `${n.variable} IS ${l}${n.term}`;
      r === 0 ? s.push(d) : s.push(`${n.connector} ${d}`);
    });
    const a = s.join(" "), i = t.isConstant ? `${t.variable} IS ${t.constantValue}` : `${t.variable} IS ${t.term}`;
    return `IF ${a} THEN ${i}`;
  }
  _openAddRuleBuilder() {
    this._ruleBuilderError = "";
    const e = Object.keys(this._config.inputs || {}), t = Object.keys(this._config.outputs || {});
    if (e.length === 0) {
      this._error = "Please define at least one input antecedent variable before creating rules.", this._activeTab = "inputs";
      return;
    }
    if (t.length === 0) {
      this._error = "Please define at least one output consequent variable before creating rules.", this._activeTab = "outputs";
      return;
    }
    const s = e[0], a = Object.keys(this._config.inputs[s]?.terms || {}), i = t[0], n = Object.keys(this._config.outputs[i]?.terms || {});
    this._editingRuleIndex = -1, this._builderConditions = [
      {
        variable: s,
        hedge: "",
        term: a[0] || "low",
        connector: "AND"
      }
    ], this._builderConsequent = {
      variable: i,
      term: n[0] || "low",
      isConstant: !1,
      constantValue: 0
    }, this._showRuleBuilderModal = !0;
  }
  _openEditRuleBuilder(e) {
    this._ruleBuilderError = "";
    const t = this._config.rules[e] || "", s = this._parseRuleToBuilder(t);
    if (s)
      this._editingRuleIndex = e, this._builderConditions = s.conditions, this._builderConsequent = s.consequent, this._showRuleBuilderModal = !0;
    else {
      const a = Object.keys(this._config.inputs || {}), i = Object.keys(this._config.outputs || {}), n = a[0] || "", r = Object.keys(this._config.inputs[n]?.terms || {}), l = i[0] || "", d = Object.keys(this._config.outputs[l]?.terms || {});
      this._editingRuleIndex = e, this._builderConditions = [
        {
          variable: n,
          hedge: "",
          term: r[0] || "low",
          connector: "AND"
        }
      ], this._builderConsequent = {
        variable: l,
        term: d[0] || "low",
        isConstant: !1,
        constantValue: 0
      }, this._ruleBuilderError = `Notice: Rule #${e + 1} uses non-standard formatting. Configuring it here will format it as canonical syntax.`, this._showRuleBuilderModal = !0;
    }
  }
  _onBuilderConditionVarChange(e, t) {
    const s = Object.keys(this._config.inputs[t]?.terms || {});
    this._builderConditions[e].variable = t, this._builderConditions[e].term = s[0] || "", this.requestUpdate();
  }
  _onBuilderConsequentVarChange(e) {
    const t = Object.keys(this._config.outputs[e]?.terms || {});
    this._builderConsequent.variable = e, this._builderConsequent.isConstant || (this._builderConsequent.term = t[0] || ""), this.requestUpdate();
  }
  _addBuilderCondition(e = "AND") {
    const s = Object.keys(this._config.inputs || {})[0] || "", a = Object.keys(this._config.inputs[s]?.terms || {});
    this._builderConditions.push({
      variable: s,
      hedge: "",
      term: a[0] || "",
      connector: e
    }), this.requestUpdate();
  }
  _removeBuilderCondition(e) {
    this._builderConditions.length <= 1 || (this._builderConditions.splice(e, 1), this.requestUpdate());
  }
  _saveBuilderRule() {
    if (this._ruleBuilderError = "", this._builderConditions.length === 0) {
      this._ruleBuilderError = "At least one antecedent condition is required.";
      return;
    }
    for (const t of this._builderConditions)
      if (!t.variable || !t.term) {
        this._ruleBuilderError = "All conditions must have an input variable and a term selected.";
        return;
      }
    if (!this._builderConsequent.variable) {
      this._ruleBuilderError = "An output consequent variable must be selected.";
      return;
    }
    if (!this._builderConsequent.isConstant && !this._builderConsequent.term) {
      this._ruleBuilderError = "An output linguistic term must be selected.";
      return;
    }
    const e = this._compileRuleString(
      this._builderConditions,
      this._builderConsequent
    );
    this._editingRuleIndex >= 0 ? this._config.rules[this._editingRuleIndex] = e : this._config.rules = [...this._config.rules, e], this._showRuleBuilderModal = !1, this.requestUpdate();
  }
  _addRule() {
    this._config.rules = [...this._config.rules, "IF  THEN "], this._rulesViewMode = "text", this.requestUpdate();
  }
  _updateRule(e, t) {
    this._config.rules[e] = t;
  }
  _removeRule(e) {
    this._config.rules.splice(e, 1), this.requestUpdate();
  }
  render() {
    if (!this._config) return o``;
    const e = this.source === "yaml";
    return o`
      <div class="header-actions">
        <div>
          <button class="btn btn-secondary" @click=${this._handleBack}>
            ← Back to Catalog
          </button>
        </div>

        <div style="display: flex; gap: 10px; align-items: center;">
          ${this._saving ? o`<span class="chip">Saving...</span>` : ""}
          ${e ? "" : o`
                <button
                  class="btn btn-primary"
                  @click=${this._handleSave}
                  ?disabled=${this._saving}
                >
                  💾 Save Controller
                </button>
              `}
        </div>
      </div>

      ${e ? o`
            <div class="yaml-banner">
              <span>⚠️</span>
              <div>
                <strong>Defined in configuration.yaml</strong> — This controller is managed via YAML configuration and is shown in read-only inspection mode.
              </div>
            </div>
          ` : ""}
      ${this._error ? o`<div style="color: var(--fuzzy-danger); margin-bottom: 16px;">${this._error}</div>` : ""}
      ${this._successMsg ? o`<div style="color: var(--fuzzy-success); margin-bottom: 16px;">${this._successMsg}</div>` : ""}

      <div class="card">
        <div class="tabs">
          <button
            class="tab-btn ${this._activeTab === "general" ? "active" : ""}"
            @click=${() => this._activeTab = "general"}
          >
            ⚙️ General
          </button>
          <button
            class="tab-btn ${this._activeTab === "inputs" ? "active" : ""}"
            @click=${() => this._activeTab = "inputs"}
          >
            📥 Inputs (${Object.keys(this._config.inputs || {}).length})
          </button>
          <button
            class="tab-btn ${this._activeTab === "outputs" ? "active" : ""}"
            @click=${() => this._activeTab = "outputs"}
          >
            📤 Outputs (${Object.keys(this._config.outputs || {}).length})
          </button>
          <button
            class="tab-btn ${this._activeTab === "rules" ? "active" : ""}"
            @click=${() => this._activeTab = "rules"}
          >
            📜 Rules (${(this._config.rules || []).length})
          </button>
          <button
            class="tab-btn ${this._activeTab === "simulation" ? "active" : ""}"
            @click=${() => {
      this._activeTab = "simulation", this._initSimInputs(), this._runSimulation();
    }}
          >
            🧪 Simulation & Waveforms
          </button>
          <button
            class="tab-btn ${this._activeTab === "raw" ? "active" : ""}"
            @click=${() => {
      this._rawJson = JSON.stringify(this._config, null, 2), this._activeTab = "raw";
    }}
          >
            { } Raw Config
          </button>
        </div>

        ${this._renderActiveTab(e)}
      </div>

      ${this._showAddInputModal ? this._renderAddInputModal() : ""}
      ${this._showRuleBuilderModal ? this._renderRuleBuilderModal() : ""}
    `;
  }
  _renderAddInputModal() {
    return o`
      <div
        class="modal-overlay"
        @click=${(e) => {
      e.target.classList.contains("modal-overlay") && (this._showAddInputModal = !1);
    }}
      >
        <div class="modal-content" style="max-width: 640px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 18px;">
            <h2 style="font-size: 20px; font-weight: 700;">Add Input Antecedent Variable</h2>
            <button
              class="btn btn-icon"
              @click=${() => this._showAddInputModal = !1}
              title="Close"
            >
              ✕
            </button>
          </div>

          <div
            style="background: rgba(2, 132, 199, 0.1); border: 1px solid rgba(2, 132, 199, 0.25); border-radius: var(--fuzzy-radius-md); padding: 14px; margin-bottom: 20px; font-size: 13px; line-height: 1.5;"
          >
            <div style="font-weight: 600; color: #38bdf8; margin-bottom: 4px;">
              💡 Linguistic Variable vs. Bound Sensor Entity
            </div>
            <div>
              • <strong>Bound Sensor Entity</strong>: The Home Assistant device feeding real-time numeric measurements.<br />
              • <strong>Linguistic Variable Name</strong>: The identifier used in rules (e.g. <code>IF indoor_temp IS hot THEN ...</code>).
            </div>
          </div>

          ${this._newInputModalError ? o`<div style="color: var(--fuzzy-danger); margin-bottom: 14px; font-size: 13px;">${this._newInputModalError}</div>` : ""}

          <div class="form-group">
            <label class="form-label" style="font-weight: 600;">1. Select Home Assistant Sensor Entity</label>
            ${this._renderEntityPicker(
      this._newInputEntityId,
      !1,
      (e) => this._onNewInputEntitySelected(e)
    )}
            <div class="helper-text">
              Search and pick a live entity. Selecting one will auto-suggest the linguistic name and range.
            </div>
          </div>

          ${this._newInputEntityId ? o`
                <div
                  style="margin-bottom: 18px; padding: 10px 14px; background: rgba(255,255,255,0.03); border-radius: var(--fuzzy-radius-sm); display: flex; align-items: center; justify-content: space-between;"
                >
                  <span style="font-size: 13px; color: var(--fuzzy-text-secondary);">Current Entity State:</span>
                  ${this._renderEntityStatusTag(this._newInputEntityId)}
                </div>
              ` : ""}

          <div class="form-group">
            <label class="form-label" style="font-weight: 600;">2. Linguistic Variable Name (for rules)</label>
            <input
              class="input-text"
              type="text"
              placeholder="e.g. indoor_temperature"
              .value=${this._newInputVarName}
              @input=${(e) => this._newInputVarName = e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, "_")}
            />
            <div class="helper-text">
              Used in rules: <code>IF ${this._newInputVarName || "variable_name"} IS &lt;term&gt; THEN ...</code>
            </div>
          </div>

          <div class="grid-2">
            <div class="form-group">
              <label class="form-label">Range Minimum</label>
              <input
                class="input-text"
                type="number"
                .value=${String(this._newInputMin)}
                @input=${(e) => this._newInputMin = parseFloat(e.target.value)}
              />
            </div>
            <div class="form-group">
              <label class="form-label">Range Maximum</label>
              <input
                class="input-text"
                type="number"
                .value=${String(this._newInputMax)}
                @input=${(e) => this._newInputMax = parseFloat(e.target.value)}
              />
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Initial Linguistic Terms Preset</label>
            <select
              class="input-select"
              .value=${this._newInputTermsPreset}
              @change=${(e) => this._newInputTermsPreset = e.target.value}
            >
              <option value="3_terms">3 Terms (Low, Medium, High)</option>
              <option value="5_terms">5 Terms (Very Low, Low, Medium, High, Very High)</option>
            </select>
            <div class="helper-text">You can fine-tune or add custom terms at any time.</div>
          </div>

          <div style="display: flex; justify-content: flex-end; gap: 12px; margin-top: 24px;">
            <button
              class="btn btn-secondary"
              @click=${() => this._showAddInputModal = !1}
            >
              Cancel
            </button>
            <button class="btn btn-primary" @click=${this._confirmAddInput}>
              + Add Variable
            </button>
          </div>
        </div>
      </div>
    `;
  }
  _renderActiveTab(e) {
    switch (this._activeTab) {
      case "general":
        return this._renderGeneralTab(e);
      case "inputs":
        return this._renderInputsTab(e);
      case "outputs":
        return this._renderOutputsTab(e);
      case "rules":
        return this._renderRulesTab(e);
      case "simulation":
        return this._renderSimulationTab();
      case "raw":
        return this._renderRawTab(e);
    }
  }
  _renderGeneralTab(e) {
    return o`
      <div class="grid-2">
        <div class="form-group">
          <label class="form-label">System Identifier (system_id)</label>
          <input
            class="input-text"
            type="text"
            .value=${this._config.system_id || ""}
            ?disabled=${e || !!this.entryId}
            placeholder="e.g. climate_controller"
            @input=${(t) => this._config.system_id = t.target.value}
          />
          <div class="helper-text">Unique alphanumeric slug for entity IDs (sensor.fuzzy_system_*)</div>
        </div>

        <div class="form-group">
          <label class="form-label">Display Name</label>
          <input
            class="input-text"
            type="text"
            .value=${this._config.name || ""}
            ?disabled=${e}
            placeholder="e.g. Climate Controller"
            @input=${(t) => this._config.name = t.target.value}
          />
        </div>
      </div>

      <div class="form-group">
        <label class="form-label">Description</label>
        <textarea
          class="input-textarea"
          rows="2"
          .value=${this._config.description || ""}
          ?disabled=${e}
          placeholder="Brief description of the control objectives..."
          @input=${(t) => this._config.description = t.target.value}
        ></textarea>
      </div>

      <div class="grid-2">
        <div class="form-group">
          <label class="form-label">Inference Engine</label>
          <select
            class="input-select"
            .value=${this._config.inference || "mamdani"}
            ?disabled=${e}
            @change=${(t) => this._handleInferenceChange(t.target.value)}
          >
            <option value="mamdani">Mamdani (Fuzzy Output Sets)</option>
            <option value="sugeno">Takagi-Sugeno (Crisp Function/Singleton Outputs)</option>
          </select>
          <div class="helper-text">Mamdani defuzzifies full distributions; Sugeno computes weighted averages</div>
        </div>

        <div class="form-group">
          <label class="form-label">Default Defuzzifier</label>
          <select
            class="input-select"
            .value=${this._config.defuzzifier || (this._config.inference === "sugeno" ? "weighted_average" : "cog")}
            ?disabled=${e}
            @change=${(t) => this._config.defuzzifier = t.target.value}
          >
            ${this._config.inference === "sugeno" ? o`
                  <option value="weighted_average">Weighted Average (weighted_average)</option>
                  <option value="wtsum">Weighted Sum (wtsum)</option>
                ` : o`
                  <option value="cog">Centroid / Center of Gravity (cog)</option>
                  <option value="boa">Bisector of Area (boa)</option>
                  <option value="mom">Mean of Maximum (mom)</option>
                  <option value="som">Smallest of Maximum (som)</option>
                  <option value="lom">Largest of Maximum (lom)</option>
                  <option value="cos">Center of Sums (cos)</option>
                  <option value="coa">Center of Area (coa)</option>
                `}
          </select>
        </div>
      </div>

      <h3 style="font-size: 15px; font-weight: 600; margin: 24px 0 12px; color: var(--fuzzy-accent);">
        ⏱️ Recurrence & Stability Guardrails
      </h3>
      <div class="grid-3">
        <div class="form-group">
          <label class="form-label">Max Updates per Period</label>
          <input
            class="input-text"
            type="number"
            min="1"
            .value=${String(this._config.max_updates_per_period ?? 20)}
            ?disabled=${e}
            @input=${(t) => this._config.max_updates_per_period = parseInt(t.target.value, 10)}
          />
          <div class="helper-text">Default: 20 updates</div>
        </div>

        <div class="form-group">
          <label class="form-label">Update Period (Seconds)</label>
          <input
            class="input-text"
            type="number"
            step="0.005"
            min="0.001"
            .value=${String(this._config.update_period ?? 0.05)}
            ?disabled=${e}
            @input=${(t) => this._config.update_period = parseFloat(t.target.value)}
          />
          <div class="helper-text">Default: 0.05s sliding window</div>
        </div>

        <div class="form-group">
          <label class="form-label">Epsilon Deadband (ε)</label>
          <input
            class="input-text"
            type="number"
            step="0.001"
            min="0"
            .value=${String(this._config.epsilon ?? 0.01)}
            ?disabled=${e}
            @input=${(t) => this._config.epsilon = parseFloat(t.target.value)}
          />
          <div class="helper-text">Suppresses updates if |Δy| &lt; ε (Default: 0.01)</div>
        </div>
      </div>

      <div class="form-group" style="margin-top: 14px;">
        <label class="checkbox-label">
          <input
            type="checkbox"
            .checked=${this._config.expose_system_sensor !== !1}
            ?disabled=${e}
            @change=${(t) => this._config.expose_system_sensor = t.target.checked}
          />
          Expose System Status Diagnostic Sensor (sensor.fuzzy_system_{id}_status)
        </label>
      </div>
    `;
  }
  _renderInputsTab(e) {
    const t = this._config.inputs || {}, s = Object.keys(t);
    return o`
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
        <div>
          <h3 class="section-title">Input Antecedents</h3>
          <p class="helper-text">Sensors and numerical inputs mapped to linguistic membership terms</p>
        </div>
        ${e ? "" : o`
              <button class="btn btn-secondary" @click=${this._openAddInputModal}>
                + Add Input Variable
              </button>
            `}
      </div>

      ${s.length === 0 ? o`<p class="subtitle" style="padding: 20px 0;">No input variables defined yet.</p>` : s.map((a) => {
      const i = t[a], n = i.entity_id && this.hass?.states ? this.hass.states[i.entity_id] : null, r = n && !isNaN(parseFloat(n.state)) ? parseFloat(n.state) : void 0, l = n?.attributes?.unit_of_measurement || "";
      return o`
              <div class="section-box">
                <div class="section-header">
                  <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
                    <span class="badge badge-cyan">${a}</span>
                    ${this._renderEntityStatusTag(i.entity_id)}
                    <span class="chip">Range: [${i.range[0]}, ${i.range[1]}]</span>
                  </div>
                  ${e ? "" : o`
                        <button class="btn btn-danger btn-icon" @click=${() => this._removeInput(a)} title="Delete Input">
                          ✕
                        </button>
                      `}
                </div>

                <div class="grid-2">
                  <div class="form-group">
                    <label class="form-label">Bound Home Assistant Sensor Entity</label>
                    ${this._renderEntityPicker(i.entity_id, e, (d) => {
        i.entity_id = d, this.requestUpdate();
      })}
                    <div class="helper-text">
                      ${i.entity_id ? o`Feeds live numerical measurements from <code>${i.entity_id}</code> into <code>${a}</code>.` : o`<span style="color: #fbbf24;">⚠️ Unbound: select an entity to evaluate live rules in HA.</span>`}
                    </div>
                  </div>

                  <div class="grid-2">
                    <div class="form-group">
                      <label class="form-label">Range Min</label>
                      <input
                        class="input-text"
                        type="number"
                        .value=${String(i.range[0])}
                        ?disabled=${e}
                        @input=${(d) => {
        i.range[0] = parseFloat(d.target.value), this.requestUpdate();
      }}
                      />
                    </div>
                    <div class="form-group">
                      <label class="form-label">Range Max</label>
                      <input
                        class="input-text"
                        type="number"
                        .value=${String(i.range[1])}
                        ?disabled=${e}
                        @input=${(d) => {
        i.range[1] = parseFloat(d.target.value), this.requestUpdate();
      }}
                      />
                    </div>
                  </div>
                </div>

                <div style="margin-top: 14px;">
                  <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
                    <span class="form-label" style="margin: 0;">Membership Curves Preview</span>
                    ${r !== void 0 ? o`<span class="chip" style="color: #34d399;">Live Sensor State: ${r}${l ? ` ${l}` : ""}</span>` : ""}
                  </div>
                  <fuzzy-curve-canvas
                    .range=${i.range}
                    .terms=${i.terms || {}}
                    .currentValue=${r}
                    .unit=${l}
                  ></fuzzy-curve-canvas>
                </div>

                ${this._renderTermsEditor(i.terms, i.range, e, () => this.requestUpdate())}
              </div>
            `;
    })}
    `;
  }
  _renderOutputsTab(e) {
    const t = this._config.outputs || {}, s = Object.keys(t);
    return o`
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
        <div>
          <h3 class="section-title">Output Consequents</h3>
          <p class="helper-text">Control targets defuzzified and published to Home Assistant sensors</p>
        </div>
        ${e ? "" : o`
              <button class="btn btn-secondary" @click=${this._addOutput}>
                + Add Output Variable
              </button>
            `}
      </div>

      ${s.length === 0 ? o`<p class="subtitle" style="padding: 20px 0;">No output variables defined yet.</p>` : s.map((a) => {
      const i = t[a], n = this._findOutputSensor(a), r = n && !isNaN(parseFloat(n.state)) ? parseFloat(n.state) : void 0;
      return o`
              <div class="section-box">
                <div class="section-header">
                  <div style="display: flex; align-items: center; gap: 8px;">
                    <span class="badge badge-amber">${a}</span>
                    <span class="chip">Range: [${i.range[0]}, ${i.range[1]}]</span>
                    ${i.unit_of_measurement ? o`<span class="chip">${i.unit_of_measurement}</span>` : ""}
                  </div>
                  ${e ? "" : o`
                        <button class="btn btn-danger btn-icon" @click=${() => this._removeOutput(a)} title="Delete Output">
                          ✕
                        </button>
                      `}
                </div>

                <div class="grid-3">
                  <div class="form-group">
                    <label class="form-label">Range Min</label>
                    <input
                      class="input-text"
                      type="number"
                      .value=${String(i.range[0])}
                      ?disabled=${e}
                      @input=${(l) => {
        i.range[0] = parseFloat(l.target.value), this.requestUpdate();
      }}
                    />
                  </div>
                  <div class="form-group">
                    <label class="form-label">Range Max</label>
                    <input
                      class="input-text"
                      type="number"
                      .value=${String(i.range[1])}
                      ?disabled=${e}
                      @input=${(l) => {
        i.range[1] = parseFloat(l.target.value), this.requestUpdate();
      }}
                    />
                  </div>
                  <div class="form-group">
                    <label class="form-label">Output Epsilon Deadband</label>
                    <input
                      class="input-text"
                      type="number"
                      step="0.001"
                      placeholder="Inherit system default"
                      .value=${i.epsilon !== void 0 ? String(i.epsilon) : ""}
                      ?disabled=${e}
                      @input=${(l) => {
        const d = l.target.value.trim();
        i.epsilon = d ? parseFloat(d) : void 0, this.requestUpdate();
      }}
                    />
                  </div>
                </div>

                <div style="margin-top: 14px;">
                  <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
                    <span class="form-label" style="margin: 0;">Output Membership Curves Preview</span>
                    ${r !== void 0 ? o`<span class="chip" style="color: #34d399;">Live Sensor Output: ${r}${i.unit_of_measurement ? ` ${i.unit_of_measurement}` : ""}</span>` : ""}
                  </div>
                  <fuzzy-curve-canvas
                    .range=${i.range}
                    .terms=${i.terms || {}}
                    .currentValue=${r}
                    .unit=${i.unit_of_measurement || ""}
                  ></fuzzy-curve-canvas>
                </div>

                ${this._renderTermsEditor(i.terms, i.range, e, () => this.requestUpdate())}
              </div>
            `;
    })}
    `;
  }
  _renderTermsEditor(e, t, s, a) {
    const i = Object.keys(e || {});
    return o`
      <div style="margin-top: 16px; padding-top: 12px; border-top: 1px solid rgba(255, 255, 255, 0.08);">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
          <span class="form-label" style="margin: 0; font-size: 13px;">Linguistic Membership Terms</span>
          ${s ? "" : o`
                <button
                  class="btn btn-secondary"
                  style="font-size: 12px; padding: 4px 10px;"
                  @click=${() => {
      const n = `term_${i.length + 1}`, r = (t[0] + t[1]) / 2, l = t[1] - t[0] || 10;
      e[n] = {
        type: "trimf",
        params: [r - l * 0.25, r, r + l * 0.25]
      }, a();
    }}
                >
                  + Add Term
                </button>
              `}
        </div>

        <div style="display: flex; flex-direction: column; gap: 8px;">
          ${i.map((n) => {
      const r = e[n];
      return o`
              <div
                style="display: flex; align-items: center; gap: 10px; background: rgba(0, 0, 0, 0.25); padding: 8px 12px; border-radius: var(--fuzzy-radius-md); border: 1px solid rgba(255, 255, 255, 0.04); flex-wrap: wrap;"
              >
                <div style="min-width: 110px;">
                  <strong style="color: var(--fuzzy-text); font-size: 13px;">${n}</strong>
                </div>

                <div style="width: 120px;">
                  <select
                    class="select-input"
                    style="padding: 4px 8px; font-size: 12px;"
                    .value=${r.type || "trimf"}
                    ?disabled=${s}
                    @change=${(l) => {
        r.type = l.target.value, a();
      }}
                  >
                    <option value="trimf">trimf (a, b, c)</option>
                    <option value="trapmf">trapmf (a, b, c, d)</option>
                    <option value="gaussmf">gaussmf (mean, sigma)</option>
                    <option value="sigmf">sigmf (b, c)</option>
                    <option value="gbellmf">gbellmf (a, b, c)</option>
                    <option value="constant">constant (value)</option>
                    <option value="singleton">singleton (value)</option>
                  </select>
                </div>

                <div style="flex: 1; min-width: 180px;">
                  <input
                    class="input-text"
                    style="padding: 4px 8px; font-size: 12px; font-family: monospace;"
                    type="text"
                    .value=${Array.isArray(r.params) ? r.params.join(", ") : ""}
                    placeholder="e.g. 18, 21, 24"
                    ?disabled=${s}
                    @input=${(l) => {
        const d = l.target.value.split(",").map((p) => parseFloat(p.trim()));
        d.every((p) => !isNaN(p)) && (r.params = d, a());
      }}
                  />
                </div>

                ${s ? "" : o`
                      <button
                        class="btn btn-danger btn-icon"
                        style="width: 26px; height: 26px; padding: 0;"
                        title="Delete Term"
                        @click=${() => {
        delete e[n], a();
      }}
                      >
                        ✕
                      </button>
                    `}
              </div>
            `;
    })}
        </div>
      </div>
    `;
  }
  _renderSimulationTab() {
    const e = this._config.inputs || {}, t = this._config.outputs || {}, s = Object.keys(e), a = Object.keys(t);
    return o`
      <div style="margin-bottom: 20px;">
        <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px; margin-bottom: 16px;">
          <div>
            <h3 class="section-title">🧪 Live Simulation & Inference Workbench</h3>
            <p class="helper-text">
              Test your fuzzy controller interactively. Adjust antecedent sliders to observe rule activations, aggregated fuzzy set distributions, and crisp defuzzified outputs in real time.
            </p>
          </div>
          <div style="display: flex; gap: 8px;">
            <button class="btn btn-secondary" @click=${this._syncSimWithLiveHass} title="Read current sensor entity states from Home Assistant into simulation sliders">
              ⚡ Sync Live Sensor Values
            </button>
            <button class="btn btn-primary" @click=${this._runSimulation} ?disabled=${this._simulating}>
              ${this._simulating ? "Simulating..." : "🔄 Re-run Simulation"}
            </button>
          </div>
        </div>

        ${this._simError ? o`<div style="color: var(--fuzzy-danger); margin-bottom: 16px;">Simulation Error: ${this._simError}</div>` : ""}

        <div class="grid-2" style="gap: 24px; align-items: start;">
          <!-- Left: Antecedent Sliders -->
          <div>
            <h4 style="font-size: 14px; font-weight: 700; color: #38bdf8; margin-bottom: 12px; text-transform: uppercase; letter-spacing: 0.05em;">
              📥 Antecedents (Input Values)
            </h4>

            ${s.length === 0 ? o`<p class="subtitle">No input variables defined yet.</p>` : s.map((i) => {
      const n = e[i], r = n.range[0], l = n.range[1], d = (l - r) / 100 || 1, p = this._simInputs[i] ?? r;
      return o`
                    <div class="section-box" style="margin-bottom: 14px; padding: 14px;">
                      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                        <div>
                          <strong style="color: var(--fuzzy-text); font-size: 14px;">${i}</strong>
                          ${n.entity_id ? o`<span class="helper-text" style="margin-left: 6px;">(${n.entity_id})</span>` : ""}
                        </div>
                        <span class="badge badge-cyan" style="font-size: 13px; font-weight: 700;">
                          ${typeof p == "number" ? p.toFixed(2) : p}
                        </span>
                      </div>

                      <div style="display: flex; align-items: center; gap: 12px;">
                        <input
                          type="range"
                          style="flex: 1; accent-color: #38bdf8; cursor: pointer;"
                          min=${r}
                          max=${l}
                          step=${d}
                          .value=${String(p)}
                          @input=${(c) => this._onSimInputChange(i, parseFloat(c.target.value))}
                        />
                        <input
                          class="input-text"
                          type="number"
                          style="width: 80px; padding: 4px 8px; font-size: 12px;"
                          min=${r}
                          max=${l}
                          step=${d}
                          .value=${String(p)}
                          @input=${(c) => this._onSimInputChange(i, parseFloat(c.target.value))}
                        />
                      </div>

                      <!-- Real-time term membership degrees -->
                      <div style="display: flex; gap: 6px; flex-wrap: wrap; margin-top: 10px;">
                        ${Object.keys(n.terms || {}).map((c) => {
        const u = n.terms[c], h = Pt(u.type, u.params, p, l - r), f = h > 0.01;
        return o`
                            <span
                              class="chip"
                              style="${f ? "background: rgba(56, 189, 248, 0.2); border-color: rgba(56, 189, 248, 0.4); color: #38bdf8;" : "opacity: 0.5;"}"
                            >
                              ${c}: <strong>${h.toFixed(2)}</strong>
                            </span>
                          `;
      })}
                      </div>
                    </div>
                  `;
    })}
          </div>

          <!-- Right: Output Waveforms & Defuzzification -->
          <div>
            <h4 style="font-size: 14px; font-weight: 700; color: #fbbf24; margin-bottom: 12px; text-transform: uppercase; letter-spacing: 0.05em;">
              📤 Consequents & Distribution Waveforms
            </h4>

            ${a.length === 0 ? o`<p class="subtitle">No output variables defined yet.</p>` : a.map((i) => {
      const n = t[i], r = this._simResults ? this._simResults[i] : null, l = n.unit_of_measurement || "", d = this._config.inference === "mamdani";
      return o`
                    <div class="section-box" style="margin-bottom: 16px; padding: 14px;">
                      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; flex-wrap: wrap; gap: 8px;">
                        <div>
                          <strong style="font-size: 15px; color: var(--fuzzy-text);">${i}</strong>
                          <span class="chip" style="margin-left: 8px;">Range: [${n.range[0]}, ${n.range[1]}]</span>
                        </div>
                        <div style="display: flex; align-items: center; gap: 8px;">
                          ${r?.dominant_term ? o`<span class="badge badge-amber">Dominant: ${r.dominant_term}</span>` : ""}
                          <span class="badge badge-emerald" style="font-size: 14px; font-weight: 700;">
                            ${r?.defuzzified_value !== void 0 && r?.defuzzified_value !== null ? `${r.defuzzified_value.toFixed(2)}${l ? ` ${l}` : ""}` : "N/A"}
                          </span>
                        </div>
                      </div>

                      ${d && r?.universe && r.universe.length > 0 ? o`
                            <fuzzy-aggregated-graph
                              .universe=${r.universe}
                              .aggregatedSet=${r.aggregated_set || []}
                              .defuzzifiedValue=${r.defuzzified_value}
                              .defuzzifier=${n.defuzzifier || this._config.defuzzifier || "cog"}
                              .dominantTerm=${r.dominant_term || ""}
                              .unit=${l}
                              .outputName=${i}
                            ></fuzzy-aggregated-graph>
                          ` : d ? o`
                              <div style="background: rgba(0,0,0,0.3); border-radius: 8px; padding: 16px; text-align: center; color: var(--fuzzy-text-secondary); font-size: 12px;">
                                Awaiting simulation results...
                              </div>
                            ` : o`
                              <!-- Sugeno singleton activations preview -->
                              <div style="background: rgba(0,0,0,0.3); border-radius: 8px; padding: 14px; border: 1px solid rgba(255,255,255,0.06);">
                                <div style="font-size: 11px; font-weight: 700; color: #fbbf24; text-transform: uppercase; margin-bottom: 8px;">
                                  ⚡ Sugeno Crisp Singleton Weighting (${this._config.defuzzifier || "weighted_average"})
                                </div>
                                <div style="font-size: 13px; color: var(--fuzzy-text);">
                                  Weighted Output: <strong>${r?.defuzzified_value !== void 0 ? r.defuzzified_value.toFixed(2) : "0.00"}${l ? ` ${l}` : ""}</strong>
                                </div>
                              </div>
                            `}

                      <!-- Term activations chips -->
                      ${r?.term_activations ? o`
                            <div style="display: flex; gap: 6px; flex-wrap: wrap; margin-top: 10px;">
                              ${Object.entries(r.term_activations).map(([p, c]) => {
        const u = c > 0.01;
        return o`
                                  <span
                                    class="chip"
                                    style="${u ? "background: rgba(16, 185, 129, 0.2); border-color: rgba(16, 185, 129, 0.4); color: #34d399;" : "opacity: 0.6; color: #94a3b8;"}"
                                  >
                                    ${p === "false" || p === !1 ? "off" : p}: <strong>${c.toFixed(2)}</strong>
                                  </span>
                                `;
      })}
                            </div>
                          ` : ""}
                    </div>
                  `;
    })}
          </div>
        </div>

        <!-- Rule Firing Breakdown -->
        <div class="section-box" style="margin-top: 20px; padding: 18px;">
          <h4 style="font-size: 14px; font-weight: 700; color: var(--fuzzy-text); margin-bottom: 12px;">
            📜 Rule Firings & Strengths
          </h4>

          ${!this._simResults || Object.keys(this._simResults).length === 0 ? o`<p class="subtitle">Run simulation to inspect rule firings.</p>` : o`
                <div style="display: flex; flex-direction: column; gap: 8px;">
                  ${(() => {
      const i = a[0], n = this._simResults[i]?.rule_strengths || [];
      return n.length === 0 ? o`<p class="subtitle">No rules fired or defined.</p>` : n.map((r) => {
        const l = r.firing_strength || 0, d = l > 0.01;
        return o`
                        <div
                          style="display: flex; align-items: center; gap: 12px; background: ${d ? "rgba(56, 189, 248, 0.08)" : "rgba(15, 23, 42, 0.5)"}; padding: 10px 14px; border-radius: var(--fuzzy-radius-md); border: 1px solid ${d ? "rgba(56, 189, 248, 0.35)" : "rgba(255, 255, 255, 0.08)"};"
                        >
                          <div style="font-family: monospace; font-size: 12px; flex: 1; color: ${d ? "#f8fafc" : "#cbd5e1"}; font-weight: ${d ? "600" : "400"};">
                            ${r.rule}
                          </div>
                          <div style="width: 140px; display: flex; align-items: center; gap: 8px;">
                            <div style="flex: 1; height: 6px; background: rgba(255,255,255,0.1); border-radius: 3px; overflow: hidden;">
                              <div
                                style="width: ${Math.round(l * 100)}%; height: 100%; background: ${d ? "linear-gradient(90deg, #0284c7, #38bdf8)" : "#475569"}; border-radius: 3px;"
                              ></div>
                            </div>
                            <span style="font-size: 11px; font-weight: 700; font-family: monospace; color: ${d ? "#38bdf8" : "#94a3b8"}; width: 34px; text-align: right;">
                              ${l.toFixed(2)}
                            </span>
                          </div>
                        </div>
                      `;
      });
    })()}
                </div>
              `}
        </div>
      </div>
    `;
  }
  _renderRulesTab(e) {
    const t = this._config.rules || [];
    return o`
      <div
        style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; flex-wrap: wrap; gap: 12px;"
      >
        <div>
          <h3 class="section-title">Linguistic Rules</h3>
          <p class="helper-text">
            Declarative IF &lt;antecedents&gt; THEN &lt;consequents&gt; with AND, OR, NOT and linguistic hedges
          </p>
        </div>
        ${e ? "" : o`
              <div style="display: flex; gap: 8px; align-items: center; flex-wrap: wrap;">
                <div
                  style="display: inline-flex; background: rgba(255, 255, 255, 0.05); border-radius: var(--fuzzy-radius-md); padding: 2px; border: 1px solid var(--fuzzy-card-border);"
                >
                  <button
                    class="btn ${this._rulesViewMode === "visual" ? "btn-primary" : "btn-secondary"}"
                    style="padding: 6px 12px; font-size: 12px;"
                    @click=${() => {
      this._rulesViewMode = "visual", this.requestUpdate();
    }}
                  >
                    🎨 Visual Cards
                  </button>
                  <button
                    class="btn ${this._rulesViewMode === "text" ? "btn-primary" : "btn-secondary"}"
                    style="padding: 6px 12px; font-size: 12px;"
                    @click=${() => {
      this._rulesViewMode = "text", this.requestUpdate();
    }}
                  >
                    📝 Raw Text
                  </button>
                </div>
                <button class="btn btn-primary" @click=${this._openAddRuleBuilder}>
                  ✨ + Rule Builder
                </button>
                <button
                  class="btn btn-secondary"
                  @click=${this._addRule}
                  title="Add empty rule string to type manually"
                >
                  + Quick Text
                </button>
              </div>
            `}
      </div>

      ${t.length === 0 ? o`
            <div
              style="text-align: center; padding: 40px 20px; background: rgba(15, 23, 42, 0.3); border-radius: var(--fuzzy-radius-md); border: 1px dashed var(--fuzzy-card-border);"
            >
              <div style="font-size: 28px; margin-bottom: 8px;">📜</div>
              <h4 style="font-weight: 600; margin-bottom: 6px;">No Inference Rules Defined Yet</h4>
              <p class="helper-text" style="margin-bottom: 18px;">
                Rules map your input linguistic terms (e.g. temperature IS hot) to output targets (e.g. fan_speed IS fast).
              </p>
              ${e ? "" : o`
                    <button class="btn btn-primary" @click=${this._openAddRuleBuilder}>
                      ✨ Create First Rule with Builder
                    </button>
                  `}
            </div>
          ` : this._rulesViewMode === "visual" ? t.map((s, a) => {
      const i = this._parseRuleToBuilder(s);
      return i ? o`
              <div class="rule-card">
                <div style="display: flex; flex-direction: column; gap: 8px; flex: 1;">
                  <div style="display: flex; align-items: center; gap: 6px; flex-wrap: wrap;">
                    <span class="badge badge-purple" style="width: 24px; justify-content: center;">${a + 1}</span>
                    <span class="badge badge-cyan">IF</span>
                    ${i.conditions.map(
        (n, r) => o`
                        ${r > 0 ? o`<span class="badge badge-purple">${n.connector}</span>` : ""}
                        <span class="chip" style="font-weight: 600; color: #38bdf8; background: rgba(56, 189, 248, 0.1);">
                          ${n.variable}
                        </span>
                        <span class="chip" style="color: #94a3b8;">
                          ${n.hedge ? `is ${n.hedge}` : "is"}
                        </span>
                        <span class="chip" style="font-weight: 600; color: #34d399; background: rgba(52, 211, 153, 0.1);">
                          ${n.term}
                        </span>
                      `
      )}
                    <span class="badge badge-amber">THEN</span>
                    <span class="chip" style="font-weight: 600; color: #fbbf24; background: rgba(245, 158, 11, 0.1);">
                      ${i.consequent.variable}
                    </span>
                    <span class="chip" style="color: #94a3b8;">is</span>
                    <span class="chip" style="font-weight: 600; color: #34d399; background: rgba(52, 211, 153, 0.1);">
                      ${i.consequent.isConstant ? i.consequent.constantValue : i.consequent.term}
                    </span>
                  </div>
                  <div style="font-family: monospace; font-size: 11px; color: var(--fuzzy-text-secondary); padding-left: 32px;">
                    ${s}
                  </div>
                </div>

                ${e ? "" : o`
                      <div style="display: flex; gap: 8px; align-items: center;">
                        <button
                          class="btn btn-secondary"
                          style="padding: 6px 12px; font-size: 12px;"
                          @click=${() => this._openEditRuleBuilder(a)}
                          title="Edit in Visual Builder"
                        >
                          ✏️ Edit
                        </button>
                        <button
                          class="btn btn-danger btn-icon"
                          @click=${() => this._removeRule(a)}
                          title="Delete Rule"
                        >
                          ✕
                        </button>
                      </div>
                    `}
              </div>
            ` : o`
                <div class="rule-card">
                  <div style="display: flex; align-items: center; gap: 10px; flex: 1;">
                    <span class="badge badge-purple" style="width: 24px; justify-content: center;">${a + 1}</span>
                    <span style="font-family: monospace; font-size: 13px;">${s}</span>
                  </div>
                  ${e ? "" : o`
                        <div style="display: flex; gap: 8px; align-items: center;">
                          <button
                            class="btn btn-secondary"
                            style="padding: 6px 12px; font-size: 12px;"
                            @click=${() => this._openEditRuleBuilder(a)}
                          >
                            ✏️ Builder
                          </button>
                          <button
                            class="btn btn-danger btn-icon"
                            @click=${() => this._removeRule(a)}
                            title="Delete Rule"
                          >
                            ✕
                          </button>
                        </div>
                      `}
                </div>
              `;
    }) : t.map(
      (s, a) => o`
              <div class="rule-item">
                <span class="badge badge-purple" style="width: 24px; justify-content: center;">${a + 1}</span>
                <input
                  class="input-text rule-input"
                  type="text"
                  .value=${s}
                  ?disabled=${e}
                  @input=${(i) => this._updateRule(a, i.target.value)}
                />
                ${e ? "" : o`
                      <button
                        class="btn btn-secondary"
                        style="padding: 6px 10px; font-size: 12px;"
                        @click=${() => this._openEditRuleBuilder(a)}
                        title="Edit in Visual Builder"
                      >
                        ✏️
                      </button>
                      <button
                        class="btn btn-danger btn-icon"
                        @click=${() => this._removeRule(a)}
                        title="Delete Rule"
                      >
                        ✕
                      </button>
                    `}
              </div>
            `
    )}
    `;
  }
  _renderRuleBuilderModal() {
    const e = Object.keys(this._config.inputs || {}), t = Object.keys(this._config.outputs || {});
    return o`
      <div
        class="modal-overlay"
        @click=${(s) => {
      s.target.classList.contains("modal-overlay") && (this._showRuleBuilderModal = !1);
    }}
      >
        <div class="modal-content" style="max-width: 780px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 18px;">
            <h2 style="font-size: 20px; font-weight: 700; display: flex; align-items: center; gap: 8px;">
              <span>🪄</span>
              <span>${this._editingRuleIndex >= 0 ? `Edit Rule #${this._editingRuleIndex + 1}` : "Add Rule (Visual Builder)"}</span>
            </h2>
            <button
              class="btn btn-icon"
              @click=${() => this._showRuleBuilderModal = !1}
              title="Close"
            >
              ✕
            </button>
          </div>

          <div
            style="background: rgba(2, 132, 199, 0.1); border: 1px solid rgba(2, 132, 199, 0.25); border-radius: var(--fuzzy-radius-md); padding: 12px 16px; margin-bottom: 20px; font-size: 13px; line-height: 1.5;"
          >
            <div style="font-weight: 600; color: #38bdf8; margin-bottom: 2px;">
              💡 Guided Linguistic Rule Builder
            </div>
            <div style="color: var(--fuzzy-text-secondary);">
              Configure linguistic clauses using dropdown controls. Variables and terms are automatically populated from your system definition.
            </div>
          </div>

          ${this._ruleBuilderError ? o`<div style="color: var(--fuzzy-danger); margin-bottom: 14px; font-size: 13px;">${this._ruleBuilderError}</div>` : ""}

          <!-- Antecedents (IF) -->
          <div
            class="section-box"
            style="background: rgba(14, 165, 233, 0.05); border: 1px solid rgba(14, 165, 233, 0.25); padding: 18px; margin-bottom: 18px; border-radius: var(--fuzzy-radius-md);"
          >
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px;">
              <span style="font-weight: 700; color: #38bdf8; font-size: 14px; text-transform: uppercase; letter-spacing: 0.05em;">
                🔹 IF (Antecedent Conditions)
              </span>
              <button
                class="btn btn-secondary"
                style="padding: 6px 12px; font-size: 12px;"
                @click=${() => this._addBuilderCondition("AND")}
              >
                + Add Condition (AND)
              </button>
            </div>

            ${this._builderConditions.map((s, a) => {
      const i = Object.keys(this._config.inputs[s.variable]?.terms || {});
      return o`
                <div class="builder-row">
                  ${a > 0 ? o`
                        <select
                          class="input-select"
                          style="width: 85px; font-weight: 700; color: #c084fc; border-color: rgba(168, 85, 247, 0.4);"
                          .value=${s.connector}
                          @change=${(n) => {
        s.connector = n.target.value, this.requestUpdate();
      }}
                        >
                          <option value="AND">AND</option>
                          <option value="OR">OR</option>
                        </select>
                      ` : o`<span class="badge badge-cyan" style="width: 70px; justify-content: center;">IF</span>`}

                  <!-- Input Variable -->
                  <select
                    class="input-select"
                    style="flex: 1; min-width: 140px; font-weight: 600;"
                    .value=${s.variable}
                    @change=${(n) => this._onBuilderConditionVarChange(a, n.target.value)}
                  >
                    ${e.map((n) => o`<option value=${n}>${n}</option>`)}
                  </select>

                  <!-- Hedge -->
                  <select
                    class="input-select"
                    style="width: 130px;"
                    .value=${s.hedge}
                    @change=${(n) => {
        s.hedge = n.target.value, this.requestUpdate();
      }}
                  >
                    <option value="">IS</option>
                    <option value="not">IS NOT</option>
                    <option value="very">IS VERY</option>
                    <option value="somewhat">IS SOMEWHAT</option>
                    <option value="extremely">IS EXTREMELY</option>
                    <option value="slightly">IS SLIGHTLY</option>
                  </select>

                  <!-- Linguistic Term -->
                  <select
                    class="input-select"
                    style="flex: 1; min-width: 120px; font-weight: 600; color: #34d399;"
                    .value=${s.term}
                    @change=${(n) => {
        s.term = n.target.value, this.requestUpdate();
      }}
                  >
                    ${i.map((n) => o`<option value=${n}>${n}</option>`)}
                  </select>

                  ${this._builderConditions.length > 1 ? o`
                        <button
                          class="btn btn-danger btn-icon"
                          title="Remove Condition"
                          @click=${() => this._removeBuilderCondition(a)}
                        >
                          ✕
                        </button>
                      ` : ""}
                </div>
              `;
    })}
          </div>

          <!-- Consequent (THEN) -->
          <div
            class="section-box"
            style="background: rgba(245, 158, 11, 0.05); border: 1px solid rgba(245, 158, 11, 0.25); padding: 18px; margin-bottom: 20px; border-radius: var(--fuzzy-radius-md);"
          >
            <div style="font-weight: 700; color: #fbbf24; font-size: 14px; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 14px;">
              🔸 THEN (Consequent Action)
            </div>

            <div class="builder-row">
              <span class="badge badge-amber" style="width: 70px; justify-content: center;">THEN</span>

              <!-- Output Variable -->
              <select
                class="input-select"
                style="flex: 1; min-width: 150px; font-weight: 600;"
                .value=${this._builderConsequent.variable}
                @change=${(s) => this._onBuilderConsequentVarChange(s.target.value)}
              >
                ${t.map((s) => o`<option value=${s}>${s}</option>`)}
              </select>

              <span style="font-size: 13px; font-weight: 700; color: var(--fuzzy-text-secondary);">IS</span>

              ${this._builderConsequent.isConstant ? o`
                    <input
                      class="input-text"
                      style="flex: 1; min-width: 120px;"
                      type="number"
                      step="any"
                      .value=${String(this._builderConsequent.constantValue)}
                      @input=${(s) => {
      this._builderConsequent.constantValue = parseFloat(s.target.value), this.requestUpdate();
    }}
                    />
                  ` : o`
                    <select
                      class="input-select"
                      style="flex: 1; min-width: 120px; font-weight: 600; color: #34d399;"
                      .value=${this._builderConsequent.term}
                      @change=${(s) => {
      this._builderConsequent.term = s.target.value, this.requestUpdate();
    }}
                    >
                      ${Object.keys(
      this._config.outputs[this._builderConsequent.variable]?.terms || {}
    ).map((s) => o`<option value=${s}>${s}</option>`)}
                    </select>
                  `}

              ${this._config.inference === "sugeno" ? o`
                    <label class="checkbox-label" style="font-size: 12px; margin-left: 8px;">
                      <input
                        type="checkbox"
                        .checked=${this._builderConsequent.isConstant}
                        @change=${(s) => {
      this._builderConsequent.isConstant = s.target.checked, this.requestUpdate();
    }}
                      />
                      Numeric Constant
                    </label>
                  ` : ""}
            </div>
          </div>

          <!-- Live Preview -->
          <div
            style="background: #020617; border: 1px solid rgba(56, 189, 248, 0.4); border-radius: var(--fuzzy-radius-md); padding: 14px 18px; margin-bottom: 24px;"
          >
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
              <span style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.05em; color: var(--fuzzy-text-secondary); font-weight: 600;">
                Live Linguistic Rule Preview
              </span>
              <span class="badge badge-emerald" style="font-size: 10px;">✓ Canonical Syntax</span>
            </div>
            <div style="font-family: monospace; font-size: 14px; color: #e2e8f0; word-break: break-all;">
              ${this._compileRuleString(this._builderConditions, this._builderConsequent)}
            </div>
          </div>

          <!-- Action Buttons -->
          <div style="display: flex; justify-content: flex-end; gap: 12px;">
            <button class="btn btn-secondary" @click=${() => this._showRuleBuilderModal = !1}>
              Cancel
            </button>
            <button class="btn btn-primary" @click=${this._saveBuilderRule}>
              ${this._editingRuleIndex >= 0 ? "Update Rule" : "+ Add Rule to System"}
            </button>
          </div>
        </div>
      </div>
    `;
  }
  _renderRawTab(e) {
    return o`
      <div class="form-group">
        <label class="form-label">Full Configuration JSON</label>
        <textarea
          class="input-textarea"
          rows="16"
          style="font-family: monospace; font-size: 13px;"
          .value=${this._rawJson}
          ?disabled=${e}
          @input=${(t) => this._rawJson = t.target.value}
        ></textarea>
        <div class="helper-text">You can directly copy, edit, or paste your entire controller definition here.</div>
      </div>
    `;
  }
};
m.styles = [
  ct,
  R`
      .tabs {
        display: flex;
        gap: 8px;
        margin-bottom: 24px;
        border-bottom: 1px solid var(--fuzzy-card-border);
        padding-bottom: 8px;
        overflow-x: auto;
      }

      .tab-btn {
        background: transparent;
        border: none;
        color: var(--fuzzy-text-secondary);
        font-size: 14px;
        font-weight: 600;
        padding: 8px 16px;
        border-radius: var(--fuzzy-radius-md);
        cursor: pointer;
        transition: all 0.2s ease;
      }

      .tab-btn:hover {
        background: rgba(255, 255, 255, 0.05);
        color: var(--fuzzy-text);
      }

      .tab-btn.active {
        background: rgba(2, 132, 199, 0.15);
        color: #38bdf8;
        border-bottom: 2px solid var(--fuzzy-primary);
      }

      .header-actions {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 24px;
        flex-wrap: wrap;
        gap: 16px;
      }

      .grid-2 {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
        gap: 20px;
      }

      .grid-3 {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 16px;
      }

      .section-box {
        background: rgba(15, 23, 42, 0.5);
        border: 1px solid var(--fuzzy-card-border);
        border-radius: var(--fuzzy-radius-md);
        padding: 18px;
        margin-bottom: 16px;
      }

      .section-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 14px;
      }

      .section-title {
        font-size: 16px;
        font-weight: 600;
        color: var(--fuzzy-text);
      }

      .rule-item {
        display: flex;
        align-items: center;
        gap: 12px;
        margin-bottom: 10px;
      }

      .rule-input {
        font-family: monospace;
        font-size: 13px;
        flex: 1;
      }

      .rule-card {
        background: rgba(15, 23, 42, 0.45);
        border: 1px solid var(--fuzzy-card-border);
        border-radius: var(--fuzzy-radius-md);
        padding: 14px 18px;
        margin-bottom: 12px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 16px;
        flex-wrap: wrap;
        transition: all 0.2s ease;
      }

      .rule-card:hover {
        border-color: rgba(56, 189, 248, 0.3);
        background: rgba(15, 23, 42, 0.65);
      }

      .builder-row {
        display: flex;
        align-items: center;
        gap: 10px;
        margin-bottom: 10px;
        flex-wrap: wrap;
      }

      .yaml-banner {
        background: rgba(168, 85, 247, 0.12);
        border: 1px solid rgba(168, 85, 247, 0.3);
        color: #d8b4fe;
        padding: 12px 18px;
        border-radius: var(--fuzzy-radius-md);
        margin-bottom: 20px;
        font-size: 13px;
        display: flex;
        align-items: center;
        gap: 10px;
      }

      .checkbox-label {
        display: flex;
        align-items: center;
        gap: 10px;
        font-size: 14px;
        cursor: pointer;
        user-select: none;
      }

      .checkbox-label input[type="checkbox"] {
        accent-color: var(--fuzzy-primary);
        width: 18px;
        height: 18px;
        cursor: pointer;
      }

      .helper-text {
        font-size: 12px;
        color: var(--fuzzy-text-secondary);
        margin-top: 4px;
      }
    `
];
b([
  v({ attribute: !1 })
], m.prototype, "hass", 2);
b([
  v({ type: Object })
], m.prototype, "systemConfig", 2);
b([
  v({ type: String })
], m.prototype, "entryId", 2);
b([
  v({ type: String })
], m.prototype, "source", 2);
b([
  g()
], m.prototype, "_activeTab", 2);
b([
  g()
], m.prototype, "_config", 2);
b([
  g()
], m.prototype, "_rawJson", 2);
b([
  g()
], m.prototype, "_saving", 2);
b([
  g()
], m.prototype, "_error", 2);
b([
  g()
], m.prototype, "_successMsg", 2);
b([
  g()
], m.prototype, "_simInputs", 2);
b([
  g()
], m.prototype, "_simResults", 2);
b([
  g()
], m.prototype, "_simulating", 2);
b([
  g()
], m.prototype, "_simError", 2);
b([
  g()
], m.prototype, "_showAddInputModal", 2);
b([
  g()
], m.prototype, "_newInputEntityId", 2);
b([
  g()
], m.prototype, "_newInputVarName", 2);
b([
  g()
], m.prototype, "_newInputMin", 2);
b([
  g()
], m.prototype, "_newInputMax", 2);
b([
  g()
], m.prototype, "_newInputTermsPreset", 2);
b([
  g()
], m.prototype, "_newInputModalError", 2);
b([
  g()
], m.prototype, "_showRuleBuilderModal", 2);
b([
  g()
], m.prototype, "_editingRuleIndex", 2);
b([
  g()
], m.prototype, "_builderConditions", 2);
b([
  g()
], m.prototype, "_builderConsequent", 2);
b([
  g()
], m.prototype, "_ruleBuilderError", 2);
b([
  g()
], m.prototype, "_rulesViewMode", 2);
m = b([
  L("fuzzy-system-editor")
], m);
var Ie = Object.defineProperty, Ce = Object.getOwnPropertyDescriptor, P = (e, t, s, a) => {
  for (var i = a > 1 ? void 0 : a ? Ce(t, s) : t, n = e.length - 1, r; n >= 0; n--)
    (r = e[n]) && (i = (a ? r(t, s, i) : r(i)) || i);
  return a && i && Ie(t, s, i), i;
};
let C = class extends z {
  constructor() {
    super(...arguments), this._templates = [], this._selectedTemplate = null, this._systemId = "", this._systemName = "", this._loading = !1, this._error = "";
  }
  async connectedCallback() {
    super.connectedCallback(), this.hass && await this._loadTemplates();
  }
  willUpdate(e) {
    e.has("hass") && this.hass && this._templates.length === 0 && !this._loading && this._loadTemplates();
  }
  async _loadTemplates() {
    if (this.hass) {
      this._loading = !0;
      try {
        this._templates = await be(this.hass);
      } catch (e) {
        this._error = e.message || "Failed to load templates";
      } finally {
        this._loading = !1;
      }
    }
  }
  _selectTemplate(e) {
    this._selectedTemplate = e, this._systemId = e.id, this._systemName = e.name, this._error = "";
  }
  async _handleInstantiate() {
    if (!this._selectedTemplate) return;
    const e = this._systemId.trim().toLowerCase().replace(/[^a-z0-9_]/g, "_");
    if (!e) {
      this._error = "Please provide a valid system identifier";
      return;
    }
    this._loading = !0, this._error = "";
    try {
      const t = await ye(
        this.hass,
        this._selectedTemplate.id,
        e,
        this._systemName.trim() || void 0
      );
      this.dispatchEvent(
        new CustomEvent("template-instantiated", {
          detail: { system: t.system },
          bubbles: !0,
          composed: !0
        })
      );
    } catch (t) {
      this._error = t.message || "Failed to instantiate template";
    } finally {
      this._loading = !1;
    }
  }
  _close() {
    this.dispatchEvent(new CustomEvent("close", { bubbles: !0, composed: !0 }));
  }
  render() {
    return o`
      <div class="modal-overlay" @click=${(e) => e.target === e.currentTarget && this._close()}>
        <div class="modal-content">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
            <div>
              <h2 class="title-lg">Choose a Template</h2>
              <p class="subtitle">Quickly scaffold a pre-engineered fuzzy logic controller</p>
            </div>
            <button class="btn btn-icon" @click=${this._close}>✕</button>
          </div>

          ${this._error ? o`<div style="color: var(--fuzzy-danger); font-size: 13px; margin-bottom: 12px;">${this._error}</div>` : ""}

          <div class="template-grid">
            ${this._templates.map(
      (e) => o`
                <div
                  class="template-card ${this._selectedTemplate?.id === e.id ? "selected" : ""}"
                  @click=${() => this._selectTemplate(e)}
                >
                  <div class="template-title">${e.name}</div>
                  <div class="template-desc">${e.description}</div>
                  <div class="template-meta">
                    <span class="badge ${e.inference === "sugeno" ? "badge-amber" : "badge-cyan"}">
                      ${e.inference}
                    </span>
                    <span class="chip">${e.input_count} in</span>
                    <span class="chip">${e.output_count} out</span>
                    <span class="chip">${e.rule_count} rules</span>
                  </div>
                </div>
              `
    )}
          </div>

          ${this._selectedTemplate ? o`
                <div style="border-top: 1px solid var(--fuzzy-card-border); padding-top: 18px; margin-bottom: 18px;">
                  <div class="form-group">
                    <label class="form-label">System Identifier (slug)</label>
                    <input
                      class="input-text"
                      type="text"
                      .value=${this._systemId}
                      @input=${(e) => this._systemId = e.target.value}
                      placeholder="e.g. living_room_comfort"
                    />
                  </div>
                  <div class="form-group">
                    <label class="form-label">Friendly Name</label>
                    <input
                      class="input-text"
                      type="text"
                      .value=${this._systemName}
                      @input=${(e) => this._systemName = e.target.value}
                      placeholder="e.g. Living Room Comfort"
                    />
                  </div>
                </div>
              ` : ""}

          <div style="display: flex; justify-content: flex-end; gap: 10px;">
            <button class="btn btn-secondary" @click=${this._close}>Cancel</button>
            <button
              class="btn btn-primary"
              ?disabled=${!this._selectedTemplate || this._loading}
              @click=${this._handleInstantiate}
            >
              ${this._loading ? "Instantiating..." : "Use Template"}
            </button>
          </div>
        </div>
      </div>
    `;
  }
};
C.styles = [
  ct,
  R`
      .template-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
        gap: 16px;
        margin-top: 18px;
        margin-bottom: 24px;
      }

      .template-card {
        background: rgba(255, 255, 255, 0.03);
        border: 1px solid var(--fuzzy-card-border);
        border-radius: var(--fuzzy-radius-md);
        padding: 16px;
        cursor: pointer;
        transition: all 0.2s ease;
      }

      .template-card:hover {
        border-color: var(--fuzzy-primary);
        background: rgba(2, 132, 199, 0.08);
        transform: translateY(-2px);
      }

      .template-card.selected {
        border-color: var(--fuzzy-primary);
        background: rgba(2, 132, 199, 0.15);
        box-shadow: 0 0 0 2px var(--fuzzy-primary);
      }

      .template-title {
        font-weight: 600;
        font-size: 15px;
        color: var(--fuzzy-text);
        margin-bottom: 6px;
      }

      .template-desc {
        font-size: 12px;
        color: var(--fuzzy-text-secondary);
        line-height: 1.4;
        margin-bottom: 12px;
      }

      .template-meta {
        display: flex;
        gap: 6px;
        flex-wrap: wrap;
      }
    `
];
P([
  v({ attribute: !1 })
], C.prototype, "hass", 2);
P([
  g()
], C.prototype, "_templates", 2);
P([
  g()
], C.prototype, "_selectedTemplate", 2);
P([
  g()
], C.prototype, "_systemId", 2);
P([
  g()
], C.prototype, "_systemName", 2);
P([
  g()
], C.prototype, "_loading", 2);
P([
  g()
], C.prototype, "_error", 2);
C = P([
  L("fuzzy-template-modal")
], C);
var Ee = Object.defineProperty, Te = Object.getOwnPropertyDescriptor, vt = (e, t, s, a) => {
  for (var i = a > 1 ? void 0 : a ? Te(t, s) : t, n = e.length - 1, r; n >= 0; n--)
    (r = e[n]) && (i = (a ? r(t, s, i) : r(i)) || i);
  return a && i && Ee(t, s, i), i;
};
window.customCards = window.customCards || [];
window.customCards.some((e) => e.type === "fuzzy-system-card") || window.customCards.push({
  type: "fuzzy-system-card",
  name: "Fuzzy System Controller",
  description: "Display live fuzzy logic controller status, inputs, and real-time aggregated output distributions.",
  preview: !0,
  documentationURL: "https://github.com/dougransom/fuzzy_system"
});
let st = class extends z {
  constructor() {
    super(...arguments), this._config = {};
  }
  setConfig(e) {
    if (!e.system_id)
      throw new Error("Please define a 'system_id' for fuzzy-system-card (e.g. system_id: 'climate_controller').");
    this._config = e;
  }
  getCardSize() {
    return 4;
  }
  _findSensors() {
    if (!this.hass?.states || !this._config.system_id) return { outputs: [], status: null };
    const e = this._config.system_id.toLowerCase(), t = [];
    let s = null;
    for (const [a, i] of Object.entries(this.hass.states))
      if (a.startsWith("sensor.")) {
        if (a === `sensor.fuzzy_${e}_status`) {
          s = i;
          continue;
        }
        (a.startsWith(`sensor.fuzzy_${e}_`) || i.attributes?.system === this._config.system_id) && !a.endsWith("_set") && !a.endsWith("_status") && t.push({ entityId: a, stateObj: i });
      }
    return { outputs: t, status: s };
  }
  render() {
    if (!this.hass || !this._config.system_id)
      return o`<ha-card><p style="padding: 16px;">Configuring fuzzy-system-card...</p></ha-card>`;
    const { outputs: e } = this._findSensors(), t = this._config.system_id, s = this._config.title || `Fuzzy System: ${t}`, a = e[0], i = a?.stateObj?.attributes || {}, n = i.universe || [], r = i.aggregated_set || [], l = a?.stateObj?.state ? parseFloat(a.stateObj.state) : void 0, d = i.unit_of_measurement || "", p = i.defuzzifier || "cog", c = i.dominant_term || "", u = i.inputs || {}, h = i.rule_strengths || [];
    return o`
      <ha-card>
        <div class="card-header">
          <div class="title-group">
            <div class="card-icon">⚡</div>
            <div>
              <div class="card-title">${s}</div>
              <div class="card-subtitle">${t}</div>
            </div>
          </div>
          <div class="badge-status">
            <span class="pulse-dot"></span>
            <span>Active</span>
          </div>
        </div>

        ${Object.keys(u).length > 0 ? o`
              <div class="section-title">Live Inputs</div>
              <div class="inputs-grid">
                ${Object.entries(u).map(
      ([f, y]) => o`
                    <div class="metric-pill">
                      <span class="metric-label">${f}</span>
                      <span class="metric-val">${typeof y == "number" ? y.toFixed(1) : y}</span>
                    </div>
                  `
    )}
              </div>
            ` : ""}

        ${n.length > 0 ? o`
              <div class="section-title">Live Aggregated Output Set</div>
              <fuzzy-aggregated-graph
                .universe=${n}
                .aggregatedSet=${r}
                .defuzzifiedValue=${l}
                .defuzzifier=${p}
                .dominantTerm=${c}
                .unit=${d}
                .outputName=${a.entityId.replace(`sensor.fuzzy_${t}_`, "")}
              ></fuzzy-aggregated-graph>
            ` : o`
              <div class="section-title">Outputs</div>
              ${e.map(
      (f) => o`
                  <div class="metric-pill" style="margin-bottom: 6px;">
                    <span class="metric-label">${f.entityId}</span>
                    <span class="metric-val">${f.stateObj.state} ${f.stateObj.attributes?.unit_of_measurement || ""}</span>
                  </div>
                `
    )}
            `}

        ${h.length > 0 ? o`
              <div class="section-title">Active Rule Firing Strengths</div>
              ${h.slice(0, 4).map(
      (f, y) => o`
                  <div class="rule-bar-row">
                    <span style="font-size: 11px; width: 45px; color: var(--secondary-text-color);">R${y + 1}</span>
                    <div class="rule-progress-bg">
                      <div class="rule-progress-fill" style="width: ${(f.firing_strength * 100).toFixed(0)}%;"></div>
                    </div>
                    <span style="font-size: 11px; width: 35px; text-align: right; font-weight: 700; color: #38bdf8;">
                      ${f.firing_strength.toFixed(2)}
                    </span>
                  </div>
                `
    )}
            ` : ""}
      </ha-card>
    `;
  }
};
st.styles = R`
    :host {
      display: block;
    }

    ha-card {
      background: var(--ha-card-background, var(--card-background-color, #1e293b));
      border: 1px solid var(--ha-card-border-color, rgba(255, 255, 255, 0.08));
      border-radius: var(--ha-card-border-radius, 16px);
      box-shadow: var(--ha-card-box-shadow, 0 4px 20px rgba(0, 0, 0, 0.25));
      padding: 18px 20px;
      color: var(--primary-text-color, #f8fafc);
      font-family: var(--ha-font-family, sans-serif);
      box-sizing: border-box;
    }

    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 14px;
    }

    .title-group {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .card-icon {
      width: 36px;
      height: 36px;
      border-radius: 10px;
      background: linear-gradient(135deg, #0284c7 0%, #38bdf8 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 18px;
    }

    .card-title {
      font-size: 16px;
      font-weight: 700;
    }

    .card-subtitle {
      font-size: 12px;
      color: var(--secondary-text-color, #94a3b8);
      font-family: monospace;
    }

    .badge-status {
      display: inline-flex;
      align-items: center;
      gap: 5px;
      padding: 4px 10px;
      border-radius: 9999px;
      font-size: 11px;
      font-weight: 700;
      background: rgba(16, 185, 129, 0.15);
      border: 1px solid rgba(16, 185, 129, 0.35);
      color: #34d399;
    }

    .pulse-dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: #10b981;
      box-shadow: 0 0 6px #10b981;
    }

    .section-title {
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: var(--secondary-text-color, #94a3b8);
      margin-top: 14px;
      margin-bottom: 8px;
    }

    .inputs-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(130px, 1fr));
      gap: 8px;
      margin-bottom: 12px;
    }

    .metric-pill {
      background: rgba(255, 255, 255, 0.04);
      border: 1px solid rgba(255, 255, 255, 0.06);
      border-radius: 8px;
      padding: 8px 10px;
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    .metric-label {
      font-size: 11px;
      color: var(--secondary-text-color, #94a3b8);
    }

    .metric-val {
      font-size: 14px;
      font-weight: 700;
      color: #38bdf8;
    }

    .rule-bar-row {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 6px;
      font-size: 12px;
    }

    .rule-progress-bg {
      flex: 1;
      height: 6px;
      background: rgba(255, 255, 255, 0.06);
      border-radius: 3px;
      overflow: hidden;
    }

    .rule-progress-fill {
      height: 100%;
      background: linear-gradient(90deg, #0284c7, #38bdf8);
      border-radius: 3px;
      transition: width 0.3s ease;
    }
  `;
vt([
  v({ attribute: !1 })
], st.prototype, "hass", 2);
vt([
  g()
], st.prototype, "_config", 2);
st = vt([
  L("fuzzy-system-card")
], st);
var Me = Object.defineProperty, Oe = Object.getOwnPropertyDescriptor, T = (e, t, s, a) => {
  for (var i = a > 1 ? void 0 : a ? Oe(t, s) : t, n = e.length - 1, r; n >= 0; n--)
    (r = e[n]) && (i = (a ? r(t, s, i) : r(i)) || i);
  return a && i && Me(t, s, i), i;
};
let w = class extends z {
  constructor() {
    super(...arguments), this.narrow = !1, this._view = "catalog", this._selectedSource = "config_entry";
  }
  _handleCreateSystem() {
    this._selectedConfig = void 0, this._selectedEntryId = void 0, this._selectedSource = "config_entry", this._view = "editor";
  }
  _handleEditSystem(e) {
    this._selectedConfig = e.detail.config, this._selectedEntryId = e.detail.entryId, this._selectedSource = e.detail.source || (e.detail.entryId ? "config_entry" : "yaml"), this._view = "editor";
  }
  _handleSystemSaved() {
    this._view = "catalog";
    const e = this.shadowRoot?.querySelector("fuzzy-system-catalog");
    e && typeof e.refresh == "function" && e.refresh();
  }
  render() {
    return o`
      <header class="app-header">
        <div class="brand">
          <div class="brand-icon">⚡</div>
          <div>
            <div class="brand-title">Fuzzy System Control</div>
          </div>
        </div>

        <div class="nav-links">
          <span class="badge badge-cyan">v0.2.0 Phase 2</span>
        </div>
      </header>

      <main class="panel-content container">
        ${this._view === "catalog" ? o`
              <fuzzy-system-catalog
                .hass=${this.hass}
                @create-system=${this._handleCreateSystem}
                @edit-system=${this._handleEditSystem}
              ></fuzzy-system-catalog>
            ` : o`
              <fuzzy-system-editor
                .hass=${this.hass}
                .systemConfig=${this._selectedConfig}
                .entryId=${this._selectedEntryId}
                .source=${this._selectedSource}
                @back=${() => this._view = "catalog"}
                @system-saved=${this._handleSystemSaved}
              ></fuzzy-system-editor>
            `}
      </main>
    `;
  }
};
w.styles = [
  ct,
  R`
      :host {
        display: block;
        min-height: 100vh;
        background: var(--fuzzy-bg);
        color: var(--fuzzy-text);
      }

      .app-header {
        background: rgba(15, 23, 42, 0.8);
        border-bottom: 1px solid var(--fuzzy-card-border);
        backdrop-filter: blur(12px);
        -webkit-backdrop-filter: blur(12px);
        position: sticky;
        top: 0;
        z-index: 50;
        padding: 14px 24px;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      .brand {
        display: flex;
        align-items: center;
        gap: 12px;
      }

      .brand-icon {
        width: 32px;
        height: 32px;
        border-radius: 8px;
        background: linear-gradient(135deg, #0284c7 0%, #38bdf8 100%);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 18px;
        box-shadow: 0 4px 12px rgba(2, 132, 199, 0.4);
      }

      .brand-title {
        font-size: 18px;
        font-weight: 700;
        letter-spacing: -0.01em;
      }

      .nav-links {
        display: flex;
        align-items: center;
        gap: 12px;
      }

      .panel-content {
        padding-top: 10px;
        padding-bottom: 60px;
      }
    `
];
T([
  v({ attribute: !1 })
], w.prototype, "hass", 2);
T([
  v({ type: Boolean })
], w.prototype, "narrow", 2);
T([
  v({ type: Object })
], w.prototype, "route", 2);
T([
  v({ type: Object })
], w.prototype, "panel", 2);
T([
  g()
], w.prototype, "_view", 2);
T([
  g()
], w.prototype, "_selectedConfig", 2);
T([
  g()
], w.prototype, "_selectedEntryId", 2);
T([
  g()
], w.prototype, "_selectedSource", 2);
w = T([
  L("fuzzy-system-panel")
], w);
export {
  w as FuzzySystemPanel
};
