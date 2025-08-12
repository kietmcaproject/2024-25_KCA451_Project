import Layout from "./components/Layout";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Signup from "./components/Signup";
import LandingPage from "./components/LandingPage";
import Home from "./components/Home";
import ProtectedRoute from "./components/ProtectedRoute";
import { useEffect, useState } from "react";
import Login from "./components/Login";
import ProfilePage from "./components/ProfilePage";
import ProfilePage_OtherUser from "./components/ProfilePage_OtherUser";
import Testemonials from "./components/Testemonials";

function App() {
  //yaha check karo isUserLoggedIN or not and ushi hisaab se setIsAuthenticated to change karo

  const [isAuthenticated, setIsAuthenticated] = useState();
  useEffect(() => {
    // Check if user data exists in localStorage
    const user = localStorage.getItem("user");
    if (user) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
  }, []);

  return (
    <Router>
      <Routes>
        <Route element={<ProtectedRoute isAuthenticated={isAuthenticated} />}>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home setAuth={setIsAuthenticated} />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/users/:id" element={<ProfilePage_OtherUser/>} />
            <Route path="/testimonials" element={<Testemonials/>} />
          </Route>
        </Route>
        {/* These pages are outside the Layout */}
        <Route
          path="/auth/login"
          element={<Login setAuth={setIsAuthenticated} />}
        />
        <Route path="/signup" element={<Signup />} />
        <Route path="/landing" element={<LandingPage />} />

        {/* Main app routes inside Layout */}
      </Routes>
    </Router>
  );
}

export default App;
