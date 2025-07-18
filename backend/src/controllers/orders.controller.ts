import { NextFunction, Request, Response } from "express";
import ordersService from "../services/orders.service";
import { httpStatus, sendJsonSuccess } from "../helpers/response.helper";
import createError from "http-errors";

const getAllOrders = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const orders = await ordersService.getAllOrders(req.query);
    sendJsonSuccess(res, orders);
  } catch (error) {
    next(error);
  }
};
const getMyOrders = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = res.locals.staff;
    const orders = await ordersService.getMyOrders(user._id);
    res.status(200).json({ data: { orders } });
  } catch (err) {
    next(err);
  }
};

const getByID = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const order = await ordersService.getOrderById(req.params.id);
    sendJsonSuccess(res, order);
  } catch (error) {
    next(error);
  }
};

const create = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Lấy user từ middleware JWT đã lưu
    const user = res.locals.staff;
    console.log("USER:", user); // debug
    console.log("BODY:", req.body); // debug
    if (!user) throw createError(401, "Not authenticated");
    console.log("Đã nhận body:", req.body);
    console.log("Người dùng từ token:", res.locals.staff);
    const orderPayload = {
      ...req.body,
      user: user._id, // Gán user ID từ token
    };

    const result = await ordersService.createOrder(orderPayload);
    res.status(httpStatus.CREATED.statusCode).json({
      message: "Order created successfully",
      data: result,
    });
  } catch (error) {
    console.error("Lỗi trong controller:", error);
    next(error);
  }
};

const update = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const updatedOrder = await ordersService.updateOrder(
      req.params.id,
      req.body
    );
    sendJsonSuccess(res, updatedOrder);
  } catch (error) {
    next(error);
  }
};

const remove = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const deletedOrder = await ordersService.deleteOrder(req.params.id);
    sendJsonSuccess(res, deletedOrder);
  } catch (error) {
    next(error);
  }
};

const getOrdersByUserId = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const orders = await ordersService.getOrdersByUserId(req.params.userId);
    sendJsonSuccess(res, orders);
  } catch (error) {
    next(error);
  }
};

export default {
  getAllOrders,
  getByID,
  create,
  update,
  remove,
  getOrdersByUserId,
  getMyOrders,
};
