
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";
import ProtectedRoute from "./components/ProtectedRoute";
import GlobalToast from "./components/GlobalToast";

import Home from "./pages/Home";
import Categories from "./pages/Categories";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Cart from "./pages/Cart";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";

import SkincareBeauty from "./pages/SkincareBeauty";
import FashionDresses from "./pages/FashionDresses";
import FreshFruits from "./pages/FreshFruits";
import FreshVegetables from "./pages/FreshVegetables";
import SnacksBeverages from "./pages/SnacksBeverages";
import HomeEssentials from "./pages/HomeEssentials";

import Electronics from "./pages/Electronics";
import MobilesGadgets from "./pages/MobilesGadgets";
import Furniture from "./pages/Furniture";
import KitchenEssentials from "./pages/KitchenEssentials";
import SportsFitness from "./pages/SportsFitness";
import BooksEducation from "./pages/BooksEducation";
import ToysKids from "./pages/ToysKids";
import PetSupplies from "./pages/PetSupplies";

import Checkout from "./pages/Checkout";
import OrderSuccess from "./pages/OrderSuccess";
import MyOrders from "./pages/MyOrders";
import Dairy from "./pages/Dairy";
import Search from "./pages/Search";
import ProductDetails from "./pages/ProductDetails";
import Wishlist from "./pages/Wishlist";

import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <GlobalToast />
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/categories" element={<Categories />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/cart" element={<Cart />} />

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<Profile />} />

        <Route
          path="/skincare-beauty"
          element={<SkincareBeauty />}
        />
        <Route
          path="/fashion-dresses"
          element={<FashionDresses />}
        />
        <Route path="/fresh-fruits" element={<FreshFruits />} />
        <Route
          path="/fresh-vegetables"
          element={<FreshVegetables />}
        />
        <Route
          path="/snacks-beverages"
          element={<SnacksBeverages />}
        />
        <Route
          path="/home-essentials"
          element={<HomeEssentials />}
        />

        <Route path="/electronics" element={<Electronics />} />
        <Route
          path="/mobiles-gadgets"
          element={<MobilesGadgets />}
        />
        <Route path="/furniture" element={<Furniture />} />
        <Route
          path="/kitchen-essentials"
          element={<KitchenEssentials />}
        />
        <Route path="/sports-fitness" element={<SportsFitness />} />
        <Route
          path="/books-education"
          element={<BooksEducation />}
        />
        <Route path="/toys-kids" element={<ToysKids />} />
        <Route path="/pet-supplies" element={<PetSupplies />} />

        <Route
          path="/checkout"
          element={
            <ProtectedRoute>
              <Checkout />
            </ProtectedRoute>
          }
        />

        <Route
          path="/my-orders"
          element={
            <ProtectedRoute>
              <MyOrders />
            </ProtectedRoute>
          }
        />

        <Route path="/dairy" element={<Dairy />} />
        <Route path="/search" element={<Search />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/order-success" element={<OrderSuccess />} />
      </Routes>

      <Footer />
    </BrowserRouter>
  );
}

export default App;