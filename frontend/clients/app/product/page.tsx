"use client";

import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import CardProduct from "@/components/CardProduct";
import { ChevronLeft, ChevronRight, Menu, X } from "lucide-react";
import { useSearchParams } from "next/navigation";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

interface Product {
  _id: string;
  name: string;
  price: number;
  stockQuantity: number;
  images: { url: string; altText?: string }[];
  slug: string;
}

interface Category {
  _id: string;
  name: string;
  slug: string;
  image: { url: string; altText?: string };
  parent?: { _id: string; name: string } | null;
}

interface Brand {
  _id: string;
  name: string;
}

interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalRecord: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

const formatNumber = (v: string) =>
  v.replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ".");

const parseNumber = (v: string) =>
  Number.parseInt(v.replace(/\./g, ""), 10) || 0;

const getAllChildCategoryIds = (
  parentId: string,
  categories: Category[]
): string[] => {
  const directChildren = categories
    .filter((c) => c.parent?._id === parentId)
    .map((c) => c._id);
  return directChildren.reduce<string[]>((all, childId) => {
    return [...all, childId, ...getAllChildCategoryIds(childId, categories)];
  }, []);
};

export default function Page() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState<PaginationInfo>({
    currentPage: 1,
    totalPages: 1,
    totalRecord: 0,
    hasNextPage: false,
    hasPrevPage: false,
  });

  const [filterName, setFilterName] = useState("");
  const [inStockOnly, setInStockOnly] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [selectedBrandId, setSelectedBrandId] = useState("");
  const [sortOrder, setSortOrder] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(20);
  const [showFilters, setShowFilters] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const searchParams = useSearchParams();
  const slugFromURL = searchParams.get("slug");

  // Check screen size and adjust filter visibility
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      setShowFilters(!mobile); // Show on desktop, hide on mobile by default
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Load categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get(`${apiUrl}/api/v1/categories`);
        const fetched = res.data.data.categories || [];
        setCategories(fetched);

        if (slugFromURL) {
          const matched = fetched.find((c: any) => c.slug === slugFromURL);
          if (matched) setSelectedCategoryId(matched._id);
        }
      } catch (error) {
        console.error("Lỗi khi tải danh mục:", error);
      }
    };

    fetchCategories();
  }, [slugFromURL]);

  // Load brands
  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const res = await axios.get(`${apiUrl}/api/v1/brands`);
        const fetched = res.data.data.brand || [];
        setBrands(fetched);
      } catch (error) {
        console.error("Lỗi khi tải thương hiệu:", error);
      }
    };

    fetchBrands();
  }, []);

  // Fetch products
  const fetchProducts = useCallback(
    async (page = 1) => {
      setLoading(true);
      try {
        const params: any = { page, limit: itemsPerPage };

        if (filterName.trim()) params.name = filterName.trim();
        if (sortOrder) {
          params.sortBy = "price";
          params.sortOrder = sortOrder;
        }
        if (selectedCategoryId) {
          const childIds = getAllChildCategoryIds(
            selectedCategoryId,
            categories
          );
          params.category = [selectedCategoryId, ...childIds].join(",");
        }
        if (selectedBrandId) {
          params.brand = selectedBrandId;
        }
        if (minPrice) params.minPrice = parseNumber(minPrice);
        if (maxPrice) params.maxPrice = parseNumber(maxPrice);

        const res = await axios.get(`${apiUrl}/api/v1/products`, {
          params,
        });
        let result = res.data.data.products || [];
        const paginationData = res.data.data.pagination || {};

        if (inStockOnly) {
          result = result.filter((p: any) => p.stockQuantity > 0);
        }

        setFilteredProducts(result);
        setPagination({
          currentPage: paginationData.page || page,
          totalPages: Math.ceil(paginationData.totalRecord / itemsPerPage) || 1,
          totalRecord: paginationData.totalRecord || result.length,
          hasNextPage: paginationData.hasNextPage || false,
          hasPrevPage: paginationData.hasPrevPage || false,
        });
      } catch (error) {
        console.error("Lỗi khi tải sản phẩm:", error);
        setFilteredProducts([]);
        setPagination({
          currentPage: 1,
          totalPages: 1,
          totalRecord: 0,
          hasNextPage: false,
          hasPrevPage: false,
        });
      } finally {
        setLoading(false);
      }
    },
    [
      filterName,
      inStockOnly,
      selectedCategoryId,
      selectedBrandId,
      sortOrder,
      minPrice,
      maxPrice,
      categories,
      itemsPerPage,
    ]
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentPage(1);
      fetchProducts(1);
    }, 300);
    return () => clearTimeout(timer);
  }, [
    filterName,
    inStockOnly,
    selectedCategoryId,
    selectedBrandId,
    sortOrder,
    minPrice,
    maxPrice,
    fetchProducts,
    categories,
  ]);

  useEffect(() => {
    if (currentPage >= 1) {
      fetchProducts(currentPage);
    }
  }, [currentPage, fetchProducts]);

  const resetFilters = () => {
    setFilterName("");
    setInStockOnly(false);
    setSelectedCategoryId("");
    setSelectedBrandId("");
    setSortOrder("");
    setMinPrice("");
    setMaxPrice("");
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleNameFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilterName(e.target.value);
    if (currentPage !== 1) setCurrentPage(1);
  };

  const parentCategories = categories.filter((c) => !c.parent);
  const categoryOptions = parentCategories.map((parent) => ({
    ...parent,
    children: categories.filter((c) => c.parent?._id === parent._id),
  }));

  return (
    <div className="flex flex-col md:flex-row p-4 gap-6 relative">
      {/* Mobile filter toggle button */}

      {isMobile && (
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 p-1 mb-4 bg-white border rounded-md shadow-sm md:hidden w-fit"
        >
          <Menu size={15} />
          <span className="font-medium">Bộ lọc</span>
        </button>
      )}

      {/* Filters Sidebar */}
      {showFilters && (
        <>
          {/* Overlay for mobile */}
          {isMobile && (
            <div
              className="fixed inset-0  bg-opacity-50 z-40 md:hidden"
              onClick={() => setShowFilters(false)}
            />
          )}

          {/* Sidebar content */}
          <div
            className={`fixed md:static inset-y-0 left-0 w-[280px] border-r-1 bg-white shadow rounded p-4 space-y-4 overflow-y-auto z-50 md:z-auto md:w-full md:max-w-[250px] transition-transform duration-300 ${
              isMobile
                ? showFilters
                  ? "translate-x-0"
                  : "-translate-x-full"
                : ""
            }`}
          >
            {/* Close button for mobile */}
            {isMobile && (
              <button
                onClick={() => setShowFilters(false)}
                className=" text-gray-500 hover:text-gray-700"
              >
                <X size={20} />
              </button>
            )}

            <div className="flex justify-between items-center">
              <h2 className="font-semibold">Bộ lọc</h2>
              <button
                onClick={resetFilters}
                className="w-[100px] text-white rounded p-1 text-sm font-semibold bg-black hover:bg-gray-800"
              >
                Xóa bộ lọc
              </button>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Tên sản phẩm
              </label>
              <input
                type="text"
                value={filterName}
                onChange={handleNameFilterChange}
                className="w-full border rounded p-1 text-sm"
                placeholder="Nhập tên sản phẩm..."
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="inStock"
                checked={inStockOnly}
                onChange={(e) => setInStockOnly(e.target.checked)}
                className="mr-2"
              />
              <label htmlFor="inStock" className="text-sm font-medium">
                Chỉ hiển thị còn hàng
              </label>
            </div>

            {/* Category filter */}
            <div>
              <label className="block text-sm font-medium mb-1">Danh mục</label>
              <select
                value={selectedCategoryId}
                onChange={(e) => setSelectedCategoryId(e.target.value)}
                className="w-full border rounded p-1 text-sm"
              >
                <option value="">Tất cả danh mục</option>
                {categoryOptions.map((parent) => (
                  <React.Fragment key={parent._id}>
                    <option value={parent._id}>{parent.name}</option>
                    {parent.children.map((child) => (
                      <option key={child._id} value={child._id}>
                        &nbsp;&nbsp;├ {child.name}
                      </option>
                    ))}
                  </React.Fragment>
                ))}
              </select>
            </div>

            {/* Brand filter */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Thương hiệu
              </label>
              <select
                value={selectedBrandId}
                onChange={(e) => setSelectedBrandId(e.target.value)}
                className="w-full border rounded p-1 text-sm"
              >
                <option value="">Tất cả thương hiệu</option>
                {brands.map((b) => (
                  <option key={b._id} value={b._id}>
                    {b.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Sắp xếp theo giá
              </label>
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                className="w-full border rounded p-1 text-sm"
              >
                <option value="">Mặc định</option>
                <option value="asc">Giá tăng dần</option>
                <option value="desc">Giá giảm dần</option>
              </select>
            </div>

            {/* Price filter */}
            <div className="space-y-2">
              <label className="block text-sm font-medium">Khoảng giá</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  inputMode="numeric"
                  value={minPrice}
                  onChange={(e) => setMinPrice(formatNumber(e.target.value))}
                  className="w-full border rounded p-1 text-sm"
                  placeholder="Từ"
                />
                <span className="self-center text-gray-500">-</span>
                <input
                  type="text"
                  inputMode="numeric"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(formatNumber(e.target.value))}
                  className="w-full border rounded p-1 text-sm"
                  placeholder="Đến"
                />
              </div>
            </div>
          </div>
        </>
      )}

      {/* Product list */}
      <div className="flex-1">
        <div className="mb-4">
          {/* Dòng tiêu đề nằm ngang */}
          <div className="flex justify-between items-center mb-2">
            <h1 className="text-lg md:text-2xl lg:text-3xl font-bold leading-tight">
              <span className="bg-gradient-to-r from-slate-900 via-gray-800 to-zinc-900 bg-clip-text text-transparent">
                DANH SÁCH
              </span>
              <span className="bg-gradient-to-r from-amber-500 to-yellow-600 bg-clip-text text-transparent ml-2">
                SẢN PHẨM
              </span>
            </h1>
          </div>

          {/* Dòng thông tin số lượng nằm bên dưới */}
          {!loading && (
            <div className="text-xs sm:text-sm text-gray-600">
              {pagination.totalRecord > 0
                ? `Hiển thị ${
                    (currentPage - 1) * itemsPerPage + 1
                  } - ${Math.min(
                    currentPage * itemsPerPage,
                    pagination.totalRecord
                  )} trong tổng ${pagination.totalRecord} sản phẩm`
                : "Không có sản phẩm"}
            </div>
          )}
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <p>Đang tải sản phẩm...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="flex justify-center items-center h-64">
            <p className="text-gray-500">Không tìm thấy sản phẩm phù hợp</p>
          </div>
        ) : (
          <>
            <ul className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredProducts.map((product) => (
                <CardProduct key={product._id} product={product} />
              ))}
            </ul>
            <div className="flex justify-center items-center gap-2 mt-6">
              <button
                disabled={!pagination.hasPrevPage}
                onClick={() => handlePageChange(currentPage - 1)}
                className="px-3 py-1 border rounded"
              >
                <ChevronLeft size={16} />
              </button>
              {Array.from({ length: pagination.totalPages }, (_, i) => (
                <button
                  key={i}
                  onClick={() => handlePageChange(i + 1)}
                  className={`px-3 py-1 border rounded ${
                    currentPage === i + 1 ? "bg-black text-white" : ""
                  }`}
                >
                  {i + 1}
                </button>
              ))}
              <button
                disabled={!pagination.hasNextPage}
                onClick={() => handlePageChange(currentPage + 1)}
                className="px-3 py-1 border rounded"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
