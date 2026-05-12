import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import useEcomStore from "../../store/ecom-store";
import {
  listUsers,
  changeRole,
  changeStatus,
  getOrderAdmin,
  changeOrderStatus,
} from "../../api/admin";

const ORDER_STATUSES = ["Not Process", "Processing", "Shipped", "Delivered", "Cancelled"];

const Manage = () => {
  const token = useEcomStore((s) => s.token);
  const currentUser = useEcomStore((s) => s.user);

  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState("staff");

  useEffect(() => {
    fetchUsers();
    fetchOrders();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await listUsers(token);
      setUsers(res.data);
    } catch {
      toast.error("โหลดข้อมูลผู้ใช้ไม่สำเร็จ");
    }
  };

  const fetchOrders = async () => {
    try {
      const res = await getOrderAdmin(token);
      setOrders(res.data);
    } catch {
      // no orders is a normal state — no toast needed
    }
  };

  const handleChangeRole = async (id, role) => {
    if (id === currentUser?.id) {
      toast.warning("ไม่สามารถเปลี่ยนสิทธิ์ของตัวเองได้");
      return;
    }
    try {
      await changeRole(token, id, role);
      toast.success(role === "admin" ? "เพิ่ม Admin สำเร็จ" : "ลบ Admin สำเร็จ");
      fetchUsers();
    } catch {
      toast.error("เปลี่ยนสิทธิ์ไม่สำเร็จ");
    }
  };

  const handleChangeStatus = async (id, enabled) => {
    if (id === currentUser?.id) {
      toast.warning("ไม่สามารถเปลี่ยนสถานะของตัวเองได้");
      return;
    }
    try {
      await changeStatus(token, id, !enabled);
      toast.success("อัปเดตสถานะสำเร็จ");
      fetchUsers();
    } catch {
      toast.error("อัปเดตสถานะไม่สำเร็จ");
    }
  };

  const handleOrderStatus = async (orderId, orderStatus) => {
    try {
      await changeOrderStatus(token, orderId, orderStatus);
      toast.success("อัปเดตสถานะคำสั่งซื้อสำเร็จ");
      fetchOrders();
    } catch {
      toast.error("อัปเดตสถานะไม่สำเร็จ");
    }
  };

  const admins = users.filter((u) => u.role === "admin");
  const regularUsers = users.filter((u) => u.role !== "admin");

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">จัดการระบบ</h1>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b">
        {[
          { key: "staff", label: `พนักงาน (${admins.length})` },
          { key: "users", label: `ผู้ใช้ (${regularUsers.length})` },
          { key: "orders", label: `คำสั่งซื้อ (${orders.length})` },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === tab.key
                ? "border-b-2 border-blue-600 text-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab: Staff (admin users) */}
      {activeTab === "staff" && (
        <div>
          <h2 className="text-lg font-semibold mb-3">รายชื่อ Admin ทั้งหมด</h2>
          <table className="min-w-full bg-white rounded-lg shadow overflow-hidden">
            <thead className="bg-blue-600 text-white">
              <tr>
                <th className="px-4 py-3 text-left">#</th>
                <th className="px-4 py-3 text-left">Email</th>
                <th className="px-4 py-3 text-left">สถานะ</th>
                <th className="px-4 py-3 text-left">Enable</th>
                <th className="px-4 py-3 text-left">จัดการ</th>
              </tr>
            </thead>
            <tbody>
              {admins.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center py-6 text-gray-400">
                    ไม่มีข้อมูล
                  </td>
                </tr>
              )}
              {admins.map((u, i) => (
                <tr key={u.id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-3">{i + 1}</td>
                  <td className="px-4 py-3">
                    {u.email}
                    {u.id === currentUser?.id && (
                      <span className="ml-2 text-xs bg-blue-100 text-blue-600 px-1 rounded">
                        คุณ
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full font-medium">
                      Admin
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`text-xs px-2 py-1 rounded-full font-medium ${
                        u.enabled
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {u.enabled ? "Active" : "Disabled"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => handleChangeRole(u.id, "user")}
                      disabled={u.id === currentUser?.id}
                      className="bg-red-500 hover:bg-red-700 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm px-3 py-1 rounded transition-colors"
                    >
                      ลบ Admin
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Tab: Regular users */}
      {activeTab === "users" && (
        <div>
          <h2 className="text-lg font-semibold mb-3">รายชื่อผู้ใช้ทั้งหมด</h2>
          <table className="min-w-full bg-white rounded-lg shadow overflow-hidden">
            <thead className="bg-gray-700 text-white">
              <tr>
                <th className="px-4 py-3 text-left">#</th>
                <th className="px-4 py-3 text-left">Email</th>
                <th className="px-4 py-3 text-left">สถานะ</th>
                <th className="px-4 py-3 text-left">จัดการสิทธิ์</th>
                <th className="px-4 py-3 text-left">เปิด/ปิด</th>
              </tr>
            </thead>
            <tbody>
              {regularUsers.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center py-6 text-gray-400">
                    ไม่มีข้อมูล
                  </td>
                </tr>
              )}
              {regularUsers.map((u, i) => (
                <tr key={u.id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-3">{i + 1}</td>
                  <td className="px-4 py-3">{u.email}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`text-xs px-2 py-1 rounded-full font-medium ${
                        u.enabled
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {u.enabled ? "Active" : "Disabled"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => handleChangeRole(u.id, "admin")}
                      className="bg-blue-500 hover:bg-blue-700 text-white text-sm px-3 py-1 rounded transition-colors"
                    >
                      + เพิ่ม Admin
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => handleChangeStatus(u.id, u.enabled)}
                      className={`text-sm px-3 py-1 rounded transition-colors text-white ${
                        u.enabled
                          ? "bg-orange-500 hover:bg-orange-700"
                          : "bg-green-500 hover:bg-green-700"
                      }`}
                    >
                      {u.enabled ? "ปิดการใช้งาน" : "เปิดการใช้งาน"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Tab: Orders */}
      {activeTab === "orders" && (
        <div>
          <h2 className="text-lg font-semibold mb-3">คำสั่งซื้อทั้งหมด</h2>
          <table className="min-w-full bg-white rounded-lg shadow overflow-hidden">
            <thead className="bg-green-700 text-white">
              <tr>
                <th className="px-4 py-3 text-left">#</th>
                <th className="px-4 py-3 text-left">ผู้สั่ง</th>
                <th className="px-4 py-3 text-left">ที่อยู่</th>
                <th className="px-4 py-3 text-left">ยอดรวม</th>
                <th className="px-4 py-3 text-left">สินค้า</th>
                <th className="px-4 py-3 text-left">สถานะ</th>
              </tr>
            </thead>
            <tbody>
              {orders.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center py-6 text-gray-400">
                    ยังไม่มีคำสั่งซื้อ
                  </td>
                </tr>
              )}
              {orders.map((order, i) => (
                <tr key={order.id} className="border-b hover:bg-gray-50 align-top">
                  <td className="px-4 py-3">{i + 1}</td>
                  <td className="px-4 py-3 text-sm">{order.user?.email}</td>
                  <td className="px-4 py-3 text-sm text-gray-500 max-w-xs truncate">
                    {order.user?.address || "-"}
                  </td>
                  <td className="px-4 py-3 font-bold text-blue-600">
                    ฿{order.cartTotal?.toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <ul className="space-y-1">
                      {order.productonorder?.map((p, j) => (
                        <li key={j}>
                          {p.product?.title} × {p.count}
                        </li>
                      ))}
                    </ul>
                  </td>
                  <td className="px-4 py-3">
                    <select
                      value={order.orderStatus}
                      onChange={(e) =>
                        handleOrderStatus(order.id, e.target.value)
                      }
                      className="border rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
                    >
                      {ORDER_STATUSES.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Manage;
