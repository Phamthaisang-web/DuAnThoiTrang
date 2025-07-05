import promotionsController from "../controllers/promotions.controller";
import express from "express";
import promotionsValidation from "../validations/promotions.validation";
import validateSchemaYup from "../middlewares/validate.middleware";
import { authenticateToken } from "../middlewares/auth.middleware";
const router = express.Router();
router.get("/promotions", promotionsController.getAllPromotions);
router.get("/promotions/:code", promotionsController.getPromotionByCode);
router.post(
  "/promotions",
  authenticateToken,
  validateSchemaYup(promotionsValidation.promotionCreateSchema),
  promotionsController.create
);
router.put("/promotions/code/:code", promotionsController.applyPromotionCode);
router.put(
  "/promotions/:id",
  authenticateToken,
  validateSchemaYup(promotionsValidation.promotionUpdateSchema),
  promotionsController.update
);
router.delete(
  "/promotions/:id",
  authenticateToken,
  promotionsController.remove
);
export default router;
