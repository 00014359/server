import { PrismaClient } from "@prisma/client";

export class ReviewModel {
  #_prisma;

  constructor() {
    this.#_prisma = new PrismaClient();
  }

  // Create a new review or update an existing one for the same user and perfume
  async createReview(data) {
    const { userId, perfumeId, rating, comment } = data;

    // Use a transaction to ensure atomicity: review creation/update and perfume stats update
    return await this.#_prisma.$transaction(async (prisma) => {
      // Create or update the review based on userId and perfumeId
      const review = await prisma.review.upsert({
        where: {
          userId_perfumeId: {
            // Unique compound key to prevent duplicate reviews by the same user for the same perfume
            userId,
            perfumeId,
          },
        },
        update: {
          // Data to update if the review already exists
          rating,
          comment,
        },
        create: {
          // Data to create if the review does not exist
          userId,
          perfumeId,
          rating,
          comment,
        },
        include: {
          // Include user details in the returned review object
          user: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });

      // Update the perfume's average rating and total reviews after review creation/update
      await this.#updatePerfumeRatingStats(perfumeId, prisma);

      return review;
    });
  }

  // Get all reviews for a specific perfume, with pagination and sorting
  async getReviewsByPerfumeId(perfumeId, options = {}) {
    const {
      page = 1,
      limit = 10,
      sortBy = "createdAt",
      sortOrder = "desc",
    } = options;
    const skip = (page - 1) * limit; // Calculate number of records to skip for pagination

    const orderBy = {};
    orderBy[sortBy] = sortOrder; // Dynamically set the order by field and direction

    // Fetch reviews and total count concurrently
    const [reviews, total] = await Promise.all([
      this.#_prisma.review.findMany({
        where: { perfumeId }, // Filter reviews by perfume ID
        include: {
          // Include user details for each review
          user: {
            select: {
              id: true,
              name: true,
            },
          },
        },
        orderBy, // Apply sorting
        skip, // Apply pagination skip
        take: limit, // Apply pagination limit
      }),
      this.#_prisma.review.count({
        // Get total count of reviews for the perfume
        where: { perfumeId },
      }),
    ]);

    return {
      reviews,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit), // Calculate total pages
      },
    };
  }

  // Private method to update perfume's average rating and total reviews
  async #updatePerfumeRatingStats(perfumeId, prisma = this.#_prisma) {
    const stats = await this.getPerfumeReviewStats(perfumeId); // Get current review statistics for the perfume

    // Update the perfume record with the new average rating and total reviews
    await prisma.perfume.update({
      where: { id: perfumeId },
      data: {
        averageRating: stats.averageRating,
        totalReviews: stats.totalReviews,
      },
    });
  }

  // Get review statistics (total reviews, average rating, and distribution) for a perfume
  async getPerfumeReviewStats(perfumeId) {
    // Group reviews by rating and count how many reviews for each rating
    const stats = await this.#_prisma.review.groupBy({
      by: ["rating"],
      where: { perfumeId },
      _count: {
        rating: true,
      },
    });

    // Calculate total reviews and weighted sum for average rating
    const totalReviews = stats.reduce(
      (sum, stat) => sum + stat._count.rating,
      0
    );
    const weightedSum = stats.reduce(
      (sum, stat) => sum + stat.rating * stat._count.rating,
      0
    );
    const averageRating = totalReviews > 0 ? weightedSum / totalReviews : 0;

    // Initialize rating distribution map with all possible ratings (0-5) set to 0
    const ratingDistribution = {};
    for (let i = 0; i <= 5; i++) {
      ratingDistribution[i] = 0;
    }

    // Populate rating distribution with actual counts
    stats.forEach((stat) => {
      ratingDistribution[stat.rating] = stat._count.rating;
    });

    return {
      totalReviews,
      averageRating: Math.round(averageRating * 10) / 10, // Round average rating to one decimal place
      ratingDistribution,
    };
  }

  // Get a specific review by user ID and perfume ID
  async getReviewByUserAndPerfume(userId, perfumeId) {
    return await this.#_prisma.review.findUnique({
      where: {
        userId_perfumeId: {
          // Use the unique compound key to find the specific review
          userId,
          perfumeId,
        },
      },
      include: {
        // Include user and perfume details in the returned review
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

  // Delete a review
  async deleteReview(userId, perfumeId) {
    // Use a transaction to ensure atomicity: review deletion and perfume stats update
    return await this.#_prisma.$transaction(async (prisma) => {
      // Delete the review using the unique compound key
      const deletedReview = await prisma.review.delete({
        where: {
          userId_perfumeId: {
            userId,
            perfumeId,
          },
        },
      });

      // Update perfume's rating statistics after review deletion
      await this.#updatePerfumeRatingStats(perfumeId, prisma);

      return deletedReview;
    });
  }
}
