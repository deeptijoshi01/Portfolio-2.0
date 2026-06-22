import { useState, useEffect, useRef, useCallback } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import logo from "../assets/logo.png";

const navLinks = [
  { path: "/",           label: "Home",       emoji: "✦", sub: "Welcome"   },
  { path: "/projects",   label: "Projects",   emoji: "◈", sub: "My Work"   },
  { path: "/experience", label: "Experience", emoji: "◉", sub: "Career"    },
  { path: "/contact",    label: "Contact",    emoji: "◎", sub: "Reach Out" },
];

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const [menuOpen, setMenuOpen]   = useState(false);
  const [scrolled, setScrolled]   = useState(false);
  const [toggling, setToggling]   = useState(false);
  const location  = useLocation();
  const navigate  = useNavigate();
  const burgerRef = useRef(null);   // ← only watch the burger button for outside-click
  const navRef    = useRef(null);

  /* ── scroll ── */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /*
   * FIX #1 — Outside-click handler now:
   *   • Only listens to "mousedown" (NOT touchstart).
   *   • Scope is narrowed to the burger button only, not the entire right cluster.
   *
   * Why this was broken on mobile:
   *   The original code attached a `touchstart` listener to the *document*.
   *   On mobile, touchstart fires BEFORE the NavLink's onClick synthetic event.
   *   So the sequence was:
   *     1. User taps a NavLink in the mobile menu.
   *     2. document touchstart fires → handleOut runs → setMenuOpen(false)
   *        → overlay opacity:0 / pointer-events:none → DOM tree mutates.
   *     3. NavLink's click/navigation never completes because React synthetic
   *        event was swallowed by the DOM mutation.
   *
   *   Removing `touchstart` from this handler completely fixes the race.
   *   Menu closing on nav is handled by the `useEffect([location.pathname])`
   *   below, which fires AFTER navigation completes.
   */
  useEffect(() => {
    const handleOut = (e) => {
      if (burgerRef.current && !burgerRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    if (menuOpen) {
      // mousedown only — never touchstart here
      document.addEventListener("mousedown", handleOut);
    }
    return () => {
      document.removeEventListener("mousedown", handleOut);
    };
  }, [menuOpen]);

  /* FIX #2 — body overflow: clear reliably on unmount too */
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  /* Close menu after route changes (fires AFTER navigation) */
  useEffect(() => { setMenuOpen(false); }, [location.pathname]);

  /* ── theme toggle ── */
  const handleToggle = useCallback(() => {
    setToggling(true);
    setTimeout(() => {
      toggleTheme();
      setTimeout(() => setToggling(false), 700);
    }, 120);
  }, [toggleTheme]);

  /*
   * FIX #3 — Mobile nav handler.
   *
   * Instead of relying on NavLink's onClick prop (which on mobile can be
   * blocked by the overlay's pointer-events or by the touchstart race above),
   * we use an explicit navigate() call combined with menu close.
   *
   * We keep this as a dedicated handler so debug logging is easy to add/remove.
   */
  const handleMobileNav = useCallback((e, path) => {
    // DEBUG — remove in production
    console.debug("[Navbar] mobile nav clicked:", path);

    e.preventDefault();        // prevent any default anchor behaviour
    setMenuOpen(false);        // close menu first (overlay pointer-events gone)

    // Small RAF so the overlay transition doesn't compete with navigation paint
    requestAnimationFrame(() => {
      navigate(path);
      // DEBUG
      console.debug("[Navbar] navigate() called →", path);
    });
  }, [navigate]);

  const isDark = theme === "dark";

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,600&family=Manrope:wght@200;300;400;500;600;700&family=DM+Mono:wght@300;400;500&display=swap');

        /* ══════════════════════════════════════════
           THEME TOKENS
        ══════════════════════════════════════════ */
        :root[data-theme="dark"] {
          --nv-bg:              rgba(8,7,12,0.68);
          --nv-bg-solid:        #08070c;
          --nv-border:          rgba(255,248,230,0.055);
          --nv-border-sc:       rgba(201,163,93,0.22);
          --nv-text:            #f0e9d8;
          --nv-muted:           rgba(240,233,216,0.35);
          --nv-active-bg:       rgba(201,163,93,0.09);
          --nv-active-border:   rgba(201,163,93,0.32);
          --nv-hover-bg:        rgba(255,248,230,0.04);
          --nv-gold:            #c9a35d;
          --nv-gold-dim:        rgba(201,163,93,0.11);
          --nv-gold-glow:       rgba(201,163,93,0.28);
          --nv-sage:            #9fb39a;
          --nv-logo-bg:         rgba(201,163,93,0.055);
          --nv-pill-bg:         rgba(159,179,154,0.07);
          --nv-pill-border:     rgba(159,179,154,0.24);
          --nv-pill-text:       #9fb39a;
          --nv-glass-bg:        rgba(255,248,230,0.042);
          --nv-glass-border:    rgba(255,248,230,0.07);
          --nv-blur:            blur(32px) saturate(180%);
          --nv-shadow:          0 1px 0 var(--nv-border);
          --nv-shadow-sc:       0 0 0 1px var(--nv-border-sc), 0 8px 48px rgba(0,0,0,0.55);
          --mob-bg:             rgba(8,7,12,0.97);
          --mob-border:         rgba(255,248,230,0.065);
          --mob-active-bg:      rgba(201,163,93,0.07);
          --mob-active-border:  rgba(201,163,93,0.28);
          --tog-track:          #232a52;
          --tog-knob:           #d0ddf5;
          --tog-knob-sh:        rgba(190,210,255,0.4);
          --tog-glow:           rgba(100,130,230,0.45);
        }
        :root[data-theme="light"] {
          --nv-bg:              rgba(252,249,242,0.72);
          --nv-bg-solid:        #fcf9f2;
          --nv-border:          rgba(18,12,4,0.055);
          --nv-border-sc:       rgba(156,114,40,0.2);
          --nv-text:            #181208;
          --nv-muted:           rgba(24,18,8,0.36);
          --nv-active-bg:       rgba(156,114,40,0.09);
          --nv-active-border:   rgba(156,114,40,0.32);
          --nv-hover-bg:        rgba(18,12,4,0.04);
          --nv-gold:            #9c7228;
          --nv-gold-dim:        rgba(156,114,40,0.08);
          --nv-gold-glow:       rgba(156,114,40,0.22);
          --nv-sage:            #3e6b4c;
          --nv-logo-bg:         rgba(156,114,40,0.05);
          --nv-pill-bg:         rgba(62,107,76,0.065);
          --nv-pill-border:     rgba(62,107,76,0.22);
          --nv-pill-text:       #3e6b4c;
          --nv-glass-bg:        rgba(18,12,4,0.028);
          --nv-glass-border:    rgba(18,12,4,0.07);
          --nv-blur:            blur(32px) saturate(220%);
          --nv-shadow:          0 1px 0 var(--nv-border);
          --nv-shadow-sc:       0 0 0 1px var(--nv-border-sc), 0 4px 28px rgba(90,50,10,0.09);
          --mob-bg:             rgba(252,249,242,0.98);
          --mob-border:         rgba(18,12,4,0.06);
          --mob-active-bg:      rgba(156,114,40,0.065);
          --mob-active-border:  rgba(156,114,40,0.26);
          --tog-track:          #f0a428;
          --tog-knob:           #fff0a0;
          --tog-knob-sh:        rgba(255,210,40,0.55);
          --tog-glow:           rgba(240,160,0,0.4);
        }

        *, *::before, *::after { box-sizing: border-box; }

        /* ══ NAVBAR SHELL ══ */
        .nv {
          position: fixed;
          top: 0; left: 0; right: 0;
          z-index: 9999;
          height: 68px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 clamp(1rem, 4vw, 2.5rem);
          font-family: 'Manrope', sans-serif;
          background: var(--nv-bg);
          backdrop-filter: var(--nv-blur);
          -webkit-backdrop-filter: var(--nv-blur);
          border-bottom: 1px solid var(--nv-border);
          box-shadow: var(--nv-shadow);
          transition:
            height .45s cubic-bezier(.25,.8,.25,1),
            border-color .45s,
            box-shadow .45s,
            background .45s;
          will-change: height;
        }
        .nv.sc {
          height: 58px;
          border-bottom-color: var(--nv-border-sc);
          box-shadow: var(--nv-shadow-sc);
        }
        .nv::before {
          content: '';
          position: absolute;
          top: 0; left: 50%;
          transform: translateX(-50%);
          width: 0; height: 1px;
          background: linear-gradient(90deg,
            transparent 0%,
            var(--nv-gold) 40%,
            var(--nv-sage) 60%,
            transparent 100%
          );
          transition: width .6s cubic-bezier(.16,1,.3,1);
          pointer-events: none;
          opacity: .8;
        }
        .nv.sc::before { width: min(280px, 55vw); }

        /* ══ LOGO ══ */
        .nv-logo {
          display: flex;
          align-items: center;
          gap: 13px;
          text-decoration: none;
          flex-shrink: 0;
          z-index: 2;
          user-select: none;
        }
        .nv-logo-ring {
          position: relative;
          width: 56px; height: 56px;
          border-radius: 16px;
          padding: 2px;
          background: linear-gradient(145deg, var(--nv-gold) 0%, var(--nv-sage) 55%, var(--nv-gold) 100%);
          flex-shrink: 0;
          transition: transform .4s cubic-bezier(.34,1.56,.64,1), box-shadow .4s;
          background-size: 200% 200%;
          animation: ringShift 6s ease infinite;
        }
        @keyframes ringShift {
          0%,100% { background-position: 0% 50%; }
          50%      { background-position: 100% 50%; }
        }
        .nv-logo:hover .nv-logo-ring {
          transform: rotate(-8deg) scale(1.1);
          box-shadow: 0 0 28px var(--nv-gold-glow), 0 0 56px rgba(159,179,154,0.12);
        }
        .nv-logo-ring::before {
          content: '';
          position: absolute; inset: -4px;
          border-radius: 19px;
          background: inherit;
          opacity: 0; z-index: -1;
          filter: blur(10px);
          transition: opacity .45s;
        }
        .nv-logo:hover .nv-logo-ring::before { opacity: .5; }
        .nv-logo-inner {
          width: 100%; height: 100%;
          border-radius: 14px;
          background: #fff;
          display: flex; align-items: center; justify-content: center;
          overflow: hidden; position: relative;
        }
        .nv-logo-img {
          width: 100%; height: 100%;
          object-fit: cover;
          position: relative; z-index: 2;
          transition: filter .35s, transform .35s;
        }
        .nv-logo:hover .nv-logo-img {
          filter: brightness(1.12) contrast(1.06) saturate(1.1);
          transform: scale(1.04);
        }
        .nv-logo-text { display: flex; flex-direction: column; gap: 3px; line-height: 1; }
        .nv-logo-name {
          font-family: 'Cormorant Garamond', serif;
          font-size: 16.5px; font-weight: 700;
          color: var(--nv-text); letter-spacing: .06em;
          transition: color .3s;
        }
        .nv-logo-role {
          font-family: 'DM Mono', monospace;
          font-size: 9.5px; letter-spacing: .24em;
          text-transform: uppercase;
          color: var(--nv-gold); font-weight: 400; opacity: .65;
          transition: opacity .3s, letter-spacing .3s;
        }
        .nv-logo:hover .nv-logo-role { opacity: 1; letter-spacing: .28em; }
        @media (max-width: 520px) {
          .nv-logo-text { display: none; }
          .nv-logo-ring { width: 48px; height: 48px; border-radius: 14px; }
          .nv-logo-ring::before { border-radius: 17px; }
          .nv-logo-inner { border-radius: 11px; }
        }

        /* ══ DESKTOP LINKS ══ */
        .nv-links {
          display: flex; align-items: center; gap: 2px;
          list-style: none; margin: 0; padding: 4px;
          position: absolute; left: 50%; transform: translateX(-50%);
          background: var(--nv-glass-bg);
          border: 1px solid var(--nv-glass-border);
          border-radius: 15px;
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          transition: border-color .3s, box-shadow .3s;
        }
        .nv.sc .nv-links { border-color: var(--nv-border-sc); }
        @media (max-width: 860px) { .nv-links { display: none; } }

        .nv-link { position: relative; }
        .nv-link a {
          display: flex; align-items: center; gap: 6px;
          text-decoration: none;
          padding: 6px 16px;
          border-radius: 11px;
          font-family: 'DM Mono', monospace;
          font-size: 11px; font-weight: 400; letter-spacing: .07em;
          color: var(--nv-muted);
          border: 1px solid transparent;
          transition: all .22s cubic-bezier(.25,.8,.25,1);
          white-space: nowrap; position: relative;
        }
        .nv-link a:hover {
          color: var(--nv-text);
          background: var(--nv-hover-bg);
          transform: translateY(-1px);
        }
        .nv-link a.active {
          color: var(--nv-text);
          background: var(--nv-active-bg);
          border-color: var(--nv-active-border);
          font-weight: 500;
        }
        .nv-link a.active::after {
          content: '';
          position: absolute; bottom: 2px; left: 50%;
          transform: translateX(-50%);
          width: 3px; height: 3px; border-radius: 50%;
          background: var(--nv-gold);
          box-shadow: 0 0 6px var(--nv-gold-glow);
        }
        .nv-emoji { font-size: 8.5px; opacity: .4; transition: all .22s; }
        .nv-link a:hover .nv-emoji,
        .nv-link a.active .nv-emoji { opacity: 1; transform: scale(1.35) rotate(-5deg); }
        .nv-link-glow {
          position: absolute;
          bottom: -2px; left: 50%;
          width: 0; height: 2px;
          background: linear-gradient(90deg, var(--nv-gold), var(--nv-sage));
          border-radius: 1px;
          transform: translateX(-50%);
          transition: width .3s cubic-bezier(.16,1,.3,1);
          filter: blur(1px);
          pointer-events: none;
        }
        .nv-link:hover .nv-link-glow { width: 55%; }

        /* ══ RIGHT CLUSTER ══ */
        .nv-right {
          display: flex; align-items: center; gap: 9px;
          flex-shrink: 0; z-index: 2;
        }

        /* availability pill */
        .nv-pill {
          display: flex; align-items: center; gap: 7px;
          background: var(--nv-pill-bg);
          border: 1px solid var(--nv-pill-border);
          color: var(--nv-pill-text);
          font-family: 'DM Mono', monospace;
          font-size: 9px; font-weight: 400; letter-spacing: .15em;
          text-transform: uppercase;
          padding: 6px 13px; border-radius: 999px;
          transition: all .3s;
          cursor: default;
        }
        .nv-pill:hover {
          background: var(--nv-pill-border);
          box-shadow: 0 0 12px var(--nv-pill-border);
        }
        .nv-pill-dot {
          width: 5px; height: 5px; border-radius: 50%;
          background: var(--nv-pill-text);
          animation: nvPulse 2.4s ease-in-out infinite;
          flex-shrink: 0;
        }
        @keyframes nvPulse {
          0%,100% { opacity:1; transform: scale(1); }
          50%      { opacity:.4; transform: scale(.7); }
        }
        @media (max-width: 620px) { .nv-pill { display: none; } }

        /* ══ TOGGLE ══ */
        .nv-tog {
          position: relative;
          width: 64px; height: 33px;
          border-radius: 999px;
          background: var(--tog-track);
          border: none; cursor: pointer; padding: 0;
          flex-shrink: 0;
          transition: background .55s cubic-bezier(.4,0,.2,1), box-shadow .55s;
          box-shadow:
            inset 0 0 0 1px rgba(255,255,255,0.1),
            0 2px 10px rgba(0,0,0,0.28);
          overflow: hidden;
          outline: none;
        }
        .nv-tog:hover {
          box-shadow:
            inset 0 0 0 1px rgba(255,255,255,0.14),
            0 0 20px var(--tog-glow),
            0 2px 10px rgba(0,0,0,0.28);
        }
        .nv-tog:active { transform: scale(.93); }
        .nv-tog:focus-visible { box-shadow: 0 0 0 3px var(--nv-gold-glow); }
        .nv-tog::before {
          content: '';
          position: absolute; inset: 0; border-radius: 999px;
          background: radial-gradient(ellipse at 28% 40%, rgba(255,255,255,0.14) 0%, transparent 65%);
          pointer-events: none; z-index: 1;
        }
        .tog-knob {
          position: absolute;
          top: 3.5px;
          width: 26px; height: 26px;
          border-radius: 50%;
          background: var(--tog-knob);
          box-shadow: 0 0 14px var(--tog-knob-sh), 0 2px 8px rgba(0,0,0,0.35);
          transition:
            left .48s cubic-bezier(.34,1.56,.64,1),
            background .55s,
            box-shadow .55s;
          z-index: 4;
          display: flex; align-items: center; justify-content: center;
          overflow: hidden;
        }
        .nv-tog[data-mode="light"] .tog-knob { left: 3.5px; }
        .nv-tog[data-mode="dark"]  .tog-knob { left: 34.5px; }
        .tog-crater {
          position: absolute; border-radius: 50%;
          background: rgba(150,175,225,0.32);
          transition: opacity .5s;
        }
        .tog-c1 { width:7px;height:7px;top:4px;right:4px;  opacity:0; }
        .tog-c2 { width:4px;height:4px;bottom:5px;right:7px;opacity:0; }
        .nv-tog[data-mode="dark"] .tog-c1,
        .nv-tog[data-mode="dark"] .tog-c2 { opacity:1; }
        .tog-rays {
          position: absolute; inset: 0;
          display: flex; align-items: center; justify-content: center;
          z-index: 2; pointer-events: none;
          animation: raysSpin 12s linear infinite;
        }
        @keyframes raysSpin { to { transform: rotate(360deg); } }
        .nv-tog[data-mode="dark"] .tog-rays { animation-play-state: paused; }
        .tog-ray {
          position: absolute;
          width: 2px; height: 5px;
          background: rgba(255,225,80,0.65);
          border-radius: 1px;
          transform-origin: center 16px;
          transition: opacity .45s;
        }
        .nv-tog[data-mode="dark"] .tog-ray { opacity:0; }
        .tog-cloud {
          position: absolute;
          background: rgba(255,255,255,0.52);
          border-radius: 999px;
          transition: opacity .45s, transform .45s;
          z-index: 2;
        }
        .tog-cl1 { width:15px;height:8px;top:7px;left:30px;box-shadow:-5px 0 0 2px rgba(255,255,255,0.52); }
        .tog-cl2 { width:10px;height:6px;bottom:8px;left:26px;box-shadow:-3px 0 0 1.5px rgba(255,255,255,0.52); }
        .nv-tog[data-mode="dark"] .tog-cl1,
        .nv-tog[data-mode="dark"] .tog-cl2 { opacity:0; transform:translateX(10px); }
        .tog-star {
          position: absolute; background: #fff;
          border-radius: 50%;
          transition: opacity .45s, transform .45s;
          z-index: 2;
        }
        .tog-s1{ width:3px;height:3px;top:8px; left:10px;opacity:0; }
        .tog-s2{ width:2px;height:2px;top:15px;left:17px;opacity:0; }
        .tog-s3{ width:2px;height:2px;bottom:7px;left:9px;opacity:0; }
        .nv-tog[data-mode="dark"] .tog-s1{ opacity:1; }
        .nv-tog[data-mode="dark"] .tog-s2{ opacity:.65; }
        .nv-tog[data-mode="dark"] .tog-s3{ opacity:.45; }
        .tog-sun {
          font-size:11px; line-height:1;
          position:relative; z-index:1;
          transition:opacity .35s, transform .4s;
          color:rgba(240,180,20,0.85);
          user-select:none;
        }
        .nv-tog[data-mode="dark"] .tog-sun { opacity:0; transform:scale(.4) rotate(90deg); }
        .nv-tog.flash::after {
          content:'';
          position:absolute;inset:0;border-radius:999px;
          background:rgba(255,255,255,0.22);
          animation:togFlash .4s ease-out forwards;
        }
        @keyframes togFlash { 0%{opacity:1;} 100%{opacity:0;} }

        /* ══ HAMBURGER ══ */
        .nv-burger {
          display: none;
          flex-direction: column; justify-content: center; align-items: center; gap: 5px;
          width: 40px; height: 40px; border-radius: 12px;
          background: var(--nv-glass-bg);
          border: 1px solid var(--nv-glass-border);
          cursor: pointer; padding: 0; flex-shrink: 0;
          transition: all .3s; position: relative; overflow: hidden;
          outline: none;
        }
        .nv-burger::before {
          content:''; position:absolute;inset:0;
          background:radial-gradient(circle,var(--nv-gold-dim),transparent 70%);
          opacity:0; transition:opacity .3s;
        }
        .nv-burger:hover::before { opacity:1; }
        .nv-burger:hover { border-color:var(--nv-active-border); transform:scale(1.04); }
        .nv-burger:active { transform:scale(.94); }
        @media (max-width:860px) { .nv-burger { display:flex; } }
        .nv-bl {
          width:17px; height:1.5px;
          background:var(--nv-text); border-radius:2px;
          transition:all .38s cubic-bezier(.4,0,.2,1);
          transform-origin:center; position:relative; z-index:1;
        }
        .nv-bl:nth-child(2){ width:12px; }
        .nv-burger.open .nv-bl:nth-child(1){ transform:translateY(6.5px) rotate(45deg);width:17px; }
        .nv-burger.open .nv-bl:nth-child(2){ opacity:0;transform:scaleX(0);width:17px; }
        .nv-burger.open .nv-bl:nth-child(3){ transform:translateY(-6.5px) rotate(-45deg);width:17px; }

        /* ══ MOBILE OVERLAY ══
         *
         * FIX #4 — The overlay must NEVER intercept clicks on its children.
         * The nv-backdrop handles closing; nv-mob and its children must be
         * fully interactive. All pointer-events are explicitly set correctly.
         */
        .nv-overlay {
          position: fixed; inset: 0; z-index: 9998;
          pointer-events: none; opacity: 0;
          transition: opacity .38s ease;
        }
        .nv-overlay.open {
          pointer-events: none;   /* keep none on outer wrapper — backdrop handles it */
          opacity: 1;
        }
        .nv-backdrop {
          position: absolute; inset: 0;
          background: rgba(0,0,0,0.48);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          pointer-events: all;   /* backdrop IS clickable (to close) */
          cursor: default;
        }
        .nv-mob {
          position: absolute; top: 0; left: 0; right: 0;
          background: var(--mob-bg);
          padding: 80px clamp(1.2rem,5vw,2rem) 2.2rem;
          transform: translateY(-32px) scale(.97);
          opacity: 0;
          transition:
            transform .48s cubic-bezier(.16,1,.3,1),
            opacity .38s ease;
          border-bottom: 1px solid var(--mob-border);
          border-radius: 0 0 30px 30px;
          box-shadow: 0 28px 90px rgba(0,0,0,0.32);
          max-height: 90vh; overflow-y: auto;
          pointer-events: all;   /* menu panel IS interactive */
        }
        .nv-overlay.open .nv-mob {
          transform: translateY(0) scale(1);
          opacity: 1;
        }

        /* mob availability */
        .nv-mob-avail {
          display: inline-flex; align-items: center; gap: 8px;
          margin-bottom: 1rem;
          padding: 7px 15px;
          background: var(--nv-pill-bg);
          border: 1px solid var(--nv-pill-border);
          border-radius: 999px;
        }
        .nv-mob-avail-dot {
          width:5px;height:5px;border-radius:50%;
          background:var(--nv-pill-text);
          animation:nvPulse 2.4s ease-in-out infinite;
        }
        .nv-mob-avail-txt {
          font-family:'DM Mono',monospace;
          font-size:9px;letter-spacing:.15em;text-transform:uppercase;
          color:var(--nv-pill-text);
        }

        /* mob links */
        .nv-mob-list {
          list-style: none; padding: 0; margin: 0 0 1.5rem;
          display: flex; flex-direction: column; gap: 8px;
        }

        /*
         * FIX #5 — .nv-mob-item is an <li> wrapper so HTML is valid.
         * pointer-events:all ensures clicks pass through to the <button> inside.
         */
        .nv-mob-item {
          pointer-events: all;
        }

        /*
         * FIX #6 — Mobile nav links are now <button> elements with explicit
         * onClick handlers (handleMobileNav) instead of NavLink/anchor tags.
         * This completely bypasses the touchstart race condition.
         *
         * We still compute active state manually via location.pathname.
         */
        .nv-mob-link {
          display: flex; align-items: center;
          width: 100%;
          padding: 15px 18px; border-radius: 18px;
          border: 1px solid var(--mob-border);
          background: transparent;
          cursor: pointer;
          font: inherit;
          color: inherit;
          text-align: left;
          transform: translateX(-20px); opacity: 0;
          transition:
            all .38s cubic-bezier(.16,1,.3,1),
            transform .38s cubic-bezier(.16,1,.3,1),
            opacity .38s ease;
          position: relative; overflow: hidden;
          -webkit-tap-highlight-color: transparent;  /* remove grey flash on iOS */
          touch-action: manipulation;                /* remove 300ms tap delay */
          pointer-events: all;
        }
        .nv-overlay.open .nv-mob-link { transform: translateX(0); opacity: 1; }
        .nv-overlay.open .nv-mob-item:nth-child(1) .nv-mob-link { transition-delay: .06s; }
        .nv-overlay.open .nv-mob-item:nth-child(2) .nv-mob-link { transition-delay: .10s; }
        .nv-overlay.open .nv-mob-item:nth-child(3) .nv-mob-link { transition-delay: .14s; }
        .nv-overlay.open .nv-mob-item:nth-child(4) .nv-mob-link { transition-delay: .18s; }

        .nv-mob-link::before {
          content:'';position:absolute;top:0;left:0;right:0;height:1px;
          background:linear-gradient(90deg,transparent,var(--nv-gold),transparent);
          opacity:0;transition:opacity .3s;
        }
        .nv-mob-link:hover::before,
        .nv-mob-link.active::before { opacity:1; }
        .nv-mob-link:hover {
          background: var(--mob-active-bg);
          border-color: var(--mob-active-border);
          transform: translateX(5px);
        }
        .nv-mob-link.active {
          background: var(--mob-active-bg);
          border-color: var(--mob-active-border);
        }
        .nv-mob-link.active::after {
          content:'';position:absolute;
          left:0;top:18%;height:64%;width:3px;
          border-radius:0 3px 3px 0;
          background:var(--nv-gold);
          box-shadow:0 0 12px var(--nv-gold-glow);
        }

        .nv-mob-left { display:flex;align-items:center;gap:15px;flex:1; }
        .nv-mob-icon {
          width:42px;height:42px;border-radius:13px;
          background:var(--nv-gold-dim);
          display:flex;align-items:center;justify-content:center;
          font-size:16px;transition:all .32s;flex-shrink:0;
        }
        .nv-mob-link:hover .nv-mob-icon,
        .nv-mob-link.active .nv-mob-icon {
          background:var(--nv-gold);
          box-shadow:0 0 16px var(--nv-gold-glow);
          transform:scale(1.06) rotate(-4deg);
        }
        .nv-mob-link:hover .nv-mob-icon span,
        .nv-mob-link.active .nv-mob-icon span { filter:brightness(0) invert(1); }
        .nv-mob-label {
          font-family:'Manrope',sans-serif;
          font-size:15.5px;font-weight:400;color:var(--nv-text);
          transition:color .2s;
        }
        .nv-mob-link.active .nv-mob-label { font-weight:600; }
        .nv-mob-sublabel {
          font-family:'DM Mono',monospace;
          font-size:9px;letter-spacing:.13em;text-transform:uppercase;
          color:var(--nv-muted);margin-top:2px;
        }
        .nv-mob-arrow {
          color:var(--nv-muted);font-size:16px;
          transition:all .32s;flex-shrink:0;opacity:.3;
        }
        .nv-mob-link:hover .nv-mob-arrow {
          opacity:1;transform:translateX(5px);color:var(--nv-gold);
        }

        /* mob footer */
        .nv-mob-foot {
          display:flex;align-items:center;justify-content:space-between;
          padding-top:1.3rem;margin-top:.6rem;
          border-top:1px solid var(--mob-border);
          gap:12px;flex-wrap:wrap;
        }
        .nv-mob-foot-info { display:flex;flex-direction:column;gap:3px; }
        .nv-mob-foot-name {
          font-family:'Cormorant Garamond',serif;
          font-size:14.5px;font-weight:600;
          color:var(--nv-text);font-style:italic;
        }
        .nv-mob-foot-email {
          font-family:'DM Mono',monospace;
          font-size:9px;color:var(--nv-muted);letter-spacing:.07em;
        }
        .nv-mob-foot-acts { display:flex;gap:8px; }
        .nv-mob-act {
          display:flex;align-items:center;gap:6px;
          padding:8px 15px;border-radius:11px;
          background:var(--nv-glass-bg);border:1px solid var(--nv-glass-border);
          color:var(--nv-text);
          font-family:'DM Mono',monospace;font-size:10px;letter-spacing:.06em;
          cursor:pointer;transition:all .26s;text-decoration:none;
          -webkit-tap-highlight-color: transparent;
          touch-action: manipulation;
        }
        .nv-mob-act:hover { background:var(--nv-gold-dim);border-color:var(--nv-active-border); }

        /* ══ REDUCED MOTION ══ */
        @media(prefers-reduced-motion:reduce){
          .nv,.nv *,.nv *::before,.nv *::after,
          .nv-overlay,.nv-overlay *,.nv-overlay *::before,.nv-overlay *::after {
            animation-duration:.01ms !important;
            animation-iteration-count:1 !important;
            transition-duration:.01ms !important;
          }
        }
      `}</style>

      {/* ═══════════ NAVBAR ═══════════ */}
      <nav ref={navRef} className={`nv${scrolled ? " sc" : ""}`}>

        {/* ── Logo ── */}
        <NavLink to="/" className="nv-logo" onClick={() => setMenuOpen(false)}>
          <div className="nv-logo-ring">
            <div className="nv-logo-inner">
              <img src={logo} alt="DJ" className="nv-logo-img" />
            </div>
          </div>
          <div className="nv-logo-text">
            <span className="nv-logo-name">DEEPTI JOSHI</span>
            <span className="nv-logo-role">Developer</span>
          </div>
        </NavLink>

        {/* ── Desktop Links ── */}
        <ul className="nv-links">
          {navLinks.map((link) => (
            <li key={link.path} className="nv-link">
              <NavLink
                to={link.path}
                end={link.path === "/"}
                className={({ isActive }) => isActive ? "active" : ""}
              >
                <span className="nv-emoji">{link.emoji}</span>
                {link.label}
              </NavLink>
              <span className="nv-link-glow" />
            </li>
          ))}
        </ul>

        {/* ── Right cluster ── */}
        <div className="nv-right">
          <div className="nv-pill">
            <span className="nv-pill-dot" />
            Available
          </div>

          {/* Sun/Moon toggle */}
          <button
            className={`nv-tog${toggling ? " flash" : ""}`}
            data-mode={isDark ? "dark" : "light"}
            onClick={handleToggle}
            aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
          >
            <span className="tog-star tog-s1" />
            <span className="tog-star tog-s2" />
            <span className="tog-star tog-s3" />
            <span className="tog-cloud tog-cl1" />
            <span className="tog-cloud tog-cl2" />
            <span className="tog-rays" aria-hidden="true">
              {[0,45,90,135,180,225,270,315].map((deg, i) => (
                <span
                  key={i}
                  className="tog-ray"
                  style={{ transform: `rotate(${deg}deg) translateY(-16px)` }}
                />
              ))}
            </span>
            <span className="tog-knob">
              <span className="tog-crater tog-c1" />
              <span className="tog-crater tog-c2" />
              <span className="tog-sun" aria-hidden="true">✦</span>
            </span>
          </button>

          {/* Hamburger — ref narrowed to just this button */}
          <button
            ref={burgerRef}
            className={`nv-burger${menuOpen ? " open" : ""}`}
            onClick={() => setMenuOpen(p => !p)}
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
          >
            <span className="nv-bl" />
            <span className="nv-bl" />
            <span className="nv-bl" />
          </button>
        </div>
      </nav>

      {/* ═══════════ MOBILE MENU ═══════════ */}
      <div className={`nv-overlay${menuOpen ? " open" : ""}`} aria-hidden={!menuOpen}>

        {/* Backdrop — only this closes the menu on outside click */}
        <div className="nv-backdrop" onClick={() => setMenuOpen(false)} />

        <div className="nv-mob">

          {/* availability */}
          <div className="nv-mob-avail">
            <span className="nv-mob-avail-dot" />
            <span className="nv-mob-avail-txt">Open to Opportunities</span>
          </div>

          {/*
           * FIX #7 — Each nav item is an <li> (valid HTML), containing a <button>
           * with an explicit handleMobileNav handler.
           *
           * Active state is derived from location.pathname directly — no NavLink
           * needed here, so zero risk of the touch-event race condition.
           */}
          <ul className="nv-mob-list">
            {navLinks.map((link) => {
              const isActive = link.path === "/"
                ? location.pathname === "/"
                : location.pathname.startsWith(link.path);

              return (
                <li key={link.path} className="nv-mob-item">
                  <button
                    className={`nv-mob-link${isActive ? " active" : ""}`}
                    onClick={(e) => handleMobileNav(e, link.path)}
                    // DEBUG — remove in production:
                    onTouchStart={() => console.debug("[Navbar] touchstart on:", link.path)}
                    aria-current={isActive ? "page" : undefined}
                  >
                    <div className="nv-mob-left">
                      <div className="nv-mob-icon"><span>{link.emoji}</span></div>
                      <div>
                        <div className="nv-mob-label">{link.label}</div>
                        <div className="nv-mob-sublabel">{link.sub}</div>
                      </div>
                    </div>
                    <span className="nv-mob-arrow">→</span>
                  </button>
                </li>
              );
            })}
          </ul>

          {/* footer */}
          <div className="nv-mob-foot">
            <div className="nv-mob-foot-info">
              <span className="nv-mob-foot-name">Deepti Joshi</span>
              <span className="nv-mob-foot-email">deeptiajoshi01@gmail.com</span>
            </div>
            <div className="nv-mob-foot-acts">
              <a
                className="nv-mob-act"
                href="mailto:deeptiajoshi01@gmail.com"
                onClick={() => setMenuOpen(false)}
              >
                ✉ Mail
              </a>
              <button className="nv-mob-act" onClick={handleToggle}>
                {isDark ? "☀️ Light" : "🌙 Dark"}
              </button>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}
