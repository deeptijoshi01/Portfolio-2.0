import { useState, useRef, useEffect } from "react";

const PHONE = "917972643129";

function buildWhatsAppUrl(data) {
  const msg = [
    `*New Contact Form Submission*`,
    ``,
    `*Name:* ${data.name}`,
    `*Organisation:* ${data.org || "N/A"}`,
    `*Phone:* ${data.phone || "N/A"}`,
    `*Email:* ${data.email}`,
    ``,
    `*Message:*`,
    `${data.message}`,
  ].join("\n");
  return `https://api.whatsapp.com/send?phone=${PHONE}&text=${encodeURIComponent(msg)}`;
}

/* ── reveal on scroll ── */
function Reveal({ children, delay = 0, y = 40, x = 0 }) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { el.classList.add("rv-in"); obs.disconnect(); } },
      { threshold: 0.08, rootMargin: "0px 0px -30px 0px" }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return (
    <div ref={ref} className="rv" style={{ "--rv-x": `${x}px`, "--rv-y": `${y}px`, "--rv-d": `${delay}s` }}>
      {children}
    </div>
  );
}

/* ── floating input ── */
function FloatInput({ label, name, type = "text", required, value, onChange, rows, icon }) {
  const [focused, setFocused] = useState(false);
  const hasVal = value && value.length > 0;
  const isActive = focused || hasVal;
  const Tag = rows ? "textarea" : "input";

  return (
    <div className={`fi-wrap ${isActive ? "fi-active" : ""} ${focused ? "fi-focused" : ""}`}>
      {icon && <span className="fi-icon" aria-hidden="true">{icon}</span>}
      <Tag
        className="fi-field"
        name={name}
        type={rows ? undefined : type}
        rows={rows}
        value={value}
        onChange={onChange}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        required={required}
        autoComplete={name === "email" ? "email" : name === "phone" ? "tel" : name === "name" ? "name" : "off"}
      />
      <label className="fi-label" htmlFor={name}>{label}</label>
      <span className="fi-line" />
    </div>
  );
}

/* ── contact info card ── */
function InfoCard({ icon, label, value, href, delay }) {
  const Tag = href ? "a" : "div";
  const isExternal = href && (href.startsWith("http") || href.startsWith("whatsapp"));
  return (
    <Reveal y={30} delay={delay}>
      <Tag
        className="ci-card"
        href={href}
        {...(isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      >
        <span className="ci-icon">{icon}</span>
        <div className="ci-text">
          <span className="ci-label">{label}</span>
          <span className="ci-value">{value}</span>
        </div>
        {href && <span className="ci-arrow" aria-hidden="true">↗</span>}
      </Tag>
    </Reveal>
  );
}

/* ── particles ── */
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
    for (let i = 0; i < 28; i++) {
      particles.push({
        x: Math.random() * w, y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.25, vy: (Math.random() - 0.5) * 0.25,
        r: Math.random() * 1.2 + 0.4, o: Math.random() * 0.25 + 0.08,
      });
    }
    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      const isDark = document.documentElement.getAttribute("data-theme") !== "light";
      const c = isDark ? "243,237,225" : "37,31,21";
      particles.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = w; if (p.x > w) p.x = 0;
        if (p.y < 0) p.y = h; if (p.y > h) p.y = 0;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${c},${p.o})`;
        ctx.fill();
      });
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
  }, []);
  return <canvas ref={canvasRef} className="ct-particles" />;
}

/* ── glow orbs ── */
function GlowOrbs() {
  return (
    <div className="ct-orbs" aria-hidden="true">
      <div className="ct-orb ct-orb1" />
      <div className="ct-orb ct-orb2" />
      <div className="ct-orb ct-orb3" />
    </div>
  );
}

export default function Contact() {
  const [form, setForm] = useState({ name: "", org: "", phone: "", email: "", message: "" });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [errors, setErrors] = useState({});

  const update = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    if (errors[name]) setErrors((err) => ({ ...err, [name]: null }));
  };

  const validate = () => {
    const err = {};
    if (!form.name.trim()) err.name = "Name is required";
    if (!form.email.trim()) err.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) err.email = "Invalid email";
    if (!form.message.trim()) err.message = "Message is required";
    return err;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const err = validate();
    if (Object.keys(err).length > 0) { setErrors(err); return; }
    setSending(true);
    const url = buildWhatsAppUrl(form);
    setTimeout(() => {
      window.open(url, "_blank");
      setSending(false);
      setSent(true);
      setTimeout(() => {
        setSent(false);
        setForm({ name: "", org: "", phone: "", email: "", message: "" });
      }, 3000);
    }, 600);
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500;1,600&family=Manrope:wght@200;300;400;500;600;700&family=DM+Mono:wght@300;400;500&display=swap');

        :root[data-theme="dark"] {
          --ct-bg:#07060a;--ct-text:#f3ede1;--ct-muted:rgba(243,237,225,.5);--ct-muted2:rgba(243,237,225,.22);
          --ct-border:rgba(247,240,224,.07);--ct-border2:rgba(201,163,93,.28);
          --ct-card:rgba(247,240,224,.025);--ct-card-h:rgba(247,240,224,.055);
          --ct-gold:#c9a35d;--ct-gold-dim:rgba(201,163,93,.1);--ct-sage:#9fb39a;--ct-rose:#c98f9f;
          --ct-glow:rgba(201,163,93,.15);--ct-glow2:rgba(159,179,154,.1);--ct-glow3:rgba(201,143,159,.08);
          --ct-gradient:linear-gradient(135deg,#c9a35d 0%,#e8d5a3 40%,#c98f9f 100%);
          --ct-input-bg:rgba(247,240,224,.03);
        }
        :root[data-theme="light"] {
          --ct-bg:#faf7f0;--ct-text:#1a1510;--ct-muted:rgba(26,21,16,.55);--ct-muted2:rgba(26,21,16,.25);
          --ct-border:rgba(20,15,5,.08);--ct-border2:rgba(150,110,40,.25);
          --ct-card:rgba(20,15,5,.025);--ct-card-h:rgba(20,15,5,.048);
          --ct-gold:#9c7228;--ct-gold-dim:rgba(156,114,40,.07);--ct-sage:#3e6b4c;--ct-rose:#a23f5b;
          --ct-glow:rgba(156,114,40,.08);--ct-glow2:rgba(62,107,76,.06);--ct-glow3:rgba(162,63,91,.05);
          --ct-gradient:linear-gradient(135deg,#9c7228 0%,#c9a35d 40%,#a23f5b 100%);
          --ct-input-bg:rgba(20,15,5,.03);
        }

        .ct-page{position:relative;background:var(--ct-bg);overflow-x:hidden;min-height:100vh}
        .ct-page::before{content:'';position:fixed;inset:0;z-index:0;pointer-events:none;
          background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E");
          opacity:.02;mix-blend-mode:overlay}

        .ct-particles{position:fixed;inset:0;z-index:0;pointer-events:none;width:100%;height:100%}
        .ct-orbs{position:fixed;inset:0;z-index:0;pointer-events:none;overflow:hidden}
        .ct-orb{position:absolute;border-radius:50%;filter:blur(100px);will-change:transform}
        .ct-orb1{width:450px;height:450px;background:var(--ct-glow);top:-8%;right:-5%;animation:orbF1 20s ease-in-out infinite}
        .ct-orb2{width:350px;height:350px;background:var(--ct-glow2);bottom:5%;left:-8%;animation:orbF2 24s ease-in-out infinite}
        .ct-orb3{width:300px;height:300px;background:var(--ct-glow3);top:45%;left:35%;animation:orbF3 22s ease-in-out infinite}
        @keyframes orbF1{0%,100%{transform:translate(0,0) scale(1)}33%{transform:translate(-50px,70px) scale(1.1)}66%{transform:translate(30px,-30px) scale(.9)}}
        @keyframes orbF2{0%,100%{transform:translate(0,0) scale(1)}33%{transform:translate(70px,-50px) scale(.9)}66%{transform:translate(-30px,40px) scale(1.15)}}
        @keyframes orbF3{0%,100%{transform:translate(0,0) scale(1)}50%{transform:translate(-60px,-60px) scale(1.1)}}

        /* reveal */
        .rv{opacity:0;transform:translateX(var(--rv-x,0)) translateY(var(--rv-y,40px));filter:blur(8px);
          transition:opacity .9s cubic-bezier(.16,1,.3,1) var(--rv-d,0s),transform .9s cubic-bezier(.16,1,.3,1) var(--rv-d,0s),filter .9s cubic-bezier(.16,1,.3,1) var(--rv-d,0s)}
        .rv-in{opacity:1;transform:translateX(0) translateY(0);filter:blur(0)}

        /* hero */
        .ct-hero{max-width:960px;margin:0 auto;padding:5rem 1.25rem 2rem;text-align:center;position:relative;z-index:1}
        .ct-hero-label{font-family:'DM Mono',monospace;font-size:9.5px;letter-spacing:.28em;text-transform:uppercase;
          color:var(--ct-gold);display:inline-flex;align-items:center;gap:10px;margin-bottom:1.4rem;
          padding:6px 16px;border:1px solid var(--ct-border2);border-radius:999px;background:var(--ct-gold-dim)}
        .ct-hero-label .hdot{width:5px;height:5px;border-radius:50%;background:var(--ct-gold);animation:hpulse 2s ease-in-out infinite}
        @keyframes hpulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.3;transform:scale(.6)}}
        .ct-hero-title{font-family:'Cormorant Garamond',serif;font-weight:600;
          font-size:clamp(2.6rem,8vw,5rem);line-height:.92;letter-spacing:-.02em;color:var(--ct-text);margin:0 0 1rem}
        .ct-hero-title .gold{background:var(--ct-gradient);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
        .ct-hero-sub{font-family:'Manrope',sans-serif;font-size:clamp(13px,2.5vw,15px);font-weight:300;color:var(--ct-muted);
          max-width:480px;margin:0 auto;line-height:1.85}

        /* main grid */
        .ct-main{max-width:960px;margin:0 auto;padding:1rem 1.25rem 6rem;position:relative;z-index:1;
          display:grid;grid-template-columns:1fr 1fr;gap:2.5rem;align-items:start}
        @media(max-width:740px){.ct-main{grid-template-columns:1fr;gap:2rem;padding:1rem 1.1rem 5rem}}

        /* ── FORM ── */
        .ct-form-wrap{position:relative}
        .ct-form-wrap::before{content:'';position:absolute;inset:-1px;border-radius:22px;
          background:var(--ct-gradient);opacity:0;transition:opacity .5s;z-index:-1;filter:blur(.5px)}
        .ct-form-wrap.form-focused::before{opacity:.35}
        .ct-form{background:var(--ct-card);border:1px solid var(--ct-border);border-radius:22px;
          padding:clamp(1.4rem,4vw,2.2rem);position:relative;overflow:hidden}
        .ct-form::before{content:'';position:absolute;top:0;left:0;right:0;height:1px;
          background:var(--ct-gradient);opacity:0;transition:opacity .4s}
        .ct-form-wrap.form-focused .ct-form::before{opacity:1}
        .ct-form-head{margin-bottom:1.6rem}
        .ct-form-title{font-family:'Cormorant Garamond',serif;font-style:italic;font-size:1.5rem;font-weight:600;
          color:var(--ct-text);margin:0 0 4px}
        .ct-form-sub{font-family:'DM Mono',monospace;font-size:10px;letter-spacing:.1em;color:var(--ct-muted2)}

        .fi-wrap{position:relative;margin-bottom:clamp(14px,3vw,22px)}
        .fi-icon{position:absolute;left:14px;top:50%;transform:translateY(-50%);font-size:14px;
          color:var(--ct-muted2);transition:color .3s;z-index:2;pointer-events:none}
        textarea ~ .fi-icon{top:18px;transform:none}
        .fi-active .fi-icon{color:var(--ct-gold)}
        .fi-field{width:100%;background:var(--ct-input-bg);border:1px solid var(--ct-border);border-radius:12px;
          padding:18px 14px 8px 42px;font-family:'Manrope',sans-serif;font-size:13.5px;font-weight:400;
          color:var(--ct-text);outline:none;transition:border-color .3s,box-shadow .3s,background .3s;
          -webkit-appearance:none;resize:none;box-sizing:border-box}
        .fi-field:focus{border-color:var(--ct-border2);background:rgba(247,240,224,.045);
          box-shadow:0 0 0 3px var(--ct-gold-dim)}
        .fi-field.has-icon{padding-left:42px}
        .fi-label{position:absolute;left:42px;top:50%;transform:translateY(-50%);
          font-family:'Manrope',sans-serif;font-size:13px;font-weight:400;color:var(--ct-muted2);
          pointer-events:none;transition:all .25s cubic-bezier(.16,1,.3,1);transform-origin:left center}
        textarea ~ .fi-label{top:18px;transform:none;transform-origin:left top}
        .fi-active .fi-label{top:10px;transform:translateY(0) scale(.75);color:var(--ct-gold)}
        textarea + .fi-label.fi-active{top:6px}
        .fi-line{position:absolute;bottom:0;left:14px;right:14px;height:1px;background:var(--ct-border);
          border-radius:1px;transition:background .3s}
        .fi-focused .fi-line{background:var(--ct-gradient)}
        .fi-error{font-family:'DM Mono',monospace;font-size:8.5px;letter-spacing:.08em;color:var(--ct-rose);
          margin-top:5px;padding-left:4px;display:none}
        .fi-error.show{display:block;animation:errShake .4s ease}
        @keyframes errShake{0%,100%{transform:translateX(0)}20%{transform:translateX(-4px)}40%{transform:translateX(4px)}60%{transform:translateX(-3px)}80%{transform:translateX(2px)}}

        .fi-field.err{border-color:var(--ct-rose)}

        /* submit btn */
        .ct-submit-wrap{margin-top:clamp(16px,3vw,26px);position:relative}
        .ct-submit{width:100%;padding:15px 24px;border:none;border-radius:14px;cursor:pointer;
          font-family:'DM Mono',monospace;font-size:11px;letter-spacing:.16em;text-transform:uppercase;
          color:#fff;background:var(--ct-gradient);position:relative;overflow:hidden;
          transition:transform .25s,box-shadow .3s;box-shadow:0 4px 24px var(--ct-glow)}
        .ct-submit:hover{transform:translateY(-2px);box-shadow:0 8px 36px var(--ct-glow)}
        .ct-submit:active{transform:translateY(0) scale(.98)}
        .ct-submit::before{content:'';position:absolute;inset:0;background:linear-gradient(135deg,rgba(255,255,255,.15),transparent 50%);
          opacity:0;transition:opacity .3s}
        .ct-submit:hover::before{opacity:1}
        .ct-submit:disabled{opacity:.6;cursor:not-allowed;transform:none}
        .ct-submit .btn-text{position:relative;z-index:1;display:flex;align-items:center;justify-content:center;gap:8px}
        .ct-submit .btn-loader{display:none}
        .ct-submit.loading .btn-text{display:none}
        .ct-submit.loading .btn-loader{display:flex;align-items:center;justify-content:center;gap:6px}
        .spinner{width:14px;height:14px;border:2px solid rgba(255,255,255,.3);border-top-color:#fff;
          border-radius:50%;animation:spin .7s linear infinite}
        @keyframes spin{to{transform:rotate(360deg)}}

        .ct-submit.success{background:var(--ct-sage);box-shadow:0 4px 24px var(--ct-glow2)}
        .ct-wa-note{font-family:'DM Mono',monospace;font-size:8.5px;letter-spacing:.1em;color:var(--ct-muted2);
          text-align:center;margin-top:10px;display:flex;align-items:center;justify-content:center;gap:6px}
        .ct-wa-note svg{width:11px;height:11px}

        /* ── INFO SIDE ── */
        .ct-info{display:flex;flex-direction:column;gap:1rem}
        .ci-card{display:flex;align-items:center;gap:14px;padding:16px 18px;
          background:var(--ct-card);border:1px solid var(--ct-border);border-radius:16px;
          text-decoration:none;color:inherit;transition:all .35s cubic-bezier(.25,.8,.25,1);position:relative;overflow:hidden}
        .ci-card::before{content:'';position:absolute;top:0;left:0;right:0;height:1px;
          background:var(--ct-gradient);opacity:0;transition:opacity .35s}
        .ci-card:hover{background:var(--ct-card-h);border-color:var(--ct-border2);transform:translateX(4px);box-shadow:0 4px 20px rgba(0,0,0,.15)}
        .ci-card:hover::before{opacity:1}
        .ci-icon{width:42px;height:42px;border-radius:12px;background:var(--ct-gold-dim);
          display:flex;align-items:center;justify-content:center;font-size:17px;flex-shrink:0;
          transition:all .35s}
        .ci-card:hover .ci-icon{background:var(--ct-gold);transform:scale(1.05);box-shadow:0 0 16px var(--ct-glow)}
        .ci-card:hover .ci-icon span{filter:brightness(0) invert(1)}
        .ci-text{flex:1;min-width:0}
        .ci-label{display:block;font-family:'DM Mono',monospace;font-size:8.5px;letter-spacing:.16em;
          text-transform:uppercase;color:var(--ct-muted2);margin-bottom:2px}
        .ci-value{display:block;font-family:'Manrope',sans-serif;font-size:13px;font-weight:400;
          color:var(--ct-text);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;transition:color .3s}
        .ci-card:hover .ci-value{color:var(--ct-gold)}
        .ci-arrow{font-size:14px;color:var(--ct-muted2);transition:all .3s;opacity:0;transform:translateX(-4px)}
        .ci-card:hover .ci-arrow{opacity:1;transform:translateX(0);color:var(--ct-gold)}

        /* social row */
        .ct-social-row{display:flex;gap:10px;margin-top:.6rem}
        .ct-social-btn{width:46px;height:46px;border-radius:14px;border:1px solid var(--ct-border);
          background:var(--ct-card);display:flex;align-items:center;justify-content:center;
          font-size:18px;cursor:pointer;transition:all .35s;text-decoration:none;color:var(--ct-muted)}
        .ct-social-btn:hover{border-color:var(--ct-border2);background:var(--ct-gold-dim);
          transform:translateY(-3px);box-shadow:0 6px 20px var(--ct-glow)}
        .ct-social-btn:hover span{filter:none}
        .ct-social-btn span{filter:grayscale(.5);transition:filter .3s}

        /* availability badge */
        .ct-avail{display:inline-flex;align-items:center;gap:8px;padding:8px 16px;
          background:rgba(159,179,154,.06);border:1px solid rgba(159,179,154,.2);border-radius:999px;
          font-family:'DM Mono',monospace;font-size:9.5px;letter-spacing:.12em;color:var(--ct-sage)}
        .ct-avail-dot{width:6px;height:6px;border-radius:50%;background:var(--ct-sage);
          box-shadow:0 0 8px var(--ct-sage);animation:hpulse 2s ease-in-out infinite}

        /* map / decorative */
        .ct-deco-map{margin-top:1rem;border-radius:16px;overflow:hidden;border:1px solid var(--ct-border);
          height:160px;position:relative;background:var(--ct-card)}
        .ct-deco-map::before{content:'';position:absolute;inset:0;
          background:radial-gradient(ellipse at 60% 50%,var(--ct-glow),transparent 60%);opacity:.3}
        .ct-deco-map svg{position:absolute;inset:0;width:100%;height:100%;opacity:.08}

        /* footer */
        .ct-foot{text-align:center;padding:0 1.25rem 4rem;position:relative;z-index:1}
        .ct-foot-line{width:40px;height:1px;background:var(--ct-gradient);margin:0 auto .8rem;border-radius:1px}
        .ct-foot-text{font-family:'Cormorant Garamond',serif;font-style:italic;font-size:1.05rem;color:var(--ct-muted);line-height:1.7}
        .ct-foot-text .gold{color:var(--ct-gold)}

        @media(max-width:740px){
          .ct-hero{padding:4rem 1.1rem 1.5rem}
          .ct-form{padding:1.2rem}
          .fi-field{padding:16px 12px 6px 38px;font-size:13px}
          .fi-icon{left:12px;font-size:13px}
          .fi-label{left:38px}
          .ci-card{padding:13px 14px}
          .ci-icon{width:38px;height:38px;font-size:15px}
        }
        @media(max-width:420px){
          .ct-hero-title{font-size:2.2rem}
          .ct-social-row{gap:8px}
          .ct-social-btn{width:42px;height:42px}
        }
        @media(prefers-reduced-motion:reduce){
          .ct-page*,.ct-page*::before,.ct-page*::after{animation-duration:.01ms!important;animation-iteration-count:1!important;transition-duration:.01ms!important}
        }
      `}</style>

      <div className="ct-page">
        <Particles />
        <GlowOrbs />

        {/* ── HERO ── */}
        <header className="ct-hero">
          <Reveal y={28}>
            <span className="ct-hero-label"><span className="hdot" /> Get in Touch</span>
          </Reveal>
          <Reveal y={34} delay={.07}>
            <h1 className="ct-hero-title">Let's <span className="gold">Connect</span></h1>
          </Reveal>
          <Reveal y={28} delay={.14}>
            <p className="ct-hero-sub">
              Have a project in mind or just want to say hello? Drop me a message — I'd love to hear from you.
            </p>
          </Reveal>
        </header>

        {/* ── MAIN GRID ── */}
        <div className="ct-main">
          {/* LEFT — FORM */}
          <Reveal y={35} delay={.1}>
            <div className={`ct-form-wrap ${Object.keys(errors).length === 0 && (form.name || form.email || form.message) ? "form-focused" : ""}`}>
              <form className="ct-form" onSubmit={handleSubmit} noValidate>
                <div className="ct-form-head">
                  <h2 className="ct-form-title">Send a Message</h2>
                  <p className="ct-form-sub">Fills directly to WhatsApp · Instant delivery</p>
                </div>

                <FloatInput label="Your Name" name="name" value={form.name} onChange={update} required icon="✦" />
                <div className={`fi-error ${errors.name ? "show" : ""}`}>{errors.name}</div>

                <FloatInput label="Organisation" name="org" value={form.org} onChange={update} icon="◈" />
                <div className="fi-error">&nbsp;</div>

                <FloatInput label="Phone Number" name="phone" type="tel" value={form.phone} onChange={update} icon="✆" />
                <div className="fi-error">&nbsp;</div>

                <FloatInput label="Email Address" name="email" type="email" value={form.email} onChange={update} required icon="◇" />
                <div className={`fi-error ${errors.email ? "show" : ""}`}>{errors.email}</div>

                <FloatInput label="Your Message" name="message" rows={4} value={form.message} onChange={update} required icon="✎" />
                <div className={`fi-error ${errors.message ? "show" : ""}`}>{errors.message}</div>

                <div className="ct-submit-wrap">
                  <button
                    type="submit"
                    className={`ct-submit ${sending ? "loading" : ""} ${sent ? "success" : ""}`}
                    disabled={sending}
                  >
                    <span className="btn-text">
                      {sent ? "✓ Sent Successfully" : "Send via WhatsApp"}
                      {!sent && <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 2C6.477 2 2 6.477 2 12c0 1.89.525 3.66 1.438 5.168L2 22l4.832-1.438A9.955 9.955 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18a7.96 7.96 0 01-4.11-1.14l-.29-.174-3.01.894.896-2.925-.194-.304A7.96 7.96 0 014 12c0-4.41 3.59-8 8-8s8 3.59 8 8-3.59 8-8 8z"/></svg>}
                    </span>
                    <span className="btn-loader">
                      <span className="spinner" />
                      <span style={{ fontFamily: "'DM Mono',monospace", fontSize: "10px", letterSpacing: ".1em" }}>Opening WhatsApp...</span>
                    </span>
                  </button>
                  <p className="ct-wa-note">
                    <svg viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/></svg>
                    Delivered to WhatsApp · 7972643129
                  </p>
                </div>
              </form>
            </div>
          </Reveal>

          {/* RIGHT — INFO */}
          <div className="ct-info">
            <Reveal y={30} delay={.18}>
              <div className="ct-avail"><span className="ct-avail-dot" /> Open to Opportunities</div>
            </Reveal>

            <InfoCard
              icon="✦"
              label="Full Name"
              value="Deepti Avinash Joshi"
              delay={.22}
            />
            <InfoCard
              icon="✉"
              label="Email"
              value="deeptiajoshi01@gmail.com"
              href="mailto:deeptiajoshi01@gmail.com"
              delay={.26}
            />
            <InfoCard
              icon="✆"
              label="Phone"
              value="+91 79726 43129"
              href="https://wa.me/917972643129"
              delay={.30}
            />
            <InfoCard
              icon="in"
              label="LinkedIn"
              value="linkedin.com/in/deepti-joshi"
              href="https://www.linkedin.com/in/deepti-joshi-23434724b/"
              delay={.34}
            />

            <Reveal y={30} delay={.38}>
              <div className="ct-social-row">
                <a className="ct-social-btn" href="https://wa.me/917972643129" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp">
                  <span>💬</span>
                </a>
                <a className="ct-social-btn" href="mailto:deeptiajoshi01@gmail.com" aria-label="Email">
                  <span>📧</span>
                </a>
                <a className="ct-social-btn" href="https://www.linkedin.com/in/deepti-joshi-23434724b/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                  <span>🔗</span>
                </a>
                <a className="ct-social-btn" href="https://github.com" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
                  <span>⚡</span>
                </a>
              </div>
            </Reveal>

            {/* decorative map element */}
            <Reveal y={25} delay={.42}>
              <div className="ct-deco-map" aria-hidden="true">
                <svg viewBox="0 0 400 160" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="200" cy="80" r="60" stroke="currentColor" strokeWidth="0.5" strokeDasharray="4 4" />
                  <circle cx="200" cy="80" r="30" stroke="currentColor" strokeWidth="0.5" strokeDasharray="2 3" />
                  <circle cx="200" cy="80" r="3" fill="currentColor" />
                  <line x1="200" y1="20" x2="200" y2="140" stroke="currentColor" strokeWidth="0.3" />
                  <line x1="140" y1="80" x2="260" y2="80" stroke="currentColor" strokeWidth="0.3" />
                  <path d="M160 50 Q200 30 240 50" stroke="currentColor" strokeWidth="0.3" fill="none" />
                  <path d="M160 110 Q200 130 240 110" stroke="currentColor" strokeWidth="0.3" fill="none" />
                </svg>
                <div style={{ position: "absolute", bottom: "12px", left: "16px", fontFamily: "'DM Mono',monospace", fontSize: "8px", letterSpacing: ".14em", color: "var(--ct-muted2)", textTransform: "uppercase" }}>
                  India · Remote
                </div>
              </div>
            </Reveal>
          </div>
        </div>

        {/* ── FOOTER ── */}
        <div className="ct-foot">
          <Reveal y={20}>
            <div className="ct-foot-line" />
            <p className="ct-foot-text">
              Built with <span className="gold">passion</span> by Deepti Joshi ✦
            </p>
          </Reveal>
        </div>
      </div>
    </>
  );
}