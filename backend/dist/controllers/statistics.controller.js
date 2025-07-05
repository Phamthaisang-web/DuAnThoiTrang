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
exports.getRevenue = exports.getSummaryStats = void 0;
const user_model_1 = __importDefault(require("../models/user.model"));
const order_model_1 = __importDefault(require("../models/order.model"));
const product_model_1 = __importDefault(require("../models/product.model"));
const getSummaryStats = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const users = yield user_model_1.default.countDocuments();
        const orders = yield order_model_1.default.countDocuments();
        const products = yield product_model_1.default.countDocuments();
        const revenueResult = yield order_model_1.default.aggregate([
            { $match: { status: { $in: ["confirmed", "shipped", "delivered"] } } },
            { $group: { _id: null, total: { $sum: "$totalAmount" } } },
        ]);
        const revenue = ((_a = revenueResult[0]) === null || _a === void 0 ? void 0 : _a.total) || 0;
        res.json({
            statusCode: 200,
            message: "Success",
            data: { users, orders, products, revenue },
        });
    }
    catch (err) {
        res
            .status(500)
            .json({ statusCode: 500, message: "Server error", error: err });
    }
});
exports.getSummaryStats = getSummaryStats;
const getRevenue = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const year = parseInt(req.query.year);
        const month = req.query.month
            ? parseInt(req.query.month)
            : undefined;
        const day = req.query.day ? parseInt(req.query.day) : undefined;
        if (!year || year < 2000 || year > 3000) {
            res.status(400).json({ statusCode: 400, message: "Invalid year" });
            return;
        }
        let match = {
            status: { $in: ["confirmed", "shipped", "delivered"] },
        };
        // Theo ngày (giờ)
        if (day && month) {
            const startDate = new Date(year, month - 1, day, 0, 0, 0);
            const endDate = new Date(year, month - 1, day, 23, 59, 59, 999);
            match.createdAt = { $gte: startDate, $lte: endDate };
            const data = yield order_model_1.default.aggregate([
                { $match: match },
                {
                    $group: {
                        _id: { $hour: "$createdAt" },
                        total: { $sum: "$totalAmount" },
                    },
                },
                { $sort: { _id: 1 } },
            ]);
            const fullData = Array.from({ length: 24 }, (_, i) => {
                const found = data.find((d) => d._id === i);
                return { hour: i, total: found ? found.total : 0 };
            });
            res
                .status(200)
                .json({ statusCode: 200, message: "Success", data: fullData });
            return;
        }
        // Theo tháng (ngày)
        if (month) {
            const startDate = new Date(year, month - 1, 1);
            const endDate = new Date(year, month, 0, 23, 59, 59, 999);
            match.createdAt = { $gte: startDate, $lte: endDate };
            const data = yield order_model_1.default.aggregate([
                { $match: match },
                {
                    $group: {
                        _id: { $dayOfMonth: "$createdAt" },
                        total: { $sum: "$totalAmount" },
                    },
                },
                { $sort: { _id: 1 } },
            ]);
            const daysInMonth = new Date(year, month, 0).getDate();
            const fullData = Array.from({ length: daysInMonth }, (_, i) => {
                const found = data.find((d) => d._id === i + 1);
                return { day: i + 1, total: found ? found.total : 0 };
            });
            res
                .status(200)
                .json({ statusCode: 200, message: "Success", data: fullData });
            return;
        }
        // Theo năm (tháng)
        const startDate = new Date(year, 0, 1);
        const endDate = new Date(year, 11, 31, 23, 59, 59, 999);
        match.createdAt = { $gte: startDate, $lte: endDate };
        const data = yield order_model_1.default.aggregate([
            { $match: match },
            {
                $group: {
                    _id: { $month: "$createdAt" },
                    total: { $sum: "$totalAmount" },
                },
            },
            { $sort: { _id: 1 } },
        ]);
        const fullData = Array.from({ length: 12 }, (_, i) => {
            const found = data.find((d) => d._id === i + 1);
            return { month: i + 1, total: found ? found.total : 0 };
        });
        res
            .status(200)
            .json({ statusCode: 200, message: "Success", data: fullData });
    }
    catch (err) {
        res.status(500).json({
            statusCode: 500,
            message: "Server error",
            error: err instanceof Error ? err.message : err,
        });
    }
});
exports.getRevenue = getRevenue;
//# sourceMappingURL=statistics.controller.js.map