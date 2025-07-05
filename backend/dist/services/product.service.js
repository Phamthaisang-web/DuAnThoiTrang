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
const product_model_1 = __importDefault(require("../models/product.model"));
const slugify_helper_1 = require("../helpers/slugify.helper");
const mongoose_1 = __importDefault(require("mongoose"));
const getAllProducts = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const { page = 1, limit = 20, sortBy = "createdAt", sortOrder = "desc", minPrice, maxPrice, name, category, brand, // ✅ thêm dòng này để lấy brand từ query
     } = query;
    const where = {};
    // Lọc theo tên sản phẩm
    if ((name === null || name === void 0 ? void 0 : name.length) > 0) {
        where.name = { $regex: name, $options: "i" };
    }
    // ✅ Lọc theo danh mục (1 hoặc nhiều category ID)
    if (category) {
        const categoryArray = typeof category === "string" ? category.split(",") : [category];
        where.category = {
            $in: categoryArray.map((id) => new mongoose_1.default.Types.ObjectId(id)),
        };
    }
    // ✅ Lọc theo thương hiệu (1 hoặc nhiều brand ID)
    if (brand) {
        const brandArray = typeof brand === "string" ? brand.split(",") : [brand];
        where.brand = {
            $in: brandArray.map((id) => new mongoose_1.default.Types.ObjectId(id)),
        };
    }
    // Lọc theo khoảng giá
    if (minPrice || maxPrice) {
        where.price = {};
        if (minPrice)
            where.price.$gte = Number(minPrice);
        if (maxPrice)
            where.price.$lte = Number(maxPrice);
    }
    // Sắp xếp
    const sortDirection = sortOrder === "desc" ? -1 : 1;
    const sort = {};
    sort[sortBy] = sortDirection;
    // Truy vấn dữ liệu
    const products = yield product_model_1.default
        .find(where)
        .populate("category", "name")
        .populate("brand", "name")
        .skip((page - 1) * limit)
        .limit(limit)
        .sort(sort);
    const count = yield product_model_1.default.countDocuments(where);
    return {
        products,
        pagination: {
            totalRecord: count,
            limit: Number(limit),
            page: Number(page),
            totalPages: Math.ceil(count / limit),
            hasNextPage: page < Math.ceil(count / limit),
            hasPrevPage: page > 1,
        },
    };
});
// Lấy chi tiết sản phẩm theo ID
const getProductById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const product = yield product_model_1.default.findById(id);
    if (!product)
        throw new Error("Product not found");
    return product;
});
// Tạo slug duy nhất (có thể loại trừ một ID nếu đang update)
const generateUniqueSlug = (baseSlug, idToExclude) => __awaiter(void 0, void 0, void 0, function* () {
    let slug = baseSlug;
    let counter = 1;
    while (true) {
        const condition = { slug };
        if (idToExclude) {
            condition._id = { $ne: idToExclude };
        }
        const existing = yield product_model_1.default.findOne(condition);
        if (!existing)
            break;
        slug = `${baseSlug}-${counter++}`;
    }
    return slug;
});
// Tạo mới sản phẩm
const createProduct = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const baseSlug = (0, slugify_helper_1.buildSlugify)(payload.name);
    if (!baseSlug)
        throw (0, http_errors_1.default)(400, "Invalid product name to generate slug.");
    const slug = yield generateUniqueSlug(baseSlug);
    console.log("Generated slug: ", slug);
    const product = new product_model_1.default({
        name: payload.name,
        description: payload.description,
        price: payload.price,
        slug,
        stockQuantity: payload.stockQuantity,
        images: payload.images,
        category: Array.isArray(payload.category)
            ? payload.category.map((id) => new mongoose_1.default.Types.ObjectId(id))
            : [new mongoose_1.default.Types.ObjectId(payload.category)],
        brand: payload.brand,
        sizes: payload.sizes, // ✅ thêm dòng này
        colors: payload.colors, // ✅ và dòng này
    });
    try {
        yield product.save();
        return product;
    }
    catch (error) {
        console.error("Error saving product:", error); // 👈 log kỹ hơn ở đây
        if (error.code === 11000 && ((_a = error.keyPattern) === null || _a === void 0 ? void 0 : _a.slug)) {
            throw (0, http_errors_1.default)(400, "Tên sản phẩm đã tồn tại (slug trùng). Vui lòng chọn tên khác.");
        }
        throw (0, http_errors_1.default)(500, "Lỗi khi tạo sản phẩm");
    }
});
// Cập nhật sản phẩm
const updateProduct = (id, productData) => __awaiter(void 0, void 0, void 0, function* () {
    if (productData.category) {
        productData.category = Array.isArray(productData.category)
            ? productData.category.map((id) => new mongoose_1.default.Types.ObjectId(id))
            : [new mongoose_1.default.Types.ObjectId(productData.category)];
    }
    const product = yield product_model_1.default.findById(id);
    if (!product)
        throw (0, http_errors_1.default)(404, "Product not found");
    // Nếu đổi tên -> tạo lại slug mới
    if (productData.name && productData.name !== product.name) {
        const baseSlug = (0, slugify_helper_1.buildSlugify)(productData.name);
        if (!baseSlug) {
            throw (0, http_errors_1.default)(400, "Invalid product name to generate slug.");
        }
        productData.slug = yield generateUniqueSlug(baseSlug, id);
    }
    const updatedProduct = yield product_model_1.default
        .findByIdAndUpdate(id, productData, { new: true })
        .populate("category", "name");
    return updatedProduct;
});
// Xoá sản phẩm
const deleteProduct = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const product = yield product_model_1.default.findByIdAndDelete(id);
    if (!product)
        throw new Error("Product not found");
    return product;
});
exports.default = {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
};
//# sourceMappingURL=product.service.js.map