import React, { useEffect, useState } from 'react'
import useEcomStore from '../../store/ecom-store'
import { createProduct, deleteProduct } from '../../api/product'
import { toast } from 'react-toastify';
import Uploadfile from './Uploadfile';
import { Link } from 'react-router-dom';

const initialState = {
  title: "",
  description: "",
  price: '',
  quantity: '',
  categoryId: "",
  images: [],
}

const FormProduct = () => {
  const token = useEcomStore((state) => state.token)
  const getCategory = useEcomStore((state) => state.getCategory)
  const categories = useEcomStore((state) => state.categories)
  const getProduct = useEcomStore((state) => state.getProduct)
  const products = useEcomStore((state) => state.products)

  const [form, setForm] = useState(initialState)

  useEffect(() => {
    getCategory()
    getProduct(20)
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const res = await createProduct(token, form)
      setForm(initialState)
      getProduct()
      toast.success(`Add Product ${res.data.title} success!!!`)
    } catch (error) {
      console.log(error)
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Do you confirm to delete?")) {
      try {
        const res = await deleteProduct(token, id);
        console.log(res);
        toast.success("Deleted successfully");
        getProduct();
      } catch (err) {
        console.log(err);
      }
    }
  };

  const handleOnChange = (e) => {
    console.log(e.target.name, e.target.value);
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="container mx-auto p-4 bg-white shadow-md">
      <form onSubmit={handleSubmit}>
        <h1>เพิ่มข้อมูลสินค้า</h1>
        <input
          className="border mb-2 p-2 w-full"
          value={form.title}
          onChange={handleOnChange}
          placeholder="Title"
          name="title"
        />
        <input
          className="border mb-2 p-2 w-full"
          value={form.description}
          onChange={handleOnChange}
          placeholder="Description"
          name="description"
        />
        <input
          type="number"
          className="border mb-2 p-2 w-full"
          value={form.price}
          onChange={handleOnChange}
          placeholder="Price"
          name="price"
        />
        <input
          type="number"
          className="border mb-2 p-2 w-full"
          value={form.quantity}
          onChange={handleOnChange}
          placeholder="Quantity"
          name="quantity"
        />
        <select
          className="border mb-2 p-2 w-full"
          name="categoryId"
          onChange={handleOnChange}
          required
          value={form.categoryId}
        >
          <option value="" disabled>Please Select</option>
          {categories.map((item, index) => (
            <option key={index} value={item.id}>{item.name}</option>
          ))}
        </select>
        <hr className="my-4" />
        <Uploadfile form={form} setForm={setForm} />
        <button className="w-full py-2 rounded bg-blue-500 text-white font-bold shadow-lg hover:bg-blue-700 transition-all">
          Add Product
        </button>
        <hr className="my-4" />
        <div className="container mx-auto p-4 bg-white shadow-md">
          <h1>Product List</h1>
          <table className="min-w-full bg-white">
            <thead>
              <tr>
                <th className="py-2">No.</th>
                <th className="py-2">Picture</th>
                <th className="py-2">Title</th>
                <th className="py-2">Description</th>
                <th className="py-2">Price</th>
                <th className="py-2">Quantity</th>
                <th className="py-2">Category</th>
                <th className="py-2">Sold</th>
                <th className="py-2">UpdatedAt</th>
                <th className="py-2">Edit/Delete</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product, index) => (
                <tr key={product.id}>
                  <td className="border px-4 py-2">{index + 1}</td>
                  <td className="border px-4 py-2">
                    {product.images && product.images.length > 0 ? (
                      <img
                        className="w-24 h-24 rounded-lg shadow-md"
                        src={product.images[0]?.url}
                        alt="Product"
                      />
                    ) : (
                      <div className="w-24 h-24 bg-gray-200 rounded-md flex items-center justify-center shadow-sm">
                        No Image
                      </div>
                    )}
                  </td>
                  <td className="border px-4 py-2">{product.title}</td>
                  <td className="border px-4 py-2">{product.description}</td>
                  <td className="border px-4 py-2">{product.price}</td>
                  <td className="border px-4 py-2">{product.quantity}</td>
                  <td className="border px-4 py-2">{product.categoryId}</td>
                  <td className="border px-4 py-2">{product.sold}</td>
                  <td className="border px-4 py-2">{new Date(product.updatedAt).toLocaleString()}</td>
                  <td className="border px-4 py-2">
                    <button className="bg-blue-500 px-2 py-1 text-white rounded hover:bg-blue-700 transition-all">
                      <Link to={'/admin/product/' + product.id}>Edit</Link>
                    </button>
                    <button
                      className="bg-red-500 px-2 py-1 text-white rounded ml-2 hover:bg-red-700 transition-all"
                      onClick={() => handleDelete(product.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </form>
    </div>
  )
}

export default FormProduct