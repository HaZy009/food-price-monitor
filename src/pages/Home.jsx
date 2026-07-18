import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";

import "./Home.css";

function Home() {
  return (
    <div className="app-shell" id="top">
      <Header />

      <main className="main-content">
        <div className="page-container">
          {/* Le hero et le dashboard seront ajoutés progressivement ici. */}
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default Home;