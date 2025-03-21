import express from "express";
import { authenticateUser, authorizeRole } from "../middleware/authMiddleware";
import {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} from "../controllers/productController";

const router = express.Router();

router.post("/", authenticateUser, authorizeRole(["admin"]), createProduct); // ✅ Only Admin
router.get("/", authenticateUser, getAllProducts); 
router.get("/:id", authenticateUser, getProductById); 
router.put("/:id", authenticateUser, authorizeRole(["admin"]), updateProduct); // ✅ Only Admin
router.delete("/:id", authenticateUser, authorizeRole(["admin"]), deleteProduct); // ✅ Only Admin

export default router;
