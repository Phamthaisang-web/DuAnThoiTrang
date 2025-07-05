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
const category_model_1 = __importDefault(require("../models/category.model"));
const slugify_helper_1 = require("../helpers/slugify.helper");
//Get AllCategories level = 1
const getAllCategories = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const { page = 1, limit = 20 } = query;
    //tìm kiếm theo điều kiện
    let where = {};
    // nếu có tìm kiếm theo tên danh mục
    if (query.name && query.name.length > 0) {
        where = Object.assign(Object.assign({}, where), { name: { $regex: query.name, $options: 'i' } });
    }
    const categories = yield category_model_1.default
        .find(where)
        .populate("parent", "name")
        .skip((page - 1) * limit)
        .limit(limit)
        .sort({ createAt: 1 });
    //Đếm tổng số record hiện có của collection categories
    const count = yield category_model_1.default.countDocuments(where);
    return {
        categories,
        pagination: {
            totalRecord: count,
            limit,
            page
        }
    };
});
const getCategoryById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const category = yield category_model_1.default.findById(id).populate("parent", "name");
    if (!category) {
        throw new Error("Category not found");
    }
    return category;
});
const createCategory = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const exist = yield category_model_1.default.findOne({ name: payload.name });
    if (exist)
        throw (0, http_errors_1.default)(400, 'Category already exists');
    const slug = (0, slugify_helper_1.buildSlugify)(payload.name); // <-- tạo slug từ name
    const category = new category_model_1.default({
        name: payload.name,
        description: payload.description,
        parent: payload.parent || null,
        slug: slug, // <-- sử dụng slug đã tạo
    });
    yield category.save();
    return category;
});
const updateCategory = (id, categoryData) => __awaiter(void 0, void 0, void 0, function* () {
    if (categoryData.name) {
        categoryData.slug = (0, slugify_helper_1.buildSlugify)(categoryData.name); // Tự động cập nhật slug nếu name thay đổi
    }
    const category = yield category_model_1.default
        .findByIdAndUpdate(id, categoryData, { new: true })
        .populate("parent", "name");
    if (!category) {
        throw new Error("Category not found");
    }
    return category;
});
const deleteCategory = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const category = yield category_model_1.default.findByIdAndDelete(id);
    if (!category) {
        throw new Error("Category not found");
    }
    return category;
});
exports.default = {
    getAllCategories,
    getCategoryById,
    createCategory,
    updateCategory,
    deleteCategory,
};
//# sourceMappingURL=categories.service.js.map