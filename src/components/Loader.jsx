import { useEffect, useState } from "react";
import logo from "../assets/logo.png";

const Loader = () => {
  const [progress, setProgress] = useState(0);
  const [exiting, setExiting] = useState(false);
  const [logoLoaded, setLogoLoaded] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setLogoLoaded(true), 150);
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(interval);
          setTimeout(() => setExiting(true), 550);
          return 100;
        }
        // Slow down near the end for a more deliberate, premium feel
        const remaining = 100 - p;
        const step = remaining < 20 ? Math.random() * 2 + 0.5 : Math.random() * 6 + 2;
        return Math.min(100, p + step);
      });
    }, 130);
    return () => {
      clearInterval(interval);
      clearTimeout(t);
    };
  }, []);

  return (
    <div
      className={`fixed inset-0 z-[9999] flex items-center justify-center bg-[#07060c] overflow-hidden transition-all duration-[900ms] ease-[cubic-bezier(0.65,0,0.35,1)] ${
        exiting ? "opacity-0 scale-[1.03] pointer-events-none" : "opacity-100 scale-100"
      }`}
    >
      {/* Layered ambient backdrop */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_42%,rgba(201,168,118,0.10),transparent_55%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_100%,rgba(163,121,63,0.07),transparent_60%)]" />
        <div className="absolute -inset-1/4 bg-[conic-gradient(from_0deg_at_50%_50%,rgba(201,168,118,0.04),transparent_30%,transparent_70%,rgba(201,168,118,0.04))] animate-[spin_18s_linear_infinite]" />
        <div className="absolute inset-0 opacity-[0.035] mix-blend-overlay [background-image:url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIj48ZmlsdGVyIGlkPSJuIj48ZmVUdXJidWxlbmNlIHR5cGU9ImZyYWN0YWxOb2lzZSIgYmFzZUZyZXF1ZW5jeT0iMC44NSIgbnVtT2N0YXZlcz0iMyIgc3RpdGNoVGlsZXM9InN0aXRjaCIvPjwvZmlsdGVyPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbHRlcj0idXJsKCNuKSIvPjwvc3ZnPg==')]" />
        {/* Vignette */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,transparent_40%,#07060c_95%)]" />
      </div>

      {/* Floating gold particles — varied sizes & subtle drift */}
      {[...Array(22)].map((_, i) => (
        <span
          key={i}
          className="absolute rounded-full bg-[#c9a876]"
          style={{
            width: `${Math.random() * 2.5 + 0.5}px`,
            height: `${Math.random() * 2.5 + 0.5}px`,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            opacity: Math.random() * 0.4 + 0.08,
            boxShadow: "0 0 4px rgba(201,168,118,0.6)",
            animation: `floatUp ${7 + Math.random() * 8}s ease-in-out infinite, drift ${4 + Math.random() * 3}s ease-in-out infinite`,
            animationDelay: `${Math.random() * 8}s, ${Math.random() * 4}s`,
          }}
        />
      ))}

      <div className="relative flex flex-col items-center px-6 w-full max-w-xs sm:max-w-sm">
        {/* Rotating ring + logo */}
        <div
          className={`relative w-32 h-32 sm:w-36 sm:h-36 mb-9 flex items-center justify-center transition-all duration-1000 ease-out ${
            logoLoaded ? "opacity-100 scale-100" : "opacity-0 scale-90"
          }`}
        >
          {/* Outer soft glow */}
          <div className="absolute inset-0 rounded-full bg-[#c9a876]/10 blur-2xl animate-[breathe_3.5s_ease-in-out_infinite]" />

          <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="46" fill="none" stroke="#1c1a22" strokeWidth="0.75" />
            <circle cx="50" cy="50" r="46" fill="none" stroke="#15131a" strokeWidth="1" strokeDasharray="0.5 3" opacity="0.6" />
            <circle
              cx="50" cy="50" r="46"
              fill="none"
              stroke="url(#goldGrad)"
              strokeWidth="1.25"
              strokeLinecap="round"
              strokeDasharray={2 * Math.PI * 46}
              strokeDashoffset={2 * Math.PI * 46 * (1 - progress / 100)}
              style={{ transition: "stroke-dashoffset 0.3s ease-out", filter: "drop-shadow(0 0 3px rgba(232,201,143,0.5))" }}
            />
            {/* Lead dot at progress tip */}
            <circle
              cx={50 + 46 * Math.cos((2 * Math.PI * (progress / 100)) - Math.PI / 2)}
              cy={50 + 46 * Math.sin((2 * Math.PI * (progress / 100)) - Math.PI / 2)}
              r="1.6"
              fill="#f3deb2"
              style={{ filter: "drop-shadow(0 0 4px rgba(243,222,178,0.9))", transition: "cx 0.3s ease-out, cy 0.3s ease-out" }}
            />
            <defs>
              <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#e8c98f" />
                <stop offset="100%" stopColor="#a3793f" />
              </linearGradient>
            </defs>
          </svg>

          <div className="absolute inset-4 rounded-full border border-[#c9a876]/15 animate-[spin_10s_linear_infinite]" />
          <div className="absolute inset-[18px] rounded-full border border-dashed border-[#c9a876]/10 animate-[spinReverse_14s_linear_infinite]" />

          {/* Logo — clean circular frame with refined ring + sheen */}
          <div className="relative z-10 w-[4.6rem] h-[4.6rem] sm:w-20 sm:h-20 rounded-full bg-white overflow-hidden flex items-center justify-center drop-shadow-[0_0_22px_rgba(201,168,118,0.4)] animate-[breathe_3.5s_ease-in-out_infinite] ring-1 ring-[#c9a876]/40">
            <img src={logo} alt="Deepti Joshi" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-[linear-gradient(115deg,transparent_30%,rgba(255,255,255,0.35)_45%,transparent_60%)] animate-[sheen_3.5s_ease-in-out_infinite]" />
          </div>
        </div>

        {/* Signature text with refined letter spacing */}
        <h1
          className={`font-serif text-3xl sm:text-4xl text-white tracking-wide text-center transition-all duration-700 ease-out delay-200 ${
            logoLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
          }`}
        >
          Deepti
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#e8c98f] to-[#a3793f] italic"> Joshi</span>
        </h1>

        <div className="relative w-44 sm:w-52 h-px mt-6 overflow-hidden bg-[#1c1a22]">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#3a3340] to-transparent" />
          <div
            className="absolute inset-y-0 left-0 bg-gradient-to-r from-[#a3793f] via-[#f3deb2] to-[#a3793f]"
            style={{
              width: `${progress}%`,
              transition: "width 0.3s ease-out",
              boxShadow: "0 0 8px rgba(232,201,143,0.6)",
            }}
          />
        </div>

        <div className="flex items-center justify-between w-44 sm:w-52 mt-3.5">
          <p className="text-[10px] tracking-[4px] text-gray-500 font-light">PORTFOLIO</p>
          <p className="text-[10px] tracking-[2px] text-[#c9a876] tabular-nums font-medium">
            {Math.min(100, Math.round(progress))}%
          </p>
        </div>
      </div>

      <style>{`
        @keyframes floatUp {
          0% { transform: translateY(0); opacity: 0; }
          12% { opacity: var(--max-o, 0.4); }
          88% { opacity: var(--max-o, 0.2); }
          100% { transform: translateY(-140px); opacity: 0; }
        }
        @keyframes drift {
          0%, 100% { margin-left: 0px; }
          50% { margin-left: 8px; }
        }
        @keyframes breathe {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.06); }
        }
        @keyframes spinReverse {
          from { transform: rotate(360deg); }
          to { transform: rotate(0deg); }
        }
        @keyframes sheen {
          0%, 100% { transform: translateX(-120%); }
          50% { transform: translateX(120%); }
        }
      `}</style>
    </div>
  );
};

export default Loader;