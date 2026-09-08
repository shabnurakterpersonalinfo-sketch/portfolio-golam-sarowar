-- Contact form submissions, saved as a durable fallback whenever email
-- notification isn't configured (or happens to fail) so no enquiry is lost.
-- Viewable/manageable from /admin/messages.

CREATE TABLE IF NOT EXISTS contact_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

-- Public (anonymous) visitors submit the contact form, so INSERT must be open.
CREATE POLICY "Allow public insert to contact_messages"
  ON contact_messages FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow authenticated read of contact_messages"
  ON contact_messages FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated update of contact_messages"
  ON contact_messages FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow authenticated delete of contact_messages"
  ON contact_messages FOR DELETE
  TO authenticated
  USING (true);
