import React, { useEffect, useState } from "react";
import "../styles.css";
import { useCart } from "../cart/CartContext";
import { NavLink } from "react-router-dom";
import axios from "axios";
import { useToast } from "../toast/ToastProvider";

export function ProductCard({_id, name, image, price, productName, inStock, fastDelivery, ratings}) {

    const { cartState, cartDispatch } = useCart();
  
    const { toastDispatch } = useToast();

    const [btnLoader, setBtnLoader] = useState(false);

    async function addToCartClickHandler({ type, payload }) {
        setBtnLoader(true);
        try {
          const res = await axios.post(
            `${process.env.REACT_APP_BE_URL}cart`,
            {
              productId: payload._id,
              quantity: 1
            }
          );
          cartDispatch({ type, payload });
          toastDispatch({ type: "TO_CART" });
        } catch (err) {
          console.log(err);
        } finally {
          setBtnLoader(false);
        }
      }
    
      async function addToWishlistHandler({ type, payload }) {
        setBtnLoader(true);
        try {
          const res = await axios.post(
            `${process.env.REACT_APP_BE_URL}wishlist`,
            {
              id: payload._id
            }
          );
          cartDispatch({ type, payload });
          toastDispatch({ type: "TO_WISHLIST" });
        } catch (err) {
          console.log(err);
        } finally {
          setBtnLoader(false);
        }
      }
    
      async function removeFromWishlistHandler({ type, payload }) {
        setBtnLoader(true);
        try {
          const res = await axios.delete(
            `${process.env.REACT_APP_BE_URL}wishlist/${payload._id}`
          );
    
          cartDispatch({ type, payload });
          toastDispatch({ type: "REMOVE_WISHLIST" });
        } catch (err) {
          console.log(err);
        } finally {
          setBtnLoader(false);
        }
      }

    return (
        <div
              key={_id}
              className="product-card"
            >
              <img src={image} alt={productName} />
              <p className="card-title"> {name} </p>
              <p className="product-price">&#8377; {price.toLocaleString()}</p>
              {!inStock && (
                <div className="stock-font out-of-stock-font">
                  Out of Stock
                </div>
              )}
              <p className="product-rating">
                {ratings}
                <span className="material-icons">grade</span>
              </p>
              {cartState.wishlist.find((item) => _id === item._id) ? (
                <span
                  onClick={() => {
                    removeFromWishlistHandler({
                      type: "REMOVE_WISHLIST",
                      payload: { _id }
                    });
                  }}
                  className="material-icons wishlist-badge"
                  style={{ color: "#DA4167" }}
                >
                  favorite
                </span>
              ) : (
                <span
                  onClick={() => {
                    addToWishlistHandler({
                      type: "ADD_TO_WISHLIST",
                      payload: {
                        _id,
                        name,
                        image,
                        price,
                        productName,
                        inStock,
                        fastDelivery,
                        ratings
                      }
                    });
                  }}
                  className="material-icons wishlist-badge"
                >
                  favorite
                </span>
              )}

              {fastDelivery ? (
                <div className="stock-font"> Fast Delivery </div>
              ) : (
                <div className="stock-font"> 3 days minimum </div>
              )}
              <div>
                {cartState.cart.find((item) => _id === item._id) ? (
                  <button className="btn-primary btn-goto btn-cart-font">
                    <NavLink to="/cart">
                      GO TO CART
                      <span className="material-icons af">
                        arrow_forward_ios
                      </span>
                    </NavLink>
                  </button>
                ) : (
                  <button
                    className="btn-primary btn-cart-font"
                    disabled={inStock && !btnLoader ? false : true}
                    onClick={() => {
                      addToCartClickHandler({
                        type: "ADDTOCART",
                        payload: {
                          _id,
                          name,
                          image,
                          price,
                          productName,
                          inStock,
                          fastDelivery,
                          ratings,
                          qty: 1
                        }
                      });
                    }}
                  >
                    {btnLoader ? "Adding to Cart..." : "ADD TO CART"}
                  </button>
                )}
              </div>
            </div>
    );
}