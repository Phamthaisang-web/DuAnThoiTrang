import createHttpError from "http-errors";
import productModel from "../models/product.model";
import { buildSlugify } from "../helpers/slugify.helper";
import mongoose from "mongoose";
const getAllProducts = async (query: any) => {
  const {
    page = 1,
    limit = 20,
    sortBy = "createdAt",
    sortOrder = "desc",
    minPrice,
    maxPrice,
    name,
    category,
    brand, // ✅ thêm dòng này để lấy brand từ query
  } = query;

  const where: any = {};

  // Lọc theo tên sản phẩm
  if (name?.length > 0) {
    where.name = { $regex: name, $options: "i" };
  }

  // ✅ Lọc theo danh mục (1 hoặc nhiều category ID)
  if (category) {
    const categoryArray =
      typeof category === "string" ? category.split(",") : [category];

    where.category = {
      $in: categoryArray.map((id: string) => new mongoose.Types.ObjectId(id)),
    };
  }

  // ✅ Lọc theo thương hiệu (1 hoặc nhiều brand ID)
  if (brand) {
    const brandArray = typeof brand === "string" ? brand.split(",") : [brand];

    where.brand = {
      $in: brandArray.map((id: string) => new mongoose.Types.ObjectId(id)),
    };
  }

  // Lọc theo khoảng giá
  if (minPrice || maxPrice) {
    where.price = {};
    if (minPrice) where.price.$gte = Number(minPrice);
    if (maxPrice) where.price.$lte = Number(maxPrice);
  }

  // Sắp xếp
  const sortDirection = sortOrder === "desc" ? -1 : 1;
  const sort: any = {};
  sort[sortBy] = sortDirection;

  // Truy vấn dữ liệu
  const products = await productModel
    .find(where)
    .populate("category", "name")
    .populate("brand", "name")
    .skip((page - 1) * limit)
    .limit(limit)
    .sort(sort);

  const count = await productModel.countDocuments(where);

  return {
    products,
    pagination: {
      totalRecord: count,
      limit: Number(limit),
      page: Number(page),
      totalPages: Math.ceil(count / limit),
      hasNextPage: page < Math.ceil(count / limit),
      hasPrevPage: page > 1,
    },
  };
};

// Lấy chi tiết sản phẩm theo ID
const getProductById = async (id: string) => {
  const product = await productModel.findById(id);
  if (!product) throw new Error("Product not found");
  return product;
};

// Tạo slug duy nhất (có thể loại trừ một ID nếu đang update)
const generateUniqueSlug = async (
  baseSlug: string,
  idToExclude?: string
): Promise<string> => {
  let slug = baseSlug;
  let counter = 1;

  while (true) {
    const condition: any = { slug };
    if (idToExclude) {
      condition._id = { $ne: idToExclude };
    }

    const existing = await productModel.findOne(condition);
    if (!existing) break;

    slug = `${baseSlug}-${counter++}`;
  }

  return slug;
};

// Tạo mới sản phẩm
const createProduct = async (payload: any) => {
  const baseSlug = buildSlugify(payload.name);

  if (!baseSlug)
    throw createHttpError(400, "Invalid product name to generate slug.");

  const slug = await generateUniqueSlug(baseSlug);
  console.log("Generated slug: ", slug);

  const product = new productModel({
    name: payload.name,
    description: payload.description,
    price: payload.price,
    slug,
    stockQuantity: payload.stockQuantity,
    images: payload.images,
    category: Array.isArray(payload.category)
      ? payload.category.map((id: string) => new mongoose.Types.ObjectId(id))
      : [new mongoose.Types.ObjectId(payload.category)],
    brand: payload.brand,
    sizes: payload.sizes, // ✅ thêm dòng này
    colors: payload.colors, // ✅ và dòng này
  });

  try {
    await product.save();
    return product;
  } catch (error: any) {
    console.error("Error saving product:", error); // 👈 log kỹ hơn ở đây

    if (error.code === 11000 && error.keyPattern?.slug) {
      throw createHttpError(
        400,
        "Tên sản phẩm đã tồn tại (slug trùng). Vui lòng chọn tên khác."
      );
    }

    throw createHttpError(500, "Lỗi khi tạo sản phẩm");
  }
};

// Cập nhật sản phẩm
const updateProduct = async (id: string, productData: any) => {
  if (productData.category) {
    productData.category = Array.isArray(productData.category)
      ? productData.category.map(
          (id: string) => new mongoose.Types.ObjectId(id)
        )
      : [new mongoose.Types.ObjectId(productData.category)];
  }
  const product = await productModel.findById(id);
  if (!product) throw createHttpError(404, "Product not found");

  // Nếu đổi tên -> tạo lại slug mới
  if (productData.name && productData.name !== product.name) {
    const baseSlug = buildSlugify(productData.name);
    if (!baseSlug) {
      throw createHttpError(400, "Invalid product name to generate slug.");
    }

    productData.slug = await generateUniqueSlug(baseSlug, id);
  }

  const updatedProduct = await productModel
    .findByIdAndUpdate(id, productData, { new: true })
    .populate("category", "name");

  return updatedProduct;
};

// Xoá sản phẩm
const deleteProduct = async (id: string) => {
  const product = await productModel.findByIdAndDelete(id);
  if (!product) throw new Error("Product not found");
  return product;
};

export default {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
