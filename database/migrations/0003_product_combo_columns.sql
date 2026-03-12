ALTER TABLE products
ADD COLUMN IF NOT EXISTS product_kind TEXT;

ALTER TABLE products
ADD COLUMN IF NOT EXISTS combo_group TEXT;

UPDATE products
SET product_kind = 'MENU'
WHERE product_kind IS NULL;

ALTER TABLE products
ALTER COLUMN product_kind SET DEFAULT 'MENU';

ALTER TABLE products
ALTER COLUMN product_kind SET NOT NULL;

ALTER TABLE products
DROP CONSTRAINT IF EXISTS products_product_kind_check;

ALTER TABLE products
ADD CONSTRAINT products_product_kind_check
CHECK (product_kind IN ('MENU', 'COMBO_COMPONENT'));

ALTER TABLE products
DROP CONSTRAINT IF EXISTS products_combo_group_check;

ALTER TABLE products
ADD CONSTRAINT products_combo_group_check
CHECK (combo_group IS NULL OR combo_group IN ('MASSA', 'SABOR', 'ADDON'));
