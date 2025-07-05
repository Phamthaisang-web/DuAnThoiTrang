"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const promotions_controller_1 = __importDefault(require("../controllers/promotions.controller"));
const express_1 = __importDefault(require("express"));
const promotions_validation_1 = __importDefault(require("../validations/promotions.validation"));
const validate_middleware_1 = __importDefault(require("../middlewares/validate.middleware"));
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = express_1.default.Router();
router.get("/promotions", promotions_controller_1.default.getAllPromotions);
router.get("/promotions/:code", promotions_controller_1.default.getPromotionByCode);
router.post("/promotions", auth_middleware_1.authenticateToken, (0, validate_middleware_1.default)(promotions_validation_1.default.promotionCreateSchema), promotions_controller_1.default.create);
router.put("/promotions/code/:code", promotions_controller_1.default.applyPromotionCode);
router.put("/promotions/:id", auth_middleware_1.authenticateToken, (0, validate_middleware_1.default)(promotions_validation_1.default.promotionUpdateSchema), promotions_controller_1.default.update);
router.delete("/promotions/:id", auth_middleware_1.authenticateToken, promotions_controller_1.default.remove);
exports.default = router;
//# sourceMappingURL=promotion.route.js.map