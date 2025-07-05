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
exports.applyPromotionCode = void 0;
const response_helper_1 = require("../helpers/response.helper");
const promotion_service_1 = __importDefault(require("../services/promotion.service"));
const getAllPromotions = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const promotions = yield promotion_service_1.default.getAllPromotions(req.query);
        (0, response_helper_1.sendJsonSuccess)(res, promotions);
    }
    catch (error) {
        next(error);
    }
});
const getPromotionByCode = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const code = req.params.code;
    try {
        const promotion = yield promotion_service_1.default.getPromotionByCode(code);
        (0, response_helper_1.sendJsonSuccess)(res, promotion);
    }
    catch (error) {
        next(error);
    }
});
const applyPromotionCode = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const code = req.params.code;
        const result = yield promotion_service_1.default.applyPromotionCodeForUser(code);
        res.json({ data: result });
    }
    catch (error) {
        next(error);
    }
});
exports.applyPromotionCode = applyPromotionCode;
const create = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const promotion = yield promotion_service_1.default.createPromotion(req.body);
        (0, response_helper_1.sendJsonSuccess)(res, promotion, response_helper_1.httpStatus.CREATED.statusCode, response_helper_1.httpStatus.CREATED.message);
    }
    catch (error) {
        next(error);
    }
});
const update = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const promotion = yield promotion_service_1.default.updatePromotion(id, req.body);
        (0, response_helper_1.sendJsonSuccess)(res, promotion);
    }
    catch (error) {
        next(error);
    }
});
const remove = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const promotion = yield promotion_service_1.default.deletePromotion(id);
        (0, response_helper_1.sendJsonSuccess)(res, promotion);
    }
    catch (error) {
        next(error);
    }
});
exports.default = {
    getAllPromotions,
    getPromotionByCode,
    create,
    update,
    remove,
    applyPromotionCode: exports.applyPromotionCode,
};
//# sourceMappingURL=promotions.controller.js.map