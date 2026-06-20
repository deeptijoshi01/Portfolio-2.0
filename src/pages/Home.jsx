import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import developerImg from "../assets/developer.png";

/* ── Intersection Observer hook ── */
function useInView(threshold = 0.12) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, visible];
}

/* ── Animated counter ── */
function Counter({ to, suffix = "", duration = 1800 }) {
  const [count, setCount] = useState(0);
  const [ref, visible] = useInView(0.3);
  useEffect(() => {
    if (!visible) return;
    let start = 0;
    const step = Math.max(1, Math.ceil(to / (duration / 16)));
    const t = setInterval(() => {
      start += step;
      if (start >= to) { setCount(to); clearInterval(t); }
      else setCount(start);
    }, 16);
    return () => clearInterval(t);
  }, [visible, to, duration]);
  return <span ref={ref}>{count}{suffix}</span>;
}

/* ── Typewriter effect ── */
function Typewriter({ words, speed = 85, pause = 1700 }) {
  const [text, setText] = useState("");
  const [wi, setWi] = useState(0);
  const [deleting, setDeleting] = useState(false);
  useEffect(() => {
    const current = words[wi];
    const timeout = setTimeout(() => {
      if (!deleting) {
        setText(current.slice(0, text.length + 1));
        if (text.length + 1 === current.length) setTimeout(() => setDeleting(true), pause);
      } else {
        setText(current.slice(0, text.length - 1));
        if (text.length - 1 === 0) { setDeleting(false); setWi((wi + 1) % words.length); }
      }
    }, deleting ? speed / 2 : speed);
    return () => clearTimeout(timeout);
  }, [text, deleting, wi, words, speed, pause]);
  return (
    <span className="tw-wrap">
      {text}
      <span className="tw-cursor">|</span>
    </span>
  );
}

/* ── Magnetic wrapper — buttons pull toward the cursor ── */
function Magnetic({ children, strength = 18, className = "", as: As = "div", ...rest }) {
  const ref = useRef(null);
  const onMove = (e) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width - 0.5) * strength;
    const y = ((e.clientY - r.top) / r.height - 0.5) * strength;
    el.style.transform = `translate(${x}px, ${y}px)`;
  };
  const onLeave = () => { if (ref.current) ref.current.style.transform = "translate(0,0)"; };
  return (
    <As ref={ref} className={`magnetic ${className}`} onMouseMove={onMove} onMouseLeave={onLeave} {...rest}>
      {children}
    </As>
  );
}

/* ── Rotating seal — orbiting label around the avatar ── */
function RotatingSeal({ text = "REACT  •  NODE.JS  •  MONGODB  •  MERN STACK  •  " }) {
  const id = "seal-path";
  return (
    <svg className="seal-svg" viewBox="0 0 200 200">
      <defs>
        <path id={id} d="M 100,100 m -78,0 a 78,78 0 1,1 156,0 a 78,78 0 1,1 -156,0" />
      </defs>
      <text>
        <textPath href={`#${id}`} startOffset="0%">{text.repeat(2)}</textPath>
      </text>
    </svg>
  );
}

/* ── Split-letter heading reveal ── */
function SplitReveal({ text, delayBase = 0, className = "", gradient = false }) {
  return (
    <span className={`split-reveal ${className}`} aria-label={text}>
      {text.split("").map((ch, i) => (
        <span
          key={i}
          className={`split-char ${gradient ? "split-char-grad" : ""}`}
          style={{ animationDelay: `${delayBase + i * 0.035}s` }}
        >
          {ch === " " ? "\u00A0" : ch}
        </span>
      ))}
    </span>
  );
}

/* ── Contact / social links — single source of truth ── */
const CONTACT = {
  email: "deeptiajoshi01@gmail.com",
  phone: "+91 79726 43129",
  phoneHref: "tel:+917972643129",
  github: "https://github.com/deeptijoshi01/",
  linkedin: "https://www.linkedin.com/in/deepti-joshi-23434724b/",
  portfolio: "https://portfolio-deepj.netlify.app",
};

const skills = [
  { name: "React.js", level: 90, color: "#c9a35d", icon: "⚛" },
  { name: "JavaScript", level: 88, color: "#d8b76b", icon: "JS" },
  { name: "Node.js / Express", level: 78, color: "#9fb39a", icon: "⬡" },
  { name: "Tailwind CSS", level: 85, color: "#8fb7c9", icon: "✦" },
  { name: "MongoDB", level: 72, color: "#9fb39a", icon: "◈" },
  { name: "MySQL / PHP", level: 70, color: "#c98f9f", icon: "⊡" },
];

const techStack = [
  { label: "React.js", color: "#c9a35d1a", border: "#c9a35d40", text: "#d8b76b" },
  { label: "JavaScript", color: "#d8b76b1a", border: "#d8b76b40", text: "#d8b76b" },
  { label: "Node.js", color: "#9fb39a1a", border: "#9fb39a40", text: "#9fb39a" },
  { label: "Express.js", color: "#ffffff0c", border: "#ffffff1e", text: "#e7ddc9" },
  { label: "MongoDB", color: "#9fb39a1a", border: "#9fb39a40", text: "#9fb39a" },
  { label: "MySQL", color: "#8fb7c91a", border: "#8fb7c940", text: "#8fb7c9" },
  { label: "Tailwind CSS", color: "#8fb7c91a", border: "#8fb7c940", text: "#8fb7c9" },
  { label: "PHP", color: "#b59fc91a", border: "#b59fc940", text: "#b59fc9" },
  { label: "Python", color: "#d8c46b1a", border: "#d8c46b40", text: "#d8c46b" },
  { label: "Socket.IO", color: "#ffffff0c", border: "#ffffff1e", text: "#e7ddc9" },
  { label: "Git & GitHub", color: "#c9956f1a", border: "#c9956f40", text: "#c9956f" },
  { label: "REST APIs", color: "#c98f9f1a", border: "#c98f9f40", text: "#c98f9f" },
];

export default function Home() {
  const [heroVisible, setHeroVisible] = useState(false);
  const [mouse, setMouse] = useState({ x: 50, y: 45 });
  const [aboutRef, aboutVisible] = useInView();
  const [statsRef, statsVisible] = useInView();
  const [skillsRef, skillsVisible] = useInView();
  const [techRef, techVisible] = useInView();
  const [contactRef, contactVisible] = useInView();

  useEffect(() => {
    const t = setTimeout(() => setHeroVisible(true), 100);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const fn = (e) => setMouse({ x: (e.clientX / window.innerWidth) * 100, y: (e.clientY / window.innerHeight) * 100 });
    window.addEventListener("mousemove", fn, { passive: true });
    return () => window.removeEventListener("mousemove", fn);
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,500;1,600;1,700&family=Manrope:wght@300;400;500;600;700&family=DM+Mono:wght@300;400;500&display=swap');

        /* ── TOKENS ── */
        :root[data-theme="dark"] {
          --bg: #0b0a08;
          --surface: rgba(247,240,224,0.035);
          --surface2: rgba(247,240,224,0.06);
          --border: rgba(247,240,224,0.09);
          --border2: rgba(201,163,93,0.32);
          --text: #f3ede1;
          --muted: rgba(243,237,225,0.5);
          --muted2: rgba(243,237,225,0.26);
          --a1: #c9a35d;
          --a2: #c98f9f;
          --a3: #9fb39a;
          --g1: rgba(201,163,93,0.16);
          --g2: rgba(201,143,159,0.1);
          --g3: rgba(159,179,154,0.08);
          --card: rgba(247,240,224,0.032);
          --card-h: rgba(247,240,224,0.065);
          --stat-bg: rgba(247,240,224,0.04);
        }
        :root[data-theme="light"] {
          --bg: #f8f4ea;
          --surface: rgba(20,15,5,0.03);
          --surface2: rgba(20,15,5,0.05);
          --border: rgba(20,15,5,0.09);
          --border2: rgba(150,110,40,0.28);
          --text: #251f15;
          --muted: rgba(37,31,21,0.56);
          --muted2: rgba(37,31,21,0.3);
          --a1: #9c7228;
          --a2: #a23f5b;
          --a3: #3e6b4c;
          --g1: rgba(156,114,40,0.12);
          --g2: rgba(162,63,91,0.07);
          --g3: rgba(62,107,76,0.06);
          --card: rgba(20,15,5,0.03);
          --card-h: rgba(20,15,5,0.055);
          --stat-bg: rgba(20,15,5,0.04);
        }

        .hp { background: var(--bg); min-height: 100vh; transition: background 0.4s; overflow-x: hidden; }
        .hp * { -webkit-tap-highlight-color: transparent; }

        .hp::before {
          content: ''; position: fixed; inset: 0; z-index: 0; pointer-events: none;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E");
          opacity: 0.025; mix-blend-mode: overlay;
        }

        @media (prefers-reduced-motion: reduce) {
          .hp *, .hp *::before, .hp *::after { animation-duration: 0.01ms !important; animation-iteration-count: 1 !important; transition-duration: 0.01ms !important; }
        }

        /* ── HERO ── */
        .hero {
          position: relative; z-index: 1;
          min-height: calc(100svh - 62px);
          display: flex; align-items: center;
          padding: 3.2rem 1.25rem 4.5rem;
          overflow: hidden;
        }
        .hero-glow {
          position: absolute; inset: 0; pointer-events: none;
          background:
            radial-gradient(ellipse 65% 55% at var(--mx,48%) var(--my,42%), var(--g1) 0%, transparent 65%),
            radial-gradient(ellipse 45% 45% at 82% 75%, var(--g2) 0%, transparent 60%),
            radial-gradient(ellipse 40% 40% at 15% 85%, var(--g3) 0%, transparent 55%);
          transition: background-position .3s ease-out;
        }
        .hero-grid {
          position: absolute; inset: 0; pointer-events: none;
          background-image:
            linear-gradient(var(--border) 1px, transparent 1px),
            linear-gradient(90deg, var(--border) 1px, transparent 1px);
          background-size: 64px 64px;
          mask-image: radial-gradient(ellipse 75% 75% at 50% 50%, black 20%, transparent 80%);
          opacity: 0.4;
        }
        .hero-dot { position: absolute; border-radius: 50%; pointer-events: none; filter: blur(70px); }
        .hero-dot-1 {
          width: 340px; height: 340px;
          background: radial-gradient(circle, rgba(201,163,93,0.16) 0%, transparent 70%);
          top: -70px; right: -50px;
          animation: orb-drift1 9s ease-in-out infinite;
        }
        .hero-dot-2 {
          width: 260px; height: 260px;
          background: radial-gradient(circle, rgba(201,143,159,0.11) 0%, transparent 70%);
          bottom: 0; left: -30px;
          animation: orb-drift2 11s ease-in-out infinite;
        }
        @keyframes orb-drift1 { 0%,100% { transform: translate(0,0) scale(1); } 50% { transform: translate(-24px, 20px) scale(1.06); } }
        @keyframes orb-drift2 { 0%,100% { transform: translate(0,0) scale(1); } 50% { transform: translate(18px, -15px) scale(1.05); } }

        .hero-inner {
          position: relative; z-index: 2;
          max-width: 880px; width: 100%; margin: 0 auto;
          display: grid; grid-template-columns: 1fr auto; gap: 2.2rem; align-items: center;
        }
        @media (max-width: 700px) {
          .hero-inner { grid-template-columns: 1fr; }
          .hero-avatar-wrap { order: -1; margin: 0 auto 0.4rem; width: 168px; height: 168px; }
          .hero-avatar { width: 168px; height: 168px; }
          .avatar-ring { inset: -10px; }
          .avatar-ring2 { inset: -20px; }
        }

        .fu { opacity: 0; transform: translateY(22px);
          transition: opacity 0.7s cubic-bezier(.16,1,.3,1), transform 0.7s cubic-bezier(.16,1,.3,1); }
        .fu.on { opacity: 1; transform: none; }
        .d0{transition-delay:.04s} .d1{transition-delay:.14s} .d2{transition-delay:.26s}
        .d3{transition-delay:.38s} .d4{transition-delay:.50s} .d5{transition-delay:.62s}

        .rv { opacity: 0; transform: translateY(28px);
          transition: opacity 0.65s cubic-bezier(.16,1,.3,1), transform 0.65s cubic-bezier(.16,1,.3,1); }
        .rv.on { opacity: 1; transform: none; }
        .rd1{transition-delay:.04s} .rd2{transition-delay:.12s} .rd3{transition-delay:.2s}

        .hero-eyebrow {
          display: inline-flex; align-items: center; gap: 8px;
          font-family: 'DM Mono', monospace;
          font-size: 10px; letter-spacing: 0.16em; text-transform: uppercase;
          color: var(--a3);
          border: 1px solid rgba(159,179,154,0.32);
          background: rgba(159,179,154,0.08);
          padding: 5px 13px 5px 10px; border-radius: 20px;
          margin-bottom: 1.3rem;
        }
        .pulse { width:6px; height:6px; border-radius:50%; background:var(--a3); animation: pulse-d 2s ease-in-out infinite; }
        @keyframes pulse-d { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.4;transform:scale(.75)} }

        .hero-hi {
          font-family: 'Manrope', sans-serif;
          font-size: clamp(.85rem, 2vw, .95rem);
          font-weight: 300; color: var(--muted);
          margin-bottom: .3rem; letter-spacing: .04em;
        }
        .hero-name {
          font-family: 'Cormorant Garamond', serif;
          font-style: italic;
          font-size: clamp(3.1rem, 9vw, 5.8rem);
          font-weight: 600; line-height: .98;
          letter-spacing: -0.01em;
          color: var(--text);
          margin-bottom: .18em;
          position: relative;
        }
        .hero-name-grad {
          background: linear-gradient(125deg, var(--a1) 0%, var(--a2) 55%, var(--a1) 100%);
          background-size: 200% 200%;
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: grad-shift 5s ease-in-out infinite;
        }
        @keyframes grad-shift { 0%,100%{background-position:0% 50%} 50%{background-position:100% 50%} }

        .name-underline {
          display: block; height: 6px; margin-top: 2px;
        }
        .name-underline svg { width: 220px; max-width: 60%; height: 100%; overflow: visible; }
        .name-underline path {
          stroke: var(--a1); stroke-width: 2; fill: none;
          stroke-dasharray: 280; stroke-dashoffset: 280;
          animation: draw-line 1.1s cubic-bezier(.65,0,.35,1) 1.1s forwards;
        }
        @keyframes draw-line { to { stroke-dashoffset: 0; } }

        .hero-tw {
          font-family: 'Manrope', sans-serif;
          font-size: clamp(.95rem, 2.3vw, 1.12rem);
          font-weight: 400; color: var(--muted);
          min-height: 1.8em; margin-bottom: 1.3rem; letter-spacing: .01em;
        }
        .tw-wrap::before { content: '— '; color: var(--a1); font-weight: 600; }
        .tw-cursor { color: var(--a1); font-weight: 300; animation: blink .85s step-end infinite; }
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }

        .hero-desc {
          font-family: 'Manrope', sans-serif;
          font-size: 14px; line-height: 1.85;
          color: var(--muted); max-width: 460px;
          margin-bottom: 1.9rem; font-weight: 300;
        }
        .hero-desc strong { color: var(--text); font-weight: 600; }

        .hero-ctas { display: flex; flex-wrap: wrap; gap: 10px; margin-bottom: 1.9rem; }

        .btn-p {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 12px 24px; border-radius: 999px;
          background: linear-gradient(135deg, var(--a1), var(--a2));
          color: #19140a; font-family: 'Manrope', sans-serif;
          font-size: 13px; font-weight: 700; letter-spacing: .015em;
          text-decoration: none; border: none; cursor: pointer;
          box-shadow: 0 4px 22px var(--g1);
          transition: transform .2s, box-shadow .2s, filter .2s;
        }
        .btn-p:hover { transform: translateY(-2px) scale(1.02); filter: brightness(1.07); box-shadow: 0 8px 30px var(--g1); }
        .btn-p:active { transform: translateY(0) scale(0.98); }

        .btn-s {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 11px 22px; border-radius: 999px;
          background: var(--surface2); border: 1px solid var(--border2);
          color: var(--text); font-family: 'Manrope', sans-serif;
          font-size: 13px; font-weight: 500; letter-spacing: .015em;
          text-decoration: none; cursor: pointer;
          transition: transform .2s, background .2s, border-color .2s;
        }
        .btn-s:hover { transform: translateY(-2px); border-color: var(--a1); background: var(--card-h); }
        .btn-s:active { transform: translateY(0); }

        .hero-socials { display: flex; gap: 8px; flex-wrap: wrap; }
        .soc-btn {
          width: 38px; height: 38px; border-radius: 10px;
          border: 1px solid var(--border);
          background: var(--surface);
          color: var(--muted); font-family: 'DM Mono', monospace;
          font-size: 12px; display: flex; align-items: center; justify-content: center;
          cursor: pointer; text-decoration: none;
          transition: border-color .2s, color .2s, background .2s, transform .18s;
        }
        .soc-btn:hover { border-color: var(--a1); color: var(--a1); background: rgba(201,163,93,0.1); transform: translateY(-2px) rotate(-4deg); }
        .soc-btn:active { transform: translateY(0) rotate(0); }

        .hero-avatar-wrap { position: relative; flex-shrink: 0; width: 260px; height: 260px; margin: 30px; }
        .hero-avatar {
          width: 260px; height: 260px; border-radius: 50%;
          background: linear-gradient(135deg, var(--surface2), var(--surface));
          border: 1px solid var(--border2);
          display: flex; align-items: center; justify-content: center;
          position: relative; overflow: hidden;
          box-shadow: 0 20px 56px var(--g1), 0 0 0 1px var(--border);
        }
        .hero-avatar-img {
          width: 80%; height: 80%; object-fit: contain;
          filter: drop-shadow(0 0 22px rgba(201,163,93,0.4));
          animation: avatar-float 5s ease-in-out infinite;
        }
        @keyframes avatar-float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
        .avatar-ring { position: absolute; inset: -16px; border-radius: 50%; border: 1px solid var(--border2); opacity: .4; animation: ring-spin 14s linear infinite; }
        .avatar-ring2 { position: absolute; inset: -30px; border-radius: 50%; border: 1px dashed var(--border2); opacity: .2; animation: ring-spin 22s linear infinite reverse; }
        @keyframes ring-spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        .avatar-badge {
          position: absolute; bottom: 4px; right: -4px;
          background: linear-gradient(135deg, var(--a1), var(--a2));
          color: #19140a; font-family: 'DM Mono', monospace;
          font-size: 9px; font-weight: 600; letter-spacing: .04em;
          padding: 5px 10px; border-radius: 20px; white-space: nowrap;
          box-shadow: 0 4px 16px var(--g1); z-index: 3;
        }

        .scroll-hint {
          position: absolute; bottom: 1.6rem; left: 50%; transform: translateX(-50%);
          display: flex; flex-direction: column; align-items: center; gap: 5px;
          color: var(--muted2); font-family: 'DM Mono', monospace;
          font-size: 9px; letter-spacing: .14em; text-transform: uppercase;
          opacity: 0; transition: opacity .6s ease 1.3s;
        }
        .scroll-hint.on { opacity: 1; }
        .scroll-line { width:1px; height:32px; background: linear-gradient(to bottom, var(--a1), transparent); animation: scroll-bob 2.2s ease-in-out infinite; }
        @keyframes scroll-bob { 0%,100%{transform:translateY(0)} 50%{transform:translateY(7px)} }

        /* ── SECTIONS ── */
        .sec { position: relative; z-index: 1; padding: 4.6rem 1.25rem; max-width: 900px; margin: 0 auto; }
        .sec-label {
          font-family: 'DM Mono', monospace; font-size: 10px; font-weight: 400;
          color: var(--a1); letter-spacing: .18em; text-transform: uppercase;
          margin-bottom: .55rem; display: flex; align-items: center; gap: 10px;
        }
        .sec-label::after { content:''; flex:1; max-width:44px; height:1px; background:var(--a1); opacity:.35; }
        .sec-title {
          font-family: 'Cormorant Garamond', serif; font-style: italic;
          font-size: clamp(2rem, 5vw, 2.9rem); font-weight: 600; line-height: 1.08;
          color: var(--text); margin-bottom: .7rem; letter-spacing: -.01em;
        }
        .sec-title em { font-style:normal; color:var(--a1); font-family: 'Manrope', sans-serif; font-weight: 700; font-size: .55em; vertical-align: middle; letter-spacing: .03em; }
        .sec-sub { font-family: 'Manrope', sans-serif; font-size: 13.5px; color: var(--muted); max-width: 500px; line-height: 1.8; font-weight: 300; }

        .divider { max-width: 900px; margin: 0 auto; height: 1px; background: linear-gradient(90deg, transparent, var(--border2), transparent); position: relative; z-index: 1; }

        /* ── ABOUT ── */
        .about-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 2.2rem; margin-top: 2rem; align-items: start; }
        @media (max-width: 640px) { .about-grid { grid-template-columns: 1fr; } }

        .about-text { font-family: 'Manrope', sans-serif; font-size: 14px; line-height: 1.9; color: var(--muted); font-weight: 300; }
        .about-text p+p { margin-top: .9rem; }
        .about-text strong { color: var(--text); font-weight: 600; }

        .tags { display: flex; flex-wrap: wrap; gap: 7px; margin-top: 1.2rem; }
        .tag {
          padding: 4px 11px; border-radius: 999px;
          background: rgba(201,163,93,0.08); color: var(--a1);
          border: 1px solid rgba(201,163,93,0.2);
          font-family: 'DM Mono', monospace; font-size: 10px; letter-spacing: .04em;
          transition: background .2s, transform .15s; cursor: default;
        }
        .tag:hover { background: rgba(201,163,93,0.16); transform: translateY(-1px); }

        .info-card { background: var(--card); border: 1px solid var(--border); border-radius: 16px; padding: 1.4rem; display: flex; flex-direction: column; gap: 1.05rem; transition: background .3s; }
        .info-card:hover { background: var(--card-h); }
        .info-row { display: flex; align-items: center; gap: 11px; text-decoration: none; }
        .info-icon { width: 36px; height: 36px; border-radius: 9px; background: var(--surface2); border: 1px solid var(--border); display: flex; align-items: center; justify-content: center; font-size: 15px; flex-shrink: 0; }
        .info-label { font-family:'Manrope',sans-serif; font-size:13px; font-weight:600; color:var(--text); }
        .info-sub { font-family:'Manrope',sans-serif; font-size:11px; color:var(--muted); margin-top:1px; font-weight: 300; }
        a.info-row .info-label, a.info-row .info-sub { transition: color .2s; }
        a.info-row:hover .info-label { color: var(--a1); }

        /* ── STATS ── */
        .stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: .9rem; margin-top: 1.8rem; }
        @media (max-width: 700px) { .stats-grid { grid-template-columns: repeat(2,1fr); } }
        .stat-card { background: var(--stat-bg); border: 1px solid var(--border); border-radius: 14px; padding: 1.3rem 1rem; text-align: center; transition: background .2s, border-color .2s, transform .2s; cursor: default; }
        .stat-card:hover { background: var(--card-h); border-color: var(--border2); transform: translateY(-3px); }
        .stat-num {
          font-family: 'Cormorant Garamond', serif; font-style: italic;
          font-size: 2.5rem; font-weight: 600;
          background: linear-gradient(135deg, var(--a1), var(--a2));
          -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
          line-height: 1; margin-bottom: 4px;
        }
        .stat-lbl { font-family:'DM Mono',monospace; font-size:10px; color:var(--muted); letter-spacing:.04em; text-transform: uppercase; }

        /* ── SKILLS ── */
        .skills-wrap { display: grid; grid-template-columns: 1fr 1fr; gap: .9rem 2.4rem; margin-top: 1.8rem; }
        @media (max-width: 560px) { .skills-wrap { grid-template-columns: 1fr; } }
        .skill-row { display: flex; flex-direction: column; gap: 6px; }
        .skill-top { display: flex; justify-content: space-between; align-items: center; }
        .skill-name { font-family:'Manrope',sans-serif; font-size:13px; font-weight:500; color:var(--text); display:flex; align-items:center; gap:6px; }
        .skill-icon { font-size:11px; opacity:.7; }
        .skill-pct { font-family:'DM Mono',monospace; font-size:10px; color:var(--muted); }
        .skill-track { height:3px; border-radius:3px; background:rgba(247,240,224,0.08); overflow:hidden; }
        .skill-fill { height:100%; border-radius:3px; width:0; transition:width 1.2s cubic-bezier(.16,1,.3,1); }

        .tech-grid { display:flex; flex-wrap:wrap; gap:7px; margin-top:1.7rem; }
        .tech-chip { padding: 6px 13px; border-radius: 999px; font-family: 'DM Mono', monospace; font-size: 10.5px; border: 1px solid; cursor: default; transition: transform .15s, filter .15s; white-space: nowrap; flex-shrink: 0; }
        .tech-chip:hover { transform: translateY(-2px) scale(1.03); filter: brightness(1.2); }

        /* ── marquee tech strip ── */
        .marquee-mask {
          overflow: hidden; position: relative; width: 100%;
          mask-image: linear-gradient(90deg, transparent, black 8%, black 92%, transparent);
          -webkit-mask-image: linear-gradient(90deg, transparent, black 8%, black 92%, transparent);
        }
        .marquee-track {
          display: flex; gap: 9px; width: max-content;
          animation: marquee-scroll 26s linear infinite;
        }
        .marquee-mask:hover .marquee-track { animation-play-state: paused; }
        @keyframes marquee-scroll { from { transform: translateX(0); } to { transform: translateX(-50%); } }

        /* ── split-letter reveal ── */
        .split-reveal { display: inline-block; }
        .split-char {
          display: inline-block;
          opacity: 0; transform: translateY(0.6em) rotate(4deg);
          animation: char-rise 0.65s cubic-bezier(.16,1,.3,1) forwards;
        }
        @keyframes char-rise { to { opacity: 1; transform: translateY(0) rotate(0); } }

        .split-char-grad {
          background: linear-gradient(125deg, var(--a1) 0%, var(--a2) 55%, var(--a1) 100%);
          background-size: 200% 200%;
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: char-rise 0.65s cubic-bezier(.16,1,.3,1) forwards, grad-shift 5s ease-in-out infinite;
        }

        /* ── magnetic buttons ── */
        .magnetic { transition: transform .25s cubic-bezier(.16,1,.3,1); display: inline-flex; }

        /* ── rotating seal around avatar ── */
        .seal-svg {
          position: absolute; top: 50%; left: 50%;
          width: 360px; height: 360px;
          transform: translate(-50%, -50%);
          animation: seal-spin 18s linear infinite;
          pointer-events: none; opacity: .85;
        }
        .seal-svg text {
          font-family: 'DM Mono', monospace; font-size: 8.6px; letter-spacing: .25em;
          fill: var(--a1); text-transform: uppercase;
        }
        @keyframes seal-spin { from { transform: translate(-50%, -50%) rotate(0deg); } to { transform: translate(-50%, -50%) rotate(360deg); } }
        @media (max-width: 700px) { .seal-svg { width: 240px; height: 240px; } }

        /* ── CONTACT TEASER ── */
        .contact-teaser { position: relative; z-index: 1; padding: 3.6rem 1.25rem 5.5rem; max-width: 900px; margin: 0 auto; text-align: center; }
        .contact-box { background: var(--card); border: 1px solid var(--border2); border-radius: 22px; padding: 3rem 1.6rem; position: relative; overflow: hidden; }
        .contact-box::before { content:''; position:absolute; inset:0; background: radial-gradient(ellipse 60% 60% at 50% 0%, var(--g1), transparent 70%); pointer-events:none; }
        .contact-box-title { font-family:'Cormorant Garamond',serif; font-style: italic; font-size:clamp(1.7rem,4.5vw,2.4rem); font-weight:600; color:var(--text); margin-bottom:.7rem; position:relative; }
        .contact-box-sub { font-family:'Manrope',sans-serif; font-size:13.5px; font-weight:300; color:var(--muted); max-width:400px; margin:0 auto 1.8rem; line-height:1.8; position:relative; }
        .contact-links { display:flex; justify-content:center; gap:9px; flex-wrap:wrap; position:relative; margin-top: 1.4rem; }
      `}</style>

      <div className="hp">
        {/* ── HERO ── */}
        <section className="hero">
          <div className="hero-glow" style={{ "--mx": `${mouse.x}%`, "--my": `${mouse.y}%` }} />
          <div className="hero-grid" />
          <div className="hero-dot hero-dot-1" />
          <div className="hero-dot hero-dot-2" />

          <div className="hero-inner">
            {/* LEFT */}
            <div>
              <div className={`fu d0 ${heroVisible ? "on" : ""}`}>
                <span className="hero-eyebrow"><span className="pulse" />Open to opportunities</span>
              </div>
              <div className={`fu d1 ${heroVisible ? "on" : ""}`}>
                <p className="hero-hi">Hey there, I'm —</p>
                <h1 className="hero-name">
                  <SplitReveal text="Deepti" delayBase={0.15} gradient /><br />
                  <SplitReveal text="Joshi." delayBase={0.5} />
                </h1>
                <span className="name-underline">
                  <svg viewBox="0 0 220 6" preserveAspectRatio="none">
                    <path d="M2,4 C60,1 160,1 218,4" />
                  </svg>
                </span>
              </div>
              <div className={`fu d2 ${heroVisible ? "on" : ""}`}>
                <p className="hero-tw">
                  <Typewriter words={["MERN Stack Developer", "React.js Enthusiast", "Full Stack Builder", "UI/UX Thinker", "Problem Solver"]} />
                </p>
              </div>
              <div className={`fu d3 ${heroVisible ? "on" : ""}`}>
                <p className="hero-desc">
                  Frontend-focused developer building <strong>fast, responsive, user-centric web apps</strong> — from
                  interface design to system architecture. Currently at <strong>Trovira</strong>, shipping real-world
                  product features every day.
                </p>
              </div>
              <div className={`fu d4 ${heroVisible ? "on" : ""}`}>
                <div className="hero-ctas">
                  <Magnetic as={Link} to="/projects" className="btn-p" strength={14}>◈ View Projects</Magnetic>
                  <Magnetic as="a" href={`mailto:${CONTACT.email}`} className="btn-s" strength={10}>✉ Say Hello</Magnetic>
                </div>
              </div>
              <div className={`fu d5 ${heroVisible ? "on" : ""}`}>
                <div className="hero-socials">
                  <a href={CONTACT.portfolio} className="soc-btn" target="_blank" rel="noreferrer" title="Portfolio">🌐</a>
                  <a href={`mailto:${CONTACT.email}`} className="soc-btn" title="Email">✉</a>
                  <a href={CONTACT.phoneHref} className="soc-btn" title="Call">☎</a>
                  <a href={CONTACT.github} className="soc-btn" target="_blank" rel="noreferrer" title="GitHub">GH</a>
                  <a href={CONTACT.linkedin} className="soc-btn" target="_blank" rel="noreferrer" title="LinkedIn">in</a>
                </div>
              </div>
            </div>

            {/* RIGHT — Avatar */}
            <div className="hero-avatar-wrap">
              <div className="avatar-ring" />
              <div className="avatar-ring2" />
              <div className="hero-avatar">
                <img src={developerImg} alt="Developer Illustration" className="hero-avatar-img" />
              </div>
              <RotatingSeal />
              <div className="avatar-badge">🟢 Available Now</div>
            </div>
          </div>

          <div className={`scroll-hint ${heroVisible ? "on" : ""}`}>
            <div className="scroll-line" />
            <span>scroll</span>
          </div>
        </section>

        {/* ── ABOUT ── */}
        <div className="divider" />
        <section className="sec" ref={aboutRef}>
          <div className={`rv rd1 ${aboutVisible ? "on" : ""}`}>
            <div className="sec-label">about me</div>
            <h2 className="sec-title">Who I <em>am</em></h2>
          </div>
          <div className={`rv rd2 ${aboutVisible ? "on" : ""}`}>
            <div className="about-grid">
              <div>
                <div className="about-text">
                  <p>I'm <strong>Deepti Joshi</strong>, a frontend-focused MERN Stack Developer based in <strong>Nashik, Maharashtra</strong>. I love crafting responsive, pixel-perfect interfaces that users enjoy interacting with.</p>
                  <p>Currently building real-world product features full-time at <strong>Trovira</strong>, a fast-growing startup. Previously interned at <strong>BDx Data Centers</strong> where I worked on finance dashboards and sustainability systems.</p>
                  <p>I care deeply about clean code, scalable architecture, and bridging the gap between great design and solid engineering.</p>
                </div>
                <div className="tags">
                  {["Clean Code", "UI Enthusiast", "Startup Life", "Fast Learner", "Open Source", "Problem Solver"].map(t => (
                    <span key={t} className="tag">{t}</span>
                  ))}
                </div>
              </div>
              <div className="info-card">
                <div className="info-row">
                  <div className="info-icon">📍</div>
                  <div><div className="info-label">Nashik, Maharashtra</div><div className="info-sub">India</div></div>
                </div>
                <div className="info-row">
                  <div className="info-icon">🎓</div>
                  <div><div className="info-label">Bachelor of Computer Science</div><div className="info-sub">Nashik, Maharashtra</div></div>
                </div>
                <div className="info-row">
                  <div className="info-icon">💼</div>
                  <div><div className="info-label">MERN Stack Developer</div><div className="info-sub">Trovira (Startup) — Current</div></div>
                </div>
                <div className="info-row">
                  <div className="info-icon">📜</div>
                  <div><div className="info-label">Full Stack Certificate</div><div className="info-sub">Sheriyans Coding School</div></div>
                </div>
                <a href={CONTACT.portfolio} target="_blank" rel="noreferrer" className="info-row">
                  <div className="info-icon">🌐</div>
                  <div><div className="info-label">portfolio-deepj.netlify.app</div><div className="info-sub">Live Portfolio</div></div>
                </a>
                <a href={CONTACT.phoneHref} className="info-row">
                  <div className="info-icon">☎</div>
                  <div><div className="info-label">{CONTACT.phone}</div><div className="info-sub">Tap to call</div></div>
                </a>
                <a href={`mailto:${CONTACT.email}`} className="info-row">
                  <div className="info-icon">✉</div>
                  <div><div className="info-label">{CONTACT.email}</div><div className="info-sub">Tap to email</div></div>
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* ── STATS ── */}
        <div className="divider" />
        <section className="sec" ref={statsRef}>
          <div className={`rv rd1 ${statsVisible ? "on" : ""}`}>
            <div className="sec-label">by the numbers</div>
            <h2 className="sec-title">The <em>journey</em></h2>
          </div>
          <div className={`rv rd2 ${statsVisible ? "on" : ""}`}>
            <div className="stats-grid">
              {[
                { to: 5, suffix: "+", label: "Projects Shipped" },
                { to: 1, suffix: "+", label: "Years Experience" },
                { to: 3, suffix: "", label: "Internships / Jobs" },
                { to: 12, suffix: "+", label: "Tech Skills" },
              ].map(s => (
                <div key={s.label} className="stat-card">
                  <div className="stat-num"><Counter to={s.to} suffix={s.suffix} /></div>
                  <div className="stat-lbl">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── SKILLS ── */}
        <div className="divider" />
        <section className="sec" ref={skillsRef}>
          <div className={`rv rd1 ${skillsVisible ? "on" : ""}`}>
            <div className="sec-label">skills & tools</div>
            <h2 className="sec-title">What I <em>build with</em></h2>
            <p className="sec-sub">Frontend-first, full-stack capable — from pixel to production.</p>
          </div>

          <div className={`rv rd2 ${skillsVisible ? "on" : ""}`}>
            <div className="skills-wrap">
              {skills.map((s, i) => (
                <div key={s.name} className="skill-row">
                  <div className="skill-top">
                    <span className="skill-name"><span className="skill-icon">{s.icon}</span>{s.name}</span>
                    <span className="skill-pct">{skillsVisible ? s.level : 0}%</span>
                  </div>
                  <div className="skill-track">
                    <div className="skill-fill" style={{
                      width: skillsVisible ? `${s.level}%` : "0%",
                      background: `linear-gradient(90deg, ${s.color}66, ${s.color})`,
                      transitionDelay: `${0.1 + i * 0.09}s`,
                    }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div ref={techRef}>
            <div className={`rv rd1 ${techVisible ? "on" : ""}`} style={{ marginTop: "1.8rem" }}>
              <p style={{ fontFamily: "'DM Mono', monospace", fontSize: "9.5px", letterSpacing: ".14em", textTransform: "uppercase", color: "var(--muted)", marginBottom: ".8rem" }}>Full tech stack</p>
              <div className="marquee-mask">
                <div className="marquee-track">
                  {[...techStack, ...techStack].map((t, i) => (
                    <span key={t.label + i} className="tech-chip" style={{ background: t.color, borderColor: t.border, color: t.text }}>
                      {t.label}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── CONTACT TEASER ── */}
        <div className="divider" />
        <div className="contact-teaser" ref={contactRef}>
          <div className={`contact-box rv rd1 ${contactVisible ? "on" : ""}`}>
            <h2 className="contact-box-title">Let's build something <em style={{ color: "var(--a2)" }}>together</em> ✦</h2>
            <p className="contact-box-sub">
              Open to full-time roles, freelance projects, and exciting collaborations. Let's connect!
            </p>
            <div style={{ display: "flex", justifyContent: "center", gap: "10px", flexWrap: "wrap", position: "relative" }}>
              <Link to="/contact" className="btn-p">◎ Get In Touch</Link>
              <a href={`mailto:${CONTACT.email}`} className="btn-s">✉ {CONTACT.email}</a>
            </div>
            <div className="contact-links">
              <a href={CONTACT.phoneHref} className="soc-btn" title="Call">☎</a>
              <a href={CONTACT.github} target="_blank" rel="noreferrer" className="soc-btn" title="GitHub">GH</a>
              <a href={CONTACT.linkedin} target="_blank" rel="noreferrer" className="soc-btn" title="LinkedIn">in</a>
              <a href={CONTACT.portfolio} target="_blank" rel="noreferrer" className="soc-btn" title="Portfolio">🌐</a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}