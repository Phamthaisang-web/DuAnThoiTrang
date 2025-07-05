"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const promotion_model_1 = __importDefault(require("../models/promotion.model"));
const getAllPromotions = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const { page = 1, limit = 20 } = query;
    //tìm kiếm theo điều kiện
    let where = {};
    // nếu có tìm kiếm theo tên danh mục
    if (query.name && query.name.length > 0) {
        where = Object.assign(Object.assign({}, where), { name: { $regex: query.name, $options: "i" } });
    }
    const promotions = yield promotion_model_1.default
        .find(where)
        .skip((page - 1) * limit)
        .limit(limit)
        .sort({ createAt: 1 });
    //Đếm tổng số record hiện có của collection categories
    const count = yield promotion_model_1.default.countDocuments(where);
    return {
        promotions,
        pagination: {
            totalRecord: count,
            limit,
            page,
        },
    };
});
const getPromotionByCode = (code) => __awaiter(void 0, void 0, void 0, function* () {
    if (!code || typeof code !== "string") {
        throw new Error("Mã giảm giá không hợp lệ");
    }
    const promotion = yield promotion_model_1.default.findOne({
        code: code.toUpperCase().trim(),
    });
    if (!promotion) {
        throw new Error("Không tìm thấy mã giảm giá");
    }
    return promotion;
});
const createPromotion = (promotionData) => __awaiter(void 0, void 0, void 0, function* () {
    // Kiểm tra các trường bắt buộc
    if (!promotionData.code ||
        !promotionData.type ||
        !promotionData.value ||
        !promotionData.expiredAt) {
        throw new Error("Code, type, value, and expiredAt are required");
    }
    // Kiểm tra trùng mã
    const exist = yield promotion_model_1.default.findOne({ code: promotionData.code });
    if (exist) {
        throw new Error("Promotion code already exists");
    }
    // Tạo promotion mới
    const newPromotion = new promotion_model_1.default({
        code: promotionData.code.toUpperCase().trim(),
        type: promotionData.type, // "percent" | "fixed"
        value: promotionData.value,
        maxDiscount: promotionData.maxDiscount || undefined,
        isActive: promotionData.isActive !== undefined ? promotionData.isActive : true,
        expiredAt: new Date(promotionData.expiredAt),
        quantity: promotionData.quantity || null,
    });
    yield newPromotion.save();
    return newPromotion;
});
const applyPromotionCodeForUser = (code) => __awaiter(void 0, void 0, void 0, function* () {
    const formattedCode = code.toUpperCase().trim();
    const promotion = yield promotion_model_1.default.findOneAndUpdate({
        code: formattedCode,
        isActive: true,
        expiredAt: { $gte: new Date() }, // chưa hết hạn
        quantity: { $gt: 0 }, // còn lượt sử dụng
    }, {
        $inc: { quantity: -1 }, // ✅ trừ 1 lượt
    }, { new: true });
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
});
const updatePromotion = (id, promotionData) => __awaiter(void 0, void 0, void 0, function* () {
    const promotion = yield promotion_model_1.default.findById(id);
    if (!promotion) {
        throw new Error("Promotion not found");
    }
    return promotion;
});
const deletePromotion = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const promotion = yield promotion_model_1.default.findByIdAndDelete(id);
    if (!promotion) {
        throw new Error("Promotion not found");
    }
    return promotion;
});
exports.default = {
    getAllPromotions,
    getPromotionByCode,
    createPromotion,
    updatePromotion,
    deletePromotion,
    applyPromotionCodeForUser,
};
//# sourceMappingURL=promotion.service.js.map