import { Request, Response, NextFunction } from "express";
import addressService from "../services/address.service";
import { sendJsonSuccess, httpStatus } from "../helpers/response.helper";

// Lấy tất cả địa chỉ (lọc theo user)
const getAllAddresses = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = res.locals.staff._id;

    const addresses = await addressService.getAllAddresses(req.query, userId);
    sendJsonSuccess(res, addresses);
  } catch (error) {
    next(error);
  }
};

// Lấy 1 địa chỉ theo ID
const getByID = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const address = await addressService.getAddressById(req.params.id);
    sendJsonSuccess(res, address);
  } catch (error) {
    next(error);
  }
};
const create = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const staff = res.locals.staff; // 👈 lấy user từ đây
    const payloadWithUser = {
      ...req.body,
      user: staff._id, // 👈 gán user vào address
    };

    const address = await addressService.createAddress(payloadWithUser);

    sendJsonSuccess(
      res,
      address,
      httpStatus.CREATED.statusCode,
      httpStatus.CREATED.message
    );
  } catch (error) {
    next(error);
  }
};

// Cập nhật địa chỉ
const update = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const updated = await addressService.updateAddress(req.params.id, req.body);
    sendJsonSuccess(res, updated);
  } catch (error) {
    next(error);
  }
};

// Xóa địa chỉ
const remove = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const deleted = await addressService.deleteAddress(req.params.id);
    sendJsonSuccess(res, deleted);
  } catch (error) {
    next(error);
  }
};

export default {
  getAllAddresses,
  getByID,
  create,
  update,
  remove,
};
