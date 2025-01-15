import { NextApiRequest, NextApiResponse } from "next";
import { buffer } from "micro";
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
import * as OrderServices from "@/server/features/order/order_services";
import { getCartData } from "@/server/features/cart/cart_services";

export type Topping = {
  topping_id: number;
  topping_name: string;
  additional_price: number;
};

export type Cart = {
  cart_id: number;
  cart_item_id: number;
  quantity: number;
  total_price: string;
  product_name: string;
  toppings: Topping[];
};

const endpointSecret = process.env.STRIPE_WEBHOOK_KEY;

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  let event;

  try {
    const buf = await buffer(req);
    const sig = req.headers["stripe-signature"];

    event = stripe.webhooks.constructEvent(buf, sig, endpointSecret);

    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      const userId = session.metadata.userId;
      const totalAmount = session.metadata.totalAmount;

      const { cartData } = await getCartData(userId);

      await OrderServices.createOrder(cartData, userId, totalAmount);

      await OrderServices.clearCart(userId);
    }

    res.status(200).send("Webhook received successfully.");
  } catch (err: any) {
    console.error("Webhook Error:", err.message || err);
    res.status(400).send(`Webhook Error: ${err.message}`);
  }
}
