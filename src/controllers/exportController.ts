import { Request, Response } from "express";
import { ProductService } from "../services/productService";

export const exportCSV = async (req: Request, res: Response) => {
  try {
    const csvData = await ProductService.exportProductsAsCSV();
    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", "attachment; filename=products.csv");
    res.send(csvData);
  } catch (error) {
    res.status(500).json({ message: "Error exporting CSV", error });
  }
};

export const exportPDF = async (req: Request, res: Response) => {
  try {
    const pdfPath = await ProductService.exportProductsAsPDF();
    res.download(pdfPath, "products.pdf");
  } catch (error) {
    res.status(500).json({ message: "Error exporting PDF", error });
  }
};
