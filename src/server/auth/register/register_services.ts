import { queryDB } from "@/server/db/db_services";
import * as RegisterQueries from "@/server/auth/register/register_queries";

export async function validateUserExistance(email: string) {
  try {
    const result = await queryDB(RegisterQueries.checkIfUserExists, [email]);

    if (result.rows.length > 0) {
      throw new Error("User already registered. Please login.");
    }
  } catch (error: any) {
    throw new Error(error);
  }
}

export async function registerUser(
  first_name: string,
  last_name: string,
  email: string,
  encryptedPassword: string
) {
  try {
    const result = await queryDB(RegisterQueries.regusterUser, [
      first_name,
      last_name,
      email,
      encryptedPassword,
    ]);

    const userId = result.rows[0].user_id;

    return userId;
  } catch (error) {
    throw new Error("There was an error registering the user.");
  }
}
