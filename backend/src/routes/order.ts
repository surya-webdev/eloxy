import { Request, Response, Router } from "express";
import crypto from "crypto";
import Razorpay from "razorpay";

export const order = Router();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || "",
  key_secret: process.env.RAZORPAY_SECRET || "",
});

order.post("/pay", async (req: Request, res: Response): Promise<any> => {
  const { amount, currency } = req.body;

  if (!amount || amount <= 0 || !currency) {
    return res.json({ message: "Invalid Amount or Currency " });
  }

  const allowedCurrencies = ["INR", "USD", "EUR"];

  if (!allowedCurrencies.includes(currency)) {
    return res.status(401).json({
      success: false,
      message: `Currency ${currency} is not supported.`,
    });
  }

  try {
    const order = await razorpay.orders.create({
      amount: Number(amount),
      currency: currency,
    });

    if (!order) {
      res
        .status(500)
        .json({ status: "failure", message: "Internal server Error" });
    }

    return res.status(200).json({ status: "sucess", order });
  } catch (error) {
    console.error("ERROR MESSAGE", error);

    return res.status(411).json({
      message: "Something went wrong , Please Try Again!",
      status: "failure",
      // @ts-expect-error
      error: error?.error?.description,
    });
  }
});

order.post("/verify", async (req: Request, res: Response): Promise<any> => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      req.body;

    const sign = razorpay_order_id + "|" + razorpay_payment_id;

    // Create ExpectedSign
    const expectedSign = crypto
      .createHmac("sha256", process.env.RAZORPAY_SECRET || "")
      .update(sign.toString())
      .digest("hex");

    const isAuthentic = expectedSign === razorpay_signature;

    if (!isAuthentic)
      return res
        .status(411)
        .json({ message: "Payment failed", status: "failure" });

    if (isAuthentic)
      return res.json({ message: "Payment is sucess", status: "sucess" });
  } catch (error) {
    console.error("ERROR MESSAGE", error);

    return res.status(511).json({
      message: "Something went wrong , Please Try Again!",
      status: "failure",
      // @ts-expect-error
      error: error?.error?.description,
    });
  }
});
