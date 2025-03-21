import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const ProductService = {
  async createProduct(data: any) {
    return await prisma.product.create({ data });
  },

async getAllProducts(query?: string, categoryId?: string, minPrice?: number, maxPrice?: number, stockStatus?: string) {
  const filters: any = {}; // ✅ Collect filters dynamically

  if (query) {
    filters.OR = [
      { name: { contains: query, mode: "insensitive" } },
      { description: { contains: query, mode: "insensitive" } }
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
  
};
