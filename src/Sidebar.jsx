import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  House, Search, Compass, Video, MessageCircle, Heart, CirclePlus, CircleUserRound, Menu 
} from 'lucide-react';
import { FaThreads } from 'react-icons/fa6';

function Sidebar({ isCollapsed, setIsCollapsed }) {
  const navigate = useNavigate();

  const navItems = [
    { icon: <House />, label: 'Home'},
    { icon: <Search />, label: 'Search'},
    { icon: <Compass />, label: 'Explore',},
    { icon: <Video />, label: 'Reels'},
    { icon: <MessageCircle />, label: 'Messages' },
    { icon: <Heart />, label: 'Notifications' },
    { icon: <CirclePlus />, label: 'Create' },
    { icon: <CircleUserRound />, label: 'Profile', path: '/profile' },
  ];

  return (
    <div className="h-screen bg-black text-white border-r border-neutral-800 flex flex-col justify-between p-3">
      <div>
        {/* Header Logo */}
        <div className="p-2 h-12 flex items-center">
          {!isCollapsed ? (
            <img className="w-28 bg-white rounded" src="/logo.png" alt="Instagram" />
          ) : (
            <span className="font-bold text-xl px-2">IG</span>
          )}
        </div>

        {/* Navigation Items */}
        <div className="flex flex-col gap-2 mt-4">
          {navItems.map((item, index) => (
            <div
              key={index}
              onClick={() => navigate(item.path)}
              className="flex items-center gap-4 p-3 rounded-lg hover:bg-neutral-900 cursor-pointer transition-colors"
            >
              <div className="text-xl">{item.icon}</div>
              {!isCollapsed && <span className="text-sm font-semibold">{item.label}</span>}
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Menu */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-4 p-3 rounded-lg hover:bg-neutral-900 cursor-pointer">
          <FaThreads className="text-xl" />
          {!isCollapsed && <span className="text-sm font-semibold">Threads</span>}
        </div>

        {/* Menu Toggle Button */}
        <div
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="flex items-center gap-4 p-3 rounded-lg hover:bg-neutral-900 cursor-pointer"
        >
          <Menu className="text-xl" />
          {!isCollapsed && <span className="text-sm font-semibold">More</span>}
        </div>
      </div>
    </div>
  );
}

export default Sidebar;