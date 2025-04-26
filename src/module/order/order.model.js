import { PrismaClient } from "@prisma/client";

export class OrderModel {
  #_prisma;

  constructor() {
    this.#_prisma = new PrismaClient();
  }

  async createOrder({ customerName, phone, perfumeId }) {
    const perfume = await this.#_prisma.perfume.findUnique({
      where: { id: perfumeId },
    });
    if (!perfume) throw new Error("Perfume not found.");

    if (perfume.stock <= 0) {
      throw new Error("Out of stock!");
    }

    await this.#_prisma.perfume.update({
      where: { id: perfumeId },
      data: {
        stock: perfume.stock - 1,
      },
    });

    return await this.#_prisma.order.create({
      data: {
        customerName,
        phone,
        perfumeId,
      },
    });
  }

  // Get all orders
  async getAllOrders() {
    return await this.#_prisma.order.findMany({
      include: {
        perfume: true,
      },
    });
  }
}
