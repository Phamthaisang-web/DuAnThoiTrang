import orderDetailModel from "../models/orderDetail.model";
import { Types } from "mongoose";

// Interface tùy chọn để type an toàn hơn
interface OrderDetailInput {
  order: string; // ObjectId dưới dạng string
  product: string; // ObjectId dưới dạng string
  quantity: number;
  unitPrice?: number;
  size?: "XS" | "S" | "M" | "L" | "XL";
  color?: string;
}
const getAllOrderDetails = async (query: any) => {
  const { orderId } = query;

  const where: any = {};
  if (orderId) {
    where.order = orderId;
  }

  const orderDetails = await orderDetailModel
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
};

const getOrderDetailById = async (id: string) => {
  if (!Types.ObjectId.isValid(id)) {
    throw new Error("Invalid order detail ID");
  }

  const orderDetail = await orderDetailModel
    .findById(id)
    .populate("order", "user orderDate status totalAmount")
    .populate("product", "name price");

  if (!orderDetail) {
    throw new Error("Order detail not found");
  }
  return orderDetail;
};

const createOrderDetail = async (orderDetailData: OrderDetailInput) => {
  const { order, product, quantity } = orderDetailData;

  if (!order || !product || quantity < 1) {
    throw new Error(
      "Order, product, and valid quantity (>=1) are required to create an order detail"
    );
  }

  const newOrderDetail = await orderDetailModel.create(orderDetailData);

  const populatedOrderDetail = await orderDetailModel
    .findById(newOrderDetail._id)
    .populate("order", "user orderDate status totalAmount")
    .populate("product", "name price");

  return populatedOrderDetail;
};

const updateOrderDetail = async (
  id: string,
  orderDetailData: Partial<OrderDetailInput>
) => {
  if (!Types.ObjectId.isValid(id)) {
    throw new Error("Invalid order detail ID");
  }

  const orderDetail = await orderDetailModel
    .findByIdAndUpdate(id, orderDetailData, { new: true })
    .populate("order", "user orderDate status totalAmount")
    .populate("product", "name price");

  if (!orderDetail) {
    throw new Error("Order detail not found");
  }

  return orderDetail;
};
const deleteOrderDetail = async (id: string) => {
  if (!Types.ObjectId.isValid(id)) {
    throw new Error("Invalid order detail ID");
  }

  const orderDetail = await orderDetailModel.findById(id);
  if (!orderDetail) {
    throw new Error("Order detail not found");
  }

  // Cộng lại số lượng về stock
  await import("../models/product.model").then(
    async ({ default: productModel }) => {
      await productModel.findByIdAndUpdate(orderDetail.product, {
        $inc: { stockQuantity: orderDetail.quantity },
      });
    }
  );

  // Xoá chi tiết đơn hàng
  await orderDetailModel.findByIdAndDelete(id);

  return orderDetail;
};

export default {
  getAllOrderDetails,
  getOrderDetailById,
  createOrderDetail,
  updateOrderDetail,
  deleteOrderDetail,
};
