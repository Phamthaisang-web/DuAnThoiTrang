import usersService from "../services/users.service";
import { httpStatus, sendJsonSuccess } from "../helpers/response.helper";
import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";

// Lấy tất cả người dùng
const getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await usersService.getAllUsers(req.query);
    sendJsonSuccess(res, users);
  } catch (error) {
    next(error);
  }
};

// Lấy người dùng theo ID
const getByID = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const user = await usersService.getByID(id);
    sendJsonSuccess(res, user);
  } catch (error: any) {
    next(error);
  }
};

// Tạo mới user
const create = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await usersService.create(req.body);
    sendJsonSuccess(
      res,
      user,
      httpStatus.CREATED.statusCode,
      httpStatus.CREATED.message
    );
  } catch (error) {
    next(error);
  }
};

const updateMe = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Lấy user đã xác thực từ middleware
    const user = res.locals.staff || (req as any).user;

    if (!user || !user._id) {
      throw createHttpError(401, "Not authenticated");
    }

    // Cập nhật người dùng hiện tại
    const updatedUser = await usersService.update(user._id, req.body);

    sendJsonSuccess(res, updatedUser);
  } catch (error) {
    next(error);
  }
};

// Xóa chính mình
const deleteMe = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user._id;
    const user = await usersService.deleteUser(userId);
    sendJsonSuccess(res, user);
  } catch (error) {
    next(error);
  }
};

// Xóa người khác (admin)
const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const user = await usersService.deleteUser(id);
    sendJsonSuccess(res, user);
  } catch (error) {
    next(error);
  }
};

export default {
  getAllUsers,
  getByID,
  create,
  updateMe,
  deleteMe,

  deleteUser,
};
