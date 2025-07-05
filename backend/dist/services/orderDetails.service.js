"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
const orderDetail_model_1 = __importDefault(require("../models/orderDetail.model"));
const mongoose_1 = require("mongoose");
const getAllOrderDetails = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const { orderId } = query;
    const where = {};
    if (orderId) {
        where.order = orderId;
    }
    const orderDetails = yield orderDetail_model_1.default
        .find(where)
        .populate({
        path: "order",
        select: "_id createdAt status totalAmount",
    })
        .populate({
        path: "product",
        select: "name price",
    })
        .sort({ createdAt: -1 });
    return {
        data: orderDetails,
        total: orderDetails.length,
    };
});
const getOrderDetailById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    if (!mongoose_1.Types.ObjectId.isValid(id)) {
        throw new Error("Invalid order detail ID");
    }
    const orderDetail = yield orderDetail_model_1.default
        .findById(id)
        .populate("order", "user orderDate status totalAmount")
        .populate("product", "name price");
    if (!orderDetail) {
        throw new Error("Order detail not found");
    }
    return orderDetail;
});
const createOrderDetail = (orderDetailData) => __awaiter(void 0, void 0, void 0, function* () {
    const { order, product, quantity } = orderDetailData;
    if (!order || !product || quantity < 1) {
        throw new Error("Order, product, and valid quantity (>=1) are required to create an order detail");
    }
    const newOrderDetail = yield orderDetail_model_1.default.create(orderDetailData);
    const populatedOrderDetail = yield orderDetail_model_1.default
        .findById(newOrderDetail._id)
        .populate("order", "user orderDate status totalAmount")
        .populate("product", "name price");
    return populatedOrderDetail;
});
const updateOrderDetail = (id, orderDetailData) => __awaiter(void 0, void 0, void 0, function* () {
    if (!mongoose_1.Types.ObjectId.isValid(id)) {
        throw new Error("Invalid order detail ID");
    }
    const orderDetail = yield orderDetail_model_1.default
        .findByIdAndUpdate(id, orderDetailData, { new: true })
        .populate("order", "user orderDate status totalAmount")
        .populate("product", "name price");
    if (!orderDetail) {
        throw new Error("Order detail not found");
    }
    return orderDetail;
});
const deleteOrderDetail = (id) => __awaiter(void 0, void 0, void 0, function* () {
    if (!mongoose_1.Types.ObjectId.isValid(id)) {
        throw new Error("Invalid order detail ID");
    }
    const orderDetail = yield orderDetail_model_1.default.findById(id);
    if (!orderDetail) {
        throw new Error("Order detail not found");
    }
    // Cộng lại số lượng về stock
    yield Promise.resolve().then(() => __importStar(require("../models/product.model"))).then((_a) => __awaiter(void 0, [_a], void 0, function* ({ default: productModel }) {
        yield productModel.findByIdAndUpdate(orderDetail.product, {
            $inc: { stockQuantity: orderDetail.quantity },
        });
    }));
    // Xoá chi tiết đơn hàng
    yield orderDetail_model_1.default.findByIdAndDelete(id);
    return orderDetail;
});
exports.default = {
    getAllOrderDetails,
    getOrderDetailById,
    createOrderDetail,
    updateOrderDetail,
    deleteOrderDetail,
};
//# sourceMappingURL=orderDetails.service.js.map