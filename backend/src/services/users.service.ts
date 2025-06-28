import userModel from "../models/user.model";
const getAllUsers = async (query: any) => {
  const { page = 1, limit = 10 } = query;

  //Nếu tồn tại sortType và sortBy thì sẽ sắp xếp theo sortType và sortBy
  //Nếu không tồn tại thì sẽ sắp xếp theo createdAt
  let sortObject = {};
  const sortType = query.sort_type || "desc";
  const sortBy = query.sort_by || "createdAt";
  sortObject = { ...sortObject, [sortBy]: sortType === "desc" ? -1 : 1 };

  console.log("<<=== 🚀sortObject  ===>>", sortObject);

  //Tìm kiếm theo điều kiện
  let where: any = {};

  if (query.fullName?.trim()) {
    where.fullName = { $regex: query.fullName.trim(), $options: "i" };
  }

  if (query.email?.trim()) {
    where.email = query.email.trim();
  }

  const users = await userModel
    .find(where)
    .skip((page - 1) * limit)
    .limit(limit)
    .sort({ ...sortObject });

  //Đếm tổng số record hiện có của collection Staff
  const count = await userModel.countDocuments(where);

  return {
    users,
    pagination: {
      totalRecord: count,
      limit,
      page,
    },
  };
};
const getByID = async (id: string) => {
  const user = await userModel.findById(id);
  if (!user) {
    throw new Error("User not found");
  }
  return user;
};
const create = async (userData: any) => {
  // Kiểm tra dữ liệu đầu vào
  if (!userData.email || typeof userData.email !== "string") {
    throw new Error("Email is required and must be a string");
  }

  // Kiểm tra xem người dùng đã tồn tại chưa (dựa trên email)
  const existing = await userModel.findOne({ email: userData.email });
  if (existing) {
    throw new Error("User with this email already exists");
  }

  // Tạo và lưu người dùng mới
  const newUser = new userModel(userData);
  await newUser.save();
  return newUser;
};
const update = async (id: string, userData: any) => {
  const user = await userModel.findByIdAndUpdate(id, userData, { new: true });
  if (!user) {
    throw new Error("User not found");
  }
  return user;
};
const deleteUser = async (id: string) => {
  const user = await userModel.findByIdAndDelete(id);
  if (!user) {
    throw new Error("User not found");
  }
  return user;
};
export default {
  getAllUsers,
  getByID,
  create,
  update,
  deleteUser,
};
