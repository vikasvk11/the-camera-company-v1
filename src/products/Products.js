import React, { useEffect, useReducer, useState } from "react";
import "../styles.css";
import { useProduct } from "./ProductContext";
import axios from "axios";
import { Loader } from "../Components/Loader";
import { ProductCard } from "../Components/ProductCard";



export function Products() {

  const [optionsState, optionsDispatch] = useReducer(optionsReducer, {
    filter: false,
    sort: false,
    wishlist: false
  });


  const [loader, setLoader] = useState(false);
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

  useEffect(() => {
    async function getData() {
      setLoader(true);
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_BE_URL}products`
        );

        setApiData(res.data.products);
      } catch (err) {
        setError(true);
        console.log(err);
      } finally {
        setLoader(false);
      }
    }
    getData();
  }, []);

  const { productState, productDispatch } = useProduct();

  const sortedData = sortData(apiData, productState);
  const filteredData = filterData(sortedData, productState);

  return (
    <>
    {loader && (
        <Loader />
      )}
      <h1 className="mg-1 product-header mg-t-5"> Products </h1>

      <div className="App products-container">
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
            <>
              <ProductCard 
              key={_id} 
              _id={_id} 
              name={name} 
              image={image} 
              price={price} 
              productName={productName} 
              inStock={inStock} 
              fastDelivery={fastDelivery}
              ratings={ratings}
              />
            </>
          )
        )}
      </div>
      <div
        className={`filter-options ${
          optionsState.filter ? "filter-active" : ""
        }`}
      >
        <h1 className="filter-options_header">Filter By</h1>
        <span onClick={() => optionsDispatch({ type: "filter" })} className="material-icons options-close">close</span>
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
        <span onClick={() => optionsDispatch({ type: "sort" })} className="material-icons options-close">close</span>
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
