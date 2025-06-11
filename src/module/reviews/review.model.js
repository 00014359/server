import { PrismaClient } from "@prisma/client";

export class ReviewModel {
  #_prisma;

  constructor() {
    this.#_prisma = new PrismaClient();
  }

  async createReview(data) {
    const { userId, perfumeId, rating, comment } = data;

    return await this.#_prisma.$transaction(async (prisma) => {
      const review = await prisma.review.upsert({
        where: {
          userId_perfumeId: {
            userId,
            perfumeId,
          },
        },
        update: {
          rating,
          comment,
        },
        create: {
          userId,
          perfumeId,
          rating,
          comment,
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });

      await this.#updatePerfumeRatingStats(perfumeId, prisma);

      return review;
    });
  }

  async getReviewsByPerfumeId(perfumeId, options = {}) {
    const { sortBy = "createdAt", sortOrder = "desc" } = options;

    const orderBy = {};
    orderBy[sortBy] = sortOrder;

    const reviews = await this.#_prisma.review.findMany({
      where: { perfumeId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy,
    });

    return {
      reviews,
    };
  }

  async #updatePerfumeRatingStats(perfumeId, prisma = this.#_prisma) {
    const stats = await this.getPerfumeReviewStats(perfumeId);

    await prisma.perfume.update({
      where: { id: perfumeId },
      data: {
        averageRating: stats.averageRating,
        totalReviews: stats.totalReviews,
      },
    });
  }

  async getPerfumeReviewStats(perfumeId) {
    const stats = await this.#_prisma.review.groupBy({
      by: ["rating"],
      where: { perfumeId },
      _count: {
        rating: true,
      },
    });

    const totalReviews = stats.reduce(
      (sum, stat) => sum + stat._count.rating,
      0
    );
    const weightedSum = stats.reduce(
      (sum, stat) => sum + stat.rating * stat._count.rating,
      0
    );
    const averageRating = totalReviews > 0 ? weightedSum / totalReviews : 0;

    const ratingDistribution = {};
    for (let i = 0; i <= 5; i++) {
      ratingDistribution[i] = 0;
    }

    stats.forEach((stat) => {
      ratingDistribution[stat.rating] = stat._count.rating;
    });

    return {
      totalReviews,
      averageRating: Math.round(averageRating * 10) / 10,
      ratingDistribution,
    };
  }

  async getReviewByUserAndPerfume(userId, perfumeId) {
    return await this.#_prisma.review.findUnique({
      where: {
        userId_perfumeId: {
          userId,
          perfumeId,
        },
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
          },
        },
        perfume: {
          select: {
            id: true,
            name: true,
            brand: true,
          },
        },
      },
    });
  }

  async deleteReview(userId, perfumeId) {
    return await this.#_prisma.$transaction(async (prisma) => {
      const deletedReview = await prisma.review.delete({
        where: {
          userId_perfumeId: {
            userId,
            perfumeId,
          },
        },
      });

      await this.#updatePerfumeRatingStats(perfumeId, prisma);

      return deletedReview;
    });
  }
}
