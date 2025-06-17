import React from "react";

export default function CenterBrand() {
  return (
    <div className="flex flex-col items-center justify-center" style={{marginTop: -64}}>
      {/* Lightning Bolt 3D style SVG */}
      <div style={{
        width: 168,
        height: 168,
        marginBottom: 20,
        filter: "drop-shadow(0px 8px 24px rgba(173, 97, 255, 0.19))"
      }}>
        <svg viewBox="0 0 300 300" width="100%" height="100%" fill="none">
          <defs>
            <linearGradient id="bolt-gradient" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#b2b8ff"/>
              <stop offset="100%" stopColor="#b181e6"/>
            </linearGradient>
          </defs>
          <path
            d="M161 36L141 176H205L97 264L117 124H53L161 36Z"
            fill="url(#bolt-gradient)"
            stroke="#fff"
            strokeWidth="6"
            filter="drop-shadow(0px 5px 14px #a47bf8)"
          />
        </svg>
      </div>
      <div
        className="text-[4.3rem] font-extrabold tracking-tight text-center"
        style={{
          color: "rgba(255,255,255,0.82)",
          fontFamily: "'Montserrat', 'Inter', sans-serif",
          textShadow: "0 2px 8px rgba(80,0,150,0.16)",
          letterSpacing: "-0.04em"
        }}
      >
        Ultimate <span style={{ fontWeight: 900, opacity: 0.95 }}>ai 3.5</span>
      </div>
    </div>
  );
}
