import { queryDB } from "@/server/db/db_services";
import * as MenuQueries from "./menu_queries";

export async function getMenuItems() {
  try {
    const pizzasRes = await queryDB(MenuQueries.getPizzas, []);

    const burgersRes = await queryDB(MenuQueries.getBurgers, []);

    const pizzas = pizzasRes.rows;
    const burgers = burgersRes.rows;

    return { pizzas, burgers };
  } catch (error) {
    throw new Error("Error getting menu items");
  }
}
