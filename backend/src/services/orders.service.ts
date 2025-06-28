import orderModel from "../models/order.model";
import orderDetailModel from "../models/orderDetail.model";
import productModel from "../models/product.model";
import promotionModel from "../models/promotion.model";

const getAllOrders = async () => {
  return await orderModel.find().populate("user").populate("address");
};

const getOrderById = async (id: string) => {
  const order = await orderModel
    .findById(id)
    .populate("user")
    .populate("address");
  if (!order) throw new Error("Order not found");
  return order;
};

const createOrder = async (orderData: any) => {
  const { user, items, address, promoCode } = orderData;

  if (!user || !address || !items || items.length === 0) {
    throw new Error("User, address and items are required");
  }

  let totalAmount = 0;
  const orderDetails = [];

  for (const item of items) {
    const product = await productModel.findById(item.product);
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

  // Áp dụng mã giảm giá
  let discountValue = 0;
  if (promoCode) {
    const promo = await promotionModel.findOne({
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

  const newOrder = await orderModel.create({
    user,
    address,
    totalAmount: finalAmount,
    status: "pending",
  });

  const savedDetails = [];

  for (const detail of orderDetails) {
    const orderDetail = await orderDetailModel.create({
      order: newOrder._id,
      product: detail.product._id,
      quantity: detail.quantity,
      unitPrice: detail.unitPrice,
      size: detail.size,
      color: detail.color,
    });

    detail.product.stockQuantity -= detail.quantity;
    await detail.product.save();

    savedDetails.push(orderDetail);
  }

  return {
    order: newOrder,
    details: savedDetails,
  };
};

const updateOrder = async (id: string, orderData: any) => {
  const order = await orderModel.findByIdAndUpdate(id, orderData, {
    new: true,
  });
  if (!order) throw new Error("Order not found");
  return order;
};

const deleteOrder = async (id: string) => {
  const order = await orderModel.findByIdAndDelete(id);
  if (!order) throw new Error("Order not found");
  return order;
};

const getOrdersByUserId = async (userId: string) => {
  const orders = await orderModel
    .find({ user: userId })
    .populate("user", "fullName email phone")
    .populate("address");

  if (!orders || orders.length === 0) {
    throw new Error("No orders found for this user");
  }
  return orders;
};

export default {
  getAllOrders,
  getOrderById,
  createOrder,
  updateOrder,
  deleteOrder,
  getOrdersByUserId,
};
