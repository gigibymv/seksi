import { useNavigate } from "react-router-dom";
import { Minus, Plus, X } from "lucide-react";
import { useCart } from "@/context/CartContext";

interface CartContentProps {
  onCheckout?: () => void;
}

const CartContent = ({ onCheckout }: CartContentProps) => {
  const { items, updateQuantity, removeFromCart, totalPrice } = useCart();
  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center px-4">
        <h2 className="font-display text-xl font-medium mb-4">Your Cart is Empty</h2>
        <p className="font-body text-muted-foreground text-sm mb-8 max-w-[250px]">
          Discover our curated collection and find your next favorite piece.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto px-1 pr-2 custom-scrollbar">
        <div className="space-y-0 divide-y divide-border/50">
          {items.map(({ product, size, quantity, variantLabel }) => {
            const variantImage = variantLabel 
              ? product.variants?.find(v => v.label === variantLabel)?.image 
              : null;
              
            let displayName = product.name;
            let displayColor = variantLabel;

            if (product.category === "cap") {
              displayName = "Cap";
            } else if (product.category === "tshirt") {
              if (product.name.includes('"Noir"')) {
                displayName = "The Nine T-shirt";
                displayColor = "Black";
              } else if (product.name.includes('"Blanc"')) {
                displayName = "The Nine T-shirt";
                displayColor = "White";
              }
            }

            return (
              <div key={`${product.id}-${size}-${variantLabel || 'base'}`} className="flex items-center gap-4 py-6">
                <div className="w-16 h-20 bg-muted flex-shrink-0 overflow-hidden relative border border-border/10">
                  <img
                    src={variantImage || product.image}
                    alt={displayName}
                    className="w-full h-full object-cover object-top"
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="font-display text-sm font-medium text-foreground truncate uppercase tracking-widest">
                    {displayName}
                  </h3>
                  <p className="font-body text-[10px] text-muted-foreground capitalize mt-1 space-x-2">
                    {displayColor && (
                      <span className="normal-case">Color: {displayColor}</span>
                    )}
                    {size !== "One Size" && (
                      <>
                        <span className="opacity-30">·</span>
                        <span className="normal-case">Size: {size}</span>
                      </>
                    )}
                  </p>
                  <p className="font-body text-xs font-semibold text-foreground mt-1.5">
                    <span className="font-sans">$</span>{product.price}
                  </p>
                </div>

                <div className="flex items-center gap-2.5">
                  <button
                    onClick={() => updateQuantity(product.id, size, quantity - 1, variantLabel)}
                    className="w-6 h-6 border border-border flex items-center justify-center hover:bg-muted transition-colors"
                  >
                    <Minus className="w-2.5 h-2.5" />
                  </button>
                  <span className="font-body text-[11px] font-medium w-4 text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => updateQuantity(product.id, size, quantity + 1, variantLabel)}
                    className="w-6 h-6 border border-border flex items-center justify-center hover:bg-muted transition-colors"
                  >
                    <Plus className="w-2.5 h-2.5" />
                  </button>
                  
                  <button
                    onClick={() => removeFromCart(product.id, size, variantLabel)}
                    className="ml-2 text-muted-foreground/40 hover:text-destructive transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="border-t border-border pt-6 mt-auto space-y-4">
        <div className="flex justify-between items-center">
          <span className="font-body text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
            Subtotal
          </span>
          <span className="font-body text-xl font-semibold text-foreground">
            <span className="font-sans">$</span>{totalPrice.toFixed(2)}
          </span>
        </div>

        <button
          onClick={() => {
            if (onCheckout) onCheckout();
            navigate("/checkout");
          }}
          className="btn-primary w-full text-center py-4 text-[11px] tracking-[0.2em]"
        >
          Proceed to Checkout
        </button>
        
        <p className="text-[9px] text-center text-muted-foreground font-body uppercase tracking-[0.1em] leading-relaxed">
          Shipping and taxes are included in the price.<br />
          All products will be delivered at HBS.
        </p>
      </div>
    </div>
  );
};

export default CartContent;
