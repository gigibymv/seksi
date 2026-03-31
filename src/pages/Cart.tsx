import { Link } from "react-router-dom";
import Header from "@/components/Header";
import CartContent from "@/components/CartContent";

const Cart = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-6 py-12 max-w-2xl">
        <h1 className="section-heading mb-8">Your Cart</h1>
        <CartContent />
        
        <div className="mt-12 text-center">
          <Link
            to="/"
            className="font-body text-[10px] uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Cart;
