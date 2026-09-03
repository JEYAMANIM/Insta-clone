PRAGMA foreign_keys = ON;

DROP TABLE IF EXISTS post_comments;
DROP TABLE IF EXISTS followers;
DROP TABLE IF EXISTS stories;
DROP TABLE IF EXISTS suggestions;
DROP TABLE IF EXISTS posts;
DROP TABLE IF EXISTS users;


-- ==========================================
-- USERS
-- ==========================================

CREATE TABLE users (
    id TEXT PRIMARY KEY,
    username TEXT NOT NULL,
    full_name TEXT NOT NULL,
    profile_picture TEXT,
    is_verified INTEGER NOT NULL DEFAULT 0
);


-- ==========================================
-- POSTS
-- ==========================================

CREATE TABLE posts (
    id TEXT PRIMARY KEY,

    type TEXT NOT NULL,

    user_id TEXT NOT NULL,

    location TEXT,

    media_urls TEXT NOT NULL,

    thumbnail_url TEXT,

    aspect_ratio TEXT,

    duration INTEGER,

    view_count INTEGER,

    caption TEXT,

    hashtags TEXT,

    mentions TEXT,

    likes_count INTEGER NOT NULL DEFAULT 0,

    comments_count INTEGER NOT NULL DEFAULT 0,

    shares_count INTEGER NOT NULL DEFAULT 0,

    has_liked INTEGER NOT NULL DEFAULT 0,

    has_saved INTEGER NOT NULL DEFAULT 0,

    timestamp TEXT NOT NULL,

    FOREIGN KEY (user_id)
        REFERENCES users(id)
);


-- ==========================================
-- POST COMMENTS
-- ==========================================

CREATE TABLE post_comments (
    id TEXT PRIMARY KEY,

    post_id TEXT NOT NULL,

    username TEXT NOT NULL,

    text TEXT NOT NULL,

    likes_count INTEGER NOT NULL DEFAULT 0,

    timestamp TEXT NOT NULL,

    FOREIGN KEY (post_id)
        REFERENCES posts(id)
        ON DELETE CASCADE
);


-- ==========================================
-- SUGGESTIONS
-- ==========================================

CREATE TABLE suggestions (
    id TEXT PRIMARY KEY,

    username TEXT NOT NULL,

    full_name TEXT NOT NULL,

    profile_picture TEXT,

    is_verified INTEGER NOT NULL DEFAULT 0,

    is_following INTEGER NOT NULL DEFAULT 0
);


-- ==========================================
-- STORIES
-- ==========================================

CREATE TABLE stories (
    id TEXT PRIMARY KEY,

    type TEXT NOT NULL,

    user_id TEXT NOT NULL,

    media_urls TEXT NOT NULL,

    aspect_ratio TEXT,

    FOREIGN KEY (user_id)
        REFERENCES users(id)
);


-- ==========================================
-- FOLLOWERS
-- ==========================================

CREATE TABLE followers (
    id TEXT PRIMARY KEY,

    username TEXT NOT NULL,

    profile_picture TEXT
);