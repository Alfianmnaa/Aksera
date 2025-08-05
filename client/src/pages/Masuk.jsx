import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import { axiosInstance } from "../config";
import Navbar from "../components/Navbar/Navbar";
import FormMasuk from "../components/Masuk/FormMasuk";
import Footer from "../components/Footer/Footer";

export default function Masuk() {

  return (
    <>
      <FormMasuk />
    </>
  );
}
