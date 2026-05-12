import React, { useEffect, useRef, useState } from "react";
import useEcomStore from "../../store/ecom-store";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import { Search, Tag, SlidersHorizontal } from "lucide-react";

const SearchCard = () => {
  const getProduct = useEcomStore((state) => state.getProduct);
  const actionSearchFilters = useEcomStore((state) => state.actionSearchFilters);
  const getCategory = useEcomStore((state) => state.getCategory);
  const categories = useEcomStore((state) => state.categories);
  const [text, setText] = useState("");
  const [categorySelected, setCategorySelected] = useState([]);
  const [price, setPrice] = useState([0, 50000]);
  const [ok, setOk] = useState(false);
  const priceFilterMounted = useRef(false);

  useEffect(() => { getCategory(); }, []);

  useEffect(() => {
    const delay = setTimeout(() => {
      if (text) { actionSearchFilters({ query: text }); }
      else { getProduct(20); }
    }, 300);
    return () => clearTimeout(delay);
  }, [text]);

  useEffect(() => {
    if (!priceFilterMounted.current) { priceFilterMounted.current = true; return; }
    actionSearchFilters({ price });
  }, [ok]);

  const handlePrice = (value) => {
    setPrice(value);
    setTimeout(() => setOk((o) => !o), 300);
  };

  const handleCheck = (e) => {
    const inCheck = e.target.value;
    const inState = [...categorySelected];
    const findCheck = inState.indexOf(inCheck);
    if (findCheck === -1) inState.push(inCheck);
    else inState.splice(findCheck, 1);
    setCategorySelected(inState);
    if (inState.length > 0) actionSearchFilters({ category: inState });
    else getProduct(20);
  };

  return (
    <div className="space-y-5">
      {/* Title */}
      <div className="flex items-center gap-2">
        <div className="bg-rose-100 p-1.5 rounded-lg">
          <Search size={16} className="text-rose-500" />
        </div>
        <h2 className="font-bold text-gray-800 text-base">ค้นหาสินค้า</h2>
      </div>

      {/* Search input */}
      <div className="relative">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="ค้นหาขนม..."
          onChange={(e) => setText(e.target.value)}
          className="w-full pl-9 pr-4 py-2 rounded-xl border border-rose-200 bg-white text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-rose-300 focus:border-transparent transition"
        />
      </div>

      <div className="border-t border-rose-100" />

      {/* Categories */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Tag size={14} className="text-rose-400" />
          <h3 className="text-sm font-semibold text-gray-700">หมวดหมู่</h3>
        </div>
        <div className="space-y-2">
          {categories.map((item) => (
            <label
              key={item.id}
              className="flex items-center gap-2.5 cursor-pointer group"
            >
              <input
                type="checkbox"
                value={item.id}
                onChange={handleCheck}
                className="w-4 h-4 accent-rose-500 rounded"
              />
              <span className="text-sm text-gray-600 group-hover:text-rose-500 transition-colors">
                {item.name}
              </span>
            </label>
          ))}
          {categories.length === 0 && (
            <p className="text-xs text-gray-400 italic">ไม่พบหมวดหมู่</p>
          )}
        </div>
      </div>

      <div className="border-t border-rose-100" />

      {/* Price range */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <SlidersHorizontal size={14} className="text-rose-400" />
          <h3 className="text-sm font-semibold text-gray-700">ช่วงราคา</h3>
        </div>
        <div className="flex justify-between text-xs text-rose-500 font-semibold mb-3">
          <span>฿{price[0].toLocaleString()}</span>
          <span>฿{price[1].toLocaleString()}</span>
        </div>
        <Slider
          onChange={handlePrice}
          range
          min={0}
          max={50000}
          defaultValue={[0, 50000]}
          trackStyle={[{ backgroundColor: "#f43f5e" }]}
          handleStyle={[
            { borderColor: "#f43f5e", backgroundColor: "#fff" },
            { borderColor: "#f43f5e", backgroundColor: "#fff" },
          ]}
          railStyle={{ backgroundColor: "#fecdd3" }}
        />
      </div>
    </div>
  );
};

export default SearchCard;
