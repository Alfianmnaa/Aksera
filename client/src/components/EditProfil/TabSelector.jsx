const TabSelector = ({ activeTab, onTabChange }) => {
  return (
    <div className="flex border-b mb-6 space-x-6">
      <button className={`flex items-center pb-2 ${activeTab === "profil" ? "border-b-2 border-blue-600 text-blue-600 font-semibold" : "text-gray-600"}`} onClick={() => onTabChange("profil")}>
        <img src="/icons/user-icon.png" alt="edit profil" className="w-5 h-5 mr-2" />
        Edit Profil
      </button>
      <button className={`flex items-center pb-2 ${activeTab === "password" ? "border-b-2 border-blue-600 text-blue-600 font-semibold" : "text-gray-600"}`} onClick={() => onTabChange("password")}>
        <img src="/icons/lock-icon.png" alt="ubah password" className="w-5 h-5 mr-2" />
        Ubah Password
      </button>
    </div>
  );
};

export default TabSelector;
