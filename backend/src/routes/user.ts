import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import Cookies from "cookies";
import { Request, Response, Router } from "express";
import jwt from "jsonwebtoken";

import { loginType, signupType } from "../lib/types";

export const user = Router();

const prisma = new PrismaClient();

const keys = ["keyboard cat"];

user.get("/", (req: Request, res: Response) => {
  res.send({ messgae: "yes" });
});

user.post("/signup", async (req: Request, res: Response): Promise<any> => {
  const { email, password, name, image }: signupType = req.body;
  if (!email || !password || !name)
    return res
      .status(400)
      .json({ message: "Invalid Inputs", status: "failure" });

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
      return res.json({ message: "Existing User", status: "failure" });
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
      //
    }
  } catch (error) {
    console.error("ERROR MESSAGE", error);
  }
});

user.post("/login", async (req: Request, res: Response): Promise<any> => {
  //

  const { email, password }: loginType = req.body;

  const cookies = new Cookies(req, res, { keys: keys });

  if (!email || !password) {
    return res.json({ message: "Invalid inputs", status: "failure" });
  }

  try {
    const response = await prisma.user.findFirst({
      where: {
        email,
      },
    });

    if (response) {
      const match = await bcrypt.compareSync(password, response?.password);

      const oneWeekExpiry = Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60;

      if (match) {
        const jwtId = await jwt.sign(
          { data: response.id, exp: oneWeekExpiry },
          process.env.JWT_SECRET || ""
        );

        console.log(jwtId);

        cookies.set("eloxytoken", jwtId, { signed: true });

        res.json({
          userId: response.id,
          message: "You've Logged In ",
          status: "success",
        });
      } else {
        return res
          .status(411)
          .json({ message: "Invalid Password", status: "failure" });
      }
    } else {
      return res
        .status(411)
        .json({ message: "Invalid User", status: "failure" });
    }
  } catch (error) {
    console.error("ERROR MESSAGE", error);

    return res.json({
      message: "Network Issue , please try again",
      status: "failure",
    });
  }
});
