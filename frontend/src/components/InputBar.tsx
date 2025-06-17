import React, { useState } from "react";

export default function InputBar() {
  const [input, setInput] = useState("");
  return (
    <form
      className="absolute left-1/2 -translate-x-1/2 bottom-16 w-[calc(100%-380px)] max-w-4xl flex items-center"
      style={{zIndex: 10}}
      onSubmit={e => { e.preventDefault(); /* handle send */ }}
    >
      <input
        className="flex-1 py-4 px-7 text-lg rounded-full bg-glass-dark text-white font-medium placeholder:italic placeholder:text-white/60 outline-none border-none mr-2 shadow-2xl"
        style={{
          background: "rgba(0,0,0,0.36)",
          boxShadow: "0 2px 18px 0 rgba(31,38,135,0.10)",
          minWidth: 0
        }}
        placeholder="type your text here"
        value={input}
        onChange={e => setInput(e.target.value)}
      />
      <button
        type="submit"
        className="flex items-center px-7 py-3 ml-2 text-lg font-semibold rounded-full"
        style={{
          background: "rgba(0,0,0,0.55)",
          color: "#fff",
          boxShadow: "0 1px 6px rgba(80,0,150,0.09)",
          fontWeight: 700,
          letterSpacing: "0.03em",
        }}
      >
        enter
        <span className="ml-3">
          <svg width={24} height={24} fill="none" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="11" stroke="#fff" strokeWidth="2" opacity="0.7"/>
            <path d="M12 16v-4m0 0V8m0 4h4m-4 0H8" stroke="#fff" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </span>
      </button>
      <button
        type="button"
        className="ml-2 flex items-center justify-center rounded-full"
        style={{
          width: 54,
          height: 54,
          background: "rgba(0,0,0,0.32)",
          border: "1.5px solid rgba(255,255,255,0.11)"
        }}
      >
        <svg width={30} height={30} fill="none" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="10" stroke="#fff" strokeWidth="2" opacity="0.7"/>
          <path d="M12 8v4m0 0v4m0-4h4m-4 0H8" stroke="#fff" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      </button>
    </form>
  );
}
