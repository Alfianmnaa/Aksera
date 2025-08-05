import FormUpload from "../components/UploadDonasi/FormUpload";

export default function UploadDonasi() {
  return (
    <>
      <PanduanUpload />
      <FormUpload />
    </>
  );
}

function PanduanUpload() {
  return (
    <div className="md:flex md:flex-col gap-8 max-w-5xl mx-auto p-8 md:px-[59px]">
      <h2 className="text-4xl font-bold text-center md:text-left mb-20">Panduan Upload Donasi:</h2>

      {/* Kontainer Utama Timeline */}
      <div className="relative">
        {/* Garis Vertikal - Kiri untuk mobile, tengah untuk desktop */}
        <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-0.5 bg-gray-300 md:transform md:-translate-x-1/2 z-0"></div>

        {/* Langkah 1 */}
        <div className="relative flex items-start mb-14">
          {/* Mobile Layout - Line on left */}
          <div className="md:hidden w-full">
            <div className="flex items-start">
              {/* Dot untuk mobile - positioned exactly on the line */}
              <div className="absolute left-6 transform -translate-x-1/2 mt-2 z-10">
                <div className="w-5 h-5 rounded-full bg-orange-500 border-2 border-white"></div>
              </div>

              <div className="flex-1 ml-12">
                <h3 className="text-2xl font-semibold text-orange-500 mb-4">Langkah 1</h3>
                <div className="border rounded-lg shadow-lg p-6 bg-white">
                  <div className="mb-4 text-base font-semibold text-gray-700">Isi Informasi Donasi</div>
                  <ul className="list-disc list-inside text-sm text-gray-600">
                    <li>Tulis nama barang yang didonasikan.</li>
                    <li>Pilih kategori barang.</li>
                    <li>Spesifikasikan jenis barang.</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Desktop Layout - Alternating sides */}
          <div className="hidden md:flex w-full">
            {/* Spacer for left side */}
            <div className="w-1/2"></div>

            {/* Content on right side */}
            <div className="w-1/2 pl-12 relative">
              {/* Dot untuk desktop */}
              <div className="absolute -left-2.5 top-2 w-5 h-5 rounded-full bg-orange-500 z-10 border-2 border-white"></div>

              <h3 className="text-2xl font-semibold text-orange-500 mb-4">Langkah 1</h3>
              <div className="border rounded-lg shadow-lg p-6 bg-white">
                <div className="mb-4 text-base md:text-lg font-semibold text-gray-700">Isi Informasi Donasi</div>
                <ul className="list-disc list-inside text-sm md:text-base text-gray-600">
                  <li>Tulis nama barang yang didonasikan.</li>
                  <li>Pilih kategori barang.</li>
                  <li>Spesifikasikan jenis barang.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Langkah 2 */}
        <div className="relative flex items-start mb-14">
          {/* Mobile Layout - Line on left */}
          <div className="md:hidden w-full">
            <div className="flex items-start">
              {/* Dot untuk mobile - positioned exactly on the line */}
              <div className="absolute left-6 transform -translate-x-1/2 mt-2 z-10">
                <div className="w-5 h-5 rounded-full bg-orange-500 border-2 border-white"></div>
              </div>

              <div className="flex-1 ml-12">
                <h3 className="text-2xl font-semibold text-orange-500 mb-4">Langkah 2</h3>
                <div className="border rounded-lg shadow-lg p-6 bg-white">
                  <div className="mb-2 text-base font-semibold text-gray-700">Unggah Foto & Deskripsi</div>
                  <ul className="list-disc list-inside text-sm text-gray-600">
                    <li>Lampirkan foto barang (pastikan jelas).</li>
                    <li>Jelaskan kondisi dan detail barang.</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Desktop Layout - Left side content */}
          <div className="hidden md:flex w-full">
            {/* Content on left side */}
            <div className="w-1/2 pr-12 relative">
              {/* Dot untuk desktop */}
              <div className="absolute -right-2.5 top-2 w-5 h-5 rounded-full bg-orange-500 z-10 border-2 border-white"></div>

              <h3 className="text-2xl font-semibold text-orange-500 mb-4 text-right">Langkah 2</h3>
              <div className="border rounded-lg shadow-lg p-6 bg-white">
                <div className="mb-2 text-base md:text-lg font-semibold text-gray-700">Unggah Foto & Deskripsi</div>
                <ul className="list-disc list-inside text-sm md:text-base text-gray-600">
                  <li>Lampirkan foto barang (pastikan jelas).</li>
                  <li>Jelaskan kondisi dan detail barang.</li>
                </ul>
              </div>
            </div>

            {/* Spacer for right side */}
            <div className="w-1/2"></div>
          </div>
        </div>

        {/* Langkah 3 */}
        <div className="relative flex items-start mb-14">
          {/* Mobile Layout - Line on left */}
          <div className="md:hidden w-full">
            <div className="flex items-start">
              {/* Dot untuk mobile - positioned exactly on the line */}
              <div className="absolute left-6 transform -translate-x-1/2 mt-2 z-10">
                <div className="w-5 h-5 rounded-full bg-orange-500 border-2 border-white"></div>
              </div>

              <div className="flex-1 ml-12">
                <h3 className="text-2xl font-semibold text-orange-500 mb-2">Langkah 3</h3>
                <div className="border rounded-lg shadow-lg p-6 bg-white">
                  <div className="mb-2 text-base font-semibold text-gray-700">Alamat & Submit</div>
                  <ul className="list-disc list-inside text-sm text-gray-600">
                    <li>Cantumkan alamat barang yang didonasikan.</li>
                    <li>Klik tombol 'Kirim' dan tunggu konfirmasi.</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Desktop Layout - Right side content */}
          <div className="hidden md:flex w-full">
            {/* Spacer for left side */}
            <div className="w-1/2"></div>

            {/* Content on right side */}
            <div className="w-1/2 pl-12 relative">
              {/* Dot untuk desktop */}
              <div className="absolute -left-2.5 top-2 w-5 h-5 rounded-full bg-orange-500 z-10 border-2 border-white"></div>

              <h3 className="text-2xl font-semibold text-orange-500 mb-2">Langkah 3</h3>
              <div className="border rounded-lg shadow-lg p-6 bg-white">
                <div className="mb-2 text-base md:text-lg font-semibold text-gray-700">Alamat & Submit</div>
                <ul className="list-disc list-inside text-sm md:text-base text-gray-600">
                  <li>Cantumkan alamat barang yang didonasikan.</li>
                  <li>Klik tombol 'Kirim' dan tunggu konfirmasi.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
