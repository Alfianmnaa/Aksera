import React from "react";
import { HeroSection } from "../components/Beranda/HeroSection";
import { AiSection } from "../components/Beranda/AiSection";
import { AboutSection } from "../components/Beranda/AboutSection";
import { ArtikelSection } from "../components/Beranda/ArtikelSection";
import { TargetSection } from "../components/Beranda/TargetSection";
import { PeranSection } from "../components/Beranda/PeranSection";

export const Beranda = () => {
  return (
    <>
      <HeroSection />
      <AboutSection />
      <AiSection />
      <ArtikelSection />
      <TargetSection />
      <PeranSection />
    </>
  );
};
