export const getPizzas = `
SELECT product_id, product_name, price, product_category, image_url
FROM products
WHERE product_category = 'pizza';
`;

export const getBurgers = `
SELECT product_id, product_name, price, product_category, image_url
FROM products
WHERE product_category = 'burger';
`;
