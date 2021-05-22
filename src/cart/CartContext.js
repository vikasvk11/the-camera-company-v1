import { createContext, useReducer, useContext } from "react";
import { useToast } from "../toast/ToastProvider";
import axios from "axios";

const CartContext = createContext();

function cartReducer(state, action) {
  switch (action.type) {
    case "ADDTOCART":
      return {
        ...state,
        cart: [{ ...action.payload }, ...state.cart ]
      };

    case "INCREMENT":
      return {
        ...state,
        cart: state.cart.map((product) =>
          product._id === action.payload._id
            ? { ...product, qty: product.qty + 1 }
            : product
        )
      };

    case "DECREMENT":
      return {
        ...state,
        cart: state.cart.map((product) =>
          product._id === action.payload._id
            ? { ...product, qty: product.qty - 1 }
            : product
        )
      };

    case "REMOVE_CART":
      return {
        ...state,
        cart: state.cart.filter((product) => product._id !== action.payload._id)
      };

    case "ADD_TO_WISHLIST":
      return {
        ...state,
        wishlist: [action.payload, ...state.wishlist]
      };

    case "REMOVE_WISHLIST":
      return {
        ...state,
        wishlist: state.wishlist.filter(
          (product) => product._id !== action.payload._id
        )
      };

    case "MOVE_TO_CART":
      return {
        ...state,
        cart: [{ ...action.payload, qty: 1 }, ...state.cart],
        wishlist: state.wishlist.filter(
          (product) => product._id !== action.payload._id
        )
      };

    case "MOVE_TO_WISHLIST":
      return {
        ...state,
        cart: state.cart.filter(
          (product) => product._id !== action.payload._id
        ),
        wishlist: [action.payload, ...state.wishlist]
      };
    default:
      return state;
  }
}

export function CartProvider({ children }) {
  const { toastDispatch } = useToast();

  const [cartState, cartDispatch] = useReducer(cartReducer, {
    cart: [],
    wishlist: []
  });

  console.log(cartState);

  return (
    <CartContext.Provider value={{ cartState, cartDispatch }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
