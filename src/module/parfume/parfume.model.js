import { PrismaClient } from "@prisma/client";

export class PerfumeModel {
  #_prisma;

  constructor() {
    this.#_prisma = new PrismaClient();
  }

  // Fetch all perfumes with enhanced filtering including reviews
  async getAllPerfumes(filters = {}) {
    const {
      gender,
      search,
      minPrice,
      maxPrice,
      season,
      occasion,
      intensity,
      fragranceFamily,
      minRating,
      sortBy = "createdAt",
      sortOrder = "desc",
      page = 1,
      pageSize = 10,
    } = filters;

    const where = {};

    // Gender filter
    if (gender) {
      where.gender = gender;
    }

    // Search filter
    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { brand: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
        { topNotes: { hasSome: [search] } },
        { middleNotes: { hasSome: [search] } },
        { baseNotes: { hasSome: [search] } },
      ];
    }

    // Price range filter
    if (minPrice !== undefined || maxPrice !== undefined) {
      where.price = {};
      if (minPrice !== undefined) {
        where.price.gte = minPrice;
      }
      if (maxPrice !== undefined) {
        where.price.lte = maxPrice;
      }
    }

    // Rating filter
    if (minRating !== undefined) {
      where.averageRating = {
        gte: minRating,
      };
    }

    // Season filter
    if (season) {
      where.OR = [{ season: season }, { season: "ALL_SEASONS" }];
    }

    // Occasion filter
    if (occasion) {
      where.occasion = occasion;
    }

    // Intensity filter
    if (intensity) {
      where.intensity = intensity;
    }

    // Fragrance family filter
    if (fragranceFamily) {
      where.fragranceFamily = fragranceFamily;
    }

    // Build orderBy object
    const orderBy = {};

    // Special handling for rating sorting
    if (sortBy === "rating") {
      orderBy.averageRating = sortOrder;
    } else if (sortBy === "popularity") {
      orderBy.totalReviews = sortOrder;
    } else {
      orderBy[sortBy] = sortOrder;
    }

    // Calculate skip and take for pagination
    const skip = (page - 1) * pageSize;
    const take = pageSize;

    const perfumes = await this.#_prisma.perfume.findMany({
      where,
      orderBy,
      skip,
      take,
    });

    const totalCount = await this.#_prisma.perfume.count({ where });

    return { perfumes, totalCount };
  }

  // Get a single perfume by ID
  async getPerfumeById(id) {
    return await this.#_prisma.perfume.findUnique({
      where: { id },
    });
  }

  // Create a new perfume with enhanced attributes
  async createPerfume(data) {
    const {
      name,
      brand,
      description,
      price,
      stock,
      image,
      size,
      gender,
      season = "ALL_SEASONS",
      occasion = "DAILY",
      intensity = "MODERATE",
      fragranceFamily = "FLORAL",
      topNotes = [],
      middleNotes = [],
      baseNotes = [],
      longevity = 5,
      sillage = 3,
    } = data;

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
        season,
        occasion,
        intensity,
        fragranceFamily,
        topNotes,
        middleNotes,
        baseNotes,
        longevity,
        sillage,
        averageRating: 0,
        totalReviews: 0,
      },
    });
  }

  // Update an existing perfume
  async updatePerfume(id, data) {
    // Filter out undefined values
    const updateData = {};
    Object.keys(data).forEach((key) => {
      if (data[key] !== undefined) {
        updateData[key] = data[key];
      }
    });

    return await this.#_prisma.perfume.update({
      where: { id },
      data: updateData,
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

  // Get similar perfumes based on fragrance family and gender
  async getSimilarPerfumes(perfumeId, limit = 5) {
    const perfume = await this.getPerfumeById(perfumeId);
    if (!perfume) return [];

    return await this.#_prisma.perfume.findMany({
      where: {
        AND: [
          { id: { not: perfumeId } },
          {
            OR: [
              { fragranceFamily: perfume.fragranceFamily },
              { gender: perfume.gender },
            ],
          },
          { stock: { gt: 0 } },
        ],
      },
      take: limit,
      orderBy: [
        { averageRating: "desc" },
        { totalReviews: "desc" },
        { createdAt: "desc" },
      ],
    });
  }

  // Get top-rated perfumes
  async getTopRatedPerfumes(limit = 10) {
    return await this.#_prisma.perfume.findMany({
      where: {
        AND: [{ stock: { gt: 0 } }, { totalReviews: { gt: 0 } }],
      },
      orderBy: [{ averageRating: "desc" }, { totalReviews: "desc" }],
      take: limit,
    });
  }

  // Get most reviewed perfumes
  async getMostReviewedPerfumes(limit = 10) {
    return await this.#_prisma.perfume.findMany({
      where: {
        AND: [{ stock: { gt: 0 } }, { totalReviews: { gt: 0 } }],
      },
      orderBy: [{ totalReviews: "desc" }, { averageRating: "desc" }],
      take: limit,
    });
  }
}
