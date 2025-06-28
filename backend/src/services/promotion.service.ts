import promotionModel from "../models/promotion.model";
const getAllPromotions = async () => {
  const promotions = await promotionModel.find();
  return promotions;
};
const getPromotionById = async (id: string) => {
  const promotion = await promotionModel.findById(id);
  if (!promotion) {
    throw new Error("Promotion not found");
  }
  return promotion;
};
const createPromotion = async (promotionData: any) => {
  // Kiểm tra các trường bắt buộc
  if (
    !promotionData.code ||
    !promotionData.type ||
    !promotionData.value ||
    !promotionData.expiredAt
  ) {
    throw new Error("Code, type, value, and expiredAt are required");
  }

  // Kiểm tra trùng mã
  const exist = await promotionModel.findOne({ code: promotionData.code });
  if (exist) {
    throw new Error("Promotion code already exists");
  }

  // Tạo promotion mới
  const newPromotion = new promotionModel({
    code: promotionData.code.toUpperCase().trim(),
    type: promotionData.type, // "percent" | "fixed"
    value: promotionData.value,
    maxDiscount: promotionData.maxDiscount || undefined,
    isActive:
      promotionData.isActive !== undefined ? promotionData.isActive : true,
    expiredAt: new Date(promotionData.expiredAt),
  });

  await newPromotion.save();
  return newPromotion;
};
const updatePromotion = async (id: string, promotionData: any) => {
  const promotion = await promotionModel.findByIdAndUpdate(id, promotionData, {
    new: true,
  });
  if (!promotion) {
    throw new Error("Promotion not found");
  }
  return promotion;
};
const deletePromotion = async (id: string) => {
  const promotion = await promotionModel.findByIdAndDelete(id);
  if (!promotion) {
    throw new Error("Promotion not found");
  }
  return promotion;
};

export default {
  getAllPromotions,
  getPromotionById,
  createPromotion,
  updatePromotion,
  deletePromotion,
};
