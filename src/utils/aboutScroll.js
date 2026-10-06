// Center the whole About composition; use a safe top anchor on short screens.
export function getAboutScrollTop(section) {
  const content = section.querySelector('.ab-section') || section
  const bounds = content.getBoundingClientRect()
  const top = bounds.height <= window.innerHeight - 128
    ? bounds.top + window.scrollY + bounds.height / 2 - window.innerHeight / 2
    : bounds.top + window.scrollY - 96
  return Math.max(0, top)
}
