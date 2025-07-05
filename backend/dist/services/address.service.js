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
const address_model_1 = __importDefault(require("../models/address.model"));
const getAllAddresses = (query, userId) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { page = 1, limit = 10 } = query;
    const where = userId ? { user: userId } : {};
    if ((_a = query.receiverName) === null || _a === void 0 ? void 0 : _a.trim()) {
        where.receiverName = { $regex: query.receiverName.trim(), $options: "i" };
    }
    const addresses = yield address_model_1.default
        .find(where)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit);
    const count = yield address_model_1.default.countDocuments(where);
    return {
        addresses,
        pagination: {
            totalRecord: count,
            limit: Number(limit),
            page: Number(page),
        },
    };
});
const getAddressById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const address = yield address_model_1.default.findById(id);
    if (!address)
        throw (0, http_errors_1.default)(404, "Address not found");
    return address;
});
const createAddress = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    if (payload.isDefault) {
        yield address_model_1.default.updateMany({ user: payload.user }, { isDefault: false });
    }
    const address = new address_model_1.default(payload);
    yield address.save();
    return address;
});
const updateAddress = (id, data) => __awaiter(void 0, void 0, void 0, function* () {
    if (data.isDefault) {
        const found = yield address_model_1.default.findById(id);
        if (found === null || found === void 0 ? void 0 : found.user) {
            yield address_model_1.default.updateMany({ user: found.user }, { isDefault: false });
        }
    }
    const updated = yield address_model_1.default.findByIdAndUpdate(id, data, { new: true });
    if (!updated)
        throw (0, http_errors_1.default)(404, "Address not found");
    return updated;
});
const deleteAddress = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const deleted = yield address_model_1.default.findByIdAndDelete(id);
    if (!deleted)
        throw (0, http_errors_1.default)(404, "Address not found");
    return deleted;
});
exports.default = {
    getAllAddresses,
    getAddressById,
    createAddress,
    updateAddress,
    deleteAddress,
};
//# sourceMappingURL=address.service.js.map