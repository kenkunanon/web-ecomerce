import React from 'react'
import { Link, NavLink } from 'react-router-dom'
import useEcomStore from '../store/ecom-store'

const MainNav = () => {
  const carts = useEcomStore((s) => s.carts);
  return (
    <nav className="bg-gradient-to-r from-blue-900 to-black shadow-lg">
      <div className="mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex items-center gap-6">
            <Link to="/" className='text-2xl font-bold text-white hover:scale-105 transition-transform duration-300'>KEN SHOP</Link>
            <Link to="/" className='text-white hover:scale-105 transition-transform duration-300'>Home</Link>
            <Link to="/shop" className='text-white hover:scale-105 transition-transform duration-300'>Shop</Link>
            <NavLink
              className={({ isActive }) =>
                isActive
                  ? "bg-gray-200 px-3 py-2 rounded-md text-sm font-medium text-gray-800 hover:scale-105 transition-transform duration-300"
                  : "hover:bg-slate-200 px-3 py-2 rounded-md text-sm font-medium text-white hover:scale-105 transition-transform duration-300"
              }
              to={"/cart"}
            >
              Cart
              {carts.length > 0 && (
                <span
                  className="absolute top-0 bg-red-500 rounded-full px-2 text-white text-xs"
                >
                  {carts.length}
                </span>
              )}
            </NavLink>
          </div>

          <div className='flex items-center gap-6'>
            <Link to="/register" className='text-white hover:scale-105 transition-transform duration-300'>Register</Link>
            <Link to="/login" className='text-white hover:scale-105 transition-transform duration-300'>Login</Link>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default MainNav;