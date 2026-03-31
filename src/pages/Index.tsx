import { useState } from "react";
import Header from "@/components/Header";
import HeroBanner from "@/components/HeroBanner";
import Lookbook from "@/components/Lookbook";
import ProductCard from "@/components/ProductCard";
import { products, categories, Category } from "@/data/products";

const Index = () => {
  const [activeCategory, setActiveCategory] = useState<Category | "all">("all");

  const filteredProducts =
    activeCategory === "all"
      ? products
      : products.filter((p) => p.category === activeCategory);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <HeroBanner />
      <Lookbook />

      {/* Collection */}
      <section id="collection" className="container mx-auto px-4 md:px-6 pt-14 md:pt-20 pb-10">
        <div className="text-center mb-10 md:mb-12">
          <p className="font-body text-[10px] uppercase tracking-[0.35em] text-muted-foreground mb-2">
            Shop by Category
          </p>
          <h2 className="font-display text-2xl md:text-4xl font-medium text-foreground">
            The Collection
          </h2>
        </div>

        {/* Category filters */}
        <div className="flex flex-wrap justify-center gap-2 md:gap-3 mb-10 md:mb-14">
          {categories.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setActiveCategory(cat.value)}
              className={
                activeCategory === cat.value
                  ? "category-chip-active"
                  : "category-chip"
              }
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-px md:gap-1">
          {filteredProducts
            .filter((p) => !p.comingSoon)
            .map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
        </div>

        {/* Coming Soon Grid */}
        {filteredProducts.filter((p) => p.comingSoon).length > 0 && (
          <div className="mt-20 md:mt-32">
            <h3 className="font-display text-2xl text-foreground text-center mb-10">
              Coming Soon
            </h3>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-px md:gap-1">
              {filteredProducts
                .filter((p) => p.comingSoon)
                .map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
            </div>
          </div>
        )}
      </section>

      {/* Footer */}
      <footer className="border-t border-border mt-16 md:mt-20 py-10 md:py-12">
        <div className="container mx-auto px-4 md:px-6 text-center space-y-3">
          <p className="font-display text-lg text-foreground">sek-si</p>
          <p className="font-body text-[10px] text-muted-foreground uppercase tracking-[0.3em]">
            © 2026 sek-si — Section C · MBA 2027 <br className="md:hidden" />· All rights reserved
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
