import { NextApiRequest, NextApiResponse } from "next";
import { connectDB } from "@/server/db/db_services";
import * as CartServices from "@/server/features/cart/cart_services";

export default async function deleteCartItem(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    await connectDB();

    if (req.method !== "DELETE") {
      return res.status(405).json({ error: "Method not allowed" });
    }

    const { cartItemId } = req.query;

    const cartItemIdString = String(cartItemId);

    await CartServices.deleteCartItem(cartItemIdString);

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
