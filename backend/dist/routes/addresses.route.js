"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const address_controller_1 = __importDefault(require("../controllers/address.controller"));
const validate_middleware_1 = __importDefault(require("../middlewares/validate.middleware"));
const auth_middleware_1 = require("../middlewares/auth.middleware");
const address_validation_1 = __importDefault(require("../validations/address.validation"));
const router = express_1.default.Router();
// Lấy tất cả địa chỉ (không yêu cầu xác thực)
router.get("/addresses", auth_middleware_1.authenticateToken, address_controller_1.default.getAllAddresses);
// Lấy 1 địa chỉ theo ID
router.get("/addresses/:id", address_controller_1.default.getByID);
// Tạo mới địa chỉ (tuỳ ý dùng xác thực)
router.post("/addresses", auth_middleware_1.authenticateToken, // 👉 Bỏ comment nếu cần yêu cầu đăng nhập
(0, validate_middleware_1.default)(address_validation_1.default.create), address_controller_1.default.create);
// Cập nhật địa chỉ
router.put("/addresses/:id", 
// authenticateToken,
(0, validate_middleware_1.default)(address_validation_1.default.update), address_controller_1.default.update);
// Xoá địa chỉ
router.delete("/addresses/:id", 
// authenticateToken,
address_controller_1.default.remove);
exports.default = router;
//# sourceMappingURL=addresses.route.js.map