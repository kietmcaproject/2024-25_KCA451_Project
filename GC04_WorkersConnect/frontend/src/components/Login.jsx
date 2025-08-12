import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const LoginPage = ({ setAuth }) => {
  const [loginInfo, setLoginInfo] = useState({
    email: "",
    password: "",
  });
  const [message, setMessage] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user data exists in localStorage
    const user = localStorage.getItem("user");
    if (user) {
      setAuth(true);
      navigate("/");
    } else {
      setAuth(false);
    }
  }, []);

  const onChangeHandler = (e) => {
    const { name, value } = e.target;
    setLoginInfo((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    const { email, password } = loginInfo;

    if (!email || !password) {
      setMessage("All fields are required");
      return;
    }

    try {
      const url = "http://localhost:3000/login";
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const result = await response.json();

      if (response.ok) {
        setMessage("Login successful! Redirecting...");
        // Since our backend doesn't provide a token yet, you can store user info
        localStorage.setItem("user", JSON.stringify(result.user));

        setTimeout(() => {
          setAuth(true); //Ye question hai mera : User ke login karte hi main apna setAuth true kar de raha hu but ye auto naivgate q nahi horaha , because ye setAuth ye app.jsx ka state aur a //Ye question hai mera : User ke login karte hi main apna setAuth true kar de raha hu but ye auto naivgate q nahi horaha , because ye setAuth ye app.jsx ka state aur app.jsx ka state agar change hota hai to poora app remount hona chahiye DOM mein , aur agar remount hua to ProtectedRoute(which is present in App.jsx) automatically main mainpage pe lekar chale jaana chahiye
          navigate("/");
          console.log("SetIsAuthentication is True");
        }, 1000);
      } else {
        setMessage(result.error || "Invalid credentials");
      }
    } catch (error) {
      console.error("Login error:", error);
      setMessage("An error occurred. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex">
      {/* Right Login Section */}
      <div className="w-1/2 flex items-center justify-center text-white">
        <div className="w-full max-w-md px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-extrabold mb-2">Log In</h1>
            <p className="text-gray-400">Welcome! to WorkersCOnnect</p>
          </div>
          {message && (
            <div className="mb-4 text-center text-red-500">{message}</div>
          )}
          <form onSubmit={onSubmitHandler} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm block">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                className="border w-full bg-[#0a0a0a] border-gray-700 p-2 rounded"
                value={loginInfo.email}
                onChange={onChangeHandler}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm block">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                className="border w-full bg-[#0a0a0a] border-gray-700 p-2 rounded"
                value={loginInfo.password}
                onChange={onChangeHandler}
              />
            </div>
            <button
              type="submit"
              className="w-full rounded-full bg-white text-black hover:bg-gray-100 p-2"
            >
              Submit
            </button>
          </form>
        </div>
      </div>
      {/* Left Image Section */}
      <div className="w-1/2 h-screen p-4">
        <div className="h-full w-full">
          <img
            src="https://images.unsplash.com/photo-1618436131908-beeb2b466f2b?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8Ymx1ZSUyMGNvbGxhciUyMHdvcmtlcnxlbnwwfHwwfHx8MA%3D%3D"
            className="w-full h-full object-cover rounded-3xl"
            alt="Blue-collar worker"
          />
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
