const htmlElement = document.documentElement;
const computedStyle = window.getComputedStyle(htmlElement);
const rootFontSize = computedStyle.fontSize;
const rootFontSizePx = parseFloat(rootFontSize);

function pxToRem(px: number): number {
  return px / rootFontSizePx;
}

const nullTimeoutHandle: NodeJS.Timeout | null = null;

export { pxToRem, nullTimeoutHandle };
