import orderDetailsController from "../controllers/orderDetails.controller";
import express from "express";
import { authenticateToken } from "../middlewares/auth.middleware";
import orderDetailsValidation from "../validations/orderDetails.validation";
import validateSchemaYup from "../middlewares/validate.middleware";
const router = express.Router();
router.get(
  "/order-details",
  authenticateToken,
  orderDetailsController.getAllOrderDetails
);
router.get(
  "/order-detail/:id",
  authenticateToken,
  orderDetailsController.getByID
);
router.post(
  "/order-details",
  authenticateToken,
  validateSchemaYup(orderDetailsValidation.orderDetailCreateSchema),
  orderDetailsController.create
);
router.put(
  "/order-detail/:id",
  authenticateToken,
  validateSchemaYup(orderDetailsValidation.orderDetailUpdateSchema),
  orderDetailsController.update
);
router.delete(
  "/order-detail/:id",
  authenticateToken,
  orderDetailsController.remove
);
export default router;
