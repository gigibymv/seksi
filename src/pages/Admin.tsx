import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { format } from "date-fns";
import { Loader2, Download, Lock, CheckCircle2, Circle, PackageCheck, Trash2 } from "lucide-react";
import { toast } from "sonner";

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

type FilterStatus = "all" | "pending" | "processed" | "archived";

const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || "seksi2027";

const Admin = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [filterStatus, setFilterStatus] = useState<FilterStatus>("all");
  const [updatingIds, setUpdatingIds] = useState<Set<string>>(new Set());

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

  // ── Status toggle ──────────────────────────────
  const isProcessed = (order: Order) => order.status === "processed";
  const isArchived = (order: Order) => order.status === "archived";

  const toggleStatus = async (orderId: string, currentStatus: string) => {
    // If it's archived, restore it to pending first, otherwise toggle between paid/processed
    const newStatus = currentStatus === "archived" ? "pending" : (currentStatus === "processed" ? "paid" : "processed");
    setUpdatingIds((prev) => new Set(prev).add(orderId));
    try {
      const { error } = await supabase
        .from("orders")
        .update({ status: newStatus })
        .eq("id", orderId);
      if (error) throw error;
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
      );
      if (currentStatus === "archived") toast.success("Order restored");
    } catch (err) {
      console.error("Error updating status:", err);
    } finally {
      setUpdatingIds((prev) => {
        const next = new Set(prev);
        next.delete(orderId);
        return next;
      });
    }
  };

  // ── Data Management ─────────────────────────────
  const markSelectedAsProcessed = async () => {
    const ids = Array.from(selected);
    if (ids.length === 0) return;
    setUpdatingIds(new Set(ids));
    try {
      const { error } = await supabase
        .from("orders")
        .update({ status: "processed" })
        .in("id", ids);
      if (error) throw error;
      setOrders((prev) =>
        prev.map((o) => (ids.includes(o.id) ? { ...o, status: "processed" } : o))
      );
      setSelected(new Set());
      toast.success(`${ids.length} orders updated`);
    } catch (err) {
      console.error("Error bulk updating:", err);
      toast.error("Update failed");
    } finally {
      setUpdatingIds(new Set());
    }
  };

  const archiveOrder = async (orderId: string) => {
    if (!window.confirm("Move this order to Archive?")) return;
    
    try {
      const { error } = await supabase
        .from("orders")
        .update({ status: "archived" })
        .eq("id", orderId);
      if (error) throw error;
      
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: "archived" } : o));
      toast.success("Order archived");
    } catch (err) {
      console.error("Error archiving order:", err);
      toast.error("Archiving failed");
    }
  };

  const clearArchivedOrders = async () => {
    if (!window.confirm("CRITICAL: This will PERMANENTLY DELETE all archived orders. Active orders will NOT be affected. Are you sure?")) return;
    
    try {
      setLoading(true);
      const { error } = await supabase
        .from("orders")
        .delete()
        .eq("status", "archived");
        
      if (error) throw error;
      
      setOrders(prev => prev.filter(o => o.status !== "archived"));
      setSelected(new Set());
      toast.success("Archive permanently cleared.");
    } catch (err) {
      console.error("Error clearing archive:", err);
      toast.error("Clear failed. Please check Supabase permissions.");
    } finally {
      setLoading(false);
    }
  };

  // ── Filter & Logic ─────────────────────────────
  const filteredOrders = orders.filter((o) => {
    if (filterStatus === "pending") return !isProcessed(o) && !isArchived(o);
    if (filterStatus === "processed") return isProcessed(o) && !isArchived(o);
    if (filterStatus === "archived") return isArchived(o);
    // "all" shows everything EXCEPT archived
    return !isArchived(o);
  });

  const activeCount = orders.filter((o) => !isArchived(o)).length;
  const pendingCount = orders.filter((o) => !isProcessed(o) && !isArchived(o)).length;
  const processedCount = orders.filter((o) => isProcessed(o) && !isArchived(o)).length;
  const archivedCount = orders.filter((o) => isArchived(o)).length;

  // ── Selection helpers ───────────────────────────
  const toggleSelect = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (selected.size === filteredOrders.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(filteredOrders.map((o) => o.id)));
    }
  };

  // ── CSV Export ─────────────────────────────────
  const exportCSV = () => {
    const ordersToExport =
      selected.size > 0
        ? filteredOrders.filter((o) => selected.has(o.id))
        : filteredOrders;

    if (ordersToExport.length === 0) return;

    const rows: string[][] = [];

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

    ordersToExport.forEach((order) => {
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

    const csvContent = rows
      .map((row) =>
        row.map((cell) => `"${cell.replace(/"/g, '""')}"`).join(",")
      )
      .join("\n");

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
          <form onSubmit={handleLogin} className="w-full max-w-sm space-y-6">
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
        {/* Title bar */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4 mb-8">
          <div>
            <h1 className="font-display text-3xl font-medium text-foreground">
              Order Dashboard
            </h1>
            <p className="font-body text-xs text-muted-foreground mt-1">
              {activeCount} active order{activeCount !== 1 ? "s" : ""} ·{" "}
              {pendingCount} pending · {processedCount} processed · {archivedCount} archived
            </p>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            {filterStatus === "archived" && archivedCount > 0 && (
              <button
                onClick={clearArchivedOrders}
                className="inline-flex items-center gap-2 px-4 py-2 bg-destructive/10 text-destructive font-body text-[10px] uppercase tracking-widest hover:bg-destructive/20 transition-colors border border-destructive/20"
              >
                <Trash2 className="w-3 h-3" />
                Permanently Clear Archive
              </button>
            )}
            {selected.size > 0 && (
              <button
                onClick={markSelectedAsProcessed}
                className="inline-flex items-center gap-2 px-4 py-2 bg-secondary text-secondary-foreground font-body text-[11px] uppercase tracking-widest hover:opacity-90 transition-opacity"
              >
                <PackageCheck className="w-3.5 h-3.5" />
                Mark {selected.size} as Processed
              </button>
            )}
            <button
              onClick={exportCSV}
              disabled={filteredOrders.length === 0}
              className="inline-flex items-center gap-2 font-body text-xs uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <Download className="w-4 h-4" />
              {selected.size > 0
                ? `Export ${selected.size} Selected`
                : "Export All"}
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
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="border border-border p-5">
            <p className="font-body text-[10px] uppercase tracking-widest text-muted-foreground mb-1">
              Orders
            </p>
            <p className="font-body text-2xl font-semibold text-foreground">
              {activeCount}
            </p>
          </div>
          <div className="border border-border p-5">
            <p className="font-body text-[10px] uppercase tracking-widest text-muted-foreground mb-1">
              Revenue
            </p>
            <p className="font-body text-2xl font-semibold text-foreground">
              <span className="font-sans">$</span>{orders.filter(o => !isArchived(o)).reduce((s, o) => s + o.total_amount, 0).toFixed(2)}
            </p>
          </div>
          <div className="border border-border p-5">
            <p className="font-body text-[10px] uppercase tracking-widest text-muted-foreground mb-1">
              Items Sold
            </p>
            <p className="font-body text-2xl font-semibold text-foreground">
              {orders.filter(o => !isArchived(o)).reduce(
                (s, o) =>
                  s + (o.order_items?.reduce((si, i) => si + i.quantity, 0) || 0),
                0
              )}
            </p>
          </div>
          <div className="border border-border p-5">
            <p className="font-body text-[10px] uppercase tracking-widest text-muted-foreground mb-1">
              Pending
            </p>
            <p className="font-body text-2xl font-semibold text-foreground">
              {pendingCount}
            </p>
          </div>
        </div>

        {/* Filter tabs */}
        <div className="flex items-center gap-2 mb-6 flex-wrap">
          {(["all", "pending", "processed", "archived"] as FilterStatus[]).map((f) => (
            <button
              key={f}
              onClick={() => {
                setFilterStatus(f);
                setSelected(new Set());
              }}
              className={`px-3 py-2 text-[10px] font-body font-medium uppercase tracking-widest transition-colors ${
                filterStatus === f
                  ? "bg-foreground text-background"
                  : "border border-border text-muted-foreground hover:border-foreground hover:text-foreground"
              }`}
            >
              {f === "all"
                ? `Active (${activeCount})`
                : f === "pending"
                ? `Pending (${pendingCount})`
                : f === "processed"
                ? `Processed (${processedCount})`
                : `Archived (${archivedCount})`}
            </button>
          ))}
        </div>

        {/* Table */}
        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <div className="rounded-none border border-border overflow-hidden">
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow>
                  <TableHead className="w-10 py-4">
                    <button
                      onClick={toggleSelectAll}
                      className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {selected.size === filteredOrders.length &&
                      filteredOrders.length > 0 ? (
                        <CheckCircle2 className="w-4 h-4" />
                      ) : (
                        <Circle className="w-4 h-4" />
                      )}
                    </button>
                  </TableHead>
                  <TableHead className="font-body text-[10px] uppercase tracking-widest py-4">
                    Date
                  </TableHead>
                  <TableHead className="font-body text-[10px] uppercase tracking-widest">
                    Customer
                  </TableHead>
                  <TableHead className="font-body text-[10px] uppercase tracking-widest">
                    Items
                  </TableHead>
                  <TableHead className="font-body text-[10px] uppercase tracking-widest text-right">
                    Total
                  </TableHead>
                  <TableHead className="font-body text-[10px] uppercase tracking-widest">
                    Payment
                  </TableHead>
                  <TableHead className="font-body text-[10px] uppercase tracking-widest text-center">
                    Status
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.map((order) => {
                  const processed = isProcessed(order);
                  const isUpdating = updatingIds.has(order.id);
                  return (
                    <TableRow
                      key={order.id}
                      className={`transition-colors ${
                        processed
                          ? "bg-muted/20 opacity-60"
                          : "hover:bg-muted/30"
                      } ${selected.has(order.id) ? "bg-primary/5" : ""}`}
                    >
                      {/* Checkbox */}
                      <TableCell>
                        <button
                          onClick={() => toggleSelect(order.id)}
                          className="text-muted-foreground hover:text-foreground transition-colors"
                        >
                          {selected.has(order.id) ? (
                            <CheckCircle2 className="w-4 h-4 text-foreground" />
                          ) : (
                            <Circle className="w-4 h-4" />
                          )}
                        </button>
                      </TableCell>
                      <TableCell className="font-body text-xs text-muted-foreground">
                        {format(new Date(order.created_at), "MMM d, HH:mm")}
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <p className="font-body text-sm text-foreground font-medium">
                            {order.customer_name}
                          </p>
                          <p className="font-body text-[11px] text-muted-foreground">
                            {order.customer_email}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1 py-2">
                          {order.order_items?.filter(item => item.product_category !== "note").map((item) => (
                            <p
                              key={item.id}
                              className="font-body text-[11px] text-muted-foreground leading-relaxed"
                            >
                              {item.quantity}&times; {item.product_name} &mdash; <span className="font-sans">$</span>{item.unit_price}
                            </p>
                          ))}
                          {order.order_items?.filter(item => item.product_category === "note").map((item) => (
                            <p
                              key={item.id}
                              className="font-body text-[11px] text-foreground/60 italic leading-relaxed border-t border-border/40 mt-1 pt-1"
                            >
                              📝 {item.product_name.replace(/^Note:\s*/i, "")}
                            </p>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell className="font-body text-sm text-foreground font-semibold text-right">
                        <span className="font-sans">$</span>{order.total_amount.toFixed(2)}
                      </TableCell>
                      <TableCell className="font-body text-[10px] uppercase tracking-widest text-muted-foreground">
                        {order.payment_method}
                      </TableCell>
                      {/* Status toggle & Archive */}
                      <TableCell className="text-center">
                        <div className="flex items-center justify-center gap-3">
                          {!isArchived(order) ? (
                            <>
                              <button
                                onClick={() => toggleStatus(order.id, order.status)}
                                disabled={isUpdating}
                                className="transition-all hover:scale-110 disabled:opacity-50"
                                title={
                                  processed
                                    ? "Click to mark as pending"
                                    : "Click to mark as processed"
                                }
                              >
                                {isUpdating ? (
                                  <Loader2 className="w-5 h-5 animate-spin text-muted-foreground mx-auto" />
                                ) : processed ? (
                                  <CheckCircle2 className="w-5 h-5 text-secondary mx-auto" />
                                ) : (
                                  <Circle className="w-5 h-5 text-muted-foreground/40 mx-auto" />
                                )}
                              </button>
                              
                              <button
                                onClick={() => archiveOrder(order.id)}
                                className="text-muted-foreground hover:text-destructive transition-colors p-1"
                                title="Move to Archive"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </>
                          ) : (
                            <button
                              onClick={() => toggleStatus(order.id, "archived")}
                              disabled={isUpdating}
                              className="inline-flex items-center gap-2 px-3 py-1.5 border border-border text-muted-foreground hover:text-foreground hover:border-foreground transition-all font-body text-[10px] uppercase tracking-widest"
                              title="Restore to active"
                            >
                              {isUpdating ? (
                                <Loader2 className="w-3 h-3 animate-spin" />
                              ) : (
                                "Restore"
                              )}
                            </button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
                {filteredOrders.length === 0 && (
                  <TableRow>
                    <TableCell
                      colSpan={7}
                      className="text-center py-20 font-body text-sm text-muted-foreground"
                    >
                      {filterStatus === "all"
                        ? "No orders found yet."
                        : `No ${filterStatus} orders.`}
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