import { PreferencesModel } from "./preferences.model.js";

class PreferencesService {
  #_preferencesModel;

  constructor() {
    this.#_preferencesModel = new PreferencesModel();
  }

  // Save user preferences from quiz
  async saveUserPreferences(userId, preferences) {
    // Validate preferences data
    this.#validatePreferences(preferences);

    return await this.#_preferencesModel.saveUserPreferences(
      userId,
      preferences
    );
  }

  // Get user preferences
  async getUserPreferences(userId) {
    return await this.#_preferencesModel.getUserPreferences(userId);
  }

  // Update user preferences
  async updateUserPreferences(userId, updates) {
    // Check if preferences exist
    const existingPreferences =
      await this.#_preferencesModel.getUserPreferences(userId);
    if (!existingPreferences) {
      throw new Error(
        "User preferences not found. Please complete the quiz first."
      );
    }

    // Validate update data
    if (updates.preferredGender || updates.intensityPreference) {
      this.#validateSingleChoiceFields(updates);
    }

    if (
      updates.favoriteSeasons ||
      updates.preferredOccasions ||
      updates.fragranceFamilies
    ) {
      this.#validateMultipleChoiceFields(updates);
    }

    return await this.#_preferencesModel.updateUserPreferences(userId, updates);
  }

  // Get personalized recommendations
  async getPersonalizedRecommendations(
    userId,
    limit = 10,
    page = 1,
    pageSize = 10
  ) {
    const hasCompletedQuiz = await this.#_preferencesModel.hasUserCompletedQuiz(
      userId
    );
    if (!hasCompletedQuiz) {
      throw new Error(
        "Please complete the preference quiz first to get personalized recommendations."
      );
    }

    return await this.#_preferencesModel.getPersonalizedRecommendations(
      userId,
      limit,
      page,
      pageSize
    );
  }

  // Get enhanced recommendations based on user's order history
  async getEnhancedRecommendations(
    userId,
    limit = 10,
    page = 1,
    pageSize = 10
  ) {
    const allBaseRecommendations =
      await this.#_preferencesModel.getPersonalizedRecommendations(
        userId,
        limit // This limit determines the pool of recommendations to enhance
      );

    const orderHistory = await this.#_preferencesModel.getUserOrderHistory(
      userId
    );

    let finalRecommendations = allBaseRecommendations;

    // If user has order history, enhance recommendations
    if (orderHistory.length > 0) {
      const purchasedBrands = [
        ...new Set(orderHistory.map((order) => order.perfume.brand)),
      ];
      const purchasedFamilies = [
        ...new Set(orderHistory.map((order) => order.perfume.fragranceFamily)),
      ];

      // Score recommendations based on past purchases
      const scoredRecommendations = allBaseRecommendations.map((perfume) => {
        let score = 0;

        // Boost score for familiar brands
        if (purchasedBrands.includes(perfume.brand)) {
          score += 10;
        }

        // Boost score for familiar fragrance families
        if (purchasedFamilies.includes(perfume.fragranceFamily)) {
          score += 5;
        }

        // Consider price range (prefer similar price points)
        if (orderHistory.length > 0) {
          const avgPurchasePrice =
            orderHistory.reduce((sum, order) => sum + order.perfume.price, 0) /
            orderHistory.length;
          const priceDiff = Math.abs(perfume.price - avgPurchasePrice);
          if (priceDiff <= avgPurchasePrice * 0.3) {
            // Within 30% of average
            score += 3;
          }
        }

        return { ...perfume, recommendationScore: score };
      });

      finalRecommendations = scoredRecommendations
        .sort((a, b) => b.recommendationScore - a.recommendationScore)
        .map(({ recommendationScore, ...perfume }) => perfume);
    }

    const totalCount = finalRecommendations.length;
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedRecommendations = finalRecommendations.slice(
      startIndex,
      endIndex
    );

    return { recommendations: paginatedRecommendations, totalCount };
  }

  // Check if user has completed quiz
  async hasUserCompletedQuiz(userId) {
    return await this.#_preferencesModel.hasUserCompletedQuiz(userId);
  }

  // Private validation methods
  #validatePreferences(preferences) {
    const requiredFields = [
      "preferredGender",
      "favoriteSeasons",
      "preferredOccasions",
      "intensityPreference",
      "fragranceFamilies",
    ];

    for (const field of requiredFields) {
      if (!preferences[field]) {
        throw new Error(`${field} is required`);
      }
    }

    this.#validateSingleChoiceFields(preferences);
    this.#validateMultipleChoiceFields(preferences);
  }

  #validateSingleChoiceFields(data) {
    const validGenders = ["MALE", "FEMALE", "UNISEX"];
    const validIntensities = ["LIGHT", "MODERATE", "STRONG", "VERY_STRONG"];

    if (data.preferredGender && !validGenders.includes(data.preferredGender)) {
      throw new Error("Invalid gender preference");
    }

    if (
      data.intensityPreference &&
      !validIntensities.includes(data.intensityPreference)
    ) {
      throw new Error("Invalid intensity preference");
    }
  }

  #validateMultipleChoiceFields(data) {
    const validSeasons = [
      "SPRING",
      "SUMMER",
      "AUTUMN",
      "WINTER",
      "ALL_SEASONS",
    ];
    const validOccasions = ["DAILY", "EVENING", "SPECIAL", "WORK", "CASUAL"];
    const validFamilies = [
      "FLORAL",
      "ORIENTAL",
      "WOODY",
      "FRESH",
      "CHYPRE",
      "FOUGERE",
      "GOURMAND",
    ];

    if (data.favoriteSeasons) {
      const seasons = Array.isArray(data.favoriteSeasons)
        ? data.favoriteSeasons
        : [data.favoriteSeasons];
      if (!seasons.every((season) => validSeasons.includes(season))) {
        throw new Error("Invalid season preference");
      }
    }

    if (data.preferredOccasions) {
      const occasions = Array.isArray(data.preferredOccasions)
        ? data.preferredOccasions
        : [data.preferredOccasions];
      if (!occasions.every((occasion) => validOccasions.includes(occasion))) {
        throw new Error("Invalid occasion preference");
      }
    }

    if (data.fragranceFamilies) {
      const families = Array.isArray(data.fragranceFamilies)
        ? data.fragranceFamilies
        : [data.fragranceFamilies];
      if (!families.every((family) => validFamilies.includes(family))) {
        throw new Error("Invalid fragrance family preference");
      }
    }
  }
}

export default new PreferencesService();
