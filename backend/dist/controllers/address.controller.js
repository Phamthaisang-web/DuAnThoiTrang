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
const address_service_1 = __importDefault(require("../services/address.service"));
const response_helper_1 = require("../helpers/response.helper");
// Lấy tất cả địa chỉ (lọc theo user)
const getAllAddresses = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = res.locals.staff._id;
        const addresses = yield address_service_1.default.getAllAddresses(req.query, userId);
        (0, response_helper_1.sendJsonSuccess)(res, addresses);
    }
    catch (error) {
        next(error);
    }
});
// Lấy 1 địa chỉ theo ID
const getByID = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const address = yield address_service_1.default.getAddressById(req.params.id);
        (0, response_helper_1.sendJsonSuccess)(res, address);
    }
    catch (error) {
        next(error);
    }
});
const create = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const staff = res.locals.staff; // 👈 lấy user từ đây
        const payloadWithUser = Object.assign(Object.assign({}, req.body), { user: staff._id });
        const address = yield address_service_1.default.createAddress(payloadWithUser);
        (0, response_helper_1.sendJsonSuccess)(res, address, response_helper_1.httpStatus.CREATED.statusCode, response_helper_1.httpStatus.CREATED.message);
    }
    catch (error) {
        next(error);
    }
});
// Cập nhật địa chỉ
const update = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const updated = yield address_service_1.default.updateAddress(req.params.id, req.body);
        (0, response_helper_1.sendJsonSuccess)(res, updated);
    }
    catch (error) {
        next(error);
    }
});
// Xóa địa chỉ
const remove = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const deleted = yield address_service_1.default.deleteAddress(req.params.id);
        (0, response_helper_1.sendJsonSuccess)(res, deleted);
    }
    catch (error) {
        next(error);
    }
});
exports.default = {
    getAllAddresses,
    getByID,
    create,
    update,
    remove,
};
//# sourceMappingURL=address.controller.js.map