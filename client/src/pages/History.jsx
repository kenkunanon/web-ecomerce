import React, { useEffect, useState } from "react";
import { getOrders } from "../api/user";
import useEcomStore from "../store/ecom-store";
import { PackageCheck, ShoppingBag, Clock, ChevronDown, ChevronUp } from "lucide-react";

const STATUS_STYLE = {
  "Not Process": "bg-gray-100 text-gray-600",
  Processing: "bg-blue-100 text-blue-700",
  Shipped: "bg-yellow-100 text-yellow-700",
  Delivered: "bg-green-100 text-green-700",
  Cancelled: "bg-red-100 text-red-600",
  COD: "bg-purple-100 text-purple-700",
};

const History = () => {
  const token = useEcomStore((s) => s.token);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState({});

  useEffect(() => {
    if (!token) { setLoading(false); return; }
    getOrders(token)
      .then((res) => setOrders(res.data.orders || []))
      .catch(() => setOrders([]))
      .finally(() => setLoading(false));
  }, [token]);

  const toggle = (id) => setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 text-gray-400">
        <ShoppingBag size={64} strokeWidth={1} />
        <p className="text-xl font-semibold">ยังไม่มีประวัติการสั่งซื้อ</p>
        <a
          href="/shop"
          className="mt-2 px-6 py-2 bg-blue-600 text-white rounded-full text-sm font-medium hover:bg-blue-700 transition-colors"
        >
          เริ่มช้อปเลย
        </a>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="bg-blue-600 text-white p-2 rounded-xl">
          <PackageCheck size={24} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-800">ประวัติการสั่งซื้อ</h1>
          <p className="text-sm text-gray-400">{orders.length} รายการ</p>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        {orders.map((order, i) => {
          const isOpen = expanded[order.id];
          const statusClass = STATUS_STYLE[order.orderStatus] || STATUS_STYLE[order.status] || "bg-gray-100 text-gray-600";
          const displayStatus = order.orderStatus || order.status;

          return (
            <div
              key={order.id}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
            >
              {/* Order Header */}
              <button
                onClick={() => toggle(order.id)}
                className="w-full text-left px-5 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <span className="text-gray-300 font-semibold text-sm">#{i + 1}</span>
                  <div>
                    <p className="font-semibold text-gray-800 text-sm">
                      คำสั่งซื้อ #{order.id}
                    </p>
                    <div className="flex items-center gap-1 text-xs text-gray-400 mt-0.5">
                      <Clock size={11} />
                      {new Date(order.createdAt).toLocaleDateString("th-TH", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className={`text-xs font-semibold px-3 py-1 rounded-full ${statusClass}`}>
                    {displayStatus}
                  </span>
                  <span className="font-bold text-blue-600 text-sm whitespace-nowrap">
                    ฿{order.cartTotal?.toLocaleString()}
                  </span>
                  {isOpen ? (
                    <ChevronUp size={16} className="text-gray-400 shrink-0" />
                  ) : (
                    <ChevronDown size={16} className="text-gray-400 shrink-0" />
                  )}
                </div>
              </button>

              {/* Order Items */}
              {isOpen && (
                <div className="px-5 pb-5 border-t border-gray-50">
                  <div className="mt-4 flex flex-col gap-3">
                    {(order.productonorder || []).map((item, j) => (
                      <div key={j} className="flex items-center gap-3">
                        {item.product?.image?.[0]?.url ? (
                          <img
                            src={item.product.image[0].url}
                            className="w-14 h-14 rounded-xl object-cover bg-gray-100 shrink-0"
                          />
                        ) : (
                          <div className="w-14 h-14 rounded-xl bg-gray-100 flex items-center justify-center shrink-0">
                            <ShoppingBag size={20} className="text-gray-300" />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-800 text-sm truncate">
                            {item.product?.title || "สินค้า"}
                          </p>
                          <p className="text-xs text-gray-400 mt-0.5">
                            ฿{item.price?.toLocaleString()} × {item.count}
                          </p>
                        </div>
                        <span className="font-semibold text-gray-700 text-sm shrink-0">
                          ฿{(item.price * item.count).toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Footer summary */}
                  <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center">
                    <span className="text-sm text-gray-400">
                      {order.productonorder?.length || 0} รายการ
                    </span>
                    <div className="text-right">
                      <p className="text-xs text-gray-400">ยอดรวมทั้งหมด</p>
                      <p className="text-lg font-bold text-blue-600">
                        ฿{order.cartTotal?.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default History;
