import { PrismaClient } from "@prisma/client";
import { Request, Response, Router } from "express";
import bcrypt from "bcrypt";
import { signupType } from "../lib/types";
export const user = Router();

const prisma = new PrismaClient();

user.get("/", (req: Request, res: Response) => {
  res.send({ messgae: "yes" });
});

user.post("/signup", async (req: Request, res: Response): Promise<any> => {
  const { email, password, name, image }: signupType = req.body;
  if (!email || !password || !name)
    return res.status(400).json({ message: "Invalid Inputs", status: false });

  const saltRounds = 10;
  const salt = await bcrypt.genSalt(saltRounds);
  const hassPassword = await bcrypt.hash(password, salt);

  try {
    const existingUser = await prisma.user.findFirst({
      where: {
        email: email,
        name: name,
      },
    });

    if (existingUser) {
      return res.json({ user: existingUser.id });
    } else {
      const user = await prisma.user.create({
        data: {
          email: email,
          name: name,
          password: hassPassword,
          image,
        },
      });

      return res.json({
        id: user.id,
        email: user.email,
        name: user.name,
        image: user.image,
      });
    }
  } catch (error) {
    console.error("ERROR MESSAGE", error);
  }
});
