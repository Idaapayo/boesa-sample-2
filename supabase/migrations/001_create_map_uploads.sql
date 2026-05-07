-- Run this in the Supabase SQL editor to create the map_uploads table.

CREATE TABLE IF NOT EXISTS map_uploads (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  title       TEXT        NOT NULL,
  description TEXT        NOT NULL,
  map_image_url TEXT,
  map_pdf_url   TEXT,
  photos      JSONB       NOT NULL DEFAULT '[]',
  case_study  TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- photos column stores an array of objects: [{ url: string, description: string }]
