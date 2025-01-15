import { NextApiRequest, NextApiResponse } from "next";
import { connectDB } from "@/server/db/db_services";
import * as CartServices from "@/server/features/cart/cart_services";

export default async function getCartDetails(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    await connectDB();

    if (req.method !== "GET") {
      return res.status(405).json({ error: "Method not allowed" });
    }

    const { userId } = req.query;

    const userIdString = String(userId);

    const { cartData, totalQuantity, totalAmount } =
      await CartServices.getCartData(userIdString);

    res.status(200).json({ cartData, totalQuantity, totalAmount });
  } catch (error) {
    res.status(500).json({
      error:
        error instanceof Error
          ? error.message
          : "Error creating product. If the issue persists please contact support.",
    });
  }
}
