import React from "react";

const CartContext = React.createContext({
  items: [],
  totalAmount: 0,
  addItem: (product) => {},
  removeItem: (id) => {},
  updateItem: (id, quantity) => {},
  getItems: () => {},
  clearItems: () => {},
});

export default CartContext;
