import { useRef, useEffect } from "preact/hooks";
import { subscribe } from "../lib/cursor.js";

/* Navbar that tracks the position of the mouse cursor relative to it */
export default function MouseNavbar({ children }) {
  const navRef = useRef(null);

  useEffect(() => {
    const navbar = navRef.current;

    const unsubscribe = subscribe(({ x, y }) => {
      const rect = navbar.getBoundingClientRect();
      const relX = x - rect.left;
      const relY = y - rect.top;

      navbar.style.setProperty("--x", `${relX}px`);
      navbar.style.setProperty("--y", `${relY}px`);
    });

    return () => unsubscribe();
  }, []);

  return <nav ref={navRef} id="navbar">{children}</nav>;
}
