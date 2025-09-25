import Footer from "./components/Footer";
import Header from "./components/Header";
import ProductsSection from "./components/ProductsSection";
import ScrollToTop from "./components/ScrollToTop";

function App() {
  return (
    <div className="App" data-bs-theme="dark">
      <Header />
      <main>
        <div className="pattern-square"></div>
        <ProductsSection />
      </main>
      <Footer />
      <ScrollToTop />
    </div>
  );
}

export default App;
