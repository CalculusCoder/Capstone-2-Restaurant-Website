import { NextApiRequest, NextApiResponse } from "next";
import { connectDB } from "@/server/db/db_services";
import * as MenuServices from "@/server/features/menu/menu_services";

export default async function createNewProduct(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    await connectDB();

    if (req.method !== "GET") {
      return res.status(405).json({ error: "Method not allowed" });
    }

    const { pizzas, burgers } = await MenuServices.getMenuItems();

    res.status(200).json({ pizzas, burgers });
  } catch (error) {
    res.status(500).json({
      error:
        error instanceof Error
          ? error.message
          : "Error creating product. If the issue persists please contact support.",
    });
  }
}
