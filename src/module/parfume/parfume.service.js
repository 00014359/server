import { PerfumeModel } from "./parfume.model.js";

class PerfumeService {
  #_perfumeModel;

  constructor() {
    this.#_perfumeModel = new PerfumeModel();
  }

  // Create a new perfume
  async createPerfume(payload) {
    return await this.#_perfumeModel.createPerfume(payload);
  }

  // Update an existing perfume
  async updatePerfume(id, payload) {
    return await this.#_perfumeModel.updatePerfume(id, payload);
  }

  // Delete a perfume
  async deletePerfume(id) {
    return await this.#_perfumeModel.deletePerfume(id);
  }

  // Get all perfumes
  async getAllPerfumes(gender) {
    return await this.#_perfumeModel.getAllPerfumes(gender);
  }

  // Get a single perfume by ID
  async getPerfumeById(id) {
    return await this.#_perfumeModel.getPerfumeById(id);
  }

  // Check stock before placing an order
  async checkStock(id, quantity) {
    return await this.#_perfumeModel.checkStock(id, quantity);
  }
}

export default new PerfumeService();
