import { type ReactNode } from "react";
import StoreHeader from "./StoreHeader";
import StoreFooter from "./StoreFooter";
import CartDrawer from "./CartDrawer";

const StoreLayout = ({ children }: { children: ReactNode }) => (
  <div className="min-h-screen flex flex-col bg-background">
    <StoreHeader />
    <CartDrawer />
    <main className="flex-1">{children}</main>
    <StoreFooter />
  </div>
);

export default StoreLayout;
