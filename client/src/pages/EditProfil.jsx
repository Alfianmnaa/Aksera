import { useState } from "react";
import { Profil } from "./DonasiSaya";
import EditProfilForm from "../components/EditProfil/EditProfilForm";
import UbahPasswordForm from "../components/EditProfil/UbahPasswordForm";

export default function EditProfil() {
  const [activeTab, setActiveTab] = useState("profil");

  return (
    <>
      <Profil />
      <div className="max-w-5xl mx-auto mb-64 px-6">
        <TabSelector activeTab={activeTab} setActiveTab={setActiveTab} />

        <h2 className="md:text-xl text-md font-semibold mb-4">Informasi Pribadi</h2>

        {activeTab === "profil" ? <EditProfilForm /> : <UbahPasswordForm />}
      </div>
    </>
  );
}

function TabSelector({ activeTab, setActiveTab }) {
  return (
    <div className="flex md:gap-12 mb-8 font-medium">
      <button className={`border-b-2 md:text-body-md text-sm border-0 bg-transparent rounded-none pb-2 ${activeTab === "profil" ? "text-primary border-primary" : "text-gray-500"}`} onClick={() => setActiveTab("profil")}>
        Edit Profil
      </button>
    </div>
  );
}
