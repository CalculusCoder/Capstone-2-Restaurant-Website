import { z } from "zod";

export const createProductSchema = z.object({
  product_name: z.string(),
  product_price: z.number(),
  image_url: z.string(),
  product_category: z.string(),
  toppings: z
    .array(
      z.object({
        name: z.string(),
        price: z.number(),
      })
    )
    .optional(),
});
