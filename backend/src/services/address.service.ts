import createHttpError from "http-errors";
import addressModel from "../models/address.model";
import { Types } from "mongoose";

interface AddressPayload {
  receiverName: string;
  phone: string;
  addressLine: string;
  city?: string;
  district?: string;
  ward?: string;
  isDefault?: boolean;
  user: Types.ObjectId; // 👈 ADD user
}

const getAllAddresses = async (query: any, userId?: string) => {
  const { page = 1, limit = 10 } = query;
  const where: any = userId ? { user: userId } : {};

  if (query.receiverName?.trim()) {
    where.receiverName = { $regex: query.receiverName.trim(), $options: "i" };
  }

  const addresses = await addressModel
    .find(where)
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit);

  const count = await addressModel.countDocuments(where);

  return {
    addresses,
    pagination: {
      totalRecord: count,
      limit: Number(limit),
      page: Number(page),
    },
  };
};

const getAddressById = async (id: string) => {
  const address = await addressModel.findById(id);
  if (!address) throw createHttpError(404, "Address not found");
  return address;
};

const createAddress = async (payload: AddressPayload) => {
  if (payload.isDefault) {
    await addressModel.updateMany({ user: payload.user }, { isDefault: false });
  }

  const address = new addressModel(payload);
  await address.save();
  return address;
};

const updateAddress = async (id: string, data: Partial<AddressPayload>) => {
  if (data.isDefault) {
    const found = await addressModel.findById(id);
    if (found?.user) {
      await addressModel.updateMany({ user: found.user }, { isDefault: false });
    }
  }

  const updated = await addressModel.findByIdAndUpdate(id, data, { new: true });
  if (!updated) throw createHttpError(404, "Address not found");
  return updated;
};

const deleteAddress = async (id: string) => {
  const deleted = await addressModel.findByIdAndDelete(id);
  if (!deleted) throw createHttpError(404, "Address not found");
  return deleted;
};

export default {
  getAllAddresses,
  getAddressById,
  createAddress,
  updateAddress,
  deleteAddress,
};
