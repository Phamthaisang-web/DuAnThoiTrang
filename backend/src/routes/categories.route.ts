import categoriesController from "../controllers/categories.controller";
import express from "express";
import categoriesValidation from "../validations/categories.validation";
import validateSchemaYup from "../middlewares/validate.middleware";
import { authenticateToken } from "../middlewares/auth.middleware";
const router = express.Router();
router.get("/categories", categoriesController.getAllCategories);
router.get("/categories/:id", categoriesController.getByID);
router.post(
  "/categories",
  authenticateToken,
  validateSchemaYup(categoriesValidation.categoryCreateSchema),
  categoriesController.create
);
router.put(
  "/categories/:id",
  authenticateToken,
  validateSchemaYup(categoriesValidation.categoryCreateSchema),
  categoriesController.update
);
router.delete("/categories/:id", authenticateToken, categoriesController.remove);
export default router;