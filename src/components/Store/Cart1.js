const CART_URL = "https://<YOUR-FIREBASE-APP>.firebaseio.com/cart.json";

const fetchCartHandler = async () => {
  try {
    const response = await fetch(CART_URL);

    if (!response.ok) {
      throw new Error("Failed to fetch cart items");
    }

    const data = await response.json();
    let cartItems = [];

    for (const key in data) {
      cartItems.push({
        id: key,
        title: data[key].title,
        quantity: data[key].quantity,
        price: data[key].price,
      });
    }

    return cartItems;
  } catch (error) {
    throw new Error("Failed to fetch cart items");
  }
};

const addToCartHandler = async (product) => {
  const cartItems = await fetchCartHandler();
  const existingCartItemIndex = cartItems.findIndex(
    (item) => item.id === product.id
  );
  const existingCartItem = cartItems[existingCartItemIndex];

  let updatedItems;

  if (existingCartItem) {
    const updatedItem = {
      ...existingCartItem,
      quantity: existingCartItem.quantity + 1,
    };
    updatedItems = [...cartItems];
    updatedItems[existingCartItemIndex] = updatedItem;
  } else {
    updatedItems = cartItems.concat({
      id: product.id,
      title: product.title,
      quantity: 1,
      price: product.price,
    });
  }

  const response = await fetch(CART_URL, {
    method: "PUT",
    body: JSON.stringify(updatedItems),
  });

  if (!response.ok) {
    throw new Error("Failed to add item to cart");
  }
};

const removeFromCartHandler = async (productId) => {
  const cartItems = await fetchCartHandler();
  const existingCartItemIndex = cartItems.findIndex(
    (item) => item.id === productId
  );
  const existingCartItem = cartItems[existingCartItemIndex];

  if (!existingCartItem) {
    throw new Error("Item not found in cart");
  }

  let updatedItems;

  if (existingCartItem.quantity === 1) {
    updatedItems = cartItems.filter((item) => item.id !== productId);
  } else {
    const updatedItem = {
      ...existingCartItem,
      quantity: existingCartItem.quantity - 1,
    };
    updatedItems = [...cartItems];
    updatedItems[existingCartItemIndex] = updatedItem;
  }

  const response = await fetch(CART_URL, {
    method: "PUT",
    body: JSON.stringify(updatedItems),
  });

  if (!response.ok) {
    throw new Error("Failed to remove item from cart");
  }
};
const updateQuantityHandler = async (productId, quantity) => {
  const cartItems = await fetchCartHandler();
  const existingCartItemIndex = cartItems.findIndex(
    (item) => item.id === productId
  );
  const existingCartItem = cartItems[existingCartItemIndex];

  if (!existingCartItem) {
    throw new Error("Item not found in cart");
  }

  const updatedItem = {
    ...existingCartItem,
    quantity: quantity,
  };

  const updatedItems = [...cartItems];
  updatedItems[existingCartItemIndex] = updatedItem;

  const response = await fetch(CART_URL, {
    method: "PUT",
    body: JSON.stringify(updatedItems),
  });

  if (!response.ok) {
    throw new Error("Failed to update item quantity");
  }
};
