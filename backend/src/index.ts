import express, { Application, Request, Response } from "express";
import { product } from "./routes/product";

import cors from "cors";

const app: Application = express();

const port = process.env.PORT || 3000;

app.use(cors());

app.use("/api/v1/product", product);

app.get("/", (req: Request, res: Response) => {
  res.json({ message: "Welcome to Express & TypeScript Server" });
});

app.listen(port, () => {
  console.log(`Server is Fire at https://localhost:${port}`);
});
