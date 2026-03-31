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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  const [modalStartIndex, setModalStartIndex] = useState(0);
  const [api, setApi] = useState<CarouselApi>();
  const [modalApi, setModalApi] = useState<CarouselApi>();
  
  // Two-step Add to Cart states
  const [isAddingMode, setIsAddingMode] = useState(false);
  const [tempQuantity, setTempQuantity] = useState(1);

  const currentImage = activeVariant?.image || product.image;
  const hoverImage = activeVariant?.secondaryImage || product.secondaryImage;
  const images = [currentImage, hoverImage, ...(product.extraImages || [])].filter(Boolean) as string[];

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
                    onClick={() => { setModalStartIndex(i); setIsModalOpen(true); }}
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
            onClick={() => { setModalStartIndex(0); setIsModalOpen(true); }}
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
                <Select value={selectedSize} onValueChange={(value) => setSelectedSize(value as Size)}>
                  <SelectTrigger className="w-full font-body text-[9px] md:text-[10px] uppercase tracking-[0.15em] border-border bg-card h-8 px-2.5 hover:border-foreground transition-colors focus:ring-0 focus:ring-offset-0 rounded-none">
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground/60 text-[8px] uppercase tracking-wider">Size:</span>
                      <SelectValue placeholder="Select" />
                    </div>
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border min-w-[120px] rounded-none shadow-xl z-[101]">
                    {availableSizes.map((size) => {
                      const unavailable = product.unavailableSizes?.includes(size);
                      return (
                        <SelectItem 
                          key={size} 
                          value={size} 
                          disabled={unavailable}
                          className="font-body text-[10px] md:text-[11px] uppercase tracking-[0.15em] py-3 focus:bg-muted focus:text-foreground cursor-pointer"
                        >
                          {size} {unavailable ? "(Sold Out)" : ""}
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>

              {/* T-shirt specific Bag Icon placement (at the end of sizes row) */}
              <div className="shrink-0">
                {quantity > 0 ? (
                  // State 3: Already in Cart - Standard Stepper
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
                ) : isAddingMode ? (
                  // State 2: Selection Mode - Stepper + ADD Button
                  <div className="flex items-center gap-2 animate-in fade-in slide-in-from-right-2 duration-300">
                    <div className="flex items-center border border-border bg-card">
                      <button
                        onClick={() => setTempQuantity(Math.max(1, tempQuantity - 1))}
                        className="w-8 h-8 flex items-center justify-center hover:bg-muted transition-colors text-foreground"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="font-body text-xs font-medium w-6 text-center text-foreground">
                        {tempQuantity}
                      </span>
                      <button
                        onClick={() => setTempQuantity(tempQuantity + 1)}
                        className="w-8 h-8 flex items-center justify-center hover:bg-muted transition-colors text-foreground"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                    <button
                      onClick={() => {
                        addToCart(product, selectedSize, activeVariant?.label, tempQuantity);
                        setIsAddingMode(false);
                        setTempQuantity(1);
                      }}
                      className="bg-foreground text-background px-3 h-8 font-body text-[10px] font-bold uppercase tracking-widest hover:bg-foreground/90 transition-colors"
                    >
                      Add
                    </button>
                    <button 
                      onClick={() => setIsAddingMode(false)}
                      className="p-1 text-muted-foreground hover:text-foreground"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ) : (
                  // State 1: Default - Explicit Add Button
                  <button
                    onClick={() => !isDisabled && setIsAddingMode(true)}
                    disabled={isDisabled}
                    className="flex items-center gap-2 px-3 py-2 border border-border hover:border-foreground transition-all font-body text-[10px] uppercase tracking-widest disabled:opacity-40"
                    aria-label="Selection Mode"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span className="hidden sm:inline">Add</span>
                  </button>
                )}
              </div>
            </div>
          ) : (
            /* Cap / Standard layout for items without sizes */
            <div className="w-full flex items-center justify-between">
              {/* Variants row if multi-variant */}
              <div className="flex items-center gap-2">
                {product.variants && product.variants.length > 0 && product.variants.map((v) =>
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
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-background/95 backdrop-blur-sm p-4 md:p-10"
          onClick={() => setIsModalOpen(false)}
        >
          <button
            onClick={() => setIsModalOpen(false)}
            className="absolute top-6 right-6 p-2 text-foreground hover:bg-muted rounded-full transition-colors z-50"
          >
            <X className="w-6 h-6" />
          </button>
          <div
            className="relative w-full max-w-2xl h-full flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <Carousel
              setApi={setModalApi}
              opts={{ loop: true, startIndex: modalStartIndex }}
              className="w-full"
            >
              <CarouselContent>
                {images.map((imgSrc, i) => (
                  <CarouselItem key={i} className="flex items-center justify-center">
                    <img
                      src={imgSrc}
                      alt={`${product.name} view ${i + 1}`}
                      className="max-h-[80vh] max-w-full object-contain cursor-zoom-out"
                      onClick={() => setIsModalOpen(false)}
                    />
                  </CarouselItem>
                ))}
              </CarouselContent>
              {images.length > 1 && (
                <>
                  <CarouselPrevious className="left-2 bg-background/90 hover:bg-background border-border/50 text-foreground" />
                  <CarouselNext className="right-2 bg-background/90 hover:bg-background border-border/50 text-foreground" />
                </>
              )}
            </Carousel>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductCard;
