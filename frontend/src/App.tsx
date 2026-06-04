import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import CarsPage from "./pages/CarsPage";
import CarDetailsPage from "./pages/CarDetailsPage";
import AdminCarsPage from "./pages/AdminCarsPage";
import AdminBookingsPage from "./pages/AdminBookingsPage";

function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/cars" element={<CarsPage />} />
        <Route path="/cars/:id" element={<CarDetailsPage />} />
        <Route path="/admin/cars" element={<AdminCarsPage />} />
        <Route path="/admin/bookings" element={<AdminBookingsPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;