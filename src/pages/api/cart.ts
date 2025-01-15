import { NextApiRequest, NextApiResponse } from "next";
import { connectDB } from "@/server/db/db_services";
import * as CartServices from "@/server/features/cart/cart_services";

export default async function addCartData(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    await connectDB();

    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method not allowed" });
    }

    const { product_id, selectedToppings, quantity, total, userId } = req.body;

    const cartId = await CartServices.createCartIfNotExists(userId);

    const cartItemId = await CartServices.addItemToCart(
      product_id,
      quantity,
      total,
      cartId
    );

    await CartServices.insertCartItemToppings(cartItemId, selectedToppings);

    res.status(200).json({ message: "Succesfully added item to cart" });
  } catch (error) {
    res.status(500).json({
      error:
        error instanceof Error
          ? error.message
          : "Error creating product. If the issue persists please contact support.",
    });
  }
}
