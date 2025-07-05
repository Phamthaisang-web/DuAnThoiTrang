import brands from "../controllers/brands.controller";
import express from "express";
import brandsValidation from "../validations/brands.validation";
import validateSchemaYup from "../middlewares/validate.middleware";
import { authenticateToken } from "../middlewares/auth.middleware";

const router = express.Router();
router.get("/brands",  brands.getAllBrands);
router.get("/brand/:id",  brands.getByID);
router.post(
  "/brands",
    authenticateToken,
    validateSchemaYup(brandsValidation.brandCreateSchema),
    brands.create
);
router.put(
  "/brands/:id",
    authenticateToken,
    validateSchemaYup(brandsValidation.brandCreateSchema),
    brands.update
);
router.delete("/brands/:id", authenticateToken, brands.remove);
export default router;