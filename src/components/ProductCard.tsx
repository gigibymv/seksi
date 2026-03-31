import { useState } from "react";
import { Plus, Minus, Check } from "lucide-react";
import { Product } from "@/data/products";
import { useCart, Size } from "@/context/CartContext";
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

  const currentImage = activeVariant?.image || product.image;
  const hoverImage = activeVariant?.secondaryImage || product.secondaryImage;

  const cartItem = items.find(
    (item) => item.product.id === product.id && item.size === selectedSize
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
    <div className="group relative bg-card flex flex-col h-full">
      {/* Image */}
      <div
        className="aspect-[3/4] overflow-hidden relative cursor-pointer"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={() => !isDisabled && addToCart(product, selectedSize)}
      >
        <img
          src={isHovered && hoverImage ? hoverImage : currentImage}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
          loading="lazy"
        />

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

      {/* Info */}
      <div className="px-4 pt-4 pb-5 flex flex-col flex-grow space-y-3">
        {/* Name + Price row */}
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-display text-sm md:text-base font-medium text-foreground leading-snug">
            {product.name}
          </h3>
          <span className="font-body text-sm font-semibold text-foreground whitespace-nowrap">
            ${product.price}
          </span>
        </div>

        {product.description && (
          <p className="font-body text-[11px] text-muted-foreground leading-relaxed line-clamp-2">
            {product.description}
          </p>
        )}

        {/* Variants */}
        {product.variants && product.variants.length > 1 && (
          <div className="flex items-center gap-2">
            <span className="font-body text-[10px] uppercase tracking-widest text-muted-foreground">
              Color
            </span>
            {product.variants.map((v) =>
              v.color ? (
                <button
                  key={v.id}
                  onClick={() => setActiveVariant(v)}
                  title={v.label}
                  className={`w-6 h-6 rounded-full transition-all ${
                    activeVariant?.id === v.id
                      ? "ring-2 ring-offset-2 ring-foreground scale-110"
                      : "hover:scale-110"
                  }`}
                  style={{ backgroundColor: v.color }}
                />
              ) : (
                <button
                  key={v.id}
                  onClick={() => setActiveVariant(v)}
                  className={`px-2.5 py-1 text-[11px] font-body border transition-colors ${
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
        )}

        {/* Sizes */}
        {!isSoldOut && !isComingSoon && showSizes && (
          <div className="space-y-1.5">
            <div className="flex items-center gap-1.5 flex-wrap">
              {availableSizes.map((size) => {
                const unavailable = product.unavailableSizes?.includes(size);
                return (
                  <button
                    key={size}
                    onClick={() => !unavailable && setSelectedSize(size as Size)}
                    disabled={unavailable}
                    className={`min-w-[36px] h-9 px-2 text-[11px] font-body font-medium border transition-colors ${
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
            <SizeGuide />
          </div>
        )}

        {/* Add to Cart / Quantity */}
        <div className="mt-auto pt-1">
          {isSoldOut || isComingSoon ? (
            <button
              disabled
              className="w-full py-3 font-body text-[11px] uppercase tracking-widest bg-muted text-muted-foreground cursor-not-allowed"
            >
              {isSoldOut ? "Sold Out" : "Coming Soon"}
            </button>
          ) : quantity === 0 ? (
            <button
              onClick={() => !isDisabled && addToCart(product, selectedSize)}
              disabled={isDisabled}
              className="w-full py-3 font-body text-[11px] uppercase tracking-widest bg-foreground text-background hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed active:scale-[0.98]"
            >
              Add to Cart
            </button>
          ) : (
            <div className="flex items-center gap-3">
              <div className="flex items-center border border-border">
                <button
                  onClick={() =>
                    quantity === 1
                      ? removeFromCart(product.id, selectedSize)
                      : updateQuantity(product.id, selectedSize, quantity - 1)
                  }
                  className="w-10 h-10 flex items-center justify-center hover:bg-muted transition-colors"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="font-body text-sm font-medium w-8 text-center">
                  {quantity}
                </span>
                <button
                  onClick={() => updateQuantity(product.id, selectedSize, quantity + 1)}
                  className="w-10 h-10 flex items-center justify-center hover:bg-muted transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
              <span className="flex items-center gap-1 font-body text-[11px] text-muted-foreground">
                <Check className="w-3.5 h-3.5" />
                In cart
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
