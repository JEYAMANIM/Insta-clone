import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiClient } from './api/apiClient';

function Story() {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;
    apiClient.getStories()
      .then((data) => {
        if (isMounted) {
          setStories(Array.isArray(data) ? data : []);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error('Error fetching stories:', err);
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  if (loading) {
    return (
      <div className="flex items-center gap-3 h-28 w-full overflow-x-auto p-2">
        {[1, 2, 3, 4, 5].map((n) => (
          <div key={n} className="flex flex-col items-center gap-2 shrink-0 animate-pulse">
            <div className="w-16 h-16 rounded-full bg-neutral-800"></div>
            <div className="w-12 h-2.5 bg-neutral-800 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  const totalStories = stories.length;

  return (
    <div className="flex items-center gap-4 h-28 w-full overflow-x-auto p-2 no-scrollbar">
      {stories.length > 0 ? (
        stories.map((item, index) => {
          const storyIndex = index + 1;
          const avatar = item.user?.profilePicture || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150';
          const name = item.user?.fullName || item.user?.username || 'User';

          return (
            <div
              key={item.id || index}
              onClick={() => navigate(`/story/${storyIndex}/${totalStories}`)}
              className="flex flex-col items-center gap-1.5 shrink-0 cursor-pointer group transition-transform active:scale-95"
            >
              {/* Instagram story border gradient ring */}
              <div className="p-[2.5px] bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 rounded-full group-hover:scale-105 transition-transform duration-200">
                <img
                  src={avatar}
                  alt={name}
                  className="w-14 h-14 rounded-full object-cover border-2 border-black bg-neutral-900"
                />
              </div>
              <p className="text-xs text-neutral-300 truncate w-16 text-center group-hover:text-white transition-colors">
                {name}
              </p>
            </div>
          );
        })
      ) : (
        <p className="text-gray-400 text-sm p-4">No stories found</p>
      )}
    </div>
  );
}

export default Story;