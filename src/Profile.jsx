import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Profile() {
  const [profile, setProfile] = useState({ id: 1, username: '', fullName: '', profilePicture: '' });
  const [followers, setFollowers] = useState([]);

  useEffect(() => {
    // Fetch Profile
    axios.get('https://my-json-server.typicode.com/JEYAMANIM/Insta-clone/profile')
      .then((res) => {
        const data = Array.isArray(res.data) ? res.data[0] : res.data;
        if (data) setProfile(data);
      })
      .catch((err) => console.error('Fetch profile error:', err));

    // Fetch Followers
    axios.get('https://my-json-server.typicode.com/JEYAMANIM/Insta-clone/followers')
      .then((res) => setFollowers(res.data))
      .catch((err) => console.error('Fetch followers error:', err));
  }, []);

  const handleUpdate = async (e) => {
    e.preventDefault();
    const endpoint = profile.id ? `http://localhost:3000/profile/${profile.id}` : 'http://localhost:3000/profile';

    try {
      // Try PATCH first, fallback to PUT
      const res = await axios.patch(endpoint, profile).catch(() => axios.put(endpoint, profile));
      alert('Profile updated successfully!');
      if (res?.data) {
        const updated = Array.isArray(res.data) ? res.data[0] : res.data;
        setProfile(updated);
      }
    } catch (err) {
      console.error('Update failed:', err);
    }
  };

  const handleUnfollow = (id) => {
    axios.delete(`http://localhost:3000/followers/${id}`)
      .then(() => {
        setFollowers((prev) => prev.filter((item) => item.id !== id));
      })
      .catch((err) => console.error('Unfollow failed:', err));
  };

  return (
    <div className="min-h-screen bg-neutral-900 text-white p-8">
      {/* Profile Header Image */}
      <div className="flex flex-col items-start gap-3 mb-6">
        <img
          src={profile.profilePicture || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150"}
          alt="Profile"
          className="w-28 h-28 rounded-full object-cover border-2 border-purple-500"
        />
        <h2 className="text-xl font-bold">{profile.username || 'Komi'}</h2>
      </div>

      {/* Edit Profile Inputs */}
      <form onSubmit={handleUpdate} className="flex flex-col gap-3 max-w-xs mb-8">
        <input
          type="text"
          value={profile.username}
          onChange={(e) => setProfile({ ...profile, username: e.target.value })}
          placeholder="Username"
          className="bg-neutral-800 border border-neutral-700 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-purple-500"
        />
        <input
          type="text"
          value={profile.fullName}
          onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
          placeholder="Full Name"
          className="bg-neutral-800 border border-neutral-700 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-purple-500"
        />
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold py-2 px-4 rounded transition w-20"
        >
          Update
        </button>
      </form>

      {/* Followers Section */}
      <div className="max-w-md">
        <h3 className="font-bold text-lg mb-3">Followers</h3>
        <div className="space-y-2">
          {followers.map((item) => (
            <div key={item.id} className="flex items-center justify-between border-b border-neutral-800 pb-2">
              <span className="text-sm font-medium">{item.username}</span>
              <button
                type="button"
                onClick={() => handleUnfollow(item.id)}
                className="bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-semibold px-3 py-1 rounded transition"
              >
                Unfollow
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Profile;