import React, { useState, useEffect } from 'react'
import { createCategory, listCategory, removeCategory } from '../../api/Category'
import useEcomStore from '../../store/ecom-store'
import { toast } from 'react-toastify'

const FormCategory = () => {
    // Javascript
    const token = useEcomStore((state) => state.token)
    const [name, setName] = useState('')
    const categories = useEcomStore((state) => state.categories)
    const getCategory = useEcomStore((state) => state.getCategory)
    
    useEffect(() => {
        getCategory(token)
    }, [])
     
    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!name) {
            return toast.warning('Please fill data')
        }
        try {
            const res = await createCategory(token, { name })
            console.log(res.data.name)
            toast.success(`Add Category ${res.data.name} success!!!`)
            getCategory(token)
        } catch (err) {
            console.log(err)
        }
    }

    const handleRemove = async(id) => {
        console.log(id)
        try {
            const res = await removeCategory(token, id)
            console.log(res)
            toast.success(`Deleted ${res.data.name} success`)
            getCategory(token)
        } catch (err) {
            console.log(err)
        }
    }

    return (
        <div className='container mx-auto p-6 bg-cyan-700 shadow-lg rounded-lg'>
            <h1 className='text-3xl font-bold text-center text-cyan-200 mb-4'>Category Management</h1>
            <form className='my-4 flex flex-col items-center' onSubmit={handleSubmit}>
                <input
                    onChange={(e) => setName(e.target.value)}
                    className='w-full max-w-md px-4 py-2 mb-4 rounded bg-gray-200 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                    type='text'
                    placeholder='Enter category name'
                />
                <button className='w-full max-w-md py-2 rounded bg-blue-500 text-white font-bold shadow-lg hover:bg-blue-700 transition-all'>
                    Add Category
                </button>
            </form>

            <hr className='my-4 border-gray-300' />

            <ul className='list-none'>
                {categories.map((item, index) => (
                    <li
                        className='flex justify-between items-center my-2 p-2 bg-gray-100 rounded'
                        key={index}
                    >
                        <span className='text-gray-800'>{item.name}</span>
                        <button
                            className='py-1 px-3 rounded bg-red-500 text-white font-bold shadow-lg hover:bg-red-700 transition-all'
                            onClick={() => handleRemove(item.id)}
                        >
                            Delete
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default FormCategory