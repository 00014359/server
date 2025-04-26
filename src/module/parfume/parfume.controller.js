import perfumeService from "./parfume.service.js";

class ParfumeController {
  constructor() {}

  // Create a new perfume
  async createPerfume(req, res) {
    try {
      const { name, brand, description, price, stock, image, size, gender } =
        req.body;

      if (
        typeof price !== "number" ||
        typeof stock !== "number" ||
        typeof size !== "number"
      ) {
        return res
          .status(400)
          .json({ error: "Price, stock, and size must be numbers" });
      }

      console.log(name, brand, description, price, stock, image, size, gender);
      const perfume = await perfumeService.createPerfume({
        name,
        brand,
        description,
        price,
        stock,
        image,
        size,
        gender,
      });
      res.status(201).json(perfume);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  // Get all perfumes
  async getPerfumes(req, res) {
    try {
      const { gender } = req.query;
      const perfumes = await perfumeService.getAllPerfumes(gender);
      const result = perfumes.map((perfume) => {
        return {
          id: perfume.id,
          name: perfume.name,
          brand: perfume.brand,
          price: perfume.price,
          stock: perfume.stock,
          size: perfume.size,
          image: perfume.image,
          gender: perfume.gender,
        };
      });
      res.status(200).json(result);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  // Get a single perfume by ID
  async getPerfumeById(req, res) {
    try {
      const { id } = req.params;
      const perfume = await perfumeService.getPerfumeById(id);
      if (!perfume) {
        return res.status(404).json({ message: "Perfume not found" });
      }
      res.status(200).json(perfume);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  // Update an existing perfume
  async updatePerfume(req, res) {
    try {
      const { id } = req.params;
      const { name, brand, description, price, stock, image, size, gender } =
        req.body;

      if (
        (price && typeof price !== "number") ||
        (stock && typeof stock !== "number") ||
        (size && typeof size !== "number")
      ) {
        return res
          .status(400)
          .json({ error: "Price, stock, and size must be numbers" });
      }

      const updatedPerfume = await perfumeService.updatePerfume(id, {
        name,
        brand,
        description,
        price,
        stock,
        image,
        size,
        gender,
      });

      res.status(200).json(updatedPerfume);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  // Delete a perfume
  async deletePerfume(req, res) {
    try {
      const { id } = req.params;

      await perfumeService.deletePerfume(id);

      res.status(204).end();
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  // Check stock before placing an order
  async checkStock(req, res) {
    try {
      const { id, quantity } = req.params;
      const isAvailable = await perfumeService.checkStock(
        id,
        parseInt(quantity)
      );

      if (isAvailable) {
        res.status(200).json({ message: "Stock is available" });
      } else {
        res.status(400).json({ message: "Not enough stock" });
      }
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
}

export default new ParfumeController();
