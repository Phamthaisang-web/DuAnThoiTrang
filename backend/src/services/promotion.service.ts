import promotionModel from "../models/promotion.model";
const getAllPromotions = async (query: any) => {
  const { page = 1, limit = 20 } = query;

  //tìm kiếm theo điều kiện
  let where: any = {};
  // nếu có tìm kiếm theo tên danh mục
  if (query.name && query.name.length > 0) {
    where = { ...where, name: { $regex: query.name, $options: "i" } };
  }

  const promotions = await promotionModel
    .find(where)

    .skip((page - 1) * limit)
    .limit(limit)
    .sort({ createAt: 1 });

  //Đếm tổng số record hiện có của collection categories
  const count = await promotionModel.countDocuments(where);

  return {
    promotions,
    pagination: {
      totalRecord: count,
      limit,
      page,
    },
  };
};
const getPromotionByCode = async (code: string) => {
  if (!code || typeof code !== "string") {
    throw new Error("Mã giảm giá không hợp lệ");
  }

  const promotion = await promotionModel.findOne({
    code: code.toUpperCase().trim(),
  });

  if (!promotion) {
    throw new Error("Không tìm thấy mã giảm giá");
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
    quantity: promotionData.quantity || null,
  });

  await newPromotion.save();
  return newPromotion;
};
const applyPromotionCodeForUser = async (code: string) => {
  const formattedCode = code.toUpperCase().trim();

  const promotion = await promotionModel.findOneAndUpdate(
    {
      code: formattedCode,
      isActive: true,
      expiredAt: { $gte: new Date() }, // chưa hết hạn
      quantity: { $gt: 0 }, // còn lượt sử dụng
    },
    {
      $inc: { quantity: -1 }, // ✅ trừ 1 lượt
    },
    { new: true }
  );

  if (!promotion) {
    throw new Error("Mã giảm giá không hợp lệ hoặc đã hết lượt/hết hạn");
  }

  return {
    code: promotion.code,
    discountValue: promotion.value,
    type: promotion.type,
    maxDiscount: promotion.maxDiscount || null,
    quantityLeft: promotion.quantity,
    expiredAt: promotion.expiredAt,
  };
};

const updatePromotion = async (id: string, promotionData: any) => {
  const promotion = await promotionModel.findById(id);
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
  getPromotionByCode,
  createPromotion,
  updatePromotion,
  deletePromotion,
  applyPromotionCodeForUser,
};
