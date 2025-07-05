import express from "express";
import addressController from "../controllers/address.controller";
import validateSchemaYup from "../middlewares/validate.middleware";
import { authenticateToken } from "../middlewares/auth.middleware";
import addressValidation from "../validations/address.validation";

const router = express.Router();

// Lấy tất cả địa chỉ (không yêu cầu xác thực)
router.get("/addresses", authenticateToken, addressController.getAllAddresses);

// Lấy 1 địa chỉ theo ID
router.get("/addresses/:id", addressController.getByID);

// Tạo mới địa chỉ (tuỳ ý dùng xác thực)
router.post(
  "/addresses",
  authenticateToken, // 👉 Bỏ comment nếu cần yêu cầu đăng nhập
  validateSchemaYup(addressValidation.create),
  addressController.create
);

// Cập nhật địa chỉ
router.put(
  "/addresses/:id",
  // authenticateToken,
  validateSchemaYup(addressValidation.update),
  addressController.update
);

// Xoá địa chỉ
router.delete(
  "/addresses/:id",
  // authenticateToken,
  addressController.remove
);

export default router;
