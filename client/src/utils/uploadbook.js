import axios from "axios";

const uploadCloudinary = async (file) => {
  const data = new FormData();
  data.append("file", file);
  data.append("upload_preset", "lib-collections"); // Ganti dengan preset upload Cloudinary Anda
  data.append("cloud_name", "alfianmna"); // Ganti dengan Cloud Name Anda

  try {
    const res = await axios.post("https://api.cloudinary.com/v1_1/alfianmna/auto/upload", data);
    return res.data.secure_url;
  } catch (err) {
    console.error("Cloudinary upload error:", err);
    throw new Error("Gagal mengunggah file ke Cloudinary.");
  }
};

export default uploadCloudinary;
