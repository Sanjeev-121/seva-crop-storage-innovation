import { Routes, Route } from "react-router-dom";
import DemoBanner from "./components/DemoBanner.jsx";
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import ScrollToTop from "./components/ScrollToTop.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import StorageList from "./pages/StorageList.jsx";
import StorageDetails from "./pages/StorageDetails.jsx";
import Schemes from "./pages/Schemes.jsx";
import ApplicationStatus from "./pages/ApplicationStatus.jsx";
import NotFound from "./pages/NotFound.jsx";

function App() {
  return (
    <>
      <ScrollToTop />
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>
      <DemoBanner />
      <Navbar />

      <main id="main-content" className="page-main" tabIndex={-1}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/storages" element={<StorageList />} />
          <Route path="/storages/:id" element={<StorageDetails />} />
          <Route path="/schemes" element={<Schemes />} />

          {/* These two need a (demo) login */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/applications"
            element={
              <ProtectedRoute>
                <ApplicationStatus />
              </ProtectedRoute>
            }
          />

          {/* Any other address */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      <Footer />
    </>
  );
}

export default App;