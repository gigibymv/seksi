import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Check } from "lucide-react";
import Header from "@/components/Header";
import { useCart } from "@/context/CartContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const Checkout = () => {
  const { items, totalPrice, totalItems, clearCart } = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<"details" | "payment" | "confirmed">("details");
  const [paymentMethod, setPaymentMethod] = useState<"zelle" | "venmo">("zelle");
  const [form, setForm] = useState({ name: "", email: "", comment: "" });

  if (items.length === 0 && step !== "confirmed") {
    navigate("/cart");
    return null;
  }

  const handleContinueToPayment = () => {
    if (!form.name || !form.email) {
      toast.error("Please fill in your name and email");
      return;
    }
    setStep("payment");
  };

  const handleConfirmPayment = async () => {
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

      const orderItems = items.map((item) => {
        let baseName = item.product.name;
        // Generic naming for DB
        if (item.product.category === "cap") baseName = "Cap";
        
        let name = baseName;
        if (item.variantLabel && item.variantLabel.trim() !== "") {
          name += ` — "${item.variantLabel}"`;
        }
        if (item.size !== "One Size") {
          name += ` (${item.size})`;
        }
        
        return {
          order_id: order.id,
          product_name: name,
          product_category: item.product.category,
          quantity: item.quantity,
          unit_price: item.product.price,
        };
      });

      // Inject order notes as a pseudo-item to surface it elegantly in the admin dashboard
      if (form.comment && form.comment.trim() !== "") {
        orderItems.push({
          order_id: order.id,
          product_name: `Note: ${form.comment.trim().substring(0, 500)}`,
          product_category: "note" as any,
          quantity: 1,
          unit_price: 0,
        });
      }

      const { error: itemsError } = await supabase
        .from("order_items")
        .insert(orderItems);

      if (itemsError) throw itemsError;

      clearCart();
      setStep("confirmed");
      toast.success("Order confirmed! Thank you for your purchase.");
    } catch (error) {
      console.error("Error creating order:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (step === "confirmed") {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-6 pt-28 pb-20 text-center max-w-lg">
          <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="w-8 h-8 text-secondary-foreground" />
          </div>
          <h1 className="section-heading mb-4">Order Confirmed</h1>
          <p className="font-body text-muted-foreground text-sm mb-4">
            Thank you, {form.name}! We've received your order and payment confirmation.
            You'll receive a confirmation at {form.email}.
          </p>
          <div className="bg-secondary/30 p-4 mb-8 text-sm font-body text-foreground border border-border text-left">
            <strong>Important:</strong> Orders will be delivered on a fixed date on the HBS campus. An email will be sent when your order is available for pickup.
          </div>
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
        {step === "details" && (
          <button
            onClick={() => navigate("/cart")}
            className="inline-flex items-center gap-2 font-body text-xs uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Cart
          </button>
        )}

        {step === "payment" && (
          <button
            onClick={() => setStep("details")}
            className="inline-flex items-center gap-2 font-body text-xs uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Details
          </button>
        )}

        <h1 className="font-display text-3xl md:text-4xl font-medium text-foreground mb-10">
          {step === "details" ? "Checkout" : "Payment"}
        </h1>

        {step === "details" ? (
          <div className="space-y-6">
            {/* Order Summary */}
            <div className="mb-8 p-6 bg-muted/30 border border-border">
              <h2 className="font-display text-lg text-foreground mb-4">Order Summary</h2>
              <div className="space-y-4">
                {items.map((item, idx) => {
                  const variantImage = item.variantLabel
                    ? item.product.variants?.find((v) => v.label === item.variantLabel)?.image
                    : null;

                  let displayName = item.product.name;
                  let displayColor = item.variantLabel;

                  if (item.product.category === "cap") {
                    displayName = "Cap";
                  } else if (item.product.category === "tshirt") {
                    if (item.product.name.includes('"Noir"')) {
                      displayName = "The Nine T-shirt";
                      displayColor = "Black";
                    } else if (item.product.name.includes('"Blanc"')) {
                      displayName = "The Nine T-shirt";
                      displayColor = "White";
                    }
                  }

                  return (
                    <div key={idx} className="flex gap-4 items-center">
                      <div className="w-16 h-20 shrink-0 bg-muted/20 overflow-hidden relative">
                        <img
                          src={variantImage || item.product.image}
                          alt={item.product.name}
                          className="w-full h-full object-cover object-top"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-display text-sm text-foreground truncate">{displayName}</p>
                        <p className="font-body text-[11px] text-muted-foreground mt-1 truncate">
                          <span className="capitalize">{item.product.category}</span>
                          {displayColor && (
                            <>
                              <span className="mx-1.5">·</span>
                              <span className="mr-2 normal-case">Color: {displayColor}</span>
                            </>
                          )}
                          {item.size !== "One Size" && (
                            <>
                              <span className="mr-1.5">·</span>
                              <span className="normal-case">Size: {item.size}</span>
                            </>
                          )}
                        </p>
                        <p className="font-body text-xs font-medium text-foreground mt-1.5">
                          {item.quantity} × <span className="font-sans">$</span>{item.product.price}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="border-t border-border mt-5 pt-4 flex justify-between items-center">
                <span className="font-display text-sm text-muted-foreground">Total ({totalItems} items)</span>
                <span className="font-body text-base font-medium text-foreground font-sans"><span className="font-sans">$</span>{totalPrice}</span>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="font-display text-lg text-foreground">Delivery Information</h3>
              <p className="font-body text-xs text-muted-foreground leading-relaxed mt-1">
                Orders will be delivered on a fixed date to the HBS campus. An email will be sent when your order is available for pickup.
              </p>
            </div>

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

          {/* Comment */}
          <div>
            <label className="font-body text-sm text-foreground block mb-2">
              Order notes (optional)
            </label>
            <textarea
              value={form.comment}
              onChange={(e) => setForm({ ...form, comment: e.target.value })}
              className="w-full border border-border bg-card px-4 py-3.5 font-body text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-foreground resize-none"
              rows={3}
              placeholder="Ex: custom request..."
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
              <span className="font-body text-xl font-semibold text-foreground">
                <span className="font-sans">$</span>{totalPrice.toFixed(2)}
              </span>
            </div>

            <button
              onClick={handleContinueToPayment}
              className="btn-primary w-full text-center"
            >
              Continue to Payment
            </button>
          </div>
        </div>
        ) : (
          <div className="space-y-8">
            <div className="bg-card border border-border p-6 md:p-8 space-y-6">
              <div className="text-center space-y-2">
                <p className="font-display text-lg text-foreground">Amount to send</p>
                <p className="font-body text-3xl font-semibold text-foreground">
                  <span className="font-sans">$</span>{totalPrice.toFixed(2)}
                </p>
              </div>

              <div className="border-t border-border pt-6 text-center space-y-4">
                {paymentMethod === "zelle" ? (
                  <>
                    <p className="font-body text-sm font-semibold uppercase tracking-widest text-muted-foreground">
                      Send via Zelle
                    </p>
                    <p className="font-display text-xl md:text-2xl text-foreground">
                      562-292-9329
                    </p>
                  </>
                ) : (
                  <>
                    <p className="font-body text-sm font-semibold uppercase tracking-widest text-muted-foreground">
                      Send via Venmo
                    </p>
                    <p className="font-display text-xl md:text-2xl text-foreground">
                      @vamsi-choday
                    </p>
                  </>
                )}
                <p className="font-body text-xs text-muted-foreground mt-4">
                  Please include your name (<strong>{form.name}</strong>) in the payment memo.
                </p>
              </div>
            </div>

            <button
              onClick={handleConfirmPayment}
              disabled={loading}
              className="btn-primary w-full text-center disabled:opacity-50"
            >
              {loading ? "Processing..." : "Confirm you have sent payment"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Checkout;
