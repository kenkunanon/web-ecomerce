import React, { useState } from "react";
import { register as registerApi } from "../../api/auth";
import { toast } from "react-toastify";
import { useNavigate, Link } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "", confirmPassword: "" });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      return toast.error("รหัสผ่านไม่ตรงกัน");
    }
    try {
      const res = await registerApi(form);
      toast.success(res.data.message || "สมัครสมาชิกสำเร็จ 🎉");
      navigate("/login");
    } catch (err) {
      toast.error(err.response?.data?.message || "เกิดข้อผิดพลาด");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-rose-50 via-pink-50 to-amber-50 relative overflow-hidden">
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-pink-200 rounded-full opacity-30 blur-3xl" />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-rose-300 rounded-full opacity-25 blur-3xl" />

      <div className="relative w-full max-w-md mx-4">
        {/* Brand */}
        <div className="text-center mb-8">
          <span className="text-5xl">🧁</span>
          <h1 className="mt-3 text-3xl font-extrabold text-rose-700 tracking-tight">SK Snack</h1>
          <p className="text-rose-400 text-sm mt-1">ร้านขนมหวาน สไตล์พรีเมียม</p>
        </div>

        {/* Card */}
        <div className="bg-white/80 backdrop-blur-md rounded-3xl shadow-xl border border-rose-100 p-8">
          <h2 className="text-xl font-bold text-gray-800 mb-6 text-center">สมัครสมาชิก</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">อีเมล</label>
              <input
                name="email"
                type="email"
                placeholder="your@email.com"
                value={form.email}
                onChange={handleChange}
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
                value={form.password}
                onChange={handleChange}
                required
                className="w-full px-4 py-2.5 rounded-xl border border-rose-200 bg-rose-50/50 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-rose-300 focus:border-transparent transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">ยืนยันรหัสผ่าน</label>
              <input
                name="confirmPassword"
                type="password"
                placeholder="••••••••"
                value={form.confirmPassword}
                onChange={handleChange}
                required
                className="w-full px-4 py-2.5 rounded-xl border border-rose-200 bg-rose-50/50 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-rose-300 focus:border-transparent transition"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-gradient-to-r from-rose-500 to-pink-500 text-white font-bold shadow-md hover:from-rose-600 hover:to-pink-600 active:scale-95 transition-all duration-200 mt-2"
            >
              สมัครสมาชิก
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            มีบัญชีแล้ว?{" "}
            <Link to="/login" className="text-rose-500 font-semibold hover:underline">
              เข้าสู่ระบบ
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
