import ordersController from "../controllers/orders.controller";
import express from "express";
import ordersValidation from "../validations/orders.validation";
import validateSchemaYup from "../middlewares/validate.middleware";
import { authenticateToken } from "../middlewares/auth.middleware";
const router = express.Router();
router.get("/orders", authenticateToken, ordersController.getAllOrders);
router.get("/order/:id", authenticateToken, ordersController.getByID);
router.post(
  "/orders",
  authenticateToken,
  validateSchemaYup(ordersValidation.orderCreateSchema),
  ordersController.create
);
router.put(
  "/order/:id",
  authenticateToken,
  validateSchemaYup(ordersValidation.orderUpdateSchema),
  ordersController.update
);
router.delete("/order/:id", authenticateToken, ordersController.remove);
router.get(
  "/orders/user/:userId",
  authenticateToken,
  ordersController.getOrdersByUserId
);
export default router;
