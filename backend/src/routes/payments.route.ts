import paymentsController from "../controllers/payments.controller";
import express from "express";
import paymentsValidation from "../validations/payments.validation";
import validateSchemaYup from "../middlewares/validate.middleware";
import { authenticateToken } from "../middlewares/auth.middleware";
const router = express.Router();
router.get(
  "/payments",
    paymentsController.getAllPayments
);
router.get(
    "/payments/:id",
    
    paymentsController.getByID
);
router.post(
    "/payments",
    authenticateToken,
    validateSchemaYup(paymentsValidation.paymentCreateSchema),
    paymentsController.create
);
router.put(
    "/payment/:id",
    authenticateToken,
    validateSchemaYup(paymentsValidation.paymentUpdateSchema),
    paymentsController.update
);
router.delete(
    "/payments/:id",
    authenticateToken,
    paymentsController.remove
);
router.get(
    "/payments/user/:userId",
    authenticateToken,
    paymentsController.getByID
);
export default router;
