const cloudinary = require("cloudinary").v2;
const { errorResMsg, successResMsg } = require('./response')

cloudinary.config({
  cloud_name: process.env.ZIGARA_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.ZIGARA_CLOUDINARY_API_KEY,
  api_secret: process.env.ZIGARA_CLOUDINARY_API_SECRET,
});

const cloudinaryUploadMethod = async file => {
  // return new Promise(resolve => {
  //   console.log(file)
  //   cloudinary.uploader.upload(file, (err, res) => {
  //     // if (err) return res.status(500).send("upload file error")
  //     if(err) return res.statu(500).json({ message: err })
  //     console.log(res.secure_url)
  //     // return res.secure_url
  //     resolve({
  //       res: res.secure_url
  //     })
  //   }
  //   )
  // })
};


module.exports = {
  cloudinary
} 