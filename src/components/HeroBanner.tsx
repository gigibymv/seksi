import { useState, useEffect, useCallback } from "react";
import Marquee from "./Marquee";
import banner1 from "@/assets/hero-banner-1.png";
import banner3 from "@/assets/hero-banner-3.png";
import banner4 from "@/assets/hero-banner-4.png";
import banner5 from "@/assets/hero-banner-5.png";

const slides = [banner4, banner1, banner3, banner5];

const HeroBanner = () => {
  const [current, setCurrent] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const goToNext = useCallback(() => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
      setIsTransitioning(false);
    }, 600);
  }, []);

  useEffect(() => {
    const interval = setInterval(goToNext, 4000);
    return () => clearInterval(interval);
  }, [goToNext]);

  return (
    <>
      <section className="relative w-full h-[85vh] md:h-[90vh] overflow-hidden bg-foreground">
        {slides.map((src, i) => (
          <div
            key={i}
            className="absolute inset-0 transition-opacity duration-700 ease-in-out"
            style={{ opacity: current === i && !isTransitioning ? 1 : 0 }}
          >
            <img
              src={src}
              alt={`Collection slide ${i + 1}`}
              className="w-full h-full object-cover object-top"
            />
          </div>
        ))}

        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/25 to-black/10" />

        <div className="absolute inset-x-0 bottom-0 flex flex-col items-center px-6 pb-20 md:pb-28 text-center">
          <p className="font-body text-[10px] md:text-xs uppercase tracking-[0.35em] text-white/60 mb-3">
            Section C · Harvard Business School
          </p>
          <h1 className="font-display text-3xl md:text-6xl lg:text-7xl font-medium text-white leading-[1.1] max-w-4xl drop-shadow-lg">
            MERCH COLLECTION C&nbsp;'27
          </h1>
          <a
            href="#collection"
            className="mt-8 inline-block border border-white/60 text-white px-10 py-3.5 text-[11px] font-body uppercase tracking-[0.3em] hover:bg-white hover:text-black transition-all duration-300"
          >
            Shop
          </a>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => { setIsTransitioning(false); setCurrent(i); }}
              className={`h-[2px] transition-all duration-300 ${
                current === i ? "w-8 bg-white" : "w-4 bg-white/40"
              }`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      </section>

      <Marquee />
    </>
  );
};

export default HeroBanner;
