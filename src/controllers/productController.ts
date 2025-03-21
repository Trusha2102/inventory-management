import { Request, Response } from "express";
import { ProductService } from "../services/productService";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();


export const createProduct = async (req: Request, res: Response) => {
  try {
    const product = await ProductService.createProduct(req.body);
    res.status(201).json(product);
    return;
  } catch (error) {
    res.status(500).json({ message: "Error creating product", error });
    return;
  }
};

export const getAllProducts = async (req: Request, res: Response) => {
  try {
    const { query, categoryId, minPrice, maxPrice, stockStatus } = req.query;

    const products = await ProductService.getAllProducts(
      query as string,
      categoryId as string,
      minPrice ? Number(minPrice) : undefined,
      maxPrice ? Number(maxPrice) : undefined,
      stockStatus as string
    );

    res.json(products);
    return;
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ message: "Error fetching products", error });
    return;
  }
};


export const getProductById = async (req: Request, res: Response) => {
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
};

export const updateProduct = async (req: Request, res: Response) => {
  try {
    const updatedProduct = await ProductService.updateProduct(
      req.params.id,
      req.body
    );
    res.json(updatedProduct);
    return;
  } catch (error) {
    res.status(500).json({ message: "Error updating product", error });
    return;
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  try {
    await ProductService.deleteProduct(req.params.id);
    res.json({ message: "Product deleted successfully" });
    return;
  } catch (error) {
    res.status(500).json({ message: "Error deleting product", error });
    return;
  }
};

