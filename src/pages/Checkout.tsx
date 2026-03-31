import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Check } from "lucide-react";
import Header from "@/components/Header";
import { useCart } from "@/context/CartContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const Checkout = () => {
  const { items, totalPrice, clearCart } = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"zelle" | "venmo">("zelle");
  const [form, setForm] = useState({ name: "", email: "" });

  if (items.length === 0 && !confirmed) {
    navigate("/cart");
    return null;
  }

  const handleSubmit = async () => {
    if (!form.name || !form.email) {
      toast.error("Please fill in your name and email");
      return;
    }
    setLoading(true);
    try {
      const { data: order, error: orderError } = await supabase
        .from("orders")
        .insert({
          customer_name: form.name,
          customer_email: form.email,
          total_amount: totalPrice,
          payment_method: paymentMethod,
          payment_confirmed: true,
          status: "paid",
        })
        .select()
        .single();

      if (orderError) throw orderError;

      const orderItems = items.map((item) => ({
        order_id: order.id,
        product_name: `${item.product.name} (${item.size})`,
        product_category: item.product.category,
        quantity: item.quantity,
        unit_price: item.product.price,
      }));

      const { error: itemsError } = await supabase
        .from("order_items")
        .insert(orderItems);

      if (itemsError) throw itemsError;

      clearCart();
      setConfirmed(true);
      toast.success("Order confirmed! Thank you for your purchase.");
    } catch (error) {
      console.error("Error creating order:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (confirmed) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-6 pt-28 pb-20 text-center max-w-lg">
          <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="w-8 h-8 text-secondary-foreground" />
          </div>
          <h1 className="section-heading mb-4">Order Confirmed</h1>
          <p className="font-body text-muted-foreground text-sm mb-8">
            Thank you, {form.name}! We've received your order and payment confirmation.
            You'll receive a confirmation at {form.email}.
          </p>
          <button onClick={() => navigate("/")} className="btn-primary">
            Back to Shop
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-5 pt-28 pb-16 max-w-xl">
        <button
          onClick={() => navigate("/cart")}
          className="inline-flex items-center gap-2 font-body text-xs uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Cart
        </button>

        <h1 className="font-display text-3xl md:text-4xl font-medium text-foreground mb-10">
          Checkout
        </h1>

        <div className="space-y-6">
          {/* Full Name */}
          <div>
            <label className="font-body text-sm text-foreground block mb-2">
              Full Name
            </label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full border border-border bg-card px-4 py-3.5 font-body text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-foreground"
              required
            />
          </div>

          {/* Email */}
          <div>
            <label className="font-body text-sm text-foreground block mb-2">
              Email
            </label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full border border-border bg-card px-4 py-3.5 font-body text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-foreground"
              required
            />
          </div>

          {/* Payment Method */}
          <div>
            <label className="font-body text-sm text-foreground block mb-3">
              Payment Method
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setPaymentMethod("zelle")}
                className={`py-3.5 text-[11px] font-body uppercase tracking-[0.2em] transition-colors ${
                  paymentMethod === "zelle"
                    ? "bg-foreground text-background"
                    : "border border-border text-muted-foreground hover:border-foreground hover:text-foreground"
                }`}
              >
                Zelle
              </button>
              <button
                onClick={() => setPaymentMethod("venmo")}
                className={`py-3.5 text-[11px] font-body uppercase tracking-[0.2em] transition-colors ${
                  paymentMethod === "venmo"
                    ? "bg-foreground text-background"
                    : "border border-border text-muted-foreground hover:border-foreground hover:text-foreground"
                }`}
              >
                Venmo
              </button>
            </div>
          </div>

          {/* Divider + Total */}
          <div className="border-t border-border pt-6">
            <div className="flex justify-between items-center mb-6">
              <span className="font-display text-lg text-foreground">Total</span>
              <span className="font-display text-xl font-semibold text-foreground">
                ${totalPrice.toFixed(2)}
              </span>
            </div>

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="btn-primary w-full text-center disabled:opacity-50"
            >
              {loading ? "Processing..." : "Continue to Payment"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
