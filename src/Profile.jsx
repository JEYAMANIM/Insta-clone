import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { IoArrowBack, IoCheckmarkCircle } from 'react-icons/io5';
import { apiClient } from './api/apiClient';

function Profile() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState({
    id: 'u_001',
    username: 'komi_official',
    fullName: 'Komi Shouko',
    profilePicture: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300',
    bio: 'Living life in high definition ✨ Photographer & Content Creator 📸',
    postsCount: 5,
    followingCount: 142,
  });
  const [followers, setFollowers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    let isMounted = true;

    Promise.all([apiClient.getProfile(), apiClient.getFollowers()])
      .then(([profData, followersData]) => {
        if (isMounted) {
          if (profData) setProfile(profData);
          if (followersData) setFollowers(Array.isArray(followersData) ? followersData : []);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error('Error loading profile data:', err);
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const updated = await apiClient.updateProfile(profile);
      if (updated) setProfile(updated);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.error('Update failed:', err);
      alert('Could not update profile');
    }
  };

  const handleUnfollow = async (id) => {
    try {
      const result = await apiClient.unfollowUser(id);
      if (result?.followers) {
        setFollowers(result.followers);
      } else {
        setFollowers((prev) => prev.filter((item) => item.id !== id));
      }
    } catch (err) {
      console.error('Unfollow failed:', err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-neutral-700 border-t-purple-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-4 sm:p-8 max-w-2xl mx-auto">
      {/* Top Header Navigation */}
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-neutral-800">
        <button
          type="button"
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-sm text-neutral-400 hover:text-white transition-colors"
        >
          <IoArrowBack className="text-lg" />
          <span>Back to Feed</span>
        </button>
        <span className="text-sm font-semibold tracking-wide text-neutral-300">
          @{profile.username || 'profile'}
        </span>
        <div className="w-16" />
      </div>

      {/* Profile Header Image & Stats */}
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 mb-8">
        <div className="relative">
          <div className="p-[3px] bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 rounded-full">
            <img
              src={
                profile.profilePicture ||
                'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300'
              }
              alt="Profile"
              className="w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover border-4 border-black"
            />
          </div>
        </div>

        <div className="flex-1 text-center sm:text-left space-y-3">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold">{profile.fullName || 'User'}</h2>
            <p className="text-sm text-neutral-400">@{profile.username || 'username'}</p>
          </div>

          <p className="text-sm text-neutral-300 max-w-md">
            {profile.bio || 'Instagram user ✨'}
          </p>

          {/* Stats Bar */}
          <div className="flex items-center justify-center sm:justify-start gap-6 pt-2 text-sm">
            <div>
              <span className="font-bold">{profile.postsCount ?? 5}</span>{' '}
              <span className="text-neutral-400">posts</span>
            </div>
            <div>
              <span className="font-bold">{followers.length}</span>{' '}
              <span className="text-neutral-400">followers</span>
            </div>
            <div>
              <span className="font-bold">{profile.followingCount ?? 142}</span>{' '}
              <span className="text-neutral-400">following</span>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Profile Form */}
      <div className="bg-neutral-950 border border-neutral-800 rounded-xl p-6 mb-8 shadow-md">
        <h3 className="font-bold text-base mb-4 text-neutral-200">Edit Profile Information</h3>

        {saveSuccess && (
          <div className="mb-4 p-3 bg-emerald-950/80 border border-emerald-600/50 rounded-lg flex items-center gap-2 text-emerald-300 text-sm animate-fade-in">
            <IoCheckmarkCircle className="text-lg text-emerald-400" />
            <span>Profile updated successfully!</span>
          </div>
        )}

        <form onSubmit={handleUpdate} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-1">
              Username
            </label>
            <input
              type="text"
              value={profile.username || ''}
              onChange={(e) => setProfile({ ...profile, username: e.target.value })}
              placeholder="Username"
              required
              className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-3.5 py-2 text-sm text-white focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-1">
              Full Name
            </label>
            <input
              type="text"
              value={profile.fullName || ''}
              onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
              placeholder="Full Name"
              required
              className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-3.5 py-2 text-sm text-white focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-1">
              Bio
            </label>
            <input
              type="text"
              value={profile.bio || ''}
              onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
              placeholder="Your bio"
              className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-3.5 py-2 text-sm text-white focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition"
            />
          </div>

          <button
            type="submit"
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white text-sm font-semibold py-2 px-6 rounded-lg transition-transform active:scale-95 shadow-md"
          >
            Save Changes
          </button>
        </form>
      </div>

      {/* Followers Section */}
      <div className="bg-neutral-950 border border-neutral-800 rounded-xl p-6 shadow-md">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-base text-neutral-200">
            Followers ({followers.length})
          </h3>
        </div>

        {followers.length > 0 ? (
          <div className="space-y-3">
            {followers.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between border-b border-neutral-800/80 pb-3 last:border-0"
              >
                <div className="flex items-center gap-3">
                  <img
                    className="w-10 h-10 rounded-full object-cover border border-neutral-700"
                    src={
                      item.profilePicture ||
                      `https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150`
                    }
                    alt={item.username}
                  />
                  <div>
                    <p className="text-sm font-semibold text-white">{item.username}</p>
                    <p className="text-xs text-neutral-400">{item.fullName || 'Instagram user'}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleUnfollow(item.id)}
                  className="bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-semibold px-3 py-1.5 rounded-lg transition"
                >
                  Unfollow
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-neutral-500">No followers currently.</p>
        )}
      </div>
    </div>
  );
}

export default Profile;