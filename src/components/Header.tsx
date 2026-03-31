import { Link } from "react-router-dom";
import { ShoppingBag } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useState, useEffect } from "react";

const Header = () => {
  const { totalItems } = useCart();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const textClass = scrolled ? "text-foreground" : "text-white";

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-background/95 backdrop-blur-sm border-b border-border"
          : "bg-transparent"
      }`}
    >
      <div className="container mx-auto flex items-center justify-between py-4 px-5 md:px-6">
        {/* Logo — left */}
        <Link
          to="/"
          className={`font-display text-lg md:text-xl font-semibold tracking-[0.08em] transition-colors duration-300 ${textClass}`}
        >
          sek-si
        </Link>

        {/* Nav — right: Collection, Lookbook, Cart icon */}
        <nav className="flex items-center gap-5 md:gap-8">
          <a
            href="#collection"
            className={`font-body text-[10px] font-medium uppercase tracking-[0.2em] transition-colors duration-300 hover:opacity-70 ${textClass}`}
          >
            Collection
          </a>
          <a
            href="#lookbook"
            className={`font-body text-[10px] font-medium uppercase tracking-[0.2em] transition-colors duration-300 hover:opacity-70 ${textClass}`}
          >
            Lookbook
          </a>
          <Link
            to="/cart"
            className={`relative transition-colors duration-300 hover:opacity-70 ${textClass}`}
          >
            <ShoppingBag className="w-5 h-5" />
            {totalItems > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-destructive text-destructive-foreground text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;
