import React, { useState } from "react";
import InputField from "../Form/InputField";
import SubmitButton from "../Form/SubmitButton";
import PanduanSuratPopUp from "./PanduanSuratPopUp";

export default function FormDaftarKomunitas({ formData, setFormData, handleDaftar, loading }) {
  const [showPanduan, setShowPanduan] = useState(false);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  return (
    <form className="flex flex-col gap-5 max-w-md" onSubmit={handleDaftar}>
      <InputField label="Nama Komunitas:" id="namaLengkap" value={formData.namaLengkap} placeholder="Masukkan nama lengkap komunitas" onChange={handleChange} />
      <InputField label="Username:" id="username" value={formData.username} placeholder="Masukkan panggilan komunitas" onChange={handleChange} />
      <InputField label="Email:" id="email" type="email" value={formData.email} placeholder="Masukkan email komunitas" onChange={handleChange} />
      <InputField label="Password:" id="password" type="password" value={formData.password} placeholder="Masukkan password" onChange={handleChange} />
      <div className="flex flex-col">
        <InputField label="Link surat permohonan:" id="pernyataanUrl" type="url" value={formData.pernyataanUrl} placeholder="Contoh: https://drive.google.com/..." onChange={handleChange} />
        <div className="w-full flex justify-end">
          <button type="button" onClick={() => setShowPanduan(true)} className="text-primary underline w-fit pr-0 hover:text-blue-800 text-body-sm">
            Panduan Isi Surat
          </button>
        </div>
        {showPanduan && <PanduanSuratPopUp onClose={() => setShowPanduan(false)} />}
      </div>
      <SubmitButton loading={loading}>Daftar</SubmitButton>
    </form>
  );
}
