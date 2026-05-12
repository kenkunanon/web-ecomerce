import React from 'react'
import { Link } from 'react-router-dom'
import { Home } from 'lucide-react'
import useEcomStore from '../../store/ecom-store'

const HeaderAdmin = () => {
    const user = useEcomStore((s) => s.user)

    return (
        <header className='bg-white h-16 flex items-center justify-between px-6 shadow-sm'>
            <span className='text-gray-500 text-sm'>
                ยินดีต้อนรับ, <span className='font-semibold text-gray-800'>{user?.email}</span>
            </span>
            <Link
                to='/'
                className='flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-md transition-colors'
            >
                <Home size={16} />
                หน้าหลัก
            </Link>
        </header>
    )
}

export default HeaderAdmin