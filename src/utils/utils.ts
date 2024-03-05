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

const nullTimeoutHandle: NodeJS.Timeout | null = null;

export { pxToRem, remToPx, nullTimeoutHandle, shuffleArrayInPlace };
