import usersService from "../services/users.service";
const { httpStatus, sendJsonSuccess } = require("../helpers/response.helper");
import { NextFunction, Request, Response } from "express";
const getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await usersService.getAllUsers(req.query);
    sendJsonSuccess(res, users);
  } catch (error: any) {
    next(error);
  }
};

const getByID = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const user = await usersService.getByID(id);
    sendJsonSuccess(res, user);
  } catch (error: any) {
    res.status(404).json({ message: error.message || "User not found" });
  }
};
const create = async (req: Request, res: Response) => {
  try {
    const user = await usersService.create(req.body);
    sendJsonSuccess(res, user, httpStatus.CREATED.statusCode, httpStatus.CREATED.message);
  } catch (error: any) {
    res.status(500).json({ message: error.message || "Internal server error" });
  }
};
const update = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const user = await usersService.update(id, req.body);
    sendJsonSuccess(res, user);
  } catch (error: any) {
    res.status(404).json({ message: error.message || "User not found" });
  }
};
const deleteUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const user = await usersService.deleteUser(id);
    sendJsonSuccess(res, user);
  } catch (error: any) {
    res.status(404).json({ message: error.message || "User not found" });
  }
};
export default {
  getAllUsers,
  getByID,
  create,
  update,
  deleteUser
};