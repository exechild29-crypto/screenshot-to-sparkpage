/** How far the sliding panel has entered: 0 = top edge at the viewport bottom, 1 = fills the viewport. */
export function slideProgress(panelTop: number, viewportH: number) {
  if (viewportH <= 0) return 1;
  return Math.min(1, Math.max(0, 1 - panelTop / viewportH));
}

/** Edge shadow strength: rises as the panel starts to cover, gone once it has fully entered. */
export function edgeStrength(p: number) {
  if (p <= 0 || p >= 1) return 0;
  return Math.min(1, p * 6) * Math.pow(1 - p, 0.6);
}
