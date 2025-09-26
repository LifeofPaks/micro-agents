import { useEffect, useState } from "react";
import Footer from "./components/Footer";
import Header from "./components/Header";
import ProductsSection from "./components/ProductsSection";
import ScrollToTop from "./components/ScrollToTop";
import { notifyError, notifySuccess } from "./utils/toastify";
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BASEURL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const verifyUserApi = (token) =>
  axiosInstance.post("/auth/verify-user", { token });

  const decodeJWT = (token) => {
    try {
      const parts = token.split(".");
      if (parts.length !== 3) throw new Error("Invalid JWT token");
      return JSON.parse(atob(parts[1]));
    } catch (error) {
      console.error("Error decoding JWT:", error);
      return null;
    }
  };

function App() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  console.log("user data:", user);
  

useEffect(() => {
  const initAuth = async () => {
    try {
      // Extract token from URL params
      const urlParams = new URLSearchParams(window.location.search);
      const token = urlParams.get("token");

      if (!token) {
        notifyError("No authentication token found in URL.");
        setIsLoading(false);
        return;
      }

      // Verify token with API
      const response = await verifyUserApi(token);
      const verifiedToken = response?.data?.access_token || token;

      // Save token in localStorage
      localStorage.setItem("microagents-token", verifiedToken);

      // Decode JWT
      const decoded = decodeJWT(verifiedToken);

      // The actual payload is nested inside decoded.payload
      const payload = decoded?.payload || {};

      // Map user data
      const userData = {
        id: decoded.sub || payload.userid || payload.user_id || payload.id,
        email:
          decoded.email ||
          payload.email ||
          payload.user_detail?.email ||
          payload.user_email,
        fullName:
          decoded.fullName ||
          payload.fullname ||
          payload.full_name ||
          payload.user_detail?.name,
        role:
          payload.role_name ||
          payload.role ||
          payload.userType ||
          payload.role_details?.role_name,
        profile: payload.profile || payload.profile_details?.profile_name,
        businessId:
          decoded.businessId ||
          decoded.business_id ||
          payload.business_id ||
          payload.businessId,
        businessDetails:
          payload.business_details ||
          payload.businessDetails ||
          payload.user_detail?.business_details ||
          payload.user_detail?.businessDetails,
      };

      setUser(userData);
      notifySuccess("Authentication Successful");
    } catch (err) {
      console.error("User verification failed:", err);
      localStorage.removeItem("microagents-token");
      notifyError("Authentication failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  initAuth();
}, []);

  return (
    <div className="App" data-bs-theme="dark">
      <Header user={ user} />
      <main>
        <div className="pattern-square"></div>
        <ProductsSection />
      </main>
      <Footer />
      <ScrollToTop />
    </div>
  );
}

export default App;
