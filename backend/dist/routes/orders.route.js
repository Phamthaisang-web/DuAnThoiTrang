"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const orders_controller_1 = __importDefault(require("../controllers/orders.controller"));
const express_1 = __importDefault(require("express"));
const orders_validation_1 = __importDefault(require("../validations/orders.validation"));
const validate_middleware_1 = __importDefault(require("../middlewares/validate.middleware"));
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = express_1.default.Router();
router.get("/orders", auth_middleware_1.authenticateToken, orders_controller_1.default.getAllOrders);
router.get("/orders/me", auth_middleware_1.authenticateToken, orders_controller_1.default.getMyOrders);
router.get("/orders/:id", auth_middleware_1.authenticateToken, orders_controller_1.default.getByID);
router.post("/orders", auth_middleware_1.authenticateToken, (0, validate_middleware_1.default)(orders_validation_1.default.orderCreateSchema), orders_controller_1.default.create);
router.put("/orders/:id", auth_middleware_1.authenticateToken, (0, validate_middleware_1.default)(orders_validation_1.default.orderUpdateSchema), orders_controller_1.default.update);
router.delete("/orders/:id", auth_middleware_1.authenticateToken, orders_controller_1.default.remove);
router.get("/orders/user/:userId", auth_middleware_1.authenticateToken, orders_controller_1.default.getOrdersByUserId);
exports.default = router;
//# sourceMappingURL=orders.route.js.map