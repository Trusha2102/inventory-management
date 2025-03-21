import { Request, Response } from "express";
import { ProductService } from "../services/productService";

export const ProductController = {
  async create(req: Request, res: Response) {
    try {
      const product = await ProductService.createProduct(req.body);
      res.status(201).json(product);
    } catch (error) {
      res.status(500).json({ message: "Error creating product", error });
    }
  },

  async getAll(req: Request, res: Response) {
    try {
      const products = await ProductService.getAllProducts();
      res.json(products);
    } catch (error) {
      res.status(500).json({ message: "Error fetching products", error });
    }
  },

  async getOne(req: Request, res: Response) {
    try {
      const product = await ProductService.getProductById(req.params.id);
      if (!product) {
        res.status(404).json({ message: "Product not found" });
        return;
      }
      res.json(product);
      return;
    } catch (error) {
      console.error("Error fetching product:", error);
      res.status(500).json({ message: "Error fetching product" });
      return;
    }
  },
  async update(req: Request, res: Response) {
    try {
      const updatedProduct = await ProductService.updateProduct(
        req.params.id,
        req.body
      );
      res.json(updatedProduct);
    } catch (error) {
      res.status(500).json({ message: "Error updating product", error });
    }
  },

  async delete(req: Request, res: Response) {
    try {
      await ProductService.deleteProduct(req.params.id);
      res.json({ message: "Product deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Error deleting product", error });
    }
  },
};
