import { NextFunction, Request, Response } from "express"; // Thêm dòng này nếu thiếu
import { httpStatus, sendJsonSuccess } from "../helpers/response.helper";
import orderDetailsService from "../services/orderDetails.service";
import { nextTick } from "process";
const getAllOrderDetails = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const orderDetails = await orderDetailsService.getAllOrderDetails();
    sendJsonSuccess(res, orderDetails);
  } catch (error: any) {
    next(error);
  }
};
const getByID = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  try {
    const orderDetail = await orderDetailsService.getOrderDetailById(id);
    sendJsonSuccess(res, orderDetail);
  } catch (error: any) {
    next(error);
  }
};
const create = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const orderDetail = await orderDetailsService.createOrderDetail(req.body);
    sendJsonSuccess(
      res,
      orderDetail,
      httpStatus.CREATED.statusCode,
      httpStatus.CREATED.message
    );
  } catch (error: any) {
    next(error);
  }
};
const update = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  try {
    const orderDetail = await orderDetailsService.updateOrderDetail(
      id,
      req.body
    );
    sendJsonSuccess(res, orderDetail);
  } catch (error: any) {
    next(error);
  }
};
const remove = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  try {
    const orderDetail = await orderDetailsService.deleteOrderDetail(id);
    sendJsonSuccess(res, orderDetail);
  } catch (error: any) {
    next(error);
  }
};
export default {
  getAllOrderDetails,
  getByID,
  create,
  update,
  remove,
};
