import React, { useState, useEffect } from 'react'
import { toast } from 'react-toastify';
import { removeFiles } from '../../api/product';
import useEcomStore from '../../store/ecom-store';
import { Loader, ImagePlus } from 'lucide-react';

const CLOUDINARY_SCRIPT = 'https://upload-widget.cloudinary.com/global/all.js';

const Uploadfile = ({ form, setForm }) => {
  const token = useEcomStore((state) => state.token)
  const [isLoading, setIsLoading] = useState(false)
  const [scriptReady, setScriptReady] = useState(false)

  // โหลด Cloudinary script แบบ dynamic และรอให้โหลดเสร็จก่อน
  useEffect(() => {
    if (window.cloudinary) {
      setScriptReady(true);
      return;
    }

    const existing = document.querySelector(`script[src="${CLOUDINARY_SCRIPT}"]`);
    if (existing) {
      existing.addEventListener('load', () => setScriptReady(true));
      return;
    }

    const script = document.createElement('script');
    script.src = CLOUDINARY_SCRIPT;
    script.async = true;
    script.onload = () => setScriptReady(true);
    script.onerror = () => toast.error('โหลด Cloudinary ไม่สำเร็จ');
    document.body.appendChild(script);
  }, []);

  const openCloudinaryWidget = (e) => {
    e.preventDefault();

    if (!scriptReady || !window.cloudinary) {
      toast.warning('กรุณารอสักครู่ ระบบกำลังโหลด...');
      return;
    }

    const widget = window.cloudinary.createUploadWidget(
      {
        cloudName: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME,
        uploadPreset: import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET,
        sources: ['local', 'url', 'camera'],
        multiple: true,
        folder: 'webecommerce',
      },
      (error, result) => {
        if (error) {
          console.error('Cloudinary error:', error);
          toast.error('เกิดข้อผิดพลาดในการอัปโหลด');
          return;
        }
        if (result && result.event === 'success') {
          const newImage = {
            asset_id: result.info.asset_id,
            public_id: result.info.public_id,
            url: result.info.url,
            secure_url: result.info.secure_url,
          };
          setForm((prev) => ({ ...prev, images: [...prev.images, newImage] }));
          toast.success('อัปโหลดรูปภาพสำเร็จ!');
        }
      }
    );

    // guard: widget อาจเป็น null ถ้า config ผิด
    if (!widget) {
      toast.error('ไม่สามารถเปิด Widget ได้ ตรวจสอบ Cloud Name / Upload Preset');
      return;
    }

    widget.open();
  };

  const handleDelete = async (public_id) => {
    if (!window.confirm('ยืนยันลบรูปภาพ?')) return;
    try {
      setForm((prev) => ({
        ...prev,
        images: prev.images.filter((img) => img.public_id !== public_id),
      }));
      await removeFiles(token, public_id);
      toast.success('ลบรูปภาพเรียบร้อยแล้ว');
    } catch (err) {
      console.error(err);
      toast.error('ลบรูปภาพไม่สำเร็จ');
    }
  };

  return (
    <div className="my-4">
      <div className="flex flex-wrap gap-4 mb-4">
        {isLoading && <Loader className="w-10 h-10 animate-spin text-gray-400" />}
        {form.images.map((item, index) => (
          <div className="relative" key={index}>
            <img
              className="w-24 h-24 object-cover rounded-md border"
              src={item.url}
              alt="uploaded"
            />
            <button
              onClick={() => handleDelete(item.public_id)}
              className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-bl-md px-1.5 py-0.5 hover:bg-red-700"
            >
              ✕
            </button>
          </div>
        ))}
      </div>

      <button
        onClick={openCloudinaryWidget}
        disabled={!scriptReady}
        className="flex items-center gap-2 bg-green-500 hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg shadow transition-all"
      >
        {scriptReady ? (
          <>
            <ImagePlus size={16} /> เลือกรูปภาพจาก Cloudinary
          </>
        ) : (
          <>
            <Loader size={16} className="animate-spin" /> กำลังโหลด...
          </>
        )}
      </button>
    </div>
  );
};

export default Uploadfile;
