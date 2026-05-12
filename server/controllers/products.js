const prisma = require('../config/prisma');
const cloudinary = require('cloudinary').v2;

cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET// Click 'View API Keys' above to copy your API secret
});
exports.create = async (req, res) => {
    try {
        const { title, description, price, quantity, categoryId, images, promotion } = req.body

        const missing = []
        if (!title) missing.push('title')
        if (price === undefined || price === '') missing.push('price')
        if (quantity === undefined || quantity === '') missing.push('quantity')
        if (!categoryId) missing.push('categoryId')
        if (!images || images.length === 0) missing.push('images')
        if (missing.length > 0) {
            return res.status(400).json({ message: `Missing required fields: ${missing.join(', ')}` })
        }

        const product = await prisma.product.create({
            data: {
                title: title,
                description: description,
                price: parseFloat(price) || 0.0,
                quantity: parseInt(quantity),
                categoryId: parseInt(categoryId),
                promotion: promotion,
                updatedAt: new Date(),
                image: {
                    create: images.map((item) => ({
                        asset_id: item.asset_id,
                        public_id: item.public_id,
                        url: item.url,
                        secure_url: item.secure_url,
                        updatedAt: new Date()
                    }))
                }
            }
        })
        res.send(product)
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: "Server error" })
    }
}

exports.list = async (req, res) => {
    try {
        // code
        const { count } = req.params
        const products = await prisma.product.findMany({
            take: parseInt(count),
            orderBy: { createdAt: "desc" },
            include: {
                category: true,
                image: true
            }
        })
        res.send(products)
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: "Server error" })
    }
}

exports.read = async (req, res) => {
    try {
        // code
        const { id } = req.params
        const products = await prisma.product.findFirst({
            where: {
                id: Number(id)
            },
            include: {
                category: true,
                image: true
            }
        })
        res.send(products)
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: "Server error" })
    }
}


exports.update = async (req, res) => {
    try {
        // รับ promotion เข้ามาด้วย
        const { title, description, price, quantity, categoryId, images, promotion } = req.body

        await prisma.image.deleteMany({
            where: {
                productId: parseInt(req.params.id)
            }
        })

        const product = await prisma.product.update({
            where: {
                id: parseInt(req.params.id)
            },
            data: {
                title: title,
                description: description,
                price: parseFloat(price),
                quantity: parseInt(quantity),
                categoryId: parseInt(categoryId),
                promotion: promotion,
                image: {
                    create: images.map((item) => ({
                        asset_id: item.asset_id,
                        public_id: item.public_id,
                        url: item.url,
                        secure_url: item.secure_url,
                        updatedAt: new Date()
                    }))
                }
            }
        })
        res.send(product)
    } catch (err) {
        console.log(err);
        res.status(500).send('Server error');
    }
}


exports.remove = async (req, res) => {
    try {
        const { id } = req.params;

        // ✅ ค้นหาสินค้าที่ต้องการลบ พร้อมดึงข้อมูลรูปภาพ
        const product = await prisma.product.findFirst({
            where: {
                id: parseInt(id) // ✅ แก้ `where`
            },
            include: {
                image: true
            }
        });

        // ✅ ตรวจสอบว่าเจอสินค้าไหม
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        // ✅ ลบรูปภาพจาก Cloudinary
        const deletedImagePromises = product.image.map((image) =>
            new Promise((resolve, reject) => {
                cloudinary.uploader.destroy(image.public_id, (err, result) => {
                    if (err) reject(err);
                    else resolve(result);
                });
            })
        );
        await Promise.all(deletedImagePromises);

        // ✅ ลบรูปภาพจากฐานข้อมูล
        await prisma.image.deleteMany({
            where: {
                productId: parseInt(id)
            }
        });

        // ✅ ลบสินค้า
        await prisma.product.delete({
            where: {
                id: parseInt(id)
            }
        });

        res.json({ message: "Product deleted successfully" });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Server error" });
    }
};


exports.listby = async (req, res) => {
    try {
        // code
        const { sort, order, limit } = req.body
        console.log(sort, order, limit)
        const products = await prisma.product.findMany({
            take: limit,
            orderBy: { [sort]: order },
            include: {
                category: true,
                image: true
            }
        })
        res.send(products)
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: "Server error" })
    }
}

const handleQuery = async (req, res, query) => {
    try {
        //code
        const products = await prisma.product.findMany({
            where: {
                title: {
                    contains: query,
                }
            },
            include: {
                category: true,
                image: true
            }

        })
        res.send(products)
    } catch (err) {
        //err
        console.log(err)
        res.status(500).json({ message: "Search Error" })
    }
}

const handlePrice = async (req, res, priceRange) => {
    try {
        const products = await prisma.product.findMany({
            where: {
                price: {
                    gte: priceRange[0],
                    lte: priceRange[1]
                }
            },
            include: {
                category: true,
                image: true
            }
        })
        res.send(products)
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: 'Server Error ' })
    }
}
const handleCategory = async (req, res, categoryId) => {
    try {
        const products = await prisma.product.findMany({
            where: {
                categoryId: {
                    in: categoryId.map((id) => Number(id))
                }
            },
            include: {
                category: true,
                image: true
            }
        })
        res.send(products)
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: 'Server Error ' })
    }
}

exports.searchFilters = async (req, res) => {
    try {
        const { query, category, price } = req.body

        if (query) {
            return await handleQuery(req, res, query)
        }
        if (category) {
            return await handleCategory(req, res, category)
        }
        if (price) {
            return await handlePrice(req, res, price)
        }

        res.json([])
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: "Server error" })
    }
}



exports.createImages = async (req, res) => {
    try {
        const result = await cloudinary.uploader.upload(req.body.image, {
            public_id: `KEN-${Date.now()}`,
            resource_type: 'auto',
            folder: 'webecommerce'
        })
        res.send(result)
    } catch (err) {
        //err
        console.log(err)
        res.status(500).json({ message: "Server Error" })
    }
}
exports.removeImage = async (req, res) => {
    try {
        //code
        const { public_id } = req.body
        // console.log(public_id)
        cloudinary.uploader.destroy(public_id, (result) => {
            res.send('Remove Image Success!!!')
        })

    } catch (err) {
        //err
        console.log(err)
        res.status(500).json({ message: "Server Error" })
    }
}
