/**
 * Safely registers a custom element if it hasn't been defined yet,
 * preventing 'the name has already been used with this registry' errors
 * during dynamic script reloads in Home Assistant.
 */
export function safeCustomElement(tagName: string) {
  return (clazz: any) => {
    if (typeof customElements !== "undefined" && !customElements.get(tagName)) {
      customElements.define(tagName, clazz);
    }
    return clazz;
  };
}
