import React from "react";
import Sidebar from "./components/Sidebar";
import CenterBrand from "./components/CenterBrand";
import InputBar from "./components/InputBar";

export default function App() {
  return (
    <div className="w-screen h-screen flex overflow-hidden bg-main-gradient relative" style={{ minWidth: 1366, minHeight: 768 }}>
      <Sidebar />
      <div className="flex-1 flex flex-col items-center justify-center relative">
        <CenterBrand />
        <InputBar />
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-gray-200 text-lg italic font-medium opacity-70 select-none" style={{letterSpacing: "0.03em"}}>
          LLMs may make mistakes
        </div>
      </div>
    </div>
  );
}
