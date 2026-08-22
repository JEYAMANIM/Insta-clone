import React, { useState } from "react";
import Sidebar from "./Sidebar";
import Feed from "./Feed";
import Suggestions from "./Suggestions";

export default function App() {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="flex w-full min-h-screen bg-black text-white">
      {/* Sidebar - Toggles between expanded (w-60) and collapsed (w-20) */}
      <div className={`transition-all duration-300 ${isCollapsed ? 'w-20' : 'w-60'} shrink-0 overflow-hidden`}>
        <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
      </div>

      {/* Feed Container - Dynamically expands max-width when sidebar shrinks */}
      <div className="flex-1 flex justify-center p-4 overflow-y-auto 
       [&::-webkit-scrollbar]:w-1.5 
       [&::-webkit-scrollbar-track]:bg-black
       [&::-webkit-scrollbar-thumb]:bg-blue-800 
       [&::-webkit-scrollbar-thumb]:rounded-full 
       hover:[&::-webkit-scrollbar-thumb]:bg-purple-600">
        <div className={`w-full transition-all duration-300 ${isCollapsed ? 'max-w-3xl' : 'max-w-xl'}`}>
          <Feed />
        </div>
      </div>

      {/* Right Suggestions Bar */}
      <div className="w-80 shrink-0 hidden lg:block p-4">
        <Suggestions />
      </div>
    </div>
  );
}