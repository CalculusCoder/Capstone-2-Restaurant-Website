export const getProductData = `
SELECT * FROM products 
WHERE product_id = $1;
`;

export const getProductToppings = `
SELECT topping_id, topping_name, additional_price
FROM toppings
WHERE product_id = $1;
`;

export const createNewOrder = `
INSERT INTO orders (total_amount, order_status, user_id)
VALUES ($1, $2, $3)
RETURNING order_id;
`;

export const createOrderItem = `
INSERT INTO order_items (quantity, total_price, product_name, order_id)
VALUES ($1, $2, $3, $4)
RETURNING order_item_id;
`;

export const createOrderItemToppings = `
INSERT INTO order_item_toppings (topping_name, order_item_id)
VALUES ($1, $2);
`;

export const clearCart = `
DELETE FROM cart_items
WHERE cart_id IN (
  SELECT cart_id FROM cart WHERE user_id = $1
);
`;

export const getOrders = `
  SELECT 
    oi.order_item_id,
    oi.quantity,
    oi.total_price,
    oi.product_name,
    o.order_status,
    o.created_at,
    COALESCE(
      JSON_AGG(
        JSON_BUILD_OBJECT(
          'order_item_topping_id', oit.order_item_topping_id,
          'topping_name', oit.topping_name
        )
      ) FILTER (WHERE oit.order_item_topping_id IS NOT NULL), '[]'
    ) AS toppings
  FROM order_items oi
  LEFT JOIN order_item_toppings oit ON oi.order_item_id = oit.order_item_id
  JOIN orders o ON oi.order_id = o.order_id
  WHERE o.user_id = $1
  GROUP BY oi.order_item_id, oi.quantity, oi.total_price, oi.product_name, o.order_status, o.created_at;
`;

export const getAllRestaurantOrders = `
  SELECT 
    oi.order_item_id,
    oi.quantity,
    oi.total_price,
    oi.product_name,
    o.order_id,
    o.order_status,
    o.created_at,
    COALESCE(
      JSON_AGG(
        JSON_BUILD_OBJECT(
          'order_item_topping_id', oit.order_item_topping_id,
          'topping_name', oit.topping_name
        )
      ) FILTER (WHERE oit.order_item_topping_id IS NOT NULL), '[]'
    ) AS toppings
  FROM order_items oi
  LEFT JOIN order_item_toppings oit ON oi.order_item_id = oit.order_item_id
  JOIN orders o ON oi.order_id = o.order_id
  GROUP BY oi.order_item_id, oi.quantity, oi.total_price, oi.product_name, o.order_status, o.created_at, o.order_id;
`;

export const updateOrderStatus = `
UPDATE orders
SET order_status = $1
WHERE order_id = $2;
`;
