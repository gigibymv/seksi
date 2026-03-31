import { useState, useEffect } from "react";
import { Plus, Minus, Check, X, ShoppingBag } from "lucide-react";
import { Product } from "@/data/products";
import { useCart, Size } from "@/context/CartContext";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi
} from "@/components/ui/carousel";
import SizeGuide from "./SizeGuide";

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const { items, addToCart, updateQuantity, removeFromCart } = useCart();

  const availableSizes = product.sizes || ["S", "M", "L", "XL"];
  const showSizes = availableSizes.length > 1 || availableSizes[0] !== "One Size";
  const [selectedSize, setSelectedSize] = useState<Size>(availableSizes[0] as Size);
  const [activeVariant, setActiveVariant] = useState(
    product.variants?.[0] || null
  );
  const [isHovered, setIsHovered] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [api, setApi] = useState<CarouselApi>();

  const currentImage = activeVariant?.image || product.image;
  const hoverImage = activeVariant?.secondaryImage || product.secondaryImage;
  const images = [currentImage, hoverImage].filter(Boolean) as string[];

  // Auto-scroll logic to indicate there are more images (specifically the back of the T-shirt)
  useEffect(() => {
    if (!api || images.length <= 1) return;
    
    // Auto-scroll every 3 seconds so the user spots the change on mobile easily
    const interval = setInterval(() => {
      api.scrollNext();
    }, 3000);

    return () => clearInterval(interval);
  }, [api, images.length]);

  const cartItem = items.find(
    (item) => item.product.id === product.id && item.size === selectedSize && item.variantLabel === activeVariant?.label
  );
  const quantity = cartItem?.quantity || 0;
  const totalInCart = items
    .filter((item) => item.product.id === product.id)
    .reduce((sum, item) => sum + item.quantity, 0);

  const isSoldOut = product.soldOut === true;
  const isComingSoon = product.comingSoon === true;
  const isSizeUnavailable = product.unavailableSizes?.includes(selectedSize);
  const isDisabled = isSoldOut || isSizeUnavailable || isComingSoon;

  return (
    <div className="group relative bg-card flex flex-col">
      {/* Image */}
      {/* Image */}
      <div className="aspect-[3/4] overflow-hidden relative group/img bg-muted/20 z-0 w-full">
        {images.length > 1 ? (
          <Carousel setApi={setApi} opts={{ loop: true }} className="absolute inset-0 w-full h-full [&>div]:h-full">
            <CarouselContent className="h-full ml-0">
              {images.map((imgSrc, i) => (
                <CarouselItem key={i} className="pl-0 basis-full h-full">
                  <img
                    src={imgSrc}
                    alt={`${product.name} view ${i + 1}`}
                    className="w-full h-full object-cover cursor-pointer"
                    onClick={() => setIsModalOpen(true)}
                    loading="lazy"
                  />
                </CarouselItem>
              ))}
            </CarouselContent>
            
            <div className="absolute inset-y-1/2 -mt-4 w-full flex justify-between px-3 pointer-events-none opacity-100 md:opacity-0 group-hover/img:opacity-100 transition-opacity z-10">
              <CarouselPrevious 
                className="relative inset-auto h-7 w-7 pointer-events-auto bg-background/90 hover:bg-background border-border/50 text-foreground translate-x-0 translate-y-0" 
              />
              <CarouselNext 
                className="relative inset-auto h-7 w-7 pointer-events-auto bg-background/90 hover:bg-background border-border/50 text-foreground translate-x-0 translate-y-0" 
              />
            </div>
          </Carousel>
        ) : (
          <img
            src={currentImage}
            alt={product.name}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 hover:scale-[1.03] cursor-pointer"
            onClick={() => setIsModalOpen(true)}
            loading="lazy"
          />
        )}

        {/* Sold out tag */}
        {isSoldOut && (
          <div className="absolute top-3 left-3">
            <span className="bg-destructive text-destructive-foreground text-[10px] font-body font-semibold uppercase tracking-widest px-3 py-1">
              Sold Out
            </span>
          </div>
        )}

        {/* Coming soon tag */}
        {isComingSoon && !isSoldOut && (
          <div className="absolute top-3 left-3">
            <span className="bg-foreground/80 text-background text-[10px] font-body font-semibold uppercase tracking-widest px-3 py-1">
              Coming Soon
            </span>
          </div>
        )}

        {/* In-cart badge */}
        {totalInCart > 0 && !isSoldOut && (
          <div className="absolute top-3 right-3">
            <span className="bg-foreground text-background text-[10px] font-body font-semibold w-6 h-6 flex items-center justify-center rounded-full">
              {totalInCart}
            </span>
          </div>
        )}
      </div>

      {/* Info Container */}
      <div className="px-4 pt-5 pb-6">
        {/* Name + Price row */}
        <div className="w-full flex items-start justify-between gap-2 mb-4">
          <h3 className="font-display text-base md:text-lg font-medium text-foreground leading-snug">
            {product.name}
          </h3>
          {!isComingSoon && (
            <span className="font-body text-base font-semibold text-foreground whitespace-nowrap">
              <span className="font-sans">$</span>{product.price}
            </span>
          )}
        </div>

        {product.description && (
          <p className="font-body text-xs text-muted-foreground leading-relaxed line-clamp-2 mb-2">
            {product.description}
          </p>
        )}

        {/* Size Guide */}
        {(product.category === "cap" || product.category === "tshirt") && (
          <div className="mb-4">
            <SizeGuide category={product.category} />
          </div>
        )}

        {/* Sizes & Actions Combined Row */}
        <div className="mt-4">
          {!isSoldOut && !isComingSoon && showSizes ? (
            <div className="flex items-center justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-1.5 flex-wrap">
                  {availableSizes.map((size) => {
                    const unavailable = product.unavailableSizes?.includes(size);
                    return (
                      <button
                        key={size}
                        onClick={() => !unavailable && setSelectedSize(size as Size)}
                        disabled={unavailable}
                        className={`min-w-[40px] h-10 px-2 text-[11px] font-body font-medium border transition-colors ${
                          unavailable
                            ? "border-border/50 text-muted-foreground/30 cursor-not-allowed line-through"
                            : selectedSize === size
                            ? "border-foreground bg-foreground text-background"
                            : "border-border text-muted-foreground hover:border-foreground hover:text-foreground"
                        }`}
                      >
                        {size}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* T-shirt specific Bag Icon placement (at the end of sizes row) */}
              <div className="shrink-0">
                {quantity === 0 ? (
                  <button
                    onClick={() => !isDisabled && addToCart(product, selectedSize, activeVariant?.label)}
                    disabled={isDisabled}
                    className="p-2.5 text-foreground border border-transparent hover:border-border hover:bg-muted transition-all rounded-full disabled:opacity-40"
                    aria-label="Add to Cart"
                  >
                    <ShoppingBag className="w-5 h-5" />
                  </button>
                ) : (
                  <div className="flex items-center border border-border bg-card">
                    <button
                      onClick={() =>
                        quantity === 1
                          ? removeFromCart(product.id, selectedSize, activeVariant?.label)
                          : updateQuantity(product.id, selectedSize, quantity - 1, activeVariant?.label)
                      }
                      className="w-8 h-8 flex items-center justify-center hover:bg-muted transition-colors text-foreground"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="font-body text-xs font-medium w-6 text-center text-foreground">
                      {quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(product.id, selectedSize, quantity + 1, activeVariant?.label)}
                      className="w-8 h-8 flex items-center justify-center hover:bg-muted transition-colors text-foreground"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* Cap / Standard layout for items without sizes */
            <div className="w-full flex items-center justify-between">
              {/* Variants row if multi-variant */}
              <div className="flex items-center gap-2">
                {product.variants && product.variants.length > 1 && product.variants.map((v) =>
                  v.color ? (
                    <button
                      key={v.id}
                      onClick={() => setActiveVariant(v)}
                      title={v.label}
                      className={`w-4 h-4 rounded-full transition-all ${
                        activeVariant?.id === v.id
                          ? "ring-1 ring-offset-2 ring-foreground scale-110"
                          : "hover:scale-110 opacity-80"
                      }`}
                      style={{ backgroundColor: v.color }}
                    />
                  ) : (
                    <button
                      key={v.id}
                      onClick={() => setActiveVariant(v)}
                      className={`px-2 py-1 text-[10px] font-body border transition-colors ${
                        activeVariant?.id === v.id
                          ? "border-foreground text-foreground"
                          : "border-border text-muted-foreground hover:border-foreground/50"
                      }`}
                    >
                      {v.label}
                    </button>
                  )
                )}
              </div>

              {/* Icon-only Add to Cart / Quantity */}
              <div className="shrink-0">
                {isSoldOut || isComingSoon ? (
                  <span className="text-[10px] font-body uppercase tracking-widest text-muted-foreground bg-muted/30 px-2 py-1">
                    {isSoldOut ? "Sold Out" : "Soon"}
                  </span>
                ) : quantity === 0 ? (
                  <button
                    onClick={() => !isDisabled && addToCart(product, selectedSize, activeVariant?.label)}
                    disabled={isDisabled}
                    className="p-2.5 text-foreground border border-transparent hover:border-border hover:bg-muted transition-all rounded-full disabled:opacity-40"
                    aria-label="Add to Cart"
                  >
                    <ShoppingBag className="w-5 h-5" />
                  </button>
                ) : (
                  <div className="flex items-center border border-border bg-card">
                    <button
                      onClick={() =>
                        quantity === 1
                          ? removeFromCart(product.id, selectedSize, activeVariant?.label)
                          : updateQuantity(product.id, selectedSize, quantity - 1, activeVariant?.label)
                      }
                      className="w-8 h-8 flex items-center justify-center hover:bg-muted transition-colors text-foreground"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="font-body text-xs font-medium w-6 text-center text-foreground">
                      {quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(product.id, selectedSize, quantity + 1, activeVariant?.label)}
                      className="w-8 h-8 flex items-center justify-center hover:bg-muted transition-colors text-foreground"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Fullscreen Image Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background/95 backdrop-blur-sm p-4 md:p-10">
          <button
            onClick={() => setIsModalOpen(false)}
            className="absolute top-6 right-6 p-2 text-foreground hover:bg-muted rounded-full transition-colors z-50"
          >
            <X className="w-6 h-6" />
          </button>
          <div className="relative w-full h-full flex items-center justify-center" onClick={() => setIsModalOpen(false)}>
            <img
              src={isHovered && hoverImage ? hoverImage : currentImage}
              alt={product.name}
              className="max-w-full max-h-full object-contain cursor-zoom-out"
              onClick={(e) => e.stopPropagation()} 
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductCard;
