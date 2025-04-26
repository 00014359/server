import orderService from "./order.service.js";

class OrderController {
  async createOrder(req, res) {
    try {
      const { customerName, phone, perfumeId } = req.body;
      const order = await orderService.createOrder({
        customerName,
        phone,
        perfumeId,
      });
      res.status(201).json(order);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }

  async getAllOrders(_, res) {
    try {
      const orders = await orderService.getAllOrders();
      res.status(200).json(orders);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }
}

export default new OrderController();
