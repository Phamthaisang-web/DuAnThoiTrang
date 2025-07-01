import usersController from "../controllers/users.controller";
import { authenticateToken } from "../middlewares/auth.middleware";
import validateSchemaYup from "../middlewares/validate.middleware";
import usersValidation from "../validations/users.validation";
import express from "express";

const router = express.Router();

router.get(
  "/users",
  validateSchemaYup(usersValidation.getAllUsersSchema),
  usersController.getAllUsers
);

router.get(
  "/user/:id",
  validateSchemaYup(usersValidation.getUserByIdSchema),
  usersController.getByID
);

router.post(
  "/users",
  validateSchemaYup(usersValidation.createUserSchema),
  usersController.create
);

router.delete(
  "/users/:id",
  validateSchemaYup(usersValidation.deleteUserByIdSchema),
  usersController.deleteUser
);

// ✅ Route cập nhật chính mình
router.put("/users/me", authenticateToken, usersController.updateMe);

// ✅ Route xoá chính mình (nếu có)
router.delete("/users/me", authenticateToken, usersController.deleteMe);

export default router;
