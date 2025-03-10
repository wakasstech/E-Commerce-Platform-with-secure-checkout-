import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import { Flip, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import AdminLogin from "./Admin/Auth/Login/AdminLogin";

import AdminHomePage from "./Admin/Pages/AdminHomePage";

function App() {
  return (
    <>
      <ToastContainer
        toastClassName="toastContainerBox"
        transition={Flip}
        position="top-center"
      />
      <Router>
        <div className="margin">
          <Routes>
            {/*User Routes  */}
            <Route path="/" index element={<AdminHomePage />} />

            {/* Admin Routes */}
            <Route path="/admin/login" element={<AdminLogin />} />
          </Routes>
        </div>
        {/* <MobileNavigation /> */}
      </Router>
    </>
  );
}
export default App;
