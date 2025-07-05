import { Request, Response } from "express";
import User from "../models/user.model";
import Order from "../models/order.model";
import Product from "../models/product.model";

export const getSummaryStats = async (req: Request, res: Response) => {
  try {
    const users = await User.countDocuments();
    const orders = await Order.countDocuments();
    const products = await Product.countDocuments();
    const revenueResult = await Order.aggregate([
      { $match: { status: { $in: ["confirmed", "shipped", "delivered"] } } },
      { $group: { _id: null, total: { $sum: "$totalAmount" } } },
    ]);

    const revenue = revenueResult[0]?.total || 0;

    res.json({
      statusCode: 200,
      message: "Success",
      data: { users, orders, products, revenue },
    });
  } catch (err) {
    res
      .status(500)
      .json({ statusCode: 500, message: "Server error", error: err });
  }
};

export const getRevenue = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const year = parseInt(req.query.year as string);
    const month = req.query.month
      ? parseInt(req.query.month as string)
      : undefined;
    const day = req.query.day ? parseInt(req.query.day as string) : undefined;

    if (!year || year < 2000 || year > 3000) {
      res.status(400).json({ statusCode: 400, message: "Invalid year" });
      return;
    }

    let match: any = {
      status: { $in: ["confirmed", "shipped", "delivered"] },
    };

    // Theo ngày (giờ)
    if (day && month) {
      const startDate = new Date(year, month - 1, day, 0, 0, 0);
      const endDate = new Date(year, month - 1, day, 23, 59, 59, 999);
      match.createdAt = { $gte: startDate, $lte: endDate };

      const data = await Order.aggregate([
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

      const data = await Order.aggregate([
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

    const data = await Order.aggregate([
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
  } catch (err) {
    res.status(500).json({
      statusCode: 500,
      message: "Server error",
      error: err instanceof Error ? err.message : err,
    });
  }
};
