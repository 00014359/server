import { PrismaClient } from "@prisma/client";

export class PerfumeModel {
  #_prisma;

  constructor() {
    this.#_prisma = new PrismaClient();
  }

  // Fetch all perfumes
  async getAllPerfumes(gender) {
    const where = gender ? { gender } : {};

    return await this.#_prisma.perfume.findMany({
      where,
    });
  }

  // Get a single perfume by ID
  async getPerfumeById(id) {
    return await this.#_prisma.perfume.findUnique({
      where: { id },
    });
  }

  // Create a new perfume
  async createPerfume({
    name,
    brand,
    description,
    price,
    stock,
    image,
    size,
    gender,
  }) {
    return await this.#_prisma.perfume.create({
      data: {
        name,
        brand,
        description,
        price,
        stock,
        image,
        size,
        gender,
      },
    });
  }

  // Update an existing perfume
  async updatePerfume(
    id,
    { name, brand, description, price, stock, image, size, gender }
  ) {
    return await this.#_prisma.perfume.update({
      where: { id },
      data: {
        name,
        brand,
        description,
        price,
        stock,
        image,
        size,
        gender,
      },
    });
  }

  // Delete a perfume
  async deletePerfume(id) {
    return await this.#_prisma.perfume.delete({
      where: { id },
    });
  }

  // Check stock before placing an order
  async checkStock(id, quantity) {
    const perfume = await this.getPerfumeById(id);
    if (perfume && perfume.stock >= quantity) {
      return true;
    }
    return false;
  }
}
