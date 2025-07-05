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
const payment_model_1 = __importDefault(require("../models/payment.model"));
const order_model_1 = __importDefault(require("../models/order.model"));
const getAllPayments = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const { page = 1, limit = 20, method, order, status, transferCode } = query;
    const where = {};
    if (method)
        where.method = method;
    if (order)
        where.order = order;
    if (status)
        where.status = status;
    if (transferCode)
        where.transferCode = transferCode;
    const payments = yield payment_model_1.default
        .find(where)
        .skip((page - 1) * limit)
        .limit(limit)
        .sort({ createdAt: -1 })
        .populate("order");
    const count = yield payment_model_1.default.countDocuments(where);
    return {
        payments,
        pagination: {
            totalRecord: count,
            limit: Number(limit),
            page: Number(page),
        },
    };
});
const getPaymentById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const payment = yield payment_model_1.default.findById(id).populate("order");
    if (!payment)
        throw new Error("Không tìm thấy thanh toán");
    return payment;
});
const createPayment = (paymentData) => __awaiter(void 0, void 0, void 0, function* () {
    const { order, amount, method, transferCode } = paymentData;
    if (!order || !amount || amount <= 0 || !method) {
        throw new Error("Thiếu dữ liệu bắt buộc");
    }
    const validMethods = ["bank_transfer", "cash"];
    if (!validMethods.includes(method)) {
        throw new Error("Phương thức thanh toán không hợp lệ");
    }
    // Check đơn hàng tồn tại
    const orderExists = yield order_model_1.default.exists({ _id: order });
    if (!orderExists) {
        throw new Error("Đơn hàng không tồn tại");
    }
    // Nếu chuyển khoản thì phải có mã
    if (method === "bank_transfer" && !transferCode) {
        throw new Error("Chuyển khoản cần mã transferCode");
    }
    // Mặc định trạng thái là pending
    paymentData.status = "pending";
    const newPayment = new payment_model_1.default(paymentData);
    yield newPayment.save();
    return newPayment;
});
const updatePayment = (id, paymentData) => __awaiter(void 0, void 0, void 0, function* () {
    const payment = yield payment_model_1.default.findById(id);
    if (!payment)
        throw new Error("Không tìm thấy thanh toán");
    if (paymentData.method === "bank_transfer" &&
        !paymentData.transferCode &&
        !payment.transferCode) {
        throw new Error("Chuyển khoản cần mã transferCode");
    }
    Object.assign(payment, paymentData);
    yield payment.save();
    return payment;
});
const deletePayment = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const payment = yield payment_model_1.default.findByIdAndDelete(id);
    if (!payment)
        throw new Error("Không tìm thấy thanh toán");
    return payment;
});
exports.default = {
    getAllPayments,
    getPaymentById,
    createPayment,
    updatePayment,
    deletePayment,
};
//# sourceMappingURL=payments.service.js.map