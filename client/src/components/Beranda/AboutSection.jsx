import React from "react";

export const AboutSection = () => {
  return (
    <section className="flex flex-col px-6 py-12 md:px-40 md:py-28 text-center md:text-left">
      <div className="w-full text-center ">
        <h2 className="md:text-[44px] text-3xl font-semibold  mb-6">
          Apa itu
          <span
            className="text-primary
           "
          >
            {" "}
            Aksera
          </span>
          ?
        </h2>
        <p className="text-gray-700 font-medium text-base max-w-6xl mx-auto">
          Aksera adalah platform yang menggabungkan edukasi berbasis AI dan donasi barang pendidikan untuk membantu pemerataan akses belajar, khususnya di daerah 3T dan bagi penyandang disabilitas. Dengan fitur seperti Tanya PDF, Ringkas
          PDF, Mindmap, dan Flashcard, Aksera memudahkan belajar sekaligus menyalurkan bantuan pendidikan secara transparan dan tepat sasaran.
        </p>
      </div>
    </section>
  );
};
