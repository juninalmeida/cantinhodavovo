INSERT INTO product_categories (id, name)
VALUES
  ('salgados', 'Salgados da Vovo'),
  ('especiais', 'Salgados Especiais')
ON CONFLICT (id) DO NOTHING;

INSERT INTO products (id, category_id, name, description, price, image_url)
VALUES
  ('coxinha-vovo', 'salgados', 'Coxinha da Vovo Carmem', 'Massa fininha feita na mao, recheio de frango desfiado com catupiry caseiro.', 7.90, 'https://images.unsplash.com/photo-1626200419199-a6d8f0f3d4da?auto=format&fit=crop&w=800&q=80'),
  ('quibe-saudade', 'salgados', 'Quibe da Saudade', 'Carne moida temperada do jeito antigo, com hortela e canela.', 7.50, 'https://images.unsplash.com/photo-1604908177522-0406d16479f3?auto=format&fit=crop&w=800&q=80'),
  ('bolinha-terreiro', 'salgados', 'Bolinha de Queijo do Terreiro', 'Queijo meia-cura derretendo por dentro e casca dourada.', 6.90, 'https://images.unsplash.com/photo-1562967916-eb82221dfb92?auto=format&fit=crop&w=800&q=80'),
  ('tapioca-frango', 'especiais', 'Tapioca de Frango c/ Catupiry', 'Tapioca cremosa com frango desfiado, catupiry e ervas frescas.', 12.00, 'https://images.unsplash.com/photo-1608032364895-0da67af36cd2?auto=format&fit=crop&w=800&q=80'),
  ('pastel-carne', 'especiais', 'Pastel de Carne Moida', 'Massa fininha e frita na hora, recheada com carne bem temperada.', 8.00, 'https://images.unsplash.com/photo-1626200419199-a6d8f0f3d4da?auto=format&fit=crop&w=800&q=80'),
  ('risole-frango', 'especiais', 'Risole de Frango com Queijo', 'Meia-lua dourada com recheio cremoso de frango desfiado.', 9.00, 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80')
ON CONFLICT (id) DO UPDATE
SET
  category_id = EXCLUDED.category_id,
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  image_url = EXCLUDED.image_url,
  active = TRUE,
  updated_at = NOW();
