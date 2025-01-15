export const createCart = `
INSERT INTO cart (user_id)
VALUES ($1)
ON CONFLICT (user_id) DO UPDATE
SET user_id = EXCLUDED.user_id
RETURNING cart_id;
`;

export const addItemToCart = `
INSERT INTO cart_items (quantity, total_price, cart_id, product_id)
VALUES ($1, $2, $3, $4)
RETURNING cart_item_id;
`;

export const insertCartItemToppings = `
INSERT INTO cart_item_toppings (cart_item_id, topping_id)
VALUES ($1, $2);
`;

export const getCartData = ` 
SELECT 
  cart.cart_id,
  cart_items.cart_item_id,
  cart_items.quantity,
  cart_items.total_price,
  products.product_name,
  COALESCE(json_agg(json_build_object(
    'topping_id', toppings.topping_id,
    'topping_name', toppings.topping_name,
    'additional_price', toppings.additional_price
  )) FILTER (WHERE toppings.topping_id IS NOT NULL), '[]') AS toppings
FROM cart
JOIN cart_items 
  ON cart.cart_id = cart_items.cart_id
JOIN products
  ON cart_items.product_id = products.product_id
LEFT JOIN cart_item_toppings 
  ON cart_items.cart_item_id = cart_item_toppings.cart_item_id
LEFT JOIN toppings 
  ON cart_item_toppings.topping_id = toppings.topping_id
WHERE cart.user_id = $1
GROUP BY cart.cart_id, cart_items.cart_item_id, products.product_name;

`;

export const deleteCartItem = `
DELETE FROM cart_items
WHERE cart_item_id = $1;
`;

// export const getCartData = `
// SELECT cart.cart_id, cart_items.cart_item_id, cart_items.quantity, cart_items.total_price
// FROM cart JOIN cart_items
// ON cart.cart_id = cart_items.cart_id
// WHERE cart.user_id = $1;
// `;
