import React, { useEffect } from "react";
import ProductCard from "../components/card/ProductCard";
import useEcomStore from "../store/ecom-store";
import SearchCard from "../components/card/SearchCard";
import CartCard from "../components/card/CartCard";
import { ShoppingBag } from "lucide-react";

const Shop = () => {
  const getProduct = useEcomStore((state) => state.getProduct);
  const products = useEcomStore((state) => state.products);

  useEffect(() => { getProduct(20); }, []);

  return (
    <div className="flex min-h-screen bg-rose-50/40">
      {/* Sidebar - Search */}
      <div className="w-64 shrink-0 bg-white border-r border-rose-100 p-5 sticky top-0 h-screen overflow-y-auto">
        <SearchCard />
      </div>

      {/* Main - Products */}
      <div className="flex-1 p-6 overflow-y-auto">
        <div className="flex items-center gap-2 mb-6">
          <ShoppingBag size={20} className="text-rose-500" />
          <h1 className="text-xl font-extrabold text-gray-800">สินค้าทั้งหมด</h1>
          <span className="ml-2 bg-rose-100 text-rose-600 text-xs font-semibold px-2.5 py-0.5 rounded-full">
            {products.length} รายการ
          </span>
        </div>

        {products.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-gray-400">
            <div className="text-6xl mb-4">🍰</div>
            <p className="text-lg font-semibold">ไม่พบสินค้า</p>
            <p className="text-sm mt-1">ลองค้นหาด้วยคำอื่น</p>
          </div>
        ) : (
          <div className="flex flex-wrap gap-4">
            {products.map((item, index) => (
              <ProductCard key={index} item={item} />
            ))}
          </div>
        )}
      </div>

      {/* Sidebar - Cart */}
      <div className="w-64 shrink-0 bg-white border-l border-rose-100 p-5 sticky top-0 h-screen overflow-y-auto">
        <CartCard />
      </div>
    </div>
  );
};

export default Shop;
