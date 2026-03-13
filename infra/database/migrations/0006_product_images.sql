-- Migration: atualizar image_url dos produtos com imagens autênticas geradas
UPDATE products SET image_url = '/images/pastel-carne.png'   WHERE id = 'pastel-carne';
UPDATE products SET image_url = '/images/risole-frango.png'  WHERE id = 'risole-frango';
UPDATE products SET image_url = '/images/tapioca-frango.png' WHERE id = 'tapioca-frango';
UPDATE products SET image_url = '/images/bolinha-queijo.png' WHERE id = 'bolinha-terreiro';
UPDATE products SET image_url = '/images/coxinha-vovo.png'   WHERE id = 'coxinha-vovo';
UPDATE products SET image_url = '/images/quibe-saudade.png'  WHERE id = 'quibe-saudade';
