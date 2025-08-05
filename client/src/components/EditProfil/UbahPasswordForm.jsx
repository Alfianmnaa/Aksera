import { useState } from 'react';
import { axiosInstance } from '../../config';

const UbahPasswordForm = () => {
  const [form, setForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    if (form.newPassword !== form.confirmPassword) {
      return alert('Konfirmasi password tidak cocok.');
    }

    try {
      await axiosInstance.post('/user/change-password', {
        currentPassword: form.currentPassword,
        newPassword: form.newPassword,
      });
      alert('Password berhasil diubah!');
    } catch (err) {
      alert('Gagal mengubah password.');
    }
  };

  return ( 
    <>
        <div className="bg-white shadow rounded p-6 border">
            <div className="space-y-4 w-64">
                <div>
                    <label className="block text-sm font-medium">Password saat ini:</label>
                    <input
                    type="password"
                    name="currentPassword"
                    value={form.currentPassword}
                    onChange={handleChange}
                    className="border rounded w-full p-2"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium">Password baru:</label>
                    <input
                    type="password"
                    name="newPassword"
                    value={form.newPassword}
                    onChange={handleChange}
                    className="border rounded w-full p-2"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium">Konfirmasi:</label>
                    <input
                    type="password"
                    name="confirmPassword"
                    value={form.confirmPassword}
                    onChange={handleChange}
                    className="border rounded w-full p-2"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                    Password harus terdiri dari minimal 8 karakter dan kombinasi huruf dan angka.
                    </p>
                </div>
            </div>
        </div>
        <div className="flex justify-end space-x-3 mt-4">
            <button className="px-5 py-3 border-primary border-1 rounded text-primary hover:bg-gray-100">Batal</button>
            <button onClick={handleSubmit} className="bg-primary text-white px-5 py-3 rounded hover:bg-primary-700">
            Simpan Perubahan
            </button>
        </div>
    </>
  );
};

export default UbahPasswordForm;
