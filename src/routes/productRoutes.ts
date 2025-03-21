import express from "express";
import asyncHandler from "express-async-handler";
import { ProductController } from "../controllers/productController";

const router = express.Router();

router.post("/", asyncHandler(ProductController.create));
router.get("/", asyncHandler(ProductController.getAll));
router.get("/:id", asyncHandler(ProductController.getOne));
router.put("/:id", asyncHandler(ProductController.update));
router.delete("/:id", asyncHandler(ProductController.delete));

export default router;
