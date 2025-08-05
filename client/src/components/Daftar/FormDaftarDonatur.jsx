import React from "react";
import InputField from "../Form/InputField";
import SubmitButton from "../Form/SubmitButton";

export default function FormDaftarDonatur({ formData, setFormData, handleDaftar, loading }) {
  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  return (
    <form className="flex flex-col gap-5" onSubmit={handleDaftar}>
      <InputField label="Username" id="username" value={formData.username} placeholder="Masukkan username" onChange={handleChange} />
      <InputField label="Email" id="email" value={formData.email} placeholder="Masukkan email" onChange={handleChange} />
      <InputField label="Password" id="password" type="password" value={formData.password} placeholder="Masukkan password" onChange={handleChange} />
      <SubmitButton loading={loading}>Daftar</SubmitButton>
    </form>
  );
}
