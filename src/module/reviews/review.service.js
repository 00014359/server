import { ReviewModel } from "./review.model.js";

class ReviewService {
  #_reviewModel;

  constructor() {
    this.#_reviewModel = new ReviewModel();
  }

  async createReview(payload) {
    const { userId, perfumeId, rating, comment } = payload;

    this.#validateReviewData({ rating, comment });

    await this.#checkPerfumeExists(perfumeId);

    try {
      const review = await this.#_reviewModel.createReview({
        userId,
        perfumeId,
        rating,
        comment: comment?.trim() || null,
      });

      return review;
    } catch (error) {
      if (error.code === "P2002") {
        throw new Error("You have already reviewed this perfume");
      }
      throw error;
    }
  }

  async getReviewsByPerfumeId(perfumeId, options = {}) {
    await this.#checkPerfumeExists(perfumeId);

    const {
      page = 1,
      limit = 10,
      sortBy = "createdAt",
      sortOrder = "desc",
    } = options;

    if (page < 1 || limit < 1 || limit > 50) {
      throw new Error("Invalid pagination parameters");
    }

    const validSortFields = ["createdAt", "rating"];
    if (!validSortFields.includes(sortBy)) {
      throw new Error("Invalid sort field");
    }

    const validSortOrders = ["asc", "desc"];
    if (!validSortOrders.includes(sortOrder)) {
      throw new Error("Invalid sort order");
    }

    const result = await this.#_reviewModel.getReviewsByPerfumeId(perfumeId, {
      page: parseInt(page),
      limit: parseInt(limit),
      sortBy,
      sortOrder,
    });

    return result;
  }

  #validateReviewData(data) {
    const { rating, comment } = data;

    if (rating === undefined || rating === null) {
      throw new Error("Rating is required");
    }

    if (!Number.isInteger(rating) || rating < 0 || rating > 5) {
      throw new Error("Rating must be an integer between 0 and 5");
    }

    if (comment !== undefined && comment !== null) {
      if (typeof comment !== "string") {
        throw new Error("Comment must be a string");
      }

      if (comment.trim().length > 1000) {
        throw new Error("Comment must be less than 1000 characters");
      }
    }
  }
  async #checkPerfumeExists(perfumeId) {
    const { PrismaClient } = await import("@prisma/client");
    const prisma = new PrismaClient();

    const perfume = await prisma.perfume.findUnique({
      where: { id: perfumeId },
    });

    if (!perfume) {
      throw new Error("Perfume not found");
    }

    return perfume;
  }
}

export default new ReviewService();
