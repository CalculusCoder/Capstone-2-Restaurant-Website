import { queryDB } from "@/server/db/db_services";
import * as ProductQueries from "./products_queries";

type Topping = {
  name: string;
  price: number;
};

export async function createNewProduct(
  product_name: string,
  product_price: number,
  image_url: string,
  product_category: string,
  toppings: Topping[] | undefined
) {
  try {
    const createProductRes = await queryDB(ProductQueries.createProduct, [
      product_name,
      product_price,
      product_category,
      image_url,
    ]);

    if (!toppings || toppings.length === 0) return;

    const productId = createProductRes.rows[0].product_id;

    for (const topping of toppings) {
      await queryDB(ProductQueries.insertProductToppings, [
        topping.name,
        topping.price,
        productId,
      ]);
    }
  } catch (error) {
    throw new Error("There was an error creating the product.");
  }
}
