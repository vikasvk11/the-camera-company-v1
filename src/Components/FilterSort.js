import React, { useEffect, useReducer, useState } from "react";
import { useProduct } from "../products/ProductContext";
import "../styles.css";

export function FilterSort() {

    const { productState, productDispatch } = useProduct();

    const [optionsState, optionsDispatch] = useReducer(optionsReducer, {
        filter: false,
        sort: false,
        wishlist: false
      });

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

    return (
        <>
        <div className={`filter-options ${optionsState.filter ? "filter-active" : "" }` }>
            <h1 className="filter-options_header"> Filter By </h1>
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
        <div className={`filter-options ${optionsState.sort ? "filter-active" : ""}`} >
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
                    onChange={() => productDispatch({ type: "sort", payload: "low_to_high" }) }
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
        </>
    );
}