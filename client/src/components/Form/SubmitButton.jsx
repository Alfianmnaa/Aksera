import React from "react";
import loadingWhite from "../../assets/Daftar/loadingWhite.gif";

export default function SubmitButton({ loading, children }) {
  return (
    <button type="submit" className="text-white font-semibold py-3 rounded-lg bg-primary flex justify-center gap-2 items-center transition-all duration-300 ease-in-ou">
      <div>{children}</div>
      {loading && <img src={loadingWhite} alt="loading" className="w-8 -h-8 -mr-4" />}
    </button>
  );
}
