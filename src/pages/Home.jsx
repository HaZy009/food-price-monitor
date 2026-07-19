import { useState } from "react";

import Header from "../components/layout/Header";
import HeroSection from "../components/layout/HeroSection";
import Footer from "../components/layout/Footer";
import StatCards from "../components/cards/StatCards";
import PriceTrendSection from "../components/charts/PriceTrendSection";

import "./Home.css";

function Home() {
  const [selectedRegion, setSelectedRegion] = useState("canada");
  const [selectedProduct, setSelectedProduct] = useState("almonds-200-grams");

  return (
    <div className="app-shell" id="top">
      <Header />

      <main className="main-content">
        <div className="page-container">
          <HeroSection
            selectedRegion={selectedRegion}
            onRegionChange={setSelectedRegion}
          />

          <StatCards
            selectedProduct={selectedProduct}
            selectedRegion={selectedRegion}
          />

          <PriceTrendSection
            selectedProduct={selectedProduct}
            onProductChange={setSelectedProduct}
            selectedRegion={selectedRegion}
          />
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default Home;
