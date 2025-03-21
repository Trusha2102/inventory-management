import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { PORT } from "./config";
import productRoutes from "./routes/productRoutes";

const app = express();

app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));

app.use("/api/products", productRoutes);

app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
