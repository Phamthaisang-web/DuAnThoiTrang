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
const categories_service_1 = __importDefault(require("../services/categories.service"));
const response_helper_1 = require("../helpers/response.helper");
const getAllCategories = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const categories = yield categories_service_1.default.getAllCategories(req.query);
        (0, response_helper_1.sendJsonSuccess)(res, categories);
    }
    catch (error) {
        next(error);
    }
});
const getByID = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const category = yield categories_service_1.default.getCategoryById(req.params.id);
        (0, response_helper_1.sendJsonSuccess)(res, category);
    }
    catch (error) {
        next(error);
    }
});
const create = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const newCategory = yield categories_service_1.default.createCategory(req.body);
        (0, response_helper_1.sendJsonSuccess)(res, newCategory);
    }
    catch (error) {
        next(error);
    }
});
const update = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const updatedCategory = yield categories_service_1.default.updateCategory(req.params.id, req.body);
        (0, response_helper_1.sendJsonSuccess)(res, updatedCategory);
    }
    catch (error) {
        next(error);
    }
});
const remove = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const deletedCategory = yield categories_service_1.default.deleteCategory(req.params.id);
        (0, response_helper_1.sendJsonSuccess)(res, deletedCategory);
    }
    catch (error) {
        next(error);
    }
});
exports.default = {
    getAllCategories,
    getByID,
    create,
    update,
    remove,
};
//# sourceMappingURL=categories.controller.js.map