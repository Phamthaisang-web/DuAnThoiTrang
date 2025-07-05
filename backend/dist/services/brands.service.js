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
const http_errors_1 = __importDefault(require("http-errors"));
const brand_model_1 = __importDefault(require("../models/brand.model"));
const slugify_helper_1 = require("../helpers/slugify.helper");
//Get AllCategories level = 1
const getAllBrands = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const { page = 1, limit = 20 } = query;
    //tìm kiếm theo điều kiện
    let where = {};
    // nếu có tìm kiếm theo tên danh mục
    if (query.name && query.name.length > 0) {
        where = Object.assign(Object.assign({}, where), { name: { $regex: query.name, $options: 'i' } });
    }
    if (query.country && query.country.length > 0) {
        where = Object.assign(Object.assign({}, where), { country: { $regex: query.country, $options: 'i' } });
    }
    const brand = yield brand_model_1.default
        .find(where)
        .skip((page - 1) * limit)
        .limit(limit)
        .sort({ createAt: 1 });
    //Đếm tổng số record hiện có của collection categories
    const count = yield brand_model_1.default.countDocuments(where);
    return {
        brand,
        pagination: {
            totalRecord: count,
            limit,
            page
        }
    };
});
const getByID = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const brand = yield brand_model_1.default.findById(id);
    if (!brand) {
        throw new Error("Brand not found");
    }
    return brand;
});
const create = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const exist = yield brand_model_1.default.findOne({ name: payload.name });
    if (exist)
        throw (0, http_errors_1.default)(400, 'Category already exists');
    const slug = (0, slugify_helper_1.buildSlugify)(payload.name);
    const brand = new brand_model_1.default({
        name: payload.name,
        logo: payload.logo, // Thêm trường logo
        country: payload.country,
        slug: slug, // <-- sử dụng slug đã tạo
    });
    yield brand.save();
    return brand;
});
const update = (id, brandData) => __awaiter(void 0, void 0, void 0, function* () {
    if (brandData.name) {
        brandData.slug = (0, slugify_helper_1.buildSlugify)(brandData.name); // Tự động cập nhật slug nếu name thay đổi
    }
    const brand = yield brand_model_1.default.findByIdAndUpdate(id, brandData, { new: true });
    if (!brand) {
        throw new Error("Brand not found");
    }
    return brand;
});
const deleteBrand = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const brand = yield brand_model_1.default.findByIdAndDelete(id);
    if (!brand) {
        throw new Error("Brand not found");
    }
    return brand;
});
exports.default = {
    getAllBrands,
    getByID,
    create,
    update,
    deleteBrand
};
//# sourceMappingURL=brands.service.js.map