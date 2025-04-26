import { OrderModel } from "./order.model.js";

class OrderService {
  #_orderModel;

  constructor() {
    this.#_orderModel = new OrderModel();
  }
  // Create a new order
  async createOrder(payload) {
    return await this.#_orderModel.createOrder(payload);
  }

  // Get all orders
  async getAllOrders() {
    return await this.#_orderModel.getAllOrders();
  }
}

export default new OrderService();
