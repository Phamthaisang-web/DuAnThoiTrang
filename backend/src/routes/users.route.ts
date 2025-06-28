import usersController from "../controllers/users.controller";
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

router.put(
  "/users/:id",
  validateSchemaYup(usersValidation.updateUserSchema),
  usersController.update
);

router.delete(
  "/users/:id",
  validateSchemaYup(usersValidation.deleteUserByIdSchema),
  usersController.deleteUser
);

export default router;
