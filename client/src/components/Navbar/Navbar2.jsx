import React from "react";
import Navbar from "./Navbar";

const Navbar2 = () => {
  const customNavLinkClass = (isActive) =>
    `ml-4 text-white ${isActive ? "font-bold" : ""}`;

  return (
    <Navbar
      navbarClasses="w-full fixed z-20 top-0 bg-transparent"
      navLinkClass={customNavLinkClass}
      logoClass="font-bold text-heading-sm text-white"
      buttonClass={{
        login:
          "border-white border-2 bg-transparent rounded text-white px-4 py-2",
        register: "rounded bg-white text-black px-4 py-2",
      }}
      navVariant={2}
    />
  );
};

export default Navbar2;
