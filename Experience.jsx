import { useEffect, useRef, useState } from "react";
import ExperienceCounter from "../components/ExperienceCounter";

const experiences = [
  {
    date: ["May 2026", "Present"],
    current: true,
    role: ["MERN Stack", "Developer"],
    company: "Trovira",
    companyDetail: "Startup",
    location: "Remote, India",
    bullets: [
      "Building and maintaining frontend components using React.js for scalable product features at a fast-growing startup.",
      "Integrating RESTful APIs with Node.js and Express.js, ensuring robust frontend–backend communication.",
      "Collaborating with cross-functional teams to ship features at speed in a real-world production environment.",
    ],
    tech: ["React.js", "Node.js", "Express.js", "REST APIs", "MongoDB"],
  },
  {
    date: ["Sep 2025", "Dec 2025"],
    current: false,
    role: ["Full Stack Dev", "Intern"],
    company: "Unified Mentors",
    companyDetail: null,
    location: "India",
    bullets: [
      "Delivered full-stack web applications using the MERN stack with responsive React.js UIs.",
      "Developed RESTful APIs with Node.js and Express.js, and streamlined data handling with MongoDB.",
      "Optimized version control with Git, adhering to professional best practices throughout.",
    ],
    tech: ["MERN Stack", "MongoDB", "Express.js", "Git"],
  },
  {
    date: ["Feb 2025", "Aug 2025"],
    current: false,
    role: ["Website Software", "Dev Intern"],
    company: "BDx Data Centers",
    companyDetail: "Navi Mumbai",
    location: "Navi Mumbai, Maharashtra",
    bullets: [
      "Built responsive, data-driven interfaces using React.js and modern JavaScript for enterprise-grade systems.",
      "Developed backend functionality with PHP and Python for authentication and data processing pipelines.",
      "Contributed to a finance dashboard and sustainability/emission tracking system with MySQL databases.",
    ],
    tech: ["React.js", "PHP", "Python", "MySQL", "JavaScript"],
  },
];

/* ── Projects delivered while at Trovira (NOT freelance — internal company client work) ── */
const troviraProjects = [
  {
    num: "01",
    client: "Nithya Ayurveda",
    type: "Client Website",
    icon: "🌿",
    role: "Sole MERN Stack Developer",
    badge: "End-to-End Delivery",
    description:
      "Designed and developed the complete responsive website for an Ayurvedic wellness brand, implemented modern UI/UX, optimized performance, and delivered a production-ready solution.",
    link: "https://www.nithyaayurveda.com/",
    tagLabel: "Live · Production",
  },
  {
    num: "02",
    client: "Wisdom Global School",
    type: "Client Website",
    icon: "🎓",
    role: "Sole MERN Stack Developer",
    badge: "Delivered Independently",
    description:
      "Built and launched a complete institutional website with responsive layouts, optimized user journeys for admissions and academics, and a scalable component architecture.",
    link: "https://www.wisdomglobalschool.org/",
    tagLabel: "Live · Production",
  },
  {
    num: "03",
    client: "Suntech",
    type: "Client Website",
    icon: "☀️",
    role: "Sole MERN Stack Developer",
    badge: "Complete Ownership",
    description:
      "Developed a professional business website for a solar/energy company, translating their services into a clear, modern UI with a reusable design system.",
    link: null,
    tagLabel: "Private Deployment",
  },
  {
    num: "04",
    client: "Internal ERP System",
    type: "Enterprise Software",
    icon: "⚙️",
    role: "MERN Stack Developer",
    badge: "Product Development",
    description:
      "Built complex ERP interfaces — dashboards, forms, workflows, and management modules — covering data handling and role-based access used in real-world operations.",
    link: null,
    tagLabel: "Private Deployment",
  },
];

/* ── Animated counter hook ── */
function useCounter(target, duration = 1800, startOnView = true) {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(!startOnView);
  const ref = useRef(null);

  useEffect(() => {
    if (!startOnView) return;
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setStarted(true); obs.disconnect(); } },
      { threshold: 0.3 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [startOnView]);

  useEffect(() => {
    if (!started) return;
    let raf;
    const startTime = performance.now();
    const tick = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 4);
      setCount(Math.round(ease * target));
      if (progress < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [started, target, duration]);

  return [count, ref];
}

/* ── Reveal on scroll ── */
function Reveal({ children, delay = 0, className = "", x = 0, y = 40 }) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { el.classList.add("rv-in"); obs.disconnect(); }
    }, { threshold: 0.08, rootMargin: "0px 0px -40px 0px" });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return (
    <div
      ref={ref}
      className={`rv ${className}`}
      style={{ "--rv-x": `${x}px`, "--rv-y": `${y}px`, "--rv-d": `${delay}s` }}
    >
      {children}
    </div>
  );
}

/* ── Marquee ── */
function Marquee({ items, speed = 28 }) {
  return (
    <div className="marquee-wrap">
      <div className="marquee-track" style={{ animationDuration: `${speed}s` }}>
        {[...items, ...items, ...items].map((item, i) => (
          <span key={i} className="marquee-item">{item}</span>
        ))}
      </div>
    </div>
  );
}

/* ── Glow orb background ── */
function GlowOrbs() {
  return (
    <div className="glow-orbs" aria-hidden="true">
      <div className="glow-orb orb-1" />
      <div className="glow-orb orb-2" />
      <div className="glow-orb orb-3" />
    </div>
  );
}

/* ── Floating particles ── */
function Particles() {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let w, h, particles = [], raf;
    const resize = () => { w = canvas.width = canvas.offsetWidth; h = canvas.height = canvas.offsetHeight; };
    resize();
    window.addEventListener("resize", resize);
    for (let i = 0; i < 35; i++) {
      particles.push({
        x: Math.random() * w, y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.3, vy: (Math.random() - 0.5) * 0.3,
        r: Math.random() * 1.5 + 0.5, o: Math.random() * 0.3 + 0.1,
      });
    }
    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      const isDark = document.documentElement.getAttribute("data-theme") !== "light";
      const color = isDark ? "243,237,225" : "37,31,21";
      particles.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = w; if (p.x > w) p.x = 0;
        if (p.y < 0) p.y = h; if (p.y > h) p.y = 0;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${color},${p.o})`;
        ctx.fill();
      });
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
  }, []);
  return <canvas ref={canvasRef} className="particles-canvas" />;
}

/* ── Trovira Case-Study Showcase ── */
function TroviraShowcase() {
  const [open, setOpen] = useState(null);
  const [count4, c4Ref] = useCounter(4, 1300);
  const [count100, c100Ref] = useCounter(100, 1500);

  return (
    <div className="trv-wrap">
      <div className="trv-head">
        <div className="trv-head-top">
          <span className="trv-kicker">
            <span className="trv-kicker-dot" /> Delivered at Trovira
          </span>
        </div>
        <h4 className="trv-title">
          Projects Delivered During My<br />Journey at <span className="gold">Trovira</span>
        </h4>
        <p className="trv-sub">
          As an individual contributor, I personally designed, built and shipped these
          production projects for real Trovira clients — start to finish.
        </p>
      </div>

      <div className="trv-stats" ref={c4Ref}>
        <div className="trv-stat">
          <div className="trv-stat-num">{count4}+</div>
          <div className="trv-stat-label">Production<br />Projects</div>
        </div>
        <div className="trv-stat-sep" />
        <div className="trv-stat" ref={c100Ref}>
          <div className="trv-stat-num">{count100}%</div>
          <div className="trv-stat-label">Client Delivery<br />Ownership</div>
        </div>
        <div className="trv-stat-sep" />
        <div className="trv-stat">
          <div className="trv-stat-num">✦</div>
          <div className="trv-stat-label">Real Business<br />Impact</div>
        </div>
      </div>

      <div className="trv-rail">
        <div className="trv-rail-line" />
        {troviraProjects.map((p, i) => {
          const isOpen = open === i;
          const Tag = p.link ? "a" : "div";
          return (
            <div
              key={p.num}
              className={`trv-row${isOpen ? " trv-row-open" : ""}`}
              ref={(el) => {
                if (el) {
                  const obs = new IntersectionObserver(([e]) => {
                    if (e.isIntersecting) { el.classList.add("exp-visible"); obs.disconnect(); }
                  }, { threshold: 0.1, rootMargin: "0px 0px -20px 0px" });
                  obs.observe(el);
                }
              }}
            >
              <div className="trv-node">
                <span className="trv-node-num">{p.num}</span>
              </div>

              <div className="trv-card" onClick={() => setOpen(isOpen ? null : i)}>
                <div className="trv-card-top">
                  <div className="trv-card-icon">{p.icon}</div>
                  <div className="trv-card-headtext">
                    <div className="trv-card-type">{p.type}</div>
                    <h5 className="trv-card-name">{p.client}</h5>
                  </div>
                  <span className={`trv-toggle${isOpen ? " trv-toggle-open" : ""}`}>＋</span>
                </div>

                <div className="trv-badges">
                  <span className="trv-badge trv-badge-gold">Sole Contributor</span>
                  <span className="trv-badge">{p.badge}</span>
                  <span className="trv-badge trv-badge-outline">Client Project</span>
                </div>

                <div className="trv-card-body">
                  <div className="trv-card-body-inner">
                    <div className="trv-role-line">
                      <span className="trv-role-label">Role</span>
                      <span className="trv-role-value">{p.role}</span>
                    </div>
                    <p className="trv-desc">{p.description}</p>
                    <div className="trv-card-footer">
                      <span className="trv-tag">{p.tagLabel}</span>
                      {p.link ? (
                        <Tag
                          href={p.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="trv-link"
                          onClick={(e) => e.stopPropagation()}
                        >
                          View Live
                          <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <path d="M1 11L11 1M11 1H3M11 1v8" />
                          </svg>
                        </Tag>
                      ) : (
                        <span className="trv-priv"><span className="lock">🔒</span> Private deployment</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <p className="trv-footnote">
        Every project above was built and shipped <span className="gold">as part of my role at Trovira</span> ✦
      </p>
    </div>
  );
}

export default function Experience() {
  const [c4Count, c4Ref] = useCounter(4, 1400);
  const [projCount, projRef] = useCounter(4, 1600);
  const [clientCount, clientRef2] = useCounter(4, 1200);
  const timelineRef = useRef(null);
  const [fillPct, setFillPct] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const el = timelineRef.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const total = r.height + vh * 0.5;
      const passed = vh * 0.85 - r.top;
      setFillPct(Math.min(1, Math.max(0, passed / total)));
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const techMarquee = ["React.js", "Node.js", "Express.js", "MongoDB", "PHP", "Python", "MySQL", "REST APIs", "Git", "JavaScript", "MERN Stack", "TypeScript"];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500;1,600;1,700&family=Manrope:wght@200;300;400;500;600;700&family=DM+Mono:wght@300;400;500&display=swap');

        :root[data-theme="dark"] {
          --x-bg:#07060a;--x-text:#f3ede1;--x-muted:rgba(243,237,225,.5);--x-muted2:rgba(243,237,225,.25);
          --x-border:rgba(247,240,224,.07);--x-border2:rgba(201,163,93,.28);
          --x-card:rgba(247,240,224,.025);--x-card-h:rgba(247,240,224,.055);
          --x-gold:#c9a35d;--x-gold-dim:rgba(201,163,93,.12);--x-sage:#9fb39a;--x-rose:#c98f9f;
          --x-glow:rgba(201,163,93,.18);--x-glow2:rgba(159,179,154,.12);--x-glow3:rgba(201,143,159,.1);
          --x-gradient:linear-gradient(135deg,#c9a35d 0%,#e8d5a3 40%,#c98f9f 100%);
          --x-gradient2:linear-gradient(135deg,#9fb39a 0%,#c9a35d 100%);
          --x-shadow:0 8px 40px rgba(0,0,0,.4);
        }
        :root[data-theme="light"] {
          --x-bg:#faf7f0;--x-text:#1a1510;--x-muted:rgba(26,21,16,.55);--x-muted2:rgba(26,21,16,.28);
          --x-border:rgba(20,15,5,.08);--x-border2:rgba(150,110,40,.25);
          --x-card:rgba(20,15,5,.025);--x-card-h:rgba(20,15,5,.048);
          --x-gold:#9c7228;--x-gold-dim:rgba(156,114,40,.08);--x-sage:#3e6b4c;--x-rose:#a23f5b;
          --x-glow:rgba(156,114,40,.1);--x-glow2:rgba(62,107,76,.08);--x-glow3:rgba(162,63,91,.06);
          --x-gradient:linear-gradient(135deg,#9c7228 0%,#c9a35d 40%,#a23f5b 100%);
          --x-gradient2:linear-gradient(135deg,#3e6b4c 0%,#9c7228 100%);
          --x-shadow:0 8px 40px rgba(0,0,0,.06);
        }

        .exp-page{position:relative;background:var(--x-bg);overflow-x:hidden;min-height:100vh}

        .exp-page::before{content:'';position:fixed;inset:0;z-index:0;pointer-events:none;
          background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E");
          opacity:.02;mix-blend-mode:overlay}

        .particles-canvas{position:fixed;inset:0;z-index:0;pointer-events:none;width:100%;height:100%}

        .glow-orbs{position:fixed;inset:0;z-index:0;pointer-events:none;overflow:hidden}
        .glow-orb{position:absolute;border-radius:50%;filter:blur(100px);will-change:transform}
        .orb-1{width:500px;height:500px;background:var(--x-glow);top:-10%;right:-8%;animation:orbFloat1 18s ease-in-out infinite}
        .orb-2{width:400px;height:400px;background:var(--x-glow2);bottom:10%;left:-10%;animation:orbFloat2 22s ease-in-out infinite}
        .orb-3{width:350px;height:350px;background:var(--x-glow3);top:50%;left:40%;animation:orbFloat3 20s ease-in-out infinite}
        @keyframes orbFloat1{0%,100%{transform:translate(0,0) scale(1)}33%{transform:translate(-60px,80px) scale(1.1)}66%{transform:translate(40px,-40px) scale(.9)}}
        @keyframes orbFloat2{0%,100%{transform:translate(0,0) scale(1)}33%{transform:translate(80px,-60px) scale(.9)}66%{transform:translate(-40px,50px) scale(1.15)}}
        @keyframes orbFloat3{0%,100%{transform:translate(0,0) scale(1)}50%{transform:translate(-70px,-70px) scale(1.1)}}

        @media(prefers-reduced-motion:reduce){
          .exp-page*,.exp-page*::before,.exp-page*::after{animation-duration:.01ms!important;animation-iteration-count:1!important;transition-duration:.01ms!important}
        }

        .rv{opacity:0;transform:translateX(var(--rv-x,0)) translateY(var(--rv-y,40px));filter:blur(8px);
          transition:opacity .9s cubic-bezier(.16,1,.3,1) var(--rv-d,0s),transform .9s cubic-bezier(.16,1,.3,1) var(--rv-d,0s),filter .9s cubic-bezier(.16,1,.3,1) var(--rv-d,0s)}
        .rv-in{opacity:1;transform:translateX(0) translateY(0);filter:blur(0)}

        .exp-section{max-width:960px;margin:0 auto;padding:5rem 1.25rem 2rem;position:relative;z-index:1}

        .exp-hero{padding:6rem 1.25rem 3rem;max-width:960px;margin:0 auto;position:relative;z-index:1;text-align:center}
        .exp-hero-label{font-family:'DM Mono',monospace;font-size:9.5px;letter-spacing:.28em;text-transform:uppercase;
          color:var(--x-gold);display:inline-flex;align-items:center;gap:10px;margin-bottom:1.5rem;
          padding:6px 16px;border:1px solid var(--x-border2);border-radius:999px;background:var(--x-gold-dim)}
        .exp-hero-label .dot{width:5px;height:5px;border-radius:50%;background:var(--x-gold);animation:heroPulse 2s ease-in-out infinite}
        @keyframes heroPulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.3;transform:scale(.6)}}
        .exp-hero-title{font-family:'Cormorant Garamond',serif;font-weight:600;
          font-size:clamp(2.8rem,9vw,5.5rem);line-height:.92;letter-spacing:-.02em;color:var(--x-text);margin:0 0 1.2rem}
        .exp-hero-title .gold{background:var(--x-gradient);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
        .exp-hero-sub{font-family:'Manrope',sans-serif;font-size:clamp(13px,2.5vw,15px);font-weight:300;color:var(--x-muted);
          max-width:520px;margin:0 auto;line-height:1.85}

        .stats-row{display:flex;justify-content:center;gap:clamp(1.5rem,6vw,3.5rem);margin-top:2.8rem;flex-wrap:wrap}
        .stat-item{text-align:center;position:relative}
        .stat-item::after{content:'';position:absolute;right:calc(clamp(1.5rem,6vw,3.5rem) / -2);top:15%;height:70%;
          width:1px;background:var(--x-border)}
        .stat-item:last-child::after{display:none}
        .stat-num{font-family:'Cormorant Garamond',serif;font-size:clamp(2rem,5vw,3.2rem);font-weight:700;
          background:var(--x-gradient);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;line-height:1}
        .stat-label{font-family:'DM Mono',monospace;font-size:9px;letter-spacing:.18em;text-transform:uppercase;
          color:var(--x-muted2);margin-top:6px}

        .marquee-wrap{overflow:hidden;margin:3rem 0 0;position:relative;z-index:1;
          mask-image:linear-gradient(90deg,transparent,#000 12%,#000 88%,transparent);-webkit-mask-image:linear-gradient(90deg,transparent,#000 12%,#000 88%,transparent)}
        .marquee-track{display:flex;width:max-content;animation:marqueeScroll 28s linear infinite}
        @keyframes marqueeScroll{0%{transform:translateX(0)}100%{transform:translateX(-33.333%)}}
        .marquee-item{font-family:'DM Mono',monospace;font-size:10px;letter-spacing:.14em;text-transform:uppercase;
          color:var(--x-muted2);white-space:nowrap;padding:0 1.8rem;display:flex;align-items:center;gap:1.8rem}
        .marquee-item::after{content:'◆';font-size:5px;color:var(--x-gold);opacity:.4}

        .section-divider{max-width:960px;margin:0 auto;padding:0 1.25rem;position:relative;z-index:1}
        .section-divider-inner{height:1px;background:linear-gradient(90deg,transparent,var(--x-border2),transparent);position:relative}
        .section-divider-inner::before{content:'';position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);
          width:8px;height:8px;border-radius:50%;background:var(--x-gold);box-shadow:0 0 12px var(--x-glow)}

        .exp-timeline{position:relative;padding:2rem 0 0}
        .exp-tl-line{position:absolute;left:0;top:0;bottom:0;width:1px;background:var(--x-border)}
        .exp-tl-fill{position:absolute;left:0;top:0;width:1px;
          background:linear-gradient(to bottom,var(--x-gold),var(--x-sage),var(--x-rose));
          box-shadow:0 0 14px var(--x-glow);transition:height .12s linear;will-change:height}
        .exp-tl-line::before{content:'';position:absolute;left:-3px;top:0;width:7px;height:7px;border-radius:50%;
          background:var(--x-gold);box-shadow:0 0 12px var(--x-glow)}
        .exp-tl-fill::after{content:'';position:absolute;left:-3px;bottom:-3px;width:7px;height:7px;border-radius:50%;
          background:var(--x-gold);box-shadow:0 0 10px var(--x-glow);transition:opacity .2s}

        .exp-item{position:relative;padding-left:36px;padding-bottom:3rem;opacity:0;transform:translateY(50px);filter:blur(8px);
          transition:opacity .85s cubic-bezier(.16,1,.3,1),transform .85s cubic-bezier(.16,1,.3,1),filter .85s cubic-bezier(.16,1,.3,1)}
        .exp-item.exp-visible{opacity:1;transform:translateY(0);filter:blur(0)}
        .exp-item:nth-child(2){transition-delay:.1s}
        .exp-item:nth-child(3){transition-delay:.2s}

        .exp-dot{position:absolute;left:-5px;top:6px;width:11px;height:11px;border-radius:50%;
          background:var(--x-bg);border:1.5px solid var(--x-border2);z-index:2;
          transition:all .35s cubic-bezier(.34,1.56,.64,1)}
        .exp-item.exp-visible .exp-dot{animation:dotBounce .5s cubic-bezier(.34,1.56,.64,1) .35s backwards}
        @keyframes dotBounce{from{transform:scale(0)}to{transform:scale(1)}}
        .exp-item:hover .exp-dot{border-color:var(--x-gold);background:var(--x-gold-dim);transform:scale(1.35);
          box-shadow:0 0 16px var(--x-glow)}
        .exp-dot-inner{position:absolute;inset:2.5px;border-radius:50%;background:var(--x-border);transition:background .3s}
        .exp-item:hover .exp-dot-inner{background:var(--x-gold)}
        .exp-item.exp-visible .exp-dot .exp-dot-inner.current-glow{animation:dotGlow 2.5s ease-in-out infinite}
        @keyframes dotGlow{0%,100%{box-shadow:0 0 0 0 var(--x-glow)}50%{box-shadow:0 0 0 5px transparent}}

        .exp-date-label{font-family:'DM Mono',monospace;font-size:9.5px;letter-spacing:.14em;color:var(--x-muted2);
          margin-bottom:10px;display:flex;align-items:center;gap:8px}
        .exp-date-label.current-date{color:var(--x-gold)}
        .exp-date-label .pulse-dot{width:4px;height:4px;border-radius:50%;background:var(--x-gold);animation:heroPulse 2s ease-in-out infinite}

        .exp-card{position:relative;padding:1.5rem 1.6rem;background:var(--x-card);
          border:1px solid var(--x-border);border-radius:18px;overflow:hidden;
          transition:all .4s cubic-bezier(.25,.8,.25,1)}
        .exp-item:hover .exp-card{background:var(--x-card-h);border-color:var(--x-border2);
          transform:translateX(6px);box-shadow:var(--x-shadow)}
        .exp-card::before{content:'';position:absolute;top:0;left:0;right:0;height:1px;
          background:var(--x-gradient);opacity:0;transition:opacity .4s}
        .exp-item:hover .exp-card::before{opacity:1}
        .exp-card::after{content:'';position:absolute;top:0;right:0;width:80px;height:80px;
          background:radial-gradient(circle at 100% 0%,var(--x-glow),transparent 70%);opacity:0;transition:opacity .4s;pointer-events:none}
        .exp-item:hover .exp-card::after{opacity:1}

        .exp-card-top{display:flex;align-items:flex-start;justify-content:space-between;gap:12px;margin-bottom:4px}
        .exp-role{font-family:'Cormorant Garamond',serif;font-style:italic;font-size:clamp(1.3rem,3.5vw,1.75rem);
          font-weight:600;line-height:1.1;color:var(--x-text);margin:0}
        .exp-badge{flex-shrink:0;display:inline-flex;align-items:center;gap:5px;
          font-family:'DM Mono',monospace;font-size:8.5px;letter-spacing:.16em;text-transform:uppercase;
          padding:3px 9px;border-radius:999px}
        .badge-current{background:rgba(159,179,154,.08);border:1px solid var(--x-sage);color:var(--x-sage)}
        .badge-past{background:var(--x-gold-dim);border:1px solid var(--x-border2);color:var(--x-muted)}
        .badge-dot{width:4px;height:4px;border-radius:50%;background:currentColor}
        .badge-current .badge-dot{animation:heroPulse 2s ease-in-out infinite}

        .exp-meta{font-family:'DM Mono',monospace;font-size:10.5px;letter-spacing:.06em;color:var(--x-muted);
          margin-top:5px;display:flex;align-items:center;gap:6px;flex-wrap:wrap}
        .exp-meta .gold{color:var(--x-gold);font-weight:500}
        .exp-meta .sep{color:var(--x-muted2);margin:0 2px}

        .exp-divider{width:100%;height:1px;background:linear-gradient(90deg,var(--x-border2),transparent);margin:14px 0}

        .exp-bullets{list-style:none;padding:0;display:flex;flex-direction:column;gap:8px}
        .exp-bullet{display:flex;align-items:flex-start;gap:10px;font-family:'Manrope',sans-serif;
          font-size:12px;font-weight:300;color:var(--x-muted);line-height:1.8}
        .bullet-line{flex-shrink:0;width:1px;height:14px;background:var(--x-border2);margin-top:5px;border-radius:1px;
          transition:all .3s}
        .exp-item:hover .bullet-line{background:var(--x-gold);height:18px;box-shadow:0 0 6px var(--x-glow)}

        .exp-tech-row{display:flex;flex-wrap:wrap;gap:5px;margin-top:16px}
        .exp-tech{font-family:'DM Mono',monospace;font-size:8.5px;letter-spacing:.08em;color:var(--x-muted2);
          border:1px solid var(--x-border);padding:2.5px 8px;border-radius:999px;
          transition:all .25s}
        .exp-item:hover .exp-tech{color:var(--x-text);border-color:var(--x-border2)}

        /* ── Trovira case-study showcase (inside Trovira card) ── */
        .trv-wrap{margin-top:22px;padding-top:22px;border-top:1px dashed var(--x-border2)}
        .trv-head{margin-bottom:18px}
        .trv-head-top{margin-bottom:10px}
        .trv-kicker{display:inline-flex;align-items:center;gap:7px;font-family:'DM Mono',monospace;
          font-size:8px;letter-spacing:.2em;text-transform:uppercase;color:var(--x-gold);
          padding:4px 11px;border:1px solid var(--x-border2);border-radius:999px;background:var(--x-gold-dim)}
        .trv-kicker-dot{width:4px;height:4px;border-radius:50%;background:var(--x-gold);animation:heroPulse 2s ease-in-out infinite}
        .trv-title{font-family:'Cormorant Garamond',serif;font-style:italic;font-weight:600;
          font-size:clamp(1.3rem,4vw,1.7rem);line-height:1.2;color:var(--x-text);margin:0 0 8px}
        .trv-title .gold{background:var(--x-gradient);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;font-style:normal}
        .trv-sub{font-family:'Manrope',sans-serif;font-size:11.5px;font-weight:300;color:var(--x-muted);
          line-height:1.75;max-width:480px}

        .trv-stats{display:flex;align-items:center;justify-content:flex-start;gap:1.4rem;
          margin:18px 0 26px;padding:14px 16px;background:var(--x-gold-dim);
          border:1px solid var(--x-border2);border-radius:14px;flex-wrap:wrap}
        .trv-stat{text-align:left}
        .trv-stat-num{font-family:'Cormorant Garamond',serif;font-weight:700;font-size:1.6rem;line-height:1;
          background:var(--x-gradient);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
        .trv-stat-label{font-family:'DM Mono',monospace;font-size:7.5px;letter-spacing:.1em;text-transform:uppercase;
          color:var(--x-muted2);margin-top:4px;line-height:1.4}
        .trv-stat-sep{width:1px;height:30px;background:var(--x-border2)}

        .trv-rail{position:relative;display:flex;flex-direction:column;gap:14px}
        .trv-rail-line{position:absolute;left:13px;top:6px;bottom:6px;width:1px;
          background:linear-gradient(to bottom,var(--x-gold),var(--x-border2));opacity:.5}

        .trv-row{position:relative;display:flex;gap:14px;opacity:0;transform:translateY(28px);filter:blur(5px);
          transition:opacity .7s cubic-bezier(.16,1,.3,1),transform .7s cubic-bezier(.16,1,.3,1),filter .7s cubic-bezier(.16,1,.3,1)}
        .trv-row.exp-visible{opacity:1;transform:translateY(0);filter:blur(0)}
        .trv-row:nth-child(2){transition-delay:.06s}
        .trv-row:nth-child(3){transition-delay:.12s}
        .trv-row:nth-child(4){transition-delay:.18s}
        .trv-row:nth-child(5){transition-delay:.24s}

        .trv-node{flex-shrink:0;width:27px;height:27px;border-radius:50%;z-index:2;
          background:var(--x-bg);border:1.5px solid var(--x-border2);
          display:flex;align-items:center;justify-content:center;margin-top:2px;
          transition:all .3s}
        .trv-node-num{font-family:'DM Mono',monospace;font-size:8.5px;color:var(--x-gold);letter-spacing:.02em}
        .trv-row:hover .trv-node{border-color:var(--x-gold);box-shadow:0 0 12px var(--x-glow)}

        .trv-card{flex:1;min-width:0;background:var(--x-card);border:1px solid var(--x-border);
          border-radius:14px;padding:14px 15px;cursor:pointer;transition:all .3s cubic-bezier(.25,.8,.25,1)}
        .trv-card:hover{background:var(--x-card-h);border-color:var(--x-border2)}
        .trv-row-open .trv-card{border-color:var(--x-border2);background:var(--x-card-h)}

        .trv-card-top{display:flex;align-items:center;gap:11px}
        .trv-card-icon{flex-shrink:0;width:36px;height:36px;border-radius:10px;display:flex;align-items:center;
          justify-content:center;font-size:1.1rem;background:var(--x-gold-dim);border:1px solid var(--x-border2)}
        .trv-card-headtext{flex:1;min-width:0}
        .trv-card-type{font-family:'DM Mono',monospace;font-size:7.5px;letter-spacing:.14em;text-transform:uppercase;
          color:var(--x-gold);margin-bottom:2px}
        .trv-card-name{font-family:'Cormorant Garamond',serif;font-style:italic;font-weight:600;
          font-size:1.05rem;color:var(--x-text);margin:0;line-height:1.15}
        .trv-toggle{flex-shrink:0;width:22px;height:22px;border-radius:50%;border:1px solid var(--x-border2);
          display:flex;align-items:center;justify-content:center;font-size:11px;color:var(--x-gold);
          transition:transform .35s cubic-bezier(.25,.8,.25,1)}
        .trv-toggle-open{transform:rotate(45deg)}

        .trv-badges{display:flex;flex-wrap:wrap;gap:5px;margin-top:11px}
        .trv-badge{font-family:'DM Mono',monospace;font-size:7px;letter-spacing:.08em;text-transform:uppercase;
          padding:3px 8px;border-radius:999px;background:var(--x-border);color:var(--x-muted);border:1px solid transparent}
        .trv-badge-gold{background:var(--x-gold-dim);color:var(--x-gold);border-color:var(--x-border2)}
        .trv-badge-outline{background:transparent;border-color:var(--x-border2);color:var(--x-muted2)}

        .trv-card-body{display:grid;grid-template-rows:0fr;transition:grid-template-rows .4s cubic-bezier(.16,1,.3,1)}
        .trv-row-open .trv-card-body{grid-template-rows:1fr}
        .trv-card-body-inner{overflow:hidden}
        .trv-row-open .trv-card-body-inner{padding-top:13px}

        .trv-role-line{display:flex;align-items:center;gap:7px;margin-bottom:9px;
          font-family:'DM Mono',monospace;font-size:9.5px}
        .trv-role-label{color:var(--x-muted2);letter-spacing:.1em;text-transform:uppercase;font-size:8px}
        .trv-role-value{color:var(--x-gold)}

        .trv-desc{font-family:'Manrope',sans-serif;font-size:11.5px;font-weight:300;color:var(--x-muted);
          line-height:1.8;margin:0 0 12px}

        .trv-card-footer{display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:8px}
        .trv-tag{font-family:'DM Mono',monospace;font-size:7.5px;letter-spacing:.1em;text-transform:uppercase;
          color:var(--x-sage);border:1px solid var(--x-sage);background:rgba(159,179,154,.08);
          padding:3px 9px;border-radius:999px}
        .trv-link{font-family:'DM Mono',monospace;font-size:9px;letter-spacing:.1em;text-transform:uppercase;
          color:var(--x-gold);display:inline-flex;align-items:center;gap:5px;text-decoration:none}
        .trv-link svg{width:10px;height:10px}
        .trv-priv{font-family:'DM Mono',monospace;font-size:8.5px;letter-spacing:.08em;color:var(--x-muted2);
          display:inline-flex;align-items:center;gap:5px}
        .trv-priv .lock{font-size:9px}

        .trv-footnote{margin-top:20px;text-align:center;font-family:'Cormorant Garamond',serif;font-style:italic;
          font-size:12px;color:var(--x-muted);line-height:1.6}
        .trv-footnote .gold{color:var(--x-gold)}

        /* ── footer note ── */
        .exp-foot{text-align:center;padding:2rem 1.25rem 4rem;position:relative;z-index:1}
        .exp-foot-text{font-family:'Cormorant Garamond',serif;font-style:italic;font-size:clamp(1rem,2.5vw,1.2rem);
          color:var(--x-muted);line-height:1.7}
        .exp-foot-text .gold{color:var(--x-gold)}
        .exp-foot-line{width:40px;height:1px;background:var(--x-gradient);margin:1rem auto 0;border-radius:1px}

        /* ── RESPONSIVE (mobile-first base already applied above; refine for larger) ── */
        @media(min-width:701px){
          .trv-card-top{gap:14px}
          .trv-card{padding:18px 20px}
          .trv-stats{gap:2.4rem}
        }

        @media(max-width:700px){
          .exp-hero{padding:4.5rem 1.1rem 2rem}
          .exp-section{padding:3rem 1.1rem 1.5rem}
          .stats-row{gap:1.8rem}
          .stat-item::after{display:none}
          .exp-card{padding:1.2rem 1.3rem}
          .exp-item{padding-left:30px;padding-bottom:2.2rem}
          .exp-tl-line,.exp-tl-fill{left:0}
          .trv-stats{gap:1.1rem;padding:12px 13px}
          .trv-stat-num{font-size:1.35rem}
          .trv-rail-line{left:12px}
        }

        @media(max-width:420px){
          .exp-hero-title{font-size:2.4rem}
          .stats-row{gap:1.2rem}
          .stat-num{font-size:1.8rem}
          .trv-card-name{font-size:.95rem}
          .trv-card-icon{width:32px;height:32px;font-size:1rem}
        }
      `}</style>

      <div className="exp-page">
        <Particles />
        <GlowOrbs />
        <ExperienceCounter />

        {/* ── HERO HEADER ── */}
        <header className="exp-hero">
          <Reveal y={30}>
            <span className="exp-hero-label"><span className="dot" /> Career Journey</span>
          </Reveal>
          <Reveal y={35} delay={.08}>
            <h1 className="exp-hero-title">Where I've<br /><span className="gold">Built Things</span></h1>
          </Reveal>
          <Reveal y={30} delay={.16}>
            <p className="exp-hero-sub">
              From internships at enterprise data centers to building products at a startup — every role shaped how I ship code.
            </p>
          </Reveal>

        </header>

        <Marquee items={techMarquee} />

        <div className="section-divider"><div className="section-divider-inner" /></div>

        {/* ── WORK EXPERIENCE ── */}
        <section className="exp-section" id="experience">
          <Reveal y={30} x={-20}>
            <p className="exp-section-label" style={{ marginBottom: "2.2rem" }}>Professional Timeline</p>
          </Reveal>

          <div className="exp-timeline" ref={timelineRef}>
            <div className="exp-tl-line" />
            <div className="exp-tl-fill" style={{ height: `${fillPct * 100}%` }} />

            {experiences.map((exp, i) => (
              <div key={i} className="exp-item" ref={(el) => {
                if (el) {
                  const obs = new IntersectionObserver(([e]) => {
                    if (e.isIntersecting) { el.classList.add("exp-visible"); obs.disconnect(); }
                  }, { threshold: 0.1, rootMargin: "0px 0px -30px 0px" });
                  obs.observe(el);
                }
              }}>
                <div className="exp-dot">
                  <div className={`exp-dot-inner${exp.current ? " current-glow" : ""}`} />
                </div>

                <div className={`exp-date-label${exp.current ? " current-date" : ""}`}>
                  {exp.current && <span className="pulse-dot" />}
                  {exp.date[0]} — {exp.date[1]}
                </div>

                <div className="exp-card">
                  <div className="exp-card-top">
                    <h3 className="exp-role">
                      {exp.role[0]}<br />{exp.role[1]}
                    </h3>
                    <span className={`exp-badge ${exp.current ? "badge-current" : "badge-past"}`}>
                      <span className="badge-dot" />
                      {exp.current ? "Current" : "Completed"}
                    </span>
                  </div>

                  <div className="exp-meta">
                    <span className="gold">{exp.company}</span>
                    {exp.companyDetail && <><span className="sep">·</span>{exp.companyDetail}</>}
                    <span className="sep">·</span>
                    {exp.location}
                  </div>

                  <div className="exp-divider" />

                  <ul className="exp-bullets">
                    {exp.bullets.map((b, j) => (
                      <li key={j} className="exp-bullet">
                        <span className="bullet-line" />
                        {b}
                      </li>
                    ))}
                  </ul>

                  <div className="exp-tech-row">
                    {exp.tech.map((t) => <span key={t} className="exp-tech">{t}</span>)}
                  </div>

                  {/* Premium case-study showcase of projects delivered while at Trovira */}
                  {exp.current && <TroviraShowcase />}
                </div>
              </div>
            ))}
          </div>
        </section>

        <div className="exp-foot">
          <Reveal y={20}>
            <p className="exp-foot-text">
              Every line of code above was <span className="gold">designed, built & shipped solo</span> ✦
            </p>
            <div className="exp-foot-line" />
          </Reveal>
        </div>
      </div>
    </>
  );
}