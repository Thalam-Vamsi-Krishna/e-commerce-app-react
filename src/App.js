import React, { useContext, lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import CartProvider from "./components/Store/CartProvider";
import Header from "./components/Layout/Header";
import Footer from "./components/Layout/Footer";
import AuthForm from "./components/Auth/AuthForm";
import AuthContext from "./components/Store/Auth-Context";
const Home = lazy(() => import("./components/Pages/Home"));
const Store = lazy(() => import("./components/Pages/Store"));
const ProductDetails = lazy(() => import("./components/Pages/ProductsPage"));
const About = lazy(() => import("./components/Pages/About"));
const Contact = lazy(() => import("./components/Pages/ContactUs"));

function App() {
  const authCtx = useContext(AuthContext);
  return (
    <CartProvider>
      <Header />
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          {authCtx.isLoggedIn && (
            <>
              <Route path="/home" element={<Home />} />
              <Route path="/store" element={<Store />} />
              <Route path="/product/:productId" element={<ProductDetails />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact_us" element={<Contact />} />
            </>
          )}
          {!authCtx.isLoggedIn && (
            <>
              <Route path="/home" element={<AuthForm />} />
              <Route path="/store" element={<AuthForm />} />
              <Route path="/about" element={<AuthForm />} />
              <Route path="/contact_us" element={<AuthForm />} />
              <Route path="/auth" element={<AuthForm />} />
            </>
          )}
        </Routes>
      </Suspense>
      <Footer />
    </CartProvider>
  );
}

export default App;
