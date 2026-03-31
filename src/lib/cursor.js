let x = -9999;
let y = -9999;
const listeners = new Set();

// Check if mobile device
const isMobile = typeof navigator !== "undefined" && navigator.maxTouchPoints > 1;

// Global mousemove listener
if (typeof window !== "undefined" && !isMobile) {
  window.addEventListener("mousemove", (e) => {
    x = e.clientX;
    y = e.clientY;
    listeners.forEach((fn) => fn({ x, y }));
  });

  // Reset cursor position when mouse leaves the page
  window.addEventListener("mouseout", () => {
    x = -9999;
    y = -9999;
    listeners.forEach((fn) => fn({ x, y }));
  });
}

// Subscribe function for components
export function subscribe(fn) {
  listeners.add(fn);
  fn({ x, y });
  return () => listeners.delete(fn);
}

// Get current cursor position
export function getCursor() {
  return { x, y };
}