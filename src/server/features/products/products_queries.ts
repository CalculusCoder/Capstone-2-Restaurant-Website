export const createProduct = `
INSERT INTO products (product_name, price, product_category, image_url)
VALUES ($1, $2, $3, $4)
RETURNING product_id;
`;

export const insertProductToppings = `
INSERT INTO toppings (topping_name, additional_price, product_id)
VALUES ($1, $2, $3);
`;
