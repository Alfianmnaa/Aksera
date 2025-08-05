import { useState, useContext, useRef, use, useEffect } from "react";
import { axiosInstance } from "../../config";
import { UserContext } from "../../context/UserContext";
import pensil from "../../assets/EditProfil/pensil.png";
import upload from "../../utils/upload";
import Swal from "sweetalert2";

function EditProfilForm() {
  const { user } = useContext(UserContext);
  const [formData, setFormData] = useState({
    namaLengkap: "",
    username: "",
    email: "",
    fotoProfil: null,
    bio: "",
    noWa: "",
    linkedinUrl: "",
    instagramUrl: "",
    pernyataanUrl: "",
  });

  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        username: user.username || "",
        email: user.email || "",
      }));
    }
  }, [user]);

  const [filePreview, setFilePreview] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (user?._id) {
      fetchUserDetail();
    }
  }, [user]);

  const fetchUserDetail = async () => {
    try {
      const res = await axiosInstance.get(`/detil/get/${user._id}`);
      const userData = res.data;
      setFormData((prev) => ({
        ...prev,
        namaLengkap: userData.namaLengkap || "",
        fotoProfil: userData.fotoProfil || null,
        bio: userData.bio || "",
        noWa: userData.noWa || "",
        linkedinUrl: userData.linkedinUrl || "",
        instagramUrl: userData.instagramUrl || "",
        pernyataanUrl: userData.pernyataanUrl || "",
      }));
    } catch (error) {
      console.error("Error fetching user detail:", error);
    }
  };

  // logika no wa dimulaid dari 62
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "noWa") {
      if (/[^0-9]/.test(value)) return;

      let newValue = value;
      if (value.startsWith("0")) {
        newValue = "62" + value.slice(1);
      }

      setFormData((prev) => ({ ...prev, [name]: newValue }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setFormData((prev) => ({ ...prev, fotoProfil: file }));
    setFilePreview({
      url: URL.createObjectURL(file),
      name: file.name,
    });
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let imageUrl = formData.fotoProfil;

      if (imageUrl && typeof imageUrl !== "string") {
        imageUrl = await upload(imageUrl);
      }

      const detilData = {
        namaLengkap: formData.namaLengkap,
        fotoProfil: imageUrl,
        bio: formData.bio,
        noWa: formData.noWa,
        linkedinUrl: formData.linkedinUrl,
        instagramUrl: formData.instagramUrl,
        pernyataanUrl: formData.pernyataanUrl,
      };

      const userData = {
        username: formData.username,
        email: formData.email,
      };

      await axiosInstance.put(`/detil/update/${user._id}`, detilData);
      await axiosInstance.put(`/user/update/${user._id}`, userData);

      Swal.fire({
        title: "Berhasil!",
        text: "Profil berhasil diperbarui!",
        icon: "success",
        confirmButtonText: "OK",
      }).then(() => {
        window.location.reload();
      });
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Gagal memperbarui profil!");
    }
  };

  return (
    <>
      <div className="bg-white shadow rounded p-6 border">
        <div className="grid md:grid-cols-[2fr_3fr] gap-6 ">
          <div className="space-y-6 w-64">
            <div>
              <label className="block mb-2 text-sm font-medium">Nama Lengkap:</label>
              <input name="namaLengkap" value={formData.namaLengkap} onChange={handleChange} className="border rounded w-full p-2" />
            </div>
            <div>
              <label className="block mb-2 text-sm font-medium">Username:</label>
              <input name="username" value={formData.username} onChange={handleChange} className="border rounded w-full p-2" />
            </div>
            <div>
              <label className="block mb-2 text-sm font-medium">Email:</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} className="border rounded w-full p-2" />
            </div>
            {user?.role === "komunitas" && (
              <>
                <div>
                  <label className="block mb-2 text-sm font-medium">Link Instagram</label>
                  <input name="instagramUrl" value={formData.instagramUrl} onChange={handleChange} className="border rounded w-full p-2" />
                </div>
                <div>
                  <label className="block mb-2 text-sm font-medium">Link Whatsapp</label>
                  <input name="noWa" value={formData.noWa} onChange={handleChange} className="border rounded w-full p-2" />
                </div>
                <div>
                  <label className="block mb-2 text-sm font-medium">Link LinkedIn</label>
                  <input name="linkedinUrl" value={formData.linkedinUrl} onChange={handleChange} className="border rounded w-full p-2" />
                </div>
              </>
            )}
          </div>
          <div className="flex flex-col">
            <div className="flex md:flex-row items-start flex-col gap-2">
              <label className="block mb-2 text-sm font-medium">Foto Profil:</label>
              {filePreview ? <img src={filePreview.url} alt="Profil" className="w-36 h-36 rounded-full object-cover mb-3" /> : <img src={formData.fotoProfil} alt="Profil" className="w-36 h-36 rounded-full object-cover mb-3" />}
              <div>
                <button type="button" className="text-sm border flex gap-2 px-4 py-1 rounded hover:bg-gray-100" onClick={handleClick}>
                  Ubah Foto Profil
                  <img src={pensil} alt="" />
                </button>
                <input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={handleFileChange} />
                <p className="text-xs text-gray-500 mt-2 text-center">max (n)MB. Format: .jpg, .jpeg, .png</p>
              </div>
            </div>

            {user?.role === "komunitas" && (
              <div>
                <label className="block mb-2 text-sm font-medium">Bio</label>
                <textarea name="bio" value={formData.bio} onChange={handleChange} className="border rounded w-full p-2" rows={4} />
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="col-span-2 flex justify-end space-x-3 mt-4">
        <button className="px-5 py-3 border-primary border-2 rounded text-primary hover:bg-gray-100">Batal</button>
        <button onClick={handleSubmit} className="bg-primary text-white px-5 py-3 rounded hover:bg-primary-700">
          Simpan Perubahan
        </button>
      </div>
    </>
  );
}

export default EditProfilForm;
