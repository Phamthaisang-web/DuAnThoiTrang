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
const order_model_1 = __importDefault(require("../models/order.model"));
const orderDetail_model_1 = __importDefault(require("../models/orderDetail.model"));
const product_model_1 = __importDefault(require("../models/product.model"));
const promotion_model_1 = __importDefault(require("../models/promotion.model"));
const user_model_1 = __importDefault(require("../models/user.model"));
const address_model_1 = __importDefault(require("../models/address.model"));
const nodemailer_1 = __importDefault(require("nodemailer"));
const env_helper_1 = require("../helpers/env.helper");
// Tạo transporter
const transporter = nodemailer_1.default.createTransport({
    host: env_helper_1.env.EMAIL_HOST,
    port: env_helper_1.env.EMAIL_PORT,
    secure: env_helper_1.env.EMAIL_SSL, // true for 465, false for other ports
    auth: {
        user: env_helper_1.env.EMAIL_ACCOUNT,
        pass: env_helper_1.env.EMAIL_PASSWORD, //mật khẩu ứng dụng
    },
});
const getAllOrders = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const { page = 1, limit = 10, status, userName } = query;
    const where = {};
    if (status) {
        where.status = status;
    }
    if (userName) {
        const users = yield user_model_1.default.find({
            fullName: { $regex: userName, $options: "i" },
        });
        const userIds = users.map((u) => u._id);
        where.user = { $in: userIds };
    }
    const orders = yield order_model_1.default
        .find(where)
        .populate("user", "fullName email")
        .skip((page - 1) * limit)
        .limit(limit)
        .sort({ orderDate: -1 });
    const count = yield order_model_1.default.countDocuments(where);
    return {
        orders,
        pagination: {
            totalRecord: count,
            limit: +limit,
            page: +page,
        },
    };
});
const getOrderById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const order = yield order_model_1.default
        .findById(id)
        .populate("user", "fullName email");
    if (!order)
        throw new Error("Order not found");
    return order;
});
const createOrder = (orderData) => __awaiter(void 0, void 0, void 0, function* () {
    const { user, items, address: addressId, promoCode } = orderData;
    if (!user || !addressId || !items || items.length === 0) {
        throw new Error("User, address and items are required");
    }
    const addressDoc = yield address_model_1.default.findById(addressId);
    if (!addressDoc) {
        throw new Error("Address not found");
    }
    const address = {
        receiverName: addressDoc.receiverName,
        phone: addressDoc.phone,
        addressLine: addressDoc.addressLine,
        city: addressDoc.city,
        district: addressDoc.district,
        ward: addressDoc.ward,
    };
    let totalAmount = 0;
    const orderDetails = [];
    for (const item of items) {
        const product = yield product_model_1.default.findById(item.product);
        if (!product) {
            throw new Error(`Product not found: ${item.product}`);
        }
        if (item.quantity < 1) {
            throw new Error(`Invalid quantity for product: ${product.name}`);
        }
        if (product.stockQuantity < item.quantity) {
            throw new Error(`Not enough stock for product: ${product.name}`);
        }
        const itemTotal = product.price * item.quantity;
        totalAmount += itemTotal;
        orderDetails.push({
            product,
            quantity: item.quantity,
            unitPrice: product.price,
            size: item.size,
            color: item.color,
        });
    }
    let discountValue = 0;
    if (promoCode) {
        const promo = yield promotion_model_1.default.findOne({
            code: promoCode,
            isActive: true,
        });
        if (!promo || (promo.expiredAt && new Date(promo.expiredAt) < new Date())) {
            throw new Error("Invalid or expired promo code");
        }
        discountValue =
            promo.type === "percent"
                ? totalAmount * (promo.value / 100)
                : promo.value;
        if (promo.maxDiscount && discountValue > promo.maxDiscount) {
            discountValue = promo.maxDiscount;
        }
    }
    const finalAmount = Math.max(0, totalAmount - discountValue);
    const newOrder = yield order_model_1.default.create({
        user,
        address,
        totalAmount: finalAmount,
        status: "pending",
    });
    const savedDetails = [];
    for (const detail of orderDetails) {
        const orderDetail = yield orderDetail_model_1.default.create({
            order: newOrder._id,
            product: detail.product._id,
            quantity: detail.quantity,
            unitPrice: detail.unitPrice,
            size: detail.size,
            color: detail.color,
        });
        detail.product.stockQuantity -= detail.quantity;
        yield detail.product.save();
        savedDetails.push(orderDetail);
    }
    const userDoc = yield user_model_1.default.findById(user);
    if (!userDoc || !userDoc.email) {
        throw new Error("Không tìm thấy thông tin người dùng hợp lệ để gửi email");
    }
    if (newOrder) {
        const productListHtml = orderDetails
            .map((item) => `
      <tr>
        <td>${item.product.name}</td>
        <td style="text-align: center;">${item.quantity}</td>
        <td style="text-align: center;">${item.size || "-"}</td>
        <td style="text-align: center;">${item.color || "-"}</td>
        <td style="text-align: right;">${item.unitPrice.toLocaleString()} đ</td>
      </tr>
    `)
            .join("");
        const mailOptions = {
            from: env_helper_1.env.EMAIL_ACCOUNT,
            to: userDoc.email,
            subject: `Xác nhận đơn hàng từ LUXURY FASHION - ${new Date().toLocaleDateString()}`,
            html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <h2>Xin chào ${userDoc.fullName},</h2>

        <p>Cảm ơn bạn đã đặt hàng tại <strong>LUXURY FASHION</strong>! 🎉</p>

        <p>Dưới đây là thông tin đơn hàng của bạn:</p>

        <p><strong>Ngày đặt hàng:</strong> ${new Date().toLocaleString()}</p>

        <table border="1" cellspacing="0" cellpadding="8" width="100%" style="border-collapse: collapse;">
          <thead style="background-color: #f2f2f2;">
            <tr>
              <th>Sản phẩm</th>
              <th>Số lượng</th>
              <th>Kích thước</th>
              <th>Màu sắc</th>
              <th>Đơn giá</th>
            </tr>
          </thead>
          <tbody>
            ${productListHtml}
          </tbody>
        </table>

        <p><strong>Tạm tính:</strong> ${totalAmount.toLocaleString()} đ</p>
        ${discountValue > 0
                ? `<p><strong>Giảm giá:</strong> -${discountValue.toLocaleString()} đ</p>`
                : ""}
        <p><strong>Tổng thanh toán:</strong> ${finalAmount.toLocaleString()} đ</p>


        <p style="margin-top: 30px;">Trân trọng,<br><strong>Đội ngũ LUXURY FASHION</strong></p>

        <hr style="margin-top: 40px;" />
        <p style="font-size: 12px; color: #888;">
          Đây là email tự động. Vui lòng không trả lời email này.
        </p>
      </div>
    `,
        };
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error("Lỗi gửi email:", error);
            }
            else {
                console.log("Đã gửi email xác nhận đơn hàng:", info.response);
            }
        });
    }
    return {
        order: newOrder,
        details: savedDetails,
    };
});
const updateOrder = (id, orderData) => __awaiter(void 0, void 0, void 0, function* () {
    const allowedStatuses = [
        "pending",
        "confirmed",
        "shipped",
        "delivered",
        "cancelled",
        "return_requested",
        "returned",
    ];
    if (!orderData.status || !allowedStatuses.includes(orderData.status)) {
        throw new Error("Trạng thái không hợp lệ");
    }
    const order = yield order_model_1.default.findByIdAndUpdate(id, { status: orderData.status }, {
        new: true,
    });
    if (!order)
        throw new Error("Không tìm thấy đơn hàng");
    return order;
});
const deleteOrder = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const order = yield order_model_1.default.findByIdAndDelete(id);
    if (!order)
        throw new Error("Order not found");
    const details = yield orderDetail_model_1.default.find({ order: id });
    for (const detail of details) {
        yield product_model_1.default.findByIdAndUpdate(detail.product, {
            $inc: { stockQuantity: detail.quantity },
        });
    }
    yield orderDetail_model_1.default.deleteMany({ order: id });
    return order;
});
const getOrdersByUserId = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const orders = yield order_model_1.default
        .find({ user: userId })
        .populate("user", "fullName email phone");
    if (!orders || orders.length === 0) {
        throw new Error("No orders found for this user");
    }
    return orders;
});
const getMyOrders = (userId, status) => __awaiter(void 0, void 0, void 0, function* () {
    // Xây dựng điều kiện tìm kiếm
    const query = { user: userId };
    if (status) {
        query.status = status;
    }
    // Lấy đơn hàng
    const orders = yield order_model_1.default.find(query).sort({ createdAt: -1 }).lean();
    const orderIds = orders.map((o) => o._id);
    // Lấy chi tiết đơn hàng
    const orderDetails = yield orderDetail_model_1.default
        .find({ order: { $in: orderIds } })
        .populate("product", "name")
        .lean();
    const orderMap = new Map();
    for (const detail of orderDetails) {
        const item = {
            product: detail.product._id,
            name: detail.product.name,
            price: detail.unitPrice,
            quantity: detail.quantity,
            size: detail.size,
            color: detail.color,
        };
        const list = orderMap.get(detail.order.toString()) || [];
        list.push(item);
        orderMap.set(detail.order.toString(), list);
    }
    const ordersWithItems = orders.map((order) => (Object.assign(Object.assign({}, order), { items: orderMap.get(order._id.toString()) || [] })));
    return ordersWithItems;
});
exports.default = {
    getAllOrders,
    getOrderById,
    createOrder,
    updateOrder,
    deleteOrder,
    getOrdersByUserId,
    getMyOrders,
};
//# sourceMappingURL=orders.service.js.map