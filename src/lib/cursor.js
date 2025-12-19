let x = 0;
let y = 0;
const listeners = new Set();

// Single global mousemove listener
if (typeof window !== "undefined") {
  window.addEventListener("mousemove", (e) => {
    x = e.clientX;
    y = e.clientY;
    listeners.forEach((fn) => fn({ x, y }));
  });
}

// Subscribe function for components
export function subscribe(fn) {
  listeners.add(fn);
  // Call immediately with current cursor position
  fn({ x, y });
  return () => listeners.delete(fn);
}

// Get current cursor position
export function getCursor() {
  return { x, y };
}