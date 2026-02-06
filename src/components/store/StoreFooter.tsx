import { Link } from "react-router-dom";

const StoreFooter = () => (
  <footer className="border-t border-border mt-20 bg-card">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <h3 className="font-display text-xl font-bold text-foreground mb-4">OnDaro</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Your destination for quality products at great prices. Shop with confidence.
          </p>
        </div>
        <div>
          <h4 className="font-semibold text-foreground mb-3 text-sm uppercase tracking-wider">Shop</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link to="/products" className="hover:text-foreground transition-colors">All Products</Link></li>
            <li><Link to="/categories" className="hover:text-foreground transition-colors">Categories</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold text-foreground mb-3 text-sm uppercase tracking-wider">Account</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link to="/auth" className="hover:text-foreground transition-colors">Sign In</Link></li>
            <li><Link to="/orders" className="hover:text-foreground transition-colors">My Orders</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold text-foreground mb-3 text-sm uppercase tracking-wider">Support</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link to="/contact" className="hover:text-foreground transition-colors">Contact Us</Link></li>
            <li><Link to="/privacy-policy" className="hover:text-foreground transition-colors">Privacy Policy</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border mt-8 pt-8 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} OnDaro. All rights reserved.
      </div>
    </div>
  </footer>
);

export default StoreFooter;
