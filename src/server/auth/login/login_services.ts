import { queryDB } from "@/server/db/db_services";
import * as LoginQueries from "./login_queries";

export async function getUserHashedPassword(email: string) {
  try {
    const result = await queryDB(LoginQueries.getUserPassword, [email]);

    if (result.rows.length === 0) {
      throw new Error("Incorrect email or password");
    }

    const databasePassword = result.rows[0].password;
    const userId = result.rows[0].user_id;

    return { databasePassword, userId };
  } catch (error: any) {
    throw new Error(error);
  }
}
