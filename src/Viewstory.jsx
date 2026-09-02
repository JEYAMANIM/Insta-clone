import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { IoArrowBackCircleSharp, IoArrowForwardCircle, IoClose } from 'react-icons/io5';
import { apiClient } from './api/apiClient';

function Viewstory() {
  const { id, tot } = useParams();
  const [story, setStory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const navigate = useNavigate();

  const currentId = parseInt(id, 10) || 1;
  const totalStories = parseInt(tot, 10) || 6;

  // Load story data
  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setProgress(0);

    apiClient.getStoryById(currentId)
      .then((data) => {
        if (isMounted) {
          if (data) {
            setStory(data);
          } else {
            navigate('/');
          }
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error('Error fetching story:', err);
        if (isMounted) navigate('/');
      });

    return () => {
      isMounted = false;
    };
  }, [currentId, navigate]);

  // Story progress bar & auto-advancement (5 seconds)
  useEffect(() => {
    if (loading || !story) return;

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          if (currentId < totalStories) {
            navigate(`/story/${currentId + 1}/${totalStories}`);
          } else {
            navigate('/');
          }
          return 100;
        }
        return prev + 2; // 50 ticks * 100ms = 5000ms
      });
    }, 100);

    return () => clearInterval(interval);
  }, [currentId, totalStories, story, loading, navigate]);

  const prevId = currentId - 1;
  const nextId = currentId + 1;

  return (
    <div className="fixed inset-0 z-50 bg-black flex items-center justify-center select-none">
      {/* Background blur styling */}
      <div className="absolute inset-0 bg-gradient-to-b from-neutral-900 via-black to-neutral-950 opacity-90" />

      {/* Top Close Button */}
      <button
        type="button"
        onClick={() => navigate('/')}
        className="absolute top-6 right-6 z-50 text-white text-3xl hover:text-neutral-400 transition-colors p-2 rounded-full bg-neutral-900/50 backdrop-blur"
        title="Close"
      >
        <IoClose />
      </button>

      {/* Navigation Controls & Story Container */}
      <div className="relative z-10 flex items-center justify-center gap-4 w-full max-w-2xl px-4">
        {/* Previous Story Arrow */}
        {prevId >= 1 ? (
          <Link
            to={`/story/${prevId}/${totalStories}`}
            className="text-4xl text-white/70 hover:text-white hover:scale-110 transition shrink-0 hidden sm:flex"
            title="Previous Story"
          >
            <IoArrowBackCircleSharp />
          </Link>
        ) : (
          <div className="w-10 shrink-0 hidden sm:block" />
        )}

        {/* Story Card Container */}
        <div className="relative w-full max-w-sm h-[80vh] max-h-[700px] bg-neutral-900 rounded-2xl overflow-hidden shadow-2xl border border-neutral-800 flex flex-col justify-between">
          {/* Top Progress Bar & Header */}
          <div className="absolute top-0 inset-x-0 z-20 p-3 bg-gradient-to-b from-black/80 to-transparent space-y-2">
            {/* Progress line */}
            <div className="w-full h-1 bg-white/30 rounded-full overflow-hidden">
              <div
                className="h-full bg-white transition-all duration-100 ease-linear rounded-full"
                style={{ width: `${progress}%` }}
              />
            </div>

            {/* Story Author Info */}
            {story && (
              <div className="flex items-center gap-2 pt-1">
                <img
                  className="w-8 h-8 rounded-full object-cover border border-white"
                  src={
                    story.user?.profilePicture ||
                    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'
                  }
                  alt={story.user?.fullName || 'User'}
                />
                <span className="text-white text-xs font-semibold drop-shadow">
                  {story.user?.fullName || story.user?.username || 'Story'}
                </span>
                <span className="text-white/60 text-[10px]">
                  {currentId} of {totalStories}
                </span>
              </div>
            )}
          </div>

          {/* Story Media Image */}
          {loading || !story ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="w-10 h-10 border-4 border-neutral-700 border-t-white rounded-full animate-spin"></div>
            </div>
          ) : (
            <img
              className="w-full h-full object-cover"
              src={story.mediaUrls?.[0] || story.mediaUrls}
              alt="Story"
            />
          )}

          {/* Mobile Tap Areas for Next / Prev */}
          <div
            className="absolute inset-y-0 left-0 w-1/3 z-10 sm:hidden cursor-pointer"
            onClick={() => {
              if (prevId >= 1) navigate(`/story/${prevId}/${totalStories}`);
              else navigate('/');
            }}
          />
          <div
            className="absolute inset-y-0 right-0 w-1/3 z-10 sm:hidden cursor-pointer"
            onClick={() => {
              if (nextId <= totalStories) navigate(`/story/${nextId}/${totalStories}`);
              else navigate('/');
            }}
          />
        </div>

        {/* Next Story Arrow */}
        {nextId <= totalStories ? (
          <Link
            to={`/story/${nextId}/${totalStories}`}
            className="text-4xl text-white/70 hover:text-white hover:scale-110 transition shrink-0 hidden sm:flex"
            title="Next Story"
          >
            <IoArrowForwardCircle />
          </Link>
        ) : (
          <button
            type="button"
            onClick={() => navigate('/')}
            className="text-4xl text-white/70 hover:text-white hover:scale-110 transition shrink-0 hidden sm:flex"
            title="Finish Stories"
          >
            <IoClose />
          </button>
        )}
      </div>
    </div>
  );
}

export default Viewstory;
