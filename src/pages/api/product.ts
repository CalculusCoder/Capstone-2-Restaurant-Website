import { NextApiRequest, NextApiResponse } from "next";
import * as ProductUtils from "@/server/features/products/products_utils";
import * as ProductServices from "@/server/features/products/products_services";
import { connectDB } from "@/server/db/db_services";

export default async function createNewProduct(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    await connectDB();

    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method not allowed" });
    }

    const validatedData = ProductUtils.createProductSchema.safeParse(req.body);

    if (!validatedData.success)
      throw new Error("Invalid form data. Please enter valid form data.");

    const {
      product_name,
      product_price,
      image_url,
      product_category,
      toppings,
    } = validatedData.data;

    await ProductServices.createNewProduct(
      product_name,
      product_price,
      image_url,
      product_category,
      toppings
    );

    res.status(200).json({ message: "Successfully registered user" });
  } catch (error) {
    res.status(500).json({
      error:
        error instanceof Error
          ? error.message
          : "Error creating product. If the issue persists please contact support.",
    });
  }
}
