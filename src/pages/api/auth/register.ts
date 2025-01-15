import { NextApiRequest, NextApiResponse } from "next";
import * as ServerRegisterUtils from "../../../server/auth/register/register_utils";
import * as ServerRegisterServices from "@/server/auth/register/register_services";
import { connectDB } from "@/server/db/db_services";
const bcrypt = require("bcrypt");

export default async function registerNewUser(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    await connectDB();

    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method not allowed" });
    }

    const validatedData = ServerRegisterUtils.registerFormSchema.safeParse(
      req.body
    );

    if (!validatedData.success)
      throw new Error("Invalid form data. Please enter valid form data.");

    const { email, first_name, last_name, password } = validatedData.data;

    await ServerRegisterServices.validateUserExistance(email);

    const encryptedPassword = await bcrypt.hash(password, 10);

    const userId = await ServerRegisterServices.registerUser(
      first_name,
      last_name,
      email,
      encryptedPassword
    );

    res.status(200).json({ userId });
  } catch (error) {
    res.status(500).json({
      error:
        error instanceof Error
          ? error.message
          : "Error creating product. If the issue persists please contact support.",
    });
  }
}
