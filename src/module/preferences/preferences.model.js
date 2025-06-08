import { PrismaClient } from "@prisma/client";

export class PreferencesModel {
  #_prisma;

  constructor() {
    this.#_prisma = new PrismaClient();
  }

  // Save or update user preferences
  async saveUserPreferences(userId, preferences) {
    return await this.#_prisma.userPreferences.upsert({
      where: { userId },
      update: {
        preferredGender: preferences.preferredGender,
        favoriteSeasons: preferences.favoriteSeasons,
        preferredOccasions: preferences.preferredOccasions,
        intensityPreference: preferences.intensityPreference,
        fragranceFamilies: preferences.fragranceFamilies,
        updatedAt: new Date(),
      },
      create: {
        userId,
        preferredGender: preferences.preferredGender,
        favoriteSeasons: preferences.favoriteSeasons,
        preferredOccasions: preferences.preferredOccasions,
        intensityPreference: preferences.intensityPreference,
        fragranceFamilies: preferences.fragranceFamilies,
      },
      include: {
        user: {
          select: { id: true, name: true, email: true },
        },
      },
    });
  }

  // Get user preferences
  async getUserPreferences(userId) {
    return await this.#_prisma.userPreferences.findUnique({
      where: { userId },
      include: {
        user: {
          select: { id: true, name: true, email: true },
        },
      },
    });
  }

  // Update user preferences
  async updateUserPreferences(userId, updates) {
    return await this.#_prisma.userPreferences.update({
      where: { userId },
      data: {
        ...updates,
        updatedAt: new Date(),
      },
      include: {
        user: {
          select: { id: true, name: true, email: true },
        },
      },
    });
  }

  // Get personalized perfume recommendations based on user preferences
  async getPersonalizedRecommendations(userId, limit = 10) {
    const userPreferences = await this.getUserPreferences(userId);

    if (!userPreferences) {
      throw new Error(
        "User preferences not found. Please complete the quiz first."
      );
    }

    // Create filters based on user preferences
    const filters = {
      AND: [
        {
          OR: [
            { gender: userPreferences.preferredGender },
            { gender: "UNISEX" },
          ],
        },
        {
          OR: userPreferences.favoriteSeasons.map((season) => ({ season })),
        },
        {
          OR: userPreferences.preferredOccasions.map((occasion) => ({
            occasion,
          })),
        },
        { intensity: userPreferences.intensityPreference },
        {
          OR: userPreferences.fragranceFamilies.map((family) => ({
            fragranceFamily: family,
          })),
        },
        { stock: { gt: 0 } }, // Only show perfumes in stock
      ],
    };

    // Get recommended perfumes
    const recommendedPerfumes = await this.#_prisma.perfume.findMany({
      where: filters,
      take: limit,
      orderBy: [{ createdAt: "desc" }, { price: "asc" }],
    });

    if (recommendedPerfumes.length < limit) {
      const relaxedFilters = {
        AND: [
          {
            OR: [
              { gender: userPreferences.preferredGender },
              { gender: "UNISEX" },
            ],
          },
          {
            OR: userPreferences.fragranceFamilies.map((family) => ({
              fragranceFamily: family,
            })),
          },
          { stock: { gt: 0 } },
          {
            NOT: {
              id: { in: recommendedPerfumes.map((p) => p.id) },
            },
          },
        ],
      };

      const additionalPerfumes = await this.#_prisma.perfume.findMany({
        where: relaxedFilters,
        take: limit - recommendedPerfumes.length,
        orderBy: [{ createdAt: "desc" }, { price: "asc" }],
      });

      recommendedPerfumes.push(...additionalPerfumes);
    }

    return recommendedPerfumes;
  }

  // Get user's order history for better recommendations
  async getUserOrderHistory(userId) {
    return await this.#_prisma.order.findMany({
      where: { userId },
      include: {
        perfume: true,
      },
      orderBy: { createdAt: "desc" },
    });
  }

  // Check if user has completed the preference quiz
  async hasUserCompletedQuiz(userId) {
    const preferences = await this.#_prisma.userPreferences.findUnique({
      where: { userId },
    });
    return !!preferences;
  }
}
