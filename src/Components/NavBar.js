import "../styles.css";
import { NavLink } from "react-router-dom";
import { useCart } from "../cart/CartContext";

export function NavBar() {

    const { cartState, cartDispatch } = useCart();

    return (
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
    );
}