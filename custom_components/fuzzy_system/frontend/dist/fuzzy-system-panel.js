/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const H = globalThis, Z = H.ShadowRoot && (H.ShadyCSS === void 0 || H.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, K = Symbol(), se = /* @__PURE__ */ new WeakMap();
let he = class {
  constructor(e, s, i) {
    if (this._$cssResult$ = !0, i !== K) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = e, this.t = s;
  }
  get styleSheet() {
    let e = this.o;
    const s = this.t;
    if (Z && e === void 0) {
      const i = s !== void 0 && s.length === 1;
      i && (e = se.get(s)), e === void 0 && ((this.o = e = new CSSStyleSheet()).replaceSync(this.cssText), i && se.set(s, e));
    }
    return e;
  }
  toString() {
    return this.cssText;
  }
};
const ye = (t) => new he(typeof t == "string" ? t : t + "", void 0, K), q = (t, ...e) => {
  const s = t.length === 1 ? t[0] : e.reduce((i, r, n) => i + ((a) => {
    if (a._$cssResult$ === !0) return a.cssText;
    if (typeof a == "number") return a;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + a + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(r) + t[n + 1], t[0]);
  return new he(s, t, K);
}, _e = (t, e) => {
  if (Z) t.adoptedStyleSheets = e.map((s) => s instanceof CSSStyleSheet ? s : s.styleSheet);
  else for (const s of e) {
    const i = document.createElement("style"), r = H.litNonce;
    r !== void 0 && i.setAttribute("nonce", r), i.textContent = s.cssText, t.appendChild(i);
  }
}, ie = Z ? (t) => t : (t) => t instanceof CSSStyleSheet ? ((e) => {
  let s = "";
  for (const i of e.cssRules) s += i.cssText;
  return ye(s);
})(t) : t;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const { is: ve, defineProperty: xe, getOwnPropertyDescriptor: $e, getOwnPropertyNames: we, getOwnPropertySymbols: ze, getPrototypeOf: Se } = Object, F = globalThis, re = F.trustedTypes, Ae = re ? re.emptyScript : "", Ee = F.reactiveElementPolyfillSupport, P = (t, e) => t, L = { toAttribute(t, e) {
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
} }, X = (t, e) => !ve(t, e), ne = { attribute: !0, type: String, converter: L, reflect: !1, useDefault: !1, hasChanged: X };
Symbol.metadata ??= Symbol("metadata"), F.litPropertyMetadata ??= /* @__PURE__ */ new WeakMap();
let M = class extends HTMLElement {
  static addInitializer(e) {
    this._$Ei(), (this.l ??= []).push(e);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(e, s = ne) {
    if (s.state && (s.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(e) && ((s = Object.create(s)).wrapped = !0), this.elementProperties.set(e, s), !s.noAccessor) {
      const i = Symbol(), r = this.getPropertyDescriptor(e, i, s);
      r !== void 0 && xe(this.prototype, e, r);
    }
  }
  static getPropertyDescriptor(e, s, i) {
    const { get: r, set: n } = $e(this.prototype, e) ?? { get() {
      return this[s];
    }, set(a) {
      this[s] = a;
    } };
    return { get: r, set(a) {
      const d = r?.call(this);
      n?.call(this, a), this.requestUpdate(e, d, i);
    }, configurable: !0, enumerable: !0 };
  }
  static getPropertyOptions(e) {
    return this.elementProperties.get(e) ?? ne;
  }
  static _$Ei() {
    if (this.hasOwnProperty(P("elementProperties"))) return;
    const e = Se(this);
    e.finalize(), e.l !== void 0 && (this.l = [...e.l]), this.elementProperties = new Map(e.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(P("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(P("properties"))) {
      const s = this.properties, i = [...we(s), ...ze(s)];
      for (const r of i) this.createProperty(r, s[r]);
    }
    const e = this[Symbol.metadata];
    if (e !== null) {
      const s = litPropertyMetadata.get(e);
      if (s !== void 0) for (const [i, r] of s) this.elementProperties.set(i, r);
    }
    this._$Eh = /* @__PURE__ */ new Map();
    for (const [s, i] of this.elementProperties) {
      const r = this._$Eu(s, i);
      r !== void 0 && this._$Eh.set(r, s);
    }
    this.elementStyles = this.finalizeStyles(this.styles);
  }
  static finalizeStyles(e) {
    const s = [];
    if (Array.isArray(e)) {
      const i = new Set(e.flat(1 / 0).reverse());
      for (const r of i) s.unshift(ie(r));
    } else e !== void 0 && s.push(ie(e));
    return s;
  }
  static _$Eu(e, s) {
    const i = s.attribute;
    return i === !1 ? void 0 : typeof i == "string" ? i : typeof e == "string" ? e.toLowerCase() : void 0;
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
    for (const i of s.keys()) this.hasOwnProperty(i) && (e.set(i, this[i]), delete this[i]);
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
  attributeChangedCallback(e, s, i) {
    this._$AK(e, i);
  }
  _$ET(e, s) {
    const i = this.constructor.elementProperties.get(e), r = this.constructor._$Eu(e, i);
    if (r !== void 0 && i.reflect === !0) {
      const n = (i.converter?.toAttribute !== void 0 ? i.converter : L).toAttribute(s, i.type);
      this._$Em = e, n == null ? this.removeAttribute(r) : this.setAttribute(r, n), this._$Em = null;
    }
  }
  _$AK(e, s) {
    const i = this.constructor, r = i._$Eh.get(e);
    if (r !== void 0 && this._$Em !== r) {
      const n = i.getPropertyOptions(r), a = typeof n.converter == "function" ? { fromAttribute: n.converter } : n.converter?.fromAttribute !== void 0 ? n.converter : L;
      this._$Em = r;
      const d = a.fromAttribute(s, n.type);
      this[r] = d ?? this._$Ej?.get(r) ?? d, this._$Em = null;
    }
  }
  requestUpdate(e, s, i, r = !1, n) {
    if (e !== void 0) {
      const a = this.constructor;
      if (r === !1 && (n = this[e]), i ??= a.getPropertyOptions(e), !((i.hasChanged ?? X)(n, s) || i.useDefault && i.reflect && n === this._$Ej?.get(e) && !this.hasAttribute(a._$Eu(e, i)))) return;
      this.C(e, s, i);
    }
    this.isUpdatePending === !1 && (this._$ES = this._$EP());
  }
  C(e, s, { useDefault: i, reflect: r, wrapped: n }, a) {
    i && !(this._$Ej ??= /* @__PURE__ */ new Map()).has(e) && (this._$Ej.set(e, a ?? s ?? this[e]), n !== !0 || a !== void 0) || (this._$AL.has(e) || (this.hasUpdated || i || (s = void 0), this._$AL.set(e, s)), r === !0 && this._$Em !== e && (this._$Eq ??= /* @__PURE__ */ new Set()).add(e));
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
        for (const [r, n] of this._$Ep) this[r] = n;
        this._$Ep = void 0;
      }
      const i = this.constructor.elementProperties;
      if (i.size > 0) for (const [r, n] of i) {
        const { wrapped: a } = n, d = this[r];
        a !== !0 || this._$AL.has(r) || d === void 0 || this.C(r, void 0, n, d);
      }
    }
    let e = !1;
    const s = this._$AL;
    try {
      e = this.shouldUpdate(s), e ? (this.willUpdate(s), this._$EO?.forEach((i) => i.hostUpdate?.()), this.update(s)) : this._$EM();
    } catch (i) {
      throw e = !1, this._$EM(), i;
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
M.elementStyles = [], M.shadowRootOptions = { mode: "open" }, M[P("elementProperties")] = /* @__PURE__ */ new Map(), M[P("finalized")] = /* @__PURE__ */ new Map(), Ee?.({ ReactiveElement: M }), (F.reactiveElementVersions ??= []).push("2.1.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Y = globalThis, ae = (t) => t, V = Y.trustedTypes, oe = V ? V.createPolicy("lit-html", { createHTML: (t) => t }) : void 0, ge = "$lit$", S = `lit$${Math.random().toFixed(9).slice(2)}$`, be = "?" + S, Ce = `<${be}>`, k = document, U = () => k.createComment(""), j = (t) => t === null || typeof t != "object" && typeof t != "function", ee = Array.isArray, Ie = (t) => ee(t) || typeof t?.[Symbol.iterator] == "function", Q = `[ 	
\f\r]`, N = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, le = /-->/g, de = />/g, C = RegExp(`>|${Q}(?:([^\\s"'>=/]+)(${Q}*=${Q}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), pe = /'/g, ce = /"/g, fe = /^(?:script|style|textarea|title)$/i, ke = (t) => (e, ...s) => ({ _$litType$: t, strings: e, values: s }), o = ke(1), O = Symbol.for("lit-noChange"), f = Symbol.for("lit-nothing"), ue = /* @__PURE__ */ new WeakMap(), I = k.createTreeWalker(k, 129);
function me(t, e) {
  if (!ee(t) || !t.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return oe !== void 0 ? oe.createHTML(e) : e;
}
const Te = (t, e) => {
  const s = t.length - 1, i = [];
  let r, n = e === 2 ? "<svg>" : e === 3 ? "<math>" : "", a = N;
  for (let d = 0; d < s; d++) {
    const l = t[d];
    let g, b, c = -1, m = 0;
    for (; m < l.length && (a.lastIndex = m, b = a.exec(l), b !== null); ) m = a.lastIndex, a === N ? b[1] === "!--" ? a = le : b[1] !== void 0 ? a = de : b[2] !== void 0 ? (fe.test(b[2]) && (r = RegExp("</" + b[2], "g")), a = C) : b[3] !== void 0 && (a = C) : a === C ? b[0] === ">" ? (a = r ?? N, c = -1) : b[1] === void 0 ? c = -2 : (c = a.lastIndex - b[2].length, g = b[1], a = b[3] === void 0 ? C : b[3] === '"' ? ce : pe) : a === ce || a === pe ? a = C : a === le || a === de ? a = N : (a = C, r = void 0);
    const y = a === C && t[d + 1].startsWith("/>") ? " " : "";
    n += a === N ? l + Ce : c >= 0 ? (i.push(g), l.slice(0, c) + ge + l.slice(c) + S + y) : l + S + (c === -2 ? d : y);
  }
  return [me(t, n + (t[s] || "<?>") + (e === 2 ? "</svg>" : e === 3 ? "</math>" : "")), i];
};
class B {
  constructor({ strings: e, _$litType$: s }, i) {
    let r;
    this.parts = [];
    let n = 0, a = 0;
    const d = e.length - 1, l = this.parts, [g, b] = Te(e, s);
    if (this.el = B.createElement(g, i), I.currentNode = this.el.content, s === 2 || s === 3) {
      const c = this.el.content.firstChild;
      c.replaceWith(...c.childNodes);
    }
    for (; (r = I.nextNode()) !== null && l.length < d; ) {
      if (r.nodeType === 1) {
        if (r.hasAttributes()) for (const c of r.getAttributeNames()) if (c.endsWith(ge)) {
          const m = b[a++], y = r.getAttribute(c).split(S), $ = /([.?@])?(.*)/.exec(m);
          l.push({ type: 1, index: n, name: $[2], strings: y, ctor: $[1] === "." ? Oe : $[1] === "?" ? Re : $[1] === "@" ? Ne : W }), r.removeAttribute(c);
        } else c.startsWith(S) && (l.push({ type: 6, index: n }), r.removeAttribute(c));
        if (fe.test(r.tagName)) {
          const c = r.textContent.split(S), m = c.length - 1;
          if (m > 0) {
            r.textContent = V ? V.emptyScript : "";
            for (let y = 0; y < m; y++) r.append(c[y], U()), I.nextNode(), l.push({ type: 2, index: ++n });
            r.append(c[m], U());
          }
        }
      } else if (r.nodeType === 8) if (r.data === be) l.push({ type: 2, index: n });
      else {
        let c = -1;
        for (; (c = r.data.indexOf(S, c + 1)) !== -1; ) l.push({ type: 7, index: n }), c += S.length - 1;
      }
      n++;
    }
  }
  static createElement(e, s) {
    const i = k.createElement("template");
    return i.innerHTML = e, i;
  }
}
function R(t, e, s = t, i) {
  if (e === O) return e;
  let r = i !== void 0 ? s._$Co?.[i] : s._$Cl;
  const n = j(e) ? void 0 : e._$litDirective$;
  return r?.constructor !== n && (r?._$AO?.(!1), n === void 0 ? r = void 0 : (r = new n(t), r._$AT(t, s, i)), i !== void 0 ? (s._$Co ??= [])[i] = r : s._$Cl = r), r !== void 0 && (e = R(t, r._$AS(t, e.values), r, i)), e;
}
class Me {
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
    const { el: { content: s }, parts: i } = this._$AD, r = (e?.creationScope ?? k).importNode(s, !0);
    I.currentNode = r;
    let n = I.nextNode(), a = 0, d = 0, l = i[0];
    for (; l !== void 0; ) {
      if (a === l.index) {
        let g;
        l.type === 2 ? g = new D(n, n.nextSibling, this, e) : l.type === 1 ? g = new l.ctor(n, l.name, l.strings, this, e) : l.type === 6 && (g = new Pe(n, this, e)), this._$AV.push(g), l = i[++d];
      }
      a !== l?.index && (n = I.nextNode(), a++);
    }
    return I.currentNode = k, r;
  }
  p(e) {
    let s = 0;
    for (const i of this._$AV) i !== void 0 && (i.strings !== void 0 ? (i._$AI(e, i, s), s += i.strings.length - 2) : i._$AI(e[s])), s++;
  }
}
class D {
  get _$AU() {
    return this._$AM?._$AU ?? this._$Cv;
  }
  constructor(e, s, i, r) {
    this.type = 2, this._$AH = f, this._$AN = void 0, this._$AA = e, this._$AB = s, this._$AM = i, this.options = r, this._$Cv = r?.isConnected ?? !0;
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
    e = R(this, e, s), j(e) ? e === f || e == null || e === "" ? (this._$AH !== f && this._$AR(), this._$AH = f) : e !== this._$AH && e !== O && this._(e) : e._$litType$ !== void 0 ? this.$(e) : e.nodeType !== void 0 ? this.T(e) : Ie(e) ? this.k(e) : this._(e);
  }
  O(e) {
    return this._$AA.parentNode.insertBefore(e, this._$AB);
  }
  T(e) {
    this._$AH !== e && (this._$AR(), this._$AH = this.O(e));
  }
  _(e) {
    this._$AH !== f && j(this._$AH) ? this._$AA.nextSibling.data = e : this.T(k.createTextNode(e)), this._$AH = e;
  }
  $(e) {
    const { values: s, _$litType$: i } = e, r = typeof i == "number" ? this._$AC(e) : (i.el === void 0 && (i.el = B.createElement(me(i.h, i.h[0]), this.options)), i);
    if (this._$AH?._$AD === r) this._$AH.p(s);
    else {
      const n = new Me(r, this), a = n.u(this.options);
      n.p(s), this.T(a), this._$AH = n;
    }
  }
  _$AC(e) {
    let s = ue.get(e.strings);
    return s === void 0 && ue.set(e.strings, s = new B(e)), s;
  }
  k(e) {
    ee(this._$AH) || (this._$AH = [], this._$AR());
    const s = this._$AH;
    let i, r = 0;
    for (const n of e) r === s.length ? s.push(i = new D(this.O(U()), this.O(U()), this, this.options)) : i = s[r], i._$AI(n), r++;
    r < s.length && (this._$AR(i && i._$AB.nextSibling, r), s.length = r);
  }
  _$AR(e = this._$AA.nextSibling, s) {
    for (this._$AP?.(!1, !0, s); e !== this._$AB; ) {
      const i = ae(e).nextSibling;
      ae(e).remove(), e = i;
    }
  }
  setConnected(e) {
    this._$AM === void 0 && (this._$Cv = e, this._$AP?.(e));
  }
}
class W {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(e, s, i, r, n) {
    this.type = 1, this._$AH = f, this._$AN = void 0, this.element = e, this.name = s, this._$AM = r, this.options = n, i.length > 2 || i[0] !== "" || i[1] !== "" ? (this._$AH = Array(i.length - 1).fill(new String()), this.strings = i) : this._$AH = f;
  }
  _$AI(e, s = this, i, r) {
    const n = this.strings;
    let a = !1;
    if (n === void 0) e = R(this, e, s, 0), a = !j(e) || e !== this._$AH && e !== O, a && (this._$AH = e);
    else {
      const d = e;
      let l, g;
      for (e = n[0], l = 0; l < n.length - 1; l++) g = R(this, d[i + l], s, l), g === O && (g = this._$AH[l]), a ||= !j(g) || g !== this._$AH[l], g === f ? e = f : e !== f && (e += (g ?? "") + n[l + 1]), this._$AH[l] = g;
    }
    a && !r && this.j(e);
  }
  j(e) {
    e === f ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, e ?? "");
  }
}
class Oe extends W {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(e) {
    this.element[this.name] = e === f ? void 0 : e;
  }
}
class Re extends W {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(e) {
    this.element.toggleAttribute(this.name, !!e && e !== f);
  }
}
class Ne extends W {
  constructor(e, s, i, r, n) {
    super(e, s, i, r, n), this.type = 5;
  }
  _$AI(e, s = this) {
    if ((e = R(this, e, s, 0) ?? f) === O) return;
    const i = this._$AH, r = e === f && i !== f || e.capture !== i.capture || e.once !== i.once || e.passive !== i.passive, n = e !== f && (i === f || r);
    r && this.element.removeEventListener(this.name, this, i), n && this.element.addEventListener(this.name, this, e), this._$AH = e;
  }
  handleEvent(e) {
    typeof this._$AH == "function" ? this._$AH.call(this.options?.host ?? this.element, e) : this._$AH.handleEvent(e);
  }
}
class Pe {
  constructor(e, s, i) {
    this.element = e, this.type = 6, this._$AN = void 0, this._$AM = s, this.options = i;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(e) {
    R(this, e);
  }
}
const Ue = Y.litHtmlPolyfillSupport;
Ue?.(B, D), (Y.litHtmlVersions ??= []).push("3.3.3");
const je = (t, e, s) => {
  const i = s?.renderBefore ?? e;
  let r = i._$litPart$;
  if (r === void 0) {
    const n = s?.renderBefore ?? null;
    i._$litPart$ = r = new D(e.insertBefore(U(), n), n, void 0, s ?? {});
  }
  return r._$AI(t), r;
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const te = globalThis;
class A extends M {
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
    return O;
  }
}
A._$litElement$ = !0, A.finalized = !0, te.litElementHydrateSupport?.({ LitElement: A });
const Be = te.litElementPolyfillSupport;
Be?.({ LitElement: A });
(te.litElementVersions ??= []).push("4.2.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const qe = { attribute: !0, type: String, converter: L, reflect: !1, hasChanged: X }, De = (t = qe, e, s) => {
  const { kind: i, metadata: r } = s;
  let n = globalThis.litPropertyMetadata.get(r);
  if (n === void 0 && globalThis.litPropertyMetadata.set(r, n = /* @__PURE__ */ new Map()), i === "setter" && ((t = Object.create(t)).wrapped = !0), n.set(s.name, t), i === "accessor") {
    const { name: a } = s;
    return { set(d) {
      const l = e.get.call(this);
      e.set.call(this, d), this.requestUpdate(a, l, t, !0, d);
    }, init(d) {
      return d !== void 0 && this.C(a, void 0, t, d), d;
    } };
  }
  if (i === "setter") {
    const { name: a } = s;
    return function(d) {
      const l = this[a];
      e.call(this, d), this.requestUpdate(a, l, t, !0, d);
    };
  }
  throw Error("Unsupported decorator location: " + i);
};
function v(t) {
  return (e, s) => typeof s == "object" ? De(t, e, s) : ((i, r, n) => {
    const a = r.hasOwnProperty(n);
    return r.constructor.createProperty(n, i), a ? Object.getOwnPropertyDescriptor(r, n) : void 0;
  })(t, e, s);
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function p(t) {
  return v({ ...t, state: !0, attribute: !1 });
}
function J(t) {
  return (e) => (typeof customElements < "u" && !customElements.get(t) && customElements.define(t, e), e);
}
const G = q`
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
`, He = "fuzzy_system/systems/list", Le = "fuzzy_system/systems/save", Ve = "fuzzy_system/systems/delete", Fe = "fuzzy_system/templates/list", We = "fuzzy_system/templates/instantiate";
async function Je(t) {
  const e = await t.callWS({
    type: He
  });
  return Array.isArray(e) ? e : e.systems || [];
}
async function Ge(t, e, s) {
  return t.callWS({
    type: Le,
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
async function Qe(t, e) {
  return t.callWS({
    type: Ve,
    entry_id: e
  });
}
async function Ze(t) {
  return (await t.callWS({
    type: Fe
  })).templates || [];
}
async function Ke(t, e, s, i) {
  return t.callWS({
    type: We,
    template_id: e,
    system_id: s,
    name: i
  });
}
var Xe = Object.defineProperty, Ye = Object.getOwnPropertyDescriptor, T = (t, e, s, i) => {
  for (var r = i > 1 ? void 0 : i ? Ye(e, s) : e, n = t.length - 1, a; n >= 0; n--)
    (a = t[n]) && (r = (i ? a(e, s, r) : a(r)) || r);
  return i && r && Xe(e, s, r), r;
};
let w = class extends A {
  constructor() {
    super(...arguments), this._systems = [], this._searchQuery = "", this._loading = !1, this._error = "", this._showTemplateModal = !1;
  }
  async connectedCallback() {
    super.connectedCallback(), this.hass && await this.refresh();
  }
  willUpdate(t) {
    t.has("hass") && this.hass && this._systems.length === 0 && !this._loading && this.refresh();
  }
  async refresh() {
    if (this.hass) {
      this._loading = !0, this._error = "";
      try {
        this._systems = await Je(this.hass);
      } catch (t) {
        this._error = t.message || "Failed to load fuzzy systems";
      } finally {
        this._loading = !1;
      }
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
        await Qe(this.hass, t.entry_id), await this.refresh();
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
w.styles = [
  G,
  q`
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
T([
  v({ attribute: !1 })
], w.prototype, "hass", 2);
T([
  p()
], w.prototype, "_systems", 2);
T([
  p()
], w.prototype, "_searchQuery", 2);
T([
  p()
], w.prototype, "_loading", 2);
T([
  p()
], w.prototype, "_error", 2);
T([
  p()
], w.prototype, "_showTemplateModal", 2);
w = T([
  J("fuzzy-system-catalog")
], w);
var et = Object.defineProperty, tt = Object.getOwnPropertyDescriptor, h = (t, e, s, i) => {
  for (var r = i > 1 ? void 0 : i ? tt(e, s) : e, n = t.length - 1, a; n >= 0; n--)
    (a = t[n]) && (r = (i ? a(e, s, r) : a(r)) || r);
  return i && r && et(e, s, r), r;
};
let u = class extends A {
  constructor() {
    super(...arguments), this.source = "config_entry", this._activeTab = "general", this._rawJson = "", this._saving = !1, this._error = "", this._successMsg = "", this._showAddInputModal = !1, this._newInputEntityId = "", this._newInputVarName = "", this._newInputMin = 0, this._newInputMax = 100, this._newInputTermsPreset = "3_terms", this._newInputModalError = "", this._showRuleBuilderModal = !1, this._editingRuleIndex = -1, this._builderConditions = [], this._builderConsequent = {
      variable: "",
      term: "",
      isConstant: !1,
      constantValue: 0
    }, this._ruleBuilderError = "", this._rulesViewMode = "visual";
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
      defuzzifier: "cog",
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
    this._config.inference = t, t === "sugeno" ? this._config.defuzzifier = "weighted_average" : this._config.defuzzifier = "cog", this.requestUpdate();
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
    this._config.rules && (this._config.rules = this._config.rules.map((t) => typeof t == "string" ? t.trim() : t).filter((t) => {
      if (!t) return !1;
      if (typeof t == "string") {
        const e = t.toUpperCase();
        return e !== "IF THEN" && e !== "IF  THEN" && !e.match(/^IF\s*THEN\s*$/);
      }
      return !0;
    })), this._saving = !0;
    try {
      const t = await Ge(this.hass, this._config, this.entryId);
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
  _openAddInputModal() {
    this._newInputEntityId = "", this._newInputVarName = "", this._newInputMin = 0, this._newInputMax = 100, this._newInputTermsPreset = "3_terms", this._newInputModalError = "", this._showAddInputModal = !0;
  }
  _onNewInputEntitySelected(t) {
    if (this._newInputEntityId = t, !t) return;
    const e = t.split(".")[1]?.replace(/[^a-z0-9_]/g, "_") || "";
    (!this._newInputVarName || this._newInputVarName.trim() === "") && (this._newInputVarName = e);
    const s = this.hass?.states ? this.hass.states[t] : null;
    if (s?.attributes) {
      const i = s.attributes.unit_of_measurement;
      i === "°C" ? (this._newInputMin = 10, this._newInputMax = 35) : i === "°F" ? (this._newInputMin = 50, this._newInputMax = 95) : i === "%" ? (this._newInputMin = 0, this._newInputMax = 100) : i === "lx" || i === "lux" ? (this._newInputMin = 0, this._newInputMax = 1e3) : i === "ppm" ? (this._newInputMin = 400, this._newInputMax = 2e3) : (i === "W" || i === "kW") && (this._newInputMin = 0, this._newInputMax = 5e3);
    }
    this.requestUpdate();
  }
  _confirmAddInput() {
    this._newInputModalError = "";
    const t = (this._newInputVarName || "").trim().toLowerCase().replace(/[^a-z0-9_]/g, "_");
    if (!t) {
      this._newInputModalError = "Please specify a linguistic variable name.";
      return;
    }
    if (this._config.inputs && this._config.inputs[t]) {
      this._newInputModalError = `An input variable named '${t}' already exists.`;
      return;
    }
    const e = Number.isFinite(this._newInputMin) ? this._newInputMin : 0, s = Number.isFinite(this._newInputMax) && this._newInputMax > e ? this._newInputMax : e + 100, i = s - e;
    let r;
    this._newInputTermsPreset === "5_terms" ? r = {
      very_low: { type: "trapmf", params: [e, e, e + i * 0.15, e + i * 0.3] },
      low: { type: "trimf", params: [e + i * 0.15, e + i * 0.35, e + i * 0.55] },
      medium: { type: "trimf", params: [e + i * 0.35, e + i * 0.5, e + i * 0.65] },
      high: { type: "trimf", params: [e + i * 0.45, e + i * 0.65, e + i * 0.85] },
      very_high: { type: "trapmf", params: [e + i * 0.7, e + i * 0.85, s, s] }
    } : r = {
      low: { type: "trapmf", params: [e, e, e + i * 0.25, e + i * 0.5] },
      medium: { type: "trimf", params: [e + i * 0.25, e + i * 0.5, e + i * 0.75] },
      high: { type: "trapmf", params: [e + i * 0.5, e + i * 0.75, s, s] }
    }, this._config.inputs || (this._config.inputs = {}), this._config.inputs[t] = {
      entity_id: this._newInputEntityId || "",
      range: [e, s],
      resolution: 100,
      default: e,
      terms: r
    }, this._showAddInputModal = !1, this.requestUpdate();
  }
  _getAvailableEntities() {
    if (!this.hass?.states) return [];
    const t = [];
    for (const [e, s] of Object.entries(this.hass.states)) {
      const i = e.split(".")[0];
      (i === "sensor" || i === "input_number" || i === "number" || i === "climate" || i === "weather") && t.push({
        entity_id: e,
        friendly_name: s.attributes?.friendly_name || e,
        unit: s.attributes?.unit_of_measurement || "",
        state: s.state
      });
    }
    return t.sort((e, s) => e.friendly_name.localeCompare(s.friendly_name)), t;
  }
  _renderEntityPicker(t, e, s) {
    const i = !!customElements.get("ha-entity-picker"), r = this._getAvailableEntities();
    return i ? o`
        <ha-entity-picker
          .hass=${this.hass}
          .value=${t || ""}
          ?disabled=${e}
          .includeDomains=${["sensor", "input_number", "number", "climate", "weather"]}
          @value-changed=${(n) => s(n.detail.value || "")}
        ></ha-entity-picker>
      ` : o`
      <div style="position: relative;">
        <input
          class="input-text"
          type="text"
          list="ha-fuzzy-entities"
          .value=${t || ""}
          ?disabled=${e}
          placeholder="Search entities (e.g. sensor.temperature)..."
          @input=${(n) => s(n.target.value)}
        />
        <datalist id="ha-fuzzy-entities">
          ${r.map(
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
  _renderEntityStatusTag(t) {
    if (!t || !t.trim())
      return o`
        <span class="badge badge-amber" title="This variable has no live sensor bound yet">
          ⚠️ Unbound (Add entity to track live values)
        </span>
      `;
    const e = this.hass?.states ? this.hass.states[t] : null;
    if (!e)
      return o`
        <span class="badge" style="background: rgba(239,68,68,0.15); color: #f87171;">
          ❓ ${t} (Not found in HA)
        </span>
      `;
    const s = e.attributes?.unit_of_measurement || "";
    return o`
      <span class="badge badge-emerald" title="Live sensor state in Home Assistant">
        🟢 Live: ${e.state} ${s}
      </span>
    `;
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
  _removeOutput(t) {
    confirm(`Delete output variable '${t}'?`) && (delete this._config.outputs[t], this.requestUpdate());
  }
  // --- Rules Handlers & Visual Builder ---
  _parseRuleToBuilder(t) {
    if (!t || !t.trim()) return null;
    const e = t.trim().match(/^IF\s+(.+)\s+THEN\s+(.+)$/i);
    if (!e) return null;
    const s = e[1].trim(), r = e[2].trim().match(/^([a-zA-Z0-9_]+)\s*(?:IS|=)\s*(.+)$/i);
    if (!r) return null;
    const n = r[1].trim(), a = r[2].trim(), d = parseFloat(a), l = !isNaN(d) && isFinite(d) && !a.match(/[a-zA-Z]/), g = s.split(/\s+(AND|OR)\s+/i), b = [];
    let c = "AND";
    for (let m = 0; m < g.length; m++) {
      const y = g[m].trim();
      if (!y) continue;
      if (y.toUpperCase() === "AND") {
        c = "AND";
        continue;
      }
      if (y.toUpperCase() === "OR") {
        c = "OR";
        continue;
      }
      const $ = y.match(
        /^([a-zA-Z0-9_]+)\s+IS\s+(?:(not|very|somewhat|extremely|slightly)\s+)?([a-zA-Z0-9_]+)$/i
      );
      if (!$) return null;
      b.push({
        variable: $[1].trim(),
        hedge: ($[2] || "").trim().toLowerCase(),
        term: $[3].trim(),
        connector: b.length === 0 ? "AND" : c
      });
    }
    return b.length === 0 ? null : {
      conditions: b,
      consequent: {
        variable: n,
        term: l ? "" : a,
        isConstant: l,
        constantValue: l ? d : 0
      }
    };
  }
  _compileRuleString(t, e) {
    const s = [];
    t.forEach((n, a) => {
      const d = n.hedge ? `${n.hedge} ` : "", l = `${n.variable} IS ${d}${n.term}`;
      a === 0 ? s.push(l) : s.push(`${n.connector} ${l}`);
    });
    const i = s.join(" "), r = e.isConstant ? `${e.variable} IS ${e.constantValue}` : `${e.variable} IS ${e.term}`;
    return `IF ${i} THEN ${r}`;
  }
  _openAddRuleBuilder() {
    this._ruleBuilderError = "";
    const t = Object.keys(this._config.inputs || {}), e = Object.keys(this._config.outputs || {});
    if (t.length === 0) {
      this._error = "Please define at least one input antecedent variable before creating rules.", this._activeTab = "inputs";
      return;
    }
    if (e.length === 0) {
      this._error = "Please define at least one output consequent variable before creating rules.", this._activeTab = "outputs";
      return;
    }
    const s = t[0], i = Object.keys(this._config.inputs[s]?.terms || {}), r = e[0], n = Object.keys(this._config.outputs[r]?.terms || {});
    this._editingRuleIndex = -1, this._builderConditions = [
      {
        variable: s,
        hedge: "",
        term: i[0] || "low",
        connector: "AND"
      }
    ], this._builderConsequent = {
      variable: r,
      term: n[0] || "low",
      isConstant: !1,
      constantValue: 0
    }, this._showRuleBuilderModal = !0;
  }
  _openEditRuleBuilder(t) {
    this._ruleBuilderError = "";
    const e = this._config.rules[t] || "", s = this._parseRuleToBuilder(e);
    if (s)
      this._editingRuleIndex = t, this._builderConditions = s.conditions, this._builderConsequent = s.consequent, this._showRuleBuilderModal = !0;
    else {
      const i = Object.keys(this._config.inputs || {}), r = Object.keys(this._config.outputs || {}), n = i[0] || "", a = Object.keys(this._config.inputs[n]?.terms || {}), d = r[0] || "", l = Object.keys(this._config.outputs[d]?.terms || {});
      this._editingRuleIndex = t, this._builderConditions = [
        {
          variable: n,
          hedge: "",
          term: a[0] || "low",
          connector: "AND"
        }
      ], this._builderConsequent = {
        variable: d,
        term: l[0] || "low",
        isConstant: !1,
        constantValue: 0
      }, this._ruleBuilderError = `Notice: Rule #${t + 1} uses non-standard formatting. Configuring it here will format it as canonical syntax.`, this._showRuleBuilderModal = !0;
    }
  }
  _onBuilderConditionVarChange(t, e) {
    const s = Object.keys(this._config.inputs[e]?.terms || {});
    this._builderConditions[t].variable = e, this._builderConditions[t].term = s[0] || "", this.requestUpdate();
  }
  _onBuilderConsequentVarChange(t) {
    const e = Object.keys(this._config.outputs[t]?.terms || {});
    this._builderConsequent.variable = t, this._builderConsequent.isConstant || (this._builderConsequent.term = e[0] || ""), this.requestUpdate();
  }
  _addBuilderCondition(t = "AND") {
    const s = Object.keys(this._config.inputs || {})[0] || "", i = Object.keys(this._config.inputs[s]?.terms || {});
    this._builderConditions.push({
      variable: s,
      hedge: "",
      term: i[0] || "",
      connector: t
    }), this.requestUpdate();
  }
  _removeBuilderCondition(t) {
    this._builderConditions.length <= 1 || (this._builderConditions.splice(t, 1), this.requestUpdate());
  }
  _saveBuilderRule() {
    if (this._ruleBuilderError = "", this._builderConditions.length === 0) {
      this._ruleBuilderError = "At least one antecedent condition is required.";
      return;
    }
    for (const e of this._builderConditions)
      if (!e.variable || !e.term) {
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
    const t = this._compileRuleString(
      this._builderConditions,
      this._builderConsequent
    );
    this._editingRuleIndex >= 0 ? this._config.rules[this._editingRuleIndex] = t : this._config.rules = [...this._config.rules, t], this._showRuleBuilderModal = !1, this.requestUpdate();
  }
  _addRule() {
    this._config.rules = [...this._config.rules, "IF  THEN "], this._rulesViewMode = "text", this.requestUpdate();
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

      ${this._showAddInputModal ? this._renderAddInputModal() : ""}
      ${this._showRuleBuilderModal ? this._renderRuleBuilderModal() : ""}
    `;
  }
  _renderAddInputModal() {
    return o`
      <div
        class="modal-overlay"
        @click=${(t) => {
      t.target.classList.contains("modal-overlay") && (this._showAddInputModal = !1);
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
      (t) => this._onNewInputEntitySelected(t)
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
              @input=${(t) => this._newInputVarName = t.target.value.toLowerCase().replace(/[^a-z0-9_]/g, "_")}
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
                @input=${(t) => this._newInputMin = parseFloat(t.target.value)}
              />
            </div>
            <div class="form-group">
              <label class="form-label">Range Maximum</label>
              <input
                class="input-text"
                type="number"
                .value=${String(this._newInputMax)}
                @input=${(t) => this._newInputMax = parseFloat(t.target.value)}
              />
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Initial Linguistic Terms Preset</label>
            <select
              class="input-select"
              .value=${this._newInputTermsPreset}
              @change=${(t) => this._newInputTermsPreset = t.target.value}
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
            .value=${this._config.defuzzifier || (this._config.inference === "sugeno" ? "weighted_average" : "cog")}
            ?disabled=${t}
            @change=${(e) => this._config.defuzzifier = e.target.value}
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
              <button class="btn btn-secondary" @click=${this._openAddInputModal}>
                + Add Input Variable
              </button>
            `}
      </div>

      ${s.length === 0 ? o`<p class="subtitle" style="padding: 20px 0;">No input variables defined yet.</p>` : s.map((i) => {
      const r = e[i];
      return o`
              <div class="section-box">
                <div class="section-header">
                  <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
                    <span class="badge badge-cyan">${i}</span>
                    ${this._renderEntityStatusTag(r.entity_id)}
                    <span class="chip">Range: [${r.range[0]}, ${r.range[1]}]</span>
                  </div>
                  ${t ? "" : o`
                        <button class="btn btn-danger btn-icon" @click=${() => this._removeInput(i)} title="Delete Input">
                          ✕
                        </button>
                      `}
                </div>

                <div class="grid-2">
                  <div class="form-group">
                    <label class="form-label">Bound Home Assistant Sensor Entity</label>
                    ${this._renderEntityPicker(r.entity_id, t, (n) => {
        r.entity_id = n, this.requestUpdate();
      })}
                    <div class="helper-text">
                      ${r.entity_id ? o`Feeds live numerical measurements from <code>${r.entity_id}</code> into <code>${i}</code>.` : o`<span style="color: #fbbf24;">⚠️ Unbound: select an entity to evaluate live rules in HA.</span>`}
                    </div>
                  </div>

                  <div class="grid-2">
                    <div class="form-group">
                      <label class="form-label">Range Min</label>
                      <input
                        class="input-text"
                        type="number"
                        .value=${String(r.range[0])}
                        ?disabled=${t}
                        @input=${(n) => {
        r.range[0] = parseFloat(n.target.value), this.requestUpdate();
      }}
                      />
                    </div>
                    <div class="form-group">
                      <label class="form-label">Range Max</label>
                      <input
                        class="input-text"
                        type="number"
                        .value=${String(r.range[1])}
                        ?disabled=${t}
                        @input=${(n) => {
        r.range[1] = parseFloat(n.target.value), this.requestUpdate();
      }}
                      />
                    </div>
                  </div>
                </div>

                <div style="margin-top: 8px;">
                  <span class="helper-text">Linguistic Terms: </span>
                  ${Object.keys(r.terms || {}).map(
        (n) => o`<span class="badge" style="margin-right: 4px;">${n} (${r.terms[n].type})</span>`
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

      ${s.length === 0 ? o`<p class="subtitle" style="padding: 20px 0;">No output variables defined yet.</p>` : s.map((i) => {
      const r = e[i];
      return o`
              <div class="section-box">
                <div class="section-header">
                  <div style="display: flex; align-items: center; gap: 8px;">
                    <span class="badge badge-amber">${i}</span>
                    <span class="chip">Range: [${r.range[0]}, ${r.range[1]}]</span>
                    ${r.unit_of_measurement ? o`<span class="chip">${r.unit_of_measurement}</span>` : ""}
                  </div>
                  ${t ? "" : o`
                        <button class="btn btn-danger btn-icon" @click=${() => this._removeOutput(i)} title="Delete Output">
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
                      .value=${String(r.range[0])}
                      ?disabled=${t}
                      @input=${(n) => {
        r.range[0] = parseFloat(n.target.value), this.requestUpdate();
      }}
                    />
                  </div>
                  <div class="form-group">
                    <label class="form-label">Range Max</label>
                    <input
                      class="input-text"
                      type="number"
                      .value=${String(r.range[1])}
                      ?disabled=${t}
                      @input=${(n) => {
        r.range[1] = parseFloat(n.target.value), this.requestUpdate();
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
                      .value=${r.epsilon !== void 0 ? String(r.epsilon) : ""}
                      ?disabled=${t}
                      @input=${(n) => {
        const a = n.target.value.trim();
        r.epsilon = a ? parseFloat(a) : void 0, this.requestUpdate();
      }}
                    />
                  </div>
                </div>

                <div style="margin-top: 8px;">
                  <span class="helper-text">Linguistic Terms: </span>
                  ${Object.keys(r.terms || {}).map(
        (n) => o`<span class="badge" style="margin-right: 4px;">${n} (${r.terms[n].type})</span>`
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
      <div
        style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; flex-wrap: wrap; gap: 12px;"
      >
        <div>
          <h3 class="section-title">Linguistic Rules</h3>
          <p class="helper-text">
            Declarative IF &lt;antecedents&gt; THEN &lt;consequents&gt; with AND, OR, NOT and linguistic hedges
          </p>
        </div>
        ${t ? "" : o`
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

      ${e.length === 0 ? o`
            <div
              style="text-align: center; padding: 40px 20px; background: rgba(15, 23, 42, 0.3); border-radius: var(--fuzzy-radius-md); border: 1px dashed var(--fuzzy-card-border);"
            >
              <div style="font-size: 28px; margin-bottom: 8px;">📜</div>
              <h4 style="font-weight: 600; margin-bottom: 6px;">No Inference Rules Defined Yet</h4>
              <p class="helper-text" style="margin-bottom: 18px;">
                Rules map your input linguistic terms (e.g. temperature IS hot) to output targets (e.g. fan_speed IS fast).
              </p>
              ${t ? "" : o`
                    <button class="btn btn-primary" @click=${this._openAddRuleBuilder}>
                      ✨ Create First Rule with Builder
                    </button>
                  `}
            </div>
          ` : this._rulesViewMode === "visual" ? e.map((s, i) => {
      const r = this._parseRuleToBuilder(s);
      return r ? o`
              <div class="rule-card">
                <div style="display: flex; flex-direction: column; gap: 8px; flex: 1;">
                  <div style="display: flex; align-items: center; gap: 6px; flex-wrap: wrap;">
                    <span class="badge badge-purple" style="width: 24px; justify-content: center;">${i + 1}</span>
                    <span class="badge badge-cyan">IF</span>
                    ${r.conditions.map(
        (n, a) => o`
                        ${a > 0 ? o`<span class="badge badge-purple">${n.connector}</span>` : ""}
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
                      ${r.consequent.variable}
                    </span>
                    <span class="chip" style="color: #94a3b8;">is</span>
                    <span class="chip" style="font-weight: 600; color: #34d399; background: rgba(52, 211, 153, 0.1);">
                      ${r.consequent.isConstant ? r.consequent.constantValue : r.consequent.term}
                    </span>
                  </div>
                  <div style="font-family: monospace; font-size: 11px; color: var(--fuzzy-text-secondary); padding-left: 32px;">
                    ${s}
                  </div>
                </div>

                ${t ? "" : o`
                      <div style="display: flex; gap: 8px; align-items: center;">
                        <button
                          class="btn btn-secondary"
                          style="padding: 6px 12px; font-size: 12px;"
                          @click=${() => this._openEditRuleBuilder(i)}
                          title="Edit in Visual Builder"
                        >
                          ✏️ Edit
                        </button>
                        <button
                          class="btn btn-danger btn-icon"
                          @click=${() => this._removeRule(i)}
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
                    <span class="badge badge-purple" style="width: 24px; justify-content: center;">${i + 1}</span>
                    <span style="font-family: monospace; font-size: 13px;">${s}</span>
                  </div>
                  ${t ? "" : o`
                        <div style="display: flex; gap: 8px; align-items: center;">
                          <button
                            class="btn btn-secondary"
                            style="padding: 6px 12px; font-size: 12px;"
                            @click=${() => this._openEditRuleBuilder(i)}
                          >
                            ✏️ Builder
                          </button>
                          <button
                            class="btn btn-danger btn-icon"
                            @click=${() => this._removeRule(i)}
                            title="Delete Rule"
                          >
                            ✕
                          </button>
                        </div>
                      `}
                </div>
              `;
    }) : e.map(
      (s, i) => o`
              <div class="rule-item">
                <span class="badge badge-purple" style="width: 24px; justify-content: center;">${i + 1}</span>
                <input
                  class="input-text rule-input"
                  type="text"
                  .value=${s}
                  ?disabled=${t}
                  @input=${(r) => this._updateRule(i, r.target.value)}
                />
                ${t ? "" : o`
                      <button
                        class="btn btn-secondary"
                        style="padding: 6px 10px; font-size: 12px;"
                        @click=${() => this._openEditRuleBuilder(i)}
                        title="Edit in Visual Builder"
                      >
                        ✏️
                      </button>
                      <button
                        class="btn btn-danger btn-icon"
                        @click=${() => this._removeRule(i)}
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
    const t = Object.keys(this._config.inputs || {}), e = Object.keys(this._config.outputs || {});
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

            ${this._builderConditions.map((s, i) => {
      const r = Object.keys(this._config.inputs[s.variable]?.terms || {});
      return o`
                <div class="builder-row">
                  ${i > 0 ? o`
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
                    @change=${(n) => this._onBuilderConditionVarChange(i, n.target.value)}
                  >
                    ${t.map((n) => o`<option value=${n}>${n}</option>`)}
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
                    ${r.map((n) => o`<option value=${n}>${n}</option>`)}
                  </select>

                  ${this._builderConditions.length > 1 ? o`
                        <button
                          class="btn btn-danger btn-icon"
                          title="Remove Condition"
                          @click=${() => this._removeBuilderCondition(i)}
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
                ${e.map((s) => o`<option value=${s}>${s}</option>`)}
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
u.styles = [
  G,
  q`
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
h([
  v({ attribute: !1 })
], u.prototype, "hass", 2);
h([
  v({ type: Object })
], u.prototype, "systemConfig", 2);
h([
  v({ type: String })
], u.prototype, "entryId", 2);
h([
  v({ type: String })
], u.prototype, "source", 2);
h([
  p()
], u.prototype, "_activeTab", 2);
h([
  p()
], u.prototype, "_config", 2);
h([
  p()
], u.prototype, "_rawJson", 2);
h([
  p()
], u.prototype, "_saving", 2);
h([
  p()
], u.prototype, "_error", 2);
h([
  p()
], u.prototype, "_successMsg", 2);
h([
  p()
], u.prototype, "_showAddInputModal", 2);
h([
  p()
], u.prototype, "_newInputEntityId", 2);
h([
  p()
], u.prototype, "_newInputVarName", 2);
h([
  p()
], u.prototype, "_newInputMin", 2);
h([
  p()
], u.prototype, "_newInputMax", 2);
h([
  p()
], u.prototype, "_newInputTermsPreset", 2);
h([
  p()
], u.prototype, "_newInputModalError", 2);
h([
  p()
], u.prototype, "_showRuleBuilderModal", 2);
h([
  p()
], u.prototype, "_editingRuleIndex", 2);
h([
  p()
], u.prototype, "_builderConditions", 2);
h([
  p()
], u.prototype, "_builderConsequent", 2);
h([
  p()
], u.prototype, "_ruleBuilderError", 2);
h([
  p()
], u.prototype, "_rulesViewMode", 2);
u = h([
  J("fuzzy-system-editor")
], u);
var st = Object.defineProperty, it = Object.getOwnPropertyDescriptor, E = (t, e, s, i) => {
  for (var r = i > 1 ? void 0 : i ? it(e, s) : e, n = t.length - 1, a; n >= 0; n--)
    (a = t[n]) && (r = (i ? a(e, s, r) : a(r)) || r);
  return i && r && st(e, s, r), r;
};
let x = class extends A {
  constructor() {
    super(...arguments), this._templates = [], this._selectedTemplate = null, this._systemId = "", this._systemName = "", this._loading = !1, this._error = "";
  }
  async connectedCallback() {
    super.connectedCallback(), this.hass && await this._loadTemplates();
  }
  willUpdate(t) {
    t.has("hass") && this.hass && this._templates.length === 0 && !this._loading && this._loadTemplates();
  }
  async _loadTemplates() {
    if (this.hass) {
      this._loading = !0;
      try {
        this._templates = await Ze(this.hass);
      } catch (t) {
        this._error = t.message || "Failed to load templates";
      } finally {
        this._loading = !1;
      }
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
x.styles = [
  G,
  q`
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
E([
  v({ attribute: !1 })
], x.prototype, "hass", 2);
E([
  p()
], x.prototype, "_templates", 2);
E([
  p()
], x.prototype, "_selectedTemplate", 2);
E([
  p()
], x.prototype, "_systemId", 2);
E([
  p()
], x.prototype, "_systemName", 2);
E([
  p()
], x.prototype, "_loading", 2);
E([
  p()
], x.prototype, "_error", 2);
x = E([
  J("fuzzy-template-modal")
], x);
var rt = Object.defineProperty, nt = Object.getOwnPropertyDescriptor, z = (t, e, s, i) => {
  for (var r = i > 1 ? void 0 : i ? nt(e, s) : e, n = t.length - 1, a; n >= 0; n--)
    (a = t[n]) && (r = (i ? a(e, s, r) : a(r)) || r);
  return i && r && rt(e, s, r), r;
};
let _ = class extends A {
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
_.styles = [
  G,
  q`
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
z([
  v({ attribute: !1 })
], _.prototype, "hass", 2);
z([
  v({ type: Boolean })
], _.prototype, "narrow", 2);
z([
  v({ type: Object })
], _.prototype, "route", 2);
z([
  v({ type: Object })
], _.prototype, "panel", 2);
z([
  p()
], _.prototype, "_view", 2);
z([
  p()
], _.prototype, "_selectedConfig", 2);
z([
  p()
], _.prototype, "_selectedEntryId", 2);
z([
  p()
], _.prototype, "_selectedSource", 2);
_ = z([
  J("fuzzy-system-panel")
], _);
export {
  _ as FuzzySystemPanel
};
