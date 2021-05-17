import React, { useEffect, useState } from "react";
import "./styles.css";
import { useCart } from "./cart/CartContext";
import { Router } from "./Routes";
import { NavBar } from "./Components/NavBar";
import axios from "axios";

export default function App() {
  const { cartState, cartDispatch } = useCart();

  useEffect(() => {
    async function getCartProducts() {
      try {
        const res = await axios.get(
          "https://theccbackend.vikasvk1997.repl.co/cart"
        );
        res.data.cartProducts.map((item) => {
          return cartDispatch({
            type: "ADDTOCART",
            payload: {
              _id: item.productId._id,
              name: item.productId.name,
              image: item.productId.image,
              price: item.productId.price,
              productName: item.productId.productName,
              inStock: item.productId.inStock,
              fastDelivery: item.productId.fastDelivery,
              ratings: item.productId.ratings,
              qty: item.quantity
            }
          });
        });
      } catch (err) {
        console.log(err);
      }
    }

    async function getWishlistProducts() {
      try {
        const res = await axios.get(
          "https://theccbackend.vikasvk1997.repl.co/wishlist"
        );
        res.data.wishlistProducts.map((item) => {
          return cartDispatch({
            type: "ADD_TO_WISHLIST",
            payload: {
              _id: item._id._id,
              name: item._id.name,
              image: item._id.image,
              price: item._id.price,
              productName: item._id.productName,
              inStock: item._id.inStock,
              fastDelivery: item._id.fastDelivery,
              ratings: item._id.ratings
            }
          });
        });
      } catch (err) {
        console.log(err);
      }
    }

    getCartProducts();
    getWishlistProducts();
  }, []);

  return (
    <>
      <NavBar />
      <Router />
    </>
  );
}
