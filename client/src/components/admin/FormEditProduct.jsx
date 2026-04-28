import React,{use, useEffect,useState} from 'react'
import useEcomStore from '../../store/ecom-store'
import {  createProduct,
    readProduct,
    listProduct,
    updateProduct} from '../../api/product'
import { toast } from 'react-toastify';
import Uploadfile from './Uploadfile';
import { useParams,useNavigate } from 'react-router-dom';
const initialState = {
  title: "",
  description: "",
  price: '',
  quantity: '',
  categoryId: "",
  images: [],
};

const FormEditProduct = () => {
  const {id} = useParams()
  const navigate = useNavigate()
  const token = useEcomStore((state) => state.token)
  const getCategory = useEcomStore((state) => state.getCategory)
  const categories = useEcomStore((state) => state.categories) 
 
  
  const [form, setForm] = useState(initialState)
   
  
  useEffect(() => {
    getCategory()
    fetchProduct(token, id, form)
  }, [])
  
  const fetchProduct = async(token) => {
      try {
        const res = await readProduct(token, id, form)
            console.log('res from backend', res)
            setForm(res.data)
      } catch (error) { 
        console.log(error)
      }
    }

  const handleSubmit = async(e) => {
    e.preventDefault()
    try {
      const res = await updateProduct(token,id, form)
      
      toast.success(`Add Product ${res.data.title} success!!!`)
      navigate('/admin/product')
    } catch (error) {
      console.log(error)

    } 
  };
  
  const handleOnChange = (e) => {
    console.log(e.target.name, e.target.value);
    setForm({ ...form, 
      [e.target.name]: e.target.value });
    
  };
  return (
    <div className="container mx-auto p-4 bg-white shadow-md">
      <form onSubmit={handleSubmit}>
        <h1>เพิ่มข้อมูลสินค้า</h1>
        <input
          className="border"
          value={form.title}
          onChange={handleOnChange}
          placeholder="Title"
          name="title"
        />
         <input
          className="border"
          value={form.description}
          onChange={handleOnChange}
          placeholder="description"
          name="description"
        />
          <input
          type="number"
          className="border"
          value={form.price}
          onChange={handleOnChange}
          placeholder="price"
          name="price"
        />
          <input
          type="number"
          className="border"
          value={form.quantity}
          onChange={handleOnChange}
          placeholder="quantity"
          name="quantity"
        />
        <select className='border' name='categoryId' onChange={handleOnChange}
        required value={form.categoryId}>
          <option value=''disabled>Please Select</option>
          {
            categories.map((item,index) => (
             
              <option key={index} value={item.id}>{item.name}</option>
             ))
          }
         
        </select>
        <hr/>

       <Uploadfile form={form}  setForm={setForm}/>
              


        <button className="bg-blue-500">Edit Product</button>
        <hr/>
        <div className="container mx-auto p-4 bg-white shadow-md">
      <h1>Product List</h1>
      
    </div>
       </form>
    </div>
  )
}

export default FormEditProduct
