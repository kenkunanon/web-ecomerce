import React, { useEffect, useState } from "react";
import ProductCard from "../components/card/ProductCard";
import useEcomStore from "../store/ecom-store";
import SearchCard from "../components/card/SearchCard";
import CartCard from "../components/card/CartCard";
import { ShoppingBag, SlidersHorizontal, ShoppingCart, X } from "lucide-react";

const Shop = () => {
  const getProduct = useEcomStore((state) => state.getProduct);
  const products = useEcomStore((state) => state.products);
  const carts = useEcomStore((state) => state.carts);
  const [showFilter, setShowFilter] = useState(false);
  const [showCart, setShowCart] = useState(false);

  useEffect(() => { getProduct(20); }, []);

  return (
    <div className="flex min-h-screen bg-rose-50/40 relative">
      {/* Sidebar - Search (desktop only) */}
      <div className="hidden lg:block w-64 shrink-0 bg-white border-r border-rose-100 p-5 sticky top-0 h-screen overflow-y-auto">
        <SearchCard />
      </div>

      {/* Mobile Filter Drawer */}
      {showFilter && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowFilter(false)} />
          <div className="absolute left-0 top-0 h-full w-72 max-w-[85vw] bg-white p-5 overflow-y-auto shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-bold text-gray-800">ค้นหา / กรอง</h2>
              <button onClick={() => setShowFilter(false)} className="p-1.5 rounded-lg hover:bg-rose-50 transition-colors">
                <X size={20} className="text-gray-500" />
              </button>
            </div>
            <SearchCard />
          </div>
        </div>
      )}

      {/* Mobile Cart Drawer */}
      {showCart && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowCart(false)} />
          <div className="absolute right-0 top-0 h-full w-80 max-w-[85vw] bg-white p-5 overflow-y-auto shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-bold text-gray-800">ตะกร้าสินค้า</h2>
              <button onClick={() => setShowCart(false)} className="p-1.5 rounded-lg hover:bg-rose-50 transition-colors">
                <X size={20} className="text-gray-500" />
              </button>
            </div>
            <CartCard />
          </div>
        </div>
      )}

      {/* Main - Products */}
      <div className="flex-1 p-4 lg:p-6 overflow-y-auto min-w-0">
        {/* Page header */}
        <div className="flex items-center gap-2 mb-4">
          <ShoppingBag size={20} className="text-rose-500" />
          <h1 className="text-xl font-extrabold text-gray-800">สินค้าทั้งหมด</h1>
          <span className="ml-2 bg-rose-100 text-rose-600 text-xs font-semibold px-2.5 py-0.5 rounded-full">
            {products.length} รายการ
          </span>
        </div>

        {/* Mobile toolbar */}
        <div className="flex lg:hidden gap-2 mb-4">
          <button
            onClick={() => setShowFilter(true)}
            className="flex items-center gap-1.5 px-4 py-2 bg-white border border-rose-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-rose-50 transition-colors shadow-sm"
          >
            <SlidersHorizontal size={15} className="text-rose-500" />
            กรองสินค้า
          </button>
          <button
            onClick={() => setShowCart(true)}
            className="relative flex items-center gap-1.5 px-4 py-2 bg-white border border-rose-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-rose-50 transition-colors shadow-sm"
          >
            <ShoppingCart size={15} className="text-rose-500" />
            ตะกร้า
            {carts.length > 0 && (
              <span className="ml-0.5 bg-rose-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {carts.length}
              </span>
            )}
          </button>
        </div>

        {products.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-gray-400">
            <div className="text-6xl mb-4">🍰</div>
            <p className="text-lg font-semibold">ไม่พบสินค้า</p>
            <p className="text-sm mt-1">ลองค้นหาด้วยคำอื่น</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-3 xl:grid-cols-4 gap-3 lg:gap-4">
            {products.map((item, index) => (
              <ProductCard key={index} item={item} />
            ))}
          </div>
        )}
      </div>

      {/* Sidebar - Cart (desktop only) */}
      <div className="hidden lg:block w-64 shrink-0 bg-white border-l border-rose-100 p-5 sticky top-0 h-screen overflow-y-auto">
        <CartCard />
      </div>
    </div>
  );
};

export default Shop;
