import preferencesService from "./preferences.service.js";

class PreferencesController {
  constructor() {}

  // Get quiz questions
  async getQuizQuestions(req, res) {
    try {
      const questions = [
        {
          id: 1,
          question: "Which gender perfumes do you prefer?",
          type: "single",
          options: [
            { value: "MALE", label: "Masculine scents" },
            { value: "FEMALE", label: "Feminine scents" },
            { value: "UNISEX", label: "Unisex scents" },
          ],
        },
        {
          id: 2,
          question:
            "Which seasons do you want perfumes for? (Select all that apply)",
          type: "multiple",
          options: [
            { value: "SPRING", label: "Spring - Fresh and floral" },
            { value: "SUMMER", label: "Summer - Light and refreshing" },
            { value: "AUTUMN", label: "Autumn - Warm and cozy" },
            { value: "WINTER", label: "Winter - Rich and intense" },
            { value: "ALL_SEASONS", label: "All seasons - Versatile scents" },
          ],
        },
        {
          id: 3,
          question:
            "For which occasions do you mainly wear perfume? (Select all that apply)",
          type: "multiple",
          options: [
            { value: "DAILY", label: "Daily wear" },
            { value: "EVENING", label: "Evening events" },
            { value: "SPECIAL", label: "Special occasions" },
            { value: "WORK", label: "Work/Professional settings" },
            { value: "CASUAL", label: "Casual outings" },
          ],
        },
        {
          id: 4,
          question: "What intensity of fragrance do you prefer?",
          type: "single",
          options: [
            { value: "LIGHT", label: "Light - Subtle and close to skin" },
            {
              value: "MODERATE",
              label: "Moderate - Noticeable but not overwhelming",
            },
            { value: "STRONG", label: "Strong - Bold and long-lasting" },
            { value: "VERY_STRONG", label: "Very Strong - Maximum projection" },
          ],
        },
        {
          id: 5,
          question:
            "Which fragrance families appeal to you? (Select all that apply)",
          type: "multiple",
          options: [
            { value: "FLORAL", label: "Floral - Rose, jasmine, lily" },
            { value: "ORIENTAL", label: "Oriental - Spicy, warm, exotic" },
            { value: "WOODY", label: "Woody - Sandalwood, cedar, oak" },
            { value: "FRESH", label: "Fresh - Citrus, aquatic, green" },
            { value: "CHYPRE", label: "Chypre - Mossy, sophisticated" },
            { value: "FOUGERE", label: "Fougère - Lavender, aromatic herbs" },
            { value: "GOURMAND", label: "Gourmand - Sweet, edible notes" },
          ],
        },
      ];

      res.status(200).json(questions);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  // Submit quiz answers and save user preferences
  async submitQuiz(req, res) {
    try {
      const userId = req.user.id; // From auth middleware
      const { answers } = req.body;

      if (!answers || Object.keys(answers).length === 0) {
        return res.status(400).json({ message: "Quiz answers are required" });
      }

      // Validate answers structure
      const requiredQuestions = [1, 2, 3, 4, 5];
      for (const questionId of requiredQuestions) {
        if (!answers[questionId]) {
          return res.status(400).json({
            message: `Answer for question ${questionId} is required`,
          });
        }
      }

      const preferences = {
        preferredGender: answers[1],
        favoriteSeasons: Array.isArray(answers[2]) ? answers[2] : [answers[2]],
        preferredOccasions: Array.isArray(answers[3])
          ? answers[3]
          : [answers[3]],
        intensityPreference: answers[4],
        fragranceFamilies: Array.isArray(answers[5])
          ? answers[5]
          : [answers[5]],
      };

      const savedPreferences = await preferencesService.saveUserPreferences(
        userId,
        preferences
      );

      res.status(201).json({
        message: "Preferences saved successfully",
        preferences: savedPreferences,
      });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  // Get user preferences
  async getUserPreferences(req, res) {
    try {
      const userId = req.user.id;

      const preferences = await preferencesService.getUserPreferences(userId);

      if (!preferences) {
        return res.status(404).json({ message: "User preferences not found" });
      }

      res.status(200).json(preferences);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  // Update user preferences
  async updatePreferences(req, res) {
    try {
      const userId = req.user.id;
      const updates = req.body;

      const updatedPreferences = await preferencesService.updateUserPreferences(
        userId,
        updates
      );

      res.status(200).json({
        message: "Preferences updated successfully",
        preferences: updatedPreferences,
      });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  // Get personalized perfume recommendations
  async getRecommendations(req, res) {
    try {
      const userId = req.user.id;
      const { limit = 10 } = req.query;

      const recommendations =
        await preferencesService.getPersonalizedRecommendations(
          userId,
          parseInt(limit)
        );

      res.status(200).json(recommendations);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
}

export default new PreferencesController();
