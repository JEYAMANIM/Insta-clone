import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import Feed from "./Feed";
import Suggestions from "./Suggestions";
import { House, Compass, Video, CircleUserRound, Heart, MessageCircle } from "lucide-react";
import logoImg from "./assets/Instagram_text.jpg";

export default function App() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="flex flex-col md:flex-row w-full min-h-screen bg-black text-white">
      {/* Mobile Top App Bar (visible on < md) */}
      <header className="md:hidden sticky top-0 z-40 bg-black/95 backdrop-blur border-b border-neutral-800 flex items-center justify-between px-4 h-14">
        <button
          type="button"
          onClick={() => navigate("/")}
          className="flex items-center focus:outline-none"
          aria-label="Instagram Home"
        >
          <img
            className="w-24 bg-white rounded p-0.5 object-contain"
            src={logoImg}
            alt="Instagram"
            width="96"
            height="32"
            fetchpriority="high"
            decoding="async"
          />
        </button>
        <div className="flex items-center gap-4 text-xl text-neutral-200">
          <button 
            type="button" 
            aria-label="Notifications" 
            className="hover:text-white transition"
          >
            <Heart size={22} />
          </button>
          <button 
            type="button" 
            aria-label="Messages" 
            className="hover:text-white transition"
          >
            <MessageCircle size={22} />
          </button>
        </div>
      </header>

      {/* Desktop/Tablet Sidebar (hidden on mobile, visible on md+) */}
      <div className={`hidden md:block transition-all duration-300 ${isCollapsed ? 'w-20' : 'w-60'} shrink-0 overflow-hidden sticky top-0 h-screen`}>
        <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
      </div>

      {/* Feed Container */}
      <main className="flex-1 flex justify-center p-2 sm:p-4 pb-20 md:pb-4 overflow-y-auto">
        <div className={`w-full transition-all duration-300 ${isCollapsed ? 'max-w-3xl' : 'max-w-xl'}`}>
          <h1 className="sr-only">Instagram Feed and Stories</h1>
          <Feed />
        </div>
      </main>

      {/* Right Suggestions Bar (desktop only) */}
      <aside aria-label="Suggested accounts" className="w-80 shrink-0 hidden lg:block p-4 sticky top-0 h-screen overflow-y-auto">
        <Suggestions />
      </aside>

      {/* Mobile Bottom Navigation Bar (fixed at bottom on < md) */}
      <nav 
        aria-label="Mobile Navigation" 
        className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-black/95 backdrop-blur border-t border-neutral-800 flex items-center justify-around h-14 px-2"
      >
        <button
          type="button"
          onClick={() => navigate("/")}
          aria-label="Home"
          aria-current={location.pathname === "/" ? "page" : undefined}
          className={`p-2 transition-transform active:scale-90 ${
            location.pathname === "/" ? "text-white" : "text-neutral-400 hover:text-white"
          }`}
        >
          <House size={24} />
        </button>
        <button
          type="button"
          onClick={() => navigate("/")}
          aria-label="Explore"
          className="p-2 text-neutral-400 hover:text-white transition-transform active:scale-90"
        >
          <Compass size={24} />
        </button>
        <button
          type="button"
          onClick={() => navigate("/")}
          aria-label="Reels"
          className="p-2 text-neutral-400 hover:text-white transition-transform active:scale-90"
        >
          <Video size={24} />
        </button>
        <button
          type="button"
          onClick={() => navigate("/profile")}
          aria-label="Profile"
          aria-current={location.pathname === "/profile" ? "page" : undefined}
          className={`p-2 transition-transform active:scale-90 ${
            location.pathname === "/profile" ? "text-white" : "text-neutral-400 hover:text-white"
          }`}
        >
          <CircleUserRound size={24} />
        </button>
      </nav>
    </div>
  );
}