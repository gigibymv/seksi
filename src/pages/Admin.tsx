import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { format } from "date-fns";
import { Loader2, Download, Lock } from "lucide-react";

interface OrderItem {
  id: string;
  product_name: string;
  product_category: string;
  quantity: number;
  unit_price: number;
}

interface Order {
  id: string;
  customer_name: string;
  customer_email: string;
  total_amount: number;
  payment_method: string;
  status: string;
  created_at: string;
  order_items: OrderItem[];
}

const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || "seksi2027";

const Admin = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // Check if already authenticated via sessionStorage
  useEffect(() => {
    if (sessionStorage.getItem("admin_auth") === "true") {
      setAuthenticated(true);
    }
  }, []);

  useEffect(() => {
    if (authenticated) {
      fetchOrders();
    }
  }, [authenticated]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setAuthenticated(true);
      sessionStorage.setItem("admin_auth", "true");
      setError("");
    } else {
      setError("Wrong password");
      setPassword("");
    }
  };

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("orders")
        .select(`
          *,
          order_items (*)
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setOrders(data || []);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const exportCSV = () => {
    if (orders.length === 0) return;

    const rows: string[][] = [];

    // Header row
    rows.push([
      "Order Date",
      "Customer Name",
      "Customer Email",
      "Product",
      "Category",
      "Quantity",
      "Unit Price",
      "Order Total",
      "Payment Method",
      "Status",
    ]);

    // Data rows — one row per order item
    orders.forEach((order) => {
      if (order.order_items && order.order_items.length > 0) {
        order.order_items.forEach((item) => {
          rows.push([
            format(new Date(order.created_at), "yyyy-MM-dd HH:mm"),
            order.customer_name,
            order.customer_email,
            item.product_name,
            item.product_category,
            String(item.quantity),
            `$${item.unit_price.toFixed(2)}`,
            `$${order.total_amount.toFixed(2)}`,
            order.payment_method,
            order.status,
          ]);
        });
      } else {
        rows.push([
          format(new Date(order.created_at), "yyyy-MM-dd HH:mm"),
          order.customer_name,
          order.customer_email,
          "",
          "",
          "",
          "",
          `$${order.total_amount.toFixed(2)}`,
          order.payment_method,
          order.status,
        ]);
      }
    });

    // Build CSV string
    const csvContent = rows
      .map((row) =>
        row.map((cell) => `"${cell.replace(/"/g, '""')}"`).join(",")
      )
      .join("\n");

    // Download
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `seksi-orders-${format(new Date(), "yyyy-MM-dd")}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // ── Login gate ──────────────────────────────────
  if (!authenticated) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center min-h-[80vh] px-6">
          <form
            onSubmit={handleLogin}
            className="w-full max-w-sm space-y-6"
          >
            <div className="text-center space-y-2">
              <div className="w-12 h-12 bg-foreground/5 rounded-full flex items-center justify-center mx-auto">
                <Lock className="w-5 h-5 text-muted-foreground" />
              </div>
              <h1 className="font-display text-2xl font-medium text-foreground">
                Admin Access
              </h1>
              <p className="font-body text-sm text-muted-foreground">
                Enter the password to view orders
              </p>
            </div>

            <div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full border border-border bg-card px-4 py-3.5 font-body text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-foreground text-center tracking-widest"
                autoFocus
              />
              {error && (
                <p className="font-body text-xs text-destructive mt-2 text-center">
                  {error}
                </p>
              )}
            </div>

            <button type="submit" className="btn-primary w-full text-center">
              Enter
            </button>
          </form>
        </div>
      </div>
    );
  }

  // ── Authenticated dashboard ─────────────────────
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-6 py-20 mt-10">
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="font-display text-3xl font-medium text-foreground">Order Dashboard</h1>
            <p className="font-body text-xs text-muted-foreground mt-1">
              {orders.length} order{orders.length !== 1 ? "s" : ""} total
            </p>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={exportCSV}
              disabled={orders.length === 0}
              className="inline-flex items-center gap-2 font-body text-xs uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <Download className="w-4 h-4" />
              Export CSV
            </button>
            <button
              onClick={fetchOrders}
              className="font-body text-xs uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors"
            >
              Refresh
            </button>
          </div>
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          <div className="border border-border p-5">
            <p className="font-body text-[10px] uppercase tracking-widest text-muted-foreground mb-1">Orders</p>
            <p className="font-display text-2xl font-semibold text-foreground">{orders.length}</p>
          </div>
          <div className="border border-border p-5">
            <p className="font-body text-[10px] uppercase tracking-widest text-muted-foreground mb-1">Revenue</p>
            <p className="font-display text-2xl font-semibold text-foreground">
              ${orders.reduce((s, o) => s + o.total_amount, 0).toFixed(2)}
            </p>
          </div>
          <div className="border border-border p-5">
            <p className="font-body text-[10px] uppercase tracking-widest text-muted-foreground mb-1">Items Sold</p>
            <p className="font-display text-2xl font-semibold text-foreground">
              {orders.reduce((s, o) => s + (o.order_items?.reduce((si, i) => si + i.quantity, 0) || 0), 0)}
            </p>
          </div>
          <div className="border border-border p-5">
            <p className="font-body text-[10px] uppercase tracking-widest text-muted-foreground mb-1">Avg Order</p>
            <p className="font-display text-2xl font-semibold text-foreground">
              ${orders.length > 0 ? (orders.reduce((s, o) => s + o.total_amount, 0) / orders.length).toFixed(2) : "0.00"}
            </p>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <div className="rounded-none border border-border overflow-hidden">
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow>
                  <TableHead className="font-body text-[10px] uppercase tracking-widest py-4">Date</TableHead>
                  <TableHead className="font-body text-[10px] uppercase tracking-widest">Customer</TableHead>
                  <TableHead className="font-body text-[10px] uppercase tracking-widest">Items</TableHead>
                  <TableHead className="font-body text-[10px] uppercase tracking-widest text-right">Total</TableHead>
                  <TableHead className="font-body text-[10px] uppercase tracking-widest">Payment</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((order) => (
                  <TableRow key={order.id} className="hover:bg-muted/30 transition-colors">
                    <TableCell className="font-body text-xs text-muted-foreground">
                      {format(new Date(order.created_at), "MMM d, HH:mm")}
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <p className="font-body text-sm text-foreground font-medium">{order.customer_name}</p>
                        <p className="font-body text-[11px] text-muted-foreground">{order.customer_email}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1 py-2">
                        {order.order_items?.map((item) => (
                          <p key={item.id} className="font-body text-[11px] text-muted-foreground leading-relaxed">
                            {item.quantity}× {item.product_name} — ${item.unit_price}
                          </p>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell className="font-body text-sm text-foreground font-semibold text-right">
                      ${order.total_amount.toFixed(2)}
                    </TableCell>
                    <TableCell className="font-body text-[10px] uppercase tracking-widest text-muted-foreground">
                      {order.payment_method}
                    </TableCell>
                  </TableRow>
                ))}
                {orders.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-20 font-body text-sm text-muted-foreground">
                      No orders found yet.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;