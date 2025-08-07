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
        <p className="text-gray-700 font-medium text-lg max-w-6xl mx-auto">
          Lentera Umat adalah platform mengakses ilmu terpercaya dan berbagi donasi demi mewujudkan pendidikan inklusif dan masyarakat yang moderat. Kami menghubungkan masyarakat dengan sumber belajar kredibel yang didukung fitur AI,
          sekaligus menghubungkan donatur dari semua kalangan dengan komunitas pendistribusi yang kemudian disalurkan ke anak-anak yang memiliki fasilitas pendidikan kurang layak.
        </p>
      </div>
    </section>
  );
};
