import { useState, useEffect, useRef } from "react";
import CariDonasiForm from "../components/LihatDonasi/CariDonasiForm";
import HasilPencarian from "../components/LihatDonasi/HasilPencarian";
import DonasiTersedia from "../components/LihatDonasi/DonasiTersedia";
import DonasiDisalurkan from "../components/LihatDonasi/DonasiDisalurkan";
import DonasiByCategory from "../components/LihatDonasi/DonasiByCategory";
import { CardSkleton } from "../components/LihatDonasi/CardSkleton";

function LihatDonasi() {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isSearched, setIsSearched] = useState(false);
  const hasilPencarianRef = useRef(null);

  useEffect(() => {
    if (donations.length > 0 && hasilPencarianRef.current) {
      hasilPencarianRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [donations]);

  return (
    <>
      <CariDonasiForm setDonations={setDonations} loading={loading} setLoading={setLoading} setIsSearched={setIsSearched} />
      {loading ? (
        <div className="max-w-5xl mx-auto px-6 pb-12 sm:py-12 md:px-8">
          <div className="flex flex-wrap gap-4 sm:gap-6 justify-center">
            {Array(6)
              .fill(null)
              .map((_, idx) => (
                <CardSkleton key={idx} />
              ))}
          </div>
        </div>
      ) : isSearched ? (
        donations.length > 0 ? (
          <div ref={hasilPencarianRef}>
            <HasilPencarian resultData={donations} />
          </div>
        ) : (
          <div className="text-center py-10">
            <p className="text-gray-600 text-lg">Tidak ada donasi ditemukan untuk kriteria ini.</p>
          </div>
        )
      ) : null}{" "}
      <DonasiTersedia />
      <DonasiDisalurkan />
      <DonasiByCategory />
    </>
  );
}

export default LihatDonasi;
