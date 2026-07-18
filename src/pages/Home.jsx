import { useState } from "react";

import Header from "../components/layout/Header";
import HeroSection from "../components/layout/HeroSection";
import Footer from "../components/layout/Footer";

import "./Home.css";

function Home() {
  const [selectedRegion, setSelectedRegion] = useState("canada");

  return (
    <div className="app-shell" id="top">
      <Header />

      <main className="main-content">
        <div className="page-container">
          <HeroSection
            selectedRegion={selectedRegion}
            onRegionChange={setSelectedRegion}
          />
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default Home;