import { NextApiRequest, NextApiResponse } from "next";
import * as ServerLoginUtils from "@/server/auth/login/login_utils";
import * as ServerLoginServices from "@/server/auth/login/login_services";
import { connectDB } from "@/server/db/db_services";
const bcrypt = require("bcrypt");

export default async function login(req: NextApiRequest, res: NextApiResponse) {
  try {
    await connectDB();

    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method not allowed" });
    }

    const validatedData = ServerLoginUtils.loginFormSchema.safeParse(req.body);

    if (!validatedData.success)
      throw new Error("Invalid form data. Please enter valid form data.");

    const { email, password } = validatedData.data;

    const { userId, databasePassword } =
      await ServerLoginServices.getUserHashedPassword(email);

    const isSamePassword = await bcrypt.compare(password, databasePassword);

    if (isSamePassword) {
      res.status(200).json({ userId });
    } else {
      throw new Error("Incorrect email or password.");
    }
  } catch (error) {
    res.status(500).json({
      error:
        error instanceof Error
          ? error.message
          : "Error creating product. If the issue persists please contact support.",
    });
  }
}
