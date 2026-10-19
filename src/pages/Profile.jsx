
const logout = () => {
  localStorage.removeItem("loggedIn");
  localStorage.removeItem("currentUser");
  localStorage.removeItem("authToken");

  // Clear shared browser data to prevent cross-account leakage.
  localStorage.removeItem("cart");
  localStorage.removeItem("wishlist");

  window.dispatchEvent(new Event("auth-changed"));
  window.dispatchEvent(new Event("cart-wishlist-updated"));

  sessionStorage.setItem(
    "nexoraToast",
    JSON.stringify({
      message: "Logged out successfully!",
      type: "success"
    })
  );

  navigate("/", { replace: true });
};
