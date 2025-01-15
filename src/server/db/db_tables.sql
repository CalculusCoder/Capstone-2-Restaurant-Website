CREATE TABLE IF NOT EXISTS users (
    user_id SERIAL PRIMARY KEY,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS products(
    product_id SERIAL PRIMARY KEY,
    product_name VARCHAR(255) NOT NULL,
    price NUMERIC(10, 2) NOT NULL,
    product_category VARCHAR (50) NOT NULL,
    image_url VARCHAR(50) NOT NULL
);


CREATE TABLE IF NOT EXISTS toppings (
    topping_id SERIAL PRIMARY KEY,
    topping_name VARCHAR(255) NOT NULL,
    additional_price NUMERIC(10, 2) DEFAULT 0,
    product_id INTEGER NOT NULL,
    FOREIGN KEY (product_id) REFERENCES products (product_id) ON DELETE CASCADE
);


CREATE TABLE IF NOT EXISTS cart (
    cart_id SERIAL PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    user_id INTEGER NOT NULL UNIQUE, 
    FOREIGN KEY (user_id) REFERENCES users (user_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS cart_items (
    cart_item_id SERIAL PRIMARY KEY,
    quantity INT NOT NULL DEFAULT 1,
    total_price NUMERIC(10, 2) NOT NULL,
    cart_id INTEGER NOT NULL,
    product_id INTEGER NOT NULL,
    FOREIGN KEY (product_id) REFERENCES products (product_id) ON DELETE CASCADE,
    FOREIGN KEY (cart_id) REFERENCES cart (cart_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS cart_item_toppings (
    cart_item_topping_id SERIAL PRIMARY KEY,
    cart_item_id INTEGER NOT NULL,
    topping_id INTEGER NOT NULL,
    FOREIGN KEY (cart_item_id) REFERENCES cart_items(cart_item_id) ON DELETE CASCADE,
    FOREIGN KEY (topping_id) REFERENCES toppings(topping_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS orders (
    order_id SERIAL PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    total_amount NUMERIC(10, 2) NOT NULL,
    order_status VARCHAR(50) NOT NULL CHECK (order_status IN ('preparing', 'oven', 'ready', 'delivered')),
    user_id INTEGER NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users (user_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS order_items (
    order_item_id SERIAL PRIMARY KEY,
    quantity INT NOT NULL DEFAULT 1,
    total_price NUMERIC(10, 2) NOT NULL,
    product_name VARCHAR(255) NOT NULL,
    order_id INTEGER NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders (order_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS order_item_toppings (
    order_item_topping_id SERIAL PRIMARY KEY,
    topping_name VARCHAR(255) NOT NULL,
    order_item_id INTEGER NOT NULL,
    FOREIGN KEY (order_item_id) REFERENCES order_items (order_item_id) ON DELETE CASCADE
);
