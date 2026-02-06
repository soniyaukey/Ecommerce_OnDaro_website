import { useParams, Link } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import { useOrderDetails } from "@/hooks/useOrders";

const statusColors: Record<string, string> = {
  pending: "bg-yellow-500/20 text-yellow-400",
  processing: "bg-blue-500/20 text-blue-400",
  shipped: "bg-purple-500/20 text-purple-400",
  delivered: "bg-green-500/20 text-green-400",
  cancelled: "bg-red-500/20 text-red-400",
};

const OrderDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading } = useOrderDetails(id || "");

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 animate-pulse space-y-4">
        <div className="h-6 bg-muted rounded w-48" />
        <div className="h-40 bg-muted rounded-xl" />
      </div>
    );
  }

  if (!data?.order) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold text-foreground mb-4">Order not found</h1>
        <Link to="/orders" className="text-primary hover:underline">← Back to orders</Link>
      </div>
    );
  }

  const { order, items } = data;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link to="/orders" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors">
        <ChevronLeft size={16} /> Back to orders
      </Link>

      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl font-bold text-foreground">
          Order #{order.id.slice(0, 8)}
        </h1>
        <span className={`px-3 py-1 text-xs font-medium rounded-full capitalize ${statusColors[order.status] || ""}`}>
          {order.status}
        </span>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <div className="bg-card border border-border rounded-xl p-5">
          <h3 className="text-sm font-semibold text-foreground mb-3 uppercase tracking-wider">Shipping</h3>
          <p className="text-sm text-muted-foreground">{order.shipping_address}</p>
          <p className="text-sm text-muted-foreground">{order.shipping_city}</p>
          <p className="text-sm text-muted-foreground">{order.shipping_phone}</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-5">
          <h3 className="text-sm font-semibold text-foreground mb-3 uppercase tracking-wider">Payment</h3>
          <p className="text-sm text-muted-foreground capitalize">Method: {order.payment_method}</p>
          <p className="text-sm text-muted-foreground capitalize">Status: {order.payment_status}</p>
          <p className="text-sm text-foreground font-bold mt-2">Total: ${order.total.toFixed(2)}</p>
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <h3 className="text-sm font-semibold text-foreground p-5 pb-0 uppercase tracking-wider">Items</h3>
        <div className="divide-y divide-border">
          {items.map((item) => (
            <div key={item.id} className="flex items-center gap-4 p-5">
              <div className="w-14 h-14 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                {item.product_image ? (
                  <img src={item.product_image} alt={item.product_name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs">—</div>
                )}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">{item.product_name}</p>
                <p className="text-xs text-muted-foreground">Qty: {item.quantity} × ${item.price.toFixed(2)}</p>
              </div>
              <span className="text-sm font-semibold text-foreground">
                ${(item.price * item.quantity).toFixed(2)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OrderDetailPage;
