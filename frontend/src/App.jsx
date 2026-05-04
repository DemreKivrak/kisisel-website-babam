import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import { AuthProvider } from "./contexts/AuthContext";
import { MenuProvider } from "./contexts/MenuContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { ScrollToTop } from "./components/ScrollToTop";
import { Homepage } from "./pages/homepage/Homepage.jsx";
import { Tours } from "./pages/Tours/Tours.jsx";
import { Destinations } from "./pages/Destinations.jsx";
import { SelectedDestination } from "./pages/SelectedDestination.jsx";
import { TourPage } from "./components/TourPage.jsx";
import { Contact } from "./pages/Contact.jsx";
import { Admin } from "./pages/Admin.jsx";
import { Login } from "./pages/Login.jsx";
import { About } from "./pages/About.jsx";
import { CarRental } from "./pages/CarRental.jsx";
import { Galery } from "./pages/Galery.jsx";

function App() {
  return (
    <Router>
      <ScrollToTop />
      <AuthProvider>
        <MenuProvider>
          <Routes>
            <Route path="/" element={<Homepage />} />
            <Route path="/tours" element={<Tours />} />
            <Route path="/destinations" element={<Destinations />} />
            <Route path="/destinations/:id" element={<SelectedDestination />} />
            <Route path="/tourpage/:id" element={<TourPage />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<Login />} />
            <Route path="/about" element={<About />} />
            <Route path="/car-rental" element={<CarRental />} />
            <Route path="/galery" element={<Galery />} />
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <Admin />
                </ProtectedRoute>
              }
            />
          </Routes>
        </MenuProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
