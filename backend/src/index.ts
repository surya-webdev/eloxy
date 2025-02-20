import express, { Application, Request, Response } from "express";
import cors from "cors";

import { product } from "./routes/product";
import { user } from "./routes/user";
import { cart } from "./routes/cart";
import { order } from "./routes/order";

const app: Application = express();

const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use("/api/v1/product", product);

app.use("/api/v1/user", user);

app.use("/api/v1/cart", cart);

app.use("/api/v1/order", order);

app.get("/", (req: Request, res: Response) => {
  res.json({ message: "Welcome to Express & TypeScript Server" });
});

app.listen(port, () => {
  console.log(`Server is Fire at https://localhost:${port}`);
});
