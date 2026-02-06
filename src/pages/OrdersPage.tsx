import { Link } from "react-router-dom";
import { Package, ChevronRight } from "lucide-react";
import { useOrders } from "@/hooks/useOrders";

const statusColors: Record<string, string> = {
  pending: "bg-yellow-500/20 text-yellow-400",
  processing: "bg-blue-500/20 text-blue-400",
  shipped: "bg-purple-500/20 text-purple-400",
  delivered: "bg-green-500/20 text-green-400",
  cancelled: "bg-red-500/20 text-red-400",
};

const OrdersPage = () => {
  const { data: orders, isLoading } = useOrders();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="font-display text-3xl font-bold text-foreground mb-8">My Orders</h1>

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 bg-muted rounded-xl animate-pulse" />
          ))}
        </div>
      ) : orders?.length ? (
        <div className="space-y-4">
          {orders.map((order) => (
            <Link
              key={order.id}
              to={`/orders/${order.id}`}
              className="flex items-center justify-between p-5 bg-card border border-border rounded-xl hover:border-primary/30 transition-all group"
            >
              <div className="flex items-center gap-4">
                <div className="p-2.5 bg-muted rounded-lg">
                  <Package size={20} className="text-muted-foreground" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">
                    Order #{order.id.slice(0, 8)}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(order.created_at).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className={`px-3 py-1 text-xs font-medium rounded-full capitalize ${statusColors[order.status] || ""}`}>
                  {order.status}
                </span>
                <span className="text-sm font-semibold text-foreground">${order.total.toFixed(2)}</span>
                <ChevronRight size={16} className="text-muted-foreground group-hover:text-foreground transition-colors" />
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 text-muted-foreground">
          <Package size={48} className="mx-auto mb-4 opacity-30" />
          <p className="text-lg">No orders yet</p>
          <Link to="/products" className="text-sm text-primary hover:underline mt-2 inline-block">
            Start shopping →
          </Link>
        </div>
      )}
    </div>
  );
};

export default OrdersPage;
