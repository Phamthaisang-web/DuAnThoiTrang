import { NextFunction, Request, Response } from "express"; // Thêm dòng này nếu thiếu
import categoriesService from "../services/categories.service";
import { httpStatus, sendJsonSuccess } from "../helpers/response.helper";

const getAllCategories = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const categories = await categoriesService.getAllCategories(req.query);
    sendJsonSuccess(res, categories);
  } catch (error) {
    next(error);
  }
};
const getByID = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const category = await categoriesService.getCategoryById(req.params.id);
    sendJsonSuccess(res, category);
  } catch (error) {
    next(error);
  }
};
const create = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const newCategory = await categoriesService.createCategory(req.body);
    sendJsonSuccess(res, newCategory);
  } catch (error) {
    next(error);
  }
};
const update = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const updatedCategory = await categoriesService.updateCategory(
      req.params.id,
      req.body
    );
    sendJsonSuccess(res, updatedCategory);
  } catch (error) {
    next(error);
  }
};
const remove = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const deletedCategory = await categoriesService.deleteCategory(
      req.params.id
    );
    sendJsonSuccess(res, deletedCategory);
  } catch (error) {
    next(error);
  }
};
export default {
  getAllCategories,
  getByID,
  create,
  update,
  remove,
};
