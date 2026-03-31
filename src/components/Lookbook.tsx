import hatBlackRed from "@/assets/hat-black-red.png";
import hatGreenBlue from "@/assets/hat-green-blue.png";
import hatYellowPink from "@/assets/hat-yellow-pink.png";
import hatJeanBrown from "@/assets/hat-jean-brown.png";

const images = [
  { src: hatBlackRed, alt: "The Nine Cap — Black & Red", span: "col-span-2 row-span-2" },
  { src: hatGreenBlue, alt: "The Nine Cap — Green & Blue", span: "col-span-1 row-span-1" },
  { src: hatYellowPink, alt: "The Nine Cap — Yellow & Pink", span: "col-span-1 row-span-1" },
  { src: hatJeanBrown, alt: "The Nine Cap — Jean & Brown", span: "col-span-2 row-span-1" },
];

const Lookbook = () => {
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

      <div className="grid grid-cols-2 md:grid-cols-4 gap-1 auto-rows-[200px] md:auto-rows-[340px]">
        {images.map((img, i) => (
          <div
            key={i}
            className={`${img.span} overflow-hidden group relative`}
          >
            <img
              src={img.src}
              alt={img.alt}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-500" />
          </div>
        ))}
      </div>
    </section>
  );
};

export default Lookbook;
