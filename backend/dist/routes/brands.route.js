"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const brands_controller_1 = __importDefault(require("../controllers/brands.controller"));
const express_1 = __importDefault(require("express"));
const brands_validation_1 = __importDefault(require("../validations/brands.validation"));
const validate_middleware_1 = __importDefault(require("../middlewares/validate.middleware"));
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = express_1.default.Router();
router.get("/brands", brands_controller_1.default.getAllBrands);
router.get("/brand/:id", brands_controller_1.default.getByID);
router.post("/brands", auth_middleware_1.authenticateToken, (0, validate_middleware_1.default)(brands_validation_1.default.brandCreateSchema), brands_controller_1.default.create);
router.put("/brands/:id", auth_middleware_1.authenticateToken, (0, validate_middleware_1.default)(brands_validation_1.default.brandCreateSchema), brands_controller_1.default.update);
router.delete("/brands/:id", auth_middleware_1.authenticateToken, brands_controller_1.default.remove);
exports.default = router;
//# sourceMappingURL=brands.route.js.map