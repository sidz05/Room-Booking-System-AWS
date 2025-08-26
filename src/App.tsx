import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useNavigate,
} from "react-router-dom";
import Login from "./components/auth/Login";
import Signup from "./components/auth/Signup";
import Calendar from "./components/Calendar";
import FloorPlan from "./components/FloorPlan"; // ⬅️ your next screen
import { useAuth } from "./context/AuthContext";
import { useState } from "react";

function AppRoutes() {
  const { user } = useAuth();
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
      <Route
        path="/signup"
        element={!user ? <Signup /> : <Navigate to="/" />}
      />

      {/* Protected Routes */}
      <Route
        path="/"
        element={
          user ? (
            <Calendar
              selectedDate={selectedDate}
              onDateSelect={setSelectedDate}
            />
          ) : (
            <Navigate to="/login" />
          )
        }
      />
      <Route
        path="/floorplan"
        element={
          user && selectedDate ? (
            <FloorPlan selectedDate={selectedDate} />
          ) : (
            <Navigate to="/" />
          )
        }
      />
    </Routes>
  );
}

export default function App() {
  return (
    <Router>
      <AppRoutes />
    </Router>
  );
}
