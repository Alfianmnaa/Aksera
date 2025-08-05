import { useState, useEffect, useRef } from "react";
import Navbar from "../components/Navbar/Navbar";
import Navbar2 from "../components/Navbar/Navbar2";
import CariArtikelForm from "../components/Artikel/CariArtikelForm";
import HasilPencarian from "../components/LihatDonasi/HasilPencarian";
import ListArtikel from "../components/Artikel/ListArtikel";
import HasilPencarianArtikel from "../components/Artikel/HasilPencarianArtikel";
import { CardSkleton } from "../components/LihatDonasi/CardSkleton";

export default function Artikel() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isSearched, setIsSearched] = useState(false);

  const hasilPencarianRef = useRef(null);

  useEffect(() => {
    if (articles.length > 0 && hasilPencarianRef.current) {
      hasilPencarianRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, [articles]);

  return (
    <>
      <CariArtikelForm setArticles={setArticles} loading={loading} setLoading={setLoading} setIsSearched={setIsSearched} />
      {loading ? (
        <div className="max-w-5xl mx-auto px-6 pb-12 sm:py-12 md:px-8">
          <div className="flex flex-wrap justify-center gap-6">
            {Array(6)
              .fill(null)
              .map((_, idx) => (
                <CardSkleton key={idx} />
              ))}
          </div>
        </div>
      ) : (
        isSearched &&
        (articles.length > 0 ? (
          <div ref={hasilPencarianRef}>
            <HasilPencarianArtikel resultData={articles} />
          </div>
        ) : (
          <div className="text-center py-10">
            <p className="text-gray-600 text-lg">Tidak ada artikel ditemukan .</p>
          </div>
        ))
      )}

      <ListArtikel />
    </>
  );
}
