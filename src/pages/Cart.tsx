import { Link, useNavigate } from "react-router-dom";
import { Minus, Plus, X, ArrowLeft } from "lucide-react";
import Header from "@/components/Header";
import { useCart } from "@/context/CartContext";

const Cart = () => {
  const { items, updateQuantity, removeFromCart, totalPrice } = useCart();
  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-6 py-20 text-center">
          <h1 className="section-heading mb-4">Your Cart is Empty</h1>
          <p className="font-body text-muted-foreground text-sm mb-8">
            Discover our curated collection and find your next favorite piece.
          </p>
          <Link to="/" className="btn-primary inline-block">
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-6 py-12 max-w-3xl">
        <Link
          to="/"
          className="inline-flex items-center gap-2 font-body text-xs uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Continue Shopping
        </Link>

        <h1 className="section-heading mb-8">Your Cart</h1>

        <div className="space-y-0 divide-y divide-border border-t border-border">
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
                <div className="w-20 h-24 bg-muted flex-shrink-0 overflow-hidden relative">
                  <img
                    src={variantImage || product.image}
                    alt={displayName}
                    className="w-full h-full object-cover object-top"
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="font-display text-base font-medium text-foreground truncate">
                    {displayName}
                  </h3>
                  <p className="font-body text-xs text-muted-foreground capitalize mt-0.5 space-x-2">
                    <span>{product.category}</span>
                    {displayColor && (
                      <>
                        <span>·</span>
                        <span className="normal-case">Color: {displayColor}</span>
                      </>
                    )}
                    {size !== "One Size" && (
                      <>
                        <span>·</span>
                        <span className="normal-case">Size: {size}</span>
                      </>
                    )}
                  </p>
                  <p className="font-body text-sm font-semibold text-foreground mt-1">
                    <span className="font-sans">$</span>{product.price}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => updateQuantity(product.id, size, quantity - 1, variantLabel)}
                    className="w-7 h-7 border border-border flex items-center justify-center hover:bg-muted transition-colors"
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="font-body text-sm font-medium w-4 text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => updateQuantity(product.id, size, quantity + 1, variantLabel)}
                    className="w-7 h-7 border border-border flex items-center justify-center hover:bg-muted transition-colors"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>

                <button
                  onClick={() => removeFromCart(product.id, size, variantLabel)}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            );
          })}
        </div>

        <div className="border-t border-border mt-0 pt-6 space-y-4">
          <div className="flex justify-between items-center">
            <span className="font-body text-sm uppercase tracking-widest text-muted-foreground">
              Total
            </span>
            <span className="font-display text-2xl font-semibold text-foreground">
              <span className="font-sans">$</span>{totalPrice.toFixed(2)}
            </span>
          </div>

          <button
            onClick={() => navigate("/checkout")}
            className="btn-primary w-full text-center"
          >
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
