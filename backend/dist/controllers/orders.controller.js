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
const orders_service_1 = __importDefault(require("../services/orders.service"));
const response_helper_1 = require("../helpers/response.helper");
const http_errors_1 = __importDefault(require("http-errors"));
const getAllOrders = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const orders = yield orders_service_1.default.getAllOrders(req.query);
        (0, response_helper_1.sendJsonSuccess)(res, orders);
    }
    catch (error) {
        next(error);
    }
});
const getMyOrders = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = res.locals.staff;
        const orders = yield orders_service_1.default.getMyOrders(user._id);
        res.status(200).json({ data: { orders } });
    }
    catch (err) {
        next(err);
    }
});
const getByID = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const order = yield orders_service_1.default.getOrderById(req.params.id);
        (0, response_helper_1.sendJsonSuccess)(res, order);
    }
    catch (error) {
        next(error);
    }
});
const create = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Lấy user từ middleware JWT đã lưu
        const user = res.locals.staff;
        if (!user)
            throw (0, http_errors_1.default)(401, "Not authenticated");
        const orderPayload = Object.assign(Object.assign({}, req.body), { user: user._id });
        const result = yield orders_service_1.default.createOrder(orderPayload);
        res.status(response_helper_1.httpStatus.CREATED.statusCode).json({
            message: "Order created successfully",
            data: result,
        });
    }
    catch (error) {
        next(error);
    }
});
const update = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const updatedOrder = yield orders_service_1.default.updateOrder(req.params.id, req.body);
        (0, response_helper_1.sendJsonSuccess)(res, updatedOrder);
    }
    catch (error) {
        next(error);
    }
});
const remove = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const deletedOrder = yield orders_service_1.default.deleteOrder(req.params.id);
        (0, response_helper_1.sendJsonSuccess)(res, deletedOrder);
    }
    catch (error) {
        next(error);
    }
});
const getOrdersByUserId = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const orders = yield orders_service_1.default.getOrdersByUserId(req.params.userId);
        (0, response_helper_1.sendJsonSuccess)(res, orders);
    }
    catch (error) {
        next(error);
    }
});
exports.default = {
    getAllOrders,
    getByID,
    create,
    update,
    remove,
    getOrdersByUserId,
    getMyOrders,
};
//# sourceMappingURL=orders.controller.js.map