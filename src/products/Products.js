import React, { useEffect, useReducer, useState } from "react";
import "../styles.css";
import { useCart } from "../cart/CartContext";
import { useProduct } from "./ProductContext";
import { NavLink, Route, Routes } from "react-router-dom";
import axios from "axios";

import { useToast } from "../toast/ToastProvider";



export function Products() {
  const [optionsState, optionsDispatch] = useReducer(optionsReducer, {
    filter: false,
    sort: false,
    wishlist: false
  });

  const [load, setLoad] = useState(false);
  const [error, setError] = useState(false);
  const [apiData, setApiData] = useState([]);

  function optionsReducer(state, action) {
    switch (action.type) {
      case "filter":
        if (state.filter) {
          return { ...state, filter: false };
        } else return { ...state, filter: true, sort: false };
      case "sort":
        if (state.sort) {
          return { ...state, sort: false };
        } else return { ...state, filter: false, sort: true };
      default:
        return state;
    }
  }

  function sortData(products, productState) {
    if (productState.sort === "high_to_low") {
      return products.sort((a, b) => b.price - a.price);
    }
    if (productState.sort === "low_to_high") {
      return products.sort((a, b) => a.price - b.price);
    }
    return products;
  }

  function filterData(products, productState) {
    return products
      .filter((item) => (productState.showFD ? item.fastDelivery : true))
      .filter((item) => (productState.showAll ? true : item.inStock));
  }

  async function addToCartClickHandler({ type, payload }) {
    try {
      const res = await axios.post(
        "https://theccbackend.vikasvk1997.repl.co/cart",
        {
          productId: payload._id,
          quantity: 1
        }
      );
      cartDispatch({ type, payload });
      toastDispatch({ type: "TO_CART" });
    } catch (err) {
      console.log(err);
    }
  }

  async function addToWishlistHandler({ type, payload }) {
    try {
      const res = await axios.post(
        "https://theccbackend.vikasvk1997.repl.co/wishlist",
        {
          id: payload._id
        }
      );
      cartDispatch({ type, payload });
      toastDispatch({ type: "TO_WISHLIST" });
    } catch (err) {
      console.log(err);
    }
  }

  async function removeFromWishlistHandler({ type, payload }) {
    try {
      const res = await axios.delete(
        `https://theccbackend.vikasvk1997.repl.co/wishlist/${payload._id}`
      );

      cartDispatch({ type, payload });
      toastDispatch({ type: "REMOVE_WISHLIST" });
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    async function getData() {
      setLoad(true);
      try {
        const res = await axios.get(
          "https://theccbackend.vikasvk1997.repl.co/products"
        );

        setApiData(res.data.products);
      } catch (err) {
        setError(true);
        console.log(err);
      } finally {
        setLoad(false);
      }
    }
    getData();
  }, []);

  const { cartState, cartDispatch } = useCart();

  const { productState, productDispatch } = useProduct();

  const { toastDispatch } = useToast();

  const sortedData = sortData(apiData, productState);
  const filteredData = filterData(sortedData, productState);

  return (
    <>
      <h1 className="mg-1" style={{ marginTop: "5rem" }}>
        Products
      </h1>
      {load && (
        <img className="loader" src="images\Spinner-0.8s-211px.gif" alt="loader" />
      )}

      <div className="App" style={{ display: "flex", flexWrap: "wrap" }}>
        {filteredData.map(
          ({
            _id,
            name,
            image,
            price,
            productName,
            inStock,
            fastDelivery,
            ratings
          }) => (
            <div
              key={_id}
              style={{
                margin: "1rem",
                maxWidth: "40%",
                padding: "0 0 1rem"
              }}
              className="product-card"
            >
              <img src={image} alt={productName} />
              <p className="card-title"> {name} </p>
              <p className="product-price">&#8377; {price.toLocaleString()}</p>
              {!inStock && (
                <div style={{ color: "grey", fontSize: "0.8rem" }}>
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
                <div style={{ fontSize: "0.8rem" }}> Fast Delivery </div>
              ) : (
                <div style={{ fontSize: "0.8rem" }}> 3 days minimum </div>
              )}
              <div>
                {cartState.cart.find((item) => _id === item._id) ? (
                  <button className="btn-primary btn-goto mg-1" style={{fontSize: "0.7rem"}}>
                    <NavLink to="/cart">
                      GO TO CART
                      <span className="material-icons af" style={{fontSize: "0.5rem"}}>
                        arrow_forward_ios
                      </span>
                    </NavLink>
                  </button>
                ) : (
                  <button
                    className="btn-primary mg-1"
                    style={{fontSize: "0.7rem"}}
                    disabled={inStock ? false : true}
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
                    ADD TO CART
                  </button>
                )}
              </div>
            </div>
          )
        )}
      </div>
      <div
        className={`filter-options ${
          optionsState.filter ? "filter-active" : ""
        }`}
      >
        <h1 className="filter-options_header">Filter By</h1>
        <label className="filter-options_1">
          <input
            type="checkbox"
            name="include"
            onChange={() =>
              productDispatch({ type: "showAll", payload: "All" })
            }
            checked={productState.showAll}
          />
          Include Out of Stock
        </label>
        <label className="filter-options_2">
          <input
            type="checkbox"
            name="fastdelivery"
            onChange={() =>
              productDispatch({ type: "showFD", payload: "showFD" })
            }
            checked={productState.showFD}
          />
          Fast Delivery Only
        </label>
      </div>
      <div
        className={`filter-options ${optionsState.sort ? "filter-active" : ""}`}
      >
        <h1 className="filter-options_header">Sort By</h1>
        <label className="filter-options_1">
          <input
            type="radio"
            name="sort"
            onChange={() =>
              productDispatch({ type: "sort", payload: "high_to_low" })
            }
            checked={productState.sort === "high_to_low"}
          />
          High to Low
        </label>
        <label className="filter-options_2">
          <input
            type="radio"
            name="sort"
            onChange={() =>
              productDispatch({ type: "sort", payload: "low_to_high" })
            }
            checked={productState.sort === "low_to_high"}
          />
          Low to High
        </label>
      </div>
      <div className="filter-sort">
        <div onClick={() => optionsDispatch({ type: "filter" })}>
          <span className="material-icons">filter_list</span>
          Filter
        </div>
        <div onClick={() => optionsDispatch({ type: "sort" })}>
          <span className="material-icons">sort</span>
          Sort
        </div>
      </div>

      <div className="toast ">
        <p>Added to Cart</p>
        <span className="material-icons">close</span>
      </div>

      <div className={`toast ${optionsState.wishlist ? "toast-visible" : ""}`}>
        <p>Added to Wishlist</p>
      </div>
    </>
  );
}
