"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const orderDetails_controller_1 = __importDefault(require("../controllers/orderDetails.controller"));
const express_1 = __importDefault(require("express"));
const auth_middleware_1 = require("../middlewares/auth.middleware");
const orderDetails_validation_1 = __importDefault(require("../validations/orderDetails.validation"));
const validate_middleware_1 = __importDefault(require("../middlewares/validate.middleware"));
const router = express_1.default.Router();
router.get("/order-details", auth_middleware_1.authenticateToken, orderDetails_controller_1.default.getAllOrderDetails);
router.get("/order-detail/:id", auth_middleware_1.authenticateToken, orderDetails_controller_1.default.getByID);
router.post("/order-details", auth_middleware_1.authenticateToken, (0, validate_middleware_1.default)(orderDetails_validation_1.default.orderDetailCreateSchema), orderDetails_controller_1.default.create);
router.put("/order-detail/:id", auth_middleware_1.authenticateToken, (0, validate_middleware_1.default)(orderDetails_validation_1.default.orderDetailUpdateSchema), orderDetails_controller_1.default.update);
router.delete("/order-details/:id", auth_middleware_1.authenticateToken, orderDetails_controller_1.default.remove);
exports.default = router;
//# sourceMappingURL=orderDetails.route.js.map