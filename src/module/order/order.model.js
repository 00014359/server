import { PrismaClient } from "@prisma/client";

export class OrderModel {
  #_prisma;

  constructor() {
    this.#_prisma = new PrismaClient();
  }

  async createOrder({
    userId,
    perfumeId,
    quantity,
    orderMessage,
    orderAddress,
  }) {
    const perfume = await this.#_prisma.perfume.findUnique({
      where: { id: perfumeId },
    });
    if (!perfume) {
      throw new Error("Perfume not found.");
    }
    if (perfume.stock < quantity) {
      throw new Error(
        `Not enough stock for ${perfume.name}. Available: ${perfume.stock}`
      );
    }

    const user = await this.#_prisma.user.findUnique({
      where: { id: userId },
    });
    if (!user) {
      throw new Error("User not found.");
    }

    const transaction = await this.#_prisma.$transaction(async (prisma) => {
      await prisma.perfume.update({
        where: { id: perfumeId },
        data: {
          stock: perfume.stock - quantity,
        },
      });

      const order = await prisma.order.create({
        data: {
          userId,
          perfumeId,
          quantity,
          orderMessage,
          orderAddress,
        },
      });
      return order;
    });

    return transaction;
  }

  async getAllOrders() {
    return await this.#_prisma.order.findMany({
      include: {
        perfume: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  async getOrdersByUserId(userId) {
    return await this.#_prisma.order.findMany({
      where: { userId },
      include: {
        perfume: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }
}
