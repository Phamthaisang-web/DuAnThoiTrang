import { NextFunction, Request, Response } from "express"; // Thêm dòng này nếu thiếu
import productsService from "../services/product.service";
import { httpStatus, sendJsonSuccess } from "../helpers/response.helper";
const getAllProducts = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const products = await productsService.getAllProducts(req.query);
    sendJsonSuccess(res, products);
  } catch (error: any) {
    next(error);
  }
};
const getByID = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  try {
    const product = await productsService.getProductById(id);
    sendJsonSuccess(res, product);
  } catch (error: any) {
    next(error);
  }
};
const create = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const product = await productsService.createProduct(req.body);
    sendJsonSuccess(
      res,
      product,
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
    const product = await productsService.updateProduct(id, req.body);
    sendJsonSuccess(res, product);
  } catch (error: any) {
    next(error);
  }
};
const remove = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  try {
    const product = await productsService.deleteProduct(id);
    sendJsonSuccess(res, product);
  } catch (error: any) {
    next(error);
  }
};

export default {
  getAllProducts,
  getByID,
  create,
  update,
  remove,
};
