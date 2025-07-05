import productsController from "../controllers/products.controller";
import express from "express";
import productsValidation from "../validations/products.validation";
import validateSchemaYup from "../middlewares/validate.middleware";
import { authenticateToken } from "../middlewares/auth.middleware";
const router = express.Router();
// Get all products
router.get("/products", productsController.getAllProducts);
// Get product by ID
router.get(
  "/products/:id",
  
  productsController.getByID
);
// Create a new product
router.post(
  "/products",
  authenticateToken,
  validateSchemaYup(productsValidation.productCreateSchema),
  productsController.create
);
// Update a product
router.put(
  "/products/:id",
  authenticateToken,
  validateSchemaYup(productsValidation.productUpdateSchema),
  productsController.update
);
// Delete a product
router.delete(
  "/products/:id",
  authenticateToken,
  productsController.remove
);
// Export the router
export default router;
