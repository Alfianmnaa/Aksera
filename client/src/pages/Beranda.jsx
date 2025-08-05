import React, { useEffect, useState } from "react";
import heroBeranda from "../assets/Beranda/Heroberanda.webp";
import childImg from "../assets/Beranda/Child.webp";
import donateIcon from "../assets/Beranda/donate.png";
import peopleIcon from "../assets/Beranda/people.png";
import komunitas1 from "../assets/Beranda/UIN.svg";
import komunitas2 from "../assets/Beranda/HMIT.svg";
import komunitas3 from "../assets/Beranda/SCIT.svg";
import komunitas4 from "../assets/Beranda/Masjid.svg";
import komunitas5 from "../assets/Beranda/INKAI.svg";
import visi_misi from "../assets/Beranda/misi-kami.webp";
import { Link, useNavigate } from "react-router-dom";
import { axiosInstance } from "../config";
import CardArtikel from "../components/Artikel/CardArtikel";
import { CardSkleton } from "../components/LihatDonasi/CardSkleton";
import { UserContext } from "../context/UserContext";
import aiFeatureScreenshot from "../assets/Beranda/lumagif.gif";


export default function Beranda() {
  return (
    <>
      <HeroSec />
      <IntroSec />
      <MisiSec />
      <ArtikelSec />
      <TargetSec />
      <CTASec />
      <PartnerSec />
    </>
  );
}

function HeroSec() {
  const navigate = useNavigate();

  let buttonText1 = "Donasi Sekarang";
  let buttonText2 = "Belajar Sekarang";
  let targetPath = "/lihat-donasi";
  let targetPath2 = "/ummah-book";


  return (
    <section className="relative h-screen w-full bg-black">

      <img src={heroBeranda} alt="Children learning" className="absolute inset-0 w-full h-full object-cover opacity-50" />
      <div className="absolute inset-0 bg-black bg-opacity-30" />
      <div className="relative z-10 flex justify-between items-center h-full px-10 md:px-16 lg:px-36 text-white">

        <div className="max-w-xl">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl mt-16 font-extrabold leading-tight">
            Ayo Jadi Pahlawan <br className="hidden sm:block" /> Pendidikan!
          </h1>
          <p className="mt-4 text-base sm:text-lg md:text-md max-w-sm">
            Satu kontribusi Anda bisa membuka akses belajar bagi anak bangsa.
          </p>

          <div className="flex flex-wrap gap-4 mt-6">
            <button
              onClick={() => navigate(targetPath)}
              className="inline-flex gap-2 items-center bg-primary hover:bg-[#DC7900] text-white font-medium px-5 py-3 rounded-full transition duration-300"
            >
              <p>{buttonText1}</p>
               <svg width="25" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">

              <rect width="24.4" height="24" rx="12" fill="#F6F8D5" />

              <path

                d="M15.0727 12.9818H6.96364C6.69697 12.9818 6.4697 12.8879 6.28182 12.7C6.09394 12.5121 6 12.2848 6 12.0182C6 11.7515 6.09394 11.5242 6.28182 11.3364C6.4697 11.1485 6.69697 11.0545 6.96364 11.0545H15.0727L11.6909 7.67273C11.497 7.47879 11.4 7.24848 11.4 6.98182C11.4 6.71515 11.497 6.48485 11.6909 6.29091C11.8848 6.09697 12.1152 6 12.3818 6C12.6485 6 12.8788 6.09697 13.0727 6.29091L18.1273 11.3455C18.2242 11.4424 18.2939 11.5455 18.3364 11.6545C18.3788 11.7636 18.4 11.8848 18.4 12.0182C18.4 12.1515 18.3788 12.2727 18.3364 12.3818C18.2939 12.4909 18.2242 12.5939 18.1273 12.6909L13.1091 17.7091C12.9152 17.903 12.6848 18 12.4182 18C12.1515 18 11.9212 17.903 11.7273 17.7091C11.5333 17.5152 11.4364 17.2848 11.4364 17.0182C11.4364 16.7515 11.5333 16.5212 11.7273 16.3273L15.0727 12.9818Z"

                fill="#205781"

              />

            </svg>
            </button>
            <button
              onClick={() => navigate(targetPath2)}
              className="inline-flex gap-2 items-center bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium px-5 py-3 rounded-full transition duration-300"
            >
              <p>{buttonText2}</p>
             <svg width="25" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">

              <rect width="24.4" height="24" rx="12" fill="#F6F8D5" />

              <path

                d="M15.0727 12.9818H6.96364C6.69697 12.9818 6.4697 12.8879 6.28182 12.7C6.09394 12.5121 6 12.2848 6 12.0182C6 11.7515 6.09394 11.5242 6.28182 11.3364C6.4697 11.1485 6.69697 11.0545 6.96364 11.0545H15.0727L11.6909 7.67273C11.497 7.47879 11.4 7.24848 11.4 6.98182C11.4 6.71515 11.497 6.48485 11.6909 6.29091C11.8848 6.09697 12.1152 6 12.3818 6C12.6485 6 12.8788 6.09697 13.0727 6.29091L18.1273 11.3455C18.2242 11.4424 18.2939 11.5455 18.3364 11.6545C18.3788 11.7636 18.4 11.8848 18.4 12.0182C18.4 12.1515 18.3788 12.2727 18.3364 12.3818C18.2939 12.4909 18.2242 12.5939 18.1273 12.6909L13.1091 17.7091C12.9152 17.903 12.6848 18 12.4182 18C12.1515 18 11.9212 17.903 11.7273 17.7091C11.5333 17.5152 11.4364 17.2848 11.4364 17.0182C11.4364 16.7515 11.5333 16.5212 11.7273 16.3273L15.0727 12.9818Z"

                fill="#205781"

              />

            </svg>
            </button>
          </div>
        </div>

        <div 
          className="hidden lg:block [perspective:1000px] cursor-pointer"
          onClick={() => navigate('/ummah-partner')} 
        >
          <div className="transition-transform duration-500 ease-in-out hover:scale-105 hover:[transform:rotateY(-10deg)] [transform:rotateY(-15deg)]">
            <img 
              src={aiFeatureScreenshot} 
              alt="AI Feature Screenshot" 
              className="w-[800px] h-auto rounded-xl shadow-2xl transition-all duration-500 hover:drop-shadow-[0_0_20px_rgba(255,255,255,0.5)]" 
            />
          </div>
          <p className="mt-4 text-center text-sm font-medium text-gray-200">
            Coba <span className="font-bold">Luma AI</span> sekarang juga!
          </p>
        </div>
      </div>
    </section>
  );
}

function IntroSec() {
  return (
    <section className="flex flex-col md:flex-row items-center justify-between gap-6 px-6 py-16 md:px-40 md:py-32 text-center md:text-left">
      <div className="w-full md:max-w-md">
        <h2 className="md:text-[44px] text-3xl font-bold md:mb-2">Apa itu </h2>
        <h2 className="md:text-[44px] text-3xl font-bold -mt-10 md:-mt-10 mb-4">
          <span
            className="text-primary
          "
          >
            {" "}
            <br />
            Lentera Umat
          </span>
          ?
        </h2>
        <p className="text-gray-700 text-lg">
          Lentera Umat adalah platform mengakses ilmu terpercaya dan berbagi
          donasi demi mewujudkan pendidikan inklusif dan masyarakat yang
          moderat. Kami menghubungkan masyarakat dengan sumber belajar kredibel
          yang didukung fitur AI, sekaligus menghubungkan donatur dari semua
          kalangan dengan komunitas pendistribusi yang kemudian disalurkan ke
          anak-anak yang memiliki fasilitas pendidikan kurang layak.
        </p>
      </div>
      <div className="w-full md:w-1/3">
        <img
          src={childImg}
          alt="Dua anak belajar bersama"
          className="rounded-lg shadow-md w-full max-w-xs mx-auto md:max-w-full md:mx-0"
        />
      </div>
    </section>
  );
}

function MisiSec() {
  return (
    <section className="px-6 md:px-20 py-16">
      <div className="bg-gradient-to-br from-[#07A5A8] to-[#034142] text-white py-16 px-6 md:px-24 rounded-xl shadow-md">
        <div className="flex flex-col md:flex-row items-center gap-8">
          <div className="w-full md:w-1/3">
            <h3 className="text-4xl font-bold text-center mb-6">Misi Kami</h3>
            <img
              src={visi_misi}
              alt="Anak menggunakan kursi roda"
              className="rounded-lg shadow-md w-full max-w-xs mx-auto md:max-w-full md:mx-0"
            />
          </div>
          <div className="w-full md:w-2/3 md:pl-16">
            <div className="space-y-6">
              <div>
                <p className="font-bold text-2xl">01</p>
                <p>
                  Memastikan penyandang disabilitas dan masyarakat di daerah 3T
                  memperoleh fasilitas pendidikan yang sesuai melalui sistem
                  distribusi berbasis prioritas kebutuhan.
                </p>
              </div>
              <div>
                <p className="font-bold text-2xl">02</p>
                <p>
                  Membangun mekanisme penyaluran alat pendidikan yang terukur,
                  akuntabel, dan berkelanjutan, dari donatur hingga ke tangan
                  penerima.
                </p>
              </div>
              <div>
                <p className="font-bold text-2xl">03</p>
                <p>
                  Mendorong partisipasi masyarakat luas—individu, korporasi,
                  hingga lembaga pendidikan—dalam membentuk ekosistem donasi
                  inklusif untuk pemerataan kesempatan belajar.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ArtikelSec() {
  const navigate = useNavigate();
  const [artikelList, setArtikelList] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchArtikel = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get("/artikel/getall");

      const artikelWithUser = await Promise.all(
        res.data.map(async (artikel) => {
          try {
            const [userRes, detailRes] = await Promise.all([
              axiosInstance.get(`/user/get/${artikel.artikelUid}`),
              axiosInstance.get(`/detil/get/${artikel.artikelUid}`),
            ]);

            return {
              ...artikel,
              username: userRes.data.username,
              fotoProfil: detailRes.data.fotoProfil,
              namaLengkap: detailRes.data.namaLengkap,
            };
          } catch (err) {
            console.error(
              "Gagal mengambil data user untuk artikel:",
              artikel._id,
              err
            );
            return artikel; // fallback jika user gagal diambil
          }
        })
      );

      setArtikelList(artikelWithUser);
    } catch (error) {
      console.error("Gagal mengambil artikel:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArtikel();
  }, []);

  const handleClick = (id) => {
    navigate(`/artikel/detail-artikel/${id}`);
  };

  return (
    <div className="max-w-6xl mx-auto py-8 mb-24 sm:px-6">
      <div className="flex flex-col sm:flex-row sm:justify-between px-8 sm:items-center mb-6 gap-2 sm:gap-0">
        <h2 className="text-3xl font-bold text-left sm:text-left">Artikel</h2>
        <Link
          to={"artikel"}
          className="text-[#F79319] md:text-sm text-xs text-left  hover:underline sm:text-right"
        >
          Lihat semua
        </Link>
      </div>
      {loading && (
        <div className="flex flex-wrap justify-center gap-4">
          {Array(3)
            .fill(null)
            .map((_, idx) => (
              <CardSkleton key={idx} />
            ))}
        </div>
      )}
      <div className="flex flex-wrap justify-center gap-6">
        {artikelList?.slice(0, 3).map((item) => (
          <CardArtikel
            key={item._id}
            id={item._id}
            title={item.judulArtikel}
            description={item.deskArtikel}
            imageSrc={item.coverUrl}
            date={new Date(item.createdAt).toLocaleDateString("id-ID", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
            author={item.namaLengkap}
            username={`@${item.username}`}
            avatarSrc={item.fotoProfil}
            handleClick={() => handleClick(item._id)}
          />
        ))}
      </div>
    </div>
  );
}

function TargetSec() {
  return (
    <section className="bg-[#07A5A8] text-white py-16 px-6 md:px-20">
      <h2 className="text-3xl font-semibold text-center mb-12">Target Kami</h2>
      <div className="flex flex-col md:flex-row justify-center items-stretch gap-8">
        <div className="bg-white text-[#205D88] rounded-xl shadow-md p-10 text-center w-full md:w-1/3 flex flex-col justify-center">
          <p className="text-2xl font-bold">500+ Materi</p>
          <p className="mt-2">
            Materi pembelajaran berkualitas yang mudah diakses oleh semua.
          </p>
        </div>
        <div className="bg-white text-[#205D88] rounded-xl shadow-md p-10 text-center w-full md:w-1/3 flex flex-col justify-center">
          <p className="text-2xl font-bold">1000+ Partner</p>
          <p className="mt-2">
            Menjalin kerjasama strategis dengan lembaga dan komunitas pendidikan.
          </p>
        </div>

        <div className="bg-white text-[#205D88] rounded-xl shadow-md p-10 text-center w-full md:w-1/3 flex flex-col justify-center">
          <p className="text-2xl font-bold">22.500+ Barang</p>
          <p className="mt-2">
            Donasi alat pendidikan yang mengubah akses dan kualitas belajar.
          </p>
        </div>
      </div>
    </section>
  );
}

function CTASec() {
  return (
    <section className="py-12 px-6 md:pt-8 pb-0 bg-white">
      <div className="flex flex-col md:flex-row justify-center items-center gap-8 my-16 md:my-32">
        {/* Kartu Donatur */}
        <div className="bg-white rounded-xl shadow-[0_0_8px_0px_rgba(0,0,0,0.2)] px-8 py-14 text-center w-full md:w-80 flex flex-col items-center">
          <div className="w-20 h-20 rounded-full grid place-items-center bg-primary mb-6">
            <img src={donateIcon} className="w-12" alt="" />
          </div>

          <h3 className="text-2xl font-bold mb-4">Donatur</h3>
          <p className="text-gray-600">
            Bersama Anda, kami bisa memberikan dukungan nyata bagi mereka yang
            membutuhkan.
          </p>
        </div>

        {/* Kartu CTA utama */}
        <Link to="/daftar">
          <div className="bg-white rounded-xl shadow-[0_0_8px_0px_rgba(0,0,0,0.2)] px-8 py-16 text-center w-full md:w-80 border border-gray-200 flex flex-col items-center">
            <h3 className="text-2xl font-bold mb-4">
              Pilih Peranmu, Wujudkan Mimpi Mereka
            </h3>
            <p className="text-gray-600 mb-6">
              Berkontribusi sebagai donatur atau bergabung langsung sebagai agen
              perubahan.
            </p>
            <button className="flex gap-2 px-6 py-3 bg-primary text-white rounded-full hover:bg-[#DC7900] transition font-medium">
              <p>Daftar Sekarang</p>
              <svg
                width="25"
                height="24"
                viewBox="0 0 25 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
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
          <h3 className="text-2xl font-bold mb-4">Komunitas</h3>
          <p className="text-gray-600">
            Kolaborasi dalam komunitas memperluas dampak kebaikan kita bagi
            lingkungan sekitar.
          </p>
        </div>
      </div>
    </section>
  );
}

const PartnerSec = () => {
  const logos = [komunitas1, komunitas2, komunitas3, komunitas4, komunitas5]; // Ganti dengan path logo asli kamu

  return (
    <section className="pmt-24 md:mt-0 md:mb-48 bg-white overflow-hidden">
      <h2 className="text-center text-3xl md:text-4xl font-semibold mb-14">
        Partner Kami
      </h2>
      <div className="w-full px-6 md:px-14">
        <div className="flex flex-wrap gap-8 md:gap-12 justify-center md:justify-evenly">
          {[...logos].map((src, index) => (
            <div
              key={index}
              className="flex-shrink-0 rounded-full overflow-hidden"
            >
              <img
                src={src}
                alt={`Partner logo ${index + 1}`}
                className="w-20 h-20 md:w-28 md:h-22 opacity-80 hover:opacity-100 transition"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
