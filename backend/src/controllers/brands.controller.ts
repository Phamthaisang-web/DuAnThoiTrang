import brandsService from "../services/brands.service";
import { httpStatus, sendJsonSuccess } from "../helpers/response.helper";
const getAllBrands = async (req: any, res: any, next: any) => {
  try {
    const brands = await brandsService.getAllBrands(req.query);
    sendJsonSuccess(res, brands);
  } catch (error: any) {
    next(error);
  }
}
const getByID = async (req: any, res: any, next: any) => {
  const { id } = req.params;
  try {
    const brand = await brandsService.getByID(id);
    sendJsonSuccess(res, brand);
  } catch (error: any) {
    next(error);
  }
}
const create = async (req: any, res: any, next: any) => {
  try {
    const brand = await brandsService.create(req.body);
    sendJsonSuccess(res, brand, httpStatus.CREATED.statusCode, httpStatus.CREATED.message);
  } catch (error: any) {
    next(error);
  }
}
const update = async (req: any, res: any, next: any) => {
  const { id } = req.params;
  try {
    const brand = await brandsService.update(id, req.body);
    sendJsonSuccess(res, brand);
  } catch (error: any) {
    next(error);
  }
}
const remove = async (req: any, res: any, next: any) => {
  const { id } = req.params;
  try {
    const brand = await brandsService.deleteBrand(id);
    sendJsonSuccess(res, brand);
  } catch (error: any) {
    next(error);
  }
}

export default {
  getAllBrands,
  getByID,
  create,
  update,
  remove
};