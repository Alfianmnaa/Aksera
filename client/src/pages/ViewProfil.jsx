import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaInstagram, FaWhatsapp, FaLinkedin } from "react-icons/fa";
import { axiosInstance } from "../config";
import donaturSampul from "../assets/DonasiSaya/donaturSampul.png";
import komunitasSampul from "../assets/DonasiSaya/komunitasSampul.png";
import personProfile from "../assets/Navbar/personProfile.png";
import CardArtikel from "../components/Artikel/CardArtikel";

const ViewProfil = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [artikelList, setArtikelList] = useState(null);
  const [detilUser, setDetilUser] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const [userRes, detailRes] = await Promise.all([axiosInstance.get(`/user/get/${id}`), axiosInstance.get(`/detil/get/${id}`)]);

        setUser(userRes.data);
        setDetilUser(detailRes.data);
      } catch (error) {
        console.error("Gagal mengambil data user:", error);
      }
    };

    const fetchArtikel = async () => {
      try {
        setLoading(true);
        const res = await axiosInstance.get("/artikel/getall");

        const artikelFiltered = res.data.filter((artikel) => artikel.artikelUid === id);

        setArtikelList(artikelFiltered);
      } catch (error) {
        console.error("Gagal mengambil artikel:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
    fetchArtikel();
  }, [id]);

  const hasValidProfilePhoto = detilUser?.fotoProfil && detilUser.fotoProfil !== "undefined";

  if (loading || !user || !detilUser || artikelList === null) {
    return <div className="text-center mt-20 text-md h-screen">Memuat profil pengguna...</div>;
  }

  return (
    <>
      <div className="bg-gray-200 rounded-b-[36px] w-full h-fit relative">
        {user?.role === "donatur" ? <img src={donaturSampul} alt="" className="object-cover object-[30%_0%] h-56 w-full " /> : <img src={komunitasSampul} alt="" className="object-cover object-[30%_0%] h-56 w-full" />}
      </div>

      <div className="max-w-5xl mx-auto pt-4 px-8 flex md:flex-row flex-col justify-between">
        <div className="flex gap-4 md:gap-8">
          <img src={hasValidProfilePhoto ? detilUser.fotoProfil : personProfile} alt="profile" className="w-24 h-24 md:w-36 md:h-36 bg-gray-500  relative md:-top-16 -top-10 border-4 border-white rounded-md object-cover" />
          <div>
            <h1 className="-mt-2 md:text-xl text-base font-semibold flex items-center">{detilUser?.namaLengkap || "Nama tidak tersedia"}</h1>
            <p className="text-gray-600 md:text-base text-[14px]">{user?.email || "Email tidak tersedia"}</p>

            <div className="flex mt-3 gap-2 text-lg text-gray-700">
              {detilUser?.instagramUrl && (
                <a href={detilUser.instagramUrl} target="_blank" rel="noopener noreferrer" className="hover:text-pink-500">
                  <FaInstagram className="md:h-6 h-5 md:w-6 w-5" />
                </a>
              )}
              {detilUser?.noWa && (
                <a href={`https://wa.me/${detilUser.noWa}`} target="_blank" rel="noopener noreferrer" className="hover:text-green-500">
                  <FaWhatsapp className="md:h-6 h-5 md:w-6 w-5" />
                </a>
              )}
              {detilUser?.linkedinUrl && (
                <a href={detilUser.linkedinUrl} target="_blank" rel="noopener noreferrer" className="hover:text-blue-600">
                  <FaLinkedin className="md:h-6 h-5 md:w-6 w-5" />
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-8 -mt-6 ">
        <p>Bio: {detilUser?.bio || "Belum ada bio ditambahkan oleh pengguna ini."}</p>
      </div>

      <div className="max-w-5xl mx-auto px-8 mt-10 mb-20">
        <h2 className="text-xl font-semibold mb-4">Postingan Artikel</h2>
        {loading ? (
          <div className="flex flex-wrap  gap-4 justify-center">
            {Array(3)
              .fill(null)
              .map((_, idx) => (
                <CardSkleton key={idx} />
              ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-4">
            {artikelList.length > 0 ? (
              artikelList.map((artikel) => (
                <CardArtikel
                  key={artikel._id}
                  id={artikel._id}
                  title={artikel.judulArtikel}
                  description={artikel.deskArtikel}
                  imageSrc={artikel.coverUrl}
                  author={detilUser?.namaLengkap || "Anonim"}
                  username={`@${user?.username || "user"}`}
                  avatarSrc={detilUser?.fotoProfil}
                  date={new Date(artikel.createdAt).toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                  handleClick={() => navigate(`/artikel/detail-artikel/${artikel._id}`)}
                />
              ))
            ) : (
              <p className="text-gray-500 col-span-full">Belum ada artikel.</p>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default ViewProfil;
