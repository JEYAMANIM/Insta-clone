import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Suggestions() {
  const [profile, setProfile] = useState(null);
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    // 1. Fetch User Profile
    axios.get('https://my-json-server.typicode.com/JEYAMANIM/Insta-clone/profile')
      .then((res) => {
        const data = Array.isArray(res.data) ? res.data[0] : res.data;
        setProfile(data);
      })
      .catch((err) => console.error('Profile fetch error:', err));

    // 2. Fetch Suggestions
    axios.get('https://my-json-server.typicode.com/JEYAMANIM/Insta-clone/suggestions')
      .then((res) => setSuggestions(res.data))
      .catch((err) => console.error('Suggestions fetch error:', err));
  }, []);

  const handleToggleFollow = (e, item) => {
    e.preventDefault(); // Stop default button submit behavior
    const nextState = !item.isFollowing;

    // A. Update React UI state immediately
    setSuggestions((prev) =>
      prev.map((user) =>
        user.id === item.id ? { ...user, isFollowing: nextState } : user
      )
    );

    // B. Save isFollowing directly to /suggestions endpoint in db.json
    axios.patch(`http://localhost:3000/suggestions/${item.id}`, {
      isFollowing: nextState,
    }).catch((err) => console.error('Error updating suggestion status:', err));

    // C. Sync with /followers endpoint
    if (nextState) {
      axios.post('http://localhost:3000/followers', {
        id: item.id,
        username: item.username,
        profilePicture: item.profilePicture,
      }).catch((err) => console.error('Error adding follower:', err));
    } else {
      axios.delete(`http://localhost:3000/followers/${item.id}`)
        .catch((err) => console.error('Error removing follower:', err));
    }
  };

  return (
    <div className="w-full space-y-6 text-white p-2">
      {/* Current User Profile Banner */}
      {profile && (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              className="w-11 h-11 rounded-full object-cover ring-2 ring-purple-500/30"
              src={profile.profilePicture || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150"}
              alt={profile.username}
            />
            <div className="flex flex-col">
              <span className="font-semibold text-sm">{profile.username}</span>
              <span className="text-xs text-neutral-400">{profile.fullName}</span>
            </div>
          </div>
          <button className="text-xs font-semibold text-purple-400 hover:text-purple-300 transition">
            Switch
          </button>
        </div>
      )}

      {/* Suggestions Header */}
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-neutral-400">Suggestions for you</span>
        <button className="text-xs font-semibold text-white hover:text-gray-300 transition">
          See all
        </button>
      </div>

      {/* Suggestions List */}
      <div className="space-y-4">
        {suggestions.map((item) => (
          <div key={item.id} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img
                className="w-9 h-9 rounded-full object-cover ring-1 ring-neutral-800"
                src={item.profilePicture || `https://i.pravatar.cc/150?u=${item.id}`}
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
                  ? 'bg-neutral-800 text-neutral-200 hover:bg-neutral-700'
                  : 'bg-blue-500 text-white hover:bg-blue-600'
              }`}
            >
              {item.isFollowing ? 'Following' : 'Follow'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Suggestions;