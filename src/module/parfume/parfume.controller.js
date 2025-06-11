import perfumeService from "./parfume.service.js";
import preferencesService from "../preferences/preferences.service.js";
import reviewService from "../reviews/review.service.js";

class ParfumeController {
  constructor() {}

  async createPerfume(req, res) {
    try {
      const {
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
      } = req.body;

      if (
        typeof price !== "number" ||
        typeof stock !== "number" ||
        typeof size !== "number"
      ) {
        return res
          .status(400)
          .json({ error: "Price, stock, and size must be numbers" });
      }

      const perfume = await perfumeService.createPerfume({
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
      });

      res.status(201).json(perfume);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async getPerfumes(req, res) {
    try {
      const {
        gender,
        search,
        minPrice,
        maxPrice,
        season,
        occasion,
        intensity,
        fragranceFamily,
        sortBy,
        sortOrder,
        minRating,
        page = 1, // Default page to 1
        pageSize = 10, // Default page size to 10
      } = req.query;

      const parsedMinPrice =
        minPrice !== undefined ? parseFloat(minPrice) : undefined;
      const parsedMaxPrice =
        maxPrice !== undefined ? parseFloat(maxPrice) : undefined;
      const parsedMinRating =
        minRating !== undefined ? parseFloat(minRating) : undefined;
      const parsedPage = parseInt(page);
      const parsedPageSize = parseInt(pageSize);

      if (
        (minPrice !== undefined && isNaN(parsedMinPrice)) ||
        (maxPrice !== undefined && isNaN(parsedMaxPrice)) ||
        (minRating !== undefined && isNaN(parsedMinRating)) ||
        isNaN(parsedPage) ||
        isNaN(parsedPageSize) ||
        parsedPage < 1 ||
        parsedPageSize < 1
      ) {
        return res.status(400).json({
          message:
            "Invalid parameters. minPrice, maxPrice, minRating, page, and pageSize must be valid numbers.",
        });
      }

      const filters = {
        gender,
        search,
        minPrice: parsedMinPrice,
        maxPrice: parsedMaxPrice,
        season,
        occasion,
        intensity,
        fragranceFamily,
        sortBy,
        sortOrder,
        minRating: parsedMinRating,
        page: parsedPage,
        pageSize: parsedPageSize,
      };

      const { perfumes, totalCount } = await perfumeService.getAllPerfumes(
        filters
      );

      const result = perfumes.map((perfume) => ({
        id: perfume.id,
        name: perfume.name,
        brand: perfume.brand,
        price: perfume.price,
        stock: perfume.stock,
        description: perfume.description,
        size: perfume.size,
        image: perfume.image,
        gender: perfume.gender,
        season: perfume.season,
        occasion: perfume.occasion,
        intensity: perfume.intensity,
        fragranceFamily: perfume.fragranceFamily,
        topNotes: perfume.topNotes,
        middleNotes: perfume.middleNotes,
        baseNotes: perfume.baseNotes,
        longevity: perfume.longevity,
        sillage: perfume.sillage,
        averageRating: perfume.averageRating,
        totalReviews: perfume.totalReviews,
      }));

      res.status(200).json({
        perfumes: result,
        totalCount,
        currentPage: parsedPage,
        totalPages: Math.ceil(totalCount / parsedPageSize),
      });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async getForYouPage(req, res) {
    try {
      const userId = req.user.id;
      const { limit = 20, page = 1, pageSize = 10 } = req.query; // Add page and pageSize

      const parsedLimit = parseInt(limit);
      const parsedPage = parseInt(page);
      const parsedPageSize = parseInt(pageSize);

      if (
        isNaN(parsedPage) ||
        isNaN(parsedPageSize) ||
        parsedPage < 1 ||
        parsedPageSize < 1
      ) {
        return res.status(400).json({
          message:
            "Invalid pagination parameters. page and pageSize must be valid numbers.",
        });
      }

      const hasCompletedQuiz = await preferencesService.hasUserCompletedQuiz(
        userId
      );

      if (!hasCompletedQuiz) {
        return res.status(200).json({
          message:
            "Complete your preference quiz to get personalized recommendations",
          hasCompletedQuiz: false,
          perfumes: [],
          quizUrl: "/api/preferences/quiz",
          totalCount: 0,
          currentPage: 1,
          totalPages: 1,
        });
      }

      const { recommendations, totalCount } =
        await preferencesService.getEnhancedRecommendations(
          userId,
          parsedLimit,
          parsedPage,
          parsedPageSize
        );

      const result = recommendations.map((perfume) => ({
        id: perfume.id,
        name: perfume.name,
        brand: perfume.brand,
        price: perfume.price,
        stock: perfume.stock,
        description: perfume.description,
        size: perfume.size,
        image: perfume.image,
        gender: perfume.gender,
        season: perfume.season,
        occasion: perfume.occasion,
        intensity: perfume.intensity,
        fragranceFamily: perfume.fragranceFamily,
        topNotes: perfume.topNotes,
        middleNotes: perfume.middleNotes,
        baseNotes: perfume.baseNotes,
        longevity: perfume.longevity,
        sillage: perfume.sillage,
        averageRating: perfume.averageRating,
        totalReviews: perfume.totalReviews,
      }));

      res.status(200).json({
        message: "Personalized recommendations based on your preferences",
        hasCompletedQuiz: true,
        perfumes: result,
        totalCount: totalCount,
        currentPage: parsedPage,
        totalPages: Math.ceil(totalCount / parsedPageSize),
      });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async getPerfumeById(req, res) {
    try {
      const { id } = req.params;
      const perfumeId = parseInt(id);

      if (isNaN(perfumeId)) {
        return res.status(400).json({ message: "Invalid perfume ID" });
      }

      const perfume = await perfumeService.getPerfumeById(perfumeId);
      if (!perfume) {
        return res.status(404).json({ message: "Perfume not found" });
      }

      const result = perfume;

      res.status(200).json(result);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async updatePerfume(req, res) {
    try {
      const { id } = req.params;
      const perfumeId = parseInt(id);

      if (isNaN(perfumeId)) {
        return res.status(400).json({ message: "Invalid perfume ID" });
      }

      const {
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
      } = req.body;

      if (
        (price && typeof price !== "number") ||
        (stock && typeof stock !== "number") ||
        (size && typeof size !== "number") ||
        (longevity && typeof longevity !== "number") ||
        (sillage && typeof sillage !== "number")
      ) {
        return res.status(400).json({
          error: "Price, stock, size, longevity, and sillage must be numbers",
        });
      }

      const updatedPerfume = await perfumeService.updatePerfume(perfumeId, {
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
      });

      res.status(200).json(updatedPerfume);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async deletePerfume(req, res) {
    try {
      const { id } = req.params;
      const perfumeId = parseInt(id);

      if (isNaN(perfumeId)) {
        return res.status(400).json({ message: "Invalid perfume ID" });
      }

      await perfumeService.deletePerfume(perfumeId);
      res.status(204).end();
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async checkStock(req, res) {
    try {
      const { id, quantity } = req.params;
      const perfumeId = parseInt(id);
      const qty = parseInt(quantity);

      if (isNaN(perfumeId) || isNaN(qty)) {
        return res.status(400).json({ message: "Invalid ID or quantity" });
      }

      const isAvailable = await perfumeService.checkStock(perfumeId, qty);

      if (isAvailable) {
        res.status(200).json({ message: "Stock is available" });
      } else {
        res.status(400).json({ message: "Not enough stock" });
      }
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async getSimilarPerfumes(req, res) {
    try {
      const { id } = req.params;
      const { limit = 5 } = req.query;
      const perfumeId = parseInt(id);

      if (isNaN(perfumeId)) {
        return res.status(400).json({ message: "Invalid perfume ID" });
      }

      const similar = await perfumeService.getSimilarPerfumes(
        perfumeId,
        parseInt(limit)
      );

      res.status(200).json({
        message: "Similar perfumes",
        count: similar.length,
        perfumes: similar,
      });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
}

export default new ParfumeController();
