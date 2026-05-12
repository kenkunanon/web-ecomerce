import React, { useState } from 'react'
import { toast } from 'react-toastify';
import { removeFiles } from '../../api/product';
import useEcomStore from '../../store/ecom-store';
import { Loader } from 'lucide-react';

const Uploadfile = ({ form, setForm }) => {
  const token = useEcomStore((state) => state.token)
  const [isLoading, setIsLoading] = useState(false)

  const openCloudinaryWidget = (e) => {
    e.preventDefault(); // ป้องกันฟอร์ม submit ตอนกดปุ่ม
    
    let widget = window.cloudinary.createUploadWidget(
      {
        cloudName: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME,
        uploadPreset: import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET,
        sources: ["local", "url", "camera", "image_search"],
        multiple: true,
        folder: "webecommerce", 
      },
      (error, result) => {
        if (!error && result && result.event === "success") {
          // ดึงข้อมูลรูปที่อัปโหลดเสร็จแล้วมาเก็บใน form.images
          const newImage = {
            asset_id: result.info.asset_id,
            public_id: result.info.public_id,
            url: result.info.url,
            secure_url: result.info.secure_url
          };

          setForm((prev) => ({
            ...prev,
            images: [...prev.images, newImage]
          }));
          
          toast.success('อัปโหลดรูปภาพสำเร็จ!');
        }
      }
    );
    widget.open();
  };

  const handleDelete = async (public_id) => {
    const images = form.images
    if (window.confirm("Do you sure to delete?")) {
      try {
        const filterImages = images.filter((item) =>{
          return item.public_id !== public_id
        } )
        setForm({
          ...form,
          images: filterImages
        })
        removeFiles(token, public_id)
        toast.success("Deleted รูปภาพเรียบร้อยแล้ว");
      } catch (err) {
        console.log(err);
      }
    }
  };

  return (
    <div className='my-4'>
      <div className='flex mx-4 gap-4 my-4'>
        {isLoading && <Loader className='w-16 h-16 animate-spin'/>}
        
        {form.images.map((item, index) => (
          <div className='relative' key={index} >
            <img
             className='w-24 h-24 hover:scale-110 transition duration-500'
             src={item.url} style={{ width: '100px', objectFit: 'cover' }} />
            <span onClick={() => handleDelete(item.public_id)}
            className='absolute top-0 right-0 bg-red-500 p-1 rounded cursor-pointer text-white text-xs' >X</span>
          </div>
        ))}
      </div>

      <div>
        {/* เปลี่ยน Input แบบเก่า เป็นปุ่มเรียก Cloudinary Widget */}
        <button 
          onClick={openCloudinaryWidget}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-all shadow-md"
        >
          เลือกรูปภาพจาก Cloudinary
        </button>
      </div>
    </div>
  )
}

export default Uploadfile