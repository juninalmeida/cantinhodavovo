INSERT INTO product_categories (id, name)
VALUES
  ('massas', 'Massas'),
  ('sabores', 'Sabores'),
  ('addons', 'Da Cozinha')
ON CONFLICT (id) DO NOTHING;

UPDATE products
SET
  product_kind = 'MENU',
  combo_group = NULL,
  updated_at = NOW()
WHERE id IN (
  'coxinha-vovo',
  'quibe-saudade',
  'bolinha-terreiro',
  'tapioca-frango',
  'pastel-carne',
  'risole-frango'
);

INSERT INTO products (id, category_id, name, description, price, image_url, product_kind, combo_group)
VALUES
  ('massa-pastel', 'massas', 'Pastel', 'Massa fininha e crocante da casa.', 0.00, NULL, 'COMBO_COMPONENT', 'MASSA'),
  ('massa-coxinha', 'massas', 'Coxinha', 'Massa macia por dentro e sequinha por fora.', 0.00, NULL, 'COMBO_COMPONENT', 'MASSA'),
  ('massa-tapioca', 'massas', 'Tapioca', 'Versao leve e nordestina do combo.', 2.00, NULL, 'COMBO_COMPONENT', 'MASSA'),
  ('massa-enroladinho', 'massas', 'Enroladinho', 'Opçao douradinha e feita na hora.', 0.00, NULL, 'COMBO_COMPONENT', 'MASSA'),
  ('massa-rissole', 'massas', 'Rissole', 'Casquinha delicada com recheio generoso.', 0.00, NULL, 'COMBO_COMPONENT', 'MASSA'),
  ('sabor-frango-catupiry', 'sabores', 'Frango c/ Catupiry', 'Frango desfiado cremoso.', 10.00, NULL, 'COMBO_COMPONENT', 'SABOR'),
  ('sabor-carne-queijo', 'sabores', 'Carne Moida c/ Queijo', 'Blend bovino bem temperado.', 9.00, NULL, 'COMBO_COMPONENT', 'SABOR'),
  ('sabor-queijo-mucarela', 'sabores', 'Queijo Mucarela', 'Mucarela derretida do jeitinho da vovo.', 7.00, NULL, 'COMBO_COMPONENT', 'SABOR'),
  ('sabor-camarao-cream', 'sabores', 'Camarao c/ Cream Cheese', 'Camarao ao molho com cremosidade extra.', 15.00, NULL, 'COMBO_COMPONENT', 'SABOR'),
  ('sabor-frango-simples', 'sabores', 'Frango Simples', 'Temperado com ervas da casa.', 8.00, NULL, 'COMBO_COMPONENT', 'SABOR'),
  ('sabor-calabresa-cebola', 'sabores', 'Calabresa c/ Cebola', 'Calabresa artesanal puxada na chapa.', 9.00, NULL, 'COMBO_COMPONENT', 'SABOR'),
  ('addon-catupiry-extra', 'addons', 'Catupiry Extra', 'Porção extra cremosa.', 3.00, NULL, 'COMBO_COMPONENT', 'ADDON'),
  ('addon-queijo-extra', 'addons', 'Queijo Extra', 'Mais queijo para o seu combo.', 2.00, NULL, 'COMBO_COMPONENT', 'ADDON'),
  ('addon-bacon', 'addons', 'Bacon', 'Bacon crocante e artesanal.', 4.00, NULL, 'COMBO_COMPONENT', 'ADDON'),
  ('addon-vinagrete', 'addons', 'Vinagrete', 'Fresquinho e da casa.', 0.00, NULL, 'COMBO_COMPONENT', 'ADDON'),
  ('addon-pimenta', 'addons', 'Pimenta Biquinho', 'Toque picante suave.', 2.00, NULL, 'COMBO_COMPONENT', 'ADDON'),
  ('addon-molho-vovo', 'addons', 'Molho da Vovo', 'Receita secreta da cozinha.', 0.00, NULL, 'COMBO_COMPONENT', 'ADDON')
ON CONFLICT (id) DO UPDATE
SET
  category_id = EXCLUDED.category_id,
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  image_url = EXCLUDED.image_url,
  product_kind = EXCLUDED.product_kind,
  combo_group = EXCLUDED.combo_group,
  active = TRUE,
  updated_at = NOW();
