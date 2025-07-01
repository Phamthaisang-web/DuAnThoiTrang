import paymentModel from "../models/payment.model";
import orderModel from "../models/order.model";

const getAllPayments = async (query: any) => {
  const { page = 1, limit = 20, method, order, status, transferCode } = query;

  const where: any = {};

  if (method) where.method = method;
  if (order) where.order = order;
  if (status) where.status = status;
  if (transferCode) where.transferCode = transferCode;

  const payments = await paymentModel
    .find(where)
    .skip((page - 1) * limit)
    .limit(limit)
    .sort({ createdAt: -1 })
    .populate("order");

  const count = await paymentModel.countDocuments(where);

  return {
    payments,
    pagination: {
      totalRecord: count,
      limit: Number(limit),
      page: Number(page),
    },
  };
};

const getPaymentById = async (id: string) => {
  const payment = await paymentModel.findById(id).populate("order");
  if (!payment) throw new Error("Không tìm thấy thanh toán");
  return payment;
};

const createPayment = async (paymentData: any) => {
  const { order, amount, method, transferCode } = paymentData;

  if (!order || !amount || amount <= 0 || !method) {
    throw new Error("Thiếu dữ liệu bắt buộc");
  }

  const validMethods = ["bank_transfer", "cash"];
  if (!validMethods.includes(method)) {
    throw new Error("Phương thức thanh toán không hợp lệ");
  }

  // Check đơn hàng tồn tại
  const orderExists = await orderModel.exists({ _id: order });
  if (!orderExists) {
    throw new Error("Đơn hàng không tồn tại");
  }

  // Nếu chuyển khoản thì phải có mã
  if (method === "bank_transfer" && !transferCode) {
    throw new Error("Chuyển khoản cần mã transferCode");
  }

  // Mặc định trạng thái là pending
  paymentData.status = "pending";

  const newPayment = new paymentModel(paymentData);
  await newPayment.save();
  return newPayment;
};

const updatePayment = async (id: string, paymentData: Partial<any>) => {
  const payment = await paymentModel.findById(id);
  if (!payment) throw new Error("Không tìm thấy thanh toán");

  if (
    paymentData.method === "bank_transfer" &&
    !paymentData.transferCode &&
    !payment.transferCode
  ) {
    throw new Error("Chuyển khoản cần mã transferCode");
  }

  Object.assign(payment, paymentData);
  await payment.save();
  return payment;
};

const deletePayment = async (id: string) => {
  const payment = await paymentModel.findByIdAndDelete(id);
  if (!payment) throw new Error("Không tìm thấy thanh toán");
  return payment;
};

export default {
  getAllPayments,
  getPaymentById,
  createPayment,
  updatePayment,
  deletePayment,
};
