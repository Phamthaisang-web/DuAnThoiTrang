import createHttpError from "http-errors";
import categoryModel from "../models/category.model";
import { buildSlugify } from "../helpers/slugify.helper";

//Get AllCategories level = 1
const getAllCategories = async(query: any) => {
     const {page = 1, limit = 20} = query;

    //tìm kiếm theo điều kiện
    let where: any = {  };
    // nếu có tìm kiếm theo tên danh mục
    if(query.name && query.name.length > 0) {
        where = {...where, name: {$regex: query.name, $options: 'i'}};
    }

    const categories = await categoryModel
    .find(where)
    .populate("parent", "name")
    .skip((page-1)*limit)
    .limit(limit)
    .sort({ createAt: 1 });
    
    //Đếm tổng số record hiện có của collection categories
    const count = await categoryModel.countDocuments(where);

    return {
        categories,
        pagination: {
            totalRecord: count,
            limit,
            page
        }
    };
}
const getCategoryById = async (id: string) => {
    const category = await categoryModel.findById(id).populate("parent", "name");
    if (!category) {
        throw new Error("Category not found");
    }
    return category;
}
const createCategory = async (payload: any) => {
  const exist = await categoryModel.findOne({ name: payload.name });
  if (exist) throw createHttpError(400, 'Category already exists');
const slug = buildSlugify(payload.name); // <-- tạo slug từ name
  const category = new categoryModel({
    name: payload.name,
    description: payload.description,
    parent: payload.parent || null,
    
    slug: slug, // <-- sử dụng slug đã tạo
  });

  await category.save();
  return category;
}
const updateCategory = async (id: string, categoryData: any) => {
  
if (categoryData.name) {
    categoryData.slug = buildSlugify(categoryData.name); // Tự động cập nhật slug nếu name thay đổi
  }
  const category = await categoryModel
    .findByIdAndUpdate(id, categoryData, { new: true })
    .populate("parent", "name");

  if (!category) {
    throw new Error("Category not found");
  }
  

  return category;
};

const deleteCategory = async (id: string) => {
    const category = await categoryModel.findByIdAndDelete(id);
    if (!category) {
        throw new Error("Category not found");
    }
    return category;
}
export default {
    getAllCategories,
    getCategoryById,
    createCategory,
    updateCategory,
    deleteCategory,
};