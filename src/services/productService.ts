import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const ProductService = {
  async createProduct(data: any) {
    return await prisma.product.create({ data });
  },

  async getAllProducts() {
    return await prisma.product.findMany();
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
};
