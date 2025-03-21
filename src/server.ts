import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { PORT } from "./config";
import productRoutes from "./routes/productRoutes";
import categoryRoutes from "./routes/categoryRoutes";
import stockRoutes from "./routes/stockRoutes";
import authRoutes from "./routes/authRoutes";



const app = express();

app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));

app.use("/api/products", productRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/stock", stockRoutes);
app.use("/api/auth", authRoutes);


app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
