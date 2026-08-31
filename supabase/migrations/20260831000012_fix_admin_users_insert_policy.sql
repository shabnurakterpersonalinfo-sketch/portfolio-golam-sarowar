-- The original schema (create_admin_table.sql) only created SELECT policies for
-- admin_users, and fix_rls_policies.sql added INSERT/UPDATE/DELETE policies for
-- every content table EXCEPT admin_users. With RLS enabled and no matching policy,
-- Postgres denies the operation by default -- which is why sign-up fails with
-- "new row violates row-level security policy for table admin_users".
--
-- Fix: allow an authenticated user to insert/update only the admin_users row that
-- matches their own auth.uid() (not a blanket "true" policy, since this table is
-- reachable from the public /auth/signup page).

CREATE POLICY "Users can insert their own admin_users row"
  ON admin_users FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own admin_users row"
  ON admin_users FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);
