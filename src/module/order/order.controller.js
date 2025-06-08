import orderService from "./order.service.js";

class OrderController {
  async createOrder(req, res) {
    try {
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({ message: "User not authenticated." });
      }

      const { perfumeId, quantity, orderMessage } = req.body;

      if (typeof quantity !== "number" || quantity <= 0) {
        return res
          .status(400)
          .json({ message: "Quantity must be a positive number." });
      }

      const order = await orderService.createOrder({
        userId,
        perfumeId,
        quantity,
        orderMessage,
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
      console.error("Error getting all orders:", err);
      res.status(400).json({ message: err.message });
    }
  }

  async getUserOrders(req, res) {
    try {
      const userId = req.user.id;
      if (!userId) {
        return res.status(401).json({ message: "User not authenticated." });
      }
      const orders = await orderService.getOrdersByUserId(userId);
      res.status(200).json(orders);
    } catch (err) {
      console.error("Error getting user orders:", err);
      res.status(400).json({ message: err.message });
    }
  }
}

export default new OrderController();
