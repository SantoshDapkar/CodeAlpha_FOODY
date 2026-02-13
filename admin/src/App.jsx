import React, { useContext, useEffect } from "react";
import Navbar from "./components/Navbar/Navbar";
import Sidebar from "./components/Sidebar/Sidebar";
import { Route, Routes, useNavigate } from "react-router-dom"; // Import useNavigate
import Add from "./pages/Add/Add";
import List from "./pages/List/List";
import Orders from "./pages/Orders/Orders";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Login from "./components/Login/Login";
import { StoreContext } from "./context/StoreContext"; // Ensure this is imported

const App = () => {
  // Get admin state and token from context
  const { admin, token } = useContext(StoreContext); // Use your local URL for development
  const url = "http://localhost:4000"; // ⭐ SECURITY CHECK: Determine if the user should be redirected to Login ⭐
  const shouldShowLogin = !token || !admin;

  // useEffect(() => {
  //   // If the user lands on the app but is not logged in, show an error (optional)
  //   // if (shouldShowLogin && window.location.pathname !== "/") {
  //   //   toast.error("Please log in to access the Admin Panel.");
  //   // }
  // }, [shouldShowLogin]);

  return (
    <div>
            <ToastContainer />           {" "}
      {shouldShowLogin ? (
        // RENDER ONLY LOGIN if not authorized
        <Login url={url} />
      ) : (
        // RENDER FULL DASHBOARD if authorized
        <>
                      <Navbar />
                      <hr />           {" "}
          <div className="app-content">
                          <Sidebar />             {" "}
            <Routes>
                              <Route path="/" element={<Add url={url} />} />{" "}
              {/* Redirect to a default route */}
                              <Route path="/add" element={<Add url={url} />} />
                             {" "}
              <Route path="/list" element={<List url={url} />} />
                             {" "}
              <Route path="/orders" element={<Orders url={url} />} />           
               {" "}
            </Routes>
                       {" "}
          </div>
                   {" "}
        </>
      )}
         {" "}
    </div>
  );
};

export default App;
