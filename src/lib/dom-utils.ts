// Small DOM helpers shared by the HanziWriter wrapper components.

/** Removes all child nodes from an element without using innerHTML. */
export function clearChildren(element: Element): void {
  while (element.firstChild) {
    element.removeChild(element.firstChild)
  }
}
