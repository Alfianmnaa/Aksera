import FormUpload from "../components/UploadDonasi/FormUpload";

export default function UploadDonasi() {
  return (
    <div className="relative" style={{ background: "linear-gradient(to bottom, #e0f7fa, #ffffff)" }}>
      <PanduanUpload />
      <FormUpload />
    </div>
  );
}

function PanduanUpload() {
  return (
    <div className="container mx-auto px-4 md:px-6 lg:px-8 pt-32">
      <h2 className="text-3xl md:text-4xl font-bold text-center text-[#045394] mb-20">Panduan Upload Donasi</h2>

      {/* SVG */}
      <div className="absolute top-40 left-0 w-full h-[700px] -z-10 pointer-events-none hidden md:block">
        <svg className="w-full h-full" viewBox="0 0 1000 700" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M0 80 
                C 200 180, 400 0, 600 180 
                S 800 400, 500 520 
                S 300 620, 500 600"
            stroke="#045394"
            strokeWidth="3"
            fill="none"
          />
        </svg>
      </div>

      {/* Langkah-langkah */}
      <div className="flex flex-col gap-16 relative pr-2">
        {/* Garis penghubung untuk desktop */}
        <div className="hidden md:block absolute inset-0 pointer-events-none">
          <svg className="w-full h-full" viewBox="0 0 1200 600" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Panah marker */}
            <defs>
              <marker id="arrowhead" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto" markerUnits="strokeWidth">
                <polygon points="0 0, 8 3, 0 6" fill="#045394" opacity="0.8" />
              </marker>
            </defs>

            {/* Garis dari card 1 ke card 2 */}
            <path d="M 300 140 C 500 120, 700 120, 900 200" stroke="#045394" strokeWidth="2.5" strokeDasharray="10,5" fill="none" opacity="0.8" markerEnd="url(#arrowhead)" />

            {/* Garis dari card 2 ke card 3 */}
            <path d="M 900 260 C 800 350, 650 380, 600 420" stroke="#045394" strokeWidth="2.5" strokeDasharray="10,5" fill="none" opacity="0.8" markerEnd="url(#arrowhead)" />
          </svg>
        </div>

        {/* Garis vertikal untuk mobile */}
        <div
          className="md:hidden absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-[#045394] via-[#045394] to-[#045394] opacity-40"
          style={{ backgroundImage: "repeating-linear-gradient(to bottom, #045394 0px, #045394 8px, transparent 8px, transparent 16px)" }}
        ></div>

        {/* Langkah 1 */}
        <div className="flex md:justify-start justify-center px-4 relative">
          {/* Dot untuk mobile */}
          <div className="md:hidden absolute left-8 top-8 w-4 h-4 bg-[#045394] rounded-full transform -translate-x-1/2 z-10 shadow-md"></div>

          <div className="step-card max-w-md w-full p-6 rounded-xl shadow-lg border border-teal-100 backdrop-blur-sm bg-white/85 hover:transform hover:-translate-y-1 hover:shadow-xl transition-all duration-300 ease-in-out md:ml-0 ml-8 relative">
            <div className="flex items-center gap-4 mb-3">
              <div className="w-10 h-10 aspect-square bg-[#045394] text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">1</div>
              <h3 className="text-xl font-semibold text-[#045394]">Isi Informasi Donasi</h3>
            </div>
            <ul className="text-sm text-gray-700 space-y-1 pl-6 list-disc">
              <li>Tulis nama barang yang didonasikan.</li>
              <li>Pilih kategori barang.</li>
              <li>Spesifikasikan jenis barang.</li>
            </ul>
          </div>
        </div>

        {/* Langkah 2 */}
        <div className="flex md:justify-end justify-center px-4 relative">
          {/* Dot untuk mobile */}
          <div className="md:hidden absolute left-8 top-8 w-4 h-4 bg-[#045394] rounded-full transform -translate-x-1/2 z-10 shadow-md"></div>

          <div className="step-card max-w-md w-full p-6 rounded-xl shadow-lg border border-teal-100 backdrop-blur-sm bg-white/85 hover:transform hover:-translate-y-1 hover:shadow-xl transition-all duration-300 ease-in-out md:ml-0 ml-8 relative">
            <div className="flex items-center gap-4 mb-3">
              <div className="w-10 h-10 aspect-square bg-[#045394] text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">2</div>
              <h3 className="text-xl font-semibold text-[#045394]">Unggah Foto & Deskripsi</h3>
            </div>
            <ul className="text-sm text-gray-700 space-y-1 pl-6 list-disc">
              <li>Lampirkan foto barang (JPG/PNG, maks. 5 MB).</li>
              <li>Jelaskan kondisi dan detail barang.</li>
            </ul>
          </div>
        </div>

        {/* Langkah 3 */}
        <div className="flex justify-center px-4 relative">
          {/* Dot untuk mobile */}
          <div className="md:hidden absolute left-8 top-8 w-4 h-4 bg-[#045394] rounded-full transform -translate-x-1/2 z-10 shadow-md"></div>

          <div className="step-card max-w-md w-full p-6 rounded-xl shadow-lg border border-teal-100 backdrop-blur-sm bg-white/85 hover:transform hover:-translate-y-1 hover:shadow-xl transition-all duration-300 ease-in-out md:ml-0 ml-8 relative">
            <div className="flex items-center gap-4 mb-3">
              <div className="w-10 h-10 aspect-square bg-[#045394] text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">3</div>
              <h3 className="text-xl font-semibold text-[#045394]">Alamat & Submit</h3>
            </div>
            <ul className="text-sm text-gray-700 space-y-1 pl-6 list-disc">
              <li>Cantumkan alamat barang yang didonasikan.</li>
              <li>Klik tombol "Kirim Donasi" dan tunggu konfirmasi.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
