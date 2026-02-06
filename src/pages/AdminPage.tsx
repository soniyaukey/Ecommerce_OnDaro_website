import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Plus, Pencil, Trash2, Package, ShoppingBag, LayoutGrid } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useProducts, useCategories } from "@/hooks/useProducts";
import { useAdminOrders, useUpdateOrderStatus } from "@/hooks/useOrders";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

type Tab = "products" | "orders" | "categories";

const AdminPage = () => {
  const [activeTab, setActiveTab] = useState<Tab>("products");
  const { data: productsData, isLoading: loadingProducts } = useProducts({ limit: 50 });
  const { data: categories } = useCategories();
  const { data: orders, isLoading: loadingOrders } = useAdminOrders();
  const updateStatus = useUpdateOrderStatus();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Product form state
  const [productDialog, setProductDialog] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [productForm, setProductForm] = useState({
    name: "",
    slug: "",
    description: "",
    price: "",
    compare_at_price: "",
    category_id: "",
    stock: "",
    is_featured: false,
    image_url: "",
  });

  // Category form
  const [categoryDialog, setCategoryDialog] = useState(false);
  const [categoryForm, setCategoryForm] = useState({ name: "", slug: "", description: "" });

  const resetProductForm = () => {
    setProductForm({
      name: "", slug: "", description: "", price: "", compare_at_price: "",
      category_id: "", stock: "", is_featured: false, image_url: "",
    });
    setEditingProduct(null);
  };

  const openEditProduct = (product: any) => {
    setProductForm({
      name: product.name,
      slug: product.slug,
      description: product.description || "",
      price: String(product.price),
      compare_at_price: product.compare_at_price ? String(product.compare_at_price) : "",
      category_id: product.category_id || "",
      stock: String(product.stock),
      is_featured: product.is_featured,
      image_url: product.image_url || "",
    });
    setEditingProduct(product);
    setProductDialog(true);
  };

  const handleSaveProduct = async () => {
    const slug = productForm.slug || productForm.name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
    const payload = {
      name: productForm.name,
      slug,
      description: productForm.description || null,
      price: parseFloat(productForm.price) || 0,
      compare_at_price: productForm.compare_at_price ? parseFloat(productForm.compare_at_price) : null,
      category_id: productForm.category_id || null,
      stock: parseInt(productForm.stock) || 0,
      is_featured: productForm.is_featured,
      image_url: productForm.image_url || null,
    };

    if (editingProduct) {
      const { error } = await supabase.from("products").update(payload).eq("id", editingProduct.id);
      if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return; }
      toast({ title: "Product updated" });
    } else {
      const { error } = await supabase.from("products").insert(payload);
      if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return; }
      toast({ title: "Product created" });
    }
    queryClient.invalidateQueries({ queryKey: ["products"] });
    setProductDialog(false);
    resetProductForm();
  };

  const handleDeleteProduct = async (id: string) => {
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return; }
    queryClient.invalidateQueries({ queryKey: ["products"] });
    toast({ title: "Product deleted" });
  };

  const handleSaveCategory = async () => {
    const slug = categoryForm.slug || categoryForm.name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
    const { error } = await supabase.from("categories").insert({
      name: categoryForm.name,
      slug,
      description: categoryForm.description || null,
    });
    if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return; }
    queryClient.invalidateQueries({ queryKey: ["categories"] });
    setCategoryDialog(false);
    setCategoryForm({ name: "", slug: "", description: "" });
    toast({ title: "Category created" });
  };

  const tabs: { key: Tab; label: string; icon: any }[] = [
    { key: "products", label: "Products", icon: ShoppingBag },
    { key: "orders", label: "Orders", icon: Package },
    { key: "categories", label: "Categories", icon: LayoutGrid },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="font-display text-3xl font-bold text-foreground mb-6">Admin Dashboard</h1>

      {/* Tabs */}
      <div className="flex gap-2 mb-8 border-b border-border pb-2 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-t-lg transition-colors whitespace-nowrap ${
              activeTab === tab.key
                ? "bg-card border border-border border-b-transparent text-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <tab.icon size={16} /> {tab.label}
          </button>
        ))}
      </div>

      {/* Products Tab */}
      {activeTab === "products" && (
        <div>
          <div className="flex justify-between items-center mb-6">
            <p className="text-sm text-muted-foreground">{productsData?.total || 0} products</p>
            <Dialog open={productDialog} onOpenChange={(open) => { setProductDialog(open); if (!open) resetProductForm(); }}>
              <DialogTrigger asChild>
                <button className="flex items-center gap-2 px-4 py-2 bg-accent text-accent-foreground text-sm font-medium rounded-lg hover:bg-accent/90 transition-colors">
                  <Plus size={16} /> Add Product
                </button>
              </DialogTrigger>
              <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>{editingProduct ? "Edit Product" : "Add Product"}</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 mt-4">
                  <input
                    value={productForm.name}
                    onChange={(e) => setProductForm((p) => ({ ...p, name: e.target.value }))}
                    placeholder="Product name"
                    className="w-full h-10 px-4 bg-card border border-border rounded-lg text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                  <input
                    value={productForm.slug}
                    onChange={(e) => setProductForm((p) => ({ ...p, slug: e.target.value }))}
                    placeholder="Slug (auto-generated if empty)"
                    className="w-full h-10 px-4 bg-card border border-border rounded-lg text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                  <textarea
                    value={productForm.description}
                    onChange={(e) => setProductForm((p) => ({ ...p, description: e.target.value }))}
                    placeholder="Description"
                    rows={3}
                    className="w-full px-4 py-3 bg-card border border-border rounded-lg text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="number"
                      value={productForm.price}
                      onChange={(e) => setProductForm((p) => ({ ...p, price: e.target.value }))}
                      placeholder="Price"
                      step="0.01"
                      className="w-full h-10 px-4 bg-card border border-border rounded-lg text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                    <input
                      type="number"
                      value={productForm.compare_at_price}
                      onChange={(e) => setProductForm((p) => ({ ...p, compare_at_price: e.target.value }))}
                      placeholder="Compare price"
                      step="0.01"
                      className="w-full h-10 px-4 bg-card border border-border rounded-lg text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <select
                      value={productForm.category_id}
                      onChange={(e) => setProductForm((p) => ({ ...p, category_id: e.target.value }))}
                      className="w-full h-10 px-4 bg-card border border-border rounded-lg text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                    >
                      <option value="">No category</option>
                      {categories?.map((c) => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                    <input
                      type="number"
                      value={productForm.stock}
                      onChange={(e) => setProductForm((p) => ({ ...p, stock: e.target.value }))}
                      placeholder="Stock"
                      className="w-full h-10 px-4 bg-card border border-border rounded-lg text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                  </div>
                  <input
                    value={productForm.image_url}
                    onChange={(e) => setProductForm((p) => ({ ...p, image_url: e.target.value }))}
                    placeholder="Image URL"
                    className="w-full h-10 px-4 bg-card border border-border rounded-lg text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={productForm.is_featured}
                      onChange={(e) => setProductForm((p) => ({ ...p, is_featured: e.target.checked }))}
                      className="accent-accent"
                    />
                    <span className="text-sm text-foreground">Featured product</span>
                  </label>
                  <button
                    onClick={handleSaveProduct}
                    className="w-full h-10 bg-accent text-accent-foreground font-medium rounded-lg hover:bg-accent/90 transition-colors text-sm"
                  >
                    {editingProduct ? "Update Product" : "Create Product"}
                  </button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {loadingProducts ? (
            <div className="space-y-3">{[1, 2, 3].map((i) => <div key={i} className="h-16 bg-muted rounded-lg animate-pulse" />)}</div>
          ) : (
            <div className="space-y-2">
              {productsData?.products.map((p) => (
                <div key={p.id} className="flex items-center justify-between p-4 bg-card border border-border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-md overflow-hidden bg-muted flex-shrink-0">
                      {p.image_url ? (
                        <img src={p.image_url} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs">—</div>
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">{p.name}</p>
                      <p className="text-xs text-muted-foreground">${p.price} · {p.stock} in stock</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => openEditProduct(p)} className="p-2 text-muted-foreground hover:text-foreground transition-colors">
                      <Pencil size={14} />
                    </button>
                    <button onClick={() => handleDeleteProduct(p.id)} className="p-2 text-muted-foreground hover:text-destructive transition-colors">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Orders Tab */}
      {activeTab === "orders" && (
        <div>
          {loadingOrders ? (
            <div className="space-y-3">{[1, 2, 3].map((i) => <div key={i} className="h-16 bg-muted rounded-lg animate-pulse" />)}</div>
          ) : orders?.length ? (
            <div className="space-y-2">
              {orders.map((order) => (
                <div key={order.id} className="flex items-center justify-between p-4 bg-card border border-border rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-foreground">#{order.id.slice(0, 8)}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(order.created_at).toLocaleDateString()} · ${order.total.toFixed(2)}
                    </p>
                  </div>
                  <select
                    value={order.status}
                    onChange={(e) => updateStatus.mutate({ orderId: order.id, status: e.target.value })}
                    className="h-9 px-3 bg-card border border-border rounded-lg text-foreground text-xs focus:outline-none focus:ring-2 focus:ring-primary/50"
                  >
                    {["pending", "processing", "shipped", "delivered", "cancelled"].map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center py-12 text-muted-foreground">No orders yet.</p>
          )}
        </div>
      )}

      {/* Categories Tab */}
      {activeTab === "categories" && (
        <div>
          <div className="flex justify-between items-center mb-6">
            <p className="text-sm text-muted-foreground">{categories?.length || 0} categories</p>
            <Dialog open={categoryDialog} onOpenChange={setCategoryDialog}>
              <DialogTrigger asChild>
                <button className="flex items-center gap-2 px-4 py-2 bg-accent text-accent-foreground text-sm font-medium rounded-lg hover:bg-accent/90 transition-colors">
                  <Plus size={16} /> Add Category
                </button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Category</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 mt-4">
                  <input
                    value={categoryForm.name}
                    onChange={(e) => setCategoryForm((p) => ({ ...p, name: e.target.value }))}
                    placeholder="Category name"
                    className="w-full h-10 px-4 bg-card border border-border rounded-lg text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                  <input
                    value={categoryForm.slug}
                    onChange={(e) => setCategoryForm((p) => ({ ...p, slug: e.target.value }))}
                    placeholder="Slug (auto-generated)"
                    className="w-full h-10 px-4 bg-card border border-border rounded-lg text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                  <textarea
                    value={categoryForm.description}
                    onChange={(e) => setCategoryForm((p) => ({ ...p, description: e.target.value }))}
                    placeholder="Description"
                    rows={2}
                    className="w-full px-4 py-3 bg-card border border-border rounded-lg text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                  />
                  <button
                    onClick={handleSaveCategory}
                    className="w-full h-10 bg-accent text-accent-foreground font-medium rounded-lg hover:bg-accent/90 transition-colors text-sm"
                  >
                    Create Category
                  </button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
          <div className="space-y-2">
            {categories?.map((cat) => (
              <div key={cat.id} className="flex items-center justify-between p-4 bg-card border border-border rounded-lg">
                <div>
                  <p className="text-sm font-medium text-foreground">{cat.name}</p>
                  <p className="text-xs text-muted-foreground">{cat.description || "No description"}</p>
                </div>
                <span className="text-xs text-muted-foreground font-mono">{cat.slug}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPage;
