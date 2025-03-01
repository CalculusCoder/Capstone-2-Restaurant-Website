import { NextApiRequest, NextApiResponse } from "next";
import { connectDB } from "@/server/db/db_services";
import * as OrderServices from "@/server/features/order/order_services";

export default async function getAllRestaurantOrders(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    await connectDB();

    if (req.method !== "GET") {
      return res.status(405).json({ error: "Method not allowed" });
    }

    const orders = await OrderServices.getAllRestaurantOrders();

    res.status(200).json({ orders });
  } catch (error) {
    res.status(500).json({
      error:
        error instanceof Error
          ? error.message
          : "Error creating product. If the issue persists please contact support.",
    });
  }
}
