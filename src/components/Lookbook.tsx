import { useEffect, useState } from "react";
import hatBlackRed from "@/assets/hat-black-red.png";
import hatGreenBlue from "@/assets/hat-green-blue.png";
import hatYellowPink from "@/assets/hat-yellow-pink.png";
import hatJeanBrown from "@/assets/hat-jean-brown.png";
import lookbook1 from "@/assets/lookbook-1.png";
import lookbook2 from "@/assets/lookbook-2.png";
import lookbook3 from "@/assets/lookbook-3.png";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi
} from "@/components/ui/carousel";

const images = [
  { src: lookbook1, alt: "Editorial Look 1" },
  { src: lookbook2, alt: "Editorial Look 2" },
  { src: lookbook3, alt: "Editorial Look 3" },
  { src: hatBlackRed, alt: "The Nine Cap — Black & Red" },
  { src: hatGreenBlue, alt: "The Nine Cap — Green & Blue" },
  { src: hatYellowPink, alt: "The Nine Cap — Yellow & Pink" },
  { src: hatJeanBrown, alt: "The Nine Cap — Jean & Brown" },
];

const Lookbook = () => {
  const [api, setApi] = useState<CarouselApi>();

  useEffect(() => {
    if (!api) return;
    
    const interval = setInterval(() => {
      api.scrollNext();
    }, 3000); // Auto-scroll every 3 seconds

    return () => clearInterval(interval);
  }, [api]);

  return (
    <section id="lookbook" className="container mx-auto px-4 md:px-6 py-14 md:py-20">
      <div className="text-center mb-10 md:mb-12">
        <p className="font-body text-[10px] uppercase tracking-[0.35em] text-muted-foreground mb-2">
          Editorial
        </p>
        <h2 className="font-display text-2xl md:text-4xl font-medium text-foreground">
          The Lookbook
        </h2>
        <p className="font-body text-sm text-muted-foreground mt-3 max-w-lg mx-auto leading-relaxed">
          Find the timeless pieces uniquely created for the very special
          Section&nbsp;C, MBA Class of 2027 of HBS
        </p>
      </div>

      <div className="max-w-4xl mx-auto px-10">
        <Carousel 
          opts={{ loop: true, align: "center" }}
          setApi={setApi}
          className="w-full"
        >
          <CarouselContent>
            {images.map((img, i) => (
              <CarouselItem key={i} className="md:basis-1/2 lg:basis-1/2">
                <div className="overflow-hidden group relative aspect-[4/5] bg-muted/20">
                  <img
                    src={img.src}
                    alt={img.alt}
                    // Use object-top so the upper part (where the hat is) is not cropped out
                    className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-500" />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="hidden md:flex -left-12" />
          <CarouselNext className="hidden md:flex -right-12" />
        </Carousel>
      </div>
    </section>
  );
};

export default Lookbook;
