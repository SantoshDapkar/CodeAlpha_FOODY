import React, { useEffect, useContext } from "react";
import "./Verify.css";
import { useNavigate, useSearchParams } from "react-router-dom";
// StoreContext and axios are technically no longer strictly needed in this file
// if you only use URL parameters for status, but they are left imported for safety.
import { StoreContext } from "../../context/StoreContext";
import { toast } from "react-toastify";

const Verify = () => {
  // We only need useSearchParams to read the status from the URL
  const [searchParams] = useSearchParams();
  const success = searchParams.get("success"); // Reads 'true' or 'false'
  const navigate = useNavigate();

  // Although we aren't using the full verifyPayment function anymore,
  // we keep the context variables in case future logic needs them.
  const { url } = useContext(StoreContext);

  useEffect(() => {
    // We check the URL parameter directly.
    // The backend already handled payment verification/order deletion
    // before redirecting to this page.

    if (success === "true") {
      // This case should primarily occur if the backend's redirect failed
      // to go directly to /myorders, or if the user manually navigated here.
      toast.success("Order Placed Successfully!");
      navigate("/myorders");
    } else if (success === "false") {
      // This is the expected path after a payment failure, as the backend
      // deleted the order and redirected here.
      toast.error("Payment Failed. The order has been cancelled.");
      navigate("/"); // Redirect to the homepage or a dedicated failure page
    } else {
      // Handle cases where parameters are missing or invalid
      // If the URL is just /verify without any params, navigate home.
      console.error("Invalid or incomplete verification request.");
      navigate("/");
    }
  }, [success, navigate]);
  // Dependency array ensures the logic runs once when the component mounts
  // or if the 'success' parameter unexpectedly changes.

  return (
    <div className="verify">
      <div className="spinner"></div>
      <p>Processing Status...</p>   {" "}
    </div>
  );
};

export default Verify;
