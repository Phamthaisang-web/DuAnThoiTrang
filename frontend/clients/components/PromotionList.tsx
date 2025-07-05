"use client";

import { useEffect, useState } from "react";

interface Promotion {
  _id: string;
  code: string;
  type: "percent" | "fixed";
  value: number;
  expiredAt?: string;
  quantity?: number;
  maxDiscount?: number;
  isActive?: boolean;
}
const apiUrl = process.env.NEXT_PUBLIC_API_URL;
const PromotionsList = () => {
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPromotions = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${apiUrl}/api/v1/promotions`);
        const data = await res.json();
        if (data?.data?.promotions) {
          setPromotions(data.data.promotions);
        } else {
          throw new Error("Không có dữ liệu khuyến mãi.");
        }
      } catch (err: any) {
        console.error("Lỗi khi tải khuyến mãi:", err);
        setError(err.message || "Đã xảy ra lỗi.");
      } finally {
        setLoading(false);
      }
    };

    fetchPromotions();
  }, []);

  return (
    <div className="w-full mb-4 px-2 sm:px-0">
      <div className="max-w-full overflow-hidden">
        {loading && <p className="text-sm px-2">Đang tải khuyến mãi...</p>}
        {error && <p className="text-red-500 text-sm px-2">{error}</p>}
        {!loading && !error && promotions.length === 0 && (
          <p className="text-sm text-gray-500 px-2">Không có khuyến mãi nào.</p>
        )}

        <div className="flex gap-2 sm:gap-3 overflow-x-auto pb-2 hide-scrollbar px-2">
          {promotions.map((promo) => (
            <div
              key={promo._id}
              className="flex-shrink-0 w-[160px] sm:w-[200px] md:w-[240px] bg-white border border-dashed border-amber-300 rounded-lg shadow-sm p-2 sm:p-3"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-sm sm:text-base md:text-sm font-bold text-amber-600 tracking-wide">
                  {promo.code}
                </h3>
                {promo.isActive && (
                  <span className="text-[10px] sm:text-xs bg-green-100 text-green-800 px-1 sm:px-2 py-0.5 sm:py-1 rounded-full">
                    Active
                  </span>
                )}
              </div>
              <p className="text-xs sm:text-sm text-slate-700 mt-1">
                {promo.type === "percent"
                  ? `Giảm ${promo.value}%`
                  : `Giảm ${promo.value.toLocaleString()}đ`}
              </p>
              {promo.maxDiscount && promo.type === "percent" && (
                <p className="text-[10px] sm:text-xs text-slate-500 mt-1">
                  Tối đa: {promo.maxDiscount.toLocaleString()}đ
                </p>
              )}
              {promo.expiredAt && (
                <p className="text-[10px] sm:text-xs text-amber-600 mt-1 sm:mt-2">
                  HSD:{" "}
                  {new Date(promo.expiredAt).toLocaleDateString("vi-VN", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                  })}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PromotionsList;
