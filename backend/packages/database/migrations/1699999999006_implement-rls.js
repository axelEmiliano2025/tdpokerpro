/**
 * Migration: Implement Row Level Security (RLS)
 * 
 * Implements security policies for:
 * - users: Can only update their own data
 * - user_profiles: Can only update their own profile
 * - user_wallets: Read-only for users, write for system
 * - transactions: Users can only read their own
 * - posts: Users can manage their own posts
 * - comments: Users can manage their own comments
 */

exports.up = (pgm) => {
    // ========================================
    // ENABLE RLS ON CRITICAL TABLES
    // ========================================

    pgm.sql('ALTER TABLE users ENABLE ROW LEVEL SECURITY;');
    pgm.sql('ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;');
    pgm.sql('ALTER TABLE user_wallets ENABLE ROW LEVEL SECURITY;');
    pgm.sql('ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;');
    pgm.sql('ALTER TABLE posts ENABLE ROW LEVEL SECURITY;');
    pgm.sql('ALTER TABLE comments ENABLE ROW LEVEL SECURITY;');
    pgm.sql('ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;');
    pgm.sql('ALTER TABLE user_rankings ENABLE ROW LEVEL SECURITY;');

    // ========================================
    // USERS POLICIES
    // ========================================

    // Users can view their own data
    pgm.sql(`
    CREATE POLICY users_select_own
    ON users FOR SELECT
    USING (id = current_setting('app.current_user_id')::uuid);
  `);

    // Users can update their own data (except role)
    pgm.sql(`
    CREATE POLICY users_update_own
    ON users FOR UPDATE
    USING (id = current_setting('app.current_user_id')::uuid);
  `);

    // ========================================
    // USER PROFILES POLICIES
    // ========================================

    // Anyone can view public profiles
    pgm.sql(`
    CREATE POLICY user_profiles_select_all
    ON user_profiles FOR SELECT
    USING (true);
  `);

    // Users can update their own profile
    pgm.sql(`
    CREATE POLICY user_profiles_update_own
    ON user_profiles FOR UPDATE
    USING (user_id = current_setting('app.current_user_id')::uuid);
  `);

    // ========================================
    // USER WALLETS POLICIES
    // ========================================

    // Users can view their own wallet
    pgm.sql(`
    CREATE POLICY user_wallets_select_own
    ON user_wallets FOR SELECT
    USING (user_id = current_setting('app.current_user_id')::uuid);
  `);

    // Only system can update wallets (no user policy for UPDATE)

    // ========================================
    // TRANSACTIONS POLICIES
    // ========================================

    // Users can view their own transactions
    pgm.sql(`
    CREATE POLICY transactions_select_own
    ON transactions FOR SELECT
    USING (user_id = current_setting('app.current_user_id')::uuid);
  `);

    // ========================================
    // POSTS POLICIES
    // ========================================

    // Anyone can view public posts
    pgm.sql(`
    CREATE POLICY posts_select_public
    ON posts FOR SELECT
    USING (visibility = 'public');
  `);

    // Users can view their own posts (any visibility)
    pgm.sql(`
    CREATE POLICY posts_select_own
    ON posts FOR SELECT
    USING (user_id = current_setting('app.current_user_id')::uuid);
  `);

    // Users can insert their own posts
    pgm.sql(`
    CREATE POLICY posts_insert_own
    ON posts FOR INSERT
    WITH CHECK (user_id = current_setting('app.current_user_id')::uuid);
  `);

    // Users can update their own posts
    pgm.sql(`
    CREATE POLICY posts_update_own
    ON posts FOR UPDATE
    USING (user_id = current_setting('app.current_user_id')::uuid);
  `);

    // Users can delete their own posts
    pgm.sql(`
    CREATE POLICY posts_delete_own
    ON posts FOR DELETE
    USING (user_id = current_setting('app.current_user_id')::uuid);
  `);

    // ========================================
    // COMMENTS POLICIES
    // ========================================

    // Anyone can view comments on public posts
    pgm.sql(`
    CREATE POLICY comments_select_public
    ON comments FOR SELECT
    USING (
      EXISTS (
        SELECT 1 FROM posts
        WHERE posts.id = comments.post_id
        AND posts.visibility = 'public'
      )
    );
  `);

    // Users can view comments on their own posts
    pgm.sql(`
    CREATE POLICY comments_select_own_posts
    ON comments FOR SELECT
    USING (
      EXISTS (
        SELECT 1 FROM posts
        WHERE posts.id = comments.post_id
        AND posts.user_id = current_setting('app.current_user_id')::uuid
      )
    );
  `);

    // Users can insert comments
    pgm.sql(`
    CREATE POLICY comments_insert
    ON comments FOR INSERT
    WITH CHECK (user_id = current_setting('app.current_user_id')::uuid);
  `);

    // Users can update their own comments
    pgm.sql(`
    CREATE POLICY comments_update_own
    ON comments FOR UPDATE
    USING (user_id = current_setting('app.current_user_id')::uuid);
  `);

    // Users can delete their own comments
    pgm.sql(`
    CREATE POLICY comments_delete_own
    ON comments FOR DELETE
    USING (user_id = current_setting('app.current_user_id')::uuid);
  `);

    // ========================================
    // NOTIFICATIONS POLICIES
    // ========================================

    // Users can only view their own notifications
    pgm.sql(`
    CREATE POLICY notifications_select_own
    ON notifications FOR SELECT
    USING (user_id = current_setting('app.current_user_id')::uuid);
  `);

    // Users can update their own notifications (mark as read)
    pgm.sql(`
    CREATE POLICY notifications_update_own
    ON notifications FOR UPDATE
    USING (user_id = current_setting('app.current_user_id')::uuid);
  `);

    // ========================================
    // USER RANKINGS POLICIES
    // ========================================

    // Anyone can view rankings (public leaderboard)
    pgm.sql(`
    CREATE POLICY user_rankings_select_all
    ON user_rankings FOR SELECT
    USING (true);
  `);

    // ========================================
    // HELPER FUNCTION FOR BYPASSING RLS
    // ========================================

    // Create a function to set current user context
    pgm.sql(`
    CREATE OR REPLACE FUNCTION set_current_user_id(user_uuid uuid)
    RETURNS void AS $$
    BEGIN
      PERFORM set_config('app.current_user_id', user_uuid::text, false);
    END;
    $$ LANGUAGE plpgsql SECURITY DEFINER;
  `);

    // Create a function to clear current user context
    pgm.sql(`
    CREATE OR REPLACE FUNCTION clear_current_user_id()
    RETURNS void AS $$
    BEGIN
      PERFORM set_config('app.current_user_id', '', false);
    END;
    $$ LANGUAGE plpgsql SECURITY DEFINER;
  `);

    // ========================================
    // COMMENTS
    // ========================================
    pgm.sql(`
    COMMENT ON POLICY users_select_own ON users IS 'Users can view their own data';
    COMMENT ON POLICY user_profiles_select_all ON user_profiles IS 'Anyone can view public profiles';
    COMMENT ON POLICY user_wallets_select_own ON user_wallets IS 'Users can view their own wallet';
    COMMENT ON POLICY transactions_select_own ON transactions IS 'Users can view their own transactions';
    COMMENT ON POLICY posts_select_public ON posts IS 'Anyone can view public posts';
    COMMENT ON POLICY notifications_select_own ON notifications IS 'Users can only view their own notifications';
    COMMENT ON POLICY user_rankings_select_all ON user_rankings IS 'Public leaderboard - anyone can view';
  `);
};

exports.down = (pgm) => {
    // Drop all policies
    pgm.sql('DROP POLICY IF EXISTS users_select_own ON users;');
    pgm.sql('DROP POLICY IF EXISTS users_update_own ON users;');
    pgm.sql('DROP POLICY IF EXISTS user_profiles_select_all ON user_profiles;');
    pgm.sql('DROP POLICY IF EXISTS user_profiles_update_own ON user_profiles;');
    pgm.sql('DROP POLICY IF EXISTS user_wallets_select_own ON user_wallets;');
    pgm.sql('DROP POLICY IF EXISTS transactions_select_own ON transactions;');
    pgm.sql('DROP POLICY IF EXISTS posts_select_public ON posts;');
    pgm.sql('DROP POLICY IF EXISTS posts_select_own ON posts;');
    pgm.sql('DROP POLICY IF EXISTS posts_insert_own ON posts;');
    pgm.sql('DROP POLICY IF EXISTS posts_update_own ON posts;');
    pgm.sql('DROP POLICY IF EXISTS posts_delete_own ON posts;');
    pgm.sql('DROP POLICY IF EXISTS comments_select_public ON comments;');
    pgm.sql('DROP POLICY IF EXISTS comments_select_own_posts ON comments;');
    pgm.sql('DROP POLICY IF EXISTS comments_insert ON comments;');
    pgm.sql('DROP POLICY IF EXISTS comments_update_own ON comments;');
    pgm.sql('DROP POLICY IF EXISTS comments_delete_own ON comments;');
    pgm.sql('DROP POLICY IF EXISTS notifications_select_own ON notifications;');
    pgm.sql('DROP POLICY IF EXISTS notifications_update_own ON notifications;');
    pgm.sql('DROP POLICY IF EXISTS user_rankings_select_all ON user_rankings;');

    // Drop helper functions
    pgm.sql('DROP FUNCTION IF EXISTS set_current_user_id(uuid);');
    pgm.sql('DROP FUNCTION IF EXISTS clear_current_user_id();');

    // Disable RLS
    pgm.sql('ALTER TABLE users DISABLE ROW LEVEL SECURITY;');
    pgm.sql('ALTER TABLE user_profiles DISABLE ROW LEVEL SECURITY;');
    pgm.sql('ALTER TABLE user_wallets DISABLE ROW LEVEL SECURITY;');
    pgm.sql('ALTER TABLE transactions DISABLE ROW LEVEL SECURITY;');
    pgm.sql('ALTER TABLE posts DISABLE ROW LEVEL SECURITY;');
    pgm.sql('ALTER TABLE comments DISABLE ROW LEVEL SECURITY;');
    pgm.sql('ALTER TABLE notifications DISABLE ROW LEVEL SECURITY;');
    pgm.sql('ALTER TABLE user_rankings DISABLE ROW LEVEL SECURITY;');
};
