"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const categories_controller_1 = __importDefault(require("../controllers/categories.controller"));
const express_1 = __importDefault(require("express"));
const categories_validation_1 = __importDefault(require("../validations/categories.validation"));
const validate_middleware_1 = __importDefault(require("../middlewares/validate.middleware"));
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = express_1.default.Router();
router.get("/categories", categories_controller_1.default.getAllCategories);
router.get("/categories/:id", categories_controller_1.default.getByID);
router.post("/categories", auth_middleware_1.authenticateToken, (0, validate_middleware_1.default)(categories_validation_1.default.categoryCreateSchema), categories_controller_1.default.create);
router.put("/categories/:id", auth_middleware_1.authenticateToken, (0, validate_middleware_1.default)(categories_validation_1.default.categoryCreateSchema), categories_controller_1.default.update);
router.delete("/categories/:id", auth_middleware_1.authenticateToken, categories_controller_1.default.remove);
exports.default = router;
//# sourceMappingURL=categories.route.js.map