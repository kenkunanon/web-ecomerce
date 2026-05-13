import React from "react";
import { ShoppingCart } from "lucide-react";
import useEcomStore from "../../store/ecom-store";
import { motion } from "framer-motion";

const ProductCard = ({ item }) => {
  const actionAddtoCart = useEcomStore((state) => state.actionAddtoCart);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="w-full"
    >
      <div className="bg-white rounded-2xl shadow-sm border border-rose-100 overflow-hidden hover:shadow-md hover:-translate-y-1 transition-all duration-200 group">
        {/* Image */}
        <div className="relative overflow-hidden bg-rose-50 h-32">
          {item.image && item.image.length > 0 ? (
            <img
              src={item.image[0].url}
              alt={item.title}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-3xl">
              🍰
            </div>
          )}
        </div>

        {/* Body */}
        <div className="p-3">
          <p className="font-bold text-gray-800 text-sm truncate">{item.title}</p>
          <p className="text-xs text-gray-400 truncate mt-0.5">{item.description}</p>

          <div className="flex justify-between items-center mt-3">
            <span className="text-rose-500 font-extrabold text-sm">
              ฿{item.price?.toLocaleString()}
            </span>
            <button
              onClick={() => actionAddtoCart(item)}
              className="bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white p-1.5 rounded-lg shadow active:scale-90 transition-all duration-150"
            >
              <ShoppingCart size={15} />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
