import React, { useEffect, useState } from "react";
import "./styles.css";
import { NavLink } from "react-router-dom";
import { useCart } from "./cart/CartContext";
import { Router } from "./Routes";
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
      <nav className="nav-bar">
        <img
          src="images\cart-icon-v2.png"
          className="nav-bar-logo"
          alt="logo"
        />
        <h1>
          <NavLink to="/products" className="nav-header">
            the Camera Company
          </NavLink>
        </h1>
        <ul className="nav-list">
          <li>
            <NavLink to="/cart">
              <div className="badge-icon">
                <i className="material-icons col">shopping_cart</i>
                {cartState.cart.length === 0 ? (
                  ""
                ) : (
                  <span>{cartState.cart.length}</span>
                )}
              </div>
            </NavLink>
          </li>
          <li>
            <NavLink to="/wishlist">
              <div className="badge-icon">
                <i className="material-icons col">favorite</i>
                {cartState.wishlist.length === 0 ? (
                  ""
                ) : (
                  <span>{cartState.wishlist.length}</span>
                )}
              </div>
            </NavLink>
          </li>
        </ul>
      </nav>
      <Router />
    </>
  );
}
