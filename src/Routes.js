import { NavLink, Route, Routes } from "react-router-dom";
import { Products } from "./products/Products";
import { Wishlist } from "./wishlist/Wishlist";
import { Cart } from "./cart/Cart";
import { Landing } from "./Landing";

export function Router() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/products" element={<Products />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/wishlist" element={<Wishlist />} />
    </Routes>
  );
}
