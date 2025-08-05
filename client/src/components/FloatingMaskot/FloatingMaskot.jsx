import React from "react";
import { Link } from "react-router-dom";
import maskotImage from "../../assets/Maskot/Maskot-unscreen.gif";

const FloatingMascot = () => {
  return (
    <Link
      to="../../ummah-partner"
      className="fixed bottom-5 right-8 z-50 cursor-pointer transition-transform duration-300 ease-in-out hover:scale-110 group"
      aria-label="Buka Ummah Partner"
    >
      <span className="absolute bottom-full  whitespace-nowrap rounded-md bg-[#F79319] px-3 py-1 text-sm text-white font-bold opacity-0 transition-opacity group-hover:opacity-100">
        Tanya Luma
      </span>
      <img
        src={maskotImage}
        alt="Maskot"
        className="h-auto w-24 cursor-pointer transition-transform duration-300 ease-in-out group-hover:scale-110"
      />
    </Link>
  );
};

export default FloatingMascot;
