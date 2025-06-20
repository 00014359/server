import reviewService from "./review.service.js";

class ReviewController {
  constructor() {}

  async createReview(req, res) {
    try {
      const userId = req.user.id;
      const { perfumeId } = req.params;
      const { rating, comment } = req.body;

      const perfumeIdInt = parseInt(perfumeId);
      if (isNaN(perfumeIdInt)) {
        return res.status(400).json({ message: "Invalid perfume ID" });
      }

      const review = await reviewService.createReview({
        userId,
        perfumeId: perfumeIdInt,
        rating,
        comment,
      });

      res.status(201).json({
        message: "Review created successfully",
        review,
      });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async getPerfumeReviews(req, res) {
    try {
      const { perfumeId } = req.params;
      const { sortBy = "createdAt", sortOrder = "desc" } = req.query;

      const perfumeIdInt = parseInt(perfumeId);
      if (isNaN(perfumeIdInt)) {
        return res.status(400).json({ message: "Invalid perfume ID" });
      }

      const result = await reviewService.getReviewsByPerfumeId(perfumeIdInt, {
        sortBy,
        sortOrder,
      });

      res.status(200).json({
        message: "Reviews retrieved successfully",
        ...result,
      });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
}

export default new ReviewController();
