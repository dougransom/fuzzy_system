/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const F = globalThis, Z = F.ShadowRoot && (F.ShadyCSS === void 0 || F.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, K = Symbol(), se = /* @__PURE__ */ new WeakMap();
let he = class {
  constructor(e, i, s) {
    if (this._$cssResult$ = !0, s !== K) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = e, this.t = i;
  }
  get styleSheet() {
    let e = this.o;
    const i = this.t;
    if (Z && e === void 0) {
      const s = i !== void 0 && i.length === 1;
      s && (e = se.get(i)), e === void 0 && ((this.o = e = new CSSStyleSheet()).replaceSync(this.cssText), s && se.set(i, e));
    }
    return e;
  }
  toString() {
    return this.cssText;
  }
};
const ye = (t) => new he(typeof t == "string" ? t : t + "", void 0, K), H = (t, ...e) => {
  const i = t.length === 1 ? t[0] : e.reduce((s, a, r) => s + ((n) => {
    if (n._$cssResult$ === !0) return n.cssText;
    if (typeof n == "number") return n;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + n + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(a) + t[r + 1], t[0]);
  return new he(i, t, K);
}, _e = (t, e) => {
  if (Z) t.adoptedStyleSheets = e.map((i) => i instanceof CSSStyleSheet ? i : i.styleSheet);
  else for (const i of e) {
    const s = document.createElement("style"), a = F.litNonce;
    a !== void 0 && s.setAttribute("nonce", a), s.textContent = i.cssText, t.appendChild(s);
  }
}, ie = Z ? (t) => t : (t) => t instanceof CSSStyleSheet ? ((e) => {
  let i = "";
  for (const s of e.cssRules) i += s.cssText;
  return ye(i);
})(t) : t;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const { is: ve, defineProperty: $e, getOwnPropertyDescriptor: xe, getOwnPropertyNames: we, getOwnPropertySymbols: ze, getPrototypeOf: Se } = Object, V = globalThis, ae = V.trustedTypes, Ae = ae ? ae.emptyScript : "", Ee = V.reactiveElementPolyfillSupport, N = (t, e) => t, B = { toAttribute(t, e) {
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
  let i = t;
  switch (e) {
    case Boolean:
      i = t !== null;
      break;
    case Number:
      i = t === null ? null : Number(t);
      break;
    case Object:
    case Array:
      try {
        i = JSON.parse(t);
      } catch {
        i = null;
      }
  }
  return i;
} }, X = (t, e) => !ve(t, e), re = { attribute: !0, type: String, converter: B, reflect: !1, useDefault: !1, hasChanged: X };
Symbol.metadata ??= Symbol("metadata"), V.litPropertyMetadata ??= /* @__PURE__ */ new WeakMap();
let k = class extends HTMLElement {
  static addInitializer(e) {
    this._$Ei(), (this.l ??= []).push(e);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(e, i = re) {
    if (i.state && (i.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(e) && ((i = Object.create(i)).wrapped = !0), this.elementProperties.set(e, i), !i.noAccessor) {
      const s = Symbol(), a = this.getPropertyDescriptor(e, s, i);
      a !== void 0 && $e(this.prototype, e, a);
    }
  }
  static getPropertyDescriptor(e, i, s) {
    const { get: a, set: r } = xe(this.prototype, e) ?? { get() {
      return this[i];
    }, set(n) {
      this[i] = n;
    } };
    return { get: a, set(n) {
      const d = a?.call(this);
      r?.call(this, n), this.requestUpdate(e, d, s);
    }, configurable: !0, enumerable: !0 };
  }
  static getPropertyOptions(e) {
    return this.elementProperties.get(e) ?? re;
  }
  static _$Ei() {
    if (this.hasOwnProperty(N("elementProperties"))) return;
    const e = Se(this);
    e.finalize(), e.l !== void 0 && (this.l = [...e.l]), this.elementProperties = new Map(e.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(N("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(N("properties"))) {
      const i = this.properties, s = [...we(i), ...ze(i)];
      for (const a of s) this.createProperty(a, i[a]);
    }
    const e = this[Symbol.metadata];
    if (e !== null) {
      const i = litPropertyMetadata.get(e);
      if (i !== void 0) for (const [s, a] of i) this.elementProperties.set(s, a);
    }
    this._$Eh = /* @__PURE__ */ new Map();
    for (const [i, s] of this.elementProperties) {
      const a = this._$Eu(i, s);
      a !== void 0 && this._$Eh.set(a, i);
    }
    this.elementStyles = this.finalizeStyles(this.styles);
  }
  static finalizeStyles(e) {
    const i = [];
    if (Array.isArray(e)) {
      const s = new Set(e.flat(1 / 0).reverse());
      for (const a of s) i.unshift(ie(a));
    } else e !== void 0 && i.push(ie(e));
    return i;
  }
  static _$Eu(e, i) {
    const s = i.attribute;
    return s === !1 ? void 0 : typeof s == "string" ? s : typeof e == "string" ? e.toLowerCase() : void 0;
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
    const e = /* @__PURE__ */ new Map(), i = this.constructor.elementProperties;
    for (const s of i.keys()) this.hasOwnProperty(s) && (e.set(s, this[s]), delete this[s]);
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
  attributeChangedCallback(e, i, s) {
    this._$AK(e, s);
  }
  _$ET(e, i) {
    const s = this.constructor.elementProperties.get(e), a = this.constructor._$Eu(e, s);
    if (a !== void 0 && s.reflect === !0) {
      const r = (s.converter?.toAttribute !== void 0 ? s.converter : B).toAttribute(i, s.type);
      this._$Em = e, r == null ? this.removeAttribute(a) : this.setAttribute(a, r), this._$Em = null;
    }
  }
  _$AK(e, i) {
    const s = this.constructor, a = s._$Eh.get(e);
    if (a !== void 0 && this._$Em !== a) {
      const r = s.getPropertyOptions(a), n = typeof r.converter == "function" ? { fromAttribute: r.converter } : r.converter?.fromAttribute !== void 0 ? r.converter : B;
      this._$Em = a;
      const d = n.fromAttribute(i, r.type);
      this[a] = d ?? this._$Ej?.get(a) ?? d, this._$Em = null;
    }
  }
  requestUpdate(e, i, s, a = !1, r) {
    if (e !== void 0) {
      const n = this.constructor;
      if (a === !1 && (r = this[e]), s ??= n.getPropertyOptions(e), !((s.hasChanged ?? X)(r, i) || s.useDefault && s.reflect && r === this._$Ej?.get(e) && !this.hasAttribute(n._$Eu(e, s)))) return;
      this.C(e, i, s);
    }
    this.isUpdatePending === !1 && (this._$ES = this._$EP());
  }
  C(e, i, { useDefault: s, reflect: a, wrapped: r }, n) {
    s && !(this._$Ej ??= /* @__PURE__ */ new Map()).has(e) && (this._$Ej.set(e, n ?? i ?? this[e]), r !== !0 || n !== void 0) || (this._$AL.has(e) || (this.hasUpdated || s || (i = void 0), this._$AL.set(e, i)), a === !0 && this._$Em !== e && (this._$Eq ??= /* @__PURE__ */ new Set()).add(e));
  }
  async _$EP() {
    this.isUpdatePending = !0;
    try {
      await this._$ES;
    } catch (i) {
      Promise.reject(i);
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
        for (const [a, r] of this._$Ep) this[a] = r;
        this._$Ep = void 0;
      }
      const s = this.constructor.elementProperties;
      if (s.size > 0) for (const [a, r] of s) {
        const { wrapped: n } = r, d = this[a];
        n !== !0 || this._$AL.has(a) || d === void 0 || this.C(a, void 0, r, d);
      }
    }
    let e = !1;
    const i = this._$AL;
    try {
      e = this.shouldUpdate(i), e ? (this.willUpdate(i), this._$EO?.forEach((s) => s.hostUpdate?.()), this.update(i)) : this._$EM();
    } catch (s) {
      throw e = !1, this._$EM(), s;
    }
    e && this._$AE(i);
  }
  willUpdate(e) {
  }
  _$AE(e) {
    this._$EO?.forEach((i) => i.hostUpdated?.()), this.hasUpdated || (this.hasUpdated = !0, this.firstUpdated(e)), this.updated(e);
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
    this._$Eq &&= this._$Eq.forEach((i) => this._$ET(i, this[i])), this._$EM();
  }
  updated(e) {
  }
  firstUpdated(e) {
  }
};
k.elementStyles = [], k.shadowRootOptions = { mode: "open" }, k[N("elementProperties")] = /* @__PURE__ */ new Map(), k[N("finalized")] = /* @__PURE__ */ new Map(), Ee?.({ ReactiveElement: k }), (V.reactiveElementVersions ??= []).push("2.1.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Y = globalThis, ne = (t) => t, q = Y.trustedTypes, oe = q ? q.createPolicy("lit-html", { createHTML: (t) => t }) : void 0, me = "$lit$", z = `lit$${Math.random().toFixed(9).slice(2)}$`, ge = "?" + z, Ie = `<${ge}>`, T = document, U = () => T.createComment(""), R = (t) => t === null || typeof t != "object" && typeof t != "function", ee = Array.isArray, Te = (t) => ee(t) || typeof t?.[Symbol.iterator] == "function", G = `[ 	
\f\r]`, O = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, le = /-->/g, de = />/g, E = RegExp(`>|${G}(?:([^\\s"'>=/]+)(${G}*=${G}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), pe = /'/g, ce = /"/g, fe = /^(?:script|style|textarea|title)$/i, Me = (t) => (e, ...i) => ({ _$litType$: t, strings: e, values: i }), o = Me(1), C = Symbol.for("lit-noChange"), m = Symbol.for("lit-nothing"), ue = /* @__PURE__ */ new WeakMap(), I = T.createTreeWalker(T, 129);
function be(t, e) {
  if (!ee(t) || !t.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return oe !== void 0 ? oe.createHTML(e) : e;
}
const ke = (t, e) => {
  const i = t.length - 1, s = [];
  let a, r = e === 2 ? "<svg>" : e === 3 ? "<math>" : "", n = O;
  for (let d = 0; d < i; d++) {
    const l = t[d];
    let h, f, c = -1, v = 0;
    for (; v < l.length && (n.lastIndex = v, f = n.exec(l), f !== null); ) v = n.lastIndex, n === O ? f[1] === "!--" ? n = le : f[1] !== void 0 ? n = de : f[2] !== void 0 ? (fe.test(f[2]) && (a = RegExp("</" + f[2], "g")), n = E) : f[3] !== void 0 && (n = E) : n === E ? f[0] === ">" ? (n = a ?? O, c = -1) : f[1] === void 0 ? c = -2 : (c = n.lastIndex - f[2].length, h = f[1], n = f[3] === void 0 ? E : f[3] === '"' ? ce : pe) : n === ce || n === pe ? n = E : n === le || n === de ? n = O : (n = E, a = void 0);
    const w = n === E && t[d + 1].startsWith("/>") ? " " : "";
    r += n === O ? l + Ie : c >= 0 ? (s.push(h), l.slice(0, c) + me + l.slice(c) + z + w) : l + z + (c === -2 ? d : w);
  }
  return [be(t, r + (t[i] || "<?>") + (e === 2 ? "</svg>" : e === 3 ? "</math>" : "")), s];
};
class j {
  constructor({ strings: e, _$litType$: i }, s) {
    let a;
    this.parts = [];
    let r = 0, n = 0;
    const d = e.length - 1, l = this.parts, [h, f] = ke(e, i);
    if (this.el = j.createElement(h, s), I.currentNode = this.el.content, i === 2 || i === 3) {
      const c = this.el.content.firstChild;
      c.replaceWith(...c.childNodes);
    }
    for (; (a = I.nextNode()) !== null && l.length < d; ) {
      if (a.nodeType === 1) {
        if (a.hasAttributes()) for (const c of a.getAttributeNames()) if (c.endsWith(me)) {
          const v = f[n++], w = a.getAttribute(c).split(z), L = /([.?@])?(.*)/.exec(v);
          l.push({ type: 1, index: r, name: L[2], strings: w, ctor: L[1] === "." ? Pe : L[1] === "?" ? Oe : L[1] === "@" ? Ne : W }), a.removeAttribute(c);
        } else c.startsWith(z) && (l.push({ type: 6, index: r }), a.removeAttribute(c));
        if (fe.test(a.tagName)) {
          const c = a.textContent.split(z), v = c.length - 1;
          if (v > 0) {
            a.textContent = q ? q.emptyScript : "";
            for (let w = 0; w < v; w++) a.append(c[w], U()), I.nextNode(), l.push({ type: 2, index: ++r });
            a.append(c[v], U());
          }
        }
      } else if (a.nodeType === 8) if (a.data === ge) l.push({ type: 2, index: r });
      else {
        let c = -1;
        for (; (c = a.data.indexOf(z, c + 1)) !== -1; ) l.push({ type: 7, index: r }), c += z.length - 1;
      }
      r++;
    }
  }
  static createElement(e, i) {
    const s = T.createElement("template");
    return s.innerHTML = e, s;
  }
}
function P(t, e, i = t, s) {
  if (e === C) return e;
  let a = s !== void 0 ? i._$Co?.[s] : i._$Cl;
  const r = R(e) ? void 0 : e._$litDirective$;
  return a?.constructor !== r && (a?._$AO?.(!1), r === void 0 ? a = void 0 : (a = new r(t), a._$AT(t, i, s)), s !== void 0 ? (i._$Co ??= [])[s] = a : i._$Cl = a), a !== void 0 && (e = P(t, a._$AS(t, e.values), a, s)), e;
}
class Ce {
  constructor(e, i) {
    this._$AV = [], this._$AN = void 0, this._$AD = e, this._$AM = i;
  }
  get parentNode() {
    return this._$AM.parentNode;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  u(e) {
    const { el: { content: i }, parts: s } = this._$AD, a = (e?.creationScope ?? T).importNode(i, !0);
    I.currentNode = a;
    let r = I.nextNode(), n = 0, d = 0, l = s[0];
    for (; l !== void 0; ) {
      if (n === l.index) {
        let h;
        l.type === 2 ? h = new D(r, r.nextSibling, this, e) : l.type === 1 ? h = new l.ctor(r, l.name, l.strings, this, e) : l.type === 6 && (h = new Ue(r, this, e)), this._$AV.push(h), l = s[++d];
      }
      n !== l?.index && (r = I.nextNode(), n++);
    }
    return I.currentNode = T, a;
  }
  p(e) {
    let i = 0;
    for (const s of this._$AV) s !== void 0 && (s.strings !== void 0 ? (s._$AI(e, s, i), i += s.strings.length - 2) : s._$AI(e[i])), i++;
  }
}
class D {
  get _$AU() {
    return this._$AM?._$AU ?? this._$Cv;
  }
  constructor(e, i, s, a) {
    this.type = 2, this._$AH = m, this._$AN = void 0, this._$AA = e, this._$AB = i, this._$AM = s, this.options = a, this._$Cv = a?.isConnected ?? !0;
  }
  get parentNode() {
    let e = this._$AA.parentNode;
    const i = this._$AM;
    return i !== void 0 && e?.nodeType === 11 && (e = i.parentNode), e;
  }
  get startNode() {
    return this._$AA;
  }
  get endNode() {
    return this._$AB;
  }
  _$AI(e, i = this) {
    e = P(this, e, i), R(e) ? e === m || e == null || e === "" ? (this._$AH !== m && this._$AR(), this._$AH = m) : e !== this._$AH && e !== C && this._(e) : e._$litType$ !== void 0 ? this.$(e) : e.nodeType !== void 0 ? this.T(e) : Te(e) ? this.k(e) : this._(e);
  }
  O(e) {
    return this._$AA.parentNode.insertBefore(e, this._$AB);
  }
  T(e) {
    this._$AH !== e && (this._$AR(), this._$AH = this.O(e));
  }
  _(e) {
    this._$AH !== m && R(this._$AH) ? this._$AA.nextSibling.data = e : this.T(T.createTextNode(e)), this._$AH = e;
  }
  $(e) {
    const { values: i, _$litType$: s } = e, a = typeof s == "number" ? this._$AC(e) : (s.el === void 0 && (s.el = j.createElement(be(s.h, s.h[0]), this.options)), s);
    if (this._$AH?._$AD === a) this._$AH.p(i);
    else {
      const r = new Ce(a, this), n = r.u(this.options);
      r.p(i), this.T(n), this._$AH = r;
    }
  }
  _$AC(e) {
    let i = ue.get(e.strings);
    return i === void 0 && ue.set(e.strings, i = new j(e)), i;
  }
  k(e) {
    ee(this._$AH) || (this._$AH = [], this._$AR());
    const i = this._$AH;
    let s, a = 0;
    for (const r of e) a === i.length ? i.push(s = new D(this.O(U()), this.O(U()), this, this.options)) : s = i[a], s._$AI(r), a++;
    a < i.length && (this._$AR(s && s._$AB.nextSibling, a), i.length = a);
  }
  _$AR(e = this._$AA.nextSibling, i) {
    for (this._$AP?.(!1, !0, i); e !== this._$AB; ) {
      const s = ne(e).nextSibling;
      ne(e).remove(), e = s;
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
  constructor(e, i, s, a, r) {
    this.type = 1, this._$AH = m, this._$AN = void 0, this.element = e, this.name = i, this._$AM = a, this.options = r, s.length > 2 || s[0] !== "" || s[1] !== "" ? (this._$AH = Array(s.length - 1).fill(new String()), this.strings = s) : this._$AH = m;
  }
  _$AI(e, i = this, s, a) {
    const r = this.strings;
    let n = !1;
    if (r === void 0) e = P(this, e, i, 0), n = !R(e) || e !== this._$AH && e !== C, n && (this._$AH = e);
    else {
      const d = e;
      let l, h;
      for (e = r[0], l = 0; l < r.length - 1; l++) h = P(this, d[s + l], i, l), h === C && (h = this._$AH[l]), n ||= !R(h) || h !== this._$AH[l], h === m ? e = m : e !== m && (e += (h ?? "") + r[l + 1]), this._$AH[l] = h;
    }
    n && !a && this.j(e);
  }
  j(e) {
    e === m ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, e ?? "");
  }
}
class Pe extends W {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(e) {
    this.element[this.name] = e === m ? void 0 : e;
  }
}
class Oe extends W {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(e) {
    this.element.toggleAttribute(this.name, !!e && e !== m);
  }
}
class Ne extends W {
  constructor(e, i, s, a, r) {
    super(e, i, s, a, r), this.type = 5;
  }
  _$AI(e, i = this) {
    if ((e = P(this, e, i, 0) ?? m) === C) return;
    const s = this._$AH, a = e === m && s !== m || e.capture !== s.capture || e.once !== s.once || e.passive !== s.passive, r = e !== m && (s === m || a);
    a && this.element.removeEventListener(this.name, this, s), r && this.element.addEventListener(this.name, this, e), this._$AH = e;
  }
  handleEvent(e) {
    typeof this._$AH == "function" ? this._$AH.call(this.options?.host ?? this.element, e) : this._$AH.handleEvent(e);
  }
}
class Ue {
  constructor(e, i, s) {
    this.element = e, this.type = 6, this._$AN = void 0, this._$AM = i, this.options = s;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(e) {
    P(this, e);
  }
}
const Re = Y.litHtmlPolyfillSupport;
Re?.(j, D), (Y.litHtmlVersions ??= []).push("3.3.3");
const je = (t, e, i) => {
  const s = i?.renderBefore ?? e;
  let a = s._$litPart$;
  if (a === void 0) {
    const r = i?.renderBefore ?? null;
    s._$litPart$ = a = new D(e.insertBefore(U(), r), r, void 0, i ?? {});
  }
  return a._$AI(t), a;
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const te = globalThis;
class S extends k {
  constructor() {
    super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
  }
  createRenderRoot() {
    const e = super.createRenderRoot();
    return this.renderOptions.renderBefore ??= e.firstChild, e;
  }
  update(e) {
    const i = this.render();
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(e), this._$Do = je(i, this.renderRoot, this.renderOptions);
  }
  connectedCallback() {
    super.connectedCallback(), this._$Do?.setConnected(!0);
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this._$Do?.setConnected(!1);
  }
  render() {
    return C;
  }
}
S._$litElement$ = !0, S.finalized = !0, te.litElementHydrateSupport?.({ LitElement: S });
const He = te.litElementPolyfillSupport;
He?.({ LitElement: S });
(te.litElementVersions ??= []).push("4.2.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const J = (t) => (e, i) => {
  i !== void 0 ? i.addInitializer(() => {
    customElements.define(t, e);
  }) : customElements.define(t, e);
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const De = { attribute: !0, type: String, converter: B, reflect: !1, hasChanged: X }, Le = (t = De, e, i) => {
  const { kind: s, metadata: a } = i;
  let r = globalThis.litPropertyMetadata.get(a);
  if (r === void 0 && globalThis.litPropertyMetadata.set(a, r = /* @__PURE__ */ new Map()), s === "setter" && ((t = Object.create(t)).wrapped = !0), r.set(i.name, t), s === "accessor") {
    const { name: n } = i;
    return { set(d) {
      const l = e.get.call(this);
      e.set.call(this, d), this.requestUpdate(n, l, t, !0, d);
    }, init(d) {
      return d !== void 0 && this.C(n, void 0, t, d), d;
    } };
  }
  if (s === "setter") {
    const { name: n } = i;
    return function(d) {
      const l = this[n];
      e.call(this, d), this.requestUpdate(n, l, t, !0, d);
    };
  }
  throw Error("Unsupported decorator location: " + s);
};
function y(t) {
  return (e, i) => typeof i == "object" ? Le(t, e, i) : ((s, a, r) => {
    const n = a.hasOwnProperty(r);
    return a.constructor.createProperty(r, s), n ? Object.getOwnPropertyDescriptor(a, r) : void 0;
  })(t, e, i);
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function p(t) {
  return y({ ...t, state: !0, attribute: !1 });
}
const Q = H`
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
`, Fe = "fuzzy_system/systems/list", Be = "fuzzy_system/systems/save", qe = "fuzzy_system/systems/delete", Ve = "fuzzy_system/templates/list", We = "fuzzy_system/templates/instantiate";
async function Je(t) {
  const e = await t.callWS({
    type: Fe
  });
  return Array.isArray(e) ? e : e.systems || [];
}
async function Qe(t, e, i) {
  return t.callWS({
    type: Be,
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
    entry_id: i
  });
}
async function Ge(t, e) {
  return t.callWS({
    type: qe,
    entry_id: e
  });
}
async function Ze(t) {
  return (await t.callWS({
    type: Ve
  })).templates || [];
}
async function Ke(t, e, i, s) {
  return t.callWS({
    type: We,
    template_id: e,
    system_id: i,
    name: s
  });
}
var Xe = Object.defineProperty, Ye = Object.getOwnPropertyDescriptor, M = (t, e, i, s) => {
  for (var a = s > 1 ? void 0 : s ? Ye(e, i) : e, r = t.length - 1, n; r >= 0; r--)
    (n = t[r]) && (a = (s ? n(e, i, a) : n(a)) || a);
  return s && a && Xe(e, i, a), a;
};
let $ = class extends S {
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
  H`
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
M([
  y({ attribute: !1 })
], $.prototype, "hass", 2);
M([
  p()
], $.prototype, "_systems", 2);
M([
  p()
], $.prototype, "_searchQuery", 2);
M([
  p()
], $.prototype, "_loading", 2);
M([
  p()
], $.prototype, "_error", 2);
M([
  p()
], $.prototype, "_showTemplateModal", 2);
$ = M([
  J("fuzzy-system-catalog")
], $);
var et = Object.defineProperty, tt = Object.getOwnPropertyDescriptor, g = (t, e, i, s) => {
  for (var a = s > 1 ? void 0 : s ? tt(e, i) : e, r = t.length - 1, n; r >= 0; r--)
    (n = t[r]) && (a = (s ? n(e, i, a) : n(a)) || a);
  return s && a && et(e, i, a), a;
};
let u = class extends S {
  constructor() {
    super(...arguments), this.source = "config_entry", this._activeTab = "general", this._rawJson = "", this._saving = !1, this._error = "", this._successMsg = "", this._showAddInputModal = !1, this._newInputEntityId = "", this._newInputVarName = "", this._newInputMin = 0, this._newInputMax = 100, this._newInputTermsPreset = "3_terms", this._newInputModalError = "";
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
  _openAddInputModal() {
    this._newInputEntityId = "", this._newInputVarName = "", this._newInputMin = 0, this._newInputMax = 100, this._newInputTermsPreset = "3_terms", this._newInputModalError = "", this._showAddInputModal = !0;
  }
  _onNewInputEntitySelected(t) {
    if (this._newInputEntityId = t, !t) return;
    const e = t.split(".")[1]?.replace(/[^a-z0-9_]/g, "_") || "";
    (!this._newInputVarName || this._newInputVarName.trim() === "") && (this._newInputVarName = e);
    const i = this.hass?.states ? this.hass.states[t] : null;
    if (i?.attributes) {
      const s = i.attributes.unit_of_measurement;
      s === "°C" ? (this._newInputMin = 10, this._newInputMax = 35) : s === "°F" ? (this._newInputMin = 50, this._newInputMax = 95) : s === "%" ? (this._newInputMin = 0, this._newInputMax = 100) : s === "lx" || s === "lux" ? (this._newInputMin = 0, this._newInputMax = 1e3) : s === "ppm" ? (this._newInputMin = 400, this._newInputMax = 2e3) : (s === "W" || s === "kW") && (this._newInputMin = 0, this._newInputMax = 5e3);
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
    const e = Number.isFinite(this._newInputMin) ? this._newInputMin : 0, i = Number.isFinite(this._newInputMax) && this._newInputMax > e ? this._newInputMax : e + 100, s = i - e;
    let a;
    this._newInputTermsPreset === "5_terms" ? a = {
      very_low: { type: "trapmf", params: [e, e, e + s * 0.15, e + s * 0.3] },
      low: { type: "trimf", params: [e + s * 0.15, e + s * 0.35, e + s * 0.55] },
      medium: { type: "trimf", params: [e + s * 0.35, e + s * 0.5, e + s * 0.65] },
      high: { type: "trimf", params: [e + s * 0.45, e + s * 0.65, e + s * 0.85] },
      very_high: { type: "trapmf", params: [e + s * 0.7, e + s * 0.85, i, i] }
    } : a = {
      low: { type: "trapmf", params: [e, e, e + s * 0.25, e + s * 0.5] },
      medium: { type: "trimf", params: [e + s * 0.25, e + s * 0.5, e + s * 0.75] },
      high: { type: "trapmf", params: [e + s * 0.5, e + s * 0.75, i, i] }
    }, this._config.inputs || (this._config.inputs = {}), this._config.inputs[t] = {
      entity_id: this._newInputEntityId || "",
      range: [e, i],
      resolution: 100,
      default: e,
      terms: a
    }, this._showAddInputModal = !1, this.requestUpdate();
  }
  _getAvailableEntities() {
    if (!this.hass?.states) return [];
    const t = [];
    for (const [e, i] of Object.entries(this.hass.states)) {
      const s = e.split(".")[0];
      (s === "sensor" || s === "input_number" || s === "number" || s === "climate" || s === "weather") && t.push({
        entity_id: e,
        friendly_name: i.attributes?.friendly_name || e,
        unit: i.attributes?.unit_of_measurement || "",
        state: i.state
      });
    }
    return t.sort((e, i) => e.friendly_name.localeCompare(i.friendly_name)), t;
  }
  _renderEntityPicker(t, e, i) {
    const s = !!customElements.get("ha-entity-picker"), a = this._getAvailableEntities();
    return s ? o`
        <ha-entity-picker
          .hass=${this.hass}
          .value=${t || ""}
          ?disabled=${e}
          .includeDomains=${["sensor", "input_number", "number", "climate", "weather"]}
          @value-changed=${(r) => i(r.detail.value || "")}
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
          @input=${(r) => i(r.target.value)}
        />
        <datalist id="ha-fuzzy-entities">
          ${a.map(
      (r) => o`
              <option value=${r.entity_id}>
                ${r.friendly_name} (${r.state} ${r.unit})
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
    const i = e.attributes?.unit_of_measurement || "";
    return o`
      <span class="badge badge-emerald" title="Live sensor state in Home Assistant">
        🟢 Live: ${e.state} ${i}
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

      ${this._showAddInputModal ? this._renderAddInputModal() : ""}
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
    const e = this._config.inputs || {}, i = Object.keys(e);
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

      ${i.length === 0 ? o`<p class="subtitle" style="padding: 20px 0;">No input variables defined yet.</p>` : i.map((s) => {
      const a = e[s];
      return o`
              <div class="section-box">
                <div class="section-header">
                  <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
                    <span class="badge badge-cyan">${s}</span>
                    ${this._renderEntityStatusTag(a.entity_id)}
                    <span class="chip">Range: [${a.range[0]}, ${a.range[1]}]</span>
                  </div>
                  ${t ? "" : o`
                        <button class="btn btn-danger btn-icon" @click=${() => this._removeInput(s)} title="Delete Input">
                          ✕
                        </button>
                      `}
                </div>

                <div class="grid-2">
                  <div class="form-group">
                    <label class="form-label">Bound Home Assistant Sensor Entity</label>
                    ${this._renderEntityPicker(a.entity_id, t, (r) => {
        a.entity_id = r, this.requestUpdate();
      })}
                    <div class="helper-text">
                      ${a.entity_id ? o`Feeds live numerical measurements from <code>${a.entity_id}</code> into <code>${s}</code>.` : o`<span style="color: #fbbf24;">⚠️ Unbound: select an entity to evaluate live rules in HA.</span>`}
                    </div>
                  </div>

                  <div class="grid-2">
                    <div class="form-group">
                      <label class="form-label">Range Min</label>
                      <input
                        class="input-text"
                        type="number"
                        .value=${String(a.range[0])}
                        ?disabled=${t}
                        @input=${(r) => {
        a.range[0] = parseFloat(r.target.value), this.requestUpdate();
      }}
                      />
                    </div>
                    <div class="form-group">
                      <label class="form-label">Range Max</label>
                      <input
                        class="input-text"
                        type="number"
                        .value=${String(a.range[1])}
                        ?disabled=${t}
                        @input=${(r) => {
        a.range[1] = parseFloat(r.target.value), this.requestUpdate();
      }}
                      />
                    </div>
                  </div>
                </div>

                <div style="margin-top: 8px;">
                  <span class="helper-text">Linguistic Terms: </span>
                  ${Object.keys(a.terms || {}).map(
        (r) => o`<span class="badge" style="margin-right: 4px;">${r} (${a.terms[r].type})</span>`
      )}
                </div>
              </div>
            `;
    })}
    `;
  }
  _renderOutputsTab(t) {
    const e = this._config.outputs || {}, i = Object.keys(e);
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

      ${i.length === 0 ? o`<p class="subtitle" style="padding: 20px 0;">No output variables defined yet.</p>` : i.map((s) => {
      const a = e[s];
      return o`
              <div class="section-box">
                <div class="section-header">
                  <div style="display: flex; align-items: center; gap: 8px;">
                    <span class="badge badge-amber">${s}</span>
                    <span class="chip">Range: [${a.range[0]}, ${a.range[1]}]</span>
                    ${a.unit_of_measurement ? o`<span class="chip">${a.unit_of_measurement}</span>` : ""}
                  </div>
                  ${t ? "" : o`
                        <button class="btn btn-danger btn-icon" @click=${() => this._removeOutput(s)} title="Delete Output">
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
                      .value=${String(a.range[0])}
                      ?disabled=${t}
                      @input=${(r) => {
        a.range[0] = parseFloat(r.target.value), this.requestUpdate();
      }}
                    />
                  </div>
                  <div class="form-group">
                    <label class="form-label">Range Max</label>
                    <input
                      class="input-text"
                      type="number"
                      .value=${String(a.range[1])}
                      ?disabled=${t}
                      @input=${(r) => {
        a.range[1] = parseFloat(r.target.value), this.requestUpdate();
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
                      .value=${a.epsilon !== void 0 ? String(a.epsilon) : ""}
                      ?disabled=${t}
                      @input=${(r) => {
        const n = r.target.value.trim();
        a.epsilon = n ? parseFloat(n) : void 0, this.requestUpdate();
      }}
                    />
                  </div>
                </div>

                <div style="margin-top: 8px;">
                  <span class="helper-text">Linguistic Terms: </span>
                  ${Object.keys(a.terms || {}).map(
        (r) => o`<span class="badge" style="margin-right: 4px;">${r} (${a.terms[r].type})</span>`
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
      (i, s) => o`
              <div class="rule-item">
                <span class="badge badge-purple" style="width: 24px; justify-content: center;">${s + 1}</span>
                <input
                  class="input-text rule-input"
                  type="text"
                  .value=${i}
                  ?disabled=${t}
                  @input=${(a) => this._updateRule(s, a.target.value)}
                />
                ${t ? "" : o`
                      <button class="btn btn-danger btn-icon" @click=${() => this._removeRule(s)}>
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
u.styles = [
  Q,
  H`
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
g([
  y({ attribute: !1 })
], u.prototype, "hass", 2);
g([
  y({ type: Object })
], u.prototype, "systemConfig", 2);
g([
  y({ type: String })
], u.prototype, "entryId", 2);
g([
  y({ type: String })
], u.prototype, "source", 2);
g([
  p()
], u.prototype, "_activeTab", 2);
g([
  p()
], u.prototype, "_config", 2);
g([
  p()
], u.prototype, "_rawJson", 2);
g([
  p()
], u.prototype, "_saving", 2);
g([
  p()
], u.prototype, "_error", 2);
g([
  p()
], u.prototype, "_successMsg", 2);
g([
  p()
], u.prototype, "_showAddInputModal", 2);
g([
  p()
], u.prototype, "_newInputEntityId", 2);
g([
  p()
], u.prototype, "_newInputVarName", 2);
g([
  p()
], u.prototype, "_newInputMin", 2);
g([
  p()
], u.prototype, "_newInputMax", 2);
g([
  p()
], u.prototype, "_newInputTermsPreset", 2);
g([
  p()
], u.prototype, "_newInputModalError", 2);
u = g([
  J("fuzzy-system-editor")
], u);
var st = Object.defineProperty, it = Object.getOwnPropertyDescriptor, A = (t, e, i, s) => {
  for (var a = s > 1 ? void 0 : s ? it(e, i) : e, r = t.length - 1, n; r >= 0; r--)
    (n = t[r]) && (a = (s ? n(e, i, a) : n(a)) || a);
  return s && a && st(e, i, a), a;
};
let _ = class extends S {
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
_.styles = [
  Q,
  H`
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
  y({ attribute: !1 })
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
  J("fuzzy-template-modal")
], _);
var at = Object.defineProperty, rt = Object.getOwnPropertyDescriptor, x = (t, e, i, s) => {
  for (var a = s > 1 ? void 0 : s ? rt(e, i) : e, r = t.length - 1, n; r >= 0; r--)
    (n = t[r]) && (a = (s ? n(e, i, a) : n(a)) || a);
  return s && a && at(e, i, a), a;
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
  H`
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
  y({ attribute: !1 })
], b.prototype, "hass", 2);
x([
  y({ type: Boolean })
], b.prototype, "narrow", 2);
x([
  y({ type: Object })
], b.prototype, "route", 2);
x([
  y({ type: Object })
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
  J("fuzzy-system-panel")
], b);
export {
  b as FuzzySystemPanel
};
