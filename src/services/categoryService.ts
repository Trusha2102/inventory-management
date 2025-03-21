import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const CategoryService = {
  async createCategory(data: any) {
    return await prisma.category.create({ data });
  },

  async getAllCategories() {
    return await prisma.category.findMany({ include: { products: true } });
  },

  async getCategoryById(id: string) {
    return await prisma.category.findUnique({
      where: { id },
      include: { products: true },
    });
  },

  async updateCategory(id: string, data: any) {
    return await prisma.category.update({ where: { id }, data });
  },

  async deleteCategory(id: string) {
    return await prisma.category.delete({ where: { id } });
  },
};
