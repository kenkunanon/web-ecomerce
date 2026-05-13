import React, { useState, useRef, useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import useEcomStore from "../store/ecom-store";
import { UserCircle, ShoppingCart, Home, Store, History, Menu, X } from "lucide-react";

const MainNav = () => {
  const carts = useEcomStore((s) => s.carts);
  const user = useEcomStore((s) => s.user);
  const actionLogout = useEcomStore((s) => s.actionLogout);
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    actionLogout();
    setDropdownOpen(false);
    setMenuOpen(false);
    navigate("/login");
  };

  const navLink =
    "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-gray-600 hover:text-rose-600 hover:bg-rose-50 transition-all duration-150";
  const activeNavLink =
    "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-rose-600 bg-rose-50";

  return (
    <nav className="bg-white border-b border-rose-100 shadow-sm sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center gap-6">
            <Link to="/" className="flex items-center gap-2 group">
              <span className="text-2xl group-hover:scale-110 transition-transform duration-200">🍰</span>
              <span className="text-xl font-extrabold text-rose-600 tracking-tight">SK Snack</span>
            </Link>

            <div className="hidden sm:flex items-center gap-1">
              <NavLink
                to="/"
                end
                className={({ isActive }) => (isActive ? activeNavLink : navLink)}
              >
                <Home size={15} /> หน้าหลัก
              </NavLink>

              <NavLink
                to="/shop"
                className={({ isActive }) => (isActive ? activeNavLink : navLink)}
              >
                <Store size={15} /> ร้านค้า
              </NavLink>
            </div>
          </div>

          {/* Right */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Cart */}
            <NavLink
              to="/cart"
              className={({ isActive }) =>
                `relative flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                  isActive
                    ? "text-rose-600 bg-rose-50"
                    : "text-gray-600 hover:text-rose-600 hover:bg-rose-50"
                }`
              }
            >
              <ShoppingCart size={18} />
              <span className="hidden sm:inline">ตะกร้า</span>
              {carts.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {carts.length}
                </span>
              )}
            </NavLink>

            {/* User */}
            {user ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen((o) => !o)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-rose-50 transition-colors"
                >
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-rose-400 to-pink-400 flex items-center justify-center text-white text-xs font-bold uppercase">
                    {user.email?.[0] || "U"}
                  </div>
                  <span className="hidden sm:block text-sm font-medium text-gray-700 max-w-[120px] truncate">
                    {user.email}
                  </span>
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-52 bg-white rounded-2xl shadow-xl border border-rose-100 py-2 z-50">
                    <div className="px-4 py-2 border-b border-rose-50">
                      <p className="text-xs text-gray-400">เข้าสู่ระบบด้วย</p>
                      <p className="text-sm font-semibold text-gray-700 truncate">{user.email}</p>
                    </div>

                    {user.role === "admin" && (
                      <button
                        onClick={() => { setDropdownOpen(false); navigate("/admin"); }}
                        className="w-full text-left px-4 py-2.5 text-sm text-rose-600 hover:bg-rose-50 font-medium transition-colors"
                      >
                        🔧 Admin Dashboard
                      </button>
                    )}

                    <button
                      onClick={() => { setDropdownOpen(false); navigate("/history"); }}
                      className="w-full text-left px-4 py-2.5 text-sm text-gray-600 hover:bg-rose-50 flex items-center gap-2 transition-colors"
                    >
                      <History size={14} /> ประวัติสั่งซื้อ
                    </button>

                    <div className="border-t border-rose-50 mt-1 pt-1">
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors"
                      >
                        ออกจากระบบ
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-1 sm:gap-2">
                <Link
                  to="/login"
                  className="px-3 sm:px-4 py-1.5 text-sm font-medium text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                >
                  เข้าสู่ระบบ
                </Link>
                <Link
                  to="/register"
                  className="hidden sm:block px-4 py-1.5 text-sm font-bold text-white bg-gradient-to-r from-rose-500 to-pink-500 rounded-lg hover:from-rose-600 hover:to-pink-600 shadow-sm transition-all"
                >
                  สมัครสมาชิก
                </Link>
              </div>
            )}

            {/* Hamburger button - mobile only */}
            <button
              onClick={() => setMenuOpen((o) => !o)}
              className="sm:hidden p-2 rounded-lg hover:bg-rose-50 transition-colors"
              aria-label="เมนู"
            >
              {menuOpen
                ? <X size={20} className="text-gray-600" />
                : <Menu size={20} className="text-gray-600" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="sm:hidden border-t border-rose-100 py-2 space-y-1 pb-3">
            <NavLink
              to="/"
              end
              onClick={() => setMenuOpen(false)}
              className={({ isActive }) => (isActive ? activeNavLink : navLink)}
            >
              <Home size={15} /> หน้าหลัก
            </NavLink>
            <NavLink
              to="/shop"
              onClick={() => setMenuOpen(false)}
              className={({ isActive }) => (isActive ? activeNavLink : navLink)}
            >
              <Store size={15} /> ร้านค้า
            </NavLink>
            {!user && (
              <Link
                to="/register"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-bold text-white bg-gradient-to-r from-rose-500 to-pink-500 w-fit"
              >
                สมัครสมาชิก
              </Link>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default MainNav;
