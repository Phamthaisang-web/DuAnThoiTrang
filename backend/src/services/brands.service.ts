import createHttpError from "http-errors";
import brandModel from "../models/brand.model";
import { buildSlugify } from "../helpers/slugify.helper";

//Get AllCategories level = 1
const getAllBrands = async(query: any) => {
     const {page = 1, limit = 20} = query;

    //tìm kiếm theo điều kiện
    let where: any = {  };
    // nếu có tìm kiếm theo tên danh mục
    if(query.name && query.name.length > 0) {
        where = {...where, name: {$regex: query.name, $options: 'i'}};
    }if(query.country && query.country.length > 0) {
        where = {...where, country: {$regex: query.country, $options: 'i'}};
    }

    const brand = await brandModel
    .find(where)
    .skip((page-1)*limit)
    .limit(limit)
    .sort({ createAt: 1 });
    
    //Đếm tổng số record hiện có của collection categories
    const count = await brandModel.countDocuments(where);

    return {
        brand,
        pagination: {
            totalRecord: count,
            limit,
            page
        }
    };
}
const getByID = async (id: string) => {
    const brand = await brandModel.findById(id);
    if (!brand) {
        throw new Error("Brand not found");
    }
    return brand;
}
const create = async (payload: any) => {
      const exist = await brandModel.findOne({ name: payload.name });
      if (exist) throw createHttpError(400, 'Category already exists');

const slug = buildSlugify(payload.name);
      
      const brand = new brandModel({
        name: payload.name,
        logo: payload.logo, // Thêm trường logo
        country: payload.country,
        slug: slug, // <-- sử dụng slug đã tạo
        
      });
    
      await brand.save();
      return brand;
};
const update = async (id: string, brandData: any) => {
    if (brandData.name) {
        brandData.slug = buildSlugify(brandData.name); // Tự động cập nhật slug nếu name thay đổi
    }
    const brand = await brandModel.findByIdAndUpdate
(id, brandData, { new: true });
    if (!brand) {
        throw new Error("Brand not found");
    }
    
    return brand;
}
const deleteBrand = async (id: string) => {
    const brand = await brandModel.findByIdAndDelete(id);
    if (!brand) {
        throw new Error("Brand not found");
    }
    return brand;
}
export default {
    getAllBrands,
    getByID,
    create
    , update,
    deleteBrand
};