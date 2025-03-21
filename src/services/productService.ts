import { PrismaClient } from "@prisma/client";
import { Parser } from "json2csv";
import PDFDocument from "pdfkit";
import fs from "fs";

const prisma = new PrismaClient();

export const ProductService = {
  async createProduct(data: any) {
    return await prisma.product.create({ data });
  },

  async getAllProducts(
    query?: string,
    categoryId?: string,
    minPrice?: number,
    maxPrice?: number,
    stockStatus?: string
  ) {
    const filters: any = {}; // ✅ Collect filters dynamically

    if (query) {
      filters.OR = [
        { name: { contains: query, mode: "insensitive" } },
        { description: { contains: query, mode: "insensitive" } },
      ];
    }

    if (categoryId) {
      filters.categoryId = categoryId;
    }

    if (minPrice !== undefined) {
      filters.price = { ...(filters.price || {}), gte: minPrice };
    }

    if (maxPrice !== undefined) {
      filters.price = { ...(filters.price || {}), lte: maxPrice };
    }

    if (stockStatus) {
      filters.quantity =
        stockStatus === "in_stock"
          ? { gt: 0 }
          : stockStatus === "out_of_stock"
          ? { equals: 0 }
          : stockStatus === "low_stock"
          ? { lt: 5 }
          : undefined;
    }

    return await prisma.product.findMany({ where: filters });
  },

  async getProductById(id: string) {
    return await prisma.product.findUnique({ where: { id } });
  },

  async updateProduct(id: string, data: any) {
    return await prisma.product.update({ where: { id }, data });
  },

  async deleteProduct(id: string) {
    return await prisma.product.delete({ where: { id } });
  },

  async updateStock(id: string, quantityChange: number) {
    // ✅ Keep it here
    const product = await prisma.product.findUnique({ where: { id } });

    if (!product) {
      throw new Error("Product not found");
    }

    const newQuantity = product.quantity + quantityChange;
    if (newQuantity < 0) {
      throw new Error("Stock level cannot be negative");
    }

    const updatedProduct = await prisma.product.update({
      where: { id },
      data: { quantity: newQuantity },
    });

    return updatedProduct;
  },

  async getLowStockProducts() {
    // ✅ Keep it here
    return await prisma.product.findMany({
      where: { quantity: { lt: 5 } }, // Fetch products below the threshold
    });
  },

  async exportProductsAsCSV() {
    const products = await prisma.product.findMany();

    const fields = [
      "id",
      "name",
      "description",
      "quantity",
      "price",
      "createdAt",
    ];
    const opts = { fields };
    const parser = new Parser(opts); // ✅ Using `Parser` from json2csv
    const csv = parser.parse(products);

    return csv;
  },

  async exportProductsAsPDF() {
    const products = await prisma.product.findMany();
    const exportDir = "exports";
    const pdfPath = `${exportDir}/products.pdf`;

    // ✅ Ensure `exports/` directory exists
    if (!fs.existsSync(exportDir)) {
      fs.mkdirSync(exportDir);
    }

    return new Promise<string>((resolve, reject) => {
      const doc = new PDFDocument();
      const stream = fs.createWriteStream(pdfPath);

      doc.pipe(stream);

      doc.fontSize(18).text("Product List", { align: "center" });
      doc.moveDown();

      products.forEach((product) => {
        doc.fontSize(12).text(`ID: ${product.id}`);
        doc.text(`Name: ${product.name}`);
        doc.text(`Description: ${product.description || "N/A"}`);
        doc.text(`Quantity: ${product.quantity}`);
        doc.text(`Price: ${product.price}`);
        doc.moveDown();
      });

      doc.end();

      stream.on("finish", () => {
        resolve(pdfPath); // ✅ Ensure file is fully created before resolving
      });

      stream.on("error", (error) => {
        reject(error);
      });
    });
  },
};
