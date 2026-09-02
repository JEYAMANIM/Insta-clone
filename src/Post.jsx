import React, { useState, useEffect } from 'react';
import { FaHeart, FaRegHeart, FaRegComment, FaBookmark, FaRegBookmark } from 'react-icons/fa';
import { RiSendInsLine } from 'react-icons/ri';
import { apiClient } from './api/apiClient';

function Post() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savedPosts, setSavedPosts] = useState({});

  useEffect(() => {
    let isMounted = true;
    apiClient.getPosts()
      .then((data) => {
        if (isMounted) {
          setPosts(Array.isArray(data) ? data : []);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error('Error loading posts:', err);
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const handleToggleLike = async (postId) => {
    // Optimistic UI update
    setPosts((prevPosts) =>
      prevPosts.map((post) => {
        if (post.id === postId) {
          const currentlyLiked = post.engagement?.hasLiked ?? false;
          const currentLikes = post.engagement?.likesCount ?? 0;
          return {
            ...post,
            engagement: {
              ...post.engagement,
              hasLiked: !currentlyLiked,
              likesCount: currentlyLiked ? Math.max(0, currentLikes - 1) : currentLikes + 1,
            },
          };
        }
        return post;
      })
    );

    await apiClient.toggleLikePost(postId);
  };

  const handleToggleSave = (postId) => {
    setSavedPosts((prev) => ({
      ...prev,
      [postId]: !prev[postId],
    }));
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-8 space-y-4">
        <div className="w-8 h-8 border-4 border-neutral-700 border-t-purple-500 rounded-full animate-spin"></div>
        <p className="text-sm text-neutral-400">Loading feed...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center w-full max-w-xl mx-auto pb-12 space-y-6">
      {posts.length > 0 ? (
        posts.map((postItem) => {
          const isLiked = postItem.engagement?.hasLiked ?? false;
          const isSaved = savedPosts[postItem.id] ?? postItem.engagement?.hasSaved ?? false;
          const userAvatar = postItem.user?.profilePicture || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150';
          const postImage = postItem.content?.mediaUrls?.[0] || 'https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?w=800';

          return (
            <article
              key={postItem.id}
              className="w-full bg-black border border-neutral-800 rounded-xl overflow-hidden shadow-lg"
            >
              {/* Post Header */}
              <div className="flex items-center justify-between p-3">
                <div className="flex items-center gap-3">
                  <div className="p-[2px] bg-gradient-to-tr from-amber-500 via-red-500 to-purple-600 rounded-full">
                    <img
                      className="w-9 h-9 rounded-full object-cover border-2 border-black"
                      src={userAvatar}
                      alt={postItem.user?.username || 'User'}
                    />
                  </div>
                  <div>
                    <span className="text-sm font-semibold hover:underline cursor-pointer">
                      {postItem.user?.username || 'instagram_user'}
                    </span>
                    {postItem.location && (
                      <p className="text-[11px] text-neutral-400">{postItem.location}</p>
                    )}
                  </div>
                </div>
                <button className="text-neutral-400 hover:text-white text-lg px-2">•••</button>
              </div>

              {/* Post Media */}
              <div
                className="relative w-full bg-neutral-900 cursor-pointer overflow-hidden select-none"
                onDoubleClick={() => handleToggleLike(postItem.id)}
              >
                <img
                  className="w-full h-auto max-h-[550px] object-cover mx-auto"
                  src={postImage}
                  alt={postItem.caption || 'Post image'}
                  loading="lazy"
                />
              </div>

              {/* Post Actions */}
              <div className="p-3">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-4 text-xl">
                    <button
                      type="button"
                      onClick={() => handleToggleLike(postItem.id)}
                      className={`transition-transform active:scale-125 ${
                        isLiked ? 'text-red-500' : 'text-white hover:text-neutral-400'
                      }`}
                      title={isLiked ? 'Unlike' : 'Like'}
                    >
                      {isLiked ? <FaHeart /> : <FaRegHeart />}
                    </button>
                    <button
                      type="button"
                      className="text-white hover:text-neutral-400 transition-colors"
                      title="Comment"
                    >
                      <FaRegComment />
                    </button>
                    <button
                      type="button"
                      className="text-white hover:text-neutral-400 transition-colors"
                      title="Share"
                    >
                      <RiSendInsLine />
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleToggleSave(postItem.id)}
                    className="text-lg text-white hover:text-neutral-400 transition-colors"
                    title={isSaved ? 'Saved' : 'Save'}
                  >
                    {isSaved ? <FaBookmark className="text-neutral-200" /> : <FaRegBookmark />}
                  </button>
                </div>

                {/* Likes count */}
                <div className="mb-1.5">
                  <span className="text-sm font-semibold">
                    {(postItem.engagement?.likesCount ?? 0).toLocaleString()} likes
                  </span>
                </div>

                {/* Caption */}
                <div className="text-sm space-x-1.5">
                  <span className="font-semibold">{postItem.user?.username || 'user'}</span>
                  <span className="text-neutral-200">{postItem.caption}</span>
                </div>

                {/* Comments preview */}
                {postItem.topComments && postItem.topComments.length > 0 && (
                  <div className="mt-2 space-y-1">
                    <p className="text-xs text-neutral-400 cursor-pointer hover:text-neutral-300">
                      View all {postItem.engagement?.commentsCount || postItem.topComments.length} comments
                    </p>
                    {postItem.topComments.slice(0, 1).map((c) => (
                      <div key={c.id} className="text-xs">
                        <span className="font-semibold mr-1">{c.username}</span>
                        <span className="text-neutral-300">{c.text}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </article>
          );
        })
      ) : (
        <div className="text-center py-12 text-neutral-400">
          <p>No posts available at the moment.</p>
        </div>
      )}
    </div>
  );
}

export default Post;
