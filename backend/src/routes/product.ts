import { PrismaClient } from "@prisma/client";
import { Request, Response, Router } from "express";

const prisma = new PrismaClient();

export const product = Router();

product.get("/", async (req: Request, res: Response) => {
  const response = await prisma.product.findMany({});
  console.log("yess");
  res.json({ response });
});

product.use("/filter", async (req: Request, res: Response): Promise<any> => {
  //

  const filters = req.query || "all";

  if (
    filters.category === "footwear" ||
    filters.category === "topwear" ||
    filters.category === "bottomwear"
  ) {
    const response = await prisma.product.findMany({
      where: {
        category: filters.category,
      },
    });

    if (response.length > 0) return res.json({ response });

    return res.status(411).json({ message: "no item found" });
  }

  if (filters.category) {
    const response = await prisma.product.findMany({});

    return res.json({ response });
  }

  return res.json({ message: "No search term provided" });
});

product.get("/view/:id", async (req: Request, res: Response) => {
  const id = req.params.id;

  if (!id) throw Error("Product is not found");

  try {
    const response = await prisma.product.findFirst({
      where: {
        id,
      },
    });

    if (!response) {
      res.status(411).json({ message: "Product not found", status: "failed" });
    }

    res.json(response);
  } catch (error) {
    console.error("Error Message", error);
    res.status(411).json({
      message: "failed",
    });
  }
});
