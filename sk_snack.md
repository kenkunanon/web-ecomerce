# SK_snack — Presentation Source Document

---

## Slide 1: ชื่อโปรเจกต์และภาพรวม

**ชื่อโปรเจกต์:** SK_snack — ระบบร้านค้าออนไลน์ขนมพรีเมียม

**สินค้าหลัก:** 🍫 Chocolate Brownie · 🍊 Orange Cake · 🍪 Cookie

**เป้าหมาย:** พัฒนาระบบ E-Commerce ครบวงจร ตั้งแต่หน้าบ้าน หลังบ้าน ฐานข้อมูล จนถึงการ Deploy บน Cloud จริง

🌐 **ทดลองใช้งานจริงได้ที่:** https://sk-snack.netlify.app

---

## Slide 2: Tech Stack ที่ใช้

**Frontend**
- ⚛️ React 18 + ⚡ Vite — UI Framework และ Build Tool
- 🎨 Tailwind CSS — Styling
- 🐻 Zustand — State Management
- 🔀 React Router v7 — Routing

**Backend**
- 🟩 Node.js + Express — Server Framework
- 🔺 Prisma ORM — Database Management
- 🔐 JWT + bcryptjs — Authentication

**Cloud Services**
- ☁️ Cloudinary — จัดเก็บรูปภาพสินค้า
- 💳 Stripe — ระบบชำระเงิน
- 🚀 Netlify — Deploy Frontend
- 🎯 Render — Deploy Backend
- 🗄️ Aiven — MySQL Cloud Database

---

## Slide 3: สถาปัตยกรรมระบบ (Architecture)

- ⚛️ Frontend และ 🟩 Backend แยกกันทำงานอิสระ สื่อสารผ่าน REST API
- 🚀 Frontend → **https://sk-snack.netlify.app**
- 🎯 Backend → `https://sk-snack-api.onrender.com`
- 🗄️ Database อยู่บน Aiven Cloud (MySQL)
- 🔐 ทุก Request แนบ JWT Token ใน Header เพื่อยืนยันตัวตน

---

## Slide 4: ฟีเจอร์ฝั่ง User

- 🏠 **Home:** สินค้าแนะนำ, เมนูยอดนิยม, ข้อมูลร้าน, QR Contact
- 🛍️ **Shop:** ค้นหาสินค้า, กรองหมวดหมู่, กรองช่วงราคา
- 🛒 **Cart:** เพิ่ม/ลด/ลบสินค้า, แสดงยอดรวม
- 📦 **สั่งซื้อ (COD):** กดสั่งซื้อ → บันทึก Order → ล้างตะกร้า
- 💳 **ชำระเงิน (Stripe):** กรอกบัตรเครดิต → ยืนยัน → บันทึก Order
- 📋 **ประวัติสั่งซื้อ:** ดูรายการที่เคยสั่ง พร้อมสถานะ

🌐 ทดลองได้จริงที่ https://sk-snack.netlify.app

---

## Slide 5: ฟีเจอร์ฝั่ง Admin

- 📦 **จัดการสินค้า:** เพิ่ม / แก้ไข / ลบ พร้อมอัปโหลดรูปผ่าน ☁️ Cloudinary
- 🏷️ **จัดการหมวดหมู่:** เพิ่ม / ลบ Category
- 👑 **จัดการพนักงาน:** เพิ่ม/ลบสิทธิ์ Admin
- 👤 **จัดการผู้ใช้:** เปิด/ปิด Account
- 📋 **คำสั่งซื้อ:** ดู Order ทั้งหมด, อัปเดตสถานะ (Processing / Shipped / Delivered)

---

## Slide 6: ระบบ Authentication (🔐 JWT)

- **Register:** กรอก Email + Password → เข้ารหัสด้วย 🔐 bcrypt → บันทึก DB
- **Login:** ตรวจรหัสผ่าน → ออก JWT Token อายุ 1 วัน
- **ทุก Request** ที่ต้องการสิทธิ์ต้องแนบ Token ใน Authorization Header
- แยก Middleware 2 ระดับ: `authCheck` (User) และ `adminCheck` (Admin)
- ระบบ Enable/Disable Account โดยไม่ต้องลบข้อมูล

---

## Slide 7: การจัดการ State (🐻 Zustand)

- เก็บ State ทั่วทั้งแอป: User, Token, สินค้า, ตะกร้า
- บันทึกลง **localStorage** อัตโนมัติ → Refresh หน้าแล้วข้อมูลยังอยู่
- ตะกร้าทำงาน Local ก่อน → ส่งไป 🗄️ DB เฉพาะตอนกดสั่งซื้อ

---

## Slide 8: การจัดการรูปภาพ (☁️ Cloudinary)

- อัปโหลดรูปผ่าน Cloudinary Upload Widget บนหน้า Admin
- โหลด Widget แบบ Dynamic เพื่อป้องกัน Error บน Production
- รูปถูกเก็บบน Cloudinary CDN → URL เก็บใน DB
- ลบสินค้า → ลบรูปออกจาก Cloudinary อัตโนมัติ

---

## Slide 9: การ Deploy บน Cloud ☁️

| ส่วน | Platform | URL |
|---|---|---|
| ⚛️ Frontend | 🚀 Netlify | sk-snack.netlify.app |
| 🟩 Backend | 🎯 Render | sk-snack-api.onrender.com |
| 🗄️ Database | Aiven | MySQL Cloud |

**สิ่งที่ต้องตั้งค่า:**
- Environment Variables บน Render และ Netlify (ห้าม Hardcode ใน Code)
- `_redirects` file สำหรับ ⚛️ React Router บน 🚀 Netlify
- CORS Whitelist ให้ Backend อนุญาต Netlify Domain

---

## Slide 10: ปัญหาที่พบและวิธีแก้

| ปัญหา | วิธีแก้ |
|---|---|
| 🔐 Login ขึ้น 500 บน Cloud | ลืมตั้ง `SECRET` ใน Render |
| ☁️ Cloudinary Widget พังบน Netlify | เปลี่ยนเป็น Dynamic Script Loading |
| 🔀 React Router ขึ้น 404 เมื่อ Refresh | เพิ่มไฟล์ `_redirects` |
| 🗄️ Prisma Error: `updatedAt` missing | Schema ไม่มี @default → ส่ง `new Date()` เอง |
| 🐧 รันบน Linux ไม่ได้ | แก้ Case Sensitivity ของชื่อไฟล์ใน Import |

---

## Slide 11: สิ่งที่ได้เรียนรู้

- ⚛️ การออกแบบ REST API และแยก Frontend / Backend อย่างถูกต้อง
- 🔐 การใช้ JWT สำหรับ Authentication แบบ Stateless
- ☁️ การจัดการ Environment Variables บน Cloud Platform
- 🐛 การ Debug ปัญหาเฉพาะ Production (CORS, Script Loading, Case Sensitivity)
- 🚀 ประสบการณ์ Deploy จริงบน Netlify + Render + Aiven

---

## Slide 12: Live Demo & สรุป

🌐 **ทดลองใช้งานได้เลยที่:**
# https://sk-snack.netlify.app

**SK_snack** คือโปรเจกต์ E-Commerce ที่พัฒนาครบทุกส่วน ตั้งแต่ ⚛️ UI/UX, 🟩 ระบบหลังบ้าน, 🗄️ ฐานข้อมูล, 💳 การชำระเงิน จนถึง ☁️ Deploy บน Cloud จริง

**Stack:** ⚛️ React · ⚡ Vite · 🟩 Node.js · 🔺 Prisma · 🗄️ MySQL · ☁️ Cloudinary · 💳 Stripe · 🚀 Netlify · 🎯 Render
