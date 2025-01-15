import { queryDB } from "@/server/db/db_services";
import * as OrderQueries from "@/server/features/order/order_queries";

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

export async function getProductAndToppings(productId: string) {
  try {
    const productsRes = await queryDB(OrderQueries.getProductData, [productId]);

    const productData = productsRes.rows;

    const toppingsRes = await queryDB(OrderQueries.getProductToppings, [
      productId,
    ]);

    const productToppings = toppingsRes.rows;

    return { productData, productToppings };
  } catch (error) {
    throw new Error("Error getting product and product toppings.");
  }
}

export async function createOrder(
  cartData: any,
  userId: string,
  totalAmount: string
) {
  try {
    const orderStatus = "preparing";

    const newOrderRes = await queryDB(OrderQueries.createNewOrder, [
      totalAmount,
      orderStatus,
      userId,
    ]);

    const orderId = newOrderRes.rows[0].order_id;

    for (const cart of cartData) {
      const orderItemRes = await queryDB(OrderQueries.createOrderItem, [
        cart.quantity,
        cart.total_price,
        cart.product_name,
        orderId,
      ]);

      const orderItemId = orderItemRes.rows[0].order_item_id;

      for (const topping of cart.toppings) {
        await queryDB(OrderQueries.createOrderItemToppings, [
          topping.topping_name,
          orderItemId,
        ]);
      }
    }
  } catch (error) {
    console.error(error);
  }
}

export async function clearCart(userId: string) {
  try {
    await queryDB(OrderQueries.clearCart, [userId]);
  } catch (error) {
    console.error(error);
  }
}

export async function getOrders(userId: string) {
  try {
    console.log(userId);
    const result = await queryDB(OrderQueries.getOrders, [userId]);

    const orders = result.rows;

    return orders;
  } catch (error) {
    throw new Error("Error getting orders.");
  }
}

export async function getAllRestaurantOrders() {
  try {
    const result = await queryDB(OrderQueries.getAllRestaurantOrders, []);

    const orders = result.rows;

    return orders;
  } catch (error) {
    throw new Error("Error getting restaurant orders");
  }
}

export async function updateOrderStatus(orderId: string, status: string) {
  try {
    await queryDB(OrderQueries.updateOrderStatus, [status, orderId]);
  } catch (error) {
    throw new Error("Error updating order status");
  }
}
