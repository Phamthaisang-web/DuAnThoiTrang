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
const brands_service_1 = __importDefault(require("../services/brands.service"));
const response_helper_1 = require("../helpers/response.helper");
const getAllBrands = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const brands = yield brands_service_1.default.getAllBrands(req.query);
        (0, response_helper_1.sendJsonSuccess)(res, brands);
    }
    catch (error) {
        next(error);
    }
});
const getByID = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const brand = yield brands_service_1.default.getByID(id);
        (0, response_helper_1.sendJsonSuccess)(res, brand);
    }
    catch (error) {
        next(error);
    }
});
const create = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const brand = yield brands_service_1.default.create(req.body);
        (0, response_helper_1.sendJsonSuccess)(res, brand, response_helper_1.httpStatus.CREATED.statusCode, response_helper_1.httpStatus.CREATED.message);
    }
    catch (error) {
        next(error);
    }
});
const update = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const brand = yield brands_service_1.default.update(id, req.body);
        (0, response_helper_1.sendJsonSuccess)(res, brand);
    }
    catch (error) {
        next(error);
    }
});
const remove = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const brand = yield brands_service_1.default.deleteBrand(id);
        (0, response_helper_1.sendJsonSuccess)(res, brand);
    }
    catch (error) {
        next(error);
    }
});
exports.default = {
    getAllBrands,
    getByID,
    create,
    update,
    remove
};
//# sourceMappingURL=brands.controller.js.map