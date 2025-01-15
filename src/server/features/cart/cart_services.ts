import { queryDB } from "@/server/db/db_services";
import * as CartQueries from "./cart_queries";

export type Topping = {
  topping_id: number;
  topping_name: string;
  additional_price: number;
};

export type Cart = {
  cart_id: number;
  cart_item_id: number;
  quantity: number;
  total_price: string;
  product_name: string;
  toppings: Topping[];
};

export async function createCartIfNotExists(userId: string) {
  try {
    const result = await queryDB(CartQueries.createCart, [userId]);

    const cartId = result.rows[0].cart_id;

    return cartId;
  } catch (error) {
    throw new Error("there was an error creating the cart.");
  }
}

export async function addItemToCart(
  product_id: string,
  quantity: number,
  total: number,
  cartId: string
) {
  try {
    const result = await queryDB(CartQueries.addItemToCart, [
      quantity,
      total,
      cartId,
      product_id,
    ]);

    const cartItemId = result.rows[0].cart_item_id;

    return cartItemId;
  } catch (error) {
    throw new Error("there was an error adding the item to the cart");
  }
}

export async function insertCartItemToppings(
  cartItemId: string,
  selectedToppings: number[]
) {
  try {
    for (const toppings of selectedToppings) {
      await queryDB(CartQueries.insertCartItemToppings, [cartItemId, toppings]);
    }
  } catch (error) {
    throw new Error(
      "there was an error adding the item to the cart item toppings table"
    );
  }
}

export async function getCartData(userIdString: string) {
  try {
    const result = await queryDB(CartQueries.getCartData, [userIdString]);
    const cartData = result.rows;

    const totalQuantity = cartData.reduce(
      (sum, item) => sum + item.quantity,
      0
    );

    const totalAmount = cartData.reduce(
      (sum, item) => sum + parseFloat(item.total_price),
      0
    );

    return { cartData, totalQuantity, totalAmount };
  } catch (error) {
    throw new Error("there was an error getting the cart amount.");
  }
}

export async function deleteCartItem(cartItemId: string) {
  try {
    await queryDB(CartQueries.deleteCartItem, [cartItemId]);
  } catch (error) {
    throw new Error("Error deleting cart item");
  }
}
