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

/**
 * @swagger
 * /api/products:
 *   post:
 *     summary: Create a new product (Admin only)
 *     responses:
 *       201:
 *         description: Product created successfully.
 *       403:
 *         description: Forbidden - User is not an admin.
 */
router.post("/", authenticateUser, authorizeRole(["admin"]), createProduct); // ✅ Only Admin

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Get all products
 *     description: Retrieve a list of all products with optional search & filtering.
 *     responses:
 *       200:
 *         description: A list of products.
 */
router.get("/", authenticateUser, getAllProducts); 

/**
 * @swagger
 * /api/products/{id}:
 *   get:
 *     summary: Get a single product by ID
 *     responses:
 *       200:
 *         description: Product details retrieved successfully.
 *       404:
 *         description: Product not found.
 */
router.get("/:id", authenticateUser, getProductById); 

/**
 * @swagger
 * /api/products/{id}:
 *   put:
 *     summary: Update a product by ID (Admin only)
 *     responses:
 *       200:
 *         description: Product updated successfully.
 *       403:
 *         description: Forbidden - User is not an admin.
 */
router.put("/:id", authenticateUser, authorizeRole(["admin"]), updateProduct); // ✅ Only Admin

/**
 * @swagger
 * /api/products/{id}:
 *   delete:
 *     summary: Delete a product by ID (Admin only)
 *     responses:
 *       200:
 *         description: Product deleted successfully.
 *       403:
 *         description: Forbidden - User is not an admin.
 */
router.delete("/:id", authenticateUser, authorizeRole(["admin"]), deleteProduct); // ✅ Only Admin

export default router;
