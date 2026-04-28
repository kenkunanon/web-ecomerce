import React, { useEffect, useState } from "react";
import useEcomStore from "../../store/ecom-store";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
const SearchCard = () => {
    const getProduct = useEcomStore((state) => state.getProduct);
    const products = useEcomStore((state) => state.products);
    const actionSearchFilters = useEcomStore((state) => state.actionSearchFilters);
    const [text, setText] = useState('');
    const getCategory = useEcomStore((state) => state.getCategory);
    const categories = useEcomStore((state) => state.categories);
    const [categorySelected, setCategorySelected] = useState([]);
    const [price, setPrice] = useState([0, 50000]);
    const [ok, setOk] = useState(false);

    useEffect(() => {
        getCategory();
    }, []);



    useEffect(() => {
        const delay = setTimeout(() => {
            actionSearchFilters({ query: text })
            if (!text) {
                getProduct()
            }
        }, 300);
        return () => clearTimeout(delay);
    }, [text]);

    useEffect(() => {
        actionSearchFilters({ price
        });
    }, [ok]);
    const handlePrice = (value) => {
        setPrice(value);
        setTimeout(() => {
            setOk(!ok);
        }, 300);
        
    }

    const handleCheck = (e) => {
        // console.log(e.target.value)
        const inCheck = e.target.value; // ค่าที่เรา ติ๊ก
        const inState = [...categorySelected]; // [1,2,3] arr ว่าง
        const findCheck = inState.indexOf(inCheck); // ถ้าไม่เจอ จะ return -1
    
        if (findCheck === -1) {
          inState.push(inCheck);
        } else {
          inState.splice(findCheck, 1);
        }
        setCategorySelected(inState);
    
        if (inState.length > 0) {
          actionSearchFilters({ category: inState });
        } else {
          getProduct();
        }
      };


    return (
        <div>
            <h1 className="text-xl font-bold mb-4">ค้นหาสินค้า</h1>
            <input
                onChange={(e) => setText(e.target.value)}
                type="text"
                placeholder="ค้นหาสินค้า...."
                className="border rounded-md w-full mb-4 px-2"
            />
            <hr />
            <div>
                <h1>หมวดหมู่</h1>
                <div>
                    {categories.map((item, index) => 
                    <div key={index} className="flex gap-2">
                    <input onChange={handleCheck} value={item.id} 
                    type="checkbox"/>
                    <label>{item.name}</label>
                    </div>
                    )}
                </div>
            </div>
            <hr />
            <div>
                <div className="flex justify-between">
                <h1>Find price</h1>
                <span>Min : {price[0]}</span>
                <span>Max : {price[1]}</span>
                </div>
            <div><Slider
                onChange={handlePrice}
                range
                min={0}
                max={50000}
                defaultValue={[100, 30000]}
            />
            </div>
        </div>
        </div>
    )
}

export default SearchCard
