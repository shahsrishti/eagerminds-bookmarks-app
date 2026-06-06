-- Extends Supabase auth.users
CREATE TABLE users (
  id UUID REFERENCES auth.users PRIMARY KEY,
  handle TEXT UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Bookmarks table
CREATE TABLE bookmarks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) NOT NULL,
  title TEXT NOT NULL,
  url TEXT NOT NULL,
  is_public BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Row-Level Security Policies (CRITICAL)
ALTER TABLE bookmarks ENABLE ROW LEVEL SECURITY;

-- Users can only see their own bookmarks or public bookmarks
-- Wait, the requirement says "Anyone can visit /<handle> to see PUBLIC bookmarks only"
-- So we need a policy to allow reading public bookmarks without auth, and a policy to allow users to read their own.
CREATE POLICY "Public bookmarks are viewable by everyone" ON bookmarks
  FOR SELECT USING (is_public = true);

CREATE POLICY "Users can view own bookmarks" ON bookmarks
  FOR SELECT USING (user_id = auth.uid());

-- Users can only insert their own bookmarks
CREATE POLICY "Users can insert own bookmarks" ON bookmarks
  FOR INSERT WITH CHECK (user_id = auth.uid());

-- Users can only update their own bookmarks
CREATE POLICY "Users can update own bookmarks" ON bookmarks
  FOR UPDATE USING (user_id = auth.uid());

-- Users can only delete their own bookmarks
CREATE POLICY "Users can delete own bookmarks" ON bookmarks
  FOR DELETE USING (user_id = auth.uid());

-- Allow reading user handles (publicly) so we can look up user by handle
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
CREATE POLICY "User handles are public" ON users
  FOR SELECT USING (true);

-- Users can insert/update their own handle
CREATE POLICY "Users can manage their own row" ON users
  FOR ALL USING (id = auth.uid());
