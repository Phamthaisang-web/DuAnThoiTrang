import paymentModel from "../models/payment.model";
const getAllPayments = async (query:any) => {
    const {page = 1, limit = 20} = query;
    
        //tìm kiếm theo điều kiện
        let where: any = {  };
       
        const payments = await paymentModel
        .find(where)
        .skip((page-1)*limit)
        .limit(limit)
        .sort({ createAt: 1 });
        
        //Đếm tổng số record hiện có của collection categories
        const count = await paymentModel.countDocuments(where);
    
        return {
            payments,
            pagination: {
                totalRecord: count,
                limit,
                page
            }
        };}
const getPaymentById = async (id: string) => {
    const payment = await paymentModel.findById(id)
        if (!payment) {
        throw new Error("Payment not found");
    }
    return payment;
}
const createPayment = async (paymentData: any) => {
    // Kiểm tra dữ liệu đầu vào
    if (!paymentData.user || !paymentData.amount || paymentData.amount <= 0) {
        throw new Error("User and amount are required to create a payment");
    }

    // Tạo và lưu thanh toán mới
    const newPayment = new paymentModel(paymentData);
    await newPayment.save();
    return newPayment;
};
const updatePayment = async (id: string, paymentData: any) => {
    const payment = await paymentModel.findByIdAndUpdate(id, paymentData, { new: true })
    if (!payment) {
        throw new Error("Payment not found");
    }
    return payment;
}
const deletePayment = async (id: string) => {
    const payment = await paymentModel.findByIdAndDelete(id);
    if (!payment) {
        throw new Error("Payment not found");
    }
    return payment;
}

export default {
    getAllPayments,
    getPaymentById,
    createPayment,
    updatePayment,
    deletePayment,
   
};