import express from "express";
import { authenticateUser } from "../middleware/authMiddleware";
import {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} from "../controllers/productController";

const router = express.Router();

router.post("/",authenticateUser, createProduct);
router.get("/", getAllProducts);
router.get("/:id", getProductById);
router.put("/:id", authenticateUser, updateProduct);
router.delete("/:id", authenticateUser, deleteProduct);

export default router;
