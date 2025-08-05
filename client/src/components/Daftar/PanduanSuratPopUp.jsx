import React from "react";
import satuIcon from "../../assets/Daftar/1st.png";
import duaIcon from "../../assets/Daftar/2st.png";
import tigaIcon from "../../assets/Daftar/3st.png";

const PanduanSuratPopUp = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-[600px] p-6 px-6 md:px-10 pt-10 relative mx-4">
        {/* Tombol Close */}
        <button className="absolute top-4 right-4 text-gray-500 hover:text-black text-2xl leading-none focus:outline-none" onClick={onClose} aria-label="Close">
          ×
        </button>

        {/* Header */}
        <h2 className="text-xl md:text-2xl font-bold text-primary mb-1">Panduan Singkat Upload Google Drive</h2>
        <p className="text-sm mb-4">(Untuk Surat Permohonan)</p>

        <hr className="mb-4" />

        {/* Step 1 */}
        <div className="flex items-start mb-5 gap-3">
          <img src={satuIcon} alt="Langkah 1" className="w-6 md:w-8" />
          <div>
            <h3 className="font-semibold text-lg md:text-xl text-primary">Siapkan File</h3>
            <ul className="text-xs md:text-sm list-disc list-inside">
              <li>Format: PDF/DOCX</li>
              <li>
                Nama file jelas, contoh: <br />
                <span className="italic">SuratPendukung_[NamaKomunitas].pdf</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Step 2 */}
        <div className="flex items-start mb-5 gap-3">
          <img src={duaIcon} alt="Langkah 2" className="w-6 md:w-8" />
          <div>
            <h3 className="font-semibold text-lg md:text-xl text-primary">Upload ke Google Drive</h3>
            <ul className="text-xs md:text-sm list-disc list-inside">
              <li>Buka drive.google.com dan Klik "Baru" → "Upload File"</li>
              <li>Klik kanan file → "Bagikan"</li>
              <li>Pilih "Anyone with the link" (Viewer)</li>
              <li>Salin link & cantumkan di website</li>
            </ul>
          </div>
        </div>

        {/* Step 3 */}
        <div className="flex items-start gap-3">
          <img src={tigaIcon} alt="Langkah 3" className="w-6 md:w-8" />
          <div>
            <h3 className="font-semibold text-lg md:text-xl text-primary">Surat Pendukung</h3>
            <ul className="text-xs md:text-sm list-disc list-inside">
              <li>Surat pernyataan dari lembaga / instansi</li>
              <li>Surat pendukung (sertifikat)</li>
              <li>Pastikan surat dijadikan satu / merge ke satu file pdf</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PanduanSuratPopUp;
