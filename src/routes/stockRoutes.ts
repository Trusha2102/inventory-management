import express from "express";
import {
  updateProductStock,
  getLowStock,
} from "../controllers/stockController";

const router = express.Router();

router.put("/:id", updateProductStock);
router.get("/low-stock", getLowStock);

export default router;
