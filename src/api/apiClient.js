/**
 * API Client - Works on deployed servers without any external API dependency.
 *
 * Data loading priority:
 *  1. /db.json  (served statically from public/ on Vercel/Netlify/GitHub Pages)
 *  2. Bundled mockData.js (always available, compiled into the JS bundle)
 *  3. localStorage  (persists user interactions like likes, follows, profile edits)
 */
import { initialData } from './mockData';

const STORAGE_KEYS = {
  POSTS: 'insta_posts_data',
  STORIES: 'insta_stories_data',
  PROFILE: 'insta_profile_data',
  SUGGESTIONS: 'insta_suggestions_data',
  FOLLOWERS: 'insta_followers_data',
  LOADED: 'insta_data_loaded',
};

// Promise-based dedup cache – concurrent callers share the same in-flight request
// instead of spawning multiple fetches on initial render.
let _dbPromise = null;

/**
 * Fetches /db.json from the static public folder.
 * Returns null on any failure so callers can fall back gracefully.
 */
async function fetchStaticDb() {
  if (_dbPromise) return _dbPromise;
  _dbPromise = (async () => {
    try {
      const res = await fetch('/db.json', { cache: 'force-cache' });
      if (!res.ok) return null;
      return await res.json();
    } catch {
      return null;
    }
  })();
  return _dbPromise;
}


/** Read from localStorage; falls back to provided default. */
function getLocal(key, fallback) {
  try {
    const item = localStorage.getItem(key);
    if (item) return JSON.parse(item);
  } catch { /* ignore */ }
  return fallback;
}

/** Write to localStorage safely. */
function setLocal(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch { /* ignore */ }
}

export const apiClient = {
  /** Get initial posts synchronously from localStorage or bundled mockData for instant render without loading spinner */
  getInitialPostsSync() {
    return getLocal(STORAGE_KEYS.POSTS, initialData.posts);
  },

  /** Get initial stories synchronously for instant render */
  getInitialStoriesSync() {
    return initialData.story;
  },

  /** Get initial profile synchronously */
  getInitialProfileSync() {
    return getLocal(STORAGE_KEYS.PROFILE, initialData.profile[0]);
  },

  /** Get initial suggestions synchronously */
  getInitialSuggestionsSync() {
    return getLocal(STORAGE_KEYS.SUGGESTIONS, initialData.suggestions);
  },

  /** Fetch all feed posts */
  async getPosts() {
    const db = await fetchStaticDb();
    const source = db?.posts ?? initialData.posts;
    return getLocal(STORAGE_KEYS.POSTS, source);
  },

  /** Toggle Like on a post (optimistic, persisted to localStorage) */
  async toggleLikePost(postId) {
    const db = await fetchStaticDb();
    const source = db?.posts ?? initialData.posts;
    const posts = getLocal(STORAGE_KEYS.POSTS, source);

    const updated = posts.map((post) => {
      if (post.id !== postId) return post;
      const liked = post.engagement?.hasLiked ?? false;
      const likes = post.engagement?.likesCount ?? 0;
      return {
        ...post,
        engagement: {
          ...post.engagement,
          hasLiked: !liked,
          likesCount: liked ? Math.max(0, likes - 1) : likes + 1,
        },
      };
    });

    setLocal(STORAGE_KEYS.POSTS, updated);
    return updated;
  },

  /** Fetch all stories */
  async getStories() {
    const db = await fetchStaticDb();
    const source = db?.story ?? initialData.story;
    return source;
  },

  /** Fetch a single story by 1-based index or by story id */
  async getStoryById(id) {
    const db = await fetchStaticDb();
    const stories = db?.story ?? initialData.story;
    const numId = parseInt(id, 10);

    // Try matching by story.id field (string like "101", "102"...)
    let found = stories.find((s) => String(s.id) === String(id));

    // Fall back to 1-based positional index (story 1 = index 0)
    if (!found && numId >= 1 && numId <= stories.length) {
      found = stories[numId - 1];
    }

    return found ?? null;
  },

  /** Fetch the current user profile */
  async getProfile() {
    const db = await fetchStaticDb();
    const source = db?.profile ?? initialData.profile;
    const profileArr = Array.isArray(source) ? source : [source];
    const base = profileArr[0] ?? initialData.profile[0];
    return getLocal(STORAGE_KEYS.PROFILE, base);
  },

  /** Update profile fields (persisted to localStorage) */
  async updateProfile(updates) {
    const current = await this.getProfile();
    const merged = { ...current, ...updates };
    setLocal(STORAGE_KEYS.PROFILE, merged);
    return merged;
  },

  /** Fetch suggestions list */
  async getSuggestions() {
    const db = await fetchStaticDb();
    const source = db?.suggestions ?? initialData.suggestions;
    return getLocal(STORAGE_KEYS.SUGGESTIONS, source);
  },

  /** Toggle follow/unfollow (persisted to localStorage) */
  async toggleFollow(targetId, nextState) {
    const db = await fetchStaticDb();
    const source = db?.suggestions ?? initialData.suggestions;
    const suggestions = getLocal(STORAGE_KEYS.SUGGESTIONS, source);
    let targetUser = null;

    const updatedSuggestions = suggestions.map((user) => {
      if (user.id === targetId) { targetUser = user; return { ...user, isFollowing: nextState }; }
      return user;
    });
    setLocal(STORAGE_KEYS.SUGGESTIONS, updatedSuggestions);

    const followersSource = db?.followers ?? initialData.followers;
    let followers = getLocal(STORAGE_KEYS.FOLLOWERS, followersSource);

    if (nextState && targetUser) {
      if (!followers.some((f) => f.id === targetId)) {
        followers = [...followers, {
          id: targetUser.id,
          username: targetUser.username,
          profilePicture: targetUser.profilePicture,
        }];
      }
    } else {
      followers = followers.filter((f) => f.id !== targetId);
    }
    setLocal(STORAGE_KEYS.FOLLOWERS, followers);

    return { suggestions: updatedSuggestions, followers };
  },

  /** Fetch followers list */
  async getFollowers() {
    const db = await fetchStaticDb();
    const source = db?.followers ?? initialData.followers;
    return getLocal(STORAGE_KEYS.FOLLOWERS, source);
  },

  /** Unfollow a user (persisted to localStorage) */
  async unfollowUser(id) {
    const followers = await this.getFollowers();
    const updatedFollowers = followers.filter((f) => f.id !== id);
    setLocal(STORAGE_KEYS.FOLLOWERS, updatedFollowers);

    const suggestions = await this.getSuggestions();
    const updatedSuggestions = suggestions.map((s) =>
      s.id === id ? { ...s, isFollowing: false } : s
    );
    setLocal(STORAGE_KEYS.SUGGESTIONS, updatedSuggestions);

    return { followers: updatedFollowers, suggestions: updatedSuggestions };
  },
};
