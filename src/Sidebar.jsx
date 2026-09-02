import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  House, Search, Compass, Video, MessageCircle, Heart, CirclePlus, CircleUserRound, Menu 
} from 'lucide-react';
import { FaThreads } from 'react-icons/fa6';
import logoImg from './assets/Instagram_text.jpg';

function Sidebar({ isCollapsed, setIsCollapsed }) {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { icon: <House />, label: 'Home', path: '/' },
    { icon: <Search />, label: 'Search', path: '/' },
    { icon: <Compass />, label: 'Explore', path: '/' },
    { icon: <Video />, label: 'Reels', path: '/' },
    { icon: <MessageCircle />, label: 'Messages', path: '/' },
    { icon: <Heart />, label: 'Notifications', path: '/' },
    { icon: <CirclePlus />, label: 'Create', path: '/' },
    { icon: <CircleUserRound />, label: 'Profile', path: '/profile' },
  ];

  const handleNavClick = (path) => {
    if (path) {
      navigate(path);
    }
  };

  return (
    <aside className="h-screen bg-black text-white border-r border-neutral-800 flex flex-col justify-between p-3 select-none">
      <div>
        {/* Header Logo */}
        <div 
          onClick={() => navigate('/')} 
          className="p-2 h-14 flex items-center cursor-pointer"
        >
          {!isCollapsed ? (
            <img
              className="w-28 bg-white rounded p-0.5 object-contain"
              src={logoImg}
              alt="Instagram"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          ) : (
            <span className="font-extrabold text-xl px-2 bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
              IG
            </span>
          )}
        </div>

        {/* Navigation Items */}
        <nav className="flex flex-col gap-1.5 mt-4">
          {navItems.map((item, index) => {
            const isActive = location.pathname === item.path;

            return (
              <div
                key={index}
                onClick={() => handleNavClick(item.path)}
                className={`flex items-center gap-4 p-3 rounded-xl cursor-pointer transition-all duration-150 ${
                  isActive
                    ? 'bg-neutral-900 text-white font-bold'
                    : 'text-neutral-300 hover:bg-neutral-900/70 hover:text-white'
                }`}
              >
                <div className={`text-xl ${isActive ? 'scale-105' : ''}`}>{item.icon}</div>
                {!isCollapsed && <span className="text-sm font-medium">{item.label}</span>}
              </div>
            );
          })}
        </nav>
      </div>

      {/* Bottom Menu */}
      <div className="flex flex-col gap-1.5 pb-2">
        <div 
          onClick={() => window.open('https://threads.net', '_blank')}
          className="flex items-center gap-4 p-3 rounded-xl hover:bg-neutral-900 cursor-pointer text-neutral-300 hover:text-white transition-colors"
        >
          <FaThreads className="text-xl" />
          {!isCollapsed && <span className="text-sm font-medium">Threads</span>}
        </div>

        {/* Menu Toggle Button */}
        <div
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="flex items-center gap-4 p-3 rounded-xl hover:bg-neutral-900 cursor-pointer text-neutral-300 hover:text-white transition-colors"
        >
          <Menu className="text-xl" />
          {!isCollapsed && <span className="text-sm font-medium">Toggle Menu</span>}
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;