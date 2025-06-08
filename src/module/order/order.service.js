import { OrderModel } from "./order.model.js";

class OrderService {
  #_orderModel;

  constructor() {
    this.#_orderModel = new OrderModel();
  }

  async createOrder(payload) {
    return await this.#_orderModel.createOrder(payload);
  }

  async getAllOrders() {
    return await this.#_orderModel.getAllOrders();
  }

  async getOrdersByUserId(userId) {
    return await this.#_orderModel.getOrdersByUserId(userId);
  }
}

export default new OrderService();
