import React from "react";

const suggestions = [
  "how does time and space coordinate in the real world",
  "create a chatbot backend",
  "etc clarification",
  "yo wassup",
  "world peace"
];

export default function Sidebar() {
  return (
    <aside
      className="liquid-glass flex flex-col justify-between h-full"
      style={{
        width: 310,
        minWidth: 310,
        padding: "36px 0 36px 0",
        borderTopRightRadius: 48,
        borderBottomRightRadius: 48,
        borderTopLeftRadius: 0,
        borderBottomLeftRadius: 0,
      }}
    >
      <div>
        <div className="flex items-center gap-2 pl-8 mb-5">
          <svg width={32} height={32} viewBox="0 0 48 48" fill="none">
            <path d="M25.2 6.8L24.3 23.5H34.5L18.8 41.2L19.7 24.5H9.5L25.2 6.8Z" fill="#fff" fillOpacity="0.85"/>
          </svg>
        </div>
        <div className="pl-8 text-lg text-white font-semibold tracking-wider mb-3">
          New conversation
        </div>
        <div className="pl-8 pr-8">
          <div style={{borderBottom: "2px solid rgba(255,255,255,0.18)"}}></div>
        </div>
        <div className="pl-8 mt-3 mb-2 text-base text-white/80 font-medium">self chat</div>
        <div className="pl-8 pr-6">
          <div className="suggestions-bubble">
            <ul>
              {suggestions.map((text, i) =>
                <li key={i} style={{marginBottom: i === suggestions.length-1 ? 0 : "0.5em", listStyle: "disc inside"}}>
                  {text}
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>
      <div className="flex flex-col items-center gap-7">
        <button
          className="flex items-center gap-2 bg-transparent border-none outline-none cursor-pointer"
          style={{
            opacity: 0.8,
            pointerEvents: "none",
            marginBottom: 18
          }}
        >
          <span className="rounded-full border border-white/70 flex items-center justify-center" style={{width: 44, height: 44, fontSize: 30, background: "rgba(255,255,255,0.10)"}}>
            <svg width={28} height={28} fill="none" viewBox="0 0 24 24">
              <circle cx="12" cy="8" r="5" stroke="#fff" strokeWidth="2"/>
              <path d="M2 21c0-3.5 4.5-6 10-6s10 2.5 10 6" stroke="#fff" strokeWidth="2"/>
            </svg>
          </span>
          <span
            className="mt-1 text-white/80 font-semibold rounded-2xl px-7 py-2"
            style={{
              background: "rgba(0,0,0,0.2)",
              fontSize: "1.25rem",
              opacity: 0.8
            }}
          >
            Login
          </span>
        </button>
      </div>
    </aside>
  );
}
