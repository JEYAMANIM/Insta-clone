import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiClient } from './api/apiClient';

function Suggestions() {
  const [profile, setProfile] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;

    Promise.all([apiClient.getProfile(), apiClient.getSuggestions()])
      .then(([profData, suggData]) => {
        if (isMounted) {
          if (profData) setProfile(profData);
          if (suggData) setSuggestions(Array.isArray(suggData) ? suggData : []);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error('Error fetching suggestions:', err);
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const handleToggleFollow = async (e, item) => {
    e.preventDefault();
    const nextState = !item.isFollowing;

    // Optimistic UI update
    setSuggestions((prev) =>
      prev.map((user) =>
        user.id === item.id ? { ...user, isFollowing: nextState } : user
      )
    );

    await apiClient.toggleFollow(item.id, nextState);
  };

  if (loading) {
    return (
      <div className="w-full space-y-4 p-2 animate-pulse">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-full bg-neutral-800"></div>
          <div className="space-y-1.5 flex-1">
            <div className="w-24 h-3 bg-neutral-800 rounded"></div>
            <div className="w-16 h-2.5 bg-neutral-800 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6 text-white p-2">
      {/* Current User Profile Banner */}
      {profile && (
        <div className="flex items-center justify-between">
          <div
            onClick={() => navigate('/profile')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="p-[1.5px] bg-gradient-to-tr from-purple-500 to-pink-500 rounded-full">
              <img
                className="w-11 h-11 rounded-full object-cover border-2 border-black"
                src={
                  profile.profilePicture ||
                  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'
                }
                alt={profile.username || 'User'}
              />
            </div>
            <div className="flex flex-col">
              <span className="font-semibold text-sm group-hover:underline">
                {profile.username}
              </span>
              <span className="text-xs text-neutral-400">{profile.fullName}</span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => navigate('/profile')}
            className="text-xs font-semibold text-purple-400 hover:text-purple-300 transition"
          >
            Profile
          </button>
        </div>
      )}

      {/* Suggestions Header */}
      <div className="flex items-center justify-between pt-2">
        <span className="text-xs font-semibold text-neutral-400">Suggestions for you</span>
        <button
          type="button"
          onClick={() => navigate('/profile')}
          className="text-xs font-semibold text-neutral-300 hover:text-white transition"
        >
          See all
        </button>
      </div>

      {/* Suggestions List */}
      <div className="space-y-4">
        {suggestions.length > 0 ? (
          suggestions.map((item) => (
            <div key={item.id} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img
                  className="w-9 h-9 rounded-full object-cover ring-1 ring-neutral-800"
                  src={
                    item.profilePicture ||
                    `https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150`
                  }
                  alt={item.username}
                />
                <div className="flex flex-col">
                  <span className="text-sm font-semibold">{item.username}</span>
                  <span className="text-[11px] text-neutral-500">Suggested for you</span>
                </div>
              </div>

              {/* Follow / Following Toggle Button */}
              <button
                type="button"
                onClick={(e) => handleToggleFollow(e, item)}
                className={`text-xs font-semibold px-4 py-1.5 rounded-lg transition-colors ${
                  item.isFollowing
                    ? 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
                    : 'bg-blue-600 text-white hover:bg-blue-500'
                }`}
              >
                {item.isFollowing ? 'Following' : 'Follow'}
              </button>
            </div>
          ))
        ) : (
          <p className="text-xs text-neutral-500">No suggestions available</p>
        )}
      </div>

      {/* Footer Info */}
      <div className="pt-4 text-[11px] text-neutral-600 space-y-2">
        <p>© 2026 Instagram Clone by JEYAMANIM</p>
      </div>
    </div>
  );
}

export default Suggestions;