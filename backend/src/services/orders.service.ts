import orderModel from "../models/order.model";
import orderDetailModel from "../models/orderDetail.model";
import productModel from "../models/product.model";
import promotionModel from "../models/promotion.model";
import userModel from "../models/user.model";
import addressModel from "../models/address.model";

const getAllOrders = async (query: any) => {
  const { page = 1, limit = 10, status, userName } = query;
  const where: any = {};

  if (status) {
    where.status = status;
  }

  if (userName) {
    const users = await userModel.find({
      fullName: { $regex: userName, $options: "i" },
    });
    const userIds = users.map((u) => u._id);
    where.user = { $in: userIds };
  }

  const orders = await orderModel
    .find(where)
    .populate("user", "fullName email")
    .skip((page - 1) * limit)
    .limit(limit)
    .sort({ orderDate: -1 });

  const count = await orderModel.countDocuments(where);

  return {
    orders,
    pagination: {
      totalRecord: count,
      limit: +limit,
      page: +page,
    },
  };
};

const getOrderById = async (id: string) => {
  const order = await orderModel
    .findById(id)
    .populate("user", "fullName email");
  if (!order) throw new Error("Order not found");
  return order;
};

const createOrder = async (orderData: any) => {
  const { user, items, address: addressId, promoCode } = orderData;

  if (!user || !addressId || !items || items.length === 0) {
    throw new Error("User, address and items are required");
  }

  const addressDoc = await addressModel.findById(addressId);
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
  const allowedStatuses = [
    "pending",
    "confirmed",
    "shipped",
    "delivered",
    "cancelled",
  ];

  if (!orderData.status || !allowedStatuses.includes(orderData.status)) {
    throw new Error("Trạng thái không hợp lệ");
  }

  const order = await orderModel.findByIdAndUpdate(
    id,
    { status: orderData.status },
    {
      new: true,
    }
  );

  if (!order) throw new Error("Không tìm thấy đơn hàng");

  return order;
};
const deleteOrder = async (id: string) => {
  const order = await orderModel.findByIdAndDelete(id);
  if (!order) throw new Error("Order not found");

  const details = await orderDetailModel.find({ order: id });

  for (const detail of details) {
    await productModel.findByIdAndUpdate(detail.product, {
      $inc: { stockQuantity: detail.quantity },
    });
  }

  await orderDetailModel.deleteMany({ order: id });

  return order;
};

const getOrdersByUserId = async (userId: string) => {
  const orders = await orderModel
    .find({ user: userId })
    .populate("user", "fullName email phone");

  if (!orders || orders.length === 0) {
    throw new Error("No orders found for this user");
  }
  return orders;
};
const getMyOrders = async (userId: string, status?: string) => {
  // Xây dựng điều kiện tìm kiếm
  const query: any = { user: userId };
  if (status) {
    query.status = status;
  }

  // Lấy đơn hàng
  const orders = await orderModel.find(query).sort({ createdAt: -1 }).lean();

  const orderIds = orders.map((o) => o._id);

  // Lấy chi tiết đơn hàng
  const orderDetails = await orderDetailModel
    .find({ order: { $in: orderIds } })
    .populate("product", "name")
    .lean();

  type PopulatedProduct = {
    _id: string;
    name: string;
  };

  type PopulatedDetail = (typeof orderDetails)[0] & {
    product: PopulatedProduct;
  };

  const orderMap = new Map<string, any[]>();

  for (const detail of orderDetails as PopulatedDetail[]) {
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

  const ordersWithItems = orders.map((order) => ({
    ...order,
    items: orderMap.get(order._id.toString()) || [],
  }));

  return ordersWithItems;
};

export default {
  getAllOrders,
  getOrderById,
  createOrder,
  updateOrder,
  deleteOrder,
  getOrdersByUserId,
  getMyOrders,
};
