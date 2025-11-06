-- Add is_featured column to merchant_products
ALTER TABLE merchant_products 
ADD COLUMN is_featured BOOLEAN DEFAULT FALSE;

-- Create unique constraint: only one featured product per merchant
CREATE UNIQUE INDEX idx_one_featured_per_merchant 
ON merchant_products (merchant_id) 
WHERE is_featured = true;

-- Add comment for documentation
COMMENT ON COLUMN merchant_products.is_featured IS 'Marks this product as the featured product for display on merchant cards. Only one product per merchant can be featured.';