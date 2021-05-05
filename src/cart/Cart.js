import {useEffect, useReducer, useState} from "react";
import {CartContext, useCart} from "./CartContext.js";
import {NavLink, Route, Routes} from "react-router-dom";
import "../styles.css";
import axios from "axios";

export function Cart() {
    const {cartState, cartDispatch} = useCart();

    const [modalState,
        setModalState] = useState({state: false, productId: ""});

    function modalAppear(_id) {
        setModalState({state: true, productId: _id});
    }

    function modalDisappear() {
        setModalState({state: false, productId: ""});
    }

    async function modalDelete() {
        try {
            // const res = await axios.delete(
            // `https://theccbackend.vikasvk1997.repl.co/cart/${modalState.productId}` );
            cartDispatch({
                type: "REMOVE_CART",
                payload: {
                    _id: modalState.productId
                }
            });
            setModalState({state: false, productId: ""});
        } catch (err) {
            console.log(err);
        }
    }

    async function qtyHandler({type, payload}) {
        const product = cartState
            .cart
            .find((item) => item._id === payload._id);
        let qty;
        if (type === "INCREMENT") {
            qty = {
                quantity: product.qty + 1
            };
        } else {
            qty = {
                quantity: product.qty - 1
            };
        }
        try {
            // const res = await axios.post(
            // `https://theccbackend.vikasvk1997.repl.co/cart/${payload._id}`,   qty );
            cartDispatch({type, payload});
        } catch (err) {
            console.log(err);
        }
    }

    async function addToWishlistHandler({type, payload}) {
        try {
            const res = await axios.post("https://theccbackend.vikasvk1997.repl.co/wishlist", {id: payload._id});
            const res1 = await axios.delete(`https://theccbackend.vikasvk1997.repl.co/cart/${payload._id}`);
            cartDispatch({type, payload});
        } catch (err) {
            console.log(err);
        }
    }

    return (
        <div>
            {cartState.cart.length === 0
                ? (
                    <div className="cart-container empty">
                        <h1>It looks empty in here</h1>
                        <img className="empty-cart-img" src="images\cart-icon-v3.png" alt="logo"/>
                        <button className="btn-primary">
                            <NavLink to="/products">Shop Now</NavLink>
                        </button>
                    </div>
                )
                : (
                    <div className="cart-container">
                        <h1 className="cart-header">My Cart ({cartState.cart.length})</h1>
                        {cartState
                            .cart
                            .map(({
                                _id,
                                name,
                                image,
                                price,
                                productName,
                                fastDelivery,
                                inStock,
                                ratings,
                                qty
                            }) => (
                                <div className="product-card cart-card" key={_id}>
                                    <div className="cart-card-img_content">
                                        <img className="cart-img" src={image} alt={productName}/>
                                        <div className="cart-card_content">
                                            <p className="card-title">
                                                {name}
                                            </p>
                                            <p className="product-price">
                                                &#8377; {(price * qty).toLocaleString()}{" "}
                                            </p>

                                            {fastDelivery
                                                ? (
                                                    <div
                                                        style={{
                                                        fontSize: "0.8rem"
                                                        
                                                    }}>
                                                        Fast Delivery
                                                    </div>
                                                )
                                                : (
                                                    <div
                                                        style={{
                                                        fontSize: "0.8rem"
                                                  
                                                    }}>
                                                        3 days minimum
                                                    </div>
                                                )}
                                          <div className="cart-card_qty-btns">
                                            <button
                                                disabled={qty === 1}
                                                onClick={() => qtyHandler({type: "DECREMENT", payload: {
                                                    _id
                                                }})}
                                                className="btn-secondary cart-qty-btn">
                                                -
                                            </button>
                                            <span>{qty}</span>
                                            <button
                                                onClick={() => qtyHandler({type: "INCREMENT", payload: {
                                                    _id
                                                }})}
                                                className="btn-secondary cart-qty-btn">
                                                +
                                            </button>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="cart-card_btns">
                                        <button className="btn-secondary remove" onClick={() => modalAppear(_id)}>
                                            Remove
                                        </button>
                                        {cartState
                                            .wishlist
                                            .find((item) => _id === item._id)
                                            ? (
                                                <NavLink className="btn-secondary remove" to="/wishlist">
                                                    Go to Wishlist{" "}
                                                    <span
                                                        className="material-icons af"
                                                        style={{
                                                        fontSize: "0.6rem"
                                                    }}>arrow_forward_ios</span>
                                                </NavLink>
                                            )
                                            : (
                                                <button
                                                    onClick={() => addToWishlistHandler({
                                                    type: "MOVE_TO_WISHLIST",
                                                    payload: {
                                                        _id,
                                                        name,
                                                        image,
                                                        price,
                                                        productName,
                                                        fastDelivery,
                                                        inStock,
                                                        ratings,
                                                        qty
                                                    }
                                                })}
                                                    className="btn-secondary remove">
                                                    Move to Wishlist
                                                </button>
                                            )}
                                    </div>
                                </div>
                            ))}
                        <div className="checkout">
                            <h1 className="checkout-header">CART DETAILS</h1>
                            <div className="checkout-el">
                                <p>Total Price</p>
                                <p>
                                    &#8377;{" "} {cartState
                                        .cart
                                        .reduce((acc, cur) => cur.qty * cur.price + acc, 0)
                                        .toLocaleString()}
                                </p>
                            </div>
                            <div className="checkout-el">
                                <p>Delivery Charges</p>
                                <p className="offer">FREE</p>
                            </div>
                            <div className="checkout-el total">
                                <p>Total Amount</p>
                                <p>
                                    &#8377;{" "} {cartState
                                        .cart
                                        .reduce((acc, cur) => cur.qty * cur.price + acc, 0)
                                        .toLocaleString()}
                                </p>
                            </div>
                            <button className="btn-primary">Checkout</button>
                        </div>
                    </div>
                )}
            <div
                className={`modal-bg ${modalState.state
                ? "modal-bg-active"
                : ""}`}>
                <div className="modal">
                    <h1>
                        Delete item{" "}
                        <span onClick={modalDisappear} className="material-icons modal-close">
                            close
                        </span>
                    </h1>
                    <p>Are you sure you want to delete this item from your cart?</p>
                    <div className="modal-btn-container">
                        <button onClick={modalDisappear} className="btn-secondary-outline modal-btn">
                            Cancel
                        </button>
                        <button onClick={modalDelete} className="btn-primary-outline modal-btn">
                            Delete
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
