/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const de = globalThis, ye = de.ShadowRoot && (de.ShadyCSS === void 0 || de.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, ve = Symbol(), ke = /* @__PURE__ */ new WeakMap();
let Ne = class {
  constructor(e, i, a) {
    if (this._$cssResult$ = !0, a !== ve) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = e, this.t = i;
  }
  get styleSheet() {
    let e = this.o;
    const i = this.t;
    if (ye && e === void 0) {
      const a = i !== void 0 && i.length === 1;
      a && (e = ke.get(i)), e === void 0 && ((this.o = e = new CSSStyleSheet()).replaceSync(this.cssText), a && ke.set(i, e));
    }
    return e;
  }
  toString() {
    return this.cssText;
  }
};
const us = (t) => new Ne(typeof t == "string" ? t : t + "", void 0, ve), I = (t, ...e) => {
  const i = t.length === 1 ? t[0] : e.reduce((a, s, r) => a + ((n) => {
    if (n._$cssResult$ === !0) return n.cssText;
    if (typeof n == "number") return n;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + n + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(s) + t[r + 1], t[0]);
  return new Ne(i, t, ve);
}, ps = (t, e) => {
  if (ye) t.adoptedStyleSheets = e.map((i) => i instanceof CSSStyleSheet ? i : i.styleSheet);
  else for (const i of e) {
    const a = document.createElement("style"), s = de.litNonce;
    s !== void 0 && a.setAttribute("nonce", s), a.textContent = i.cssText, t.appendChild(a);
  }
}, Ae = ye ? (t) => t : (t) => t instanceof CSSStyleSheet ? ((e) => {
  let i = "";
  for (const a of e.cssRules) i += a.cssText;
  return us(i);
})(t) : t;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const { is: gs, defineProperty: hs, getOwnPropertyDescriptor: ms, getOwnPropertyNames: fs, getOwnPropertySymbols: _s, getPrototypeOf: ys } = Object, pe = globalThis, Ce = pe.trustedTypes, vs = Ce ? Ce.emptyScript : "", bs = pe.reactiveElementPolyfillSupport, ee = (t, e) => t, ce = { toAttribute(t, e) {
  switch (e) {
    case Boolean:
      t = t ? vs : null;
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
} }, be = (t, e) => !gs(t, e), Ee = { attribute: !0, type: String, converter: ce, reflect: !1, useDefault: !1, hasChanged: be };
Symbol.metadata ??= Symbol("metadata"), pe.litPropertyMetadata ??= /* @__PURE__ */ new WeakMap();
let K = class extends HTMLElement {
  static addInitializer(e) {
    this._$Ei(), (this.l ??= []).push(e);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(e, i = Ee) {
    if (i.state && (i.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(e) && ((i = Object.create(i)).wrapped = !0), this.elementProperties.set(e, i), !i.noAccessor) {
      const a = Symbol(), s = this.getPropertyDescriptor(e, a, i);
      s !== void 0 && hs(this.prototype, e, s);
    }
  }
  static getPropertyDescriptor(e, i, a) {
    const { get: s, set: r } = ms(this.prototype, e) ?? { get() {
      return this[i];
    }, set(n) {
      this[i] = n;
    } };
    return { get: s, set(n) {
      const o = s?.call(this);
      r?.call(this, n), this.requestUpdate(e, o, a);
    }, configurable: !0, enumerable: !0 };
  }
  static getPropertyOptions(e) {
    return this.elementProperties.get(e) ?? Ee;
  }
  static _$Ei() {
    if (this.hasOwnProperty(ee("elementProperties"))) return;
    const e = ys(this);
    e.finalize(), e.l !== void 0 && (this.l = [...e.l]), this.elementProperties = new Map(e.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(ee("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(ee("properties"))) {
      const i = this.properties, a = [...fs(i), ..._s(i)];
      for (const s of a) this.createProperty(s, i[s]);
    }
    const e = this[Symbol.metadata];
    if (e !== null) {
      const i = litPropertyMetadata.get(e);
      if (i !== void 0) for (const [a, s] of i) this.elementProperties.set(a, s);
    }
    this._$Eh = /* @__PURE__ */ new Map();
    for (const [i, a] of this.elementProperties) {
      const s = this._$Eu(i, a);
      s !== void 0 && this._$Eh.set(s, i);
    }
    this.elementStyles = this.finalizeStyles(this.styles);
  }
  static finalizeStyles(e) {
    const i = [];
    if (Array.isArray(e)) {
      const a = new Set(e.flat(1 / 0).reverse());
      for (const s of a) i.unshift(Ae(s));
    } else e !== void 0 && i.push(Ae(e));
    return i;
  }
  static _$Eu(e, i) {
    const a = i.attribute;
    return a === !1 ? void 0 : typeof a == "string" ? a : typeof e == "string" ? e.toLowerCase() : void 0;
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
    for (const a of i.keys()) this.hasOwnProperty(a) && (e.set(a, this[a]), delete this[a]);
    e.size > 0 && (this._$Ep = e);
  }
  createRenderRoot() {
    const e = this.shadowRoot ?? this.attachShadow(this.constructor.shadowRootOptions);
    return ps(e, this.constructor.elementStyles), e;
  }
  connectedCallback() {
    this.renderRoot ??= this.createRenderRoot(), this.enableUpdating(!0), this._$EO?.forEach((e) => e.hostConnected?.());
  }
  enableUpdating(e) {
  }
  disconnectedCallback() {
    this._$EO?.forEach((e) => e.hostDisconnected?.());
  }
  attributeChangedCallback(e, i, a) {
    this._$AK(e, a);
  }
  _$ET(e, i) {
    const a = this.constructor.elementProperties.get(e), s = this.constructor._$Eu(e, a);
    if (s !== void 0 && a.reflect === !0) {
      const r = (a.converter?.toAttribute !== void 0 ? a.converter : ce).toAttribute(i, a.type);
      this._$Em = e, r == null ? this.removeAttribute(s) : this.setAttribute(s, r), this._$Em = null;
    }
  }
  _$AK(e, i) {
    const a = this.constructor, s = a._$Eh.get(e);
    if (s !== void 0 && this._$Em !== s) {
      const r = a.getPropertyOptions(s), n = typeof r.converter == "function" ? { fromAttribute: r.converter } : r.converter?.fromAttribute !== void 0 ? r.converter : ce;
      this._$Em = s;
      const o = n.fromAttribute(i, r.type);
      this[s] = o ?? this._$Ej?.get(s) ?? o, this._$Em = null;
    }
  }
  requestUpdate(e, i, a, s = !1, r) {
    if (e !== void 0) {
      const n = this.constructor;
      if (s === !1 && (r = this[e]), a ??= n.getPropertyOptions(e), !((a.hasChanged ?? be)(r, i) || a.useDefault && a.reflect && r === this._$Ej?.get(e) && !this.hasAttribute(n._$Eu(e, a)))) return;
      this.C(e, i, a);
    }
    this.isUpdatePending === !1 && (this._$ES = this._$EP());
  }
  C(e, i, { useDefault: a, reflect: s, wrapped: r }, n) {
    a && !(this._$Ej ??= /* @__PURE__ */ new Map()).has(e) && (this._$Ej.set(e, n ?? i ?? this[e]), r !== !0 || n !== void 0) || (this._$AL.has(e) || (this.hasUpdated || a || (i = void 0), this._$AL.set(e, i)), s === !0 && this._$Em !== e && (this._$Eq ??= /* @__PURE__ */ new Set()).add(e));
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
        for (const [s, r] of this._$Ep) this[s] = r;
        this._$Ep = void 0;
      }
      const a = this.constructor.elementProperties;
      if (a.size > 0) for (const [s, r] of a) {
        const { wrapped: n } = r, o = this[s];
        n !== !0 || this._$AL.has(s) || o === void 0 || this.C(s, void 0, r, o);
      }
    }
    let e = !1;
    const i = this._$AL;
    try {
      e = this.shouldUpdate(i), e ? (this.willUpdate(i), this._$EO?.forEach((a) => a.hostUpdate?.()), this.update(i)) : this._$EM();
    } catch (a) {
      throw e = !1, this._$EM(), a;
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
K.elementStyles = [], K.shadowRootOptions = { mode: "open" }, K[ee("elementProperties")] = /* @__PURE__ */ new Map(), K[ee("finalized")] = /* @__PURE__ */ new Map(), bs?.({ ReactiveElement: K }), (pe.reactiveElementVersions ??= []).push("2.1.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const xe = globalThis, Me = (t) => t, ue = xe.trustedTypes, je = ue ? ue.createPolicy("lit-html", { createHTML: (t) => t }) : void 0, Ve = "$lit$", P = `lit$${Math.random().toFixed(9).slice(2)}$`, De = "?" + P, xs = `<${De}>`, B = document, te = () => B.createComment(""), se = (t) => t === null || typeof t != "object" && typeof t != "function", $e = Array.isArray, $s = (t) => $e(t) || typeof t?.[Symbol.iterator] == "function", me = `[ 	
\f\r]`, X = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, Te = /-->/g, Oe = />/g, H = RegExp(`>|${me}(?:([^\\s"'>=/]+)(${me}*=${me}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), Ie = /'/g, Re = /"/g, He = /^(?:script|style|textarea|title)$/i, qe = (t) => (e, ...i) => ({ _$litType$: t, strings: e, values: i }), l = qe(1), J = qe(2), Z = Symbol.for("lit-noChange"), z = Symbol.for("lit-nothing"), Le = /* @__PURE__ */ new WeakMap(), q = B.createTreeWalker(B, 129);
function Be(t, e) {
  if (!$e(t) || !t.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return je !== void 0 ? je.createHTML(e) : e;
}
const zs = (t, e) => {
  const i = t.length - 1, a = [];
  let s, r = e === 2 ? "<svg>" : e === 3 ? "<math>" : "", n = X;
  for (let o = 0; o < i; o++) {
    const d = t[o];
    let c, u, g = -1, h = 0;
    for (; h < d.length && (n.lastIndex = h, u = n.exec(d), u !== null); ) h = n.lastIndex, n === X ? u[1] === "!--" ? n = Te : u[1] !== void 0 ? n = Oe : u[2] !== void 0 ? (He.test(u[2]) && (s = RegExp("</" + u[2], "g")), n = H) : u[3] !== void 0 && (n = H) : n === H ? u[0] === ">" ? (n = s ?? X, g = -1) : u[1] === void 0 ? g = -2 : (g = n.lastIndex - u[2].length, c = u[1], n = u[3] === void 0 ? H : u[3] === '"' ? Re : Ie) : n === Re || n === Ie ? n = H : n === Te || n === Oe ? n = X : (n = H, s = void 0);
    const f = n === H && t[o + 1].startsWith("/>") ? " " : "";
    r += n === X ? d + xs : g >= 0 ? (a.push(c), d.slice(0, g) + Ve + d.slice(g) + P + f) : d + P + (g === -2 ? o : f);
  }
  return [Be(t, r + (t[i] || "<?>") + (e === 2 ? "</svg>" : e === 3 ? "</math>" : "")), a];
};
class ie {
  constructor({ strings: e, _$litType$: i }, a) {
    let s;
    this.parts = [];
    let r = 0, n = 0;
    const o = e.length - 1, d = this.parts, [c, u] = zs(e, i);
    if (this.el = ie.createElement(c, a), q.currentNode = this.el.content, i === 2 || i === 3) {
      const g = this.el.content.firstChild;
      g.replaceWith(...g.childNodes);
    }
    for (; (s = q.nextNode()) !== null && d.length < o; ) {
      if (s.nodeType === 1) {
        if (s.hasAttributes()) for (const g of s.getAttributeNames()) if (g.endsWith(Ve)) {
          const h = u[n++], f = s.getAttribute(g).split(P), y = /([.?@])?(.*)/.exec(h);
          d.push({ type: 1, index: r, name: y[2], strings: f, ctor: y[1] === "." ? Ss : y[1] === "?" ? ks : y[1] === "@" ? As : ge }), s.removeAttribute(g);
        } else g.startsWith(P) && (d.push({ type: 6, index: r }), s.removeAttribute(g));
        if (He.test(s.tagName)) {
          const g = s.textContent.split(P), h = g.length - 1;
          if (h > 0) {
            s.textContent = ue ? ue.emptyScript : "";
            for (let f = 0; f < h; f++) s.append(g[f], te()), q.nextNode(), d.push({ type: 2, index: ++r });
            s.append(g[h], te());
          }
        }
      } else if (s.nodeType === 8) if (s.data === De) d.push({ type: 2, index: r });
      else {
        let g = -1;
        for (; (g = s.data.indexOf(P, g + 1)) !== -1; ) d.push({ type: 7, index: r }), g += P.length - 1;
      }
      r++;
    }
  }
  static createElement(e, i) {
    const a = B.createElement("template");
    return a.innerHTML = e, a;
  }
}
function Q(t, e, i = t, a) {
  if (e === Z) return e;
  let s = a !== void 0 ? i._$Co?.[a] : i._$Cl;
  const r = se(e) ? void 0 : e._$litDirective$;
  return s?.constructor !== r && (s?._$AO?.(!1), r === void 0 ? s = void 0 : (s = new r(t), s._$AT(t, i, a)), a !== void 0 ? (i._$Co ??= [])[a] = s : i._$Cl = s), s !== void 0 && (e = Q(t, s._$AS(t, e.values), s, a)), e;
}
class ws {
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
    const { el: { content: i }, parts: a } = this._$AD, s = (e?.creationScope ?? B).importNode(i, !0);
    q.currentNode = s;
    let r = q.nextNode(), n = 0, o = 0, d = a[0];
    for (; d !== void 0; ) {
      if (n === d.index) {
        let c;
        d.type === 2 ? c = new ne(r, r.nextSibling, this, e) : d.type === 1 ? c = new d.ctor(r, d.name, d.strings, this, e) : d.type === 6 && (c = new Cs(r, this, e)), this._$AV.push(c), d = a[++o];
      }
      n !== d?.index && (r = q.nextNode(), n++);
    }
    return q.currentNode = B, s;
  }
  p(e) {
    let i = 0;
    for (const a of this._$AV) a !== void 0 && (a.strings !== void 0 ? (a._$AI(e, a, i), i += a.strings.length - 2) : a._$AI(e[i])), i++;
  }
}
class ne {
  get _$AU() {
    return this._$AM?._$AU ?? this._$Cv;
  }
  constructor(e, i, a, s) {
    this.type = 2, this._$AH = z, this._$AN = void 0, this._$AA = e, this._$AB = i, this._$AM = a, this.options = s, this._$Cv = s?.isConnected ?? !0;
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
    e = Q(this, e, i), se(e) ? e === z || e == null || e === "" ? (this._$AH !== z && this._$AR(), this._$AH = z) : e !== this._$AH && e !== Z && this._(e) : e._$litType$ !== void 0 ? this.$(e) : e.nodeType !== void 0 ? this.T(e) : $s(e) ? this.k(e) : this._(e);
  }
  O(e) {
    return this._$AA.parentNode.insertBefore(e, this._$AB);
  }
  T(e) {
    this._$AH !== e && (this._$AR(), this._$AH = this.O(e));
  }
  _(e) {
    this._$AH !== z && se(this._$AH) ? this._$AA.nextSibling.data = e : this.T(B.createTextNode(e)), this._$AH = e;
  }
  $(e) {
    const { values: i, _$litType$: a } = e, s = typeof a == "number" ? this._$AC(e) : (a.el === void 0 && (a.el = ie.createElement(Be(a.h, a.h[0]), this.options)), a);
    if (this._$AH?._$AD === s) this._$AH.p(i);
    else {
      const r = new ws(s, this), n = r.u(this.options);
      r.p(i), this.T(n), this._$AH = r;
    }
  }
  _$AC(e) {
    let i = Le.get(e.strings);
    return i === void 0 && Le.set(e.strings, i = new ie(e)), i;
  }
  k(e) {
    $e(this._$AH) || (this._$AH = [], this._$AR());
    const i = this._$AH;
    let a, s = 0;
    for (const r of e) s === i.length ? i.push(a = new ne(this.O(te()), this.O(te()), this, this.options)) : a = i[s], a._$AI(r), s++;
    s < i.length && (this._$AR(a && a._$AB.nextSibling, s), i.length = s);
  }
  _$AR(e = this._$AA.nextSibling, i) {
    for (this._$AP?.(!1, !0, i); e !== this._$AB; ) {
      const a = Me(e).nextSibling;
      Me(e).remove(), e = a;
    }
  }
  setConnected(e) {
    this._$AM === void 0 && (this._$Cv = e, this._$AP?.(e));
  }
}
class ge {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(e, i, a, s, r) {
    this.type = 1, this._$AH = z, this._$AN = void 0, this.element = e, this.name = i, this._$AM = s, this.options = r, a.length > 2 || a[0] !== "" || a[1] !== "" ? (this._$AH = Array(a.length - 1).fill(new String()), this.strings = a) : this._$AH = z;
  }
  _$AI(e, i = this, a, s) {
    const r = this.strings;
    let n = !1;
    if (r === void 0) e = Q(this, e, i, 0), n = !se(e) || e !== this._$AH && e !== Z, n && (this._$AH = e);
    else {
      const o = e;
      let d, c;
      for (e = r[0], d = 0; d < r.length - 1; d++) c = Q(this, o[a + d], i, d), c === Z && (c = this._$AH[d]), n ||= !se(c) || c !== this._$AH[d], c === z ? e = z : e !== z && (e += (c ?? "") + r[d + 1]), this._$AH[d] = c;
    }
    n && !s && this.j(e);
  }
  j(e) {
    e === z ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, e ?? "");
  }
}
class Ss extends ge {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(e) {
    this.element[this.name] = e === z ? void 0 : e;
  }
}
class ks extends ge {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(e) {
    this.element.toggleAttribute(this.name, !!e && e !== z);
  }
}
class As extends ge {
  constructor(e, i, a, s, r) {
    super(e, i, a, s, r), this.type = 5;
  }
  _$AI(e, i = this) {
    if ((e = Q(this, e, i, 0) ?? z) === Z) return;
    const a = this._$AH, s = e === z && a !== z || e.capture !== a.capture || e.once !== a.once || e.passive !== a.passive, r = e !== z && (a === z || s);
    s && this.element.removeEventListener(this.name, this, a), r && this.element.addEventListener(this.name, this, e), this._$AH = e;
  }
  handleEvent(e) {
    typeof this._$AH == "function" ? this._$AH.call(this.options?.host ?? this.element, e) : this._$AH.handleEvent(e);
  }
}
class Cs {
  constructor(e, i, a) {
    this.element = e, this.type = 6, this._$AN = void 0, this._$AM = i, this.options = a;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(e) {
    Q(this, e);
  }
}
const Es = xe.litHtmlPolyfillSupport;
Es?.(ie, ne), (xe.litHtmlVersions ??= []).push("3.3.3");
const Ms = (t, e, i) => {
  const a = i?.renderBefore ?? e;
  let s = a._$litPart$;
  if (s === void 0) {
    const r = i?.renderBefore ?? null;
    a._$litPart$ = s = new ne(e.insertBefore(te(), r), r, void 0, i ?? {});
  }
  return s._$AI(t), s;
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const ze = globalThis;
class A extends K {
  constructor() {
    super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
  }
  createRenderRoot() {
    const e = super.createRenderRoot();
    return this.renderOptions.renderBefore ??= e.firstChild, e;
  }
  update(e) {
    const i = this.render();
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(e), this._$Do = Ms(i, this.renderRoot, this.renderOptions);
  }
  connectedCallback() {
    super.connectedCallback(), this._$Do?.setConnected(!0);
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this._$Do?.setConnected(!1);
  }
  render() {
    return Z;
  }
}
A._$litElement$ = !0, A.finalized = !0, ze.litElementHydrateSupport?.({ LitElement: A });
const js = ze.litElementPolyfillSupport;
js?.({ LitElement: A });
(ze.litElementVersions ??= []).push("4.2.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Ts = { attribute: !0, type: String, converter: ce, reflect: !1, hasChanged: be }, Os = (t = Ts, e, i) => {
  const { kind: a, metadata: s } = i;
  let r = globalThis.litPropertyMetadata.get(s);
  if (r === void 0 && globalThis.litPropertyMetadata.set(s, r = /* @__PURE__ */ new Map()), a === "setter" && ((t = Object.create(t)).wrapped = !0), r.set(i.name, t), a === "accessor") {
    const { name: n } = i;
    return { set(o) {
      const d = e.get.call(this);
      e.set.call(this, o), this.requestUpdate(n, d, t, !0, o);
    }, init(o) {
      return o !== void 0 && this.C(n, void 0, t, o), o;
    } };
  }
  if (a === "setter") {
    const { name: n } = i;
    return function(o) {
      const d = this[n];
      e.call(this, o), this.requestUpdate(n, d, t, !0, o);
    };
  }
  throw Error("Unsupported decorator location: " + a);
};
function v(t) {
  return (e, i) => typeof i == "object" ? Os(t, e, i) : ((a, s, r) => {
    const n = s.hasOwnProperty(r);
    return s.constructor.createProperty(r, a), n ? Object.getOwnPropertyDescriptor(s, r) : void 0;
  })(t, e, i);
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function p(t) {
  return v({ ...t, state: !0, attribute: !1 });
}
function F(t) {
  return (e) => (typeof customElements < "u" && !customElements.get(t) && customElements.define(t, e), e);
}
const he = I`
  :host {
    --fuzzy-primary: var(--primary-color, #0284c7);
    --fuzzy-primary-hover: var(--primary-color-hover, #0369a1);
    --fuzzy-accent: var(--accent-color, #d97706);
    --fuzzy-success: var(--success-color, #059669);
    --fuzzy-warning: var(--warning-color, #d97706);
    --fuzzy-danger: var(--error-color, #ef4444);
    --fuzzy-bg: var(--primary-background-color, #0f172a);
    --fuzzy-card-bg: var(--card-background-color, rgba(30, 41, 59, 0.7));
    --fuzzy-card-border: var(--divider-color, rgba(125, 125, 125, 0.2));
    --fuzzy-text: var(--primary-text-color, #f8fafc);
    --fuzzy-text-secondary: var(--secondary-text-color, #64748b);
    --fuzzy-glass-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.15);
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
    box-shadow: 0 12px 40px 0 rgba(0, 0, 0, 0.25);
  }

  /* Typography */
  h1, h2, h3, h4, p {
    margin: 0;
  }

  .title-lg {
    font-size: 24px;
    font-weight: 700;
    letter-spacing: -0.02em;
    color: var(--primary-text-color, #f8fafc);
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
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    padding: 4px 10px;
    border-radius: 9999px;
    line-height: 1.2;
  }

  .badge-cyan {
    background: #0284c7;
    color: #ffffff;
    border: 1px solid #0369a1;
  }

  .badge-amber {
    background: #d97706;
    color: #ffffff;
    border: 1px solid #b45309;
  }

  .badge-emerald {
    background: #059669;
    color: #ffffff;
    border: 1px solid #047857;
  }

  .badge-purple {
    background: #7c3aed;
    color: #ffffff;
    border: 1px solid #6d28d9;
  }

  .badge-rose {
    background: #e11d48;
    color: #ffffff;
    border: 1px solid #be123c;
  }

  .chip {
    display: inline-flex;
    align-items: center;
    font-size: 12px;
    font-weight: 500;
    padding: 4px 10px;
    background: var(--chip-background-color, var(--secondary-background-color, rgba(125, 125, 125, 0.12)));
    border: 1px solid var(--divider-color, rgba(125, 125, 125, 0.2));
    border-radius: var(--fuzzy-radius-sm);
    color: var(--primary-text-color, var(--fuzzy-text));
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
    background: var(--secondary-background-color, rgba(125, 125, 125, 0.08));
    color: var(--primary-text-color, var(--fuzzy-text));
    border: 1px solid var(--divider-color, rgba(125, 125, 125, 0.25));
  }

  .btn-secondary:hover {
    background: rgba(125, 125, 125, 0.16);
    border-color: rgba(125, 125, 125, 0.4);
    transform: translateY(-1px);
  }

  .btn-danger {
    background: rgba(239, 68, 68, 0.12);
    color: #dc2626;
    border: 1px solid rgba(239, 68, 68, 0.4);
    font-weight: 600;
  }

  .btn-danger:hover {
    background: #dc2626;
    color: #ffffff;
    border-color: #dc2626;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(220, 38, 38, 0.35);
  }

  .btn-icon {
    padding: 8px;
    border-radius: 50%;
    background: transparent;
    color: var(--fuzzy-text-secondary);
  }

  .btn-icon:hover {
    background: rgba(125, 125, 125, 0.12);
    color: var(--primary-text-color, var(--fuzzy-text));
  }

  /* Form Inputs */
  .form-group {
    margin-bottom: 18px;
  }

  .form-label {
    display: block;
    font-size: 13px;
    font-weight: 600;
    color: var(--primary-text-color, #1e293b);
    opacity: 0.9;
    margin-bottom: 6px;
  }

  .input-text, .input-select, .input-textarea {
    width: 100%;
    padding: 10px 14px;
    border-radius: var(--fuzzy-radius-md);
    background: var(--input-fill-color, var(--card-background-color, #ffffff));
    border: 1px solid var(--divider-color, rgba(125, 125, 125, 0.3));
    color: var(--primary-text-color, #0f172a);
    font-size: 14px;
    box-sizing: border-box;
    transition: border-color 0.2s ease, box-shadow 0.2s ease, background 0.2s ease;
  }

  .input-text::placeholder, .input-textarea::placeholder {
    color: var(--secondary-text-color, #94a3b8);
    opacity: 0.8;
  }

  .input-select option {
    background: var(--card-background-color, #ffffff);
    color: var(--primary-text-color, #0f172a);
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
    background: var(--card-background-color, var(--fuzzy-bg));
    border: 1px solid var(--fuzzy-card-border);
    border-radius: var(--fuzzy-radius-lg);
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
    width: 100%;
    max-width: 600px;
    max-height: 90vh;
    overflow-y: auto;
    padding: 28px;
    box-sizing: border-box;
    color: var(--primary-text-color, var(--fuzzy-text));
  }
`, Is = "fuzzy_system/systems/list", Rs = "fuzzy_system/systems/get", Ls = "fuzzy_system/systems/save", Ps = "fuzzy_system/systems/delete", Fs = "fuzzy_system/simulate", Ns = "fuzzy_system/templates/list", Vs = "fuzzy_system/templates/instantiate";
async function Ue(t) {
  const e = await t.callWS({
    type: Is
  });
  return Array.isArray(e) ? e : e.systems || [];
}
async function Pe(t, e) {
  const i = await t.callWS({
    type: Rs,
    ...e
  });
  return i.system || i.config;
}
async function Ds(t, e, i) {
  return t.callWS({
    type: Ls,
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
async function Hs(t, e) {
  return t.callWS({
    type: Ps,
    entry_id: e
  });
}
async function We(t) {
  return (await t.callWS({
    type: Ns
  })).templates || [];
}
async function Ge(t, e, i, a) {
  return t.callWS({
    type: Vs,
    template_id: e,
    system_id: i,
    name: a
  });
}
async function Ye(t, e, i) {
  const a = await t.callWS({
    type: Fs,
    system_config: e,
    inputs: i
  }), s = a?.results || a;
  if (!s) return {};
  if (s.defuzzified_values) {
    const r = {}, n = Object.keys(e.outputs || {});
    for (const o of n) {
      const d = s.aggregated_sets?.[o] || [];
      let c = s.universes?.[o] || [];
      if ((!c || c.length === 0) && d.length > 0) {
        const u = e.outputs[o]?.range || [0, 100], h = (u[1] - u[0]) / (d.length - 1 || 1);
        c = Array.from({ length: d.length }, (f, y) => u[0] + y * h);
      }
      r[o] = {
        defuzzified_value: s.defuzzified_values[o],
        dominant_term: s.dominant_terms?.[o] || "",
        term_activations: s.term_activations?.[o] || {},
        term_memberships: s.term_memberships?.[o] || {},
        rule_strengths: s.rule_strengths || [],
        universe: c,
        aggregated_set: d
      };
    }
    return r;
  }
  return s;
}
const qs = "fuzzy_system/dashboard/generate_card", Bs = "fuzzy_system/dashboard/add_card";
async function Ke(t, e) {
  return t.callWS({
    type: qs,
    ...e
  });
}
async function Je(t, e) {
  return t.callWS({
    type: Bs,
    ...e
  });
}
let Fe = !1, S = null;
function Us(t) {
  if (S = t, Fe) return;
  Fe = !0;
  const e = [
    {
      name: "list_fuzzy_systems",
      description: "List all configured fuzzy systems (both YAML and UI entries) with variable names and rule counts.",
      readOnlyHint: !0,
      handler: async () => {
        const s = S?.getHass();
        if (!s) throw new Error("Home Assistant connection not ready");
        return Ue(s);
      }
    },
    {
      name: "get_fuzzy_system",
      description: "Retrieve full configuration of a specific fuzzy system.",
      parameters: {
        type: "object",
        properties: {
          system_id: { type: "string", description: "Target fuzzy system identifier" }
        },
        required: ["system_id"]
      },
      readOnlyHint: !0,
      handler: async (s) => {
        const r = S?.getHass();
        if (!r) throw new Error("Home Assistant connection not ready");
        return Pe(r, { system_id: s.system_id });
      }
    },
    {
      name: "simulate_fuzzy_system",
      description: "Perform dry-run fuzzy inference simulation with specified numerical input values.",
      parameters: {
        type: "object",
        properties: {
          system_id: { type: "string", description: "Target fuzzy system identifier" },
          inputs: { type: "object", description: "Key-value input map", additionalProperties: { type: "number" } }
        },
        required: ["system_id", "inputs"]
      },
      readOnlyHint: !0,
      handler: async (s) => {
        const r = S?.getHass();
        if (!r) throw new Error("Home Assistant connection not ready");
        const n = await Pe(r, { system_id: s.system_id });
        return Ye(r, n, s.inputs);
      }
    },
    {
      name: "generate_card_config",
      description: "Generate custom:fuzzy-system-card Lovelace dashboard card configuration and YAML.",
      parameters: {
        type: "object",
        properties: {
          system_id: { type: "string", description: "Target fuzzy system identifier" },
          title: { type: "string", description: "Optional card title" },
          show_graph: { type: "boolean", default: !0 },
          show_inputs: { type: "boolean", default: !0 },
          show_rules: { type: "boolean", default: !0 }
        },
        required: ["system_id"]
      },
      readOnlyHint: !0,
      handler: async (s) => {
        const r = S?.getHass();
        if (!r) throw new Error("Home Assistant connection not ready");
        return Ke(r, s);
      }
    },
    {
      name: "add_card_to_dashboard",
      description: "Automatically inserts a custom:fuzzy-system-card into a Lovelace dashboard view.",
      parameters: {
        type: "object",
        properties: {
          system_id: { type: "string", description: "Target fuzzy system identifier" },
          dashboard_path: { type: "string", description: "Dashboard URL path (leave blank for primary overview)" },
          view_title: { type: "string", description: "Title of target view to add to" },
          card_title: { type: "string", description: "Optional custom title for the card" },
          show_graph: { type: "boolean", default: !0 },
          show_inputs: { type: "boolean", default: !0 },
          show_rules: { type: "boolean", default: !0 }
        },
        required: ["system_id"]
      },
      consequentialHint: !0,
      handler: async (s) => {
        const r = S?.getHass();
        if (!r) throw new Error("Home Assistant connection not ready");
        return Je(r, s);
      }
    },
    {
      name: "list_starter_templates",
      description: "Discover all pre-built starter templates in the fuzzy system library.",
      readOnlyHint: !0,
      handler: async () => {
        const s = S?.getHass();
        if (!s) throw new Error("Home Assistant connection not ready");
        return We(s);
      }
    },
    {
      name: "instantiate_starter_template",
      description: "Instantiate a starter template into a new configuration draft.",
      parameters: {
        type: "object",
        properties: {
          template_id: { type: "string", description: "Template identifier" },
          system_id: { type: "string", description: "New system identifier" },
          name: { type: "string", description: "Optional friendly name" }
        },
        required: ["template_id", "system_id"]
      },
      consequentialHint: !0,
      handler: async (s) => {
        const r = S?.getHass();
        if (!r) throw new Error("Home Assistant connection not ready");
        const n = await Ge(r, s.template_id, s.system_id, s.name);
        return S?.openSystemInEditor && n.system && S.openSystemInEditor(n.system), n;
      }
    },
    {
      name: "get_active_editor_system",
      description: "Returns the fuzzy system configuration currently open and active in the workbench editor.",
      readOnlyHint: !0,
      handler: () => {
        const s = S?.getActiveConfig?.();
        return s || { error: "No system currently open in the editor (workbench is in catalog view)." };
      }
    },
    {
      name: "tune_editor_term",
      description: "Tunes membership function parameters for an antecedent or consequent in the active workbench editor.",
      parameters: {
        type: "object",
        properties: {
          variable_type: { type: "string", enum: ["input", "output"] },
          variable_name: { type: "string" },
          term_name: { type: "string" },
          mf_type: { type: "string" },
          params: { type: "array", items: { type: "number" } }
        },
        required: ["variable_type", "variable_name", "term_name", "mf_type", "params"]
      },
      handler: (s) => {
        if (!S?.updateActiveConfig)
          return { error: "Active editor is not available." };
        let r = !1;
        return S.updateActiveConfig((n) => {
          const o = JSON.parse(JSON.stringify(n)), d = s.variable_type === "input" ? o.inputs : o.outputs;
          return d?.[s.variable_name]?.terms?.[s.term_name] && (d[s.variable_name].terms[s.term_name] = {
            type: s.mf_type,
            params: s.params
          }, r = !0), o;
        }), { success: r, message: r ? "Term parameters updated." : "Variable or term not found." };
      }
    },
    {
      name: "add_editor_rule",
      description: "Appends a new linguistic rule to the currently open fuzzy system in the workbench editor.",
      parameters: {
        type: "object",
        properties: {
          rule: { type: "string", description: "Linguistic rule string (e.g. IF temp IS cold THEN fan IS low)" }
        },
        required: ["rule"]
      },
      handler: (s) => S?.updateActiveConfig ? (S.updateActiveConfig((r) => {
        const n = JSON.parse(JSON.stringify(r));
        return n.rules = [...n.rules || [], s.rule], n;
      }), { success: !0, message: `Added rule: '${s.rule}'` }) : { error: "Active editor is not available." }
    }
  ], i = typeof navigator < "u" && navigator.modelContext || typeof document < "u" && document.modelContext || typeof window < "u" && window.modelContext;
  if (i && typeof i.provideContext == "function")
    try {
      i.provideContext({
        tools: e.map((s) => ({
          name: s.name,
          description: s.description,
          parameters: s.parameters,
          readOnlyHint: s.readOnlyHint,
          consequentialHint: s.consequentialHint,
          handler: s.handler
        }))
      }), console.log("[FuzzySystem] Registered", e.length, "tools with WebMCP");
    } catch (s) {
      console.warn("[FuzzySystem] Failed to register with WebMCP context:", s);
    }
  const a = {
    tools: e.map((s) => ({ name: s.name, description: s.description }))
  };
  for (const s of e)
    a[s.name] = s.handler;
  window.fuzzySystemMCP = a, window.addEventListener("message", async (s) => {
    if (!(s.source !== window || s.origin !== window.location.origin) && s.data?.type === "fuzzy_system:mcp_call") {
      const { id: r, tool: n, args: o } = s.data, d = e.find((c) => c.name === n);
      if (!d) {
        window.postMessage({ type: "fuzzy_system:mcp_result", id: r, error: `Tool '${n}' not found` }, window.location.origin);
        return;
      }
      try {
        const c = await d.handler(o || {});
        window.postMessage({ type: "fuzzy_system:mcp_result", id: r, result: c }, window.location.origin);
      } catch (c) {
        window.postMessage({ type: "fuzzy_system:mcp_result", id: r, error: c?.message || String(c) }, window.location.origin);
      }
    }
  });
}
var Ws = Object.defineProperty, Gs = Object.getOwnPropertyDescriptor, N = (t, e, i, a) => {
  for (var s = a > 1 ? void 0 : a ? Gs(e, i) : e, r = t.length - 1, n; r >= 0; r--)
    (n = t[r]) && (s = (a ? n(e, i, s) : n(s)) || s);
  return a && s && Ws(e, i, s), s;
};
let j = class extends A {
  constructor() {
    super(...arguments), this.universe = [], this.aggregatedSet = [], this.defuzzifier = "cog", this.dominantTerm = "", this.unit = "", this.outputName = "";
  }
  render() {
    if (!this.universe || this.universe.length === 0)
      return l`
        <div class="graph-card">
          <div style="text-align: center; color: var(--fuzzy-text-secondary); padding: 20px 0; font-size: 12px;">
            Awaiting inference evaluation data...
          </div>
        </div>
      `;
    const t = this.universe[0], e = this.universe[this.universe.length - 1], i = e - t || 1, a = 640, s = 190, r = 36, n = 24, o = 20, d = 28, c = a - r - n, u = s - o - d, g = (k) => r + (k - t) / i * c, h = (k) => o + (1 - Math.max(0, Math.min(1, k))) * u, f = this.aggregatedSet || [], y = [], b = Math.max(1, Math.floor(this.universe.length / 140));
    for (let k = 0; k < this.universe.length; k += b) {
      const E = this.universe[k], M = f[k] ?? 0;
      y.push([g(E), h(M)]);
    }
    const W = this.universe.length - 1;
    y.push([g(this.universe[W]), h(f[W] ?? 0)]);
    const O = y.reduce(
      (k, [E, M], Y) => Y === 0 ? `M ${E} ${M}` : `${k} L ${E} ${M}`,
      ""
    ), D = `${O} L ${r + c} ${o + u} L ${r} ${o + u} Z`, G = this.defuzzifiedValue !== void 0 && !isNaN(this.defuzzifiedValue), L = G ? g(Math.max(t, Math.min(e, this.defuzzifiedValue))) : 0;
    return l`
      <div class="graph-card">
        <div class="graph-header">
          <div class="graph-title">
            <span>📈</span>
            <span>${this.outputName || "Aggregated Output Distribution"}</span>
          </div>
          <div class="header-badges">
            ${this.dominantTerm ? l`<span class="badge-dominant">Dominant: ${this.dominantTerm}</span>` : ""}
            ${G ? l`
                  <span class="badge-crisp">
                    ${this.defuzzifier.toUpperCase()}: ${this.defuzzifiedValue.toFixed(2)} ${this.unit}
                  </span>
                ` : ""}
          </div>
        </div>

        <svg viewBox="0 0 ${a} ${s}" preserveAspectRatio="xMidYMid meet">
          <defs>
            <linearGradient id="aggGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="#38bdf8" stop-opacity="0.55" />
              <stop offset="60%" stop-color="#0284c7" stop-opacity="0.25" />
              <stop offset="100%" stop-color="#0f172a" stop-opacity="0.05" />
            </linearGradient>
          </defs>

          <!-- Horizontal Grid lines at mu = 0.5, 1.0 -->
          <line class="grid-line" x1=${r} y1=${h(0.5)} x2=${r + c} y2=${h(0.5)} />
          <line class="grid-line" x1=${r} y1=${h(1)} x2=${r + c} y2=${h(1)} />

          <!-- Axes -->
          <line class="axis-line" x1=${r} y1=${o} x2=${r} y2=${o + u} />
          <line class="axis-line" x1=${r} y1=${o + u} x2=${r + c} y2=${o + u} />

          <!-- Y-axis labels -->
          <text class="axis-text" x=${r - 6} y=${h(1) + 3} text-anchor="end">1.0</text>
          <text class="axis-text" x=${r - 6} y=${h(0.5) + 3} text-anchor="end">0.5</text>
          <text class="axis-text" x=${r - 6} y=${h(0) + 3} text-anchor="end">0.0</text>

          <!-- X-axis labels -->
          <text class="axis-text" x=${r} y=${s - 10} text-anchor="start">${t.toFixed(0)}</text>
          <text class="axis-text" x=${r + c / 2} y=${s - 10} text-anchor="middle">
            ${(t + i / 2).toFixed(1)}
          </text>
          <text class="axis-text" x=${r + c} y=${s - 10} text-anchor="end">
            ${e.toFixed(0)} ${this.unit}
          </text>

          <!-- Aggregated Fuzzy Set Area & Stroke -->
          <path d=${D} fill="url(#aggGradient)" />
          <path d=${O} fill="none" stroke="#38bdf8" stroke-width="2.2" stroke-linecap="round" />

          <!-- Defuzzified Crisp Slice Line -->
          ${G ? J`
                <g>
                  <line
                    class="defuzz-line"
                    x1=${L}
                    y1=${o}
                    x2=${L}
                    y2=${o + u}
                  />
                  <circle class="pulse-marker" cx=${L} cy=${o + u} r="4.5" />
                  <rect
                    x=${Math.min(r + c - 90, Math.max(r, L - 45))}
                    y=${o - 18}
                    width="90"
                    height="18"
                    rx="4"
                    fill="#0284c7"
                  />
                  <text
                    x=${Math.min(r + c - 45, Math.max(r + 45, L))}
                    y=${o - 5}
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
j.styles = I`
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
], j.prototype, "universe", 2);
N([
  v({ type: Array })
], j.prototype, "aggregatedSet", 2);
N([
  v({ type: Number })
], j.prototype, "defuzzifiedValue", 2);
N([
  v({ type: String })
], j.prototype, "defuzzifier", 2);
N([
  v({ type: String })
], j.prototype, "dominantTerm", 2);
N([
  v({ type: String })
], j.prototype, "unit", 2);
N([
  v({ type: String })
], j.prototype, "outputName", 2);
j = N([
  F("fuzzy-aggregated-graph")
], j);
var Ys = Object.defineProperty, Ks = Object.getOwnPropertyDescriptor, w = (t, e, i, a) => {
  for (var s = a > 1 ? void 0 : a ? Ks(e, i) : e, r = t.length - 1, n; r >= 0; r--)
    (n = t[r]) && (s = (a ? n(e, i, s) : n(s)) || s);
  return a && s && Ys(e, i, s), s;
};
let $ = class extends A {
  constructor() {
    super(...arguments), this._systems = [], this._searchQuery = "", this._loading = !1, this._error = "", this._showTemplateModal = !1, this._expandedWaveforms = {}, this._dashboardViewTitle = "Fuzzy Systems", this._dashboardCardTitle = "", this._dashboardShowGraph = !0, this._dashboardShowInputs = !0, this._dashboardShowRules = !0, this._dashboardStatusMsg = "", this._dashboardIsError = !1, this._dashboardLoading = !1;
  }
  _openDashboardModal(t) {
    this._dashboardModalSystem = t, this._dashboardCardTitle = t.name || t.system_id, this._dashboardStatusMsg = "", this._dashboardIsError = !1, this._dashboardLoading = !1;
  }
  async _handleAddToDashboard() {
    if (!(!this.hass || !this._dashboardModalSystem)) {
      this._dashboardLoading = !0, this._dashboardStatusMsg = "";
      try {
        const t = await Je(this.hass, {
          system_id: this._dashboardModalSystem.system_id,
          view_title: this._dashboardViewTitle || null,
          card_title: this._dashboardCardTitle || void 0,
          show_graph: this._dashboardShowGraph,
          show_inputs: this._dashboardShowInputs,
          show_rules: this._dashboardShowRules
        });
        t.success ? (this._dashboardStatusMsg = `Added to Lovelace view "${t.view || "default"}"!`, this._dashboardIsError = !1, setTimeout(() => {
          this._dashboardModalSystem = void 0;
        }, 1500)) : (this._dashboardStatusMsg = t.error || "Dashboard is in YAML mode. Use 'Copy YAML' below.", this._dashboardIsError = !0);
      } catch (t) {
        this._dashboardStatusMsg = t.message || "Failed to add card to dashboard.", this._dashboardIsError = !0;
      } finally {
        this._dashboardLoading = !1;
      }
    }
  }
  async _handleCopyCardYaml() {
    if (!(!this.hass || !this._dashboardModalSystem))
      try {
        const t = await Ke(this.hass, {
          system_id: this._dashboardModalSystem.system_id,
          title: this._dashboardCardTitle || void 0,
          show_graph: this._dashboardShowGraph,
          show_inputs: this._dashboardShowInputs,
          show_rules: this._dashboardShowRules
        });
        await navigator.clipboard.writeText(t.yaml), this._dashboardStatusMsg = "Card YAML copied to clipboard!", this._dashboardIsError = !1;
      } catch (t) {
        this._dashboardStatusMsg = "Could not copy YAML: " + (t.message || String(t)), this._dashboardIsError = !0;
      }
  }
  _toggleWaveform(t, e) {
    const i = `${t}_${e}`;
    this._expandedWaveforms = {
      ...this._expandedWaveforms,
      [i]: !this._expandedWaveforms[i]
    };
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
        this._systems = await Ue(this.hass);
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
        await Hs(this.hass, t.entry_id), await this.refresh();
      } catch (e) {
        alert(e.message || "Failed to delete system");
      }
  }
  _findOutputSensor(t, e) {
    if (!this.hass?.states) return null;
    const i = t.toLowerCase(), a = e.toLowerCase(), s = [
      `sensor.fuzzy_${i}_${a}`,
      `sensor.${i}_${a}`,
      `sensor.fuzzy_${a}`
    ];
    for (const r of s)
      if (this.hass.states[r])
        return { entityId: r, stateObj: this.hass.states[r] };
    for (const [r, n] of Object.entries(this.hass.states)) {
      if (!r.startsWith("sensor.") || r.endsWith("_set") || r.endsWith("_status")) continue;
      if ((n.attributes || {}).system === t && (r.endsWith(`_${a}`) || r.includes(a)))
        return { entityId: r, stateObj: n };
    }
    return null;
  }
  _getInputsStatus(t) {
    const e = t.config?.inputs || {}, i = Object.keys(e).length;
    let a = 0;
    for (const s of Object.values(e))
      s.entity_id && s.entity_id.trim() && a++;
    return { total: i, bound: a };
  }
  _openMoreInfo(t, e) {
    e.stopPropagation(), this.dispatchEvent(
      new CustomEvent("hass-more-info", {
        detail: { entityId: t },
        bubbles: !0,
        composed: !0
      })
    );
  }
  _renderLiveOutputs(t) {
    const e = t.config?.outputs || {}, i = Object.keys(e);
    if (i.length === 0) return l``;
    const a = this._getInputsStatus(t);
    return l`
      <div class="card-live-outputs">
        <div class="live-outputs-header">
          <span class="live-outputs-title">Live Runtime Outputs</span>
          ${a.total > 0 && a.bound < a.total ? l`
                <span
                  class="badge badge-amber"
                  title="Some input antecedents do not have live sensor entities bound yet"
                >
                  ⚠️ ${a.total - a.bound} unbound input${a.total - a.bound > 1 ? "s" : ""}
                </span>
              ` : l`
                <span
                  class="badge badge-emerald"
                  title="Inputs bound to live sensors; rules actively evaluating"
                >
                  🟢 Reactive
                </span>
              `}
        </div>

        <div class="live-outputs-list">
          ${i.map((s) => {
      const r = this._findOutputSensor(t.system_id, s), n = e[s] || {}, o = r?.stateObj?.attributes?.unit_of_measurement || n.unit_of_measurement || "", d = r?.stateObj?.attributes?.dominant_term, c = r?.stateObj?.state, u = c !== void 0 && c !== "unknown" && c !== "unavailable" && !isNaN(parseFloat(c)), g = !!this._expandedWaveforms[`${t.system_id}_${s}`];
      if (r && u) {
        const h = parseFloat(c).toFixed(1);
        return l`
                <div style="display: inline-flex; align-items: center; gap: 4px;">
                  <button
                    class="output-badge live-active"
                    @click=${(f) => this._openMoreInfo(r.entityId, f)}
                    title="Entity: ${r.entityId} — Click to view Home Assistant history graph and diagnostic attributes"
                  >
                    <span class="pulse-dot"></span>
                    <span class="output-name">${s}:</span>
                    <span class="output-value">${h}${o ? ` ${o}` : ""}</span>
                    ${d ? l`<span class="dominant-term">(${d})</span>` : ""}
                  </button>
                  <button
                    class="btn btn-secondary"
                    style="padding: 2px 7px; font-size: 11px; border-radius: 9999px; height: 26px; line-height: 1;"
                    title="${g ? "Hide live waveform graph" : "View live aggregated fuzzy set waveform"}"
                    @click=${(f) => {
          f.stopPropagation(), this._toggleWaveform(t.system_id, s);
        }}
                  >
                    📈 ${g ? "Hide" : "Graph"}
                  </button>
                </div>
              `;
      }
      return l`
              <div
                class="output-badge live-idle"
                title="${r ? `Entity: ${r.entityId} (State: ${c})` : "Sensor entity not yet registered in Home Assistant"}"
              >
                <span class="idle-dot"></span>
                <span class="output-name">${s}:</span>
                <span class="output-value" style="color: var(--fuzzy-text-secondary);">
                  ${c === "unavailable" ? "Unavailable" : "Awaiting inputs"}
                </span>
              </div>
            `;
    })}
        </div>

        ${i.map((s) => {
      if (!this._expandedWaveforms[`${t.system_id}_${s}`]) return "";
      const r = this._findOutputSensor(t.system_id, s), n = e[s] || {}, o = r?.stateObj?.attributes?.unit_of_measurement || n.unit_of_measurement || "", d = r?.stateObj?.attributes?.universe || [], c = r?.stateObj?.attributes?.aggregated_set || [], u = r?.stateObj?.state, g = u !== void 0 && !isNaN(parseFloat(u)), h = r?.stateObj?.attributes?.dominant_term || "";
      return l`
            <div style="margin-top: 12px;">
              <fuzzy-aggregated-graph
                .universe=${d}
                .aggregatedSet=${c}
                .defuzzifiedValue=${g ? parseFloat(u) : void 0}
                .defuzzifier=${t.defuzzifier}
                .dominantTerm=${h}
                .unit=${o}
                .outputName=${s}
              ></fuzzy-aggregated-graph>
            </div>
          `;
    })}
      </div>
    `;
  }
  render() {
    const t = this._filteredSystems();
    return l`
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

      ${this._error ? l`<div style="color: var(--fuzzy-danger); margin-bottom: 16px;">${this._error}</div>` : ""}

      ${t.length === 0 && !this._loading ? l`
            <div class="empty-state">
              <h3 style="font-size: 18px; font-weight: 600; margin-bottom: 8px;">No Fuzzy Systems Found</h3>
              <p class="subtitle" style="margin-bottom: 20px;">
                ${this._searchQuery ? "No controllers match your search." : "Get started by using a starter template or creating a blank controller."}
              </p>
              <button class="btn btn-primary" @click=${() => this._showTemplateModal = !0}>
                Browse Starter Templates
              </button>
            </div>
          ` : l`
            <div class="systems-grid">
              ${t.map(
      (e) => l`
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

                    ${e.description ? l`<p class="subtitle" style="margin-bottom: 12px;">${e.description}</p>` : ""}

                    <div class="card-badges">
                      <span class="badge ${e.inference === "sugeno" ? "badge-amber" : "badge-cyan"}">
                        ${e.inference}
                      </span>
                      <span class="badge" style="background: var(--secondary-background-color, rgba(125,125,125,0.15)); border: 1px solid var(--divider-color, rgba(125,125,125,0.25)); color: var(--primary-text-color);">
                        ${e.defuzzifier}
                      </span>
                      ${e.max_updates_per_period ? l`<span class="badge badge-emerald" title="Rate limiter budget">
                            ⏱️ ${e.max_updates_per_period} / ${e.update_period}s
                          </span>` : ""}
                    </div>

                    ${this._renderLiveOutputs(e)}

                    <div class="card-metrics">
                      <span class="chip">${e.input_count} inputs</span>
                      <span class="chip">${e.output_count} outputs</span>
                      <span class="chip">${e.rule_count} rules</span>
                      ${e.epsilon !== void 0 ? l`<span class="chip">ε = ${e.epsilon}</span>` : ""}
                    </div>

                    <div class="card-actions">
                      <button class="btn btn-secondary" @click=${() => this._handleEdit(e)}>
                        ${e.source === "yaml" ? "Inspect" : "Edit"}
                      </button>
                      <button
                        class="btn btn-secondary"
                        style="color: var(--fuzzy-accent);"
                        title="Add custom:fuzzy-system-card for this controller to a Lovelace dashboard"
                        @click=${() => this._openDashboardModal(e)}
                      >
                        📊 Add Card
                      </button>
                      ${e.source === "config_entry" ? l`
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

      ${this._dashboardModalSystem ? l`
            <div
              class="modal-overlay"
              @click=${(e) => e.target === e.currentTarget && (this._dashboardModalSystem = void 0)}
            >
              <div class="modal-content" style="max-width: 520px; padding: 24px;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; border-bottom: 1px solid var(--fuzzy-card-border); padding-bottom: 14px;">
                  <div style="display: flex; align-items: center; gap: 10px;">
                    <span style="font-size: 24px;">📊</span>
                    <div>
                      <h2 class="title-lg" style="font-size: 18px; margin: 0;">Add to Lovelace Dashboard</h2>
                      <div class="subtitle" style="font-size: 12px; margin: 0;">
                        System: <code>${this._dashboardModalSystem.system_id}</code>
                      </div>
                    </div>
                  </div>
                  <button
                    class="btn btn-icon"
                    style="font-size: 16px;"
                    title="Close"
                    @click=${() => this._dashboardModalSystem = void 0}
                  >
                    ✕
                  </button>
                </div>

                <div class="form-group" style="margin-bottom: 14px;">
                  <label class="form-label">Card Header Title</label>
                  <input
                    class="input-text"
                    type="text"
                    .value=${this._dashboardCardTitle}
                    @input=${(e) => this._dashboardCardTitle = e.target.value}
                    placeholder="e.g. Living Room Fan Control"
                  />
                </div>

                <div class="form-group" style="margin-bottom: 14px;">
                  <label class="form-label">Target View Title</label>
                  <input
                    class="input-text"
                    type="text"
                    .value=${this._dashboardViewTitle}
                    @input=${(e) => this._dashboardViewTitle = e.target.value}
                    placeholder="e.g. Fuzzy Systems or Overview"
                  />
                  <span class="form-hint" style="font-size: 11px; color: var(--fuzzy-text-secondary); margin-top: 4px; display: block;">
                    Will append to this view, creating it if it doesn't already exist.
                  </span>
                </div>

                <div style="display: flex; flex-direction: column; gap: 10px; margin: 18px 0;">
                  <label style="display: flex; align-items: center; gap: 8px; cursor: pointer; font-size: 13px;">
                    <input
                      type="checkbox"
                      .checked=${this._dashboardShowGraph}
                      @change=${(e) => this._dashboardShowGraph = e.target.checked}
                    />
                    <span>Show live aggregated output waveform graph</span>
                  </label>
                  <label style="display: flex; align-items: center; gap: 8px; cursor: pointer; font-size: 13px;">
                    <input
                      type="checkbox"
                      .checked=${this._dashboardShowInputs}
                      @change=${(e) => this._dashboardShowInputs = e.target.checked}
                    />
                    <span>Show live antecedent input sensors</span>
                  </label>
                  <label style="display: flex; align-items: center; gap: 8px; cursor: pointer; font-size: 13px;">
                    <input
                      type="checkbox"
                      .checked=${this._dashboardShowRules}
                      @change=${(e) => this._dashboardShowRules = e.target.checked}
                    />
                    <span>Show active rule firing strengths</span>
                  </label>
                </div>

                ${this._dashboardStatusMsg ? l`
                      <div
                        style="padding: 10px 14px; border-radius: var(--fuzzy-radius-md); font-size: 13px; margin-bottom: 14px; background: ${this._dashboardIsError ? "rgba(239, 68, 68, 0.15)" : "rgba(16, 185, 129, 0.15)"}; color: ${this._dashboardIsError ? "var(--fuzzy-danger)" : "#34d399"}; border: 1px solid ${this._dashboardIsError ? "rgba(239, 68, 68, 0.3)" : "rgba(16, 185, 129, 0.3)"};"
                      >
                        ${this._dashboardStatusMsg}
                      </div>
                    ` : ""}

                <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 18px; border-top: 1px solid var(--fuzzy-card-border); padding-top: 16px;">
                  <button class="btn btn-secondary" @click=${this._handleCopyCardYaml}>
                    📋 Copy Card YAML
                  </button>
                  <div style="display: flex; gap: 8px;">
                    <button
                      class="btn btn-secondary"
                      @click=${() => this._dashboardModalSystem = void 0}
                    >
                      Cancel
                    </button>
                    <button
                      class="btn btn-primary"
                      ?disabled=${this._dashboardLoading}
                      @click=${this._handleAddToDashboard}
                    >
                      ${this._dashboardLoading ? "Adding..." : "Add to Dashboard"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ` : ""}

      ${this._showTemplateModal ? l`
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
  he,
  I`
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
        background: var(--secondary-background-color, rgba(125, 125, 125, 0.08));
        border: 1px solid var(--divider-color, rgba(125, 125, 125, 0.18));
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
        background: rgba(5, 150, 105, 0.14);
        border-color: rgba(5, 150, 105, 0.45);
        color: var(--fuzzy-success, #047857);
        font-weight: 700;
      }

      .output-badge.live-active:hover {
        background: rgba(5, 150, 105, 0.25);
        border-color: rgba(5, 150, 105, 0.7);
        transform: translateY(-1px);
        box-shadow: 0 2px 8px rgba(16, 185, 129, 0.25);
      }

      .output-badge.live-idle {
        background: var(--secondary-background-color, rgba(125, 125, 125, 0.06));
        border-color: var(--divider-color, rgba(125, 125, 125, 0.2));
        color: var(--secondary-text-color, #64748b);
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
w([
  v({ attribute: !1 })
], $.prototype, "hass", 2);
w([
  p()
], $.prototype, "_systems", 2);
w([
  p()
], $.prototype, "_searchQuery", 2);
w([
  p()
], $.prototype, "_loading", 2);
w([
  p()
], $.prototype, "_error", 2);
w([
  p()
], $.prototype, "_showTemplateModal", 2);
w([
  p()
], $.prototype, "_expandedWaveforms", 2);
w([
  p()
], $.prototype, "_dashboardModalSystem", 2);
w([
  p()
], $.prototype, "_dashboardViewTitle", 2);
w([
  p()
], $.prototype, "_dashboardCardTitle", 2);
w([
  p()
], $.prototype, "_dashboardShowGraph", 2);
w([
  p()
], $.prototype, "_dashboardShowInputs", 2);
w([
  p()
], $.prototype, "_dashboardShowRules", 2);
w([
  p()
], $.prototype, "_dashboardStatusMsg", 2);
w([
  p()
], $.prototype, "_dashboardIsError", 2);
w([
  p()
], $.prototype, "_dashboardLoading", 2);
$ = w([
  F("fuzzy-system-catalog")
], $);
var Js = Object.defineProperty, Zs = Object.getOwnPropertyDescriptor, oe = (t, e, i, a) => {
  for (var s = a > 1 ? void 0 : a ? Zs(e, i) : e, r = t.length - 1, n; r >= 0; r--)
    (n = t[r]) && (s = (a ? n(e, i, s) : n(s)) || s);
  return a && s && Js(e, i, s), s;
};
function Ze(t, e, i, a) {
  switch (t.toLowerCase()) {
    case "trimf": {
      const [s, r, n] = e;
      return i <= s || i >= n ? 0 : i === r ? 1 : i < r ? (i - s) / (r - s || 1e-6) : (n - i) / (n - r || 1e-6);
    }
    case "trapmf": {
      const [s, r, n, o] = e;
      return i <= s || i >= o ? 0 : i >= r && i <= n ? 1 : i < r ? (i - s) / (r - s || 1e-6) : (o - i) / (o - n || 1e-6);
    }
    case "gaussmf": {
      const [s, r] = e, n = r || 1;
      return Math.exp(-0.5 * Math.pow((i - s) / n, 2));
    }
    case "sigmf": {
      const [s, r] = e;
      return 1 / (1 + Math.exp(-s * (i - r)));
    }
    case "gbellmf": {
      const [s, r, n] = e;
      return 1 / (1 + Math.pow(Math.abs((i - n) / (s || 1e-6)), 2 * (r || 1)));
    }
    case "singleton":
    case "constant": {
      const [s] = e, r = (a || 100) * 0.015;
      return Math.abs(i - s) <= r ? 1 : 0;
    }
    default:
      return 0;
  }
}
const le = [
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
let U = class extends A {
  constructor() {
    super(...arguments), this.range = [0, 100], this.terms = {};
  }
  render() {
    const t = Number.isFinite(this.range[0]) ? this.range[0] : 0, e = Number.isFinite(this.range[1]) && this.range[1] > t ? this.range[1] : t + 100, i = e - t || 1, a = 600, s = 180, r = 36, n = 24, o = 16, d = 28, c = a - r - n, u = s - o - d, g = (b) => r + (b - t) / i * c, h = (b) => o + (1 - Math.max(0, Math.min(1, b))) * u, f = Object.keys(this.terms || {}), y = 120;
    return l`
      <div class="canvas-container">
        <svg viewBox="0 0 ${a} ${s}" preserveAspectRatio="xMidYMid meet">
          <!-- Horizontal Grid lines at mu = 0.0, 0.5, 1.0 -->
          <line class="grid-line" x1=${r} y1=${h(0.5)} x2=${r + c} y2=${h(0.5)} />
          <line class="grid-line" x1=${r} y1=${h(1)} x2=${r + c} y2=${h(1)} />

          <!-- Axes -->
          <line class="axis-line" x1=${r} y1=${o} x2=${r} y2=${o + u} />
          <line class="axis-line" x1=${r} y1=${o + u} x2=${r + c} y2=${o + u} />

          <!-- Y-axis tick labels -->
          <text class="axis-text" x=${r - 6} y=${h(1) + 3} text-anchor="end">1.0</text>
          <text class="axis-text" x=${r - 6} y=${h(0.5) + 3} text-anchor="end">0.5</text>
          <text class="axis-text" x=${r - 6} y=${h(0) + 3} text-anchor="end">0.0</text>

          <!-- X-axis tick labels -->
          <text class="axis-text" x=${r} y=${s - 10} text-anchor="start">${t}</text>
          <text class="axis-text" x=${r + c / 2} y=${s - 10} text-anchor="middle">
            ${(t + i / 2).toFixed(1)}
          </text>
          <text class="axis-text" x=${r + c} y=${s - 10} text-anchor="end">
            ${e} ${this.unit || ""}
          </text>

          <!-- Curves for each membership term -->
          ${f.map((b, W) => {
      const O = this.terms[b];
      if (!O || !O.params) return J``;
      const D = le[W % le.length], G = [];
      for (let E = 0; E <= y; E++) {
        const M = t + E / y * i, Y = Ze(O.type, O.params, M, i);
        G.push([g(M), h(Y)]);
      }
      const L = G.reduce(
        (E, [M, Y], cs) => cs === 0 ? `M ${M} ${Y}` : `${E} L ${M} ${Y}`,
        ""
      ), k = `${L} L ${r + c} ${o + u} L ${r} ${o + u} Z`;
      return J`
              <g>
                <path class="curve-fill" d=${k} fill=${D.fill} />
                <path class="curve-path" d=${L} fill="none" stroke=${D.stroke} />
              </g>
            `;
    })}

          <!-- Current Value Marker (if provided) -->
          ${this.currentValue !== void 0 && !isNaN(this.currentValue) ? (() => {
      const b = g(Math.max(t, Math.min(e, this.currentValue)));
      return J`
                  <g>
                    <line
                      class="current-val-line"
                      x1=${b}
                      y1=${o}
                      x2=${b}
                      y2=${o + u}
                    />
                    <circle cx=${b} cy=${o + u} r="4" fill="#f43f5e" />
                    <text
                      class="axis-text"
                      x=${b}
                      y=${o - 4}
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
          ${f.map((b, W) => {
      const O = this.terms[b], D = le[W % le.length];
      return l`
              <div class="legend-item" style="color: ${D.stroke};">
                <span class="legend-swatch" style="background: ${D.stroke};"></span>
                <span>${b}</span>
                <span style="opacity: 0.6; font-size: 10px;">(${O.type})</span>
              </div>
            `;
    })}
        </div>
      </div>
    `;
  }
};
U.styles = I`
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
oe([
  v({ type: Array })
], U.prototype, "range", 2);
oe([
  v({ type: Object })
], U.prototype, "terms", 2);
oe([
  v({ type: Number })
], U.prototype, "currentValue", 2);
oe([
  v({ type: String })
], U.prototype, "unit", 2);
U = oe([
  F("fuzzy-curve-canvas")
], U);
var Qs = Object.defineProperty, Xs = Object.getOwnPropertyDescriptor, _ = (t, e, i, a) => {
  for (var s = a > 1 ? void 0 : a ? Xs(e, i) : e, r = t.length - 1, n; r >= 0; r--)
    (n = t[r]) && (s = (a ? n(e, i, s) : n(s)) || s);
  return a && s && Qs(e, i, s), s;
};
let m = class extends A {
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
    }, this._rawJson = JSON.stringify(this._config, null, 2), this._initSimInputs();
  }
  _initSimInputs(t = !1) {
    const e = {};
    for (const [i, a] of Object.entries(this._config?.inputs || {})) {
      const s = Number.isFinite(a.range?.[0]) ? a.range[0] : 0, r = Number.isFinite(a.range?.[1]) && a.range[1] > s ? a.range[1] : s + 100, n = this._simInputs[i];
      if (!t && n !== void 0 && n >= s && n <= r)
        e[i] = n;
      else if (a.entity_id && this.hass?.states?.[a.entity_id]) {
        const o = parseFloat(this.hass.states[a.entity_id].state);
        e[i] = isNaN(o) ? (s + r) / 2 : o;
      } else a.default !== void 0 ? e[i] = a.default : e[i] = (s + r) / 2;
    }
    this._simInputs = e;
  }
  _syncSimWithLiveHass() {
    const t = { ...this._simInputs };
    for (const [e, i] of Object.entries(this._config.inputs || {}))
      if (i.entity_id && this.hass?.states?.[i.entity_id]) {
        const a = parseFloat(this.hass.states[i.entity_id].state);
        isNaN(a) || (t[e] = a);
      }
    this._simInputs = t, this._runSimulation();
  }
  _onSimInputChange(t, e) {
    this._simInputs = { ...this._simInputs, [t]: e }, this._simDebounceTimer && clearTimeout(this._simDebounceTimer), this._simDebounceTimer = window.setTimeout(() => {
      this._runSimulation();
    }, 50);
  }
  async _runSimulation() {
    if (this.hass) {
      this._simulating = !0, this._simError = "";
      try {
        const t = await Ye(this.hass, this._config, this._simInputs);
        this._simResults = t;
      } catch (t) {
        this._simError = t?.message || String(t);
      } finally {
        this._simulating = !1, this.requestUpdate();
      }
    }
  }
  _findOutputSensor(t) {
    if (!this.hass?.states || !this._config.system_id) return null;
    const i = `sensor.fuzzy_${this._config.system_id.toLowerCase()}_${t.toLowerCase()}`;
    return this.hass.states[i] || null;
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
      const t = await Ds(this.hass, this._config, this.entryId);
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
      const a = i.attributes.unit_of_measurement;
      a === "°C" ? (this._newInputMin = 10, this._newInputMax = 35) : a === "°F" ? (this._newInputMin = 50, this._newInputMax = 95) : a === "%" ? (this._newInputMin = 0, this._newInputMax = 100) : a === "lx" || a === "lux" ? (this._newInputMin = 0, this._newInputMax = 1e3) : a === "ppm" ? (this._newInputMin = 400, this._newInputMax = 2e3) : (a === "W" || a === "kW") && (this._newInputMin = 0, this._newInputMax = 5e3);
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
    const e = Number.isFinite(this._newInputMin) ? this._newInputMin : 0, i = Number.isFinite(this._newInputMax) && this._newInputMax > e ? this._newInputMax : e + 100, a = i - e;
    let s;
    this._newInputTermsPreset === "5_terms" ? s = {
      very_low: { type: "trapmf", params: [e, e, e + a * 0.15, e + a * 0.3] },
      low: { type: "trimf", params: [e + a * 0.15, e + a * 0.35, e + a * 0.55] },
      medium: { type: "trimf", params: [e + a * 0.35, e + a * 0.5, e + a * 0.65] },
      high: { type: "trimf", params: [e + a * 0.45, e + a * 0.65, e + a * 0.85] },
      very_high: { type: "trapmf", params: [e + a * 0.7, e + a * 0.85, i, i] }
    } : s = {
      low: { type: "trapmf", params: [e, e, e + a * 0.25, e + a * 0.5] },
      medium: { type: "trimf", params: [e + a * 0.25, e + a * 0.5, e + a * 0.75] },
      high: { type: "trapmf", params: [e + a * 0.5, e + a * 0.75, i, i] }
    }, this._config.inputs || (this._config.inputs = {}), this._config.inputs[t] = {
      entity_id: this._newInputEntityId || "",
      range: [e, i],
      resolution: 100,
      default: e,
      terms: s
    }, this._showAddInputModal = !1, this.requestUpdate();
  }
  _getAvailableEntities() {
    if (!this.hass?.states) return [];
    const t = [];
    for (const [e, i] of Object.entries(this.hass.states)) {
      const a = e.split(".")[0];
      (a === "sensor" || a === "input_number" || a === "number" || a === "climate" || a === "weather") && t.push({
        entity_id: e,
        friendly_name: i.attributes?.friendly_name || e,
        unit: i.attributes?.unit_of_measurement || "",
        state: i.state
      });
    }
    return t.sort((e, i) => e.friendly_name.localeCompare(i.friendly_name)), t;
  }
  _renderEntityPicker(t, e, i) {
    const a = !!customElements.get("ha-entity-picker"), s = this._getAvailableEntities();
    return a ? l`
        <ha-entity-picker
          .hass=${this.hass}
          .value=${t || ""}
          ?disabled=${e}
          .includeDomains=${["sensor", "input_number", "number", "climate", "weather"]}
          @value-changed=${(r) => i(r.detail.value || "")}
        ></ha-entity-picker>
      ` : l`
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
          ${s.map(
      (r) => l`
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
      return l`
        <span class="badge badge-amber" title="This variable has no live sensor bound yet">
          ⚠️ Unbound (Add entity to track live values)
        </span>
      `;
    const e = this.hass?.states ? this.hass.states[t] : null;
    if (!e)
      return l`
        <span class="badge" style="background: rgba(239,68,68,0.15); color: #f87171;">
          ❓ ${t} (Not found in HA)
        </span>
      `;
    const i = e.attributes?.unit_of_measurement || "";
    return l`
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
    const i = e[1].trim(), s = e[2].trim().match(/^([a-zA-Z0-9_]+)\s*(?:IS|=)\s*(.+)$/i);
    if (!s) return null;
    const r = s[1].trim(), n = s[2].trim(), o = parseFloat(n), d = !isNaN(o) && isFinite(o) && !n.match(/[a-zA-Z]/), c = i.split(/\s+(AND|OR)\s+/i), u = [];
    let g = "AND";
    for (let h = 0; h < c.length; h++) {
      const f = c[h].trim();
      if (!f) continue;
      if (f.toUpperCase() === "AND") {
        g = "AND";
        continue;
      }
      if (f.toUpperCase() === "OR") {
        g = "OR";
        continue;
      }
      const y = f.match(
        /^([a-zA-Z0-9_]+)\s+IS\s+(?:(not|very|somewhat|extremely|slightly)\s+)?([a-zA-Z0-9_]+)$/i
      );
      if (!y) return null;
      u.push({
        variable: y[1].trim(),
        hedge: (y[2] || "").trim().toLowerCase(),
        term: y[3].trim(),
        connector: u.length === 0 ? "AND" : g
      });
    }
    return u.length === 0 ? null : {
      conditions: u,
      consequent: {
        variable: r,
        term: d ? "" : n,
        isConstant: d,
        constantValue: d ? o : 0
      }
    };
  }
  _compileRuleString(t, e) {
    const i = [];
    t.forEach((r, n) => {
      const o = r.hedge ? `${r.hedge} ` : "", d = `${r.variable} IS ${o}${r.term}`;
      n === 0 ? i.push(d) : i.push(`${r.connector} ${d}`);
    });
    const a = i.join(" "), s = e.isConstant ? `${e.variable} IS ${e.constantValue}` : `${e.variable} IS ${e.term}`;
    return `IF ${a} THEN ${s}`;
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
    const i = t[0], a = Object.keys(this._config.inputs[i]?.terms || {}), s = e[0], r = Object.keys(this._config.outputs[s]?.terms || {});
    this._editingRuleIndex = -1, this._builderConditions = [
      {
        variable: i,
        hedge: "",
        term: a[0] || "low",
        connector: "AND"
      }
    ], this._builderConsequent = {
      variable: s,
      term: r[0] || "low",
      isConstant: !1,
      constantValue: 0
    }, this._showRuleBuilderModal = !0;
  }
  _openEditRuleBuilder(t) {
    this._ruleBuilderError = "";
    const e = this._config.rules[t] || "", i = this._parseRuleToBuilder(e);
    if (i)
      this._editingRuleIndex = t, this._builderConditions = i.conditions, this._builderConsequent = i.consequent, this._showRuleBuilderModal = !0;
    else {
      const a = Object.keys(this._config.inputs || {}), s = Object.keys(this._config.outputs || {}), r = a[0] || "", n = Object.keys(this._config.inputs[r]?.terms || {}), o = s[0] || "", d = Object.keys(this._config.outputs[o]?.terms || {});
      this._editingRuleIndex = t, this._builderConditions = [
        {
          variable: r,
          hedge: "",
          term: n[0] || "low",
          connector: "AND"
        }
      ], this._builderConsequent = {
        variable: o,
        term: d[0] || "low",
        isConstant: !1,
        constantValue: 0
      }, this._ruleBuilderError = `Notice: Rule #${t + 1} uses non-standard formatting. Configuring it here will format it as canonical syntax.`, this._showRuleBuilderModal = !0;
    }
  }
  _onBuilderConditionVarChange(t, e) {
    const i = Object.keys(this._config.inputs[e]?.terms || {});
    this._builderConditions[t].variable = e, this._builderConditions[t].term = i[0] || "", this.requestUpdate();
  }
  _onBuilderConsequentVarChange(t) {
    const e = Object.keys(this._config.outputs[t]?.terms || {});
    this._builderConsequent.variable = t, this._builderConsequent.isConstant || (this._builderConsequent.term = e[0] || ""), this.requestUpdate();
  }
  _addBuilderCondition(t = "AND") {
    const i = Object.keys(this._config.inputs || {})[0] || "", a = Object.keys(this._config.inputs[i]?.terms || {});
    this._builderConditions.push({
      variable: i,
      hedge: "",
      term: a[0] || "",
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
    if (!this._config) return l``;
    const t = this.source === "yaml";
    return l`
      <div class="header-actions">
        <div>
          <button class="btn btn-secondary" @click=${this._handleBack}>
            ← Back to Catalog
          </button>
        </div>

        <div style="display: flex; gap: 10px; align-items: center;">
          ${this._saving ? l`<span class="chip">Saving...</span>` : ""}
          ${t ? "" : l`
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

      ${t ? l`
            <div class="yaml-banner">
              <span>⚠️</span>
              <div>
                <strong>Defined in configuration.yaml</strong> — This controller is managed via YAML configuration and is shown in read-only inspection mode.
              </div>
            </div>
          ` : ""}
      ${this._error ? l`<div style="color: var(--fuzzy-danger); margin-bottom: 16px;">${this._error}</div>` : ""}
      ${this._successMsg ? l`<div style="color: var(--fuzzy-success); margin-bottom: 16px;">${this._successMsg}</div>` : ""}

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

        ${this._renderActiveTab(t)}
      </div>

      ${this._showAddInputModal ? this._renderAddInputModal() : ""}
      ${this._showRuleBuilderModal ? this._renderRuleBuilderModal() : ""}
    `;
  }
  _renderAddInputModal() {
    return l`
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

          ${this._newInputModalError ? l`<div style="color: var(--fuzzy-danger); margin-bottom: 14px; font-size: 13px;">${this._newInputModalError}</div>` : ""}

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

          ${this._newInputEntityId ? l`
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
      case "simulation":
        return this._renderSimulationTab();
      case "raw":
        return this._renderRawTab(t);
    }
  }
  _renderGeneralTab(t) {
    return l`
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
            ${this._config.inference === "sugeno" ? l`
                  <option value="weighted_average">Weighted Average (weighted_average)</option>
                  <option value="wtsum">Weighted Sum (wtsum)</option>
                ` : l`
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
    const e = this._config.inputs || {}, i = Object.keys(e);
    return l`
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
        <div>
          <h3 class="section-title">Input Antecedents</h3>
          <p class="helper-text">Sensors and numerical inputs mapped to linguistic membership terms</p>
        </div>
        ${t ? "" : l`
              <button class="btn btn-secondary" @click=${this._openAddInputModal}>
                + Add Input Variable
              </button>
            `}
      </div>

      ${i.length === 0 ? l`<p class="subtitle" style="padding: 20px 0;">No input variables defined yet.</p>` : i.map((a) => {
      const s = e[a], r = s.entity_id && this.hass?.states ? this.hass.states[s.entity_id] : null, n = r && !isNaN(parseFloat(r.state)) ? parseFloat(r.state) : void 0, o = r?.attributes?.unit_of_measurement || "";
      return l`
              <div class="section-box">
                <div class="section-header">
                  <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
                    <span class="badge badge-cyan">${a}</span>
                    ${this._renderEntityStatusTag(s.entity_id)}
                    <span class="chip">Range: [${s.range[0]}, ${s.range[1]}]</span>
                  </div>
                  ${t ? "" : l`
                        <button class="btn btn-danger btn-icon" @click=${() => this._removeInput(a)} title="Delete Input">
                          ✕
                        </button>
                      `}
                </div>

                <div class="grid-2">
                  <div class="form-group">
                    <label class="form-label">Bound Home Assistant Sensor Entity</label>
                    ${this._renderEntityPicker(s.entity_id, t, (d) => {
        s.entity_id = d, this.requestUpdate();
      })}
                    <div class="helper-text">
                      ${s.entity_id ? l`Feeds live numerical measurements from <code>${s.entity_id}</code> into <code>${a}</code>.` : l`<span style="color: #fbbf24;">⚠️ Unbound: select an entity to evaluate live rules in HA.</span>`}
                    </div>
                  </div>

                  <div class="grid-2">
                    <div class="form-group">
                      <label class="form-label">Range Min</label>
                      <input
                        class="input-text"
                        type="number"
                        .value=${String(s.range[0])}
                        ?disabled=${t}
                        @input=${(d) => {
        s.range[0] = parseFloat(d.target.value), this.requestUpdate();
      }}
                      />
                    </div>
                    <div class="form-group">
                      <label class="form-label">Range Max</label>
                      <input
                        class="input-text"
                        type="number"
                        .value=${String(s.range[1])}
                        ?disabled=${t}
                        @input=${(d) => {
        s.range[1] = parseFloat(d.target.value), this.requestUpdate();
      }}
                      />
                    </div>
                  </div>
                </div>

                <div style="margin-top: 14px;">
                  <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
                    <span class="form-label" style="margin: 0;">Membership Curves Preview</span>
                    ${n !== void 0 ? l`<span class="chip" style="color: #34d399;">Live Sensor State: ${n}${o ? ` ${o}` : ""}</span>` : ""}
                  </div>
                  <fuzzy-curve-canvas
                    .range=${s.range}
                    .terms=${s.terms || {}}
                    .currentValue=${n}
                    .unit=${o}
                  ></fuzzy-curve-canvas>
                </div>

                ${this._renderTermsEditor(s.terms, s.range, t, () => this.requestUpdate())}
              </div>
            `;
    })}
    `;
  }
  _renderOutputsTab(t) {
    const e = this._config.outputs || {}, i = Object.keys(e);
    return l`
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
        <div>
          <h3 class="section-title">Output Consequents</h3>
          <p class="helper-text">Control targets defuzzified and published to Home Assistant sensors</p>
        </div>
        ${t ? "" : l`
              <button class="btn btn-secondary" @click=${this._addOutput}>
                + Add Output Variable
              </button>
            `}
      </div>

      ${i.length === 0 ? l`<p class="subtitle" style="padding: 20px 0;">No output variables defined yet.</p>` : i.map((a) => {
      const s = e[a], r = this._findOutputSensor(a), n = r && !isNaN(parseFloat(r.state)) ? parseFloat(r.state) : void 0;
      return l`
              <div class="section-box">
                <div class="section-header">
                  <div style="display: flex; align-items: center; gap: 8px;">
                    <span class="badge badge-amber">${a}</span>
                    <span class="chip">Range: [${s.range[0]}, ${s.range[1]}]</span>
                    ${s.unit_of_measurement ? l`<span class="chip">${s.unit_of_measurement}</span>` : ""}
                  </div>
                  ${t ? "" : l`
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
                      .value=${String(s.range[0])}
                      ?disabled=${t}
                      @input=${(o) => {
        s.range[0] = parseFloat(o.target.value), this.requestUpdate();
      }}
                    />
                  </div>
                  <div class="form-group">
                    <label class="form-label">Range Max</label>
                    <input
                      class="input-text"
                      type="number"
                      .value=${String(s.range[1])}
                      ?disabled=${t}
                      @input=${(o) => {
        s.range[1] = parseFloat(o.target.value), this.requestUpdate();
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
                      .value=${s.epsilon !== void 0 ? String(s.epsilon) : ""}
                      ?disabled=${t}
                      @input=${(o) => {
        const d = o.target.value.trim();
        s.epsilon = d ? parseFloat(d) : void 0, this.requestUpdate();
      }}
                    />
                  </div>
                </div>

                <div style="margin-top: 14px;">
                  <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
                    <span class="form-label" style="margin: 0;">Output Membership Curves Preview</span>
                    ${n !== void 0 ? l`<span class="chip" style="color: #34d399;">Live Sensor Output: ${n}${s.unit_of_measurement ? ` ${s.unit_of_measurement}` : ""}</span>` : ""}
                  </div>
                  <fuzzy-curve-canvas
                    .range=${s.range}
                    .terms=${s.terms || {}}
                    .currentValue=${n}
                    .unit=${s.unit_of_measurement || ""}
                  ></fuzzy-curve-canvas>
                </div>

                ${this._renderTermsEditor(s.terms, s.range, t, () => this.requestUpdate())}
              </div>
            `;
    })}
    `;
  }
  _renderTermsEditor(t, e, i, a) {
    const s = Object.keys(t || {});
    return l`
      <div style="margin-top: 16px; padding-top: 12px; border-top: 1px solid rgba(255, 255, 255, 0.08);">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
          <span class="form-label" style="margin: 0; font-size: 13px;">Linguistic Membership Terms</span>
          ${i ? "" : l`
                <button
                  class="btn btn-secondary"
                  style="font-size: 12px; padding: 4px 10px;"
                  @click=${() => {
      const r = `term_${s.length + 1}`, n = (e[0] + e[1]) / 2, o = e[1] - e[0] || 10;
      t[r] = {
        type: "trimf",
        params: [n - o * 0.25, n, n + o * 0.25]
      }, a();
    }}
                >
                  + Add Term
                </button>
              `}
        </div>

        <div style="display: flex; flex-direction: column; gap: 8px;">
          ${s.map((r) => {
      const n = t[r];
      return l`
              <div
                style="display: flex; align-items: center; gap: 10px; background: rgba(0, 0, 0, 0.25); padding: 8px 12px; border-radius: var(--fuzzy-radius-md); border: 1px solid rgba(255, 255, 255, 0.04); flex-wrap: wrap;"
              >
                <div style="min-width: 110px;">
                  <strong style="color: var(--fuzzy-text); font-size: 13px;">${r}</strong>
                </div>

                <div style="width: 120px;">
                  <select
                    class="select-input"
                    style="padding: 4px 8px; font-size: 12px;"
                    .value=${n.type || "trimf"}
                    ?disabled=${i}
                    @change=${(o) => {
        n.type = o.target.value, a();
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
                    .value=${Array.isArray(n.params) ? n.params.join(", ") : ""}
                    placeholder="e.g. 18, 21, 24"
                    ?disabled=${i}
                    @input=${(o) => {
        const d = o.target.value.split(",").map((c) => parseFloat(c.trim()));
        d.every((c) => !isNaN(c)) && (n.params = d, a());
      }}
                  />
                </div>

                ${i ? "" : l`
                      <button
                        class="btn btn-danger btn-icon"
                        style="width: 26px; height: 26px; padding: 0;"
                        title="Delete Term"
                        @click=${() => {
        delete t[r], a();
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
    const t = this._config.inputs || {}, e = this._config.outputs || {}, i = Object.keys(t), a = Object.keys(e);
    return l`
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

        ${this._simError ? l`<div style="color: var(--fuzzy-danger); margin-bottom: 16px;">Simulation Error: ${this._simError}</div>` : ""}

        <div class="grid-2" style="gap: 24px; align-items: start;">
          <!-- Left: Antecedent Sliders -->
          <div>
            <h4 style="font-size: 14px; font-weight: 700; color: var(--fuzzy-primary, #0284c7); margin-bottom: 12px; text-transform: uppercase; letter-spacing: 0.05em;">
              📥 Antecedents (Input Values)
            </h4>

            ${i.length === 0 ? l`<p class="subtitle">No input variables defined yet.</p>` : i.map((s) => {
      const r = t[s], n = r.range[0], o = r.range[1], d = (o - n) / 100 || 1, c = this._simInputs[s] ?? n;
      return l`
                    <div class="section-box" style="margin-bottom: 14px; padding: 14px;">
                      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                        <div>
                          <strong style="color: var(--fuzzy-text); font-size: 14px;">${s}</strong>
                          ${r.entity_id ? l`<span class="helper-text" style="margin-left: 6px;">(${r.entity_id})</span>` : ""}
                        </div>
                        <span class="badge badge-cyan" style="font-size: 13px; font-weight: 700;">
                          ${typeof c == "number" ? c.toFixed(2) : c}
                        </span>
                      </div>

                      <div style="display: flex; align-items: center; gap: 12px;">
                        <input
                          type="range"
                          style="flex: 1; accent-color: var(--fuzzy-primary, #0284c7); cursor: pointer;"
                          min=${n}
                          max=${o}
                          step=${d}
                          .value=${String(c)}
                          @input=${(u) => this._onSimInputChange(s, parseFloat(u.target.value))}
                        />
                        <input
                          class="input-text"
                          type="number"
                          style="width: 80px; padding: 4px 8px; font-size: 12px;"
                          min=${n}
                          max=${o}
                          step=${d}
                          .value=${String(c)}
                          @input=${(u) => this._onSimInputChange(s, parseFloat(u.target.value))}
                        />
                      </div>

                      <!-- Real-time term membership degrees -->
                      <div style="display: flex; gap: 6px; flex-wrap: wrap; margin-top: 10px;">
                        ${Object.keys(r.terms || {}).map((u) => {
        const g = r.terms[u], h = Ze(g.type, g.params, c, o - n), f = h > 0.01;
        return l`
                            <span
                              class="chip"
                              style="${f ? "background: rgba(2, 132, 199, 0.15); border: 1px solid rgba(2, 132, 199, 0.4); color: #0284c7; font-weight: 600;" : "opacity: 0.6; color: var(--secondary-text-color);"}"
                            >
                              ${u}: <strong>${h.toFixed(2)}</strong>
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
            <h4 style="font-size: 14px; font-weight: 700; color: var(--fuzzy-warning, #d97706); margin-bottom: 12px; text-transform: uppercase; letter-spacing: 0.05em;">
              📤 Consequents & Distribution Waveforms
            </h4>

            ${a.length === 0 ? l`<p class="subtitle">No output variables defined yet.</p>` : a.map((s) => {
      const r = e[s], n = this._simResults ? this._simResults[s] : null, o = r.unit_of_measurement || "", d = this._config.inference === "mamdani";
      return l`
                    <div class="section-box" style="margin-bottom: 16px; padding: 14px;">
                      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; flex-wrap: wrap; gap: 8px;">
                        <div>
                          <strong style="font-size: 15px; color: var(--fuzzy-text);">${s}</strong>
                          <span class="chip" style="margin-left: 8px;">Range: [${r.range[0]}, ${r.range[1]}]</span>
                        </div>
                        <div style="display: flex; align-items: center; gap: 8px;">
                          ${n?.dominant_term ? l`<span class="badge badge-amber">Dominant: ${n.dominant_term}</span>` : ""}
                          <span class="badge badge-emerald" style="font-size: 14px; font-weight: 700;">
                            ${n?.defuzzified_value !== void 0 && n?.defuzzified_value !== null ? `${n.defuzzified_value.toFixed(2)}${o ? ` ${o}` : ""}` : "N/A"}
                          </span>
                        </div>
                      </div>

                      ${d && n?.universe && n.universe.length > 0 ? l`
                            <fuzzy-aggregated-graph
                              .universe=${n.universe}
                              .aggregatedSet=${n.aggregated_set || []}
                              .defuzzifiedValue=${n.defuzzified_value}
                              .defuzzifier=${r.defuzzifier || this._config.defuzzifier || "cog"}
                              .dominantTerm=${n.dominant_term || ""}
                              .unit=${o}
                              .outputName=${s}
                            ></fuzzy-aggregated-graph>
                          ` : d ? l`
                              <div style="background: rgba(0,0,0,0.3); border-radius: 8px; padding: 16px; text-align: center; color: var(--fuzzy-text-secondary); font-size: 12px;">
                                Awaiting simulation results...
                              </div>
                            ` : l`
                              <!-- Sugeno singleton activations preview -->
                              <div style="background: rgba(0,0,0,0.3); border-radius: 8px; padding: 14px; border: 1px solid rgba(255,255,255,0.06);">
                                <div style="font-size: 11px; font-weight: 700; color: #fbbf24; text-transform: uppercase; margin-bottom: 8px;">
                                  ⚡ Sugeno Crisp Singleton Weighting (${this._config.defuzzifier || "weighted_average"})
                                </div>
                                <div style="font-size: 13px; color: var(--fuzzy-text);">
                                  Weighted Output: <strong>${n?.defuzzified_value !== void 0 ? n.defuzzified_value.toFixed(2) : "0.00"}${o ? ` ${o}` : ""}</strong>
                                </div>
                              </div>
                            `}

                      <!-- Term activations chips -->
                      ${n?.term_activations ? l`
                            <div style="display: flex; gap: 6px; flex-wrap: wrap; margin-top: 10px;">
                              ${Object.entries(n.term_activations).map(([c, u]) => {
        const g = u > 0.01;
        return l`
                                  <span
                                    class="chip"
                                    style="${g ? "background: rgba(5, 150, 105, 0.15); border: 1px solid rgba(5, 150, 105, 0.4); color: #059669; font-weight: 600;" : "opacity: 0.6; color: var(--secondary-text-color);"}"
                                  >
                                    ${c === "false" || c === !1 ? "off" : c}: <strong>${u.toFixed(2)}</strong>
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

          ${!this._simResults || Object.keys(this._simResults).length === 0 ? l`<p class="subtitle">Run simulation to inspect rule firings.</p>` : l`
                <div style="display: flex; flex-direction: column; gap: 8px;">
                  ${(() => {
      const s = a[0], r = this._simResults[s]?.rule_strengths || [];
      return r.length === 0 ? l`<p class="subtitle">No rules fired or defined.</p>` : r.map((n) => {
        const o = n.firing_strength || 0, d = o > 0.01;
        return l`
                        <div
                          style="display: flex; align-items: center; gap: 12px; background: ${d ? "rgba(2, 132, 199, 0.12)" : "var(--secondary-background-color, rgba(125, 125, 125, 0.05))"}; padding: 10px 14px; border-radius: var(--fuzzy-radius-md); border: 1px solid ${d ? "rgba(2, 132, 199, 0.4)" : "var(--divider-color, rgba(125, 125, 125, 0.18))"};"
                        >
                          <div style="font-family: monospace; font-size: 12px; flex: 1; color: ${d ? "var(--fuzzy-primary, #0284c7)" : "var(--primary-text-color, var(--fuzzy-text))"}; font-weight: ${d ? "700" : "500"};">
                            ${n.rule}
                          </div>
                          <div style="width: 140px; display: flex; align-items: center; gap: 8px;">
                            <div style="flex: 1; height: 6px; background: var(--divider-color, rgba(125, 125, 125, 0.2)); border-radius: 3px; overflow: hidden;">
                              <div
                                style="width: ${Math.round(o * 100)}%; height: 100%; background: ${d ? "linear-gradient(90deg, #0284c7, #38bdf8)" : "var(--secondary-text-color, #64748b)"}; border-radius: 3px;"
                              ></div>
                            </div>
                            <span style="font-size: 11px; font-weight: 700; font-family: monospace; color: ${d ? "var(--fuzzy-primary, #0284c7)" : "var(--secondary-text-color, #64748b)"}; width: 34px; text-align: right;">
                              ${o.toFixed(2)}
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
  _renderRulesTab(t) {
    const e = this._config.rules || [];
    return l`
      <div
        style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; flex-wrap: wrap; gap: 12px;"
      >
        <div>
          <h3 class="section-title">Linguistic Rules</h3>
          <p class="helper-text">
            Declarative IF &lt;antecedents&gt; THEN &lt;consequents&gt; with AND, OR, NOT and linguistic hedges
          </p>
        </div>
        ${t ? "" : l`
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

      ${e.length === 0 ? l`
            <div
              style="text-align: center; padding: 40px 20px; background: rgba(15, 23, 42, 0.3); border-radius: var(--fuzzy-radius-md); border: 1px dashed var(--fuzzy-card-border);"
            >
              <div style="font-size: 28px; margin-bottom: 8px;">📜</div>
              <h4 style="font-weight: 600; margin-bottom: 6px;">No Inference Rules Defined Yet</h4>
              <p class="helper-text" style="margin-bottom: 18px;">
                Rules map your input linguistic terms (e.g. temperature IS hot) to output targets (e.g. fan_speed IS fast).
              </p>
              ${t ? "" : l`
                    <button class="btn btn-primary" @click=${this._openAddRuleBuilder}>
                      ✨ Create First Rule with Builder
                    </button>
                  `}
            </div>
          ` : this._rulesViewMode === "visual" ? e.map((i, a) => {
      const s = this._parseRuleToBuilder(i);
      return s ? l`
              <div class="rule-card">
                <div style="display: flex; flex-direction: column; gap: 8px; flex: 1;">
                  <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
                    <span class="badge badge-purple" style="min-width: 28px; justify-content: center;">R${a + 1}</span>
                    <span class="badge badge-cyan">IF</span>
                    ${s.conditions.map(
        (r, n) => l`
                        ${n > 0 ? l`<span class="badge badge-purple">${r.connector}</span>` : ""}
                        <span class="rule-var">${r.variable}</span>
                        <span class="rule-op">${r.hedge ? `is ${r.hedge}` : "is"}</span>
                        <span class="rule-term">${r.term}</span>
                      `
      )}
                    <span class="badge badge-amber">THEN</span>
                    <span class="rule-var-consequent">
                      ${s.consequent.variable}
                    </span>
                    <span class="rule-op">is</span>
                    <span class="rule-term">
                      ${s.consequent.isConstant ? s.consequent.constantValue : s.consequent.term}
                    </span>
                  </div>
                  <div class="rule-raw">
                    ${i}
                  </div>
                </div>

                ${t ? "" : l`
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
            ` : l`
                <div class="rule-card">
                  <div style="display: flex; align-items: center; gap: 10px; flex: 1;">
                    <span class="badge badge-purple" style="width: 24px; justify-content: center;">${a + 1}</span>
                    <span style="font-family: monospace; font-size: 13px;">${i}</span>
                  </div>
                  ${t ? "" : l`
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
    }) : e.map(
      (i, a) => l`
              <div class="rule-item">
                <span class="badge badge-purple" style="width: 24px; justify-content: center;">${a + 1}</span>
                <input
                  class="input-text rule-input"
                  type="text"
                  .value=${i}
                  ?disabled=${t}
                  @input=${(s) => this._updateRule(a, s.target.value)}
                />
                ${t ? "" : l`
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
    const t = Object.keys(this._config.inputs || {}), e = Object.keys(this._config.outputs || {});
    return l`
      <div
        class="modal-overlay"
        @click=${(i) => {
      i.target.classList.contains("modal-overlay") && (this._showRuleBuilderModal = !1);
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
            <div style="font-weight: 700; color: var(--fuzzy-primary, #0284c7); margin-bottom: 2px;">
              💡 Guided Linguistic Rule Builder
            </div>
            <div style="color: var(--fuzzy-text-secondary);">
              Configure linguistic clauses using dropdown controls. Variables and terms are automatically populated from your system definition.
            </div>
          </div>

          ${this._ruleBuilderError ? l`<div style="color: var(--fuzzy-danger); margin-bottom: 14px; font-size: 13px;">${this._ruleBuilderError}</div>` : ""}

          <!-- Antecedents (IF) -->
          <div
            class="section-box"
            style="background: rgba(14, 165, 233, 0.05); border: 1px solid rgba(14, 165, 233, 0.25); padding: 18px; margin-bottom: 18px; border-radius: var(--fuzzy-radius-md);"
          >
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px;">
              <span style="font-weight: 700; color: var(--fuzzy-primary, #0284c7); font-size: 14px; text-transform: uppercase; letter-spacing: 0.05em;">
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

            ${this._builderConditions.map((i, a) => {
      const s = Object.keys(this._config.inputs[i.variable]?.terms || {});
      return l`
                <div class="builder-row">
                  ${a > 0 ? l`
                        <select
                          class="input-select"
                          style="width: 85px; font-weight: 700; color: #c084fc; border-color: rgba(168, 85, 247, 0.4);"
                          .value=${i.connector}
                          @change=${(r) => {
        i.connector = r.target.value, this.requestUpdate();
      }}
                        >
                          <option value="AND">AND</option>
                          <option value="OR">OR</option>
                        </select>
                      ` : l`<span class="badge badge-cyan" style="width: 70px; justify-content: center;">IF</span>`}

                  <!-- Input Variable -->
                  <select
                    class="input-select"
                    style="flex: 1; min-width: 140px; font-weight: 600;"
                    .value=${i.variable}
                    @change=${(r) => this._onBuilderConditionVarChange(a, r.target.value)}
                  >
                    ${t.map((r) => l`<option value=${r}>${r}</option>`)}
                  </select>

                  <!-- Hedge -->
                  <select
                    class="input-select"
                    style="width: 130px;"
                    .value=${i.hedge}
                    @change=${(r) => {
        i.hedge = r.target.value, this.requestUpdate();
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
                    .value=${i.term}
                    @change=${(r) => {
        i.term = r.target.value, this.requestUpdate();
      }}
                  >
                    ${s.map((r) => l`<option value=${r}>${r}</option>`)}
                  </select>

                  ${this._builderConditions.length > 1 ? l`
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
            <div style="font-weight: 700; color: var(--fuzzy-warning, #d97706); font-size: 14px; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 14px;">
              🔸 THEN (Consequent Action)
            </div>

            <div class="builder-row">
              <span class="badge badge-amber" style="width: 70px; justify-content: center;">THEN</span>

              <!-- Output Variable -->
              <select
                class="input-select"
                style="flex: 1; min-width: 150px; font-weight: 600;"
                .value=${this._builderConsequent.variable}
                @change=${(i) => this._onBuilderConsequentVarChange(i.target.value)}
              >
                ${e.map((i) => l`<option value=${i}>${i}</option>`)}
              </select>

              <span style="font-size: 13px; font-weight: 700; color: var(--fuzzy-text-secondary);">IS</span>

              ${this._builderConsequent.isConstant ? l`
                    <input
                      class="input-text"
                      style="flex: 1; min-width: 120px;"
                      type="number"
                      step="any"
                      .value=${String(this._builderConsequent.constantValue)}
                      @input=${(i) => {
      this._builderConsequent.constantValue = parseFloat(i.target.value), this.requestUpdate();
    }}
                    />
                  ` : l`
                    <select
                      class="input-select"
                      style="flex: 1; min-width: 120px; font-weight: 600; color: var(--fuzzy-success, #059669);"
                      .value=${this._builderConsequent.term}
                      @change=${(i) => {
      this._builderConsequent.term = i.target.value, this.requestUpdate();
    }}
                    >
                      ${Object.keys(
      this._config.outputs[this._builderConsequent.variable]?.terms || {}
    ).map((i) => l`<option value=${i}>${i}</option>`)}
                    </select>
                  `}

              ${this._config.inference === "sugeno" ? l`
                    <label class="checkbox-label" style="font-size: 12px; margin-left: 8px;">
                      <input
                        type="checkbox"
                        .checked=${this._builderConsequent.isConstant}
                        @change=${(i) => {
      this._builderConsequent.isConstant = i.target.checked, this.requestUpdate();
    }}
                      />
                      Numeric Constant
                    </label>
                  ` : ""}
            </div>
          </div>

          <!-- Live Preview -->
          <div
            style="background: var(--secondary-background-color, rgba(15, 23, 42, 0.6)); border: 1px solid var(--divider-color, rgba(2, 132, 199, 0.4)); border-radius: var(--fuzzy-radius-md); padding: 14px 18px; margin-bottom: 24px;"
          >
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
              <span style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.05em; color: var(--fuzzy-text-secondary); font-weight: 600;">
                Live Linguistic Rule Preview
              </span>
              <span class="badge badge-emerald" style="font-size: 10px;">✓ Canonical Syntax</span>
            </div>
            <div style="font-family: monospace; font-size: 14px; color: var(--primary-text-color, #e2e8f0); word-break: break-all;">
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
    return l`
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
m.styles = [
  he,
  I`
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
        background: rgba(125, 125, 125, 0.08);
        color: var(--primary-text-color, var(--fuzzy-text));
      }

      .tab-btn.active {
        background: rgba(2, 132, 199, 0.12);
        color: var(--fuzzy-primary, #0284c7);
        font-weight: 700;
        border-bottom: 2px solid var(--fuzzy-primary, #0284c7);
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
        background: var(--secondary-background-color, rgba(125, 125, 125, 0.05));
        border: 1px solid var(--divider-color, rgba(125, 125, 125, 0.18));
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
        background: var(--card-background-color, rgba(30, 41, 59, 0.7));
        border: 1px solid var(--fuzzy-card-border);
        border-radius: var(--fuzzy-radius-md);
        padding: 16px 20px;
        margin-bottom: 12px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 16px;
        flex-wrap: wrap;
        transition: all 0.2s ease;
      }

      .rule-card:hover {
        border-color: var(--fuzzy-primary, #0284c7);
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
      }

      .rule-var {
        display: inline-flex;
        align-items: center;
        font-weight: 700;
        font-size: 13px;
        padding: 4px 10px;
        border-radius: 6px;
        background: #0284c7;
        color: #ffffff;
        border: 1px solid #0369a1;
      }

      .rule-var-consequent {
        display: inline-flex;
        align-items: center;
        font-weight: 700;
        font-size: 13px;
        padding: 4px 10px;
        border-radius: 6px;
        background: #d97706;
        color: #ffffff;
        border: 1px solid #b45309;
      }

      .rule-op {
        font-weight: 700;
        font-size: 13px;
        color: var(--primary-text-color, #1e293b);
        padding: 0 4px;
      }

      .rule-term {
        display: inline-flex;
        align-items: center;
        font-weight: 700;
        font-size: 13px;
        padding: 4px 10px;
        border-radius: 6px;
        background: #059669;
        color: #ffffff;
        border: 1px solid #047857;
      }

      .rule-raw {
        font-family: var(--ha-font-family-monospace, ui-monospace, SFMono-Regular, Menlo, monospace);
        font-size: 12px;
        font-weight: 500;
        color: var(--primary-text-color, #f8fafc);
        background: var(--secondary-background-color, rgba(125, 125, 125, 0.08));
        border: 1px solid var(--divider-color, rgba(125, 125, 125, 0.18));
        border-radius: 6px;
        padding: 6px 12px;
        display: inline-block;
        width: fit-content;
        margin-top: 2px;
      }

      .builder-row {
        display: flex;
        align-items: center;
        gap: 10px;
        margin-bottom: 10px;
        flex-wrap: wrap;
      }

      .yaml-banner {
        background: rgba(124, 58, 237, 0.12);
        border: 1px solid rgba(124, 58, 237, 0.35);
        color: #7c3aed;
        font-weight: 600;
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
_([
  v({ attribute: !1 })
], m.prototype, "hass", 2);
_([
  v({ type: Object })
], m.prototype, "systemConfig", 2);
_([
  v({ type: String })
], m.prototype, "entryId", 2);
_([
  v({ type: String })
], m.prototype, "source", 2);
_([
  p()
], m.prototype, "_activeTab", 2);
_([
  p()
], m.prototype, "_config", 2);
_([
  p()
], m.prototype, "_rawJson", 2);
_([
  p()
], m.prototype, "_saving", 2);
_([
  p()
], m.prototype, "_error", 2);
_([
  p()
], m.prototype, "_successMsg", 2);
_([
  p()
], m.prototype, "_simInputs", 2);
_([
  p()
], m.prototype, "_simResults", 2);
_([
  p()
], m.prototype, "_simulating", 2);
_([
  p()
], m.prototype, "_simError", 2);
_([
  p()
], m.prototype, "_showAddInputModal", 2);
_([
  p()
], m.prototype, "_newInputEntityId", 2);
_([
  p()
], m.prototype, "_newInputVarName", 2);
_([
  p()
], m.prototype, "_newInputMin", 2);
_([
  p()
], m.prototype, "_newInputMax", 2);
_([
  p()
], m.prototype, "_newInputTermsPreset", 2);
_([
  p()
], m.prototype, "_newInputModalError", 2);
_([
  p()
], m.prototype, "_showRuleBuilderModal", 2);
_([
  p()
], m.prototype, "_editingRuleIndex", 2);
_([
  p()
], m.prototype, "_builderConditions", 2);
_([
  p()
], m.prototype, "_builderConsequent", 2);
_([
  p()
], m.prototype, "_ruleBuilderError", 2);
_([
  p()
], m.prototype, "_rulesViewMode", 2);
m = _([
  F("fuzzy-system-editor")
], m);
var ei = Object.defineProperty, ti = Object.getOwnPropertyDescriptor, V = (t, e, i, a) => {
  for (var s = a > 1 ? void 0 : a ? ti(e, i) : e, r = t.length - 1, n; r >= 0; r--)
    (n = t[r]) && (s = (a ? n(e, i, s) : n(s)) || s);
  return a && s && ei(e, i, s), s;
};
let T = class extends A {
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
        this._templates = await We(this.hass);
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
      const e = await Ge(
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
    return l`
      <div class="modal-overlay" @click=${(t) => t.target === t.currentTarget && this._close()}>
        <div class="modal-content">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
            <div>
              <h2 class="title-lg">Choose a Template</h2>
              <p class="subtitle">Quickly scaffold a pre-engineered fuzzy logic controller</p>
            </div>
            <button class="btn btn-icon" @click=${this._close}>✕</button>
          </div>

          ${this._error ? l`<div style="color: var(--fuzzy-danger); font-size: 13px; margin-bottom: 12px;">${this._error}</div>` : ""}

          <div class="template-grid">
            ${this._templates.map(
      (t) => l`
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

          ${this._selectedTemplate ? l`
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
T.styles = [
  he,
  I`
      .template-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
        gap: 16px;
        margin-top: 18px;
        margin-bottom: 24px;
      }

      .template-card {
        background: var(--secondary-background-color, rgba(125, 125, 125, 0.06));
        border: 1px solid var(--divider-color, rgba(125, 125, 125, 0.22));
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
V([
  v({ attribute: !1 })
], T.prototype, "hass", 2);
V([
  p()
], T.prototype, "_templates", 2);
V([
  p()
], T.prototype, "_selectedTemplate", 2);
V([
  p()
], T.prototype, "_systemId", 2);
V([
  p()
], T.prototype, "_systemName", 2);
V([
  p()
], T.prototype, "_loading", 2);
V([
  p()
], T.prototype, "_error", 2);
T = V([
  F("fuzzy-template-modal")
], T);
const Qe = {
  configuring: "Konfigurace karty fuzzy-system-card...",
  active: "Aktivní",
  live_inputs: "Živé vstupy",
  outputs: "Výstupy",
  live_aggregated_set: "Sada živého agregovaného výstupu",
  rule_firing_strengths: "Aktivní pravidla střelby"
}, Xe = {
  target_system: "Cílový fuzzy systém",
  detected: "Bylo zjištěno {count}",
  target_system_helper: "Vyberte ovladač fuzzy logiky, který chcete sledovat a vizualizovat na této kartě řídicího panelu.",
  card_title: "Název karty (volitelné)",
  card_title_placeholder: "např. Ovladač ventilátoru v obývacím pokoji",
  card_title_helper: "Chcete-li název fuzzy systému použít automaticky, ponechte prázdné.",
  visual_components: "Komponenty vizuální karty",
  aggregated_waveform: "Agregovaný výstupní průběh",
  aggregated_waveform_desc: "Stínovaná distribuce fuzzy množin v reálném čase s defuzzifikačním řezem",
  inputs_grid: "Mřížka živých vstupů",
  inputs_grid_desc: "Zobrazit vstupní metrické pilulky a hodnoty dodávané do motoru",
  rule_strengths: "Aktivní pravidla střelby",
  rule_strengths_desc: "Zobrazit ukazatele průběhu střelecké síly pro aktivní pravidla"
}, et = {
  title: "Fuzzy Control Studio",
  catalog: "Katalog systému",
  editor: "Editor vizuálních pravidel a křivek",
  add_system: "Přidat systém",
  simulate: "Simulovat hodnocení",
  reload: "Znovu načtěte YAML",
  loading: "Načítání fuzzy systémů..."
}, si = {
  card: Qe,
  editor: Xe,
  panel: et
}, ii = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  card: Qe,
  default: si,
  editor: Xe,
  panel: et
}, Symbol.toStringTag, { value: "Module" })), tt = {
  configuring: "Konfigurerer fuzzy-system-kort...",
  active: "Aktiv",
  live_inputs: "Live input",
  outputs: "Udgange",
  live_aggregated_set: "Live aggregeret output sæt",
  rule_firing_strengths: "Aktive regel skydestyrker"
}, st = {
  target_system: "Target Fuzzy System",
  detected: "{count} fundet",
  target_system_helper: "Vælg den fuzzy logic-controller for at overvåge og visualisere på dette dashboard-kort.",
  card_title: "Korttitel (valgfrit)",
  card_title_placeholder: "f.eks. Stue Ventilator Controller",
  card_title_helper: "Lad det være tomt for automatisk at bruge det uklare systemnavn.",
  visual_components: "Visuelle kortkomponenter",
  aggregated_waveform: "Aggregeret outputbølgeform",
  aggregated_waveform_desc: "Real-time skyggelagt fuzzy sæt distribution med defuzzification skive",
  inputs_grid: "Live Input Grid",
  inputs_grid_desc: "Vis input metriske piller og værdier, der føres ind i motoren",
  rule_strengths: "Aktive regel skydestyrker",
  rule_strengths_desc: "Vis skydestyrke fremskridtsbjælker for aktive regler"
}, it = {
  title: "Fuzzy Control Studio",
  catalog: "Systemkatalog",
  editor: "Visual Rule & Curve Editor",
  add_system: "Tilføj system",
  simulate: "Simulere evaluering",
  reload: "Genindlæs YAML",
  loading: "Indlæser Fuzzy Systems..."
}, ai = {
  card: tt,
  editor: st,
  panel: it
}, ri = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  card: tt,
  default: ai,
  editor: st,
  panel: it
}, Symbol.toStringTag, { value: "Module" })), at = {
  configuring: "Fuzzy-System-Karte konfigurieren...",
  active: "Aktiv",
  live_inputs: "Live-Eingaben",
  outputs: "Ausgänge",
  live_aggregated_set: "Live-aggregierter Ausgabesatz",
  rule_firing_strengths: "Aktive Regelfeuerstärken"
}, rt = {
  target_system: "Ziel-Fuzzy-System",
  detected: "{count} erkannt",
  target_system_helper: "Wählen Sie den Fuzzy-Logic-Controller zur Überwachung und Visualisierung auf dieser Dashboard-Karte aus.",
  card_title: "Kartentitel (optional)",
  card_title_placeholder: "z.B. Wohnzimmer-Lüftersteuerung",
  card_title_helper: "Lassen Sie das Feld leer, um den Fuzzy-Systemnamen automatisch zu verwenden.",
  visual_components: "Visuelle Kartenkomponenten",
  aggregated_waveform: "Aggregierte Ausgangswellenform",
  aggregated_waveform_desc: "Echtzeit-Verteilung schattierter Fuzzy-Sets mit Defuzzifizierungs-Slice",
  inputs_grid: "Live-Eingaberaster",
  inputs_grid_desc: "Zeigen Sie Eingabemetrikpillen und Werte an, die in die Engine eingespeist werden",
  rule_strengths: "Aktive Regelfeuerstärken",
  rule_strengths_desc: "Fortschrittsbalken für die Schussstärke für aktive Regeln anzeigen"
}, nt = {
  title: "Fuzzy Control Studio",
  catalog: "Systemkatalog",
  editor: "Visueller Regel- und Kurveneditor",
  add_system: "System hinzufügen",
  simulate: "Auswertung simulieren",
  reload: "Laden Sie YAML neu",
  loading: "Fuzzy-Systeme werden geladen..."
}, ni = {
  card: at,
  editor: rt,
  panel: nt
}, oi = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  card: at,
  default: ni,
  editor: rt,
  panel: nt
}, Symbol.toStringTag, { value: "Module" })), ot = {
  configuring: "Διαμόρφωση fuzzy-system-card...",
  active: "Ενεργός",
  live_inputs: "Ζωντανές εισροές",
  outputs: "Έξοδοι",
  live_aggregated_set: "Σετ ζωντανών συγκεντρωτικών εξόδων",
  rule_firing_strengths: "Ενεργός κανόνας Δυνάμεις πυροδότησης"
}, lt = {
  target_system: "Ασαφές σύστημα στόχου",
  detected: "Εντοπίστηκε {count}",
  target_system_helper: "Επιλέξτε τον ελεγκτή ασαφούς λογικής για παρακολούθηση και οπτικοποίηση σε αυτήν την κάρτα ταμπλό.",
  card_title: "Τίτλος κάρτας (Προαιρετικό)",
  card_title_placeholder: "π.χ. Ελεγκτής ανεμιστήρα σαλονιού",
  card_title_helper: "Αφήστε κενό για να χρησιμοποιήσετε αυτόματα το ασαφές όνομα συστήματος.",
  visual_components: "Στοιχεία Visual Card",
  aggregated_waveform: "Συγκεντρωτική Κυματομορφή Εξόδου",
  aggregated_waveform_desc: "Κατανομή ασαφούς συνόλου με σκίαση σε πραγματικό χρόνο με τομή αποασαφοποίησης",
  inputs_grid: "Πλέγμα ζωντανών εισόδων",
  inputs_grid_desc: "Εμφάνιση μετρικών χαπιών εισόδου και τιμών που τροφοδοτούνται στον κινητήρα",
  rule_strengths: "Ενεργός κανόνας Δυνάμεις πυροδότησης",
  rule_strengths_desc: "Εμφάνιση ράβδων προόδου ισχύος πυροδότησης για ενεργούς κανόνες"
}, dt = {
  title: "Fuzzy Control Studio",
  catalog: "Κατάλογος Συστήματος",
  editor: "Visual Rule & Curve Editor",
  add_system: "Προσθήκη συστήματος",
  simulate: "Προσομοίωση Αξιολόγησης",
  reload: "Επαναφόρτωση YAML",
  loading: "Φόρτωση Fuzzy Systems..."
}, li = {
  card: ot,
  editor: lt,
  panel: dt
}, di = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  card: ot,
  default: li,
  editor: lt,
  panel: dt
}, Symbol.toStringTag, { value: "Module" })), ct = {
  configuring: "Configuring fuzzy-system-card...",
  active: "Active",
  live_inputs: "Live Inputs",
  outputs: "Outputs",
  live_aggregated_set: "Live Aggregated Output Set",
  rule_firing_strengths: "Active Rule Firing Strengths"
}, ut = {
  target_system: "Target Fuzzy System",
  detected: "{count} detected",
  target_system_helper: "Select the fuzzy logic controller to monitor and visualize on this dashboard card.",
  card_title: "Card Title (Optional)",
  card_title_placeholder: "e.g. Living Room Fan Controller",
  card_title_helper: "Leave blank to use the fuzzy system name automatically.",
  visual_components: "Visual Card Components",
  aggregated_waveform: "Aggregated Output Waveform",
  aggregated_waveform_desc: "Real-time shaded fuzzy set distribution with defuzzification slice",
  inputs_grid: "Live Inputs Grid",
  inputs_grid_desc: "Show input metric pills and values feeding into the engine",
  rule_strengths: "Active Rule Firing Strengths",
  rule_strengths_desc: "Show firing strength progress bars for active rules"
}, pt = {
  title: "Fuzzy Control Studio",
  catalog: "System Catalog",
  editor: "Visual Rule & Curve Editor",
  add_system: "Add System",
  simulate: "Simulate Evaluation",
  reload: "Reload YAML",
  loading: "Loading Fuzzy Systems..."
}, ci = {
  card: ct,
  editor: ut,
  panel: pt
}, ui = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  card: ct,
  default: ci,
  editor: ut,
  panel: pt
}, Symbol.toStringTag, { value: "Module" })), gt = {
  configuring: "Configurando la tarjeta del sistema difuso...",
  active: "Activo",
  live_inputs: "Entradas en vivo",
  outputs: "Salidas",
  live_aggregated_set: "Conjunto de salida agregada en vivo",
  rule_firing_strengths: "Fortalezas de disparo de regla activa"
}, ht = {
  target_system: "Sistema difuso objetivo",
  detected: "{count} detectado",
  target_system_helper: "Seleccione el controlador de lógica difusa para monitorear y visualizar en esta tarjeta del tablero.",
  card_title: "Título de la tarjeta (opcional)",
  card_title_placeholder: "p.ej. Controlador de ventilador de sala de estar",
  card_title_helper: "Déjelo en blanco para utilizar el nombre del sistema difuso automáticamente.",
  visual_components: "Componentes de la tarjeta visual",
  aggregated_waveform: "Forma de onda de salida agregada",
  aggregated_waveform_desc: "Distribución de conjuntos difusos sombreados en tiempo real con corte de defuzzificación",
  inputs_grid: "Cuadrícula de entradas en vivo",
  inputs_grid_desc: "Mostrar píldoras métricas de entrada y valores que ingresan al motor",
  rule_strengths: "Fortalezas de disparo de regla activa",
  rule_strengths_desc: "Show firing strength progress bars for active rules"
}, mt = {
  title: "Estudio de control difuso",
  catalog: "Catálogo del sistema",
  editor: "Editor visual de reglas y curvas",
  add_system: "Agregar sistema",
  simulate: "Simular evaluación",
  reload: "Recargar YAML",
  loading: "Cargando sistemas difusos..."
}, pi = {
  card: gt,
  editor: ht,
  panel: mt
}, gi = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  card: gt,
  default: pi,
  editor: ht,
  panel: mt
}, Symbol.toStringTag, { value: "Module" })), ft = {
  configuring: "Määritetään fuzzy-system-korttia...",
  active: "Aktiivinen",
  live_inputs: "Live-tulot",
  outputs: "Lähdöt",
  live_aggregated_set: "Live Aggregated Output Set",
  rule_firing_strengths: "Aktiiviset sääntövoimat"
}, _t = {
  target_system: "Kohdista sumea järjestelmä",
  detected: "{count} havaittu",
  target_system_helper: "Valitse sumea logiikkaohjain, jota haluat seurata ja visualisoida tällä kojelautakortilla.",
  card_title: "Kortin otsikko (valinnainen)",
  card_title_placeholder: "esim. Olohuoneen tuulettimen ohjain",
  card_title_helper: "Jätä tyhjäksi, jos haluat käyttää sumeaa järjestelmän nimeä automaattisesti.",
  visual_components: "Visuaalisen kortin komponentit",
  aggregated_waveform: "Kootun ulostulon aaltomuoto",
  aggregated_waveform_desc: "Reaaliaikainen varjostettu sumea joukkojakauma defuzzification-osalla",
  inputs_grid: "Live Input Grid",
  inputs_grid_desc: "Näytä syötemittarit ja moottoriin syötettävät arvot",
  rule_strengths: "Aktiiviset sääntövoimat",
  rule_strengths_desc: "Näytä aktiivisten sääntöjen laukaisuvoimakkuuden etenemispalkit"
}, yt = {
  title: "Fuzzy Control Studio",
  catalog: "Järjestelmän katalogi",
  editor: "Visual Rule & Curve Editor",
  add_system: "Lisää järjestelmä",
  simulate: "Simuloi arviointi",
  reload: "Lataa YAML uudelleen",
  loading: "Ladataan sumeita järjestelmiä..."
}, hi = {
  card: ft,
  editor: _t,
  panel: yt
}, mi = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  card: ft,
  default: hi,
  editor: _t,
  panel: yt
}, Symbol.toStringTag, { value: "Module" })), vt = {
  configuring: "Configuration de la carte système floue...",
  active: "Actif",
  live_inputs: "Entrées en direct",
  outputs: "Sorties",
  live_aggregated_set: "Ensemble de sorties agrégées en direct",
  rule_firing_strengths: "Forces de déclenchement des règles actives"
}, bt = {
  target_system: "Système flou cible",
  detected: "{count} détecté",
  target_system_helper: "Sélectionnez le contrôleur à logique floue à surveiller et à visualiser sur cette carte de tableau de bord.",
  card_title: "Titre de la carte (facultatif)",
  card_title_placeholder: "par ex. Contrôleur de ventilateur de salon",
  card_title_helper: "Laissez vide pour utiliser automatiquement le nom flou du système.",
  visual_components: "Composants de la carte visuelle",
  aggregated_waveform: "Forme d'onde de sortie agrégée",
  aggregated_waveform_desc: "Distribution d'ensembles flous ombrés en temps réel avec tranche de défuzzification",
  inputs_grid: "Grille des entrées en direct",
  inputs_grid_desc: "Afficher les pilules et les valeurs métriques d'entrée alimentant le moteur",
  rule_strengths: "Forces de déclenchement des règles actives",
  rule_strengths_desc: "Afficher les barres de progression de la puissance de tir pour les règles actives"
}, xt = {
  title: "Studio de contrôle flou",
  catalog: "Catalogue système",
  editor: "Éditeur visuel de règles et de courbes",
  add_system: "Ajouter un système",
  simulate: "Simuler l'évaluation",
  reload: "Recharger YAML",
  loading: "Chargement des systèmes flous..."
}, fi = {
  card: vt,
  editor: bt,
  panel: xt
}, _i = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  card: vt,
  default: fi,
  editor: bt,
  panel: xt
}, Symbol.toStringTag, { value: "Module" })), $t = {
  configuring: "Configurazione della scheda del sistema fuzzy in corso...",
  active: "Attivo",
  live_inputs: "Ingressi in tempo reale",
  outputs: "Uscite",
  live_aggregated_set: "Set di output aggregati in tempo reale",
  rule_firing_strengths: "Forza di attivazione della regola attiva"
}, zt = {
  target_system: "Sistema di destinazione fuzzy",
  detected: "{count} rilevato",
  target_system_helper: "Selezionare il controller a logica fuzzy da monitorare e visualizzare su questa scheda dashboard.",
  card_title: "Titolo della carta (facoltativo)",
  card_title_placeholder: "per esempio. Controller per ventola del soggiorno",
  card_title_helper: "Lasciare vuoto per utilizzare automaticamente il nome del sistema fuzzy.",
  visual_components: "Componenti della scheda visiva",
  aggregated_waveform: "Forma d'onda di uscita aggregata",
  aggregated_waveform_desc: "Distribuzione di set fuzzy ombreggiati in tempo reale con fetta di defuzzificazione",
  inputs_grid: "Griglia degli ingressi live",
  inputs_grid_desc: "Mostra pillole e valori di input inseriti nel motore",
  rule_strengths: "Forza di attivazione della regola attiva",
  rule_strengths_desc: "Mostra le barre di avanzamento della forza di fuoco per le regole attive"
}, wt = {
  title: "Studio di controllo fuzzy",
  catalog: "Catalogo di sistema",
  editor: "Editor visivo di regole e curve",
  add_system: "Aggiungi sistema",
  simulate: "Simulare la valutazione",
  reload: "Ricarica YAML",
  loading: "Caricamento sistemi fuzzy..."
}, yi = {
  card: $t,
  editor: zt,
  panel: wt
}, vi = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  card: $t,
  default: yi,
  editor: zt,
  panel: wt
}, Symbol.toStringTag, { value: "Module" })), St = {
  configuring: "ファジー システム カードを構成しています...",
  active: "アクティブ",
  live_inputs: "ライブ入力",
  outputs: "出力",
  live_aggregated_set: "ライブ集約出力セット",
  rule_firing_strengths: "アクティブルール発動の強み"
}, kt = {
  target_system: "ターゲットファジーシステム",
  detected: "{count} が検出されました",
  target_system_helper: "このダッシュボード カードで監視および視覚化するファジー ロジック コントローラーを選択します。",
  card_title: "カードタイトル (オプション)",
  card_title_placeholder: "例えばリビングルームのファンコントローラー",
  card_title_helper: "ファジー システム名を自動的に使用するには、空白のままにします。",
  visual_components: "ビジュアルカードコンポーネント",
  aggregated_waveform: "集約出力波形",
  aggregated_waveform_desc: "非ファジー化スライスを使用したリアルタイムのシェーディング ファジー セット分布",
  inputs_grid: "ライブ入力グリッド",
  inputs_grid_desc: "エンジンに入力される入力メトリクスの丸薬と値を表示する",
  rule_strengths: "アクティブルール発動の強み",
  rule_strengths_desc: "アクティブなルールの発砲強度の進行状況バーを表示する"
}, At = {
  title: "ファジーコントロールスタジオ",
  catalog: "システムカタログ",
  editor: "ビジュアルルール＆カーブエディター",
  add_system: "システムの追加",
  simulate: "評価のシミュレーション",
  reload: "YAMLのリロード",
  loading: "ファジー システムを読み込んでいます..."
}, bi = {
  card: St,
  editor: kt,
  panel: At
}, xi = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  card: St,
  default: bi,
  editor: kt,
  panel: At
}, Symbol.toStringTag, { value: "Module" })), Ct = {
  configuring: "퍼지 시스템 카드 구성 중...",
  active: "활동적인",
  live_inputs: "실시간 입력",
  outputs: "출력",
  live_aggregated_set: "실시간 집계 출력 세트",
  rule_firing_strengths: "활성 규칙 실행의 강점"
}, Et = {
  target_system: "타겟 퍼지 시스템",
  detected: "{count}가 감지되었습니다.",
  target_system_helper: "이 대시보드 카드에서 모니터링하고 시각화하려면 퍼지 로직 컨트롤러를 선택하세요.",
  card_title: "카드 제목(선택사항)",
  card_title_placeholder: "예를 들어 거실 팬 컨트롤러",
  card_title_helper: "퍼지 시스템 이름을 자동으로 사용하려면 비워 두세요.",
  visual_components: "비주얼 카드 구성품",
  aggregated_waveform: "집계된 출력 파형",
  aggregated_waveform_desc: "역퍼지화 슬라이스를 사용한 실시간 음영 퍼지 집합 분포",
  inputs_grid: "실시간 입력 그리드",
  inputs_grid_desc: "엔진에 입력되는 입력 지표 알약과 값을 표시합니다.",
  rule_strengths: "활성 규칙 실행의 강점",
  rule_strengths_desc: "활성 규칙의 실행 강도 진행률 표시줄 표시"
}, Mt = {
  title: "퍼지 컨트롤 스튜디오",
  catalog: "시스템 카탈로그",
  editor: "시각적 규칙 및 곡선 편집기",
  add_system: "시스템 추가",
  simulate: "평가 시뮬레이션",
  reload: "YAML 다시 로드",
  loading: "퍼지 시스템 로드 중..."
}, $i = {
  card: Ct,
  editor: Et,
  panel: Mt
}, zi = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  card: Ct,
  default: $i,
  editor: Et,
  panel: Mt
}, Symbol.toStringTag, { value: "Module" })), jt = {
  configuring: "Konfigurerer fuzzy-system-kort...",
  active: "Aktiv",
  live_inputs: "Live-innganger",
  outputs: "Utganger",
  live_aggregated_set: "Live aggregert utdatasett",
  rule_firing_strengths: "Aktiv regel skytestyrker"
}, Tt = {
  target_system: "Target Fuzzy System",
  detected: "{count} oppdaget",
  target_system_helper: "Velg fuzzy logic-kontrolleren for å overvåke og visualisere på dette dashbordkortet.",
  card_title: "Korttittel (valgfritt)",
  card_title_placeholder: "f.eks. Stue viftekontroller",
  card_title_helper: "La stå tomt for å bruke det uklare systemnavnet automatisk.",
  visual_components: "Visuelle kortkomponenter",
  aggregated_waveform: "Aggregert utgangsbølgeform",
  aggregated_waveform_desc: "Sanntidsskyggelagt fuzzy sett-distribusjon med defuzzification skive",
  inputs_grid: "Live Input Grid",
  inputs_grid_desc: "Vis input metriske piller og verdier som mates inn i motoren",
  rule_strengths: "Aktiv regel skytestyrker",
  rule_strengths_desc: "Vis fremdriftslinjer for skytestyrke for aktive regler"
}, Ot = {
  title: "Fuzzy Control Studio",
  catalog: "Systemkatalog",
  editor: "Visual Rule & Curve Editor",
  add_system: "Legg til system",
  simulate: "Simulere evaluering",
  reload: "Last inn YAML på nytt",
  loading: "Laster Fuzzy Systems..."
}, wi = {
  card: jt,
  editor: Tt,
  panel: Ot
}, Si = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  card: jt,
  default: wi,
  editor: Tt,
  panel: Ot
}, Symbol.toStringTag, { value: "Module" })), It = {
  configuring: "Fuzzy-systeemkaart configureren...",
  active: "Actief",
  live_inputs: "Live-invoer",
  outputs: "Uitgangen",
  live_aggregated_set: "Live geaggregeerde uitvoerset",
  rule_firing_strengths: "Actieve regelvuursterkte"
}, Rt = {
  target_system: "Doel Fuzzy-systeem",
  detected: "{count} gedetecteerd",
  target_system_helper: "Selecteer de fuzzy logic-controller die u op deze dashboardkaart wilt bewaken en visualiseren.",
  card_title: "Kaarttitel (optioneel)",
  card_title_placeholder: "bijv. Woonkamerventilatorcontroller",
  card_title_helper: "Laat dit veld leeg als u de fuzzy systeemnaam automatisch wilt gebruiken.",
  visual_components: "Visuele kaartcomponenten",
  aggregated_waveform: "Geaggregeerde uitgangsgolfvorm",
  aggregated_waveform_desc: "Realtime gearceerde, fuzzy set-distributie met defuzzificatiesegment",
  inputs_grid: "Live-invoerraster",
  inputs_grid_desc: "Toon invoermetrische pillen en waarden die in de engine worden ingevoerd",
  rule_strengths: "Actieve regelvuursterkte",
  rule_strengths_desc: "Toon voortgangsbalken voor de schietsterkte voor actieve regels"
}, Lt = {
  title: "Fuzzy Control Studio",
  catalog: "Systeemcatalogus",
  editor: "Visuele regel- en curve-editor",
  add_system: "Systeem toevoegen",
  simulate: "Evaluatie simuleren",
  reload: "YAML opnieuw laden",
  loading: "Fuzzy-systemen laden..."
}, ki = {
  card: It,
  editor: Rt,
  panel: Lt
}, Ai = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  card: It,
  default: ki,
  editor: Rt,
  panel: Lt
}, Symbol.toStringTag, { value: "Module" })), Pt = {
  configuring: "Konfigurowanie karty-systemu rozmytego...",
  active: "Aktywny",
  live_inputs: "Wejścia na żywo",
  outputs: "Wyjścia",
  live_aggregated_set: "Zestaw zagregowanych wyników na żywo",
  rule_firing_strengths: "Siły wyzwalania reguły aktywnej"
}, Ft = {
  target_system: "Docelowy system rozmyty",
  detected: "Wykryto {count}",
  target_system_helper: "Wybierz kontroler logiki rozmytej, który chcesz monitorować i wizualizować na tej karcie panelu kontrolnego.",
  card_title: "Tytuł karty (opcjonalnie)",
  card_title_placeholder: "np. Kontroler wentylatora w salonie",
  card_title_helper: "Pozostaw puste, aby automatycznie używać rozmytej nazwy systemu.",
  visual_components: "Elementy karty wizualnej",
  aggregated_waveform: "Zagregowany przebieg wyjściowy",
  aggregated_waveform_desc: "Rozkład cieniowanych zbiorów rozmytych w czasie rzeczywistym z wycinkiem rozmytym",
  inputs_grid: "Siatka wejść na żywo",
  inputs_grid_desc: "Pokaż wejściowe pigułki metryczne i wartości podawane do silnika",
  rule_strengths: "Siły wyzwalania reguły aktywnej",
  rule_strengths_desc: "Pokaż paski postępu siły ognia dla aktywnych reguł"
}, Nt = {
  title: "Studio sterowania rozmytego",
  catalog: "Katalog systemu",
  editor: "Wizualny edytor reguł i krzywych",
  add_system: "Dodaj system",
  simulate: "Symuluj ocenę",
  reload: "Załaduj ponownie YAML",
  loading: "Ładowanie systemów rozmytych..."
}, Ci = {
  card: Pt,
  editor: Ft,
  panel: Nt
}, Ei = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  card: Pt,
  default: Ci,
  editor: Ft,
  panel: Nt
}, Symbol.toStringTag, { value: "Module" })), Vt = {
  configuring: "Configurando placa de sistema fuzzy...",
  active: "Ativo",
  live_inputs: "Entradas ao vivo",
  outputs: "Resultados",
  live_aggregated_set: "Conjunto de saída agregada ao vivo",
  rule_firing_strengths: "Forças de disparo de regras ativas"
}, Dt = {
  target_system: "Sistema difuso de destino",
  detected: "{count} detectado",
  target_system_helper: "Selecione o controlador de lógica difusa para monitorar e visualizar neste cartão de painel.",
  card_title: "Título do cartão (opcional)",
  card_title_placeholder: "por exemplo Controlador de ventilador de sala de estar",
  card_title_helper: "Deixe em branco para usar o nome do sistema difuso automaticamente.",
  visual_components: "Componentes do cartão visual",
  aggregated_waveform: "Forma de onda de saída agregada",
  aggregated_waveform_desc: "Distribuição de conjuntos difusos sombreados em tempo real com fatia de defuzzificação",
  inputs_grid: "Grade de entradas ao vivo",
  inputs_grid_desc: "Mostrar pílulas métricas de entrada e valores que alimentam o mecanismo",
  rule_strengths: "Forças de disparo de regras ativas",
  rule_strengths_desc: "Mostrar barras de progresso de força de tiro para regras ativas"
}, Ht = {
  title: "Estúdio de controle difuso",
  catalog: "Catálogo do Sistema",
  editor: "Editor visual de regras e curvas",
  add_system: "Adicionar sistema",
  simulate: "Simular Avaliação",
  reload: "Recarregar YAML",
  loading: "Carregando sistemas difusos..."
}, Mi = {
  card: Vt,
  editor: Dt,
  panel: Ht
}, ji = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  card: Vt,
  default: Mi,
  editor: Dt,
  panel: Ht
}, Symbol.toStringTag, { value: "Module" })), qt = {
  configuring: "Configurando placa de sistema fuzzy...",
  active: "Ativo",
  live_inputs: "Entradas ao vivo",
  outputs: "Resultados",
  live_aggregated_set: "Conjunto de saída agregada ao vivo",
  rule_firing_strengths: "Forças de disparo de regras ativas"
}, Bt = {
  target_system: "Sistema difuso de destino",
  detected: "{count} detectado",
  target_system_helper: "Selecione o controlador de lógica difusa para monitorar e visualizar neste cartão de painel.",
  card_title: "Título do cartão (opcional)",
  card_title_placeholder: "por exemplo Controlador de ventilador de sala de estar",
  card_title_helper: "Deixe em branco para usar o nome do sistema difuso automaticamente.",
  visual_components: "Componentes do cartão visual",
  aggregated_waveform: "Forma de onda de saída agregada",
  aggregated_waveform_desc: "Distribuição de conjuntos difusos sombreados em tempo real com fatia de defuzzificação",
  inputs_grid: "Grade de entradas ao vivo",
  inputs_grid_desc: "Mostrar pílulas métricas de entrada e valores que alimentam o mecanismo",
  rule_strengths: "Forças de disparo de regras ativas",
  rule_strengths_desc: "Mostrar barras de progresso de força de tiro para regras ativas"
}, Ut = {
  title: "Estúdio de controle difuso",
  catalog: "Catálogo do Sistema",
  editor: "Editor visual de regras e curvas",
  add_system: "Adicionar sistema",
  simulate: "Simular Avaliação",
  reload: "Recarregar YAML",
  loading: "Carregando sistemas difusos..."
}, Ti = {
  card: qt,
  editor: Bt,
  panel: Ut
}, Oi = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  card: qt,
  default: Ti,
  editor: Bt,
  panel: Ut
}, Symbol.toStringTag, { value: "Module" })), Wt = {
  configuring: "Настройка нечеткой системной карты...",
  active: "Активный",
  live_inputs: "Живые входы",
  outputs: "Выходы",
  live_aggregated_set: "Набор агрегированных выходных данных в реальном времени",
  rule_firing_strengths: "Сильные стороны активных правил"
}, Gt = {
  target_system: "Целевая нечеткая система",
  detected: "{count} обнаружен",
  target_system_helper: "Выберите контроллер нечеткой логики для мониторинга и визуализации на этой карточке информационной панели.",
  card_title: "Название карты (необязательно)",
  card_title_placeholder: "например Контроллер вентилятора в гостиной",
  card_title_helper: "Оставьте поле пустым, чтобы автоматически использовать нечеткое имя системы.",
  visual_components: "Компоненты визуальной карты",
  aggregated_waveform: "Агрегированная выходная форма сигнала",
  aggregated_waveform_desc: "Распределение закрашенных нечетких множеств в реальном времени со срезом дефаззификации",
  inputs_grid: "Сетка живых входов",
  inputs_grid_desc: "Показывать таблицы и значения входных показателей, поступающие в движок.",
  rule_strengths: "Сильные стороны активных правил",
  rule_strengths_desc: "Показывать индикаторы силы стрельбы для активных правил"
}, Yt = {
  title: "Студия нечеткого управления",
  catalog: "Системный каталог",
  editor: "Визуальный редактор правил и кривых",
  add_system: "Добавить систему",
  simulate: "Имитация оценки",
  reload: "Перезагрузить YAML",
  loading: "Загрузка нечетких систем..."
}, Ii = {
  card: Wt,
  editor: Gt,
  panel: Yt
}, Ri = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  card: Wt,
  default: Ii,
  editor: Gt,
  panel: Yt
}, Symbol.toStringTag, { value: "Module" })), Kt = {
  configuring: "Konfigurerar fuzzy-system-kort...",
  active: "Aktiv",
  live_inputs: "Live-ingångar",
  outputs: "Utgångar",
  live_aggregated_set: "Live aggregerad utdatauppsättning",
  rule_firing_strengths: "Aktiva regler eldningsstyrkor"
}, Jt = {
  target_system: "Target Fuzzy System",
  detected: "{count} upptäckt",
  target_system_helper: "Välj kontrollenheten för fuzzy logic för att övervaka och visualisera på det här instrumentpanelskortet.",
  card_title: "Korttitel (valfritt)",
  card_title_placeholder: "till exempel Fläktkontroll i vardagsrummet",
  card_title_helper: "Lämna tomt om du vill använda det fuzzy systemnamnet automatiskt.",
  visual_components: "Visuella kortkomponenter",
  aggregated_waveform: "Aggregerad utgångsvågform",
  aggregated_waveform_desc: "Skuggad fuzzy set-distribution i realtid med defuzzification skiva",
  inputs_grid: "Live Input Grid",
  inputs_grid_desc: "Visa inmatade metriska piller och värden som matas in i motorn",
  rule_strengths: "Aktiva regler eldningsstyrkor",
  rule_strengths_desc: "Visa förloppsstaplar för skjutstyrka för aktiva regler"
}, Zt = {
  title: "Fuzzy Control Studio",
  catalog: "Systemkatalog",
  editor: "Visual Rule & Curve Editor",
  add_system: "Lägg till system",
  simulate: "Simulera utvärdering",
  reload: "Ladda om YAML",
  loading: "Laddar Fuzzy Systems..."
}, Li = {
  card: Kt,
  editor: Jt,
  panel: Zt
}, Pi = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  card: Kt,
  default: Li,
  editor: Jt,
  panel: Zt
}, Symbol.toStringTag, { value: "Module" })), Qt = {
  configuring: "Bulanık sistem kartı yapılandırılıyor...",
  active: "Aktif",
  live_inputs: "Canlı Girişler",
  outputs: "Çıkışlar",
  live_aggregated_set: "Canlı Birleştirilmiş Çıkış Seti",
  rule_firing_strengths: "Aktif Kural Etkinleştirmenin Güçlü Yönleri"
}, Xt = {
  target_system: "Hedef Bulanık Sistemi",
  detected: "{count} algılandı",
  target_system_helper: "Bu kontrol paneli kartında izlemek ve görselleştirmek için bulanık mantık denetleyicisini seçin.",
  card_title: "Kart Başlığı (İsteğe bağlı)",
  card_title_placeholder: "örneğin Oturma Odası Fan Kontrol Cihazı",
  card_title_helper: "Bulanık sistem adının otomatik olarak kullanılması için boş bırakın.",
  visual_components: "Görsel Kart Bileşenleri",
  aggregated_waveform: "Toplu Çıkış Dalga Formu",
  aggregated_waveform_desc: "Durulaştırma dilimli gerçek zamanlı gölgeli bulanık küme dağıtımı",
  inputs_grid: "Canlı Giriş Tablosu",
  inputs_grid_desc: "Motora beslenen giriş ölçüm haplarını ve değerleri göster",
  rule_strengths: "Aktif Kural Etkinleştirmenin Güçlü Yönleri",
  rule_strengths_desc: "Etkin kurallar için tetikleme gücü ilerleme çubuklarını göster"
}, es = {
  title: "Bulanık Kontrol Stüdyosu",
  catalog: "Sistem Kataloğu",
  editor: "Görsel Kural ve Eğri Düzenleyici",
  add_system: "Sistem Ekle",
  simulate: "Değerlendirmeyi Simüle Et",
  reload: "YAML'yi yeniden yükle",
  loading: "Loading Fuzzy Systems..."
}, Fi = {
  card: Qt,
  editor: Xt,
  panel: es
}, Ni = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  card: Qt,
  default: Fi,
  editor: Xt,
  panel: es
}, Symbol.toStringTag, { value: "Module" })), ts = {
  configuring: "Налаштування fuzzy-system-card...",
  active: "Активний",
  live_inputs: "Живі входи",
  outputs: "Виходи",
  live_aggregated_set: "Live Aggregated Output Set",
  rule_firing_strengths: "Сильні сторони стрільби активного правила"
}, ss = {
  target_system: "Цільова нечітка система",
  detected: "Виявлено {count}",
  target_system_helper: "Виберіть контролер нечіткої логіки для моніторингу та візуалізації на цій інформаційній панелі.",
  card_title: "Назва картки (необов’язково)",
  card_title_placeholder: "напр. Контролер вентилятора для вітальні",
  card_title_helper: "Залиште поле порожнім, щоб використовувати нечітку назву системи автоматично.",
  visual_components: "Компоненти візуальної картки",
  aggregated_waveform: "Агрегований вихідний сигнал",
  aggregated_waveform_desc: "Розподіл затінених нечітких множин у реальному часі зі зрізом дефазифікації",
  inputs_grid: "Сітка живих вводів",
  inputs_grid_desc: "Показати вхідні метричні таблетки та значення, що надходять у механізм",
  rule_strengths: "Сильні сторони стрільби активного правила",
  rule_strengths_desc: "Показувати індикатори прогресу сили стрільби для активних правил"
}, is = {
  title: "Студія нечіткого управління",
  catalog: "Системний каталог",
  editor: "Візуальний редактор ліній і кривих",
  add_system: "Додати систему",
  simulate: "Імітація оцінювання",
  reload: "Перезавантажте YAML",
  loading: "Завантаження нечітких систем..."
}, Vi = {
  card: ts,
  editor: ss,
  panel: is
}, Di = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  card: ts,
  default: Vi,
  editor: ss,
  panel: is
}, Symbol.toStringTag, { value: "Module" })), as = {
  configuring: "配置模糊系统卡...",
  active: "积极的",
  live_inputs: "实时输入",
  outputs: "输出",
  live_aggregated_set: "实时聚合输出集",
  rule_firing_strengths: "主动规则触发优势"
}, rs = {
  target_system: "目标模糊系统",
  detected: "检测到 {count}",
  target_system_helper: "选择模糊逻辑控制器以在此仪表板卡上进行监控和可视化。",
  card_title: "卡片标题（可选）",
  card_title_placeholder: "例如客厅风扇控制器",
  card_title_helper: "留空可自动使用模糊系统名称。",
  visual_components: "可视卡组件",
  aggregated_waveform: "Aggregated Output Waveform",
  aggregated_waveform_desc: "Real-time shaded fuzzy set distribution with defuzzification slice",
  inputs_grid: "实时输入网格",
  inputs_grid_desc: "显示输入引擎的输入计量丸和值",
  rule_strengths: "主动规则触发优势",
  rule_strengths_desc: "显示活动规则的射击强度进度条"
}, ns = {
  title: "模糊控制工作室",
  catalog: "系统目录",
  editor: "可视化规则和曲线编辑器",
  add_system: "添加系统",
  simulate: "模拟评估",
  reload: "重新加载 YAML",
  loading: "正在加载模糊系统..."
}, Hi = {
  card: as,
  editor: rs,
  panel: ns
}, qi = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  card: as,
  default: Hi,
  editor: rs,
  panel: ns
}, Symbol.toStringTag, { value: "Module" })), os = {
  configuring: "配置模糊系統卡...",
  active: "積極的",
  live_inputs: "即時輸入",
  outputs: "輸出",
  live_aggregated_set: "即時聚合輸出集",
  rule_firing_strengths: "主動規則觸發優勢"
}, ls = {
  target_system: "目標模糊系統",
  detected: "檢測到 {count}",
  target_system_helper: "選擇模糊邏輯控制器以在此儀表闆卡上進行監控和視覺化。",
  card_title: "卡片標題（可選）",
  card_title_placeholder: "例如客廳風扇控制器",
  card_title_helper: "留空可自動使用模糊系統名稱。",
  visual_components: "可視卡組件",
  aggregated_waveform: "聚合輸出波形",
  aggregated_waveform_desc: "具有去模糊切片的即時著色模糊集分佈",
  inputs_grid: "即時輸入網格",
  inputs_grid_desc: "顯示輸入引擎的輸入計量丸和值",
  rule_strengths: "主動規則觸發優勢",
  rule_strengths_desc: "Show firing strength progress bars for active rules"
}, ds = {
  title: "模糊控制工作室",
  catalog: "系統目錄",
  editor: "可視化規則和曲線編輯器",
  add_system: "新增系統",
  simulate: "模擬評估",
  reload: "重新載入 YAML",
  loading: "正在載入模糊系統..."
}, Bi = {
  card: os,
  editor: ls,
  panel: ds
}, Ui = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  card: os,
  default: Bi,
  editor: ls,
  panel: ds
}, Symbol.toStringTag, { value: "Module" })), _e = {}, fe = /* @__PURE__ */ Object.assign({ "../translations/cs.json": ii, "../translations/da.json": ri, "../translations/de.json": oi, "../translations/el.json": di, "../translations/en.json": ui, "../translations/es.json": gi, "../translations/fi.json": mi, "../translations/fr.json": _i, "../translations/it.json": vi, "../translations/ja.json": xi, "../translations/ko.json": zi, "../translations/nb.json": Si, "../translations/nl.json": Ai, "../translations/pl.json": Ei, "../translations/pt-BR.json": ji, "../translations/pt.json": Oi, "../translations/ru.json": Ri, "../translations/sv.json": Pi, "../translations/tr.json": Ni, "../translations/uk.json": Di, "../translations/zh-Hans.json": qi, "../translations/zh-Hant.json": Ui });
for (const t in fe) {
  const e = t.match(/\/([^/]+)\.json$/);
  if (e) {
    const i = e[1];
    _e[i] = fe[t].default || fe[t];
  }
}
function x(t, e, i, a) {
  const s = (a || "en").replace(/_/g, "-");
  let r;
  const n = [s, s.split("-")[0], "en"];
  for (const o of n)
    if (_e[o]) {
      const d = t.split(".");
      let c = _e[o];
      for (const u of d)
        c = c ? c[u] : void 0;
      if (typeof c == "string") {
        r = c;
        break;
      }
    }
  if (r || (r = t), typeof e == "object" && e !== null)
    for (const [o, d] of Object.entries(e))
      r = r.replace(new RegExp(`\\{${o}\\}`, "g"), String(d));
  return r;
}
var Wi = Object.defineProperty, Gi = Object.getOwnPropertyDescriptor, we = (t, e, i, a) => {
  for (var s = a > 1 ? void 0 : a ? Gi(e, i) : e, r = t.length - 1, n; r >= 0; r--)
    (n = t[r]) && (s = (a ? n(e, i, s) : n(s)) || s);
  return a && s && Wi(e, i, s), s;
};
let ae = class extends A {
  setConfig(t) {
    this._config = {
      show_graph: !0,
      show_inputs: !0,
      show_rules: !0,
      ...t
    };
  }
  _getAvailableSystems() {
    const t = /* @__PURE__ */ new Set();
    if (!this.hass?.states) return ["fan_simulator", "tipping"];
    for (const [e, i] of Object.entries(this.hass.states)) {
      const a = e.match(/^sensor\.fuzzy_([a-zA-Z0-9_-]+)_status$/);
      a && t.add(a[1]), i.attributes?.system && t.add(i.attributes.system);
    }
    return t.size === 0 && (t.add("fan_simulator"), t.add("tipping")), Array.from(t).sort();
  }
  _valueChanged(t) {
    if (!this._config) return;
    const e = t.target, i = e.dataset.configValue;
    if (!i) return;
    let a;
    e.type === "checkbox" ? a = e.checked : a = e.value, this._config = {
      ...this._config,
      [i]: a
    };
    const s = new CustomEvent("config-changed", {
      detail: { config: this._config },
      bubbles: !0,
      composed: !0
    });
    this.dispatchEvent(s);
  }
  render() {
    if (!this.hass || !this._config)
      return l``;
    const t = this._getAvailableSystems(), e = this._config.system_id || t[0] || "", i = this.hass?.locale?.language || this.hass?.language || "en";
    return l`
      <div class="card-config">
        <!-- Fuzzy System Selector -->
        <div class="form-group">
          <label class="form-label" for="system-select">
            ${x("editor.target_system", void 0, void 0, i)}
            <span class="system-badge">${x("editor.detected", { count: t.length }, void 0, i)}</span>
          </label>
          <select
            id="system-select"
            class="select-field"
            data-config-value="system_id"
            .value=${e}
            @change=${this._valueChanged}
          >
            ${t.map(
      (a) => l`
                <option value=${a} ?selected=${a === e}>
                  ${a} (${this.hass.states[`sensor.fuzzy_${a}_status`]?.state || "active"})
                </option>
              `
    )}
          </select>
          <div class="form-helper">
            ${x("editor.target_system_helper", void 0, void 0, i)}
          </div>
        </div>

        <!-- Custom Card Title -->
        <div class="form-group">
          <label class="form-label" for="card-title">${x("editor.card_title", void 0, void 0, i)}</label>
          <input
            id="card-title"
            class="input-field"
            type="text"
            data-config-value="title"
            placeholder="${x("editor.card_title_placeholder", void 0, void 0, i)}"
            .value=${this._config.title || ""}
            @input=${this._valueChanged}
          />
          <div class="form-helper">${x("editor.card_title_helper", void 0, void 0, i)}</div>
        </div>

        <!-- Display Toggles -->
        <div class="form-group">
          <label class="form-label">${x("editor.visual_components", void 0, void 0, i)}</label>
          <div class="toggles-group">
            <!-- Aggregated Graph Toggle -->
            <label class="toggle-row">
              <div class="toggle-info">
                <span class="toggle-title">${x("editor.aggregated_waveform", void 0, void 0, i)}</span>
                <span class="toggle-desc">${x("editor.aggregated_waveform_desc", void 0, void 0, i)}</span>
              </div>
              <div class="switch">
                <input
                  type="checkbox"
                  data-config-value="show_graph"
                  .checked=${this._config.show_graph !== !1}
                  @change=${this._valueChanged}
                />
                <span class="slider"></span>
              </div>
            </label>

            <!-- Inputs Grid Toggle -->
            <label class="toggle-row">
              <div class="toggle-info">
                <span class="toggle-title">${x("editor.inputs_grid", void 0, void 0, i)}</span>
                <span class="toggle-desc">${x("editor.inputs_grid_desc", void 0, void 0, i)}</span>
              </div>
              <div class="switch">
                <input
                  type="checkbox"
                  data-config-value="show_inputs"
                  .checked=${this._config.show_inputs !== !1}
                  @change=${this._valueChanged}
                />
                <span class="slider"></span>
              </div>
            </label>

            <!-- Rule Strengths Toggle -->
            <label class="toggle-row">
              <div class="toggle-info">
                <span class="toggle-title">${x("editor.rule_strengths", void 0, void 0, i)}</span>
                <span class="toggle-desc">${x("editor.rule_strengths_desc", void 0, void 0, i)}</span>
              </div>
              <div class="switch">
                <input
                  type="checkbox"
                  data-config-value="show_rules"
                  .checked=${this._config.show_rules !== !1}
                  @change=${this._valueChanged}
                />
                <span class="slider"></span>
              </div>
            </label>
          </div>
        </div>
      </div>
    `;
  }
};
ae.styles = I`
    :host {
      display: block;
      padding: 16px 0;
      color: var(--primary-text-color, #f8fafc);
      font-family: var(--ha-font-family, sans-serif);
    }

    .form-group {
      margin-bottom: 20px;
    }

    .form-label {
      display: block;
      font-size: 13px;
      font-weight: 600;
      margin-bottom: 6px;
      color: var(--primary-text-color, #e2e8f0);
    }

    .form-helper {
      font-size: 11px;
      color: var(--secondary-text-color, #94a3b8);
      margin-top: 4px;
    }

    .input-field,
    .select-field {
      width: 100%;
      box-sizing: border-box;
      padding: 10px 14px;
      background: var(--card-background-color, #1e293b);
      border: 1px solid var(--divider-color, rgba(255, 255, 255, 0.12));
      border-radius: 8px;
      color: var(--primary-text-color, #f8fafc);
      font-size: 14px;
      outline: none;
      transition: border-color 0.2s ease, box-shadow 0.2s ease;
    }

    .input-field:focus,
    .select-field:focus {
      border-color: #38bdf8;
      box-shadow: 0 0 0 2px rgba(56, 189, 248, 0.2);
    }

    .select-field option {
      background: #1e293b;
      color: #f8fafc;
    }

    .toggles-group {
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid rgba(255, 255, 255, 0.06);
      border-radius: 10px;
      padding: 12px 16px;
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .toggle-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      cursor: pointer;
    }

    .toggle-info {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    .toggle-title {
      font-size: 13px;
      font-weight: 600;
    }

    .toggle-desc {
      font-size: 11px;
      color: var(--secondary-text-color, #94a3b8);
    }

    /* Switch styling */
    .switch {
      position: relative;
      display: inline-block;
      width: 44px;
      height: 24px;
      flex-shrink: 0;
    }

    .switch input {
      opacity: 0;
      width: 0;
      height: 0;
    }

    .slider {
      position: absolute;
      cursor: pointer;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: rgba(255, 255, 255, 0.15);
      transition: 0.3s;
      border-radius: 24px;
    }

    .slider:before {
      position: absolute;
      content: "";
      height: 18px;
      width: 18px;
      left: 3px;
      bottom: 3px;
      background-color: white;
      transition: 0.3s;
      border-radius: 50%;
    }

    input:checked + .slider {
      background-color: #0284c7;
    }

    input:checked + .slider:before {
      transform: translateX(20px);
    }

    .system-badge {
      display: inline-block;
      margin-left: 6px;
      padding: 2px 6px;
      border-radius: 4px;
      font-size: 10px;
      font-weight: 700;
      text-transform: uppercase;
      background: rgba(56, 189, 248, 0.15);
      color: #38bdf8;
    }
  `;
we([
  v({ attribute: !1 })
], ae.prototype, "hass", 2);
we([
  p()
], ae.prototype, "_config", 2);
ae = we([
  F("fuzzy-system-card-editor")
], ae);
var Yi = Object.defineProperty, Ki = Object.getOwnPropertyDescriptor, Se = (t, e, i, a) => {
  for (var s = a > 1 ? void 0 : a ? Ki(e, i) : e, r = t.length - 1, n; r >= 0; r--)
    (n = t[r]) && (s = (a ? n(e, i, s) : n(s)) || s);
  return a && s && Yi(e, i, s), s;
};
window.customCards = window.customCards || [];
window.customCards.some((t) => t.type === "fuzzy-system-card") || window.customCards.push({
  type: "fuzzy-system-card",
  name: "Fuzzy System Controller",
  description: "Display live fuzzy logic controller status, inputs, and real-time aggregated output distributions.",
  preview: !0,
  documentationURL: "https://github.com/dougransom/fuzzy_system"
});
let re = class extends A {
  constructor() {
    super(...arguments), this._config = {};
  }
  static async getConfigElement() {
    return document.createElement("fuzzy-system-card-editor");
  }
  static getStubConfig(t) {
    const e = /* @__PURE__ */ new Set();
    if (t?.states)
      for (const [a, s] of Object.entries(t.states)) {
        const r = a.match(/^sensor\.fuzzy_([a-zA-Z0-9_-]+)_status$/);
        r && e.add(r[1]), s.attributes?.system && e.add(s.attributes.system);
      }
    return {
      type: "custom:fuzzy-system-card",
      system_id: Array.from(e)[0] || "fan_simulator",
      title: "",
      show_graph: !0,
      show_inputs: !0,
      show_rules: !0
    };
  }
  setConfig(t) {
    if (!t.system_id)
      throw new Error("Please define a 'system_id' for fuzzy-system-card (e.g. system_id: 'climate_controller').");
    this._config = {
      show_graph: !0,
      show_inputs: !0,
      show_rules: !0,
      ...t
    };
  }
  getCardSize() {
    return 4;
  }
  _findSensors() {
    if (!this.hass?.states || !this._config.system_id) return { outputs: [], status: null };
    const t = this._config.system_id.toLowerCase(), e = [];
    let i = null;
    for (const [a, s] of Object.entries(this.hass.states))
      if (a.startsWith("sensor.")) {
        if (a === `sensor.fuzzy_${t}_status`) {
          i = s;
          continue;
        }
        (a.startsWith(`sensor.fuzzy_${t}_`) || s.attributes?.system === this._config.system_id) && !a.endsWith("_set") && !a.endsWith("_status") && e.push({ entityId: a, stateObj: s });
      }
    return { outputs: e, status: i };
  }
  render() {
    const t = this.hass?.locale?.language || this.hass?.language || "en";
    if (!this.hass || !this._config.system_id)
      return l`<ha-card><p style="padding: 16px;">${x("card.configuring", void 0, void 0, t)}</p></ha-card>`;
    const { outputs: e } = this._findSensors(), i = this._config.system_id, a = this._config.title || `Fuzzy System: ${i}`, s = e[0], r = s?.stateObj?.attributes || {}, n = r.universe || [], o = r.aggregated_set || [], d = s?.stateObj?.state ? parseFloat(s.stateObj.state) : void 0, c = r.unit_of_measurement || "", u = r.defuzzifier || "cog", g = r.dominant_term || "", h = r.inputs || {}, f = r.rule_strengths || [];
    return l`
      <ha-card>
        <div class="card-header">
          <div class="title-group">
            <div class="card-icon">⚡</div>
            <div>
              <div class="card-title">${a}</div>
              <div class="card-subtitle">${i}</div>
            </div>
          </div>
          <div class="badge-status">
            <span class="pulse-dot"></span>
            <span>${x("card.active", void 0, void 0, t)}</span>
          </div>
        </div>

        ${this._config.show_inputs !== !1 && Object.keys(h).length > 0 ? l`
              <div class="section-title">${x("card.live_inputs", void 0, void 0, t)}</div>
              <div class="inputs-grid">
                ${Object.entries(h).map(
      ([y, b]) => l`
                    <div class="metric-pill">
                      <span class="metric-label">${y}</span>
                      <span class="metric-val">${typeof b == "number" ? b.toFixed(1) : b}</span>
                    </div>
                  `
    )}
              </div>
            ` : ""}

        ${this._config.show_graph !== !1 && n.length > 0 ? l`
              <div class="section-title">${x("card.live_aggregated_set", void 0, void 0, t)}</div>
              <fuzzy-aggregated-graph
                .universe=${n}
                .aggregatedSet=${o}
                .defuzzifiedValue=${d}
                .defuzzifier=${u}
                .dominantTerm=${g}
                .unit=${c}
                .outputName=${s.entityId.replace(`sensor.fuzzy_${i}_`, "")}
              ></fuzzy-aggregated-graph>
            ` : e.length > 0 ? l`
              <div class="section-title">${x("card.outputs", void 0, void 0, t)}</div>
              ${e.map(
      (y) => l`
                  <div class="metric-pill" style="margin-bottom: 6px;">
                    <span class="metric-label">${y.entityId}</span>
                    <span class="metric-val">${y.stateObj.state} ${y.stateObj.attributes?.unit_of_measurement || ""}</span>
                  </div>
                `
    )}
            ` : ""}

        ${this._config.show_rules !== !1 && f.length > 0 ? l`
              <div class="section-title">${x("card.rule_firing_strengths", void 0, void 0, t)}</div>
              ${f.slice(0, 4).map(
      (y, b) => l`
                  <div class="rule-bar-row">
                    <span style="font-size: 11px; width: 45px; color: var(--secondary-text-color);">R${b + 1}</span>
                    <div class="rule-progress-bg">
                      <div class="rule-progress-fill" style="width: ${(y.firing_strength * 100).toFixed(0)}%;"></div>
                    </div>
                    <span style="font-size: 11px; width: 35px; text-align: right; font-weight: 700; color: #38bdf8;">
                      ${y.firing_strength.toFixed(2)}
                    </span>
                  </div>
                `
    )}
            ` : ""}
      </ha-card>
    `;
  }
};
re.styles = I`
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
Se([
  v({ attribute: !1 })
], re.prototype, "hass", 2);
Se([
  p()
], re.prototype, "_config", 2);
re = Se([
  F("fuzzy-system-card")
], re);
var Ji = Object.defineProperty, Zi = Object.getOwnPropertyDescriptor, R = (t, e, i, a) => {
  for (var s = a > 1 ? void 0 : a ? Zi(e, i) : e, r = t.length - 1, n; r >= 0; r--)
    (n = t[r]) && (s = (a ? n(e, i, s) : n(s)) || s);
  return a && s && Ji(e, i, s), s;
};
let C = class extends A {
  constructor() {
    super(...arguments), this.narrow = !1, this._view = "catalog", this._selectedSource = "config_entry";
  }
  firstUpdated() {
    Us({
      getHass: () => this.hass,
      getActiveConfig: () => {
        if (this._view === "editor")
          return this.shadowRoot?.querySelector("fuzzy-system-editor")?._config || this._selectedConfig;
      },
      updateActiveConfig: (t) => {
        if (this._view === "editor") {
          const e = this.shadowRoot?.querySelector("fuzzy-system-editor");
          e && (e._config = t(e._config), e.requestUpdate());
        }
      },
      openSystemInEditor: (t) => {
        this._selectedConfig = t, this._selectedEntryId = void 0, this._selectedSource = "config_entry", this._view = "editor";
      },
      refreshCatalog: () => {
        const t = this.shadowRoot?.querySelector("fuzzy-system-catalog");
        t && typeof t.refresh == "function" && t.refresh();
      }
    });
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
    return l`
      <header class="app-header">
        <div class="brand">
          <div class="brand-icon">⚡</div>
          <div>
            <div class="brand-title">Fuzzy System Control</div>
          </div>
        </div>

        <div class="nav-links">
          <span class="badge badge-purple" title="WebMCP tool contract exposed for browser AI agents and DevTools">
            🌐 WebMCP
          </span>
          <span class="badge badge-cyan">v0.1.4</span>
        </div>
      </header>

      <main class="panel-content container">
        ${this._view === "catalog" ? l`
              <fuzzy-system-catalog
                .hass=${this.hass}
                @create-system=${this._handleCreateSystem}
                @edit-system=${this._handleEditSystem}
              ></fuzzy-system-catalog>
            ` : l`
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
C.styles = [
  he,
  I`
      :host {
        display: block;
        min-height: 100vh;
        background: var(--fuzzy-bg);
        color: var(--fuzzy-text);
      }

      .app-header {
        background: var(--card-background-color, rgba(30, 41, 59, 0.85));
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
        color: var(--primary-text-color, var(--fuzzy-text));
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
        color: var(--primary-text-color, var(--fuzzy-text));
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
R([
  v({ attribute: !1 })
], C.prototype, "hass", 2);
R([
  v({ type: Boolean })
], C.prototype, "narrow", 2);
R([
  v({ type: Object })
], C.prototype, "route", 2);
R([
  v({ type: Object })
], C.prototype, "panel", 2);
R([
  p()
], C.prototype, "_view", 2);
R([
  p()
], C.prototype, "_selectedConfig", 2);
R([
  p()
], C.prototype, "_selectedEntryId", 2);
R([
  p()
], C.prototype, "_selectedSource", 2);
C = R([
  F("fuzzy-system-panel")
], C);
export {
  C as FuzzySystemPanel
};
