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

const getAllOrderDetails = async () => {
  const orderDetails = await orderDetailModel
    .find()
    .populate("order", "user orderDate status totalAmount")
    .populate("product", "name price");
  return orderDetails;
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

  const orderDetail = await orderDetailModel.findByIdAndDelete(id);

  if (!orderDetail) {
    throw new Error("Order detail not found");
  }

  return orderDetail;
};

export default {
  getAllOrderDetails,
  getOrderDetailById,
  createOrderDetail,
  updateOrderDetail,
  deleteOrderDetail,
};
