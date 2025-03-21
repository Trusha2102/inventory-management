import { Request, Response } from "express";
import { ProductService } from "../services/productService"; // ✅ Correct Import

export const updateProductStock = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { quantityChange } = req.body;

    if (quantityChange === undefined) {
      res.status(400).json({ message: "Quantity change is required" });
      return;
    }

    const updatedProduct = await ProductService.updateStock(id, quantityChange); // ✅ Uses ProductService
    res.json(updatedProduct);
    return;
  } catch (error) {
    console.error("Error updating stock:", error);
    res.status(500).json({ message: "Error updating stock" });
    return;
  }
};

export const getLowStock = async (req: Request, res: Response) => {
  try {
    const lowStockProducts = await ProductService.getLowStockProducts(); // ✅ Uses ProductService
    res.json(lowStockProducts);
    return;
  } catch (error) {
    console.error("Error fetching low stock products:", error);
    res.status(500).json({ message: "Error fetching low stock products" });
    return;
  }
};
