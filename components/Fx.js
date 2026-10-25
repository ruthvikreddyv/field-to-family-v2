import { useEffect, useRef } from "react";

// Small, cheap visual effects. Everything here is skipped for people who prefer reduced motion,
// and the cursor effect only runs on devices with a real mouse.

export function burst(x, y) {
  if (typeof window === "undefined" || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const colors = ["#6c8f58", "#4d8a3a", "#e2901f", "#8cc152"];
  for (let i = 0; i < 9; i++) {
    const el = document.createElement("span");
    el.className = "leafbit";
    el.style.left = x + "px"; el.style.top = y + "px";
    el.style.background = colors[i % colors.length];
    document.body.appendChild(el);
    const a = (Math.PI * 2 * i) / 9 + Math.random() * 0.5;
    const d = 28 + Math.random() * 30;
    const anim = el.animate(
      [{ transform: "translate(-50%,-50%) scale(1) rotate(0)", opacity: 1 },
       { transform: `translate(calc(-50% + ${Math.cos(a) * d}px), calc(-50% + ${Math.sin(a) * d - 14}px)) scale(.3) rotate(${Math.random() * 200}deg)`, opacity: 0 }],
      { duration: 650, easing: "cubic-bezier(.2,.7,.3,1)" }
    );
    anim.onfinish = () => el.remove();
  }
}

export default function Fx() {
  const ring = useRef(null);
  const dot = useRef(null);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // scroll reveal for static sections
    const targets = [...document.querySelectorAll(".step, .promises > div, .g-card, .contact-card, .contact h2, .gallery h2")];
    let io;
    if (!reduce && "IntersectionObserver" in window) {
      targets.forEach((t, i) => { t.classList.add("rv"); t.style.transitionDelay = (i % 3) * 70 + "ms"; });
      io = new IntersectionObserver((entries) => {
        entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
      }, { threshold: 0.12 });
      targets.forEach((t) => io.observe(t));
    }

    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    if (reduce || !fine) return () => io && io.disconnect();

    let x = -100, y = -100, rx = -100, ry = -100, raf = 0, live = true;
    const hero = document.querySelector(".hero");
    const move = (e) => {
      x = e.clientX; y = e.clientY;
      if (hero) {
        const r = hero.getBoundingClientRect();
        if (y >= r.top && y <= r.bottom) {
          hero.style.setProperty("--px", ((x - r.left) / r.width - 0.5).toFixed(3));
          hero.style.setProperty("--py", ((y - r.top) / r.height - 0.5).toFixed(3));
        }
      }
      const hot = e.target.closest && e.target.closest("a,button,select,label,summary,[role=option],.row,.g-card,.step");
      if (ring.current) ring.current.classList.toggle("hot", !!hot);
    };
    const down = () => ring.current && ring.current.classList.add("down");
    const up = () => ring.current && ring.current.classList.remove("down");
    const leave = () => { x = y = -100; };
    const tick = () => {
      if (!live) return;
      rx += (x - rx) * 0.2; ry += (y - ry) * 0.2;
      if (ring.current) ring.current.style.transform = `translate(${rx}px,${ry}px)`;
      if (dot.current) dot.current.style.transform = `translate(${x}px,${y}px)`;
      raf = requestAnimationFrame(tick);
    };
    document.addEventListener("pointermove", move, { passive: true });
    document.addEventListener("pointerdown", down, { passive: true });
    document.addEventListener("pointerup", up, { passive: true });
    document.documentElement.addEventListener("pointerleave", leave);
    document.documentElement.classList.add("has-cursor");
    raf = requestAnimationFrame(tick);
    return () => {
      live = false; cancelAnimationFrame(raf); io && io.disconnect();
      document.removeEventListener("pointermove", move);
      document.removeEventListener("pointerdown", down);
      document.removeEventListener("pointerup", up);
      document.documentElement.removeEventListener("pointerleave", leave);
      document.documentElement.classList.remove("has-cursor");
    };
  }, []);

  return (
    <>
      <div className="cur-ring" ref={ring} aria-hidden="true" />
      <div className="cur-dot" ref={dot} aria-hidden="true" />
    </>
  );
}
