import React from "react";
import { Trash2, Minus, Plus, ShoppingBag } from "lucide-react";
import useEcomStore from "../../store/ecom-store";
import { Link } from "react-router-dom";

const CartCard = () => {
  const carts = useEcomStore((state) => state.carts);
  const actionUpdateQuantity = useEcomStore((state) => state.actionUpdateQuantity);
  const actionRemoveProduct = useEcomStore((state) => state.actionRemoveProduct);
  const getTotalPrice = useEcomStore((state) => state.getTotalPrice);

  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <div className="bg-rose-100 p-1.5 rounded-lg">
          <ShoppingBag size={16} className="text-rose-500" />
        </div>
        <h2 className="font-bold text-gray-800 text-base">ตะกร้าสินค้า</h2>
        {carts.length > 0 && (
          <span className="ml-auto bg-rose-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
            {carts.length}
          </span>
        )}
      </div>

      {carts.length === 0 ? (
        <div className="text-center py-8 text-gray-400">
          <div className="text-4xl mb-2">🛒</div>
          <p className="text-sm">ยังไม่มีสินค้าในตะกร้า</p>
        </div>
      ) : (
        <div className="space-y-2">
          {carts.map((item, index) => (
            <div key={index} className="bg-white rounded-xl border border-rose-100 p-2.5 shadow-sm">
              <div className="flex gap-2 items-start">
                {item.image && item.image.length > 0 ? (
                  <img className="w-12 h-12 rounded-lg object-cover shrink-0" src={item.image[0].url} alt={item.title} />
                ) : (
                  <div className="w-12 h-12 bg-rose-50 rounded-lg flex items-center justify-center text-xl shrink-0">🍰</div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <p className="font-semibold text-gray-800 text-xs truncate pr-1">{item.title}</p>
                    <button onClick={() => actionRemoveProduct(item.id)} className="text-gray-300 hover:text-red-400 transition-colors shrink-0">
                      <Trash2 size={13} />
                    </button>
                  </div>
                  <p className="text-rose-500 font-bold text-xs mt-0.5">฿{item.price?.toLocaleString()}</p>
                  <div className="flex items-center justify-between mt-1.5">
                    <div className="flex items-center gap-1 bg-rose-50 rounded-lg p-0.5">
                      <button onClick={() => actionUpdateQuantity(item.id, item.count - 1)} className="w-5 h-5 bg-white rounded-md shadow-sm flex items-center justify-center hover:bg-rose-100 transition-colors">
                        <Minus size={10} />
                      </button>
                      <span className="px-2 text-xs font-bold text-gray-700">{item.count}</span>
                      <button onClick={() => actionUpdateQuantity(item.id, item.count + 1)} className="w-5 h-5 bg-white rounded-md shadow-sm flex items-center justify-center hover:bg-rose-100 transition-colors">
                        <Plus size={10} />
                      </button>
                    </div>
                    <span className="text-xs font-bold text-gray-700">฿{(item.price * item.count).toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Total */}
          <div className="bg-rose-50 rounded-xl p-3 mt-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">ยอดรวม</span>
              <span className="font-extrabold text-rose-600 text-base">฿{getTotalPrice()}</span>
            </div>
          </div>

          {/* Checkout button */}
          <Link to="/cart">
            <button className="mt-2 w-full py-2.5 rounded-xl bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white font-bold text-sm shadow-md active:scale-95 transition-all duration-150">
              ดำเนินการชำระเงิน
            </button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default CartCard;
