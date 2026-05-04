CREATE TABLE IF NOT EXISTS openby_product_reports (
  slug TEXT PRIMARY KEY,
  product_name TEXT NOT NULL,
  category TEXT,
  current_price NUMERIC,
  openby_index INTEGER,
  image_url TEXT,
  analysis JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS openby_product_reports_product_name_idx
  ON openby_product_reports USING gin (to_tsvector('english', product_name));

CREATE INDEX IF NOT EXISTS openby_product_reports_category_idx
  ON openby_product_reports (category);

ALTER TABLE openby_product_reports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read product reports" ON openby_product_reports
  FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Allow service role writes product reports" ON openby_product_reports
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);
