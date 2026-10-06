// Align the composition with the same offset used by section anchors.
export function getAboutScrollTop(section) {
  const margin = parseFloat(window.getComputedStyle(section).scrollMarginTop) || 96
  return Math.max(0, window.scrollY + section.getBoundingClientRect().top - margin)
}
