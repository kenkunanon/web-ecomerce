const tf = require("@tensorflow/tfjs-node");
const sharp = require("sharp");
const fs = require("fs");
const path = require("path");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();
let model;

// โหลดโมเดล grilled.h5
(async () => {
  try {
    const modelPath = path.join(__dirname, "grilled_meat_cnn2.h5");
    model = await tf.loadLayersModel(`file://${modelPath}`);
    console.log("Model loaded successfully");
  } catch (error) {
    console.error("Error loading model:", error);
  }
})();

exports.ModelPredict = async (req, res) => {
  const { fileName } = req.body;

  try {
    // อ่านไฟล์ภาพที่อัปโหลด
    const imagePath = path.join(__dirname, "./niku", fileName);
    const imageBuffer = fs.readFileSync(imagePath);

    // ใช้ sharp เพื่อปรับขนาดภาพ
    const resizedImageBuffer = await sharp(imageBuffer)
      .resize(224, 224) // ปรับขนาดเป็น 224x224
      .toBuffer();

    // แปลงภาพเป็น Tensor
    const tensor = tf.node.decodeImage(resizedImageBuffer)
      .toFloat()
      .expandDims();

    // ทำการพยากรณ์
    const prediction = model.predict(tensor);
    const predictedClass = prediction.argMax(-1).dataSync()[0]; // ดึงค่าคลาสที่พยากรณ์ได้

    // บันทึกผลลัพธ์ลงในฐานข้อมูล
    const savedPrediction = await prisma.prediction.create({
      data: {
        fileName: fileName,
        result: predictedClass.toString(), // บันทึกผลลัพธ์เป็นสตริง
      },
    });

    res.status(200).json({
      message: "Prediction successful",
      prediction: predictedClass,
      savedPrediction, // ส่งข้อมูลที่บันทึกกลับไปด้วย
    });
  } catch (error) {
    console.error("Error during prediction:", error);
    res.status(500).json({ error: "Failed to process prediction" });
  }
};