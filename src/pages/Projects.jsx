import { useEffect, useRef, useState } from "react";

const projects = [
  {
    num: "01",
    index: "01 / 03",
    tag: "Flagship",
    tagType: "gold",
    title: "Vintage on Wheels",
    blurb: "Classic-luxury car rental experience",
    description:
      "A premium car rental web experience built with classic luxury aesthetics in mind. Curated vintage vehicle listings, a seamless booking flow, and an elegant UI that evokes the golden era of motoring — underpinned by a robust modern frontend.",
    tech: ["React.js", "Node.js", "Express", "CSS3"],
    link: "https://vintageonwheels.netlify.app/",
    featured: true,
  },
  {
    num: "02",
    index: "02 / 03",
    tag: "Real-Time",
    tagType: "sage",
    title: "Real-Time Chat App",
    blurb: "Instant messaging at scale",
    description:
      "Scalable chat application supporting one-to-one and group messaging over a WebSocket architecture. Bi-directional delivery via Socket.IO keeps it instant and low-latency, with secure auth & session handling underneath.",
    tech: ["Socket.IO", "Node.js", "WebSockets", "JavaScript"],
    link: "https://chatapprealtp.netlify.app/",
    featured: false,
  },
  {
    num: "03",
    index: "03 / 03",
    tag: "Full-Stack",
    tagType: "rose",
    title: "Clinic Management System",
    blurb: "Digitized clinical workflows",
    description:
      "End-to-end CMS digitizing clinical workflows — from secure patient records and appointment scheduling to role-based access for admins and staff, backed by optimized MySQL queries for reliable performance at scale.",
    tech: ["PHP", "MySQL", "JavaScript", "HTML/CSS"],
    link: null,
    featured: false,
  },
];

export default function Projects() {
  const sectionRef = useRef(null);
  const [mouse, setMouse] = useState({ x: 50, y: 30 });

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add("visible");
        });
      },
      { threshold: 0.12 }
    );
    const cards = sectionRef.current?.querySelectorAll(".rv-p");
    cards?.forEach((c) => observer.observe(c));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const fn = (e) =>
      setMouse({ x: (e.clientX / window.innerWidth) * 100, y: (e.clientY / window.innerHeight) * 100 });
    window.addEventListener("mousemove", fn, { passive: true });
    return () => window.removeEventListener("mousemove", fn);
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,500;1,600&family=Manrope:wght@300;400;500;600;700&family=DM+Mono:wght@300;400;500&display=swap');

        :root[data-theme="dark"] {
          --p-bg: #0b0a08;
          --p-text: #f3ede1;
          --p-muted: rgba(243,237,225,0.5);
          --p-muted2: rgba(243,237,225,0.26);
          --p-border: rgba(247,240,224,0.09);
          --p-border2: rgba(201,163,93,0.32);
          --p-card: rgba(247,240,224,0.032);
          --p-card-h: rgba(247,240,224,0.06);
          --p-gold: #c9a35d;
          --p-rose: #c98f9f;
          --p-sage: #9fb39a;
          --p-glow: rgba(201,163,93,0.14);
        }
        :root[data-theme="light"] {
          --p-bg: #f8f4ea;
          --p-text: #251f15;
          --p-muted: rgba(37,31,21,0.56);
          --p-muted2: rgba(37,31,21,0.3);
          --p-border: rgba(20,15,5,0.09);
          --p-border2: rgba(150,110,40,0.28);
          --p-card: rgba(20,15,5,0.03);
          --p-card-h: rgba(20,15,5,0.05);
          --p-gold: #9c7228;
          --p-rose: #a23f5b;
          --p-sage: #3e6b4c;
          --p-glow: rgba(156,114,40,0.1);
        }

        .pj-page { position: relative; background: var(--p-bg); min-height: 100vh; overflow-x: hidden; }
        .pj-page::before {
          content: ''; position: fixed; inset: 0; z-index: 0; pointer-events: none;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E");
          opacity: 0.025; mix-blend-mode: overlay;
        }
        @media (prefers-reduced-motion: reduce) {
          .pj-page *, .pj-page *::before, .pj-page *::after { animation-duration: 0.01ms !important; animation-iteration-count: 1 !important; transition-duration: 0.01ms !important; }
        }

        .pj-glow {
          position: fixed; inset: 0; pointer-events: none; z-index: 0;
          background: radial-gradient(ellipse 50% 40% at var(--mx,50%) var(--my,20%), var(--p-glow) 0%, transparent 60%);
        }

        .pj-section {
          position: relative; z-index: 1;
          max-width: 980px; margin: 0 auto;
          padding: 6rem 1.25rem 7rem;
        }

        /* ── header ── */
        .pj-header {
          display: flex; align-items: flex-end; justify-content: space-between;
          gap: 1.5rem; flex-wrap: wrap;
          margin-bottom: 4rem; padding-bottom: 2rem;
          border-bottom: 1px solid var(--p-border);
        }
        .pj-eyebrow {
          font-family: 'DM Mono', monospace; font-size: 10px; font-weight: 400;
          color: var(--p-gold); letter-spacing: .2em; text-transform: uppercase;
          display: flex; align-items: center; gap: 10px; margin-bottom: .7rem;
        }
        .pj-eyebrow::before { content:''; width: 22px; height: 1px; background: var(--p-gold); opacity: .6; }
        .pj-title {
          font-family: 'Cormorant Garamond', serif; font-style: italic;
          font-size: clamp(2.6rem, 7vw, 4.6rem); font-weight: 600;
          line-height: .96; letter-spacing: -.01em; color: var(--p-text); margin: 0;
        }
        .pj-title span { color: var(--p-gold); }
        .pj-header-right {
          font-family: 'DM Mono', monospace; font-size: 11px;
          color: var(--p-muted); letter-spacing: .05em; text-align: right; line-height: 1.9;
        }
        .pj-count-badge {
          display: inline-flex; align-items: center; gap: 6px;
          background: rgba(201,163,93,0.08); border: 1px solid var(--p-border2);
          color: var(--p-gold); font-family: 'DM Mono', monospace; font-size: 10px;
          letter-spacing: .14em; padding: 5px 11px; border-radius: 999px; margin-bottom: 9px;
        }
        .pj-count-dot { width: 5px; height: 5px; border-radius: 50%; background: var(--p-gold); animation: pj-pulse 2s ease-in-out infinite; }
        @keyframes pj-pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.4;transform:scale(.7)} }

        /* ── reveal util ── */
        .rv-p { opacity: 0; transform: translateY(28px); transition: opacity .7s cubic-bezier(.16,1,.3,1), transform .7s cubic-bezier(.16,1,.3,1); }
        .rv-p.visible { opacity: 1; transform: none; }

        /* ── list ── */
        .pj-list { display: flex; flex-direction: column; }
        .pj-row {
          position: relative;
          display: grid; grid-template-columns: 64px 1fr auto;
          align-items: start; gap: 1.6rem;
          padding: 2.4rem 0;
          border-bottom: 1px solid var(--p-border);
          text-decoration: none; color: inherit;
          transition: padding-left .4s cubic-bezier(.16,1,.3,1), background .3s;
        }
        .pj-row:last-child { border-bottom: none; }
        .pj-row.linked { cursor: pointer; }
        .pj-row.linked:hover { padding-left: .9rem; }
        .pj-row.linked:hover .pj-row-arrow { opacity: 1; transform: translate(0,0); }
        .pj-row.linked:hover .pj-row-title { color: var(--p-gold); }
        .pj-row.linked:hover .pj-row-ghost { color: var(--p-border2); }

        .pj-row-num {
          font-family: 'DM Mono', monospace; font-size: 11px; color: var(--p-muted2);
          letter-spacing: .1em; padding-top: .35rem;
        }

        .pj-row-main { min-width: 0; }
        .pj-row-tagline { display: flex; align-items: center; gap: 10px; margin-bottom: .55rem; flex-wrap: wrap; }
        .pj-tag {
          display: inline-flex; align-items: center; gap: 6px;
          font-family: 'DM Mono', monospace; font-size: 9.5px; letter-spacing: .14em; text-transform: uppercase;
          padding: 4px 10px; border-radius: 999px; border: 1px solid;
        }
        .pj-tag.gold { color: var(--p-gold); border-color: var(--p-border2); background: rgba(201,163,93,0.07); }
        .pj-tag.sage { color: var(--p-sage); border-color: rgba(159,179,154,0.35); background: rgba(159,179,154,0.07); }
        .pj-tag.rose { color: var(--p-rose); border-color: rgba(201,143,159,0.35); background: rgba(201,143,159,0.07); }
        .pj-tag-dot { width: 5px; height: 5px; border-radius: 50%; background: currentColor; }
        .pj-row-blurb { font-family: 'Manrope', sans-serif; font-size: 12px; color: var(--p-muted2); font-weight: 300; letter-spacing: .01em; }

        .pj-row-title {
          font-family: 'Cormorant Garamond', serif; font-style: italic;
          font-size: clamp(1.8rem, 4vw, 2.5rem); font-weight: 600;
          color: var(--p-text); line-height: 1.08; margin: .3rem 0 .8rem;
          transition: color .3s;
        }
        .pj-row-desc {
          font-family: 'Manrope', sans-serif; font-size: 13px; line-height: 1.85;
          color: var(--p-muted); font-weight: 300; max-width: 560px; margin-bottom: 1rem;
        }
        .pj-row-tech { display: flex; flex-wrap: wrap; gap: 6px; }
        .pj-pill {
          font-family: 'DM Mono', monospace; font-size: 10px; letter-spacing: .06em;
          color: var(--p-muted); border: 1px solid var(--p-border); padding: 4px 9px; border-radius: 999px;
          transition: border-color .2s, color .2s;
        }
        .pj-row:hover .pj-pill { border-color: var(--p-border2); color: var(--p-text); }

        .pj-row-side {
          display: flex; flex-direction: column; align-items: flex-end; gap: .8rem;
          padding-top: .3rem;
        }
        .pj-row-ghost {
          font-family: 'Cormorant Garamond', serif; font-size: 4.4rem; font-weight: 500;
          color: var(--p-border); line-height: 1; user-select: none; transition: color .4s;
        }
        .pj-row-arrow {
          display: inline-flex; align-items: center; gap: 7px;
          font-family: 'DM Mono', monospace; font-size: 10.5px; letter-spacing: .1em;
          color: var(--p-gold); text-transform: uppercase;
          opacity: 0; transform: translate(-6px, 0); transition: opacity .35s, transform .35s;
        }
        .pj-row-soon {
          font-family: 'DM Mono', monospace; font-size: 10px; letter-spacing: .12em;
          color: var(--p-muted2); text-transform: uppercase; border: 1px dashed var(--p-border);
          padding: 4px 10px; border-radius: 999px;
        }

        @media (max-width: 680px) {
          .pj-row { grid-template-columns: 1fr; gap: .6rem; padding: 1.9rem 0; }
          .pj-row-num { order: -1; padding-top: 0; }
          .pj-row-side { flex-direction: row; align-items: center; justify-content: space-between; }
          .pj-row-ghost { font-size: 3rem; }
          .pj-row.linked:hover { padding-left: 0; }
        }

        /* ── more projects teaser ── */
        .pj-more {
          margin-top: 1.4rem;
          border: 1px dashed var(--p-border2);
          border-radius: 18px;
          padding: 2.2rem 1.5rem;
          text-align: center;
          background: var(--p-card);
          position: relative; overflow: hidden;
        }
        .pj-more::before {
          content: ''; position: absolute; inset: 0;
          background: radial-gradient(ellipse 60% 70% at 50% 0%, var(--p-glow), transparent 70%);
          pointer-events: none;
        }
        .pj-more-label {
          font-family: 'DM Mono', monospace; font-size: 11px; letter-spacing: .14em;
          text-transform: uppercase; color: var(--p-muted); position: relative;
          display: inline-flex; align-items: center; gap: 10px;
        }
        .pj-more-dots { display: inline-flex; gap: 4px; }
        .pj-more-dots span {
          width: 5px; height: 5px; border-radius: 50%; background: var(--p-gold);
          animation: pj-load 1.4s ease-in-out infinite;
        }
        .pj-more-dots span:nth-child(2) { animation-delay: .18s; }
        .pj-more-dots span:nth-child(3) { animation-delay: .36s; }
        @keyframes pj-load { 0%,100%{opacity:.25; transform: translateY(0);} 50%{opacity:1; transform: translateY(-3px);} }
        .pj-more-sub {
          font-family: 'Cormorant Garamond', serif; font-style: italic;
          font-size: 1.3rem; color: var(--p-text); margin-top: .6rem; position: relative;
        }
        .pj-more-sub span { color: var(--p-gold); }

        /* ── footer ── */
        .pj-footer {
          margin-top: 4rem; padding-top: 1.8rem;
          border-top: 1px solid var(--p-border);
          display: flex; align-items: center; justify-content: space-between;
          flex-wrap: wrap; gap: 1rem;
        }
        .pj-footer-text { font-family: 'DM Mono', monospace; font-size: 10.5px; letter-spacing: .1em; color: var(--p-muted2); }
        .pj-footer-link {
          font-family: 'DM Mono', monospace; font-size: 10.5px; letter-spacing: .1em;
          color: var(--p-muted); text-decoration: none; transition: color .2s;
        }
        .pj-footer-link:hover { color: var(--p-gold); }
      `}</style>

      <div className="pj-page">
        <div className="pj-glow" style={{ "--mx": `${mouse.x}%`, "--my": `${mouse.y}%` }} />
        <section className="pj-section" ref={sectionRef}>
          <div className="pj-header rv-p visible">
            <div>
              <p className="pj-eyebrow">Selected Work</p>
              <h2 className="pj-title">Featured <span>Projects</span></h2>
            </div>
            <div className="pj-header-right">
              <div className="pj-count-badge"><span className="pj-count-dot" />03 Shipped</div>
              <br />
              MERN Stack · Real-time<br />PHP · MySQL
            </div>
          </div>

          <div className="pj-list">
            {projects.map((p) => {
              const Tag = p.link ? "a" : "div";
              return (
                <Tag
                  key={p.num}
                  className={`pj-row rv-p ${p.link ? "linked" : ""}`}
                  {...(p.link ? { href: p.link, target: "_blank", rel: "noopener noreferrer" } : {})}
                >
                  <span className="pj-row-num">{p.index}</span>

                  <div className="pj-row-main">
                    <div className="pj-row-tagline">
                      <span className={`pj-tag ${p.tagType}`}><span className="pj-tag-dot" />{p.tag}</span>
                      <span className="pj-row-blurb">{p.blurb}</span>
                    </div>
                    <h3 className="pj-row-title">{p.title}</h3>
                    <p className="pj-row-desc">{p.description}</p>
                    <div className="pj-row-tech">
                      {p.tech.map((t) => <span key={t} className="pj-pill">{t}</span>)}
                    </div>
                  </div>

                  <div className="pj-row-side">
                    <span className="pj-row-ghost">{p.num}</span>
                    {p.link ? (
                      <span className="pj-row-arrow">View Live <span>↗</span></span>
                    ) : (
                      <span className="pj-row-soon">Private build</span>
                    )}
                  </div>
                </Tag>
              );
            })}
          </div>

          <div className="pj-more rv-p">
            <span className="pj-more-label">
              <span className="pj-more-dots"><span /><span /><span /></span>
              More projects loading
            </span>
            <p className="pj-more-sub">New work is always <span>in the works</span> ✦</p>
          </div>

          <div className="pj-footer">
            <span className="pj-footer-text">© 2026 · Deepti Joshi</span>
           
          </div>
        </section>
      </div>
    </>
  );
}