import React from "react";
import donateIcon from "../../assets/Beranda/donate.png";
import peopleIcon from "../../assets/Beranda/people.png";
import { Link } from "react-router-dom";

export const PeranSection = () => {
  return (
    <section className="md:py-20 py-10 my-16 md:my-32 px-6 md:pt-8  bg-white">
      <div className="w-full text-center mb-12">
        <h2 className="md:text-[44px] text-3xl font-semibold ">
          Bersama Wujudkan Pendidikan
          <span
            className="text-primary
           "
          >
            {" "}
            Setara
          </span>
        </h2>
      </div>
      <div className="flex flex-col md:flex-row justify-center items-center gap-8 ">
        {/* Kartu Donatur */}
        <div className="bg-white rounded-xl shadow-[0_0_8px_0px_rgba(0,0,0,0.2)] px-8 py-14 text-center w-full md:w-80 flex flex-col items-center">
          <div className="w-20 h-20 rounded-full grid place-items-center bg-primary mb-6">
            <img src={donateIcon} className="w-12" alt="" />
          </div>

          <h3 className="text-2xl font-semibold mb-4">Donatur</h3>
          <p className="text-gray-600">Bersama Anda, kami bisa memberikan dukungan nyata bagi mereka yang membutuhkan.</p>
        </div>

        {/* Kartu CTA utama */}
        <Link to="/daftar">
          <div className="bg-white rounded-xl shadow-[0_0_8px_0px_rgba(0,0,0,0.2)] px-8 py-16 text-center w-full md:w-80 border border-gray-200 flex flex-col items-center">
            <h3 className="text-2xl font-semibold mb-4">Pilih Peranmu, Wujudkan Mimpi Mereka</h3>
            <p className="text-gray-600 mb-6">Berkontribusi sebagai donatur atau bergabung langsung sebagai agen perubahan.</p>
            <button className="flex gap-2 px-6 py-3 bg-primary text-white rounded-full hover:bg-[#043c6b] transition font-medium">
              <p>Daftar Sekarang</p>
              <svg width="25" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="24.4" height="24" rx="12" fill="#F6F8D5" />
                <path
                  d="M15.0727 12.9818H6.96364C6.69697 12.9818 6.4697 12.8879 6.28182 12.7C6.09394 12.5121 6 12.2848 6 12.0182C6 11.7515 6.09394 11.5242 6.28182 11.3364C6.4697 11.1485 6.69697 11.0545 6.96364 11.0545H15.0727L11.6909 7.67273C11.497 7.47879 11.4 7.24848 11.4 6.98182C11.4 6.71515 11.497 6.48485 11.6909 6.29091C11.8848 6.09697 12.1152 6 12.3818 6C12.6485 6 12.8788 6.09697 13.0727 6.29091L18.1273 11.3455C18.2242 11.4424 18.2939 11.5455 18.3364 11.6545C18.3788 11.7636 18.4 11.8848 18.4 12.0182C18.4 12.1515 18.3788 12.2727 18.3364 12.3818C18.2939 12.4909 18.2242 12.5939 18.1273 12.6909L13.1091 17.7091C12.9152 17.903 12.6848 18 12.4182 18C12.1515 18 11.9212 17.903 11.7273 17.7091C11.5333 17.5152 11.4364 17.2848 11.4364 17.0182C11.4364 16.7515 11.5333 16.5212 11.7273 16.3273L15.0727 12.9818Z"
                  fill="#205781"
                />
              </svg>
            </button>
          </div>
        </Link>

        {/* Kartu Komunitas */}
        <div className="bg-white rounded-xl shadow-[0_0_8px_0px_rgba(0,0,0,0.2)] px-8 py-14 text-center w-full md:w-80 flex flex-col items-center">
          <div className="w-20 h-20 rounded-full grid place-items-center bg-primary mb-6">
            <img src={peopleIcon} className="w-12" alt="" />
          </div>
          <h3 className="text-2xl font-semibold mb-4">Komunitas</h3>
          <p className="text-gray-600">Kolaborasi dalam komunitas memperluas dampak kebaikan kita bagi lingkungan sekitar.</p>
        </div>
      </div>
    </section>
  );
};
