ALTER TABLE addresses
ADD COLUMN IF NOT EXISTS is_default BOOLEAN NOT NULL DEFAULT FALSE;

UPDATE addresses
SET is_default = TRUE
WHERE id IN (
  SELECT id
  FROM (
    SELECT
      id,
      ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY created_at ASC) AS row_num
    FROM addresses
  ) ranked
  WHERE ranked.row_num = 1
);
