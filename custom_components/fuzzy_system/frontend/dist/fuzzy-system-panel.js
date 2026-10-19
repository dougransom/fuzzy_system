/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const lt = globalThis, ft = lt.ShadowRoot && (lt.ShadyCSS === void 0 || lt.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, mt = Symbol(), wt = /* @__PURE__ */ new WeakMap();
let Nt = class {
  constructor(t, i, a) {
    if (this._$cssResult$ = !0, a !== mt) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = t, this.t = i;
  }
  get styleSheet() {
    let t = this.o;
    const i = this.t;
    if (ft && t === void 0) {
      const a = i !== void 0 && i.length === 1;
      a && (t = wt.get(i)), t === void 0 && ((this.o = t = new CSSStyleSheet()).replaceSync(this.cssText), a && wt.set(i, t));
    }
    return t;
  }
  toString() {
    return this.cssText;
  }
};
const Zt = (e) => new Nt(typeof e == "string" ? e : e + "", void 0, mt), O = (e, ...t) => {
  const i = e.length === 1 ? e[0] : t.reduce((a, s, r) => a + ((n) => {
    if (n._$cssResult$ === !0) return n.cssText;
    if (typeof n == "number") return n;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + n + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(s) + e[r + 1], e[0]);
  return new Nt(i, e, mt);
}, Qt = (e, t) => {
  if (ft) e.adoptedStyleSheets = t.map((i) => i instanceof CSSStyleSheet ? i : i.styleSheet);
  else for (const i of t) {
    const a = document.createElement("style"), s = lt.litNonce;
    s !== void 0 && a.setAttribute("nonce", s), a.textContent = i.cssText, e.appendChild(a);
  }
}, zt = ft ? (e) => e : (e) => e instanceof CSSStyleSheet ? ((t) => {
  let i = "";
  for (const a of t.cssRules) i += a.cssText;
  return Zt(i);
})(e) : e;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const { is: Xt, defineProperty: Kt, getOwnPropertyDescriptor: te, getOwnPropertyNames: ee, getOwnPropertySymbols: se, getPrototypeOf: ie } = Object, ct = globalThis, St = ct.trustedTypes, ae = St ? St.emptyScript : "", re = ct.reactiveElementPolyfillSupport, K = (e, t) => e, dt = { toAttribute(e, t) {
  switch (t) {
    case Boolean:
      e = e ? ae : null;
      break;
    case Object:
    case Array:
      e = e == null ? e : JSON.stringify(e);
  }
  return e;
}, fromAttribute(e, t) {
  let i = e;
  switch (t) {
    case Boolean:
      i = e !== null;
      break;
    case Number:
      i = e === null ? null : Number(e);
      break;
    case Object:
    case Array:
      try {
        i = JSON.parse(e);
      } catch {
        i = null;
      }
  }
  return i;
} }, bt = (e, t) => !Xt(e, t), kt = { attribute: !0, type: String, converter: dt, reflect: !1, useDefault: !1, hasChanged: bt };
Symbol.metadata ??= Symbol("metadata"), ct.litPropertyMetadata ??= /* @__PURE__ */ new WeakMap();
let J = class extends HTMLElement {
  static addInitializer(t) {
    this._$Ei(), (this.l ??= []).push(t);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(t, i = kt) {
    if (i.state && (i.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(t) && ((i = Object.create(i)).wrapped = !0), this.elementProperties.set(t, i), !i.noAccessor) {
      const a = Symbol(), s = this.getPropertyDescriptor(t, a, i);
      s !== void 0 && Kt(this.prototype, t, s);
    }
  }
  static getPropertyDescriptor(t, i, a) {
    const { get: s, set: r } = te(this.prototype, t) ?? { get() {
      return this[i];
    }, set(n) {
      this[i] = n;
    } };
    return { get: s, set(n) {
      const o = s?.call(this);
      r?.call(this, n), this.requestUpdate(t, o, a);
    }, configurable: !0, enumerable: !0 };
  }
  static getPropertyOptions(t) {
    return this.elementProperties.get(t) ?? kt;
  }
  static _$Ei() {
    if (this.hasOwnProperty(K("elementProperties"))) return;
    const t = ie(this);
    t.finalize(), t.l !== void 0 && (this.l = [...t.l]), this.elementProperties = new Map(t.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(K("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(K("properties"))) {
      const i = this.properties, a = [...ee(i), ...se(i)];
      for (const s of a) this.createProperty(s, i[s]);
    }
    const t = this[Symbol.metadata];
    if (t !== null) {
      const i = litPropertyMetadata.get(t);
      if (i !== void 0) for (const [a, s] of i) this.elementProperties.set(a, s);
    }
    this._$Eh = /* @__PURE__ */ new Map();
    for (const [i, a] of this.elementProperties) {
      const s = this._$Eu(i, a);
      s !== void 0 && this._$Eh.set(s, i);
    }
    this.elementStyles = this.finalizeStyles(this.styles);
  }
  static finalizeStyles(t) {
    const i = [];
    if (Array.isArray(t)) {
      const a = new Set(t.flat(1 / 0).reverse());
      for (const s of a) i.unshift(zt(s));
    } else t !== void 0 && i.push(zt(t));
    return i;
  }
  static _$Eu(t, i) {
    const a = i.attribute;
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
    const t = /* @__PURE__ */ new Map(), i = this.constructor.elementProperties;
    for (const a of i.keys()) this.hasOwnProperty(a) && (t.set(a, this[a]), delete this[a]);
    t.size > 0 && (this._$Ep = t);
  }
  createRenderRoot() {
    const t = this.shadowRoot ?? this.attachShadow(this.constructor.shadowRootOptions);
    return Qt(t, this.constructor.elementStyles), t;
  }
  connectedCallback() {
    this.renderRoot ??= this.createRenderRoot(), this.enableUpdating(!0), this._$EO?.forEach((t) => t.hostConnected?.());
  }
  enableUpdating(t) {
  }
  disconnectedCallback() {
    this._$EO?.forEach((t) => t.hostDisconnected?.());
  }
  attributeChangedCallback(t, i, a) {
    this._$AK(t, a);
  }
  _$ET(t, i) {
    const a = this.constructor.elementProperties.get(t), s = this.constructor._$Eu(t, a);
    if (s !== void 0 && a.reflect === !0) {
      const r = (a.converter?.toAttribute !== void 0 ? a.converter : dt).toAttribute(i, a.type);
      this._$Em = t, r == null ? this.removeAttribute(s) : this.setAttribute(s, r), this._$Em = null;
    }
  }
  _$AK(t, i) {
    const a = this.constructor, s = a._$Eh.get(t);
    if (s !== void 0 && this._$Em !== s) {
      const r = a.getPropertyOptions(s), n = typeof r.converter == "function" ? { fromAttribute: r.converter } : r.converter?.fromAttribute !== void 0 ? r.converter : dt;
      this._$Em = s;
      const o = n.fromAttribute(i, r.type);
      this[s] = o ?? this._$Ej?.get(s) ?? o, this._$Em = null;
    }
  }
  requestUpdate(t, i, a, s = !1, r) {
    if (t !== void 0) {
      const n = this.constructor;
      if (s === !1 && (r = this[t]), a ??= n.getPropertyOptions(t), !((a.hasChanged ?? bt)(r, i) || a.useDefault && a.reflect && r === this._$Ej?.get(t) && !this.hasAttribute(n._$Eu(t, a)))) return;
      this.C(t, i, a);
    }
    this.isUpdatePending === !1 && (this._$ES = this._$EP());
  }
  C(t, i, { useDefault: a, reflect: s, wrapped: r }, n) {
    a && !(this._$Ej ??= /* @__PURE__ */ new Map()).has(t) && (this._$Ej.set(t, n ?? i ?? this[t]), r !== !0 || n !== void 0) || (this._$AL.has(t) || (this.hasUpdated || a || (i = void 0), this._$AL.set(t, i)), s === !0 && this._$Em !== t && (this._$Eq ??= /* @__PURE__ */ new Set()).add(t));
  }
  async _$EP() {
    this.isUpdatePending = !0;
    try {
      await this._$ES;
    } catch (i) {
      Promise.reject(i);
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
        for (const [s, r] of this._$Ep) this[s] = r;
        this._$Ep = void 0;
      }
      const a = this.constructor.elementProperties;
      if (a.size > 0) for (const [s, r] of a) {
        const { wrapped: n } = r, o = this[s];
        n !== !0 || this._$AL.has(s) || o === void 0 || this.C(s, void 0, r, o);
      }
    }
    let t = !1;
    const i = this._$AL;
    try {
      t = this.shouldUpdate(i), t ? (this.willUpdate(i), this._$EO?.forEach((a) => a.hostUpdate?.()), this.update(i)) : this._$EM();
    } catch (a) {
      throw t = !1, this._$EM(), a;
    }
    t && this._$AE(i);
  }
  willUpdate(t) {
  }
  _$AE(t) {
    this._$EO?.forEach((i) => i.hostUpdated?.()), this.hasUpdated || (this.hasUpdated = !0, this.firstUpdated(t)), this.updated(t);
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
    this._$Eq &&= this._$Eq.forEach((i) => this._$ET(i, this[i])), this._$EM();
  }
  updated(t) {
  }
  firstUpdated(t) {
  }
};
J.elementStyles = [], J.shadowRootOptions = { mode: "open" }, J[K("elementProperties")] = /* @__PURE__ */ new Map(), J[K("finalized")] = /* @__PURE__ */ new Map(), re?.({ ReactiveElement: J }), (ct.reactiveElementVersions ??= []).push("2.1.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const yt = globalThis, At = (e) => e, pt = yt.trustedTypes, Ct = pt ? pt.createPolicy("lit-html", { createHTML: (e) => e }) : void 0, Pt = "$lit$", N = `lit$${Math.random().toFixed(9).slice(2)}$`, Lt = "?" + N, ne = `<${Lt}>`, U = document, tt = () => U.createComment(""), et = (e) => e === null || typeof e != "object" && typeof e != "function", vt = Array.isArray, oe = (e) => vt(e) || typeof e?.[Symbol.iterator] == "function", gt = `[ 	
\f\r]`, X = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, Et = /-->/g, It = />/g, H = RegExp(`>|${gt}(?:([^\\s"'>=/]+)(${gt}*=${gt}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), Tt = /'/g, Mt = /"/g, Ft = /^(?:script|style|textarea|title)$/i, Dt = (e) => (t, ...i) => ({ _$litType$: e, strings: t, values: i }), l = Dt(1), Y = Dt(2), Z = Symbol.for("lit-noChange"), x = Symbol.for("lit-nothing"), Ot = /* @__PURE__ */ new WeakMap(), V = U.createTreeWalker(U, 129);
function Ht(e, t) {
  if (!vt(e) || !e.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return Ct !== void 0 ? Ct.createHTML(t) : t;
}
const le = (e, t) => {
  const i = e.length - 1, a = [];
  let s, r = t === 2 ? "<svg>" : t === 3 ? "<math>" : "", n = X;
  for (let o = 0; o < i; o++) {
    const d = e[o];
    let p, c, h = -1, g = 0;
    for (; g < d.length && (n.lastIndex = g, c = n.exec(d), c !== null); ) g = n.lastIndex, n === X ? c[1] === "!--" ? n = Et : c[1] !== void 0 ? n = It : c[2] !== void 0 ? (Ft.test(c[2]) && (s = RegExp("</" + c[2], "g")), n = H) : c[3] !== void 0 && (n = H) : n === H ? c[0] === ">" ? (n = s ?? X, h = -1) : c[1] === void 0 ? h = -2 : (h = n.lastIndex - c[2].length, p = c[1], n = c[3] === void 0 ? H : c[3] === '"' ? Mt : Tt) : n === Mt || n === Tt ? n = H : n === Et || n === It ? n = X : (n = H, s = void 0);
    const f = n === H && e[o + 1].startsWith("/>") ? " " : "";
    r += n === X ? d + ne : h >= 0 ? (a.push(p), d.slice(0, h) + Pt + d.slice(h) + N + f) : d + N + (h === -2 ? o : f);
  }
  return [Ht(e, r + (e[i] || "<?>") + (t === 2 ? "</svg>" : t === 3 ? "</math>" : "")), a];
};
class st {
  constructor({ strings: t, _$litType$: i }, a) {
    let s;
    this.parts = [];
    let r = 0, n = 0;
    const o = t.length - 1, d = this.parts, [p, c] = le(t, i);
    if (this.el = st.createElement(p, a), V.currentNode = this.el.content, i === 2 || i === 3) {
      const h = this.el.content.firstChild;
      h.replaceWith(...h.childNodes);
    }
    for (; (s = V.nextNode()) !== null && d.length < o; ) {
      if (s.nodeType === 1) {
        if (s.hasAttributes()) for (const h of s.getAttributeNames()) if (h.endsWith(Pt)) {
          const g = c[n++], f = s.getAttribute(h).split(N), y = /([.?@])?(.*)/.exec(g);
          d.push({ type: 1, index: r, name: y[2], strings: f, ctor: y[1] === "." ? pe : y[1] === "?" ? ce : y[1] === "@" ? ue : ut }), s.removeAttribute(h);
        } else h.startsWith(N) && (d.push({ type: 6, index: r }), s.removeAttribute(h));
        if (Ft.test(s.tagName)) {
          const h = s.textContent.split(N), g = h.length - 1;
          if (g > 0) {
            s.textContent = pt ? pt.emptyScript : "";
            for (let f = 0; f < g; f++) s.append(h[f], tt()), V.nextNode(), d.push({ type: 2, index: ++r });
            s.append(h[g], tt());
          }
        }
      } else if (s.nodeType === 8) if (s.data === Lt) d.push({ type: 2, index: r });
      else {
        let h = -1;
        for (; (h = s.data.indexOf(N, h + 1)) !== -1; ) d.push({ type: 7, index: r }), h += N.length - 1;
      }
      r++;
    }
  }
  static createElement(t, i) {
    const a = U.createElement("template");
    return a.innerHTML = t, a;
  }
}
function Q(e, t, i = e, a) {
  if (t === Z) return t;
  let s = a !== void 0 ? i._$Co?.[a] : i._$Cl;
  const r = et(t) ? void 0 : t._$litDirective$;
  return s?.constructor !== r && (s?._$AO?.(!1), r === void 0 ? s = void 0 : (s = new r(e), s._$AT(e, i, a)), a !== void 0 ? (i._$Co ??= [])[a] = s : i._$Cl = s), s !== void 0 && (t = Q(e, s._$AS(e, t.values), s, a)), t;
}
class de {
  constructor(t, i) {
    this._$AV = [], this._$AN = void 0, this._$AD = t, this._$AM = i;
  }
  get parentNode() {
    return this._$AM.parentNode;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  u(t) {
    const { el: { content: i }, parts: a } = this._$AD, s = (t?.creationScope ?? U).importNode(i, !0);
    V.currentNode = s;
    let r = V.nextNode(), n = 0, o = 0, d = a[0];
    for (; d !== void 0; ) {
      if (n === d.index) {
        let p;
        d.type === 2 ? p = new rt(r, r.nextSibling, this, t) : d.type === 1 ? p = new d.ctor(r, d.name, d.strings, this, t) : d.type === 6 && (p = new he(r, this, t)), this._$AV.push(p), d = a[++o];
      }
      n !== d?.index && (r = V.nextNode(), n++);
    }
    return V.currentNode = U, s;
  }
  p(t) {
    let i = 0;
    for (const a of this._$AV) a !== void 0 && (a.strings !== void 0 ? (a._$AI(t, a, i), i += a.strings.length - 2) : a._$AI(t[i])), i++;
  }
}
class rt {
  get _$AU() {
    return this._$AM?._$AU ?? this._$Cv;
  }
  constructor(t, i, a, s) {
    this.type = 2, this._$AH = x, this._$AN = void 0, this._$AA = t, this._$AB = i, this._$AM = a, this.options = s, this._$Cv = s?.isConnected ?? !0;
  }
  get parentNode() {
    let t = this._$AA.parentNode;
    const i = this._$AM;
    return i !== void 0 && t?.nodeType === 11 && (t = i.parentNode), t;
  }
  get startNode() {
    return this._$AA;
  }
  get endNode() {
    return this._$AB;
  }
  _$AI(t, i = this) {
    t = Q(this, t, i), et(t) ? t === x || t == null || t === "" ? (this._$AH !== x && this._$AR(), this._$AH = x) : t !== this._$AH && t !== Z && this._(t) : t._$litType$ !== void 0 ? this.$(t) : t.nodeType !== void 0 ? this.T(t) : oe(t) ? this.k(t) : this._(t);
  }
  O(t) {
    return this._$AA.parentNode.insertBefore(t, this._$AB);
  }
  T(t) {
    this._$AH !== t && (this._$AR(), this._$AH = this.O(t));
  }
  _(t) {
    this._$AH !== x && et(this._$AH) ? this._$AA.nextSibling.data = t : this.T(U.createTextNode(t)), this._$AH = t;
  }
  $(t) {
    const { values: i, _$litType$: a } = t, s = typeof a == "number" ? this._$AC(t) : (a.el === void 0 && (a.el = st.createElement(Ht(a.h, a.h[0]), this.options)), a);
    if (this._$AH?._$AD === s) this._$AH.p(i);
    else {
      const r = new de(s, this), n = r.u(this.options);
      r.p(i), this.T(n), this._$AH = r;
    }
  }
  _$AC(t) {
    let i = Ot.get(t.strings);
    return i === void 0 && Ot.set(t.strings, i = new st(t)), i;
  }
  k(t) {
    vt(this._$AH) || (this._$AH = [], this._$AR());
    const i = this._$AH;
    let a, s = 0;
    for (const r of t) s === i.length ? i.push(a = new rt(this.O(tt()), this.O(tt()), this, this.options)) : a = i[s], a._$AI(r), s++;
    s < i.length && (this._$AR(a && a._$AB.nextSibling, s), i.length = s);
  }
  _$AR(t = this._$AA.nextSibling, i) {
    for (this._$AP?.(!1, !0, i); t !== this._$AB; ) {
      const a = At(t).nextSibling;
      At(t).remove(), t = a;
    }
  }
  setConnected(t) {
    this._$AM === void 0 && (this._$Cv = t, this._$AP?.(t));
  }
}
class ut {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(t, i, a, s, r) {
    this.type = 1, this._$AH = x, this._$AN = void 0, this.element = t, this.name = i, this._$AM = s, this.options = r, a.length > 2 || a[0] !== "" || a[1] !== "" ? (this._$AH = Array(a.length - 1).fill(new String()), this.strings = a) : this._$AH = x;
  }
  _$AI(t, i = this, a, s) {
    const r = this.strings;
    let n = !1;
    if (r === void 0) t = Q(this, t, i, 0), n = !et(t) || t !== this._$AH && t !== Z, n && (this._$AH = t);
    else {
      const o = t;
      let d, p;
      for (t = r[0], d = 0; d < r.length - 1; d++) p = Q(this, o[a + d], i, d), p === Z && (p = this._$AH[d]), n ||= !et(p) || p !== this._$AH[d], p === x ? t = x : t !== x && (t += (p ?? "") + r[d + 1]), this._$AH[d] = p;
    }
    n && !s && this.j(t);
  }
  j(t) {
    t === x ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, t ?? "");
  }
}
class pe extends ut {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(t) {
    this.element[this.name] = t === x ? void 0 : t;
  }
}
class ce extends ut {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(t) {
    this.element.toggleAttribute(this.name, !!t && t !== x);
  }
}
class ue extends ut {
  constructor(t, i, a, s, r) {
    super(t, i, a, s, r), this.type = 5;
  }
  _$AI(t, i = this) {
    if ((t = Q(this, t, i, 0) ?? x) === Z) return;
    const a = this._$AH, s = t === x && a !== x || t.capture !== a.capture || t.once !== a.once || t.passive !== a.passive, r = t !== x && (a === x || s);
    s && this.element.removeEventListener(this.name, this, a), r && this.element.addEventListener(this.name, this, t), this._$AH = t;
  }
  handleEvent(t) {
    typeof this._$AH == "function" ? this._$AH.call(this.options?.host ?? this.element, t) : this._$AH.handleEvent(t);
  }
}
class he {
  constructor(t, i, a) {
    this.element = t, this.type = 6, this._$AN = void 0, this._$AM = i, this.options = a;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(t) {
    Q(this, t);
  }
}
const ge = yt.litHtmlPolyfillSupport;
ge?.(st, rt), (yt.litHtmlVersions ??= []).push("3.3.3");
const fe = (e, t, i) => {
  const a = i?.renderBefore ?? t;
  let s = a._$litPart$;
  if (s === void 0) {
    const r = i?.renderBefore ?? null;
    a._$litPart$ = s = new rt(t.insertBefore(tt(), r), r, void 0, i ?? {});
  }
  return s._$AI(e), s;
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const _t = globalThis;
class k extends J {
  constructor() {
    super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
  }
  createRenderRoot() {
    const t = super.createRenderRoot();
    return this.renderOptions.renderBefore ??= t.firstChild, t;
  }
  update(t) {
    const i = this.render();
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(t), this._$Do = fe(i, this.renderRoot, this.renderOptions);
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
k._$litElement$ = !0, k.finalized = !0, _t.litElementHydrateSupport?.({ LitElement: k });
const me = _t.litElementPolyfillSupport;
me?.({ LitElement: k });
(_t.litElementVersions ??= []).push("4.2.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const be = { attribute: !0, type: String, converter: dt, reflect: !1, hasChanged: bt }, ye = (e = be, t, i) => {
  const { kind: a, metadata: s } = i;
  let r = globalThis.litPropertyMetadata.get(s);
  if (r === void 0 && globalThis.litPropertyMetadata.set(s, r = /* @__PURE__ */ new Map()), a === "setter" && ((e = Object.create(e)).wrapped = !0), r.set(i.name, e), a === "accessor") {
    const { name: n } = i;
    return { set(o) {
      const d = t.get.call(this);
      t.set.call(this, o), this.requestUpdate(n, d, e, !0, o);
    }, init(o) {
      return o !== void 0 && this.C(n, void 0, e, o), o;
    } };
  }
  if (a === "setter") {
    const { name: n } = i;
    return function(o) {
      const d = this[n];
      t.call(this, o), this.requestUpdate(n, d, e, !0, o);
    };
  }
  throw Error("Unsupported decorator location: " + a);
};
function v(e) {
  return (t, i) => typeof i == "object" ? ye(e, t, i) : ((a, s, r) => {
    const n = s.hasOwnProperty(r);
    return s.constructor.createProperty(r, a), n ? Object.getOwnPropertyDescriptor(s, r) : void 0;
  })(e, t, i);
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function u(e) {
  return v({ ...e, state: !0, attribute: !1 });
}
function P(e) {
  return (t) => (typeof customElements < "u" && !customElements.get(e) && customElements.define(e, t), t);
}
const ht = O`
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
`, ve = "fuzzy_system/systems/list", _e = "fuzzy_system/systems/get", xe = "fuzzy_system/systems/save", $e = "fuzzy_system/systems/delete", we = "fuzzy_system/simulate", ze = "fuzzy_system/templates/list", Se = "fuzzy_system/templates/instantiate";
async function Vt(e) {
  const t = await e.callWS({
    type: ve
  });
  return Array.isArray(t) ? t : t.systems || [];
}
async function Rt(e, t) {
  const i = await e.callWS({
    type: _e,
    ...t
  });
  return i.system || i.config;
}
async function ke(e, t, i) {
  return e.callWS({
    type: xe,
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
    entry_id: i
  });
}
async function Ae(e, t) {
  return e.callWS({
    type: $e,
    entry_id: t
  });
}
async function Ut(e) {
  return (await e.callWS({
    type: ze
  })).templates || [];
}
async function qt(e, t, i, a) {
  return e.callWS({
    type: Se,
    template_id: t,
    system_id: i,
    name: a
  });
}
async function Bt(e, t, i) {
  const a = await e.callWS({
    type: we,
    system_config: t,
    inputs: i
  }), s = a?.results || a;
  if (!s) return {};
  if (s.defuzzified_values) {
    const r = {}, n = Object.keys(t.outputs || {});
    for (const o of n) {
      const d = s.aggregated_sets?.[o] || [];
      let p = s.universes?.[o] || [];
      if ((!p || p.length === 0) && d.length > 0) {
        const c = t.outputs[o]?.range || [0, 100], g = (c[1] - c[0]) / (d.length - 1 || 1);
        p = Array.from({ length: d.length }, (f, y) => c[0] + y * g);
      }
      r[o] = {
        defuzzified_value: s.defuzzified_values[o],
        dominant_term: s.dominant_terms?.[o] || "",
        term_activations: s.term_activations?.[o] || {},
        term_memberships: s.term_memberships?.[o] || {},
        rule_strengths: s.rule_strengths || [],
        universe: p,
        aggregated_set: d
      };
    }
    return r;
  }
  return s;
}
const Ce = "fuzzy_system/dashboard/generate_card", Ee = "fuzzy_system/dashboard/add_card";
async function Wt(e, t) {
  return e.callWS({
    type: Ce,
    ...t
  });
}
async function Gt(e, t) {
  return e.callWS({
    type: Ee,
    ...t
  });
}
let jt = !1, z = null;
function Ie(e) {
  if (z = e, jt) return;
  jt = !0;
  const t = [
    {
      name: "list_fuzzy_systems",
      description: "List all configured fuzzy systems (both YAML and UI entries) with variable names and rule counts.",
      readOnlyHint: !0,
      handler: async () => {
        const s = z?.getHass();
        if (!s) throw new Error("Home Assistant connection not ready");
        return Vt(s);
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
        const r = z?.getHass();
        if (!r) throw new Error("Home Assistant connection not ready");
        return Rt(r, { system_id: s.system_id });
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
        const r = z?.getHass();
        if (!r) throw new Error("Home Assistant connection not ready");
        const n = await Rt(r, { system_id: s.system_id });
        return Bt(r, n, s.inputs);
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
        const r = z?.getHass();
        if (!r) throw new Error("Home Assistant connection not ready");
        return Wt(r, s);
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
        const r = z?.getHass();
        if (!r) throw new Error("Home Assistant connection not ready");
        return Gt(r, s);
      }
    },
    {
      name: "list_starter_templates",
      description: "Discover all pre-built starter templates in the fuzzy system library.",
      readOnlyHint: !0,
      handler: async () => {
        const s = z?.getHass();
        if (!s) throw new Error("Home Assistant connection not ready");
        return Ut(s);
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
        const r = z?.getHass();
        if (!r) throw new Error("Home Assistant connection not ready");
        const n = await qt(r, s.template_id, s.system_id, s.name);
        return z?.openSystemInEditor && n.system && z.openSystemInEditor(n.system), n;
      }
    },
    {
      name: "get_active_editor_system",
      description: "Returns the fuzzy system configuration currently open and active in the workbench editor.",
      readOnlyHint: !0,
      handler: () => {
        const s = z?.getActiveConfig?.();
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
        if (!z?.updateActiveConfig)
          return { error: "Active editor is not available." };
        let r = !1;
        return z.updateActiveConfig((n) => {
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
      handler: (s) => z?.updateActiveConfig ? (z.updateActiveConfig((r) => {
        const n = JSON.parse(JSON.stringify(r));
        return n.rules = [...n.rules || [], s.rule], n;
      }), { success: !0, message: `Added rule: '${s.rule}'` }) : { error: "Active editor is not available." }
    }
  ], i = typeof navigator < "u" && navigator.modelContext || typeof document < "u" && document.modelContext || typeof window < "u" && window.modelContext;
  if (i && typeof i.provideContext == "function")
    try {
      i.provideContext({
        tools: t.map((s) => ({
          name: s.name,
          description: s.description,
          parameters: s.parameters,
          readOnlyHint: s.readOnlyHint,
          consequentialHint: s.consequentialHint,
          handler: s.handler
        }))
      }), console.log("[FuzzySystem] Registered", t.length, "tools with WebMCP");
    } catch (s) {
      console.warn("[FuzzySystem] Failed to register with WebMCP context:", s);
    }
  const a = {
    tools: t.map((s) => ({ name: s.name, description: s.description }))
  };
  for (const s of t)
    a[s.name] = s.handler;
  window.fuzzySystemMCP = a, window.addEventListener("message", async (s) => {
    if (s.data?.type === "fuzzy_system:mcp_call") {
      const { id: r, tool: n, args: o } = s.data, d = t.find((p) => p.name === n);
      if (!d) {
        window.postMessage({ type: "fuzzy_system:mcp_result", id: r, error: `Tool '${n}' not found` }, "*");
        return;
      }
      try {
        const p = await d.handler(o || {});
        window.postMessage({ type: "fuzzy_system:mcp_result", id: r, result: p }, "*");
      } catch (p) {
        window.postMessage({ type: "fuzzy_system:mcp_result", id: r, error: p?.message || String(p) }, "*");
      }
    }
  });
}
var Te = Object.defineProperty, Me = Object.getOwnPropertyDescriptor, L = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? Me(t, i) : t, r = e.length - 1, n; r >= 0; r--)
    (n = e[r]) && (s = (a ? n(t, i, s) : n(s)) || s);
  return a && s && Te(t, i, s), s;
};
let I = class extends k {
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
    const e = this.universe[0], t = this.universe[this.universe.length - 1], i = t - e || 1, a = 640, s = 190, r = 36, n = 24, o = 20, d = 28, p = a - r - n, c = s - o - d, h = (S) => r + (S - e) / i * p, g = (S) => o + (1 - Math.max(0, Math.min(1, S))) * c, f = this.aggregatedSet || [], y = [], w = Math.max(1, Math.floor(this.universe.length / 140));
    for (let S = 0; S < this.universe.length; S += w) {
      const C = this.universe[S], E = f[S] ?? 0;
      y.push([h(C), g(E)]);
    }
    const B = this.universe.length - 1;
    y.push([h(this.universe[B]), g(f[B] ?? 0)]);
    const M = y.reduce(
      (S, [C, E], G) => G === 0 ? `M ${C} ${E}` : `${S} L ${C} ${E}`,
      ""
    ), D = `${M} L ${r + p} ${o + c} L ${r} ${o + c} Z`, W = this.defuzzifiedValue !== void 0 && !isNaN(this.defuzzifiedValue), j = W ? h(Math.max(e, Math.min(t, this.defuzzifiedValue))) : 0;
    return l`
      <div class="graph-card">
        <div class="graph-header">
          <div class="graph-title">
            <span>📈</span>
            <span>${this.outputName || "Aggregated Output Distribution"}</span>
          </div>
          <div class="header-badges">
            ${this.dominantTerm ? l`<span class="badge-dominant">Dominant: ${this.dominantTerm}</span>` : ""}
            ${W ? l`
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
          <line class="grid-line" x1=${r} y1=${g(0.5)} x2=${r + p} y2=${g(0.5)} />
          <line class="grid-line" x1=${r} y1=${g(1)} x2=${r + p} y2=${g(1)} />

          <!-- Axes -->
          <line class="axis-line" x1=${r} y1=${o} x2=${r} y2=${o + c} />
          <line class="axis-line" x1=${r} y1=${o + c} x2=${r + p} y2=${o + c} />

          <!-- Y-axis labels -->
          <text class="axis-text" x=${r - 6} y=${g(1) + 3} text-anchor="end">1.0</text>
          <text class="axis-text" x=${r - 6} y=${g(0.5) + 3} text-anchor="end">0.5</text>
          <text class="axis-text" x=${r - 6} y=${g(0) + 3} text-anchor="end">0.0</text>

          <!-- X-axis labels -->
          <text class="axis-text" x=${r} y=${s - 10} text-anchor="start">${e.toFixed(0)}</text>
          <text class="axis-text" x=${r + p / 2} y=${s - 10} text-anchor="middle">
            ${(e + i / 2).toFixed(1)}
          </text>
          <text class="axis-text" x=${r + p} y=${s - 10} text-anchor="end">
            ${t.toFixed(0)} ${this.unit}
          </text>

          <!-- Aggregated Fuzzy Set Area & Stroke -->
          <path d=${D} fill="url(#aggGradient)" />
          <path d=${M} fill="none" stroke="#38bdf8" stroke-width="2.2" stroke-linecap="round" />

          <!-- Defuzzified Crisp Slice Line -->
          ${W ? Y`
                <g>
                  <line
                    class="defuzz-line"
                    x1=${j}
                    y1=${o}
                    x2=${j}
                    y2=${o + c}
                  />
                  <circle class="pulse-marker" cx=${j} cy=${o + c} r="4.5" />
                  <rect
                    x=${Math.min(r + p - 90, Math.max(r, j - 45))}
                    y=${o - 18}
                    width="90"
                    height="18"
                    rx="4"
                    fill="#0284c7"
                  />
                  <text
                    x=${Math.min(r + p - 45, Math.max(r + 45, j))}
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
              ` : Y``}
        </svg>
      </div>
    `;
  }
};
I.styles = O`
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
L([
  v({ type: Array })
], I.prototype, "universe", 2);
L([
  v({ type: Array })
], I.prototype, "aggregatedSet", 2);
L([
  v({ type: Number })
], I.prototype, "defuzzifiedValue", 2);
L([
  v({ type: String })
], I.prototype, "defuzzifier", 2);
L([
  v({ type: String })
], I.prototype, "dominantTerm", 2);
L([
  v({ type: String })
], I.prototype, "unit", 2);
L([
  v({ type: String })
], I.prototype, "outputName", 2);
I = L([
  P("fuzzy-aggregated-graph")
], I);
var Oe = Object.defineProperty, Re = Object.getOwnPropertyDescriptor, $ = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? Re(t, i) : t, r = e.length - 1, n; r >= 0; r--)
    (n = e[r]) && (s = (a ? n(t, i, s) : n(s)) || s);
  return a && s && Oe(t, i, s), s;
};
let _ = class extends k {
  constructor() {
    super(...arguments), this._systems = [], this._searchQuery = "", this._loading = !1, this._error = "", this._showTemplateModal = !1, this._expandedWaveforms = {}, this._dashboardViewTitle = "Fuzzy Systems", this._dashboardCardTitle = "", this._dashboardShowGraph = !0, this._dashboardShowInputs = !0, this._dashboardShowRules = !0, this._dashboardStatusMsg = "", this._dashboardIsError = !1, this._dashboardLoading = !1;
  }
  _openDashboardModal(e) {
    this._dashboardModalSystem = e, this._dashboardCardTitle = e.name || e.system_id, this._dashboardStatusMsg = "", this._dashboardIsError = !1, this._dashboardLoading = !1;
  }
  async _handleAddToDashboard() {
    if (!(!this.hass || !this._dashboardModalSystem)) {
      this._dashboardLoading = !0, this._dashboardStatusMsg = "";
      try {
        const e = await Gt(this.hass, {
          system_id: this._dashboardModalSystem.system_id,
          view_title: this._dashboardViewTitle || null,
          card_title: this._dashboardCardTitle || void 0,
          show_graph: this._dashboardShowGraph,
          show_inputs: this._dashboardShowInputs,
          show_rules: this._dashboardShowRules
        });
        e.success ? (this._dashboardStatusMsg = `Added to Lovelace view "${e.view || "default"}"!`, this._dashboardIsError = !1, setTimeout(() => {
          this._dashboardModalSystem = void 0;
        }, 1500)) : (this._dashboardStatusMsg = e.error || "Dashboard is in YAML mode. Use 'Copy YAML' below.", this._dashboardIsError = !0);
      } catch (e) {
        this._dashboardStatusMsg = e.message || "Failed to add card to dashboard.", this._dashboardIsError = !0;
      } finally {
        this._dashboardLoading = !1;
      }
    }
  }
  async _handleCopyCardYaml() {
    if (!(!this.hass || !this._dashboardModalSystem))
      try {
        const e = await Wt(this.hass, {
          system_id: this._dashboardModalSystem.system_id,
          title: this._dashboardCardTitle || void 0,
          show_graph: this._dashboardShowGraph,
          show_inputs: this._dashboardShowInputs,
          show_rules: this._dashboardShowRules
        });
        await navigator.clipboard.writeText(e.yaml), this._dashboardStatusMsg = "Card YAML copied to clipboard!", this._dashboardIsError = !1;
      } catch (e) {
        this._dashboardStatusMsg = "Could not copy YAML: " + (e.message || String(e)), this._dashboardIsError = !0;
      }
  }
  _toggleWaveform(e, t) {
    const i = `${e}_${t}`;
    this._expandedWaveforms = {
      ...this._expandedWaveforms,
      [i]: !this._expandedWaveforms[i]
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
        this._systems = await Vt(this.hass);
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
        await Ae(this.hass, e.entry_id), await this.refresh();
      } catch (t) {
        alert(t.message || "Failed to delete system");
      }
  }
  _findOutputSensor(e, t) {
    if (!this.hass?.states) return null;
    const i = e.toLowerCase(), a = t.toLowerCase(), s = [
      `sensor.fuzzy_${i}_${a}`,
      `sensor.${i}_${a}`,
      `sensor.fuzzy_${a}`
    ];
    for (const r of s)
      if (this.hass.states[r])
        return { entityId: r, stateObj: this.hass.states[r] };
    for (const [r, n] of Object.entries(this.hass.states)) {
      if (!r.startsWith("sensor.") || r.endsWith("_set") || r.endsWith("_status")) continue;
      if ((n.attributes || {}).system === e && (r.endsWith(`_${a}`) || r.includes(a)))
        return { entityId: r, stateObj: n };
    }
    return null;
  }
  _getInputsStatus(e) {
    const t = e.config?.inputs || {}, i = Object.keys(t).length;
    let a = 0;
    for (const s of Object.values(t))
      s.entity_id && s.entity_id.trim() && a++;
    return { total: i, bound: a };
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
    const t = e.config?.outputs || {}, i = Object.keys(t);
    if (i.length === 0) return l``;
    const a = this._getInputsStatus(e);
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
      const r = this._findOutputSensor(e.system_id, s), n = t[s] || {}, o = r?.stateObj?.attributes?.unit_of_measurement || n.unit_of_measurement || "", d = r?.stateObj?.attributes?.dominant_term, p = r?.stateObj?.state, c = p !== void 0 && p !== "unknown" && p !== "unavailable" && !isNaN(parseFloat(p)), h = !!this._expandedWaveforms[`${e.system_id}_${s}`];
      if (r && c) {
        const g = parseFloat(p).toFixed(1);
        return l`
                <div style="display: inline-flex; align-items: center; gap: 4px;">
                  <button
                    class="output-badge live-active"
                    @click=${(f) => this._openMoreInfo(r.entityId, f)}
                    title="Entity: ${r.entityId} — Click to view Home Assistant history graph and diagnostic attributes"
                  >
                    <span class="pulse-dot"></span>
                    <span class="output-name">${s}:</span>
                    <span class="output-value">${g}${o ? ` ${o}` : ""}</span>
                    ${d ? l`<span class="dominant-term">(${d})</span>` : ""}
                  </button>
                  <button
                    class="btn btn-secondary"
                    style="padding: 2px 7px; font-size: 11px; border-radius: 9999px; height: 26px; line-height: 1;"
                    title="${h ? "Hide live waveform graph" : "View live aggregated fuzzy set waveform"}"
                    @click=${(f) => {
          f.stopPropagation(), this._toggleWaveform(e.system_id, s);
        }}
                  >
                    📈 ${h ? "Hide" : "Graph"}
                  </button>
                </div>
              `;
      }
      return l`
              <div
                class="output-badge live-idle"
                title="${r ? `Entity: ${r.entityId} (State: ${p})` : "Sensor entity not yet registered in Home Assistant"}"
              >
                <span class="idle-dot"></span>
                <span class="output-name">${s}:</span>
                <span class="output-value" style="color: var(--fuzzy-text-secondary);">
                  ${p === "unavailable" ? "Unavailable" : "Awaiting inputs"}
                </span>
              </div>
            `;
    })}
        </div>

        ${i.map((s) => {
      if (!this._expandedWaveforms[`${e.system_id}_${s}`]) return "";
      const r = this._findOutputSensor(e.system_id, s), n = t[s] || {}, o = r?.stateObj?.attributes?.unit_of_measurement || n.unit_of_measurement || "", d = r?.stateObj?.attributes?.universe || [], p = r?.stateObj?.attributes?.aggregated_set || [], c = r?.stateObj?.state, h = c !== void 0 && !isNaN(parseFloat(c)), g = r?.stateObj?.attributes?.dominant_term || "";
      return l`
            <div style="margin-top: 12px;">
              <fuzzy-aggregated-graph
                .universe=${d}
                .aggregatedSet=${p}
                .defuzzifiedValue=${h ? parseFloat(c) : void 0}
                .defuzzifier=${e.defuzzifier}
                .dominantTerm=${g}
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
    const e = this._filteredSystems();
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

      ${this._error ? l`<div style="color: var(--fuzzy-danger); margin-bottom: 16px;">${this._error}</div>` : ""}

      ${e.length === 0 && !this._loading ? l`
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
              ${e.map(
      (t) => l`
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

                    ${t.description ? l`<p class="subtitle" style="margin-bottom: 12px;">${t.description}</p>` : ""}

                    <div class="card-badges">
                      <span class="badge ${t.inference === "sugeno" ? "badge-amber" : "badge-cyan"}">
                        ${t.inference}
                      </span>
                      <span class="badge" style="background: var(--secondary-background-color, rgba(125,125,125,0.15)); border: 1px solid var(--divider-color, rgba(125,125,125,0.25)); color: var(--primary-text-color);">
                        ${t.defuzzifier}
                      </span>
                      ${t.max_updates_per_period ? l`<span class="badge badge-emerald" title="Rate limiter budget">
                            ⏱️ ${t.max_updates_per_period} / ${t.update_period}s
                          </span>` : ""}
                    </div>

                    ${this._renderLiveOutputs(t)}

                    <div class="card-metrics">
                      <span class="chip">${t.input_count} inputs</span>
                      <span class="chip">${t.output_count} outputs</span>
                      <span class="chip">${t.rule_count} rules</span>
                      ${t.epsilon !== void 0 ? l`<span class="chip">ε = ${t.epsilon}</span>` : ""}
                    </div>

                    <div class="card-actions">
                      <button class="btn btn-secondary" @click=${() => this._handleEdit(t)}>
                        ${t.source === "yaml" ? "Inspect" : "Edit"}
                      </button>
                      <button
                        class="btn btn-secondary"
                        style="color: var(--fuzzy-accent);"
                        title="Add custom:fuzzy-system-card for this controller to a Lovelace dashboard"
                        @click=${() => this._openDashboardModal(t)}
                      >
                        📊 Add Card
                      </button>
                      ${t.source === "config_entry" ? l`
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

      ${this._dashboardModalSystem ? l`
            <div
              class="modal-overlay"
              @click=${(t) => t.target === t.currentTarget && (this._dashboardModalSystem = void 0)}
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
                    @input=${(t) => this._dashboardCardTitle = t.target.value}
                    placeholder="e.g. Living Room Fan Control"
                  />
                </div>

                <div class="form-group" style="margin-bottom: 14px;">
                  <label class="form-label">Target View Title</label>
                  <input
                    class="input-text"
                    type="text"
                    .value=${this._dashboardViewTitle}
                    @input=${(t) => this._dashboardViewTitle = t.target.value}
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
                      @change=${(t) => this._dashboardShowGraph = t.target.checked}
                    />
                    <span>Show live aggregated output waveform graph</span>
                  </label>
                  <label style="display: flex; align-items: center; gap: 8px; cursor: pointer; font-size: 13px;">
                    <input
                      type="checkbox"
                      .checked=${this._dashboardShowInputs}
                      @change=${(t) => this._dashboardShowInputs = t.target.checked}
                    />
                    <span>Show live antecedent input sensors</span>
                  </label>
                  <label style="display: flex; align-items: center; gap: 8px; cursor: pointer; font-size: 13px;">
                    <input
                      type="checkbox"
                      .checked=${this._dashboardShowRules}
                      @change=${(t) => this._dashboardShowRules = t.target.checked}
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
_.styles = [
  ht,
  O`
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
$([
  v({ attribute: !1 })
], _.prototype, "hass", 2);
$([
  u()
], _.prototype, "_systems", 2);
$([
  u()
], _.prototype, "_searchQuery", 2);
$([
  u()
], _.prototype, "_loading", 2);
$([
  u()
], _.prototype, "_error", 2);
$([
  u()
], _.prototype, "_showTemplateModal", 2);
$([
  u()
], _.prototype, "_expandedWaveforms", 2);
$([
  u()
], _.prototype, "_dashboardModalSystem", 2);
$([
  u()
], _.prototype, "_dashboardViewTitle", 2);
$([
  u()
], _.prototype, "_dashboardCardTitle", 2);
$([
  u()
], _.prototype, "_dashboardShowGraph", 2);
$([
  u()
], _.prototype, "_dashboardShowInputs", 2);
$([
  u()
], _.prototype, "_dashboardShowRules", 2);
$([
  u()
], _.prototype, "_dashboardStatusMsg", 2);
$([
  u()
], _.prototype, "_dashboardIsError", 2);
$([
  u()
], _.prototype, "_dashboardLoading", 2);
_ = $([
  P("fuzzy-system-catalog")
], _);
var je = Object.defineProperty, Ne = Object.getOwnPropertyDescriptor, nt = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? Ne(t, i) : t, r = e.length - 1, n; r >= 0; r--)
    (n = e[r]) && (s = (a ? n(t, i, s) : n(s)) || s);
  return a && s && je(t, i, s), s;
};
function Jt(e, t, i, a) {
  switch (e.toLowerCase()) {
    case "trimf": {
      const [s, r, n] = t;
      return i <= s || i >= n ? 0 : i === r ? 1 : i < r ? (i - s) / (r - s || 1e-6) : (n - i) / (n - r || 1e-6);
    }
    case "trapmf": {
      const [s, r, n, o] = t;
      return i <= s || i >= o ? 0 : i >= r && i <= n ? 1 : i < r ? (i - s) / (r - s || 1e-6) : (o - i) / (o - n || 1e-6);
    }
    case "gaussmf": {
      const [s, r] = t, n = r || 1;
      return Math.exp(-0.5 * Math.pow((i - s) / n, 2));
    }
    case "sigmf": {
      const [s, r] = t;
      return 1 / (1 + Math.exp(-s * (i - r)));
    }
    case "gbellmf": {
      const [s, r, n] = t;
      return 1 / (1 + Math.pow(Math.abs((i - n) / (s || 1e-6)), 2 * (r || 1)));
    }
    case "singleton":
    case "constant": {
      const [s] = t, r = (a || 100) * 0.015;
      return Math.abs(i - s) <= r ? 1 : 0;
    }
    default:
      return 0;
  }
}
const ot = [
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
let q = class extends k {
  constructor() {
    super(...arguments), this.range = [0, 100], this.terms = {};
  }
  render() {
    const e = Number.isFinite(this.range[0]) ? this.range[0] : 0, t = Number.isFinite(this.range[1]) && this.range[1] > e ? this.range[1] : e + 100, i = t - e || 1, a = 600, s = 180, r = 36, n = 24, o = 16, d = 28, p = a - r - n, c = s - o - d, h = (w) => r + (w - e) / i * p, g = (w) => o + (1 - Math.max(0, Math.min(1, w))) * c, f = Object.keys(this.terms || {}), y = 120;
    return l`
      <div class="canvas-container">
        <svg viewBox="0 0 ${a} ${s}" preserveAspectRatio="xMidYMid meet">
          <!-- Horizontal Grid lines at mu = 0.0, 0.5, 1.0 -->
          <line class="grid-line" x1=${r} y1=${g(0.5)} x2=${r + p} y2=${g(0.5)} />
          <line class="grid-line" x1=${r} y1=${g(1)} x2=${r + p} y2=${g(1)} />

          <!-- Axes -->
          <line class="axis-line" x1=${r} y1=${o} x2=${r} y2=${o + c} />
          <line class="axis-line" x1=${r} y1=${o + c} x2=${r + p} y2=${o + c} />

          <!-- Y-axis tick labels -->
          <text class="axis-text" x=${r - 6} y=${g(1) + 3} text-anchor="end">1.0</text>
          <text class="axis-text" x=${r - 6} y=${g(0.5) + 3} text-anchor="end">0.5</text>
          <text class="axis-text" x=${r - 6} y=${g(0) + 3} text-anchor="end">0.0</text>

          <!-- X-axis tick labels -->
          <text class="axis-text" x=${r} y=${s - 10} text-anchor="start">${e}</text>
          <text class="axis-text" x=${r + p / 2} y=${s - 10} text-anchor="middle">
            ${(e + i / 2).toFixed(1)}
          </text>
          <text class="axis-text" x=${r + p} y=${s - 10} text-anchor="end">
            ${t} ${this.unit || ""}
          </text>

          <!-- Curves for each membership term -->
          ${f.map((w, B) => {
      const M = this.terms[w];
      if (!M || !M.params) return Y``;
      const D = ot[B % ot.length], W = [];
      for (let C = 0; C <= y; C++) {
        const E = e + C / y * i, G = Jt(M.type, M.params, E, i);
        W.push([h(E), g(G)]);
      }
      const j = W.reduce(
        (C, [E, G], Yt) => Yt === 0 ? `M ${E} ${G}` : `${C} L ${E} ${G}`,
        ""
      ), S = `${j} L ${r + p} ${o + c} L ${r} ${o + c} Z`;
      return Y`
              <g>
                <path class="curve-fill" d=${S} fill=${D.fill} />
                <path class="curve-path" d=${j} fill="none" stroke=${D.stroke} />
              </g>
            `;
    })}

          <!-- Current Value Marker (if provided) -->
          ${this.currentValue !== void 0 && !isNaN(this.currentValue) ? (() => {
      const w = h(Math.max(e, Math.min(t, this.currentValue)));
      return Y`
                  <g>
                    <line
                      class="current-val-line"
                      x1=${w}
                      y1=${o}
                      x2=${w}
                      y2=${o + c}
                    />
                    <circle cx=${w} cy=${o + c} r="4" fill="#f43f5e" />
                    <text
                      class="axis-text"
                      x=${w}
                      y=${o - 4}
                      text-anchor="middle"
                      fill="#f43f5e"
                      font-weight="700"
                    >
                      ${this.currentValue.toFixed(1)}${this.unit ? ` ${this.unit}` : ""}
                    </text>
                  </g>
                `;
    })() : Y``}
        </svg>

        <!-- Color Legend -->
        <div class="legend-row">
          ${f.map((w, B) => {
      const M = this.terms[w], D = ot[B % ot.length];
      return l`
              <div class="legend-item" style="color: ${D.stroke};">
                <span class="legend-swatch" style="background: ${D.stroke};"></span>
                <span>${w}</span>
                <span style="opacity: 0.6; font-size: 10px;">(${M.type})</span>
              </div>
            `;
    })}
        </div>
      </div>
    `;
  }
};
q.styles = O`
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
nt([
  v({ type: Array })
], q.prototype, "range", 2);
nt([
  v({ type: Object })
], q.prototype, "terms", 2);
nt([
  v({ type: Number })
], q.prototype, "currentValue", 2);
nt([
  v({ type: String })
], q.prototype, "unit", 2);
q = nt([
  P("fuzzy-curve-canvas")
], q);
var Pe = Object.defineProperty, Le = Object.getOwnPropertyDescriptor, b = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? Le(t, i) : t, r = e.length - 1, n; r >= 0; r--)
    (n = e[r]) && (s = (a ? n(t, i, s) : n(s)) || s);
  return a && s && Pe(t, i, s), s;
};
let m = class extends k {
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
    for (const [i, a] of Object.entries(this._config?.inputs || {})) {
      const s = Number.isFinite(a.range?.[0]) ? a.range[0] : 0, r = Number.isFinite(a.range?.[1]) && a.range[1] > s ? a.range[1] : s + 100, n = this._simInputs[i];
      if (!e && n !== void 0 && n >= s && n <= r)
        t[i] = n;
      else if (a.entity_id && this.hass?.states?.[a.entity_id]) {
        const o = parseFloat(this.hass.states[a.entity_id].state);
        t[i] = isNaN(o) ? (s + r) / 2 : o;
      } else a.default !== void 0 ? t[i] = a.default : t[i] = (s + r) / 2;
    }
    this._simInputs = t;
  }
  _syncSimWithLiveHass() {
    const e = { ...this._simInputs };
    for (const [t, i] of Object.entries(this._config.inputs || {}))
      if (i.entity_id && this.hass?.states?.[i.entity_id]) {
        const a = parseFloat(this.hass.states[i.entity_id].state);
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
        const e = await Bt(this.hass, this._config, this._simInputs);
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
    const i = `sensor.fuzzy_${this._config.system_id.toLowerCase()}_${e.toLowerCase()}`;
    return this.hass.states[i] || null;
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
      const e = await ke(this.hass, this._config, this.entryId);
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
    const i = this.hass?.states ? this.hass.states[e] : null;
    if (i?.attributes) {
      const a = i.attributes.unit_of_measurement;
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
    const t = Number.isFinite(this._newInputMin) ? this._newInputMin : 0, i = Number.isFinite(this._newInputMax) && this._newInputMax > t ? this._newInputMax : t + 100, a = i - t;
    let s;
    this._newInputTermsPreset === "5_terms" ? s = {
      very_low: { type: "trapmf", params: [t, t, t + a * 0.15, t + a * 0.3] },
      low: { type: "trimf", params: [t + a * 0.15, t + a * 0.35, t + a * 0.55] },
      medium: { type: "trimf", params: [t + a * 0.35, t + a * 0.5, t + a * 0.65] },
      high: { type: "trimf", params: [t + a * 0.45, t + a * 0.65, t + a * 0.85] },
      very_high: { type: "trapmf", params: [t + a * 0.7, t + a * 0.85, i, i] }
    } : s = {
      low: { type: "trapmf", params: [t, t, t + a * 0.25, t + a * 0.5] },
      medium: { type: "trimf", params: [t + a * 0.25, t + a * 0.5, t + a * 0.75] },
      high: { type: "trapmf", params: [t + a * 0.5, t + a * 0.75, i, i] }
    }, this._config.inputs || (this._config.inputs = {}), this._config.inputs[e] = {
      entity_id: this._newInputEntityId || "",
      range: [t, i],
      resolution: 100,
      default: t,
      terms: s
    }, this._showAddInputModal = !1, this.requestUpdate();
  }
  _getAvailableEntities() {
    if (!this.hass?.states) return [];
    const e = [];
    for (const [t, i] of Object.entries(this.hass.states)) {
      const a = t.split(".")[0];
      (a === "sensor" || a === "input_number" || a === "number" || a === "climate" || a === "weather") && e.push({
        entity_id: t,
        friendly_name: i.attributes?.friendly_name || t,
        unit: i.attributes?.unit_of_measurement || "",
        state: i.state
      });
    }
    return e.sort((t, i) => t.friendly_name.localeCompare(i.friendly_name)), e;
  }
  _renderEntityPicker(e, t, i) {
    const a = !!customElements.get("ha-entity-picker"), s = this._getAvailableEntities();
    return a ? l`
        <ha-entity-picker
          .hass=${this.hass}
          .value=${e || ""}
          ?disabled=${t}
          .includeDomains=${["sensor", "input_number", "number", "climate", "weather"]}
          @value-changed=${(r) => i(r.detail.value || "")}
        ></ha-entity-picker>
      ` : l`
      <div style="position: relative;">
        <input
          class="input-text"
          type="text"
          list="ha-fuzzy-entities"
          .value=${e || ""}
          ?disabled=${t}
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
  _renderEntityStatusTag(e) {
    if (!e || !e.trim())
      return l`
        <span class="badge badge-amber" title="This variable has no live sensor bound yet">
          ⚠️ Unbound (Add entity to track live values)
        </span>
      `;
    const t = this.hass?.states ? this.hass.states[e] : null;
    if (!t)
      return l`
        <span class="badge" style="background: rgba(239,68,68,0.15); color: #f87171;">
          ❓ ${e} (Not found in HA)
        </span>
      `;
    const i = t.attributes?.unit_of_measurement || "";
    return l`
      <span class="badge badge-emerald" title="Live sensor state in Home Assistant">
        🟢 Live: ${t.state} ${i}
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
    const i = t[1].trim(), s = t[2].trim().match(/^([a-zA-Z0-9_]+)\s*(?:IS|=)\s*(.+)$/i);
    if (!s) return null;
    const r = s[1].trim(), n = s[2].trim(), o = parseFloat(n), d = !isNaN(o) && isFinite(o) && !n.match(/[a-zA-Z]/), p = i.split(/\s+(AND|OR)\s+/i), c = [];
    let h = "AND";
    for (let g = 0; g < p.length; g++) {
      const f = p[g].trim();
      if (!f) continue;
      if (f.toUpperCase() === "AND") {
        h = "AND";
        continue;
      }
      if (f.toUpperCase() === "OR") {
        h = "OR";
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
        connector: c.length === 0 ? "AND" : h
      });
    }
    return c.length === 0 ? null : {
      conditions: c,
      consequent: {
        variable: r,
        term: d ? "" : n,
        isConstant: d,
        constantValue: d ? o : 0
      }
    };
  }
  _compileRuleString(e, t) {
    const i = [];
    e.forEach((r, n) => {
      const o = r.hedge ? `${r.hedge} ` : "", d = `${r.variable} IS ${o}${r.term}`;
      n === 0 ? i.push(d) : i.push(`${r.connector} ${d}`);
    });
    const a = i.join(" "), s = t.isConstant ? `${t.variable} IS ${t.constantValue}` : `${t.variable} IS ${t.term}`;
    return `IF ${a} THEN ${s}`;
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
    const i = e[0], a = Object.keys(this._config.inputs[i]?.terms || {}), s = t[0], r = Object.keys(this._config.outputs[s]?.terms || {});
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
  _openEditRuleBuilder(e) {
    this._ruleBuilderError = "";
    const t = this._config.rules[e] || "", i = this._parseRuleToBuilder(t);
    if (i)
      this._editingRuleIndex = e, this._builderConditions = i.conditions, this._builderConsequent = i.consequent, this._showRuleBuilderModal = !0;
    else {
      const a = Object.keys(this._config.inputs || {}), s = Object.keys(this._config.outputs || {}), r = a[0] || "", n = Object.keys(this._config.inputs[r]?.terms || {}), o = s[0] || "", d = Object.keys(this._config.outputs[o]?.terms || {});
      this._editingRuleIndex = e, this._builderConditions = [
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
      }, this._ruleBuilderError = `Notice: Rule #${e + 1} uses non-standard formatting. Configuring it here will format it as canonical syntax.`, this._showRuleBuilderModal = !0;
    }
  }
  _onBuilderConditionVarChange(e, t) {
    const i = Object.keys(this._config.inputs[t]?.terms || {});
    this._builderConditions[e].variable = t, this._builderConditions[e].term = i[0] || "", this.requestUpdate();
  }
  _onBuilderConsequentVarChange(e) {
    const t = Object.keys(this._config.outputs[e]?.terms || {});
    this._builderConsequent.variable = e, this._builderConsequent.isConstant || (this._builderConsequent.term = t[0] || ""), this.requestUpdate();
  }
  _addBuilderCondition(e = "AND") {
    const i = Object.keys(this._config.inputs || {})[0] || "", a = Object.keys(this._config.inputs[i]?.terms || {});
    this._builderConditions.push({
      variable: i,
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
    if (!this._config) return l``;
    const e = this.source === "yaml";
    return l`
      <div class="header-actions">
        <div>
          <button class="btn btn-secondary" @click=${this._handleBack}>
            ← Back to Catalog
          </button>
        </div>

        <div style="display: flex; gap: 10px; align-items: center;">
          ${this._saving ? l`<span class="chip">Saving...</span>` : ""}
          ${e ? "" : l`
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

      ${e ? l`
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

        ${this._renderActiveTab(e)}
      </div>

      ${this._showAddInputModal ? this._renderAddInputModal() : ""}
      ${this._showRuleBuilderModal ? this._renderRuleBuilderModal() : ""}
    `;
  }
  _renderAddInputModal() {
    return l`
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

          ${this._newInputModalError ? l`<div style="color: var(--fuzzy-danger); margin-bottom: 14px; font-size: 13px;">${this._newInputModalError}</div>` : ""}

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
    return l`
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
    const t = this._config.inputs || {}, i = Object.keys(t);
    return l`
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
        <div>
          <h3 class="section-title">Input Antecedents</h3>
          <p class="helper-text">Sensors and numerical inputs mapped to linguistic membership terms</p>
        </div>
        ${e ? "" : l`
              <button class="btn btn-secondary" @click=${this._openAddInputModal}>
                + Add Input Variable
              </button>
            `}
      </div>

      ${i.length === 0 ? l`<p class="subtitle" style="padding: 20px 0;">No input variables defined yet.</p>` : i.map((a) => {
      const s = t[a], r = s.entity_id && this.hass?.states ? this.hass.states[s.entity_id] : null, n = r && !isNaN(parseFloat(r.state)) ? parseFloat(r.state) : void 0, o = r?.attributes?.unit_of_measurement || "";
      return l`
              <div class="section-box">
                <div class="section-header">
                  <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
                    <span class="badge badge-cyan">${a}</span>
                    ${this._renderEntityStatusTag(s.entity_id)}
                    <span class="chip">Range: [${s.range[0]}, ${s.range[1]}]</span>
                  </div>
                  ${e ? "" : l`
                        <button class="btn btn-danger btn-icon" @click=${() => this._removeInput(a)} title="Delete Input">
                          ✕
                        </button>
                      `}
                </div>

                <div class="grid-2">
                  <div class="form-group">
                    <label class="form-label">Bound Home Assistant Sensor Entity</label>
                    ${this._renderEntityPicker(s.entity_id, e, (d) => {
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
                        ?disabled=${e}
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
                        ?disabled=${e}
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

                ${this._renderTermsEditor(s.terms, s.range, e, () => this.requestUpdate())}
              </div>
            `;
    })}
    `;
  }
  _renderOutputsTab(e) {
    const t = this._config.outputs || {}, i = Object.keys(t);
    return l`
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
        <div>
          <h3 class="section-title">Output Consequents</h3>
          <p class="helper-text">Control targets defuzzified and published to Home Assistant sensors</p>
        </div>
        ${e ? "" : l`
              <button class="btn btn-secondary" @click=${this._addOutput}>
                + Add Output Variable
              </button>
            `}
      </div>

      ${i.length === 0 ? l`<p class="subtitle" style="padding: 20px 0;">No output variables defined yet.</p>` : i.map((a) => {
      const s = t[a], r = this._findOutputSensor(a), n = r && !isNaN(parseFloat(r.state)) ? parseFloat(r.state) : void 0;
      return l`
              <div class="section-box">
                <div class="section-header">
                  <div style="display: flex; align-items: center; gap: 8px;">
                    <span class="badge badge-amber">${a}</span>
                    <span class="chip">Range: [${s.range[0]}, ${s.range[1]}]</span>
                    ${s.unit_of_measurement ? l`<span class="chip">${s.unit_of_measurement}</span>` : ""}
                  </div>
                  ${e ? "" : l`
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
                      ?disabled=${e}
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
                      ?disabled=${e}
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
                      ?disabled=${e}
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

                ${this._renderTermsEditor(s.terms, s.range, e, () => this.requestUpdate())}
              </div>
            `;
    })}
    `;
  }
  _renderTermsEditor(e, t, i, a) {
    const s = Object.keys(e || {});
    return l`
      <div style="margin-top: 16px; padding-top: 12px; border-top: 1px solid rgba(255, 255, 255, 0.08);">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
          <span class="form-label" style="margin: 0; font-size: 13px;">Linguistic Membership Terms</span>
          ${i ? "" : l`
                <button
                  class="btn btn-secondary"
                  style="font-size: 12px; padding: 4px 10px;"
                  @click=${() => {
      const r = `term_${s.length + 1}`, n = (t[0] + t[1]) / 2, o = t[1] - t[0] || 10;
      e[r] = {
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
      const n = e[r];
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
        const d = o.target.value.split(",").map((p) => parseFloat(p.trim()));
        d.every((p) => !isNaN(p)) && (n.params = d, a());
      }}
                  />
                </div>

                ${i ? "" : l`
                      <button
                        class="btn btn-danger btn-icon"
                        style="width: 26px; height: 26px; padding: 0;"
                        title="Delete Term"
                        @click=${() => {
        delete e[r], a();
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
    const e = this._config.inputs || {}, t = this._config.outputs || {}, i = Object.keys(e), a = Object.keys(t);
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
      const r = e[s], n = r.range[0], o = r.range[1], d = (o - n) / 100 || 1, p = this._simInputs[s] ?? n;
      return l`
                    <div class="section-box" style="margin-bottom: 14px; padding: 14px;">
                      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                        <div>
                          <strong style="color: var(--fuzzy-text); font-size: 14px;">${s}</strong>
                          ${r.entity_id ? l`<span class="helper-text" style="margin-left: 6px;">(${r.entity_id})</span>` : ""}
                        </div>
                        <span class="badge badge-cyan" style="font-size: 13px; font-weight: 700;">
                          ${typeof p == "number" ? p.toFixed(2) : p}
                        </span>
                      </div>

                      <div style="display: flex; align-items: center; gap: 12px;">
                        <input
                          type="range"
                          style="flex: 1; accent-color: var(--fuzzy-primary, #0284c7); cursor: pointer;"
                          min=${n}
                          max=${o}
                          step=${d}
                          .value=${String(p)}
                          @input=${(c) => this._onSimInputChange(s, parseFloat(c.target.value))}
                        />
                        <input
                          class="input-text"
                          type="number"
                          style="width: 80px; padding: 4px 8px; font-size: 12px;"
                          min=${n}
                          max=${o}
                          step=${d}
                          .value=${String(p)}
                          @input=${(c) => this._onSimInputChange(s, parseFloat(c.target.value))}
                        />
                      </div>

                      <!-- Real-time term membership degrees -->
                      <div style="display: flex; gap: 6px; flex-wrap: wrap; margin-top: 10px;">
                        ${Object.keys(r.terms || {}).map((c) => {
        const h = r.terms[c], g = Jt(h.type, h.params, p, o - n), f = g > 0.01;
        return l`
                            <span
                              class="chip"
                              style="${f ? "background: rgba(2, 132, 199, 0.15); border: 1px solid rgba(2, 132, 199, 0.4); color: #0284c7; font-weight: 600;" : "opacity: 0.6; color: var(--secondary-text-color);"}"
                            >
                              ${c}: <strong>${g.toFixed(2)}</strong>
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
      const r = t[s], n = this._simResults ? this._simResults[s] : null, o = r.unit_of_measurement || "", d = this._config.inference === "mamdani";
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
                              ${Object.entries(n.term_activations).map(([p, c]) => {
        const h = c > 0.01;
        return l`
                                  <span
                                    class="chip"
                                    style="${h ? "background: rgba(5, 150, 105, 0.15); border: 1px solid rgba(5, 150, 105, 0.4); color: #059669; font-weight: 600;" : "opacity: 0.6; color: var(--secondary-text-color);"}"
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
  _renderRulesTab(e) {
    const t = this._config.rules || [];
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
        ${e ? "" : l`
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

      ${t.length === 0 ? l`
            <div
              style="text-align: center; padding: 40px 20px; background: rgba(15, 23, 42, 0.3); border-radius: var(--fuzzy-radius-md); border: 1px dashed var(--fuzzy-card-border);"
            >
              <div style="font-size: 28px; margin-bottom: 8px;">📜</div>
              <h4 style="font-weight: 600; margin-bottom: 6px;">No Inference Rules Defined Yet</h4>
              <p class="helper-text" style="margin-bottom: 18px;">
                Rules map your input linguistic terms (e.g. temperature IS hot) to output targets (e.g. fan_speed IS fast).
              </p>
              ${e ? "" : l`
                    <button class="btn btn-primary" @click=${this._openAddRuleBuilder}>
                      ✨ Create First Rule with Builder
                    </button>
                  `}
            </div>
          ` : this._rulesViewMode === "visual" ? t.map((i, a) => {
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

                ${e ? "" : l`
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
                  ${e ? "" : l`
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
      (i, a) => l`
              <div class="rule-item">
                <span class="badge badge-purple" style="width: 24px; justify-content: center;">${a + 1}</span>
                <input
                  class="input-text rule-input"
                  type="text"
                  .value=${i}
                  ?disabled=${e}
                  @input=${(s) => this._updateRule(a, s.target.value)}
                />
                ${e ? "" : l`
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
                    ${e.map((r) => l`<option value=${r}>${r}</option>`)}
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
                ${t.map((i) => l`<option value=${i}>${i}</option>`)}
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
  _renderRawTab(e) {
    return l`
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
  ht,
  O`
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
  u()
], m.prototype, "_activeTab", 2);
b([
  u()
], m.prototype, "_config", 2);
b([
  u()
], m.prototype, "_rawJson", 2);
b([
  u()
], m.prototype, "_saving", 2);
b([
  u()
], m.prototype, "_error", 2);
b([
  u()
], m.prototype, "_successMsg", 2);
b([
  u()
], m.prototype, "_simInputs", 2);
b([
  u()
], m.prototype, "_simResults", 2);
b([
  u()
], m.prototype, "_simulating", 2);
b([
  u()
], m.prototype, "_simError", 2);
b([
  u()
], m.prototype, "_showAddInputModal", 2);
b([
  u()
], m.prototype, "_newInputEntityId", 2);
b([
  u()
], m.prototype, "_newInputVarName", 2);
b([
  u()
], m.prototype, "_newInputMin", 2);
b([
  u()
], m.prototype, "_newInputMax", 2);
b([
  u()
], m.prototype, "_newInputTermsPreset", 2);
b([
  u()
], m.prototype, "_newInputModalError", 2);
b([
  u()
], m.prototype, "_showRuleBuilderModal", 2);
b([
  u()
], m.prototype, "_editingRuleIndex", 2);
b([
  u()
], m.prototype, "_builderConditions", 2);
b([
  u()
], m.prototype, "_builderConsequent", 2);
b([
  u()
], m.prototype, "_ruleBuilderError", 2);
b([
  u()
], m.prototype, "_rulesViewMode", 2);
m = b([
  P("fuzzy-system-editor")
], m);
var Fe = Object.defineProperty, De = Object.getOwnPropertyDescriptor, F = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? De(t, i) : t, r = e.length - 1, n; r >= 0; r--)
    (n = e[r]) && (s = (a ? n(t, i, s) : n(s)) || s);
  return a && s && Fe(t, i, s), s;
};
let T = class extends k {
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
        this._templates = await Ut(this.hass);
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
      const t = await qt(
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
    return l`
      <div class="modal-overlay" @click=${(e) => e.target === e.currentTarget && this._close()}>
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
      (e) => l`
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

          ${this._selectedTemplate ? l`
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
T.styles = [
  ht,
  O`
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
F([
  v({ attribute: !1 })
], T.prototype, "hass", 2);
F([
  u()
], T.prototype, "_templates", 2);
F([
  u()
], T.prototype, "_selectedTemplate", 2);
F([
  u()
], T.prototype, "_systemId", 2);
F([
  u()
], T.prototype, "_systemName", 2);
F([
  u()
], T.prototype, "_loading", 2);
F([
  u()
], T.prototype, "_error", 2);
T = F([
  P("fuzzy-template-modal")
], T);
var He = Object.defineProperty, Ve = Object.getOwnPropertyDescriptor, xt = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? Ve(t, i) : t, r = e.length - 1, n; r >= 0; r--)
    (n = e[r]) && (s = (a ? n(t, i, s) : n(s)) || s);
  return a && s && He(t, i, s), s;
};
let it = class extends k {
  setConfig(e) {
    this._config = {
      show_graph: !0,
      show_inputs: !0,
      show_rules: !0,
      ...e
    };
  }
  _getAvailableSystems() {
    const e = /* @__PURE__ */ new Set();
    if (!this.hass?.states) return ["fan_simulator", "tipping"];
    for (const [t, i] of Object.entries(this.hass.states)) {
      const a = t.match(/^sensor\.fuzzy_([a-zA-Z0-9_-]+)_status$/);
      a && e.add(a[1]), i.attributes?.system && e.add(i.attributes.system);
    }
    return e.size === 0 && (e.add("fan_simulator"), e.add("tipping")), Array.from(e).sort();
  }
  _valueChanged(e) {
    if (!this._config) return;
    const t = e.target, i = t.dataset.configValue;
    if (!i) return;
    let a;
    t.type === "checkbox" ? a = t.checked : a = t.value, this._config = {
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
    const e = this._getAvailableSystems(), t = this._config.system_id || e[0] || "";
    return l`
      <div class="card-config">
        <!-- Fuzzy System Selector -->
        <div class="form-group">
          <label class="form-label" for="system-select">
            Target Fuzzy System
            <span class="system-badge">${e.length} detected</span>
          </label>
          <select
            id="system-select"
            class="select-field"
            data-config-value="system_id"
            .value=${t}
            @change=${this._valueChanged}
          >
            ${e.map(
      (i) => l`
                <option value=${i} ?selected=${i === t}>
                  ${i} (${this.hass.states[`sensor.fuzzy_${i}_status`]?.state || "active"})
                </option>
              `
    )}
          </select>
          <div class="form-helper">
            Select the fuzzy logic controller to monitor and visualize on this dashboard card.
          </div>
        </div>

        <!-- Custom Card Title -->
        <div class="form-group">
          <label class="form-label" for="card-title">Card Title (Optional)</label>
          <input
            id="card-title"
            class="input-field"
            type="text"
            data-config-value="title"
            placeholder="e.g. Living Room Fan Controller"
            .value=${this._config.title || ""}
            @input=${this._valueChanged}
          />
          <div class="form-helper">Leave blank to use the fuzzy system name automatically.</div>
        </div>

        <!-- Display Toggles -->
        <div class="form-group">
          <label class="form-label">Visual Card Components</label>
          <div class="toggles-group">
            <!-- Aggregated Graph Toggle -->
            <label class="toggle-row">
              <div class="toggle-info">
                <span class="toggle-title">Aggregated Output Waveform</span>
                <span class="toggle-desc">Real-time shaded fuzzy set distribution with defuzzification slice</span>
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
                <span class="toggle-title">Live Inputs Grid</span>
                <span class="toggle-desc">Show input metric pills and values feeding into the engine</span>
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
                <span class="toggle-title">Active Rule Firing Strengths</span>
                <span class="toggle-desc">Show firing strength progress bars for active rules</span>
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
it.styles = O`
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
xt([
  v({ attribute: !1 })
], it.prototype, "hass", 2);
xt([
  u()
], it.prototype, "_config", 2);
it = xt([
  P("fuzzy-system-card-editor")
], it);
var Ue = Object.defineProperty, qe = Object.getOwnPropertyDescriptor, $t = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? qe(t, i) : t, r = e.length - 1, n; r >= 0; r--)
    (n = e[r]) && (s = (a ? n(t, i, s) : n(s)) || s);
  return a && s && Ue(t, i, s), s;
};
window.customCards = window.customCards || [];
window.customCards.some((e) => e.type === "fuzzy-system-card") || window.customCards.push({
  type: "fuzzy-system-card",
  name: "Fuzzy System Controller",
  description: "Display live fuzzy logic controller status, inputs, and real-time aggregated output distributions.",
  preview: !0,
  documentationURL: "https://github.com/dougransom/fuzzy_system"
});
let at = class extends k {
  constructor() {
    super(...arguments), this._config = {};
  }
  static async getConfigElement() {
    return document.createElement("fuzzy-system-card-editor");
  }
  static getStubConfig(e) {
    const t = /* @__PURE__ */ new Set();
    if (e?.states)
      for (const [a, s] of Object.entries(e.states)) {
        const r = a.match(/^sensor\.fuzzy_([a-zA-Z0-9_-]+)_status$/);
        r && t.add(r[1]), s.attributes?.system && t.add(s.attributes.system);
      }
    return {
      type: "custom:fuzzy-system-card",
      system_id: Array.from(t)[0] || "fan_simulator",
      title: "",
      show_graph: !0,
      show_inputs: !0,
      show_rules: !0
    };
  }
  setConfig(e) {
    if (!e.system_id)
      throw new Error("Please define a 'system_id' for fuzzy-system-card (e.g. system_id: 'climate_controller').");
    this._config = {
      show_graph: !0,
      show_inputs: !0,
      show_rules: !0,
      ...e
    };
  }
  getCardSize() {
    return 4;
  }
  _findSensors() {
    if (!this.hass?.states || !this._config.system_id) return { outputs: [], status: null };
    const e = this._config.system_id.toLowerCase(), t = [];
    let i = null;
    for (const [a, s] of Object.entries(this.hass.states))
      if (a.startsWith("sensor.")) {
        if (a === `sensor.fuzzy_${e}_status`) {
          i = s;
          continue;
        }
        (a.startsWith(`sensor.fuzzy_${e}_`) || s.attributes?.system === this._config.system_id) && !a.endsWith("_set") && !a.endsWith("_status") && t.push({ entityId: a, stateObj: s });
      }
    return { outputs: t, status: i };
  }
  render() {
    if (!this.hass || !this._config.system_id)
      return l`<ha-card><p style="padding: 16px;">Configuring fuzzy-system-card...</p></ha-card>`;
    const { outputs: e } = this._findSensors(), t = this._config.system_id, i = this._config.title || `Fuzzy System: ${t}`, a = e[0], s = a?.stateObj?.attributes || {}, r = s.universe || [], n = s.aggregated_set || [], o = a?.stateObj?.state ? parseFloat(a.stateObj.state) : void 0, d = s.unit_of_measurement || "", p = s.defuzzifier || "cog", c = s.dominant_term || "", h = s.inputs || {}, g = s.rule_strengths || [];
    return l`
      <ha-card>
        <div class="card-header">
          <div class="title-group">
            <div class="card-icon">⚡</div>
            <div>
              <div class="card-title">${i}</div>
              <div class="card-subtitle">${t}</div>
            </div>
          </div>
          <div class="badge-status">
            <span class="pulse-dot"></span>
            <span>Active</span>
          </div>
        </div>

        ${this._config.show_inputs !== !1 && Object.keys(h).length > 0 ? l`
              <div class="section-title">Live Inputs</div>
              <div class="inputs-grid">
                ${Object.entries(h).map(
      ([f, y]) => l`
                    <div class="metric-pill">
                      <span class="metric-label">${f}</span>
                      <span class="metric-val">${typeof y == "number" ? y.toFixed(1) : y}</span>
                    </div>
                  `
    )}
              </div>
            ` : ""}

        ${this._config.show_graph !== !1 && r.length > 0 ? l`
              <div class="section-title">Live Aggregated Output Set</div>
              <fuzzy-aggregated-graph
                .universe=${r}
                .aggregatedSet=${n}
                .defuzzifiedValue=${o}
                .defuzzifier=${p}
                .dominantTerm=${c}
                .unit=${d}
                .outputName=${a.entityId.replace(`sensor.fuzzy_${t}_`, "")}
              ></fuzzy-aggregated-graph>
            ` : e.length > 0 ? l`
              <div class="section-title">Outputs</div>
              ${e.map(
      (f) => l`
                  <div class="metric-pill" style="margin-bottom: 6px;">
                    <span class="metric-label">${f.entityId}</span>
                    <span class="metric-val">${f.stateObj.state} ${f.stateObj.attributes?.unit_of_measurement || ""}</span>
                  </div>
                `
    )}
            ` : ""}

        ${this._config.show_rules !== !1 && g.length > 0 ? l`
              <div class="section-title">Active Rule Firing Strengths</div>
              ${g.slice(0, 4).map(
      (f, y) => l`
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
at.styles = O`
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
$t([
  v({ attribute: !1 })
], at.prototype, "hass", 2);
$t([
  u()
], at.prototype, "_config", 2);
at = $t([
  P("fuzzy-system-card")
], at);
var Be = Object.defineProperty, We = Object.getOwnPropertyDescriptor, R = (e, t, i, a) => {
  for (var s = a > 1 ? void 0 : a ? We(t, i) : t, r = e.length - 1, n; r >= 0; r--)
    (n = e[r]) && (s = (a ? n(t, i, s) : n(s)) || s);
  return a && s && Be(t, i, s), s;
};
let A = class extends k {
  constructor() {
    super(...arguments), this.narrow = !1, this._view = "catalog", this._selectedSource = "config_entry";
  }
  firstUpdated() {
    Ie({
      getHass: () => this.hass,
      getActiveConfig: () => {
        if (this._view === "editor")
          return this.shadowRoot?.querySelector("fuzzy-system-editor")?._config || this._selectedConfig;
      },
      updateActiveConfig: (e) => {
        if (this._view === "editor") {
          const t = this.shadowRoot?.querySelector("fuzzy-system-editor");
          t && (t._config = e(t._config), t.requestUpdate());
        }
      },
      openSystemInEditor: (e) => {
        this._selectedConfig = e, this._selectedEntryId = void 0, this._selectedSource = "config_entry", this._view = "editor";
      },
      refreshCatalog: () => {
        const e = this.shadowRoot?.querySelector("fuzzy-system-catalog");
        e && typeof e.refresh == "function" && e.refresh();
      }
    });
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
          <span class="badge badge-cyan">v0.1.3</span>
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
A.styles = [
  ht,
  O`
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
], A.prototype, "hass", 2);
R([
  v({ type: Boolean })
], A.prototype, "narrow", 2);
R([
  v({ type: Object })
], A.prototype, "route", 2);
R([
  v({ type: Object })
], A.prototype, "panel", 2);
R([
  u()
], A.prototype, "_view", 2);
R([
  u()
], A.prototype, "_selectedConfig", 2);
R([
  u()
], A.prototype, "_selectedEntryId", 2);
R([
  u()
], A.prototype, "_selectedSource", 2);
A = R([
  P("fuzzy-system-panel")
], A);
export {
  A as FuzzySystemPanel
};
