import React, { useState } from "react";
import { ShoppingBag, Trash2, Minus, Plus, ClipboardList, History } from "lucide-react";
import useEcomStore from "../../store/ecom-store";
import { Link, useNavigate } from "react-router-dom";
import { createUserCart, placeOrder } from "../../api/user";
import { toast } from "react-toastify";

const ListCart = () => {
  const cart = useEcomStore((state) => state.carts);
  const user = useEcomStore((s) => s.user);
  const token = useEcomStore((s) => s.token);
  const getTotalPrice = useEcomStore((state) => state.getTotalPrice);
  const clearCart = useEcomStore((s) => s.clearCart);
  const actionUpdateQuantity = useEcomStore((s) => s.actionUpdateQuantity);
  const actionRemoveProduct = useEcomStore((s) => s.actionRemoveProduct);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handlePlaceOrder = async () => {
    if (cart.length === 0) return;
    setLoading(true);
    try {
      await createUserCart(token, { cart });
      await placeOrder(token);
      clearCart();
      toast.success("สั่งซื้อสำเร็จแล้ว! 🎉");
      navigate("/history");
    } catch (err) {
      toast.warning(err.response?.data?.message || "เกิดข้อผิดพลาด");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-rose-50/40 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="bg-rose-500 text-white p-2 rounded-xl">
            <ShoppingBag size={22} />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-gray-800">ตะกร้าสินค้า</h1>
            <p className="text-sm text-gray-400">{cart.length} รายการ</p>
          </div>
        </div>

        {cart.length === 0 ? (
          <div className="bg-white rounded-3xl shadow-sm border border-rose-100 p-16 text-center">
            <div className="text-6xl mb-4">🛒</div>
            <p className="text-xl font-bold text-gray-700 mb-2">ตะกร้าของคุณว่างเปล่า</p>
            <p className="text-gray-400 text-sm mb-6">เพิ่มสินค้าที่ชื่นชอบลงในตะกร้า</p>
            <Link to="/shop">
              <button className="px-8 py-2.5 bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-full font-semibold shadow hover:scale-105 transition-all">
                เลือกซื้อสินค้า
              </button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Items list */}
            <div className="md:col-span-2 space-y-3">
              {cart.map((item, index) => (
                <div key={index} className="bg-white rounded-2xl border border-rose-100 shadow-sm p-4 flex gap-4 items-center">
                  {item.image && item.image.length > 0 ? (
                    <img className="w-16 h-16 rounded-xl object-cover shrink-0" src={item.image[0].url} alt={item.title} />
                  ) : (
                    <div className="w-16 h-16 bg-rose-50 rounded-xl flex items-center justify-center text-3xl shrink-0">🍰</div>
                  )}

                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-gray-800 truncate">{item.title}</p>
                    <p className="text-rose-500 font-semibold text-sm mt-0.5">฿{item.price?.toLocaleString()}</p>

                    <div className="flex items-center gap-3 mt-2">
                      <div className="flex items-center gap-1 bg-rose-50 rounded-lg p-0.5">
                        <button onClick={() => actionUpdateQuantity(item.id, item.count - 1)} className="w-6 h-6 bg-white rounded-md shadow-sm flex items-center justify-center hover:bg-rose-100 transition-colors">
                          <Minus size={12} />
                        </button>
                        <span className="px-3 text-sm font-bold text-gray-700">{item.count}</span>
                        <button onClick={() => actionUpdateQuantity(item.id, item.count + 1)} className="w-6 h-6 bg-white rounded-md shadow-sm flex items-center justify-center hover:bg-rose-100 transition-colors">
                          <Plus size={12} />
                        </button>
                      </div>
                      <span className="text-sm font-bold text-gray-700">฿{(item.price * item.count).toLocaleString()}</span>
                    </div>
                  </div>

                  <button onClick={() => actionRemoveProduct(item.id)} className="text-gray-300 hover:text-red-400 transition-colors p-1 shrink-0">
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
            </div>

            {/* Summary */}
            <div className="space-y-4">
              <div className="bg-white rounded-2xl border border-rose-100 shadow-sm p-5">
                <h2 className="font-bold text-gray-800 text-base mb-4 flex items-center gap-2">
                  <ClipboardList size={17} className="text-rose-400" /> สรุปคำสั่งซื้อ
                </h2>

                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex justify-between">
                    <span>จำนวนสินค้า</span>
                    <span className="font-semibold">{cart.reduce((s, i) => s + i.count, 0)} ชิ้น</span>
                  </div>
                  <div className="border-t border-rose-100 pt-2 flex justify-between items-center">
                    <span className="font-bold text-gray-800">ยอดรวม</span>
                    <span className="font-extrabold text-rose-600 text-xl">฿{getTotalPrice()}</span>
                  </div>
                </div>

                <div className="flex flex-col gap-2 mt-5">
                  {user ? (
                    <button
                      disabled={cart.length < 1 || loading}
                      onClick={handlePlaceOrder}
                      className="w-full py-3 rounded-xl bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white font-bold shadow-md active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? "กำลังสั่งซื้อ..." : "🛍️ สั่งซื้อ"}
                    </button>
                  ) : (
                    <Link to="/login">
                      <button className="w-full py-3 rounded-xl bg-gradient-to-r from-rose-500 to-pink-500 text-white font-bold shadow-md hover:from-rose-600 hover:to-pink-600 transition-all">
                        เข้าสู่ระบบเพื่อสั่งซื้อ
                      </button>
                    </Link>
                  )}

                  <Link to="/shop">
                    <button className="w-full py-2.5 rounded-xl border border-rose-200 text-rose-500 font-semibold text-sm hover:bg-rose-50 transition-colors">
                      ← เลือกสินค้าเพิ่ม
                    </button>
                  </Link>

                  <Link to="/history">
                    <button className="w-full py-2.5 rounded-xl border border-gray-200 text-gray-500 font-semibold text-sm hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
                      <History size={15} /> ประวัติสั่งซื้อ
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ListCart;
