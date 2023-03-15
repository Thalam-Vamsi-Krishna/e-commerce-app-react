import { useContext, useReducer } from "react";
import AuthContext from "./Auth-Context";
import CartContext from "./CartContext";

const defaultCartState = {
  items: [],
  totalAmount: 0,
};

const cartReducer = (state, action) => {
  if (action.type === "ADD_ITEM") {
    const existingCartItemIndex = state.items.findIndex(
      (cartItem) => cartItem.id === action.item.id
    );
    const existingCartItem = state.items[existingCartItemIndex];
    let updatedItems;
    if (existingCartItem) {
      const updatedItem = {
        ...existingCartItem,
        quantity: existingCartItem.quantity + 1,
        amount: existingCartItem.amount + action.item.amount,
      };
      updatedItems = [...state.items];
      updatedItems[existingCartItemIndex] = updatedItem;
    } else {
      const newItem = {
        ...action.item,
        quantity: 1,
      };
      updatedItems = state.items.concat(newItem);
    }
    const updatedTotalAmount = state.totalAmount + action.item.amount;
    return {
      items: updatedItems,
      totalAmount: updatedTotalAmount,
    };
  }
  if (action.type === "REMOVE_ITEM") {
    const existingCartItemIndex = state.items.findIndex(
      (cartItem) => cartItem.id === action.id
    );
    const existingItem = state.items[existingCartItemIndex];
    const updatedTotalAmount = action.totalAmount;

    const updatedItems = state.items.filter((item) => item.id !== action.id);

    return {
      items: updatedItems,
      totalAmount: updatedTotalAmount,
    };
  }

  if (action.type === "UPDATE_ITEM") {
    const existingCartItemIndex = state.items.findIndex(
      (cartItem) => cartItem.id === action.id
    );
    const existingItem = state.items[existingCartItemIndex];
    const updatedItem = {
      ...existingItem,
      quantity: action.quantity,
      amount: (existingItem.amount / existingItem.quantity) * action.quantity,
    };
    const updatedItems = [...state.items];
    updatedItems[existingCartItemIndex] = updatedItem;
    const updatedTotalAmount = state.items.reduce(
      (acc, item) => acc + item.amount,
      0
    );
    return {
      items: updatedItems,
      totalAmount: updatedTotalAmount,
    };
  }
  if (action.type === "SET_CART") {
    return {
      items: action.items,
      totalAmount: action.totalAmount,
    };
  }
  if (action.type === "CLEAR_CART") {
    return defaultCartState;
  }
  return defaultCartState;
};

const CartProvider = (props) => {
  const [cartState, dispatchCartAction] = useReducer(
    cartReducer,
    defaultCartState
  );

  const authCtx = useContext(AuthContext);
  const email = authCtx.email.replace(/[^a-zA-Z0-9]/g, "");

  const addItemToCart = async (item) => {
    try {
      const response = await fetch(
        `https://react-ecommerce-012-default-rtdb.firebaseio.com/cart${email}.json`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(item),
        }
      );
      if (!response.ok) {
        throw new Error("Something went wrong while adding the item to cart.");
      }
    } catch (error) {
      console.log(error.message);
    }
    dispatchCartAction({ type: "ADD_ITEM", item: item });
  };

  const removeItemFromCart = async (id) => {
    try {
      const response = await fetch(
        `https://react-ecommerce-012-default-rtdb.firebaseio.com/cart${email}/${id}.json`,
        {
          method: "DELETE",
        }
      );
      if (!response.ok) {
        throw new Error(
          "Something went wrong while deleting the item from cart."
        );
      }
    } catch (error) {
      console.log(error.message);
    }
    dispatchCartAction({ type: "REMOVE_ITEM", id: id });
  };

  const updateQuantity = async (id, quantity) => {
    try {
      const response = await fetch(
        `https://react-ecommerce-012-default-rtdb.firebaseio.com/cart${email}/${id}.json`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ quantity: quantity }),
        }
      );
      if (!response.ok) {
        throw new Error("Something went wrong while updating the item.");
      }
    } catch (error) {
      console.log(error.message);
    }
    dispatchCartAction({ type: "UPDATE_ITEM", id: id, quantity: quantity });
  };

  const fetchCartHandler = async () => {
    try {
      const response = await fetch(
        `https://react-ecommerce-012-default-rtdb.firebaseio.com/cart${email}.json`
      );
      if (!response.ok) {
        throw new Error(
          "Something went wrong while fetching Items of the cart"
        );
      }
      const data = await response.json();
      dispatchCartAction({
        type: "SET_CART",
        items: data.items || [],
        totalAmount: data.totalAmount || 0,
      });
    } catch (error) {
      console.log(error.message);
    }
  };

  const clearCartHandler = async () => {
    try {
      const response = await fetch(
        `https://react-ecommerce-012-default-rtdb.firebaseio.com/cart${email}.json`,
        {
          method: "DELETE",
        }
      );
      if (!response.ok) {
        throw new Error("Something went wrong while clearing the cart");
      }
      dispatchCartAction({
        type: "CLEAR_CART",
      });
    } catch (error) {
      console.log(error.message);
    }
  };

  const cartContext = {
    items: cartState.items,
    totalAmount: cartState.totalAmount,
    addItem: addItemToCart,
    removeItem: removeItemFromCart,
    updateQuantity: updateQuantity,
    getItems: fetchCartHandler,
    clearItems: clearCartHandler,
  };

  return (
    <CartContext.Provider value={cartContext}>
      {props.children}
    </CartContext.Provider>
  );
};

export default CartProvider;
