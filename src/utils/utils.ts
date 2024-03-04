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

const nullTimeoutHandle: NodeJS.Timeout | null = null;

export { pxToRem, remToPx, nullTimeoutHandle };
