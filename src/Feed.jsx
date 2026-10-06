import React from 'react';
import Story from './Story';
import Post from './Post';

function Feed() {
  return (
    <div className="flex flex-col gap-6 w-full">
      <section aria-label="Stories">
        <Story />
      </section>
      <section aria-label="Posts Feed">
        <Post />
      </section>
    </div>
  );
}

export default Feed;