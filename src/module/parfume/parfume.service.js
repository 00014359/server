import { PerfumeModel } from "./parfume.model.js";

class PerfumeService {
  #_perfumeModel;

  constructor() {
    this.#_perfumeModel = new PerfumeModel();
  }

  // Create a new perfume with validation
  async createPerfume(payload) {
    this.#validatePerfumeData(payload);
    return await this.#_perfumeModel.createPerfume(payload);
  }

  // Update an existing perfume
  async updatePerfume(id, payload) {
    // Check if perfume exists
    const existingPerfume = await this.#_perfumeModel.getPerfumeById(id);
    if (!existingPerfume) {
      throw new Error("Perfume not found");
    }

    // Validate update data
    this.#validatePerfumeData(payload, true);

    return await this.#_perfumeModel.updatePerfume(id, payload);
  }

  // Delete a perfume
  async deletePerfume(id) {
    const existingPerfume = await this.#_perfumeModel.getPerfumeById(id);
    if (!existingPerfume) {
      throw new Error("Perfume not found");
    }

    return await this.#_perfumeModel.deletePerfume(id);
  }

  // Get all perfumes with enhanced filtering
  async getAllPerfumes(filters = {}) {
    return await this.#_perfumeModel.getAllPerfumes(filters);
  }

  // Get a single perfume by ID
  async getPerfumeById(id) {
    return await this.#_perfumeModel.getPerfumeById(id);
  }

  // Check stock before placing an order
  async checkStock(id, quantity) {
    return await this.#_perfumeModel.checkStock(id, quantity);
  }

  // Get similar perfumes
  async getSimilarPerfumes(perfumeId, limit = 5) {
    const perfume = await this.#_perfumeModel.getPerfumeById(perfumeId);
    if (!perfume) {
      throw new Error("Perfume not found");
    }
    return await this.#_perfumeModel.getSimilarPerfumes(perfumeId, limit);
  }

  // Search perfumes with advanced filters
  async searchPerfumes(searchTerm, filters = {}) {
    if (!searchTerm || searchTerm.trim() === "") {
      throw new Error("Search term is required");
    }

    const searchFilters = {
      ...filters,
      search: searchTerm.trim(),
    };

    return await this.#_perfumeModel.getAllPerfumes(searchFilters);
  }

  // Private validation method
  #validatePerfumeData(data, isUpdate = false) {
    const requiredFields = ["name", "brand", "price", "stock", "size"];

    if (!isUpdate) {
      // For create operations, check required fields
      for (const field of requiredFields) {
        if (data[field] === undefined || data[field] === null) {
          throw new Error(`${field} is required`);
        }
      }
    }

    // Validate data types and values
    if (data.price !== undefined) {
      if (typeof data.price !== "number" || data.price < 0) {
        throw new Error("Price must be a positive number");
      }
    }

    if (data.stock !== undefined) {
      if (typeof data.stock !== "number" || data.stock < 0) {
        throw new Error("Stock must be a positive number");
      }
    }

    if (data.size !== undefined) {
      if (typeof data.size !== "number" || data.size <= 0) {
        throw new Error("Size must be a positive number");
      }
    }

    if (data.longevity !== undefined) {
      if (
        typeof data.longevity !== "number" ||
        data.longevity < 1 ||
        data.longevity > 12
      ) {
        throw new Error("Longevity must be between 1 and 12 hours");
      }
    }

    if (data.sillage !== undefined) {
      if (
        typeof data.sillage !== "number" ||
        data.sillage < 1 ||
        data.sillage > 5
      ) {
        throw new Error("Sillage must be between 1 and 5");
      }
    }

    // Validate enum values
    const validGenders = ["MALE", "FEMALE", "UNISEX"];
    if (data.gender && !validGenders.includes(data.gender)) {
      throw new Error("Invalid gender value");
    }

    const validSeasons = [
      "SPRING",
      "SUMMER",
      "AUTUMN",
      "WINTER",
      "ALL_SEASONS",
    ];
    if (data.season && !validSeasons.includes(data.season)) {
      throw new Error("Invalid season value");
    }

    const validOccasions = ["DAILY", "EVENING", "SPECIAL", "WORK", "CASUAL"];
    if (data.occasion && !validOccasions.includes(data.occasion)) {
      throw new Error("Invalid occasion value");
    }

    const validIntensities = ["LIGHT", "MODERATE", "STRONG", "VERY_STRONG"];
    if (data.intensity && !validIntensities.includes(data.intensity)) {
      throw new Error("Invalid intensity value");
    }

    const validFamilies = [
      "FLORAL",
      "ORIENTAL",
      "WOODY",
      "FRESH",
      "CHYPRE",
      "FOUGERE",
      "GOURMAND",
    ];
    if (data.fragranceFamily && !validFamilies.includes(data.fragranceFamily)) {
      throw new Error("Invalid fragrance family value");
    }

    // Validate arrays
    if (data.topNotes && !Array.isArray(data.topNotes)) {
      throw new Error("Top notes must be an array");
    }

    if (data.middleNotes && !Array.isArray(data.middleNotes)) {
      throw new Error("Middle notes must be an array");
    }

    if (data.baseNotes && !Array.isArray(data.baseNotes)) {
      throw new Error("Base notes must be an array");
    }
  }
}

export default new PerfumeService();
