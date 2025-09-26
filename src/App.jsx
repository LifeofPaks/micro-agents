import { useEffect, useState } from "react";
import Footer from "./components/Footer";
import Header from "./components/Header";
import ProductsSection from "./components/ProductsSection";
import ScrollToTop from "./components/ScrollToTop";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BASEURL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const verifyUserApi = (token) =>
  axiosInstance.post("/auth/verify-user", { token });

function App() {
  const [user, setUser] = useState(null);
  useEffect(() => {
    const handleMessage = async () => {
      try {
        const response = await verifyUserApi(data.token);

        if (response?.data?.access_token) {
          const verifiedToken = response.data.access_token;

          localStorage.setItem("microagents-token", verifiedToken);

          let decoded = {};
          try {
            decoded = decodeJWT(verifiedToken);
          } catch (err) {
            console.warn("Failed to decode verified JWT:", err);
          }

          const payload = decoded.payload || {};

          const user = {
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
            businessId:
              decoded.businessId ||
              decoded.business_id ||
              payload.business_id ||
              payload.businessId,
            businessDetails:
              payload.business_details ||
              payload.businessDetails ||
              payload.business_details,
            singleLoginBusinessId: payload.business_id,
          };

          setUser(user, verifiedToken);

          notifySuccess("Authentication Successful");
        } else {
          notifyError("Verification failed: No access token received.");
        }
      } catch (err) {
        console.error("User verification failed:", err);
        if (err.response?.status === 401 || err.response?.status === 403) {
          localStorage.removeItem("microagents-token");
          notifyError("Invalid authentication token. Please try again.");
        } else {
          notifyError(
            "Authentication verification failed. Redirecting to dashboard..."
          );
        }
      } finally {
        setIsLoading(false);
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [setUser]);

  return (
    <div className="App" data-bs-theme="dark">
      <Header />
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
