import { PrismaClient } from "@prisma/client";
import { Request, Response, Router } from "express";

export const cart = Router();

const prisma = new PrismaClient();

cart.get("/item", async (req: Request, res: Response): Promise<any> => {
  const { userId } = req.body;

  if (!userId)
    return res.json({
      message: "Invalid user access ",
      status: "failure",
    });

  try {
    const getItems = await prisma.cart.findMany({
      where: {
        userId,
      },
    });

    if (getItems.length > 0) return res.json({ data: getItems });

    return res.json({
      message: "Your cart is empty",
      status: "failure",
      cart: false,
    });
  } catch (error) {
    console.error("ERROR MESSAGE", error);
    return res.status(400).json({
      message: "Something went wrong , Please try again",
      status: "failure",
    });
  }
});

cart.post("/add", async (req: Request, res: Response): Promise<any> => {
  //
  const { productId, userId } = req.body;

  if (!productId || !userId)
    return res.json({
      message: "Invalid user access ",
      status: "failure",
    });

  try {
    //
    const response = await prisma.cart.create({
      data: {
        productId,
        userId,
      },
    });

    res.json({ response });
  } catch (error) {
    console.error("ERROR MESSAGE", error);
    return res.status(400).json({
      message: "Something went wrong , Please try again",
      status: "failure",
    });
  }
});

cart.delete("/delete", async (req: Request, res: Response): Promise<any> => {
  const { id }: { id: string } = req.body;
  if (!id)
    return res.json({
      message: "Invalid Product",
      status: "failure",
    });

  try {
    const item = await prisma.cart.delete({
      where: {
        id: id,
      },
    });
    if (item) {
      return res.json({ message: "Deleted Sucessfully", status: "sucess" });
    } else {
      res.json({ message: "Couldn't find the Product", status: "failure" });
    }
  } catch (error) {
    console.error("ERROR MESSAGE", error);
    return res.status(400).json({
      message: "Something went wrong , Please try again",
      status: "failure",
    });
  }
});
