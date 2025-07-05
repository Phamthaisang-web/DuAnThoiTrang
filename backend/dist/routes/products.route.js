"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const products_controller_1 = __importDefault(require("../controllers/products.controller"));
const express_1 = __importDefault(require("express"));
const products_validation_1 = __importDefault(require("../validations/products.validation"));
const validate_middleware_1 = __importDefault(require("../middlewares/validate.middleware"));
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = express_1.default.Router();
// Get all products
router.get("/products", products_controller_1.default.getAllProducts);
// Get product by ID
router.get("/products/:id", products_controller_1.default.getByID);
// Create a new product
router.post("/products", auth_middleware_1.authenticateToken, (0, validate_middleware_1.default)(products_validation_1.default.productCreateSchema), products_controller_1.default.create);
// Update a product
router.put("/products/:id", auth_middleware_1.authenticateToken, (0, validate_middleware_1.default)(products_validation_1.default.productUpdateSchema), products_controller_1.default.update);
// Delete a product
router.delete("/products/:id", auth_middleware_1.authenticateToken, products_controller_1.default.remove);
// Export the router
exports.default = router;
//# sourceMappingURL=products.route.js.map