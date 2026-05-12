import React from "react";
import { Link } from "react-router-dom";
import skSnackQR from "../pictures/sk_snack_QR.png";

const features = [
  { icon: "🚚", title: "จัดส่งรวดเร็ว", desc: "ส่งถึงบ้านคุณทุกวัน ไม่มีหยุด" },
  { icon: "✨", title: "คุณภาพพรีเมียม", desc: "วัตถุดิบคัดสรร สดใหม่ทุกวัน" },
  { icon: "🎁", title: "แพ็คเกจสวยงาม", desc: "เหมาะเป็นของขวัญในทุกโอกาส" },
];

const highlights = [
  { icon: "🍫", name: "Chocolate Brownie", desc: "เข้มข้น หอมช็อกโกแลต" },
  { icon: "🍊", name: "Orange Cake", desc: "หอมส้มสด ชุ่มฉ่ำทุกคำ" },
  { icon: "🍪", name: "Cookie", desc: "กรอบนอก นุ่มใน ทำมือ" },
  { icon: "🎁", name: "Gift Box", desc: "แพ็คเกจสวย เหมาะเป็นของขวัญ" },
];

const Home = () => {
  return (
    <div className="bg-gradient-to-b from-rose-50 to-white min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-rose-400 via-pink-400 to-amber-300 opacity-90" />
        <div className="absolute -top-10 -right-10 w-72 h-72 bg-white rounded-full opacity-10 blur-2xl" />
        <div className="absolute bottom-0 left-0 w-96 h-40 bg-pink-300 rounded-full opacity-20 blur-3xl" />

        <div className="relative max-w-4xl mx-auto px-6 py-24 text-center text-white">
          <p className="text-sm font-semibold tracking-widest uppercase bg-white/20 inline-block px-4 py-1 rounded-full mb-4">
            🍬 ร้านขนมสไตล์พรีเมียม
          </p>
          <h1 className="text-5xl md:text-6xl font-extrabold leading-tight drop-shadow mb-4">
            ความหวาน<br />
            <span className="text-amber-200">ที่คุณรอคอย</span>
          </h1>
          <p className="text-lg text-white/90 max-w-xl mx-auto mb-8">
            ขนมทำมือสดใหม่ทุกวัน รสชาติอร่อย แพ็คเกจสวยงาม เหมาะสำหรับทุกโอกาสพิเศษ
          </p>
          <Link to="/shop">
            <button className="bg-white text-rose-600 font-bold px-10 py-3.5 rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200 text-base">
              เลือกซื้อสินค้า →
            </button>
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-5xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((f) => (
            <div
              key={f.title}
              className="bg-white rounded-2xl shadow-sm border border-rose-100 p-6 text-center hover:shadow-md hover:-translate-y-1 transition-all duration-200"
            >
              <div className="text-4xl mb-3">{f.icon}</div>
              <h3 className="text-lg font-bold text-gray-800 mb-1">{f.title}</h3>
              <p className="text-gray-500 text-sm">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Highlight categories */}
      <section className="bg-gradient-to-b from-white to-rose-50 py-16">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-extrabold text-gray-800">เมนูยอดนิยม</h2>
            <p className="text-gray-400 mt-2 text-sm">คัดสรรของหวานที่ลูกค้าชื่นชอบ</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {highlights.map((h) => (
              <Link to="/shop" key={h.name}>
                <div className="bg-white rounded-2xl border border-rose-100 shadow-sm p-5 text-center hover:shadow-md hover:border-rose-300 hover:-translate-y-1 transition-all duration-200 cursor-pointer">
                  <div className="text-5xl mb-3">{h.icon}</div>
                  <p className="font-bold text-gray-800">{h.name}</p>
                  <p className="text-xs text-gray-400 mt-1">{h.desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* About / CTA */}
      <section className="max-w-4xl mx-auto px-6 py-16">
        <div className="bg-gradient-to-r from-rose-500 to-pink-400 rounded-3xl p-10 text-white text-center shadow-xl relative overflow-hidden">
          <div className="absolute -top-8 -right-8 w-40 h-40 bg-white rounded-full opacity-10" />
          <div className="absolute -bottom-8 -left-8 w-40 h-40 bg-pink-300 rounded-full opacity-20" />
          <div className="relative">
            <p className="text-4xl mb-4">🎂</p>
            <h2 className="text-3xl font-extrabold mb-3">เกี่ยวกับเรา</h2>
            <p className="text-white/90 text-base max-w-xl mx-auto leading-relaxed">
              SK Snack คือร้านขนมทำมือที่ใส่ใจทุกรายละเอียด
              วัตถุดิบคุณภาพสูง สูตรเฉพาะของเรา บวกกับแพ็คเกจสวยงาม
              ทำให้ทุกคำเป็นความทรงจำที่ดี
            </p>
            <Link to="/shop">
              <button className="mt-6 bg-white text-rose-600 font-bold px-8 py-3 rounded-full shadow hover:scale-105 transition-all duration-200">
                ดูสินค้าทั้งหมด
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300">
        <div className="max-w-5xl mx-auto px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {/* Brand */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-2xl">🍰</span>
                <span className="text-xl font-extrabold text-white">SK Snack</span>
              </div>
              <p className="text-sm text-gray-400 leading-relaxed">
                ขนมทำมือสดใหม่ทุกวัน<br />รสชาติอร่อย แพ็คเกจสวยงาม
              </p>
            </div>

            {/* Location */}
            <div>
              <h3 className="text-white font-bold mb-3 flex items-center gap-2">
                <span>📍</span> ที่อยู่
              </h3>
              <p className="text-sm text-gray-400 leading-relaxed">
                กรุงเทพมหานคร<br />
                Bangkok, Thailand
              </p>
              <p className="text-sm text-gray-400 mt-2">
                🕐 เปิดทุกวันมีadminค่อยรับorderตลอด
              </p>
            </div>

            {/* Contact / QR */}
            <div>
              <h3 className="text-white font-bold mb-3 flex items-center gap-2">
                <span>📱</span> ติดต่อเรา
              </h3>
              <p className="text-sm text-gray-400 mb-3">สแกน QR เพื่อติดต่อสั่งซื้อ</p>
              <img
                src={skSnackQR}
                alt="SK Snack QR Code"
                className="w-28 h-28 rounded-xl border-2 border-rose-400 object-cover shadow-lg"
              />
            </div>
          </div>

          <div className="border-t border-gray-700 mt-10 pt-6 text-center text-xs text-gray-500">
            © {new Date().getFullYear()} SK Snack — All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
