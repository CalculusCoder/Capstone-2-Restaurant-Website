import { NextApiRequest, NextApiResponse } from "next";
import { connectDB } from "@/server/db/db_services";
import * as OrderServices from "@/server/features/order/order_services";

export default async function updateOrderStatus(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    await connectDB();

    if (req.method !== "PUT") {
      return res.status(405).json({ error: "Method not allowed" });
    }

    const { orderId, status } = req.body;

    await OrderServices.updateOrderStatus(orderId, status);

    res.status(200).json({ message: "Succesfully updated status." });
  } catch (error) {
    res.status(500).json({
      error:
        error instanceof Error
          ? error.message
          : "Error creating product. If the issue persists please contact support.",
    });
  }
}
