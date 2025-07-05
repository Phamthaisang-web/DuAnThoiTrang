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
const product_service_1 = __importDefault(require("../services/product.service"));
const response_helper_1 = require("../helpers/response.helper");
const getAllProducts = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const products = yield product_service_1.default.getAllProducts(req.query);
        (0, response_helper_1.sendJsonSuccess)(res, products);
    }
    catch (error) {
        next(error);
    }
});
const getByID = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const product = yield product_service_1.default.getProductById(id);
        (0, response_helper_1.sendJsonSuccess)(res, product);
    }
    catch (error) {
        next(error);
    }
});
const create = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const product = yield product_service_1.default.createProduct(req.body);
        (0, response_helper_1.sendJsonSuccess)(res, product, response_helper_1.httpStatus.CREATED.statusCode, response_helper_1.httpStatus.CREATED.message);
    }
    catch (error) {
        next(error);
    }
});
const update = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const product = yield product_service_1.default.updateProduct(id, req.body);
        (0, response_helper_1.sendJsonSuccess)(res, product);
    }
    catch (error) {
        next(error);
    }
});
const remove = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const product = yield product_service_1.default.deleteProduct(id);
        (0, response_helper_1.sendJsonSuccess)(res, product);
    }
    catch (error) {
        next(error);
    }
});
exports.default = {
    getAllProducts,
    getByID,
    create,
    update,
    remove,
};
//# sourceMappingURL=products.controller.js.map