import React, { useState } from "react";
import { toast } from "react-toastify";
import useEcomStore from "../../store/ecom-store";
import { useNavigate, Link } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const actionLogin = useEcomStore((state) => state.actionLogin);
  const [form, setForm] = useState({ email: "", password: "" });

  const handleOnChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await actionLogin(form);
      const role = res.data.payload.role;
      toast.success("ยินดีต้อนรับกลับมา 🍰");
      role === "admin" ? navigate("/admin") : navigate("/shop");
    } catch (err) {
      toast.error(err.response?.data?.message || "เกิดข้อผิดพลาด");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-rose-50 via-pink-50 to-amber-50 relative overflow-hidden">
      {/* Decorative blobs */}
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-rose-200 rounded-full opacity-30 blur-3xl" />
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-pink-300 rounded-full opacity-25 blur-3xl" />

      <div className="relative w-full max-w-md mx-4">
        {/* Logo / Brand */}
        <div className="text-center mb-8">
          <span className="text-5xl">🍰</span>
          <h1 className="mt-3 text-3xl font-extrabold text-rose-700 tracking-tight">SK Snack</h1>
          <p className="text-rose-400 text-sm mt-1">ร้านขนมหวาน สไตล์พรีเมียม</p>
        </div>

        {/* Card */}
        <div className="bg-white/80 backdrop-blur-md rounded-3xl shadow-xl border border-rose-100 p-8">
          <h2 className="text-xl font-bold text-gray-800 mb-6 text-center">เข้าสู่ระบบ</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">อีเมล</label>
              <input
                name="email"
                type="email"
                placeholder="your@email.com"
                onChange={handleOnChange}
                required
                className="w-full px-4 py-2.5 rounded-xl border border-rose-200 bg-rose-50/50 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-rose-300 focus:border-transparent transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">รหัสผ่าน</label>
              <input
                name="password"
                type="password"
                placeholder="••••••••"
                onChange={handleOnChange}
                required
                className="w-full px-4 py-2.5 rounded-xl border border-rose-200 bg-rose-50/50 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-rose-300 focus:border-transparent transition"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-gradient-to-r from-rose-500 to-pink-500 text-white font-bold shadow-md hover:from-rose-600 hover:to-pink-600 active:scale-95 transition-all duration-200 mt-2"
            >
              เข้าสู่ระบบ
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            ยังไม่มีบัญชี?{" "}
            <Link to="/register" className="text-rose-500 font-semibold hover:underline">
              สมัครสมาชิก
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
