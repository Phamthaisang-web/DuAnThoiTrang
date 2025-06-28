import { NextFunction, Request, Response } from "express"; // Thêm dòng này nếu thiếu
import { httpStatus, sendJsonSuccess } from "../helpers/response.helper";

import paymentService from "../services/payments.service";
const getAllPayments = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const payments = await paymentService.getAllPayments(req.query);
    sendJsonSuccess(res, payments);
  } catch (error: any) {
    next(error);
  }
};
const getByID = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  try {
    const payment = await paymentService.getPaymentById(id);
    sendJsonSuccess(res, payment);
  } catch (error: any) {
    next(error);
  }
};
const create = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const payment = await paymentService.createPayment(req.body);
    sendJsonSuccess(res, payment, httpStatus.CREATED.statusCode, httpStatus.CREATED.message);
  } catch (error: any) {
    next(error);
  }
};
const update = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  try {
    const payment = await paymentService.updatePayment(id, req.body);
    sendJsonSuccess(res, payment);
  } catch (error: any) {
    next(error);
  }
};
const remove = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  try {
    const payment = await paymentService.deletePayment(id);
    sendJsonSuccess(res, payment);
  } catch (error: any) {
    next(error);
  }
};
export default {
  getAllPayments,
  getByID,
  create,
    update,
    remove
};