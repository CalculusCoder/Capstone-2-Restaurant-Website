const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { totalAmount, userId } = req.body;

    const lineItems = [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: "Your Cart",
            description: "This is the total amount for your cart.",
          },
          unit_amount: Math.round(totalAmount * 100),
        },
        quantity: 1,
      },
    ];

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      metadata: {
        userId,
        totalAmount,
      },
      success_url: `${req.headers.origin}/track-orders`,
      cancel_url: `${req.headers.origin}/?canceled=true`,
    });

    res.status(200).json({ url: session.url });
  } catch (err: any) {
    console.error("Error creating checkout session:", err);
    res.status(err.statusCode || 500).json({ error: err.message });
  }
}
