import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useCart } from "@/store/CartContext";
import { useAuth } from "@/store/AuthContext";
import { useCreateOrder } from "@/hooks/useOrders";
import { useToast } from "@/hooks/use-toast";
import type { CheckoutFormData } from "@/types";

const CheckoutPage = () => {
  const { items, totalPrice } = useCart();
  const { user } = useAuth();
  const createOrder = useCreateOrder();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [form, setForm] = useState<CheckoutFormData>({
    full_name: "",
    phone: "",
    address: "",
    city: "",
    notes: "",
    payment_method: "cod",
  });

  if (!user) {
    navigate("/auth", { state: { from: { pathname: "/checkout" } } });
    return null;
  }

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold text-foreground mb-4">Your cart is empty</h1>
        <Link to="/products" className="text-primary hover:underline">← Continue shopping</Link>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const order = await createOrder.mutateAsync(form);
      toast({ title: "Order placed!", description: `Order #${order.id.slice(0, 8)} has been created.` });
      navigate("/orders");
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
  };

  const update = (field: keyof CheckoutFormData, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="font-display text-3xl font-bold text-foreground mb-8">Checkout</h1>

      <form onSubmit={handleSubmit} className="grid md:grid-cols-5 gap-8">
        {/* Form */}
        <div className="md:col-span-3 space-y-4">
          <h2 className="text-lg font-semibold text-foreground mb-2">Shipping Details</h2>
          {[
            { id: "full_name", label: "Full Name", type: "text", placeholder: "John Doe" },
            { id: "phone", label: "Phone", type: "tel", placeholder: "+1 234 567 890" },
            { id: "address", label: "Address", type: "text", placeholder: "123 Main St" },
            { id: "city", label: "City", type: "text", placeholder: "New York" },
          ].map((field) => (
            <div key={field.id}>
              <label htmlFor={field.id} className="block text-sm font-medium text-foreground mb-1.5">
                {field.label}
              </label>
              <input
                id={field.id}
                type={field.type}
                value={form[field.id as keyof CheckoutFormData]}
                onChange={(e) => update(field.id as keyof CheckoutFormData, e.target.value)}
                required
                placeholder={field.placeholder}
                className="w-full h-11 px-4 bg-card border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
          ))}
          <div>
            <label htmlFor="notes" className="block text-sm font-medium text-foreground mb-1.5">
              Notes (optional)
            </label>
            <textarea
              id="notes"
              value={form.notes}
              onChange={(e) => update("notes", e.target.value)}
              rows={3}
              className="w-full px-4 py-3 bg-card border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
              placeholder="Any delivery instructions..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Payment Method</label>
            <div className="flex gap-4">
              {[
                { value: "cod", label: "Cash on Delivery" },
                { value: "card", label: "Card (Mock)" },
              ].map((opt) => (
                <label key={opt.value} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="payment"
                    value={opt.value}
                    checked={form.payment_method === opt.value}
                    onChange={(e) => update("payment_method", e.target.value)}
                    className="accent-accent"
                  />
                  <span className="text-sm text-foreground">{opt.label}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Summary */}
        <div className="md:col-span-2">
          <div className="bg-card border border-border rounded-xl p-6 sticky top-24">
            <h2 className="text-lg font-semibold text-foreground mb-4">Order Summary</h2>
            <ul className="space-y-3 mb-4">
              {items.map((item) => (
                <li key={item.id} className="flex justify-between text-sm">
                  <span className="text-muted-foreground truncate mr-2">
                    {item.name} × {item.quantity}
                  </span>
                  <span className="text-foreground font-medium">${(item.price * item.quantity).toFixed(2)}</span>
                </li>
              ))}
            </ul>
            <div className="border-t border-border pt-4 flex justify-between text-lg font-bold">
              <span>Total</span>
              <span>${totalPrice.toFixed(2)}</span>
            </div>
            <button
              type="submit"
              disabled={createOrder.isPending}
              className="w-full mt-6 py-3 bg-accent text-accent-foreground font-semibold rounded-lg hover:bg-accent/90 transition-colors disabled:opacity-50"
            >
              {createOrder.isPending ? "Processing..." : "Place Order"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CheckoutPage;
