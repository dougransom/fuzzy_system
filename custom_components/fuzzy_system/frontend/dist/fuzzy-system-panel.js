/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const F = globalThis, Z = F.ShadowRoot && (F.ShadyCSS === void 0 || F.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, K = Symbol(), se = /* @__PURE__ */ new WeakMap();
let he = class {
  constructor(e, s, r) {
    if (this._$cssResult$ = !0, r !== K) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = e, this.t = s;
  }
  get styleSheet() {
    let e = this.o;
    const s = this.t;
    if (Z && e === void 0) {
      const r = s !== void 0 && s.length === 1;
      r && (e = se.get(s)), e === void 0 && ((this.o = e = new CSSStyleSheet()).replaceSync(this.cssText), r && se.set(s, e));
    }
    return e;
  }
  toString() {
    return this.cssText;
  }
};
const ye = (t) => new he(typeof t == "string" ? t : t + "", void 0, K), D = (t, ...e) => {
  const s = t.length === 1 ? t[0] : e.reduce((r, i, a) => r + ((n) => {
    if (n._$cssResult$ === !0) return n.cssText;
    if (typeof n == "number") return n;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + n + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(i) + t[a + 1], t[0]);
  return new he(s, t, K);
}, _e = (t, e) => {
  if (Z) t.adoptedStyleSheets = e.map((s) => s instanceof CSSStyleSheet ? s : s.styleSheet);
  else for (const s of e) {
    const r = document.createElement("style"), i = F.litNonce;
    i !== void 0 && r.setAttribute("nonce", i), r.textContent = s.cssText, t.appendChild(r);
  }
}, ie = Z ? (t) => t : (t) => t instanceof CSSStyleSheet ? ((e) => {
  let s = "";
  for (const r of e.cssRules) s += r.cssText;
  return ye(s);
})(t) : t;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const { is: ve, defineProperty: $e, getOwnPropertyDescriptor: xe, getOwnPropertyNames: ze, getOwnPropertySymbols: we, getPrototypeOf: Se } = Object, W = globalThis, re = W.trustedTypes, Ae = re ? re.emptyScript : "", Ee = W.reactiveElementPolyfillSupport, U = (t, e) => t, q = { toAttribute(t, e) {
  switch (e) {
    case Boolean:
      t = t ? Ae : null;
      break;
    case Object:
    case Array:
      t = t == null ? t : JSON.stringify(t);
  }
  return t;
}, fromAttribute(t, e) {
  let s = t;
  switch (e) {
    case Boolean:
      s = t !== null;
      break;
    case Number:
      s = t === null ? null : Number(t);
      break;
    case Object:
    case Array:
      try {
        s = JSON.parse(t);
      } catch {
        s = null;
      }
  }
  return s;
} }, X = (t, e) => !ve(t, e), ae = { attribute: !0, type: String, converter: q, reflect: !1, useDefault: !1, hasChanged: X };
Symbol.metadata ??= Symbol("metadata"), W.litPropertyMetadata ??= /* @__PURE__ */ new WeakMap();
let O = class extends HTMLElement {
  static addInitializer(e) {
    this._$Ei(), (this.l ??= []).push(e);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(e, s = ae) {
    if (s.state && (s.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(e) && ((s = Object.create(s)).wrapped = !0), this.elementProperties.set(e, s), !s.noAccessor) {
      const r = Symbol(), i = this.getPropertyDescriptor(e, r, s);
      i !== void 0 && $e(this.prototype, e, i);
    }
  }
  static getPropertyDescriptor(e, s, r) {
    const { get: i, set: a } = xe(this.prototype, e) ?? { get() {
      return this[s];
    }, set(n) {
      this[s] = n;
    } };
    return { get: i, set(n) {
      const d = i?.call(this);
      a?.call(this, n), this.requestUpdate(e, d, r);
    }, configurable: !0, enumerable: !0 };
  }
  static getPropertyOptions(e) {
    return this.elementProperties.get(e) ?? ae;
  }
  static _$Ei() {
    if (this.hasOwnProperty(U("elementProperties"))) return;
    const e = Se(this);
    e.finalize(), e.l !== void 0 && (this.l = [...e.l]), this.elementProperties = new Map(e.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(U("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(U("properties"))) {
      const s = this.properties, r = [...ze(s), ...we(s)];
      for (const i of r) this.createProperty(i, s[i]);
    }
    const e = this[Symbol.metadata];
    if (e !== null) {
      const s = litPropertyMetadata.get(e);
      if (s !== void 0) for (const [r, i] of s) this.elementProperties.set(r, i);
    }
    this._$Eh = /* @__PURE__ */ new Map();
    for (const [s, r] of this.elementProperties) {
      const i = this._$Eu(s, r);
      i !== void 0 && this._$Eh.set(i, s);
    }
    this.elementStyles = this.finalizeStyles(this.styles);
  }
  static finalizeStyles(e) {
    const s = [];
    if (Array.isArray(e)) {
      const r = new Set(e.flat(1 / 0).reverse());
      for (const i of r) s.unshift(ie(i));
    } else e !== void 0 && s.push(ie(e));
    return s;
  }
  static _$Eu(e, s) {
    const r = s.attribute;
    return r === !1 ? void 0 : typeof r == "string" ? r : typeof e == "string" ? e.toLowerCase() : void 0;
  }
  constructor() {
    super(), this._$Ep = void 0, this.isUpdatePending = !1, this.hasUpdated = !1, this._$Em = null, this._$Ev();
  }
  _$Ev() {
    this._$ES = new Promise((e) => this.enableUpdating = e), this._$AL = /* @__PURE__ */ new Map(), this._$E_(), this.requestUpdate(), this.constructor.l?.forEach((e) => e(this));
  }
  addController(e) {
    (this._$EO ??= /* @__PURE__ */ new Set()).add(e), this.renderRoot !== void 0 && this.isConnected && e.hostConnected?.();
  }
  removeController(e) {
    this._$EO?.delete(e);
  }
  _$E_() {
    const e = /* @__PURE__ */ new Map(), s = this.constructor.elementProperties;
    for (const r of s.keys()) this.hasOwnProperty(r) && (e.set(r, this[r]), delete this[r]);
    e.size > 0 && (this._$Ep = e);
  }
  createRenderRoot() {
    const e = this.shadowRoot ?? this.attachShadow(this.constructor.shadowRootOptions);
    return _e(e, this.constructor.elementStyles), e;
  }
  connectedCallback() {
    this.renderRoot ??= this.createRenderRoot(), this.enableUpdating(!0), this._$EO?.forEach((e) => e.hostConnected?.());
  }
  enableUpdating(e) {
  }
  disconnectedCallback() {
    this._$EO?.forEach((e) => e.hostDisconnected?.());
  }
  attributeChangedCallback(e, s, r) {
    this._$AK(e, r);
  }
  _$ET(e, s) {
    const r = this.constructor.elementProperties.get(e), i = this.constructor._$Eu(e, r);
    if (i !== void 0 && r.reflect === !0) {
      const a = (r.converter?.toAttribute !== void 0 ? r.converter : q).toAttribute(s, r.type);
      this._$Em = e, a == null ? this.removeAttribute(i) : this.setAttribute(i, a), this._$Em = null;
    }
  }
  _$AK(e, s) {
    const r = this.constructor, i = r._$Eh.get(e);
    if (i !== void 0 && this._$Em !== i) {
      const a = r.getPropertyOptions(i), n = typeof a.converter == "function" ? { fromAttribute: a.converter } : a.converter?.fromAttribute !== void 0 ? a.converter : q;
      this._$Em = i;
      const d = n.fromAttribute(s, a.type);
      this[i] = d ?? this._$Ej?.get(i) ?? d, this._$Em = null;
    }
  }
  requestUpdate(e, s, r, i = !1, a) {
    if (e !== void 0) {
      const n = this.constructor;
      if (i === !1 && (a = this[e]), r ??= n.getPropertyOptions(e), !((r.hasChanged ?? X)(a, s) || r.useDefault && r.reflect && a === this._$Ej?.get(e) && !this.hasAttribute(n._$Eu(e, r)))) return;
      this.C(e, s, r);
    }
    this.isUpdatePending === !1 && (this._$ES = this._$EP());
  }
  C(e, s, { useDefault: r, reflect: i, wrapped: a }, n) {
    r && !(this._$Ej ??= /* @__PURE__ */ new Map()).has(e) && (this._$Ej.set(e, n ?? s ?? this[e]), a !== !0 || n !== void 0) || (this._$AL.has(e) || (this.hasUpdated || r || (s = void 0), this._$AL.set(e, s)), i === !0 && this._$Em !== e && (this._$Eq ??= /* @__PURE__ */ new Set()).add(e));
  }
  async _$EP() {
    this.isUpdatePending = !0;
    try {
      await this._$ES;
    } catch (s) {
      Promise.reject(s);
    }
    const e = this.scheduleUpdate();
    return e != null && await e, !this.isUpdatePending;
  }
  scheduleUpdate() {
    return this.performUpdate();
  }
  performUpdate() {
    if (!this.isUpdatePending) return;
    if (!this.hasUpdated) {
      if (this.renderRoot ??= this.createRenderRoot(), this._$Ep) {
        for (const [i, a] of this._$Ep) this[i] = a;
        this._$Ep = void 0;
      }
      const r = this.constructor.elementProperties;
      if (r.size > 0) for (const [i, a] of r) {
        const { wrapped: n } = a, d = this[i];
        n !== !0 || this._$AL.has(i) || d === void 0 || this.C(i, void 0, a, d);
      }
    }
    let e = !1;
    const s = this._$AL;
    try {
      e = this.shouldUpdate(s), e ? (this.willUpdate(s), this._$EO?.forEach((r) => r.hostUpdate?.()), this.update(s)) : this._$EM();
    } catch (r) {
      throw e = !1, this._$EM(), r;
    }
    e && this._$AE(s);
  }
  willUpdate(e) {
  }
  _$AE(e) {
    this._$EO?.forEach((s) => s.hostUpdated?.()), this.hasUpdated || (this.hasUpdated = !0, this.firstUpdated(e)), this.updated(e);
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
  shouldUpdate(e) {
    return !0;
  }
  update(e) {
    this._$Eq &&= this._$Eq.forEach((s) => this._$ET(s, this[s])), this._$EM();
  }
  updated(e) {
  }
  firstUpdated(e) {
  }
};
O.elementStyles = [], O.shadowRootOptions = { mode: "open" }, O[U("elementProperties")] = /* @__PURE__ */ new Map(), O[U("finalized")] = /* @__PURE__ */ new Map(), Ee?.({ ReactiveElement: O }), (W.reactiveElementVersions ??= []).push("2.1.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Y = globalThis, ne = (t) => t, B = Y.trustedTypes, oe = B ? B.createPolicy("lit-html", { createHTML: (t) => t }) : void 0, ge = "$lit$", w = `lit$${Math.random().toFixed(9).slice(2)}$`, fe = "?" + w, Te = `<${fe}>`, C = document, N = () => C.createComment(""), R = (t) => t === null || typeof t != "object" && typeof t != "function", ee = Array.isArray, Ce = (t) => ee(t) || typeof t?.[Symbol.iterator] == "function", G = `[ 	
\f\r]`, I = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, le = /-->/g, de = />/g, E = RegExp(`>|${G}(?:([^\\s"'>=/]+)(${G}*=${G}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), ce = /'/g, pe = /"/g, be = /^(?:script|style|textarea|title)$/i, ke = (t) => (e, ...s) => ({ _$litType$: t, strings: e, values: s }), o = ke(1), P = Symbol.for("lit-noChange"), h = Symbol.for("lit-nothing"), ue = /* @__PURE__ */ new WeakMap(), T = C.createTreeWalker(C, 129);
function me(t, e) {
  if (!ee(t) || !t.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return oe !== void 0 ? oe.createHTML(e) : e;
}
const Oe = (t, e) => {
  const s = t.length - 1, r = [];
  let i, a = e === 2 ? "<svg>" : e === 3 ? "<math>" : "", n = I;
  for (let d = 0; d < s; d++) {
    const l = t[d];
    let u, g, c = -1, v = 0;
    for (; v < l.length && (n.lastIndex = v, g = n.exec(l), g !== null); ) v = n.lastIndex, n === I ? g[1] === "!--" ? n = le : g[1] !== void 0 ? n = de : g[2] !== void 0 ? (be.test(g[2]) && (i = RegExp("</" + g[2], "g")), n = E) : g[3] !== void 0 && (n = E) : n === E ? g[0] === ">" ? (n = i ?? I, c = -1) : g[1] === void 0 ? c = -2 : (c = n.lastIndex - g[2].length, u = g[1], n = g[3] === void 0 ? E : g[3] === '"' ? pe : ce) : n === pe || n === ce ? n = E : n === le || n === de ? n = I : (n = E, i = void 0);
    const z = n === E && t[d + 1].startsWith("/>") ? " " : "";
    a += n === I ? l + Te : c >= 0 ? (r.push(u), l.slice(0, c) + ge + l.slice(c) + w + z) : l + w + (c === -2 ? d : z);
  }
  return [me(t, a + (t[s] || "<?>") + (e === 2 ? "</svg>" : e === 3 ? "</math>" : "")), r];
};
class j {
  constructor({ strings: e, _$litType$: s }, r) {
    let i;
    this.parts = [];
    let a = 0, n = 0;
    const d = e.length - 1, l = this.parts, [u, g] = Oe(e, s);
    if (this.el = j.createElement(u, r), T.currentNode = this.el.content, s === 2 || s === 3) {
      const c = this.el.content.firstChild;
      c.replaceWith(...c.childNodes);
    }
    for (; (i = T.nextNode()) !== null && l.length < d; ) {
      if (i.nodeType === 1) {
        if (i.hasAttributes()) for (const c of i.getAttributeNames()) if (c.endsWith(ge)) {
          const v = g[n++], z = i.getAttribute(c).split(w), L = /([.?@])?(.*)/.exec(v);
          l.push({ type: 1, index: a, name: L[2], strings: z, ctor: L[1] === "." ? Me : L[1] === "?" ? Ie : L[1] === "@" ? Ue : J }), i.removeAttribute(c);
        } else c.startsWith(w) && (l.push({ type: 6, index: a }), i.removeAttribute(c));
        if (be.test(i.tagName)) {
          const c = i.textContent.split(w), v = c.length - 1;
          if (v > 0) {
            i.textContent = B ? B.emptyScript : "";
            for (let z = 0; z < v; z++) i.append(c[z], N()), T.nextNode(), l.push({ type: 2, index: ++a });
            i.append(c[v], N());
          }
        }
      } else if (i.nodeType === 8) if (i.data === fe) l.push({ type: 2, index: a });
      else {
        let c = -1;
        for (; (c = i.data.indexOf(w, c + 1)) !== -1; ) l.push({ type: 7, index: a }), c += w.length - 1;
      }
      a++;
    }
  }
  static createElement(e, s) {
    const r = C.createElement("template");
    return r.innerHTML = e, r;
  }
}
function M(t, e, s = t, r) {
  if (e === P) return e;
  let i = r !== void 0 ? s._$Co?.[r] : s._$Cl;
  const a = R(e) ? void 0 : e._$litDirective$;
  return i?.constructor !== a && (i?._$AO?.(!1), a === void 0 ? i = void 0 : (i = new a(t), i._$AT(t, s, r)), r !== void 0 ? (s._$Co ??= [])[r] = i : s._$Cl = i), i !== void 0 && (e = M(t, i._$AS(t, e.values), i, r)), e;
}
class Pe {
  constructor(e, s) {
    this._$AV = [], this._$AN = void 0, this._$AD = e, this._$AM = s;
  }
  get parentNode() {
    return this._$AM.parentNode;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  u(e) {
    const { el: { content: s }, parts: r } = this._$AD, i = (e?.creationScope ?? C).importNode(s, !0);
    T.currentNode = i;
    let a = T.nextNode(), n = 0, d = 0, l = r[0];
    for (; l !== void 0; ) {
      if (n === l.index) {
        let u;
        l.type === 2 ? u = new H(a, a.nextSibling, this, e) : l.type === 1 ? u = new l.ctor(a, l.name, l.strings, this, e) : l.type === 6 && (u = new Ne(a, this, e)), this._$AV.push(u), l = r[++d];
      }
      n !== l?.index && (a = T.nextNode(), n++);
    }
    return T.currentNode = C, i;
  }
  p(e) {
    let s = 0;
    for (const r of this._$AV) r !== void 0 && (r.strings !== void 0 ? (r._$AI(e, r, s), s += r.strings.length - 2) : r._$AI(e[s])), s++;
  }
}
class H {
  get _$AU() {
    return this._$AM?._$AU ?? this._$Cv;
  }
  constructor(e, s, r, i) {
    this.type = 2, this._$AH = h, this._$AN = void 0, this._$AA = e, this._$AB = s, this._$AM = r, this.options = i, this._$Cv = i?.isConnected ?? !0;
  }
  get parentNode() {
    let e = this._$AA.parentNode;
    const s = this._$AM;
    return s !== void 0 && e?.nodeType === 11 && (e = s.parentNode), e;
  }
  get startNode() {
    return this._$AA;
  }
  get endNode() {
    return this._$AB;
  }
  _$AI(e, s = this) {
    e = M(this, e, s), R(e) ? e === h || e == null || e === "" ? (this._$AH !== h && this._$AR(), this._$AH = h) : e !== this._$AH && e !== P && this._(e) : e._$litType$ !== void 0 ? this.$(e) : e.nodeType !== void 0 ? this.T(e) : Ce(e) ? this.k(e) : this._(e);
  }
  O(e) {
    return this._$AA.parentNode.insertBefore(e, this._$AB);
  }
  T(e) {
    this._$AH !== e && (this._$AR(), this._$AH = this.O(e));
  }
  _(e) {
    this._$AH !== h && R(this._$AH) ? this._$AA.nextSibling.data = e : this.T(C.createTextNode(e)), this._$AH = e;
  }
  $(e) {
    const { values: s, _$litType$: r } = e, i = typeof r == "number" ? this._$AC(e) : (r.el === void 0 && (r.el = j.createElement(me(r.h, r.h[0]), this.options)), r);
    if (this._$AH?._$AD === i) this._$AH.p(s);
    else {
      const a = new Pe(i, this), n = a.u(this.options);
      a.p(s), this.T(n), this._$AH = a;
    }
  }
  _$AC(e) {
    let s = ue.get(e.strings);
    return s === void 0 && ue.set(e.strings, s = new j(e)), s;
  }
  k(e) {
    ee(this._$AH) || (this._$AH = [], this._$AR());
    const s = this._$AH;
    let r, i = 0;
    for (const a of e) i === s.length ? s.push(r = new H(this.O(N()), this.O(N()), this, this.options)) : r = s[i], r._$AI(a), i++;
    i < s.length && (this._$AR(r && r._$AB.nextSibling, i), s.length = i);
  }
  _$AR(e = this._$AA.nextSibling, s) {
    for (this._$AP?.(!1, !0, s); e !== this._$AB; ) {
      const r = ne(e).nextSibling;
      ne(e).remove(), e = r;
    }
  }
  setConnected(e) {
    this._$AM === void 0 && (this._$Cv = e, this._$AP?.(e));
  }
}
class J {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(e, s, r, i, a) {
    this.type = 1, this._$AH = h, this._$AN = void 0, this.element = e, this.name = s, this._$AM = i, this.options = a, r.length > 2 || r[0] !== "" || r[1] !== "" ? (this._$AH = Array(r.length - 1).fill(new String()), this.strings = r) : this._$AH = h;
  }
  _$AI(e, s = this, r, i) {
    const a = this.strings;
    let n = !1;
    if (a === void 0) e = M(this, e, s, 0), n = !R(e) || e !== this._$AH && e !== P, n && (this._$AH = e);
    else {
      const d = e;
      let l, u;
      for (e = a[0], l = 0; l < a.length - 1; l++) u = M(this, d[r + l], s, l), u === P && (u = this._$AH[l]), n ||= !R(u) || u !== this._$AH[l], u === h ? e = h : e !== h && (e += (u ?? "") + a[l + 1]), this._$AH[l] = u;
    }
    n && !i && this.j(e);
  }
  j(e) {
    e === h ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, e ?? "");
  }
}
class Me extends J {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(e) {
    this.element[this.name] = e === h ? void 0 : e;
  }
}
class Ie extends J {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(e) {
    this.element.toggleAttribute(this.name, !!e && e !== h);
  }
}
class Ue extends J {
  constructor(e, s, r, i, a) {
    super(e, s, r, i, a), this.type = 5;
  }
  _$AI(e, s = this) {
    if ((e = M(this, e, s, 0) ?? h) === P) return;
    const r = this._$AH, i = e === h && r !== h || e.capture !== r.capture || e.once !== r.once || e.passive !== r.passive, a = e !== h && (r === h || i);
    i && this.element.removeEventListener(this.name, this, r), a && this.element.addEventListener(this.name, this, e), this._$AH = e;
  }
  handleEvent(e) {
    typeof this._$AH == "function" ? this._$AH.call(this.options?.host ?? this.element, e) : this._$AH.handleEvent(e);
  }
}
class Ne {
  constructor(e, s, r) {
    this.element = e, this.type = 6, this._$AN = void 0, this._$AM = s, this.options = r;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(e) {
    M(this, e);
  }
}
const Re = Y.litHtmlPolyfillSupport;
Re?.(j, H), (Y.litHtmlVersions ??= []).push("3.3.3");
const je = (t, e, s) => {
  const r = s?.renderBefore ?? e;
  let i = r._$litPart$;
  if (i === void 0) {
    const a = s?.renderBefore ?? null;
    r._$litPart$ = i = new H(e.insertBefore(N(), a), a, void 0, s ?? {});
  }
  return i._$AI(t), i;
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const te = globalThis;
class S extends O {
  constructor() {
    super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
  }
  createRenderRoot() {
    const e = super.createRenderRoot();
    return this.renderOptions.renderBefore ??= e.firstChild, e;
  }
  update(e) {
    const s = this.render();
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(e), this._$Do = je(s, this.renderRoot, this.renderOptions);
  }
  connectedCallback() {
    super.connectedCallback(), this._$Do?.setConnected(!0);
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this._$Do?.setConnected(!1);
  }
  render() {
    return P;
  }
}
S._$litElement$ = !0, S.finalized = !0, te.litElementHydrateSupport?.({ LitElement: S });
const De = te.litElementPolyfillSupport;
De?.({ LitElement: S });
(te.litElementVersions ??= []).push("4.2.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const V = (t) => (e, s) => {
  s !== void 0 ? s.addInitializer(() => {
    customElements.define(t, e);
  }) : customElements.define(t, e);
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const He = { attribute: !0, type: String, converter: q, reflect: !1, hasChanged: X }, Le = (t = He, e, s) => {
  const { kind: r, metadata: i } = s;
  let a = globalThis.litPropertyMetadata.get(i);
  if (a === void 0 && globalThis.litPropertyMetadata.set(i, a = /* @__PURE__ */ new Map()), r === "setter" && ((t = Object.create(t)).wrapped = !0), a.set(s.name, t), r === "accessor") {
    const { name: n } = s;
    return { set(d) {
      const l = e.get.call(this);
      e.set.call(this, d), this.requestUpdate(n, l, t, !0, d);
    }, init(d) {
      return d !== void 0 && this.C(n, void 0, t, d), d;
    } };
  }
  if (r === "setter") {
    const { name: n } = s;
    return function(d) {
      const l = this[n];
      e.call(this, d), this.requestUpdate(n, l, t, !0, d);
    };
  }
  throw Error("Unsupported decorator location: " + r);
};
function m(t) {
  return (e, s) => typeof s == "object" ? Le(t, e, s) : ((r, i, a) => {
    const n = i.hasOwnProperty(a);
    return i.constructor.createProperty(a, r), n ? Object.getOwnPropertyDescriptor(i, a) : void 0;
  })(t, e, s);
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function p(t) {
  return m({ ...t, state: !0, attribute: !1 });
}
const Q = D`
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
`, Fe = "fuzzy_system/systems/list", qe = "fuzzy_system/systems/save", Be = "fuzzy_system/systems/delete", We = "fuzzy_system/templates/list", Je = "fuzzy_system/templates/instantiate";
async function Ve(t) {
  const e = await t.callWS({
    type: Fe
  });
  return Array.isArray(e) ? e : e.systems || [];
}
async function Qe(t, e, s) {
  return t.callWS({
    type: qe,
    system_id: e.system_id,
    name: e.name,
    description: e.description,
    inference: e.inference,
    defuzzifier: e.defuzzifier,
    expose_system_sensor: e.expose_system_sensor ?? !0,
    max_updates_per_period: e.max_updates_per_period ?? 20,
    update_period: e.update_period ?? 0.05,
    epsilon: e.epsilon ?? 0.01,
    inputs: e.inputs,
    outputs: e.outputs,
    rules: e.rules,
    entry_id: s
  });
}
async function Ge(t, e) {
  return t.callWS({
    type: Be,
    entry_id: e
  });
}
async function Ze(t) {
  return (await t.callWS({
    type: We
  })).templates || [];
}
async function Ke(t, e, s, r) {
  return t.callWS({
    type: Je,
    template_id: e,
    system_id: s,
    name: r
  });
}
var Xe = Object.defineProperty, Ye = Object.getOwnPropertyDescriptor, k = (t, e, s, r) => {
  for (var i = r > 1 ? void 0 : r ? Ye(e, s) : e, a = t.length - 1, n; a >= 0; a--)
    (n = t[a]) && (i = (r ? n(e, s, i) : n(i)) || i);
  return r && i && Xe(e, s, i), i;
};
let $ = class extends S {
  constructor() {
    super(...arguments), this._systems = [], this._searchQuery = "", this._loading = !1, this._error = "", this._showTemplateModal = !1;
  }
  async connectedCallback() {
    super.connectedCallback(), await this.refresh();
  }
  async refresh() {
    this._loading = !0, this._error = "";
    try {
      this._systems = await Ve(this.hass);
    } catch (t) {
      this._error = t.message || "Failed to load fuzzy systems";
    } finally {
      this._loading = !1;
    }
  }
  _filteredSystems() {
    if (!this._searchQuery.trim()) return this._systems;
    const t = this._searchQuery.toLowerCase();
    return this._systems.filter(
      (e) => e.name.toLowerCase().includes(t) || e.system_id.toLowerCase().includes(t) || e.description.toLowerCase().includes(t)
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
  _handleEdit(t) {
    this.dispatchEvent(
      new CustomEvent("edit-system", {
        detail: { systemId: t.system_id, entryId: t.entry_id, config: t.config },
        bubbles: !0,
        composed: !0
      })
    );
  }
  async _handleDelete(t) {
    if (t.entry_id && confirm(`Are you sure you want to delete '${t.name}'?`))
      try {
        await Ge(this.hass, t.entry_id), await this.refresh();
      } catch (e) {
        alert(e.message || "Failed to delete system");
      }
  }
  render() {
    const t = this._filteredSystems();
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
            @input=${(e) => this._searchQuery = e.target.value}
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

      ${t.length === 0 && !this._loading ? o`
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
              ${t.map(
      (e) => o`
                  <div class="card">
                    <div class="card-header">
                      <div>
                        <div class="card-title">${e.name}</div>
                        <div class="card-id">${e.system_id}</div>
                      </div>
                      <span class="badge ${e.source === "yaml" ? "badge-purple" : "badge-emerald"}">
                        ${e.source === "yaml" ? "YAML" : "UI"}
                      </span>
                    </div>

                    ${e.description ? o`<p class="subtitle" style="margin-bottom: 12px;">${e.description}</p>` : ""}

                    <div class="card-badges">
                      <span class="badge ${e.inference === "sugeno" ? "badge-amber" : "badge-cyan"}">
                        ${e.inference}
                      </span>
                      <span class="badge" style="background: rgba(255,255,255,0.06); color: var(--fuzzy-text-secondary);">
                        ${e.defuzzifier}
                      </span>
                      ${e.max_updates_per_period ? o`<span class="badge" style="background: rgba(16,185,129,0.1); color: #34d399;" title="Rate limiter budget">
                            ⏱️ ${e.max_updates_per_period} / ${e.update_period}s
                          </span>` : ""}
                    </div>

                    <div class="card-metrics">
                      <span class="chip">${e.input_count} inputs</span>
                      <span class="chip">${e.output_count} outputs</span>
                      <span class="chip">${e.rule_count} rules</span>
                      ${e.epsilon !== void 0 ? o`<span class="chip">ε = ${e.epsilon}</span>` : ""}
                    </div>

                    <div class="card-actions">
                      <button class="btn btn-secondary" @click=${() => this._handleEdit(e)}>
                        ${e.source === "yaml" ? "Inspect" : "Edit"}
                      </button>
                      ${e.source === "config_entry" ? o`
                            <button class="btn btn-danger" @click=${() => this._handleDelete(e)}>
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
              @template-instantiated=${(e) => {
      this._showTemplateModal = !1, this.dispatchEvent(
        new CustomEvent("edit-system", {
          detail: { config: e.detail.system },
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
$.styles = [
  Q,
  D`
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
k([
  m({ attribute: !1 })
], $.prototype, "hass", 2);
k([
  p()
], $.prototype, "_systems", 2);
k([
  p()
], $.prototype, "_searchQuery", 2);
k([
  p()
], $.prototype, "_loading", 2);
k([
  p()
], $.prototype, "_error", 2);
k([
  p()
], $.prototype, "_showTemplateModal", 2);
$ = k([
  V("fuzzy-system-catalog")
], $);
var et = Object.defineProperty, tt = Object.getOwnPropertyDescriptor, y = (t, e, s, r) => {
  for (var i = r > 1 ? void 0 : r ? tt(e, s) : e, a = t.length - 1, n; a >= 0; a--)
    (n = t[a]) && (i = (r ? n(e, s, i) : n(i)) || i);
  return r && i && et(e, s, i), i;
};
let f = class extends S {
  constructor() {
    super(...arguments), this.source = "config_entry", this._activeTab = "general", this._rawJson = "", this._saving = !1, this._error = "", this._successMsg = "";
  }
  connectedCallback() {
    super.connectedCallback(), this._initForm();
  }
  willUpdate(t) {
    t.has("systemConfig") && this.systemConfig && this._initForm();
  }
  _initForm() {
    this.systemConfig ? this._config = JSON.parse(JSON.stringify(this.systemConfig)) : this._config = {
      system_id: "",
      name: "",
      description: "",
      inference: "mamdani",
      defuzzifier: "centroid",
      expose_system_sensor: !0,
      max_updates_per_period: 20,
      update_period: 0.05,
      epsilon: 0.01,
      inputs: {},
      outputs: {},
      rules: []
    }, this._rawJson = JSON.stringify(this._config, null, 2);
  }
  _handleBack() {
    this.dispatchEvent(new CustomEvent("back", { bubbles: !0, composed: !0 }));
  }
  _handleInferenceChange(t) {
    this._config.inference = t, t === "sugeno" ? this._config.defuzzifier = "wtaverage" : this._config.defuzzifier = "centroid", this.requestUpdate();
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
      } catch (t) {
        this._error = `Invalid JSON: ${t.message}`;
        return;
      }
    this._saving = !0;
    try {
      const t = await Qe(this.hass, this._config, this.entryId);
      this._successMsg = `System '${t.system_id}' saved successfully!`, this.dispatchEvent(
        new CustomEvent("system-saved", {
          detail: { systemId: t.system_id, entryId: t.entry_id },
          bubbles: !0,
          composed: !0
        })
      );
    } catch (t) {
      this._error = t.message || "Failed to save fuzzy system.";
    } finally {
      this._saving = !1;
    }
  }
  // --- Inputs Handlers ---
  _addInput() {
    const t = prompt("Enter input variable name (e.g., temperature):");
    if (!t || !t.trim()) return;
    const e = t.trim().toLowerCase().replace(/[^a-z0-9_]/g, "_");
    if (this._config.inputs[e]) {
      alert(`Input '${e}' already exists.`);
      return;
    }
    this._config.inputs[e] = {
      entity_id: "",
      range: [0, 100],
      resolution: 100,
      default: 0,
      terms: {
        low: { type: "trapmf", params: [0, 0, 20, 40] },
        medium: { type: "trimf", params: [30, 50, 70] },
        high: { type: "trapmf", params: [60, 80, 100, 100] }
      }
    }, this.requestUpdate();
  }
  _removeInput(t) {
    confirm(`Delete input variable '${t}'?`) && (delete this._config.inputs[t], this.requestUpdate());
  }
  // --- Outputs Handlers ---
  _addOutput() {
    const t = prompt("Enter output variable name (e.g., fan_speed):");
    if (!t || !t.trim()) return;
    const e = t.trim().toLowerCase().replace(/[^a-z0-9_]/g, "_");
    if (this._config.outputs[e]) {
      alert(`Output '${e}' already exists.`);
      return;
    }
    this._config.outputs[e] = {
      range: [0, 100],
      resolution: 100,
      defuzzifier: this._config.inference === "sugeno" ? "wtaverage" : "centroid",
      epsilon: this._config.epsilon ?? 0.01,
      unit_of_measurement: "%",
      terms: {
        low: { type: "trimf", params: [0, 0, 50] },
        medium: { type: "trimf", params: [25, 50, 75] },
        high: { type: "trimf", params: [50, 100, 100] }
      }
    }, this.requestUpdate();
  }
  _removeOutput(t) {
    confirm(`Delete output variable '${t}'?`) && (delete this._config.outputs[t], this.requestUpdate());
  }
  // --- Rules Handlers ---
  _addRule() {
    this._config.rules = [...this._config.rules, "IF  THEN "], this.requestUpdate();
  }
  _updateRule(t, e) {
    this._config.rules[t] = e;
  }
  _removeRule(t) {
    this._config.rules.splice(t, 1), this.requestUpdate();
  }
  render() {
    if (!this._config) return o``;
    const t = this.source === "yaml";
    return o`
      <div class="header-actions">
        <div>
          <button class="btn btn-secondary" @click=${this._handleBack}>
            ← Back to Catalog
          </button>
        </div>

        <div style="display: flex; gap: 10px; align-items: center;">
          ${this._saving ? o`<span class="chip">Saving...</span>` : ""}
          ${t ? "" : o`
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

      ${t ? o`
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
            class="tab-btn ${this._activeTab === "raw" ? "active" : ""}"
            @click=${() => {
      this._rawJson = JSON.stringify(this._config, null, 2), this._activeTab = "raw";
    }}
          >
            { } Raw Config
          </button>
        </div>

        ${this._renderActiveTab(t)}
      </div>
    `;
  }
  _renderActiveTab(t) {
    switch (this._activeTab) {
      case "general":
        return this._renderGeneralTab(t);
      case "inputs":
        return this._renderInputsTab(t);
      case "outputs":
        return this._renderOutputsTab(t);
      case "rules":
        return this._renderRulesTab(t);
      case "raw":
        return this._renderRawTab(t);
    }
  }
  _renderGeneralTab(t) {
    return o`
      <div class="grid-2">
        <div class="form-group">
          <label class="form-label">System Identifier (system_id)</label>
          <input
            class="input-text"
            type="text"
            .value=${this._config.system_id || ""}
            ?disabled=${t || !!this.entryId}
            placeholder="e.g. climate_controller"
            @input=${(e) => this._config.system_id = e.target.value}
          />
          <div class="helper-text">Unique alphanumeric slug for entity IDs (sensor.fuzzy_system_*)</div>
        </div>

        <div class="form-group">
          <label class="form-label">Display Name</label>
          <input
            class="input-text"
            type="text"
            .value=${this._config.name || ""}
            ?disabled=${t}
            placeholder="e.g. Climate Controller"
            @input=${(e) => this._config.name = e.target.value}
          />
        </div>
      </div>

      <div class="form-group">
        <label class="form-label">Description</label>
        <textarea
          class="input-textarea"
          rows="2"
          .value=${this._config.description || ""}
          ?disabled=${t}
          placeholder="Brief description of the control objectives..."
          @input=${(e) => this._config.description = e.target.value}
        ></textarea>
      </div>

      <div class="grid-2">
        <div class="form-group">
          <label class="form-label">Inference Engine</label>
          <select
            class="input-select"
            .value=${this._config.inference || "mamdani"}
            ?disabled=${t}
            @change=${(e) => this._handleInferenceChange(e.target.value)}
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
            .value=${this._config.defuzzifier || "centroid"}
            ?disabled=${t}
            @change=${(e) => this._config.defuzzifier = e.target.value}
          >
            ${this._config.inference === "sugeno" ? o`
                  <option value="wtaverage">Weighted Average (wtaverage)</option>
                  <option value="wtsum">Weighted Sum (wtsum)</option>
                ` : o`
                  <option value="centroid">Centroid (Center of Gravity)</option>
                  <option value="bisector">Bisector of Area</option>
                  <option value="mom">Mean of Maximum (mom)</option>
                  <option value="som">Smallest of Maximum (som)</option>
                  <option value="lom">Largest of Maximum (lom)</option>
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
            ?disabled=${t}
            @input=${(e) => this._config.max_updates_per_period = parseInt(e.target.value, 10)}
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
            ?disabled=${t}
            @input=${(e) => this._config.update_period = parseFloat(e.target.value)}
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
            ?disabled=${t}
            @input=${(e) => this._config.epsilon = parseFloat(e.target.value)}
          />
          <div class="helper-text">Suppresses updates if |Δy| &lt; ε (Default: 0.01)</div>
        </div>
      </div>

      <div class="form-group" style="margin-top: 14px;">
        <label class="checkbox-label">
          <input
            type="checkbox"
            .checked=${this._config.expose_system_sensor !== !1}
            ?disabled=${t}
            @change=${(e) => this._config.expose_system_sensor = e.target.checked}
          />
          Expose System Status Diagnostic Sensor (sensor.fuzzy_system_{id}_status)
        </label>
      </div>
    `;
  }
  _renderInputsTab(t) {
    const e = this._config.inputs || {}, s = Object.keys(e);
    return o`
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
        <div>
          <h3 class="section-title">Input Antecedents</h3>
          <p class="helper-text">Sensors and numerical inputs mapped to linguistic membership terms</p>
        </div>
        ${t ? "" : o`
              <button class="btn btn-secondary" @click=${this._addInput}>
                + Add Input Variable
              </button>
            `}
      </div>

      ${s.length === 0 ? o`<p class="subtitle" style="padding: 20px 0;">No input variables defined yet.</p>` : s.map((r) => {
      const i = e[r];
      return o`
              <div class="section-box">
                <div class="section-header">
                  <div style="display: flex; align-items: center; gap: 8px;">
                    <span class="badge badge-cyan">${r}</span>
                    <span class="chip">${i.entity_id || "Unbound"}</span>
                    <span class="chip">Range: [${i.range[0]}, ${i.range[1]}]</span>
                  </div>
                  ${t ? "" : o`
                        <button class="btn btn-danger btn-icon" @click=${() => this._removeInput(r)} title="Delete Input">
                          ✕
                        </button>
                      `}
                </div>

                <div class="grid-2">
                  <div class="form-group">
                    <label class="form-label">Home Assistant Entity ID</label>
                    <input
                      class="input-text"
                      type="text"
                      .value=${i.entity_id || ""}
                      ?disabled=${t}
                      placeholder="e.g. sensor.living_room_temperature"
                      @input=${(a) => {
        i.entity_id = a.target.value, this.requestUpdate();
      }}
                    />
                  </div>

                  <div class="grid-2">
                    <div class="form-group">
                      <label class="form-label">Range Min</label>
                      <input
                        class="input-text"
                        type="number"
                        .value=${String(i.range[0])}
                        ?disabled=${t}
                        @input=${(a) => {
        i.range[0] = parseFloat(a.target.value), this.requestUpdate();
      }}
                      />
                    </div>
                    <div class="form-group">
                      <label class="form-label">Range Max</label>
                      <input
                        class="input-text"
                        type="number"
                        .value=${String(i.range[1])}
                        ?disabled=${t}
                        @input=${(a) => {
        i.range[1] = parseFloat(a.target.value), this.requestUpdate();
      }}
                      />
                    </div>
                  </div>
                </div>

                <div style="margin-top: 8px;">
                  <span class="helper-text">Linguistic Terms: </span>
                  ${Object.keys(i.terms || {}).map(
        (a) => o`<span class="badge" style="margin-right: 4px;">${a} (${i.terms[a].type})</span>`
      )}
                </div>
              </div>
            `;
    })}
    `;
  }
  _renderOutputsTab(t) {
    const e = this._config.outputs || {}, s = Object.keys(e);
    return o`
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
        <div>
          <h3 class="section-title">Output Consequents</h3>
          <p class="helper-text">Control targets defuzzified and published to Home Assistant sensors</p>
        </div>
        ${t ? "" : o`
              <button class="btn btn-secondary" @click=${this._addOutput}>
                + Add Output Variable
              </button>
            `}
      </div>

      ${s.length === 0 ? o`<p class="subtitle" style="padding: 20px 0;">No output variables defined yet.</p>` : s.map((r) => {
      const i = e[r];
      return o`
              <div class="section-box">
                <div class="section-header">
                  <div style="display: flex; align-items: center; gap: 8px;">
                    <span class="badge badge-amber">${r}</span>
                    <span class="chip">Range: [${i.range[0]}, ${i.range[1]}]</span>
                    ${i.unit_of_measurement ? o`<span class="chip">${i.unit_of_measurement}</span>` : ""}
                  </div>
                  ${t ? "" : o`
                        <button class="btn btn-danger btn-icon" @click=${() => this._removeOutput(r)} title="Delete Output">
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
                      ?disabled=${t}
                      @input=${(a) => {
        i.range[0] = parseFloat(a.target.value), this.requestUpdate();
      }}
                    />
                  </div>
                  <div class="form-group">
                    <label class="form-label">Range Max</label>
                    <input
                      class="input-text"
                      type="number"
                      .value=${String(i.range[1])}
                      ?disabled=${t}
                      @input=${(a) => {
        i.range[1] = parseFloat(a.target.value), this.requestUpdate();
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
                      ?disabled=${t}
                      @input=${(a) => {
        const n = a.target.value.trim();
        i.epsilon = n ? parseFloat(n) : void 0, this.requestUpdate();
      }}
                    />
                  </div>
                </div>

                <div style="margin-top: 8px;">
                  <span class="helper-text">Linguistic Terms: </span>
                  ${Object.keys(i.terms || {}).map(
        (a) => o`<span class="badge" style="margin-right: 4px;">${a} (${i.terms[a].type})</span>`
      )}
                </div>
              </div>
            `;
    })}
    `;
  }
  _renderRulesTab(t) {
    const e = this._config.rules || [];
    return o`
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
        <div>
          <h3 class="section-title">Linguistic Rules</h3>
          <p class="helper-text">IF &lt;antecedents&gt; THEN &lt;consequents&gt; with AND, OR, NOT and linguistic hedges</p>
        </div>
        ${t ? "" : o`
              <button class="btn btn-secondary" @click=${this._addRule}>
                + Add Rule
              </button>
            `}
      </div>

      ${e.length === 0 ? o`<p class="subtitle" style="padding: 20px 0;">No inference rules defined yet.</p>` : e.map(
      (s, r) => o`
              <div class="rule-item">
                <span class="badge badge-purple" style="width: 24px; justify-content: center;">${r + 1}</span>
                <input
                  class="input-text rule-input"
                  type="text"
                  .value=${s}
                  ?disabled=${t}
                  @input=${(i) => this._updateRule(r, i.target.value)}
                />
                ${t ? "" : o`
                      <button class="btn btn-danger btn-icon" @click=${() => this._removeRule(r)}>
                        ✕
                      </button>
                    `}
              </div>
            `
    )}
    `;
  }
  _renderRawTab(t) {
    return o`
      <div class="form-group">
        <label class="form-label">Full Configuration JSON</label>
        <textarea
          class="input-textarea"
          rows="16"
          style="font-family: monospace; font-size: 13px;"
          .value=${this._rawJson}
          ?disabled=${t}
          @input=${(e) => this._rawJson = e.target.value}
        ></textarea>
        <div class="helper-text">You can directly copy, edit, or paste your entire controller definition here.</div>
      </div>
    `;
  }
};
f.styles = [
  Q,
  D`
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
y([
  m({ attribute: !1 })
], f.prototype, "hass", 2);
y([
  m({ type: Object })
], f.prototype, "systemConfig", 2);
y([
  m({ type: String })
], f.prototype, "entryId", 2);
y([
  m({ type: String })
], f.prototype, "source", 2);
y([
  p()
], f.prototype, "_activeTab", 2);
y([
  p()
], f.prototype, "_config", 2);
y([
  p()
], f.prototype, "_rawJson", 2);
y([
  p()
], f.prototype, "_saving", 2);
y([
  p()
], f.prototype, "_error", 2);
y([
  p()
], f.prototype, "_successMsg", 2);
f = y([
  V("fuzzy-system-editor")
], f);
var st = Object.defineProperty, it = Object.getOwnPropertyDescriptor, A = (t, e, s, r) => {
  for (var i = r > 1 ? void 0 : r ? it(e, s) : e, a = t.length - 1, n; a >= 0; a--)
    (n = t[a]) && (i = (r ? n(e, s, i) : n(i)) || i);
  return r && i && st(e, s, i), i;
};
let _ = class extends S {
  constructor() {
    super(...arguments), this._templates = [], this._selectedTemplate = null, this._systemId = "", this._systemName = "", this._loading = !1, this._error = "";
  }
  async connectedCallback() {
    super.connectedCallback();
    try {
      this._templates = await Ze(this.hass);
    } catch (t) {
      this._error = t.message || "Failed to load templates";
    }
  }
  _selectTemplate(t) {
    this._selectedTemplate = t, this._systemId = t.id, this._systemName = t.name, this._error = "";
  }
  async _handleInstantiate() {
    if (!this._selectedTemplate) return;
    const t = this._systemId.trim().toLowerCase().replace(/[^a-z0-9_]/g, "_");
    if (!t) {
      this._error = "Please provide a valid system identifier";
      return;
    }
    this._loading = !0, this._error = "";
    try {
      const e = await Ke(
        this.hass,
        this._selectedTemplate.id,
        t,
        this._systemName.trim() || void 0
      );
      this.dispatchEvent(
        new CustomEvent("template-instantiated", {
          detail: { system: e.system },
          bubbles: !0,
          composed: !0
        })
      );
    } catch (e) {
      this._error = e.message || "Failed to instantiate template";
    } finally {
      this._loading = !1;
    }
  }
  _close() {
    this.dispatchEvent(new CustomEvent("close", { bubbles: !0, composed: !0 }));
  }
  render() {
    return o`
      <div class="modal-overlay" @click=${(t) => t.target === t.currentTarget && this._close()}>
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
      (t) => o`
                <div
                  class="template-card ${this._selectedTemplate?.id === t.id ? "selected" : ""}"
                  @click=${() => this._selectTemplate(t)}
                >
                  <div class="template-title">${t.name}</div>
                  <div class="template-desc">${t.description}</div>
                  <div class="template-meta">
                    <span class="badge ${t.inference === "sugeno" ? "badge-amber" : "badge-cyan"}">
                      ${t.inference}
                    </span>
                    <span class="chip">${t.input_count} in</span>
                    <span class="chip">${t.output_count} out</span>
                    <span class="chip">${t.rule_count} rules</span>
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
                      @input=${(t) => this._systemId = t.target.value}
                      placeholder="e.g. living_room_comfort"
                    />
                  </div>
                  <div class="form-group">
                    <label class="form-label">Friendly Name</label>
                    <input
                      class="input-text"
                      type="text"
                      .value=${this._systemName}
                      @input=${(t) => this._systemName = t.target.value}
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
_.styles = [
  Q,
  D`
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
A([
  m({ attribute: !1 })
], _.prototype, "hass", 2);
A([
  p()
], _.prototype, "_templates", 2);
A([
  p()
], _.prototype, "_selectedTemplate", 2);
A([
  p()
], _.prototype, "_systemId", 2);
A([
  p()
], _.prototype, "_systemName", 2);
A([
  p()
], _.prototype, "_loading", 2);
A([
  p()
], _.prototype, "_error", 2);
_ = A([
  V("fuzzy-template-modal")
], _);
var rt = Object.defineProperty, at = Object.getOwnPropertyDescriptor, x = (t, e, s, r) => {
  for (var i = r > 1 ? void 0 : r ? at(e, s) : e, a = t.length - 1, n; a >= 0; a--)
    (n = t[a]) && (i = (r ? n(e, s, i) : n(i)) || i);
  return r && i && rt(e, s, i), i;
};
let b = class extends S {
  constructor() {
    super(...arguments), this.narrow = !1, this._view = "catalog", this._selectedSource = "config_entry";
  }
  _handleCreateSystem() {
    this._selectedConfig = void 0, this._selectedEntryId = void 0, this._selectedSource = "config_entry", this._view = "editor";
  }
  _handleEditSystem(t) {
    this._selectedConfig = t.detail.config, this._selectedEntryId = t.detail.entryId, this._selectedSource = t.detail.source || (t.detail.entryId ? "config_entry" : "yaml"), this._view = "editor";
  }
  _handleSystemSaved() {
    this._view = "catalog";
    const t = this.shadowRoot?.querySelector("fuzzy-system-catalog");
    t && typeof t.refresh == "function" && t.refresh();
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
b.styles = [
  Q,
  D`
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
x([
  m({ attribute: !1 })
], b.prototype, "hass", 2);
x([
  m({ type: Boolean })
], b.prototype, "narrow", 2);
x([
  m({ type: Object })
], b.prototype, "route", 2);
x([
  m({ type: Object })
], b.prototype, "panel", 2);
x([
  p()
], b.prototype, "_view", 2);
x([
  p()
], b.prototype, "_selectedConfig", 2);
x([
  p()
], b.prototype, "_selectedEntryId", 2);
x([
  p()
], b.prototype, "_selectedSource", 2);
b = x([
  V("fuzzy-system-panel")
], b);
export {
  b as FuzzySystemPanel
};
