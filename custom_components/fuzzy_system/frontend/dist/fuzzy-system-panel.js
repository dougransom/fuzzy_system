/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const H = globalThis, Z = H.ShadowRoot && (H.ShadyCSS === void 0 || H.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, K = Symbol(), st = /* @__PURE__ */ new WeakMap();
let ht = class {
  constructor(t, s, i) {
    if (this._$cssResult$ = !0, i !== K) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = t, this.t = s;
  }
  get styleSheet() {
    let t = this.o;
    const s = this.t;
    if (Z && t === void 0) {
      const i = s !== void 0 && s.length === 1;
      i && (t = st.get(s)), t === void 0 && ((this.o = t = new CSSStyleSheet()).replaceSync(this.cssText), i && st.set(s, t));
    }
    return t;
  }
  toString() {
    return this.cssText;
  }
};
const yt = (e) => new ht(typeof e == "string" ? e : e + "", void 0, K), q = (e, ...t) => {
  const s = e.length === 1 ? e[0] : t.reduce((i, a, r) => i + ((n) => {
    if (n._$cssResult$ === !0) return n.cssText;
    if (typeof n == "number") return n;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + n + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(a) + e[r + 1], e[0]);
  return new ht(s, e, K);
}, _t = (e, t) => {
  if (Z) e.adoptedStyleSheets = t.map((s) => s instanceof CSSStyleSheet ? s : s.styleSheet);
  else for (const s of t) {
    const i = document.createElement("style"), a = H.litNonce;
    a !== void 0 && i.setAttribute("nonce", a), i.textContent = s.cssText, e.appendChild(i);
  }
}, it = Z ? (e) => e : (e) => e instanceof CSSStyleSheet ? ((t) => {
  let s = "";
  for (const i of t.cssRules) s += i.cssText;
  return yt(s);
})(e) : e;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const { is: vt, defineProperty: xt, getOwnPropertyDescriptor: $t, getOwnPropertyNames: wt, getOwnPropertySymbols: zt, getPrototypeOf: St } = Object, F = globalThis, at = F.trustedTypes, At = at ? at.emptyScript : "", Et = F.reactiveElementPolyfillSupport, P = (e, t) => e, L = { toAttribute(e, t) {
  switch (t) {
    case Boolean:
      e = e ? At : null;
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
} }, X = (e, t) => !vt(e, t), rt = { attribute: !0, type: String, converter: L, reflect: !1, useDefault: !1, hasChanged: X };
Symbol.metadata ??= Symbol("metadata"), F.litPropertyMetadata ??= /* @__PURE__ */ new WeakMap();
let M = class extends HTMLElement {
  static addInitializer(t) {
    this._$Ei(), (this.l ??= []).push(t);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(t, s = rt) {
    if (s.state && (s.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(t) && ((s = Object.create(s)).wrapped = !0), this.elementProperties.set(t, s), !s.noAccessor) {
      const i = Symbol(), a = this.getPropertyDescriptor(t, i, s);
      a !== void 0 && xt(this.prototype, t, a);
    }
  }
  static getPropertyDescriptor(t, s, i) {
    const { get: a, set: r } = $t(this.prototype, t) ?? { get() {
      return this[s];
    }, set(n) {
      this[s] = n;
    } };
    return { get: a, set(n) {
      const d = a?.call(this);
      r?.call(this, n), this.requestUpdate(t, d, i);
    }, configurable: !0, enumerable: !0 };
  }
  static getPropertyOptions(t) {
    return this.elementProperties.get(t) ?? rt;
  }
  static _$Ei() {
    if (this.hasOwnProperty(P("elementProperties"))) return;
    const t = St(this);
    t.finalize(), t.l !== void 0 && (this.l = [...t.l]), this.elementProperties = new Map(t.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(P("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(P("properties"))) {
      const s = this.properties, i = [...wt(s), ...zt(s)];
      for (const a of i) this.createProperty(a, s[a]);
    }
    const t = this[Symbol.metadata];
    if (t !== null) {
      const s = litPropertyMetadata.get(t);
      if (s !== void 0) for (const [i, a] of s) this.elementProperties.set(i, a);
    }
    this._$Eh = /* @__PURE__ */ new Map();
    for (const [s, i] of this.elementProperties) {
      const a = this._$Eu(s, i);
      a !== void 0 && this._$Eh.set(a, s);
    }
    this.elementStyles = this.finalizeStyles(this.styles);
  }
  static finalizeStyles(t) {
    const s = [];
    if (Array.isArray(t)) {
      const i = new Set(t.flat(1 / 0).reverse());
      for (const a of i) s.unshift(it(a));
    } else t !== void 0 && s.push(it(t));
    return s;
  }
  static _$Eu(t, s) {
    const i = s.attribute;
    return i === !1 ? void 0 : typeof i == "string" ? i : typeof t == "string" ? t.toLowerCase() : void 0;
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
    for (const i of s.keys()) this.hasOwnProperty(i) && (t.set(i, this[i]), delete this[i]);
    t.size > 0 && (this._$Ep = t);
  }
  createRenderRoot() {
    const t = this.shadowRoot ?? this.attachShadow(this.constructor.shadowRootOptions);
    return _t(t, this.constructor.elementStyles), t;
  }
  connectedCallback() {
    this.renderRoot ??= this.createRenderRoot(), this.enableUpdating(!0), this._$EO?.forEach((t) => t.hostConnected?.());
  }
  enableUpdating(t) {
  }
  disconnectedCallback() {
    this._$EO?.forEach((t) => t.hostDisconnected?.());
  }
  attributeChangedCallback(t, s, i) {
    this._$AK(t, i);
  }
  _$ET(t, s) {
    const i = this.constructor.elementProperties.get(t), a = this.constructor._$Eu(t, i);
    if (a !== void 0 && i.reflect === !0) {
      const r = (i.converter?.toAttribute !== void 0 ? i.converter : L).toAttribute(s, i.type);
      this._$Em = t, r == null ? this.removeAttribute(a) : this.setAttribute(a, r), this._$Em = null;
    }
  }
  _$AK(t, s) {
    const i = this.constructor, a = i._$Eh.get(t);
    if (a !== void 0 && this._$Em !== a) {
      const r = i.getPropertyOptions(a), n = typeof r.converter == "function" ? { fromAttribute: r.converter } : r.converter?.fromAttribute !== void 0 ? r.converter : L;
      this._$Em = a;
      const d = n.fromAttribute(s, r.type);
      this[a] = d ?? this._$Ej?.get(a) ?? d, this._$Em = null;
    }
  }
  requestUpdate(t, s, i, a = !1, r) {
    if (t !== void 0) {
      const n = this.constructor;
      if (a === !1 && (r = this[t]), i ??= n.getPropertyOptions(t), !((i.hasChanged ?? X)(r, s) || i.useDefault && i.reflect && r === this._$Ej?.get(t) && !this.hasAttribute(n._$Eu(t, i)))) return;
      this.C(t, s, i);
    }
    this.isUpdatePending === !1 && (this._$ES = this._$EP());
  }
  C(t, s, { useDefault: i, reflect: a, wrapped: r }, n) {
    i && !(this._$Ej ??= /* @__PURE__ */ new Map()).has(t) && (this._$Ej.set(t, n ?? s ?? this[t]), r !== !0 || n !== void 0) || (this._$AL.has(t) || (this.hasUpdated || i || (s = void 0), this._$AL.set(t, s)), a === !0 && this._$Em !== t && (this._$Eq ??= /* @__PURE__ */ new Set()).add(t));
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
        for (const [a, r] of this._$Ep) this[a] = r;
        this._$Ep = void 0;
      }
      const i = this.constructor.elementProperties;
      if (i.size > 0) for (const [a, r] of i) {
        const { wrapped: n } = r, d = this[a];
        n !== !0 || this._$AL.has(a) || d === void 0 || this.C(a, void 0, r, d);
      }
    }
    let t = !1;
    const s = this._$AL;
    try {
      t = this.shouldUpdate(s), t ? (this.willUpdate(s), this._$EO?.forEach((i) => i.hostUpdate?.()), this.update(s)) : this._$EM();
    } catch (i) {
      throw t = !1, this._$EM(), i;
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
M.elementStyles = [], M.shadowRootOptions = { mode: "open" }, M[P("elementProperties")] = /* @__PURE__ */ new Map(), M[P("finalized")] = /* @__PURE__ */ new Map(), Et?.({ ReactiveElement: M }), (F.reactiveElementVersions ??= []).push("2.1.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Y = globalThis, nt = (e) => e, V = Y.trustedTypes, ot = V ? V.createPolicy("lit-html", { createHTML: (e) => e }) : void 0, bt = "$lit$", S = `lit$${Math.random().toFixed(9).slice(2)}$`, gt = "?" + S, It = `<${gt}>`, k = document, j = () => k.createComment(""), U = (e) => e === null || typeof e != "object" && typeof e != "function", tt = Array.isArray, Ct = (e) => tt(e) || typeof e?.[Symbol.iterator] == "function", Q = `[ 	
\f\r]`, N = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, lt = /-->/g, dt = />/g, I = RegExp(`>|${Q}(?:([^\\s"'>=/]+)(${Q}*=${Q}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), pt = /'/g, ut = /"/g, ft = /^(?:script|style|textarea|title)$/i, kt = (e) => (t, ...s) => ({ _$litType$: e, strings: t, values: s }), o = kt(1), O = Symbol.for("lit-noChange"), f = Symbol.for("lit-nothing"), ct = /* @__PURE__ */ new WeakMap(), C = k.createTreeWalker(k, 129);
function mt(e, t) {
  if (!tt(e) || !e.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return ot !== void 0 ? ot.createHTML(t) : t;
}
const Tt = (e, t) => {
  const s = e.length - 1, i = [];
  let a, r = t === 2 ? "<svg>" : t === 3 ? "<math>" : "", n = N;
  for (let d = 0; d < s; d++) {
    const l = e[d];
    let c, g, u = -1, m = 0;
    for (; m < l.length && (n.lastIndex = m, g = n.exec(l), g !== null); ) m = n.lastIndex, n === N ? g[1] === "!--" ? n = lt : g[1] !== void 0 ? n = dt : g[2] !== void 0 ? (ft.test(g[2]) && (a = RegExp("</" + g[2], "g")), n = I) : g[3] !== void 0 && (n = I) : n === I ? g[0] === ">" ? (n = a ?? N, u = -1) : g[1] === void 0 ? u = -2 : (u = n.lastIndex - g[2].length, c = g[1], n = g[3] === void 0 ? I : g[3] === '"' ? ut : pt) : n === ut || n === pt ? n = I : n === lt || n === dt ? n = N : (n = I, a = void 0);
    const y = n === I && e[d + 1].startsWith("/>") ? " " : "";
    r += n === N ? l + It : u >= 0 ? (i.push(c), l.slice(0, u) + bt + l.slice(u) + S + y) : l + S + (u === -2 ? d : y);
  }
  return [mt(e, r + (e[s] || "<?>") + (t === 2 ? "</svg>" : t === 3 ? "</math>" : "")), i];
};
class B {
  constructor({ strings: t, _$litType$: s }, i) {
    let a;
    this.parts = [];
    let r = 0, n = 0;
    const d = t.length - 1, l = this.parts, [c, g] = Tt(t, s);
    if (this.el = B.createElement(c, i), C.currentNode = this.el.content, s === 2 || s === 3) {
      const u = this.el.content.firstChild;
      u.replaceWith(...u.childNodes);
    }
    for (; (a = C.nextNode()) !== null && l.length < d; ) {
      if (a.nodeType === 1) {
        if (a.hasAttributes()) for (const u of a.getAttributeNames()) if (u.endsWith(bt)) {
          const m = g[n++], y = a.getAttribute(u).split(S), $ = /([.?@])?(.*)/.exec(m);
          l.push({ type: 1, index: r, name: $[2], strings: y, ctor: $[1] === "." ? Ot : $[1] === "?" ? Rt : $[1] === "@" ? Nt : W }), a.removeAttribute(u);
        } else u.startsWith(S) && (l.push({ type: 6, index: r }), a.removeAttribute(u));
        if (ft.test(a.tagName)) {
          const u = a.textContent.split(S), m = u.length - 1;
          if (m > 0) {
            a.textContent = V ? V.emptyScript : "";
            for (let y = 0; y < m; y++) a.append(u[y], j()), C.nextNode(), l.push({ type: 2, index: ++r });
            a.append(u[m], j());
          }
        }
      } else if (a.nodeType === 8) if (a.data === gt) l.push({ type: 2, index: r });
      else {
        let u = -1;
        for (; (u = a.data.indexOf(S, u + 1)) !== -1; ) l.push({ type: 7, index: r }), u += S.length - 1;
      }
      r++;
    }
  }
  static createElement(t, s) {
    const i = k.createElement("template");
    return i.innerHTML = t, i;
  }
}
function R(e, t, s = e, i) {
  if (t === O) return t;
  let a = i !== void 0 ? s._$Co?.[i] : s._$Cl;
  const r = U(t) ? void 0 : t._$litDirective$;
  return a?.constructor !== r && (a?._$AO?.(!1), r === void 0 ? a = void 0 : (a = new r(e), a._$AT(e, s, i)), i !== void 0 ? (s._$Co ??= [])[i] = a : s._$Cl = a), a !== void 0 && (t = R(e, a._$AS(e, t.values), a, i)), t;
}
class Mt {
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
    const { el: { content: s }, parts: i } = this._$AD, a = (t?.creationScope ?? k).importNode(s, !0);
    C.currentNode = a;
    let r = C.nextNode(), n = 0, d = 0, l = i[0];
    for (; l !== void 0; ) {
      if (n === l.index) {
        let c;
        l.type === 2 ? c = new D(r, r.nextSibling, this, t) : l.type === 1 ? c = new l.ctor(r, l.name, l.strings, this, t) : l.type === 6 && (c = new Pt(r, this, t)), this._$AV.push(c), l = i[++d];
      }
      n !== l?.index && (r = C.nextNode(), n++);
    }
    return C.currentNode = k, a;
  }
  p(t) {
    let s = 0;
    for (const i of this._$AV) i !== void 0 && (i.strings !== void 0 ? (i._$AI(t, i, s), s += i.strings.length - 2) : i._$AI(t[s])), s++;
  }
}
class D {
  get _$AU() {
    return this._$AM?._$AU ?? this._$Cv;
  }
  constructor(t, s, i, a) {
    this.type = 2, this._$AH = f, this._$AN = void 0, this._$AA = t, this._$AB = s, this._$AM = i, this.options = a, this._$Cv = a?.isConnected ?? !0;
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
    t = R(this, t, s), U(t) ? t === f || t == null || t === "" ? (this._$AH !== f && this._$AR(), this._$AH = f) : t !== this._$AH && t !== O && this._(t) : t._$litType$ !== void 0 ? this.$(t) : t.nodeType !== void 0 ? this.T(t) : Ct(t) ? this.k(t) : this._(t);
  }
  O(t) {
    return this._$AA.parentNode.insertBefore(t, this._$AB);
  }
  T(t) {
    this._$AH !== t && (this._$AR(), this._$AH = this.O(t));
  }
  _(t) {
    this._$AH !== f && U(this._$AH) ? this._$AA.nextSibling.data = t : this.T(k.createTextNode(t)), this._$AH = t;
  }
  $(t) {
    const { values: s, _$litType$: i } = t, a = typeof i == "number" ? this._$AC(t) : (i.el === void 0 && (i.el = B.createElement(mt(i.h, i.h[0]), this.options)), i);
    if (this._$AH?._$AD === a) this._$AH.p(s);
    else {
      const r = new Mt(a, this), n = r.u(this.options);
      r.p(s), this.T(n), this._$AH = r;
    }
  }
  _$AC(t) {
    let s = ct.get(t.strings);
    return s === void 0 && ct.set(t.strings, s = new B(t)), s;
  }
  k(t) {
    tt(this._$AH) || (this._$AH = [], this._$AR());
    const s = this._$AH;
    let i, a = 0;
    for (const r of t) a === s.length ? s.push(i = new D(this.O(j()), this.O(j()), this, this.options)) : i = s[a], i._$AI(r), a++;
    a < s.length && (this._$AR(i && i._$AB.nextSibling, a), s.length = a);
  }
  _$AR(t = this._$AA.nextSibling, s) {
    for (this._$AP?.(!1, !0, s); t !== this._$AB; ) {
      const i = nt(t).nextSibling;
      nt(t).remove(), t = i;
    }
  }
  setConnected(t) {
    this._$AM === void 0 && (this._$Cv = t, this._$AP?.(t));
  }
}
class W {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(t, s, i, a, r) {
    this.type = 1, this._$AH = f, this._$AN = void 0, this.element = t, this.name = s, this._$AM = a, this.options = r, i.length > 2 || i[0] !== "" || i[1] !== "" ? (this._$AH = Array(i.length - 1).fill(new String()), this.strings = i) : this._$AH = f;
  }
  _$AI(t, s = this, i, a) {
    const r = this.strings;
    let n = !1;
    if (r === void 0) t = R(this, t, s, 0), n = !U(t) || t !== this._$AH && t !== O, n && (this._$AH = t);
    else {
      const d = t;
      let l, c;
      for (t = r[0], l = 0; l < r.length - 1; l++) c = R(this, d[i + l], s, l), c === O && (c = this._$AH[l]), n ||= !U(c) || c !== this._$AH[l], c === f ? t = f : t !== f && (t += (c ?? "") + r[l + 1]), this._$AH[l] = c;
    }
    n && !a && this.j(t);
  }
  j(t) {
    t === f ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, t ?? "");
  }
}
class Ot extends W {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(t) {
    this.element[this.name] = t === f ? void 0 : t;
  }
}
class Rt extends W {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(t) {
    this.element.toggleAttribute(this.name, !!t && t !== f);
  }
}
class Nt extends W {
  constructor(t, s, i, a, r) {
    super(t, s, i, a, r), this.type = 5;
  }
  _$AI(t, s = this) {
    if ((t = R(this, t, s, 0) ?? f) === O) return;
    const i = this._$AH, a = t === f && i !== f || t.capture !== i.capture || t.once !== i.once || t.passive !== i.passive, r = t !== f && (i === f || a);
    a && this.element.removeEventListener(this.name, this, i), r && this.element.addEventListener(this.name, this, t), this._$AH = t;
  }
  handleEvent(t) {
    typeof this._$AH == "function" ? this._$AH.call(this.options?.host ?? this.element, t) : this._$AH.handleEvent(t);
  }
}
class Pt {
  constructor(t, s, i) {
    this.element = t, this.type = 6, this._$AN = void 0, this._$AM = s, this.options = i;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(t) {
    R(this, t);
  }
}
const jt = Y.litHtmlPolyfillSupport;
jt?.(B, D), (Y.litHtmlVersions ??= []).push("3.3.3");
const Ut = (e, t, s) => {
  const i = s?.renderBefore ?? t;
  let a = i._$litPart$;
  if (a === void 0) {
    const r = s?.renderBefore ?? null;
    i._$litPart$ = a = new D(t.insertBefore(j(), r), r, void 0, s ?? {});
  }
  return a._$AI(e), a;
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const et = globalThis;
class A extends M {
  constructor() {
    super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
  }
  createRenderRoot() {
    const t = super.createRenderRoot();
    return this.renderOptions.renderBefore ??= t.firstChild, t;
  }
  update(t) {
    const s = this.render();
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(t), this._$Do = Ut(s, this.renderRoot, this.renderOptions);
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
A._$litElement$ = !0, A.finalized = !0, et.litElementHydrateSupport?.({ LitElement: A });
const Bt = et.litElementPolyfillSupport;
Bt?.({ LitElement: A });
(et.litElementVersions ??= []).push("4.2.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const qt = { attribute: !0, type: String, converter: L, reflect: !1, hasChanged: X }, Dt = (e = qt, t, s) => {
  const { kind: i, metadata: a } = s;
  let r = globalThis.litPropertyMetadata.get(a);
  if (r === void 0 && globalThis.litPropertyMetadata.set(a, r = /* @__PURE__ */ new Map()), i === "setter" && ((e = Object.create(e)).wrapped = !0), r.set(s.name, e), i === "accessor") {
    const { name: n } = s;
    return { set(d) {
      const l = t.get.call(this);
      t.set.call(this, d), this.requestUpdate(n, l, e, !0, d);
    }, init(d) {
      return d !== void 0 && this.C(n, void 0, e, d), d;
    } };
  }
  if (i === "setter") {
    const { name: n } = s;
    return function(d) {
      const l = this[n];
      t.call(this, d), this.requestUpdate(n, l, e, !0, d);
    };
  }
  throw Error("Unsupported decorator location: " + i);
};
function v(e) {
  return (t, s) => typeof s == "object" ? Dt(e, t, s) : ((i, a, r) => {
    const n = a.hasOwnProperty(r);
    return a.constructor.createProperty(r, i), n ? Object.getOwnPropertyDescriptor(a, r) : void 0;
  })(e, t, s);
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function p(e) {
  return v({ ...e, state: !0, attribute: !1 });
}
function J(e) {
  return (t) => (typeof customElements < "u" && !customElements.get(e) && customElements.define(e, t), t);
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
`, Ht = "fuzzy_system/systems/list", Lt = "fuzzy_system/systems/save", Vt = "fuzzy_system/systems/delete", Ft = "fuzzy_system/templates/list", Wt = "fuzzy_system/templates/instantiate";
async function Jt(e) {
  const t = await e.callWS({
    type: Ht
  });
  return Array.isArray(t) ? t : t.systems || [];
}
async function Gt(e, t, s) {
  return e.callWS({
    type: Lt,
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
async function Qt(e, t) {
  return e.callWS({
    type: Vt,
    entry_id: t
  });
}
async function Zt(e) {
  return (await e.callWS({
    type: Ft
  })).templates || [];
}
async function Kt(e, t, s, i) {
  return e.callWS({
    type: Wt,
    template_id: t,
    system_id: s,
    name: i
  });
}
var Xt = Object.defineProperty, Yt = Object.getOwnPropertyDescriptor, T = (e, t, s, i) => {
  for (var a = i > 1 ? void 0 : i ? Yt(t, s) : t, r = e.length - 1, n; r >= 0; r--)
    (n = e[r]) && (a = (i ? n(t, s, a) : n(a)) || a);
  return i && a && Xt(t, s, a), a;
};
let w = class extends A {
  constructor() {
    super(...arguments), this._systems = [], this._searchQuery = "", this._loading = !1, this._error = "", this._showTemplateModal = !1;
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
        this._systems = await Jt(this.hass);
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
        await Qt(this.hass, e.entry_id), await this.refresh();
      } catch (t) {
        alert(t.message || "Failed to delete system");
      }
  }
  _findOutputSensor(e, t) {
    if (!this.hass?.states) return null;
    const s = e.toLowerCase(), i = t.toLowerCase(), a = [
      `sensor.fuzzy_${s}_${i}`,
      `sensor.${s}_${i}`,
      `sensor.fuzzy_${i}`
    ];
    for (const r of a)
      if (this.hass.states[r])
        return { entityId: r, stateObj: this.hass.states[r] };
    for (const [r, n] of Object.entries(this.hass.states)) {
      if (!r.startsWith("sensor.") || r.endsWith("_set") || r.endsWith("_status")) continue;
      if ((n.attributes || {}).system === e && (r.endsWith(`_${i}`) || r.includes(i)))
        return { entityId: r, stateObj: n };
    }
    return null;
  }
  _getInputsStatus(e) {
    const t = e.config?.inputs || {}, s = Object.keys(t).length;
    let i = 0;
    for (const a of Object.values(t))
      a.entity_id && a.entity_id.trim() && i++;
    return { total: s, bound: i };
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
    const i = this._getInputsStatus(e);
    return o`
      <div class="card-live-outputs">
        <div class="live-outputs-header">
          <span class="live-outputs-title">Live Runtime Outputs</span>
          ${i.total > 0 && i.bound < i.total ? o`
                <span
                  class="chip"
                  style="color: #fbbf24; background: rgba(245, 158, 11, 0.1); font-size: 11px;"
                  title="Some input antecedents do not have live sensor entities bound yet"
                >
                  ⚠️ ${i.total - i.bound} unbound input${i.total - i.bound > 1 ? "s" : ""}
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
          ${s.map((a) => {
      const r = this._findOutputSensor(e.system_id, a), n = t[a] || {}, d = r?.stateObj?.attributes?.unit_of_measurement || n.unit_of_measurement || "", l = r?.stateObj?.attributes?.dominant_term, c = r?.stateObj?.state, g = c !== void 0 && c !== "unknown" && c !== "unavailable" && !isNaN(parseFloat(c));
      if (r && g) {
        const u = parseFloat(c).toFixed(1);
        return o`
                <button
                  class="output-badge live-active"
                  @click=${(m) => this._openMoreInfo(r.entityId, m)}
                  title="Entity: ${r.entityId} — Click to view Home Assistant history graph and diagnostic attributes"
                >
                  <span class="pulse-dot"></span>
                  <span class="output-name">${a}:</span>
                  <span class="output-value">${u}${d ? ` ${d}` : ""}</span>
                  ${l ? o`<span class="dominant-term">(${l})</span>` : ""}
                </button>
              `;
      }
      return o`
              <div
                class="output-badge live-idle"
                title="${r ? `Entity: ${r.entityId} (State: ${c})` : "Sensor entity not yet registered in Home Assistant"}"
              >
                <span class="idle-dot"></span>
                <span class="output-name">${a}:</span>
                <span class="output-value" style="color: var(--fuzzy-text-secondary);">
                  ${c === "unavailable" ? "Unavailable" : "Awaiting inputs"}
                </span>
              </div>
            `;
    })}
        </div>
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
var te = Object.defineProperty, ee = Object.getOwnPropertyDescriptor, b = (e, t, s, i) => {
  for (var a = i > 1 ? void 0 : i ? ee(t, s) : t, r = e.length - 1, n; r >= 0; r--)
    (n = e[r]) && (a = (i ? n(t, s, a) : n(a)) || a);
  return i && a && te(t, s, a), a;
};
let h = class extends A {
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
    }, this._rawJson = JSON.stringify(this._config, null, 2);
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
      const e = await Gt(this.hass, this._config, this.entryId);
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
      const i = s.attributes.unit_of_measurement;
      i === "°C" ? (this._newInputMin = 10, this._newInputMax = 35) : i === "°F" ? (this._newInputMin = 50, this._newInputMax = 95) : i === "%" ? (this._newInputMin = 0, this._newInputMax = 100) : i === "lx" || i === "lux" ? (this._newInputMin = 0, this._newInputMax = 1e3) : i === "ppm" ? (this._newInputMin = 400, this._newInputMax = 2e3) : (i === "W" || i === "kW") && (this._newInputMin = 0, this._newInputMax = 5e3);
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
    const t = Number.isFinite(this._newInputMin) ? this._newInputMin : 0, s = Number.isFinite(this._newInputMax) && this._newInputMax > t ? this._newInputMax : t + 100, i = s - t;
    let a;
    this._newInputTermsPreset === "5_terms" ? a = {
      very_low: { type: "trapmf", params: [t, t, t + i * 0.15, t + i * 0.3] },
      low: { type: "trimf", params: [t + i * 0.15, t + i * 0.35, t + i * 0.55] },
      medium: { type: "trimf", params: [t + i * 0.35, t + i * 0.5, t + i * 0.65] },
      high: { type: "trimf", params: [t + i * 0.45, t + i * 0.65, t + i * 0.85] },
      very_high: { type: "trapmf", params: [t + i * 0.7, t + i * 0.85, s, s] }
    } : a = {
      low: { type: "trapmf", params: [t, t, t + i * 0.25, t + i * 0.5] },
      medium: { type: "trimf", params: [t + i * 0.25, t + i * 0.5, t + i * 0.75] },
      high: { type: "trapmf", params: [t + i * 0.5, t + i * 0.75, s, s] }
    }, this._config.inputs || (this._config.inputs = {}), this._config.inputs[e] = {
      entity_id: this._newInputEntityId || "",
      range: [t, s],
      resolution: 100,
      default: t,
      terms: a
    }, this._showAddInputModal = !1, this.requestUpdate();
  }
  _getAvailableEntities() {
    if (!this.hass?.states) return [];
    const e = [];
    for (const [t, s] of Object.entries(this.hass.states)) {
      const i = t.split(".")[0];
      (i === "sensor" || i === "input_number" || i === "number" || i === "climate" || i === "weather") && e.push({
        entity_id: t,
        friendly_name: s.attributes?.friendly_name || t,
        unit: s.attributes?.unit_of_measurement || "",
        state: s.state
      });
    }
    return e.sort((t, s) => t.friendly_name.localeCompare(s.friendly_name)), e;
  }
  _renderEntityPicker(e, t, s) {
    const i = !!customElements.get("ha-entity-picker"), a = this._getAvailableEntities();
    return i ? o`
        <ha-entity-picker
          .hass=${this.hass}
          .value=${e || ""}
          ?disabled=${t}
          .includeDomains=${["sensor", "input_number", "number", "climate", "weather"]}
          @value-changed=${(r) => s(r.detail.value || "")}
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
          @input=${(r) => s(r.target.value)}
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
    const s = t[1].trim(), a = t[2].trim().match(/^([a-zA-Z0-9_]+)\s*(?:IS|=)\s*(.+)$/i);
    if (!a) return null;
    const r = a[1].trim(), n = a[2].trim(), d = parseFloat(n), l = !isNaN(d) && isFinite(d) && !n.match(/[a-zA-Z]/), c = s.split(/\s+(AND|OR)\s+/i), g = [];
    let u = "AND";
    for (let m = 0; m < c.length; m++) {
      const y = c[m].trim();
      if (!y) continue;
      if (y.toUpperCase() === "AND") {
        u = "AND";
        continue;
      }
      if (y.toUpperCase() === "OR") {
        u = "OR";
        continue;
      }
      const $ = y.match(
        /^([a-zA-Z0-9_]+)\s+IS\s+(?:(not|very|somewhat|extremely|slightly)\s+)?([a-zA-Z0-9_]+)$/i
      );
      if (!$) return null;
      g.push({
        variable: $[1].trim(),
        hedge: ($[2] || "").trim().toLowerCase(),
        term: $[3].trim(),
        connector: g.length === 0 ? "AND" : u
      });
    }
    return g.length === 0 ? null : {
      conditions: g,
      consequent: {
        variable: r,
        term: l ? "" : n,
        isConstant: l,
        constantValue: l ? d : 0
      }
    };
  }
  _compileRuleString(e, t) {
    const s = [];
    e.forEach((r, n) => {
      const d = r.hedge ? `${r.hedge} ` : "", l = `${r.variable} IS ${d}${r.term}`;
      n === 0 ? s.push(l) : s.push(`${r.connector} ${l}`);
    });
    const i = s.join(" "), a = t.isConstant ? `${t.variable} IS ${t.constantValue}` : `${t.variable} IS ${t.term}`;
    return `IF ${i} THEN ${a}`;
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
    const s = e[0], i = Object.keys(this._config.inputs[s]?.terms || {}), a = t[0], r = Object.keys(this._config.outputs[a]?.terms || {});
    this._editingRuleIndex = -1, this._builderConditions = [
      {
        variable: s,
        hedge: "",
        term: i[0] || "low",
        connector: "AND"
      }
    ], this._builderConsequent = {
      variable: a,
      term: r[0] || "low",
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
      const i = Object.keys(this._config.inputs || {}), a = Object.keys(this._config.outputs || {}), r = i[0] || "", n = Object.keys(this._config.inputs[r]?.terms || {}), d = a[0] || "", l = Object.keys(this._config.outputs[d]?.terms || {});
      this._editingRuleIndex = e, this._builderConditions = [
        {
          variable: r,
          hedge: "",
          term: n[0] || "low",
          connector: "AND"
        }
      ], this._builderConsequent = {
        variable: d,
        term: l[0] || "low",
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
    const s = Object.keys(this._config.inputs || {})[0] || "", i = Object.keys(this._config.inputs[s]?.terms || {});
    this._builderConditions.push({
      variable: s,
      hedge: "",
      term: i[0] || "",
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

      ${s.length === 0 ? o`<p class="subtitle" style="padding: 20px 0;">No input variables defined yet.</p>` : s.map((i) => {
      const a = t[i];
      return o`
              <div class="section-box">
                <div class="section-header">
                  <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
                    <span class="badge badge-cyan">${i}</span>
                    ${this._renderEntityStatusTag(a.entity_id)}
                    <span class="chip">Range: [${a.range[0]}, ${a.range[1]}]</span>
                  </div>
                  ${e ? "" : o`
                        <button class="btn btn-danger btn-icon" @click=${() => this._removeInput(i)} title="Delete Input">
                          ✕
                        </button>
                      `}
                </div>

                <div class="grid-2">
                  <div class="form-group">
                    <label class="form-label">Bound Home Assistant Sensor Entity</label>
                    ${this._renderEntityPicker(a.entity_id, e, (r) => {
        a.entity_id = r, this.requestUpdate();
      })}
                    <div class="helper-text">
                      ${a.entity_id ? o`Feeds live numerical measurements from <code>${a.entity_id}</code> into <code>${i}</code>.` : o`<span style="color: #fbbf24;">⚠️ Unbound: select an entity to evaluate live rules in HA.</span>`}
                    </div>
                  </div>

                  <div class="grid-2">
                    <div class="form-group">
                      <label class="form-label">Range Min</label>
                      <input
                        class="input-text"
                        type="number"
                        .value=${String(a.range[0])}
                        ?disabled=${e}
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
                        ?disabled=${e}
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

      ${s.length === 0 ? o`<p class="subtitle" style="padding: 20px 0;">No output variables defined yet.</p>` : s.map((i) => {
      const a = t[i];
      return o`
              <div class="section-box">
                <div class="section-header">
                  <div style="display: flex; align-items: center; gap: 8px;">
                    <span class="badge badge-amber">${i}</span>
                    <span class="chip">Range: [${a.range[0]}, ${a.range[1]}]</span>
                    ${a.unit_of_measurement ? o`<span class="chip">${a.unit_of_measurement}</span>` : ""}
                  </div>
                  ${e ? "" : o`
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
                      .value=${String(a.range[0])}
                      ?disabled=${e}
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
                      ?disabled=${e}
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
                      ?disabled=${e}
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
          ` : this._rulesViewMode === "visual" ? t.map((s, i) => {
      const a = this._parseRuleToBuilder(s);
      return a ? o`
              <div class="rule-card">
                <div style="display: flex; flex-direction: column; gap: 8px; flex: 1;">
                  <div style="display: flex; align-items: center; gap: 6px; flex-wrap: wrap;">
                    <span class="badge badge-purple" style="width: 24px; justify-content: center;">${i + 1}</span>
                    <span class="badge badge-cyan">IF</span>
                    ${a.conditions.map(
        (r, n) => o`
                        ${n > 0 ? o`<span class="badge badge-purple">${r.connector}</span>` : ""}
                        <span class="chip" style="font-weight: 600; color: #38bdf8; background: rgba(56, 189, 248, 0.1);">
                          ${r.variable}
                        </span>
                        <span class="chip" style="color: #94a3b8;">
                          ${r.hedge ? `is ${r.hedge}` : "is"}
                        </span>
                        <span class="chip" style="font-weight: 600; color: #34d399; background: rgba(52, 211, 153, 0.1);">
                          ${r.term}
                        </span>
                      `
      )}
                    <span class="badge badge-amber">THEN</span>
                    <span class="chip" style="font-weight: 600; color: #fbbf24; background: rgba(245, 158, 11, 0.1);">
                      ${a.consequent.variable}
                    </span>
                    <span class="chip" style="color: #94a3b8;">is</span>
                    <span class="chip" style="font-weight: 600; color: #34d399; background: rgba(52, 211, 153, 0.1);">
                      ${a.consequent.isConstant ? a.consequent.constantValue : a.consequent.term}
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
                  ${e ? "" : o`
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
    }) : t.map(
      (s, i) => o`
              <div class="rule-item">
                <span class="badge badge-purple" style="width: 24px; justify-content: center;">${i + 1}</span>
                <input
                  class="input-text rule-input"
                  type="text"
                  .value=${s}
                  ?disabled=${e}
                  @input=${(a) => this._updateRule(i, a.target.value)}
                />
                ${e ? "" : o`
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

            ${this._builderConditions.map((s, i) => {
      const a = Object.keys(this._config.inputs[s.variable]?.terms || {});
      return o`
                <div class="builder-row">
                  ${i > 0 ? o`
                        <select
                          class="input-select"
                          style="width: 85px; font-weight: 700; color: #c084fc; border-color: rgba(168, 85, 247, 0.4);"
                          .value=${s.connector}
                          @change=${(r) => {
        s.connector = r.target.value, this.requestUpdate();
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
                    @change=${(r) => this._onBuilderConditionVarChange(i, r.target.value)}
                  >
                    ${e.map((r) => o`<option value=${r}>${r}</option>`)}
                  </select>

                  <!-- Hedge -->
                  <select
                    class="input-select"
                    style="width: 130px;"
                    .value=${s.hedge}
                    @change=${(r) => {
        s.hedge = r.target.value, this.requestUpdate();
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
                    @change=${(r) => {
        s.term = r.target.value, this.requestUpdate();
      }}
                  >
                    ${a.map((r) => o`<option value=${r}>${r}</option>`)}
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
h.styles = [
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
b([
  v({ attribute: !1 })
], h.prototype, "hass", 2);
b([
  v({ type: Object })
], h.prototype, "systemConfig", 2);
b([
  v({ type: String })
], h.prototype, "entryId", 2);
b([
  v({ type: String })
], h.prototype, "source", 2);
b([
  p()
], h.prototype, "_activeTab", 2);
b([
  p()
], h.prototype, "_config", 2);
b([
  p()
], h.prototype, "_rawJson", 2);
b([
  p()
], h.prototype, "_saving", 2);
b([
  p()
], h.prototype, "_error", 2);
b([
  p()
], h.prototype, "_successMsg", 2);
b([
  p()
], h.prototype, "_showAddInputModal", 2);
b([
  p()
], h.prototype, "_newInputEntityId", 2);
b([
  p()
], h.prototype, "_newInputVarName", 2);
b([
  p()
], h.prototype, "_newInputMin", 2);
b([
  p()
], h.prototype, "_newInputMax", 2);
b([
  p()
], h.prototype, "_newInputTermsPreset", 2);
b([
  p()
], h.prototype, "_newInputModalError", 2);
b([
  p()
], h.prototype, "_showRuleBuilderModal", 2);
b([
  p()
], h.prototype, "_editingRuleIndex", 2);
b([
  p()
], h.prototype, "_builderConditions", 2);
b([
  p()
], h.prototype, "_builderConsequent", 2);
b([
  p()
], h.prototype, "_ruleBuilderError", 2);
b([
  p()
], h.prototype, "_rulesViewMode", 2);
h = b([
  J("fuzzy-system-editor")
], h);
var se = Object.defineProperty, ie = Object.getOwnPropertyDescriptor, E = (e, t, s, i) => {
  for (var a = i > 1 ? void 0 : i ? ie(t, s) : t, r = e.length - 1, n; r >= 0; r--)
    (n = e[r]) && (a = (i ? n(t, s, a) : n(a)) || a);
  return i && a && se(t, s, a), a;
};
let x = class extends A {
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
        this._templates = await Zt(this.hass);
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
      const t = await Kt(
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
var ae = Object.defineProperty, re = Object.getOwnPropertyDescriptor, z = (e, t, s, i) => {
  for (var a = i > 1 ? void 0 : i ? re(t, s) : t, r = e.length - 1, n; r >= 0; r--)
    (n = e[r]) && (a = (i ? n(t, s, a) : n(a)) || a);
  return i && a && ae(t, s, a), a;
};
let _ = class extends A {
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
