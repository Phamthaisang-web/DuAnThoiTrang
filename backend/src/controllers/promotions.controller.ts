import { NextFunction, Request, Response } from "express"; // Thêm dòng này nếu thiếu
import { httpStatus, sendJsonSuccess } from "../helpers/response.helper";
import promotionService from "../services/promotion.service";
const getAllPromotions = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const promotions = await promotionService.getAllPromotions();
    sendJsonSuccess(res, promotions);
  } catch (error: any) {
    next(error);
  }
};
const getByID = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  try {
    const promotion = await promotionService.getPromotionById(id);
    sendJsonSuccess(res, promotion);
  } catch (error: any) {
    next(error);
  }
};
const create = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const promotion = await promotionService.createPromotion(req.body);
    sendJsonSuccess(res, promotion, httpStatus.CREATED.statusCode, httpStatus.CREATED.message);
  } catch (error: any) {
    next(error);
  }
};
const update = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  try {
    const promotion = await promotionService.updatePromotion(id, req.body);
    sendJsonSuccess(res, promotion);
  } catch (error: any) {
    next(error);
  }
};
const remove = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  try {
    const promotion = await promotionService.deletePromotion(id);
    sendJsonSuccess(res, promotion);
  } catch (error: any) {
    next(error);
  }
};

export default {
  getAllPromotions,
  getByID,
  create,
  update,
  remove,
};