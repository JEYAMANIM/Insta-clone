import React, { memo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  House, Search, Compass, Video, MessageCircle, Heart, CirclePlus, CircleUserRound, Menu,
} from 'lucide-react';
import { FaThreads } from 'react-icons/fa6';
import logoImg from './assets/Instagram_text.jpg';

// Defined OUTSIDE the component so the array reference never changes between renders
const NAV_ITEMS = [
  { icon: <House aria-hidden="true" />, label: 'Home', path: '/' },
  { icon: <Search aria-hidden="true" />, label: 'Search', path: '/' },
  { icon: <Compass aria-hidden="true" />, label: 'Explore', path: '/' },
  { icon: <Video aria-hidden="true" />, label: 'Reels', path: '/' },
  { icon: <MessageCircle aria-hidden="true" />, label: 'Messages', path: '/' },
  { icon: <Heart aria-hidden="true" />, label: 'Notifications', path: '/' },
  { icon: <CirclePlus aria-hidden="true" />, label: 'Create', path: '/' },
  { icon: <CircleUserRound aria-hidden="true" />, label: 'Profile', path: '/profile' },
];

const Sidebar = memo(function Sidebar({ isCollapsed, setIsCollapsed }) {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <aside
      aria-label="Main Navigation"
      className="h-screen bg-black text-white border-r border-neutral-800 flex flex-col justify-between p-3 select-none"
    >
      <div>
        {/* Header Logo */}
        <button
          type="button"
          onClick={() => navigate('/')}
          aria-label="Instagram Home"
          className="w-full p-2 h-14 flex items-center cursor-pointer text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-pink-500 rounded-lg"
        >
          {!isCollapsed ? (
            <img
              className="w-28 bg-white rounded p-0.5 object-contain"
              src={logoImg}
              alt="Instagram"
              width="112"
              height="38"
              onError={(e) => { e.currentTarget.style.display = 'none'; }}
            />
          ) : (
            <span className="font-extrabold text-xl px-2 bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
              IG
            </span>
          )}
        </button>

        {/* Navigation Items */}
        <nav aria-label="Primary Navigation" className="flex flex-col gap-1.5 mt-4">
          {NAV_ITEMS.map((item, index) => {
            const isActive = location.pathname === item.path && item.path !== '/';
            const isHomeActive = item.path === '/' && item.label === 'Home' && location.pathname === '/';

            return (
              <button
                type="button"
                key={index}
                onClick={() => navigate(item.path)}
                aria-label={item.label}
                aria-current={(isActive || isHomeActive) ? 'page' : undefined}
                className={`w-full flex items-center gap-4 p-3 rounded-xl cursor-pointer transition-all duration-150 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-pink-500 ${
                  isActive || isHomeActive
                    ? 'bg-neutral-900 text-white font-bold'
                    : 'text-neutral-300 hover:bg-neutral-900/70 hover:text-white'
                }`}
              >
                <span className={`text-xl flex items-center justify-center ${(isActive || isHomeActive) ? 'scale-105' : ''}`}>
                  {item.icon}
                </span>
                {!isCollapsed && <span className="text-sm font-medium">{item.label}</span>}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Menu */}
      <div className="flex flex-col gap-1.5 pb-2">
        <a
          href="https://threads.net"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Open Threads app"
          className="flex items-center gap-4 p-3 rounded-xl hover:bg-neutral-900 cursor-pointer text-neutral-300 hover:text-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-pink-500"
        >
          <FaThreads className="text-xl" aria-hidden="true" />
          {!isCollapsed && <span className="text-sm font-medium">Threads</span>}
        </a>

        {/* Menu Toggle Button */}
        <button
          type="button"
          onClick={() => setIsCollapsed(!isCollapsed)}
          aria-label={isCollapsed ? 'Expand navigation sidebar' : 'Collapse navigation sidebar'}
          className="w-full flex items-center gap-4 p-3 rounded-xl hover:bg-neutral-900 cursor-pointer text-neutral-300 hover:text-white transition-colors text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-pink-500"
        >
          <Menu className="text-xl" aria-hidden="true" />
          {!isCollapsed && <span className="text-sm font-medium">Toggle Menu</span>}
        </button>
      </div>
    </aside>
  );
});

export default Sidebar;