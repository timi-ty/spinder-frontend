const htmlElement = document.documentElement;
const computedStyle = window.getComputedStyle(htmlElement);
const rootFontSize = computedStyle.fontSize;
const rootFontSizePx = parseFloat(rootFontSize);

function pxToRem(px: number): number {
  return px / rootFontSizePx;
}

function remToPx(rem: number): number {
  return rem * rootFontSizePx;
}

function shuffleArrayInPlace<T>(array: T[]) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    // Swap array[i] and array[j]
    [array[i], array[j]] = [array[j], array[i]];
  }
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function isMobileTouchDevice() {
  return (
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    ) &&
    ("ontouchstart" in window || navigator.maxTouchPoints > 0)
  );
}

function normalizeRotation(degrees: number) {
  return ((((degrees + 180) % 360) + 360) % 360) - 180;
}

const nullTimeoutHandle: NodeJS.Timeout | null = null;

export {
  pxToRem,
  remToPx,
  normalizeRotation,
  nullTimeoutHandle,
  shuffleArrayInPlace,
  lerp,
  isMobileTouchDevice,
};
