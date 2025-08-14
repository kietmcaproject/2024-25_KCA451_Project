import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Slide, ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
function SignUpAndLogin() {
  const navigate = useNavigate();
  const [visible, setVisible] = useState(true);
  const [userData, setUserData] = useState({
    name: "",
    password: "",
    email: "",
  });
  const handleLogin = async (e) => {
    e.preventDefault();

    console.log(userData.email, userData.password);

    if (!userData.email || !userData.password) {
      toast.error("All fields are required", { autoClose: 1000 });
      return;
    }
    console.log(userData);
    
    try {
      const resp = await axios.post(
        "http://localhost:2024/api/auth/login",
        userData,
        { withCredentials: true }
      );

      console.log("response", resp);
      console.log("data", userData);
      toast.success("Logged in successfully", { autoClose: 1000 });
      setUserData({
        name: "",
        password: "",
        email: "",
      });

      setTimeout(() => {
        navigate("Navbar");
      }, 2000);
    } catch (error) {
      
      toast.error("Failed to login", { autoClose: 1000 });
      console.log("failed",error);
    }
  };
  const handleSignUp = async (e) => {
    e.preventDefault();
    if (!userData.name || !userData.email || !userData.password) {
      toast.error("All fields are required", { autoClose: 1000 });
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(userData.email)) {
      toast.error("Please enter a valid email address", { autoClose: 1000 });
      return;
    }
    try {
      const resp = await axios.post(
        "http://localhost:2024/api/auth/signup",
        userData
      );
      

      console.log("response", resp);
      toast.success("Account created successfully", { autoClose: 1000 });
      setUserData({
        name: "",
        password: "",
        email: "",
      });

      setTimeout(() => {
        navigate("verifyEmailPage");
      }, 3000);
    } catch (error) {
      console.log("error", error);
      toast.error(error.response.data.message, { autoClose: 1000 });
    }
  };
  const handleInput = (e) => {
    const { name, value } = e.target;
    setUserData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  return (
    <div>
      <ToastContainer position="top-right" transition={Slide} />
      {visible === true ? (
        <div>
          <div class=" z-30">
            <section class="rounded-md bg-transparent">
              <div class="flex items-center justify-center p-2 ">
                <div class="xl:mx-auto  py-2 xl:w-full xl:max-w-sm 2xl:max-w-md">
                  <div class=""></div>
                  <h2 class="text-2xl font-bold leading-tight  bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">
                    Sign up to create account
                  </h2>
                  <p class="mt-2 text-base text-gray-700">
                    Already have an account?{" "}
                    <span
                      onClick={() => setVisible(false)}
                      className="text-blue-900 cursor-pointer font-bold"
                    >
                      {" "}
                      Sign In
                    </span>
                  </p>
                  <form class="mt-2">
                    <div class="space-y-4">
                      <div>
                        <label class="text-base font-medium text-gray-900">
                          User Name
                        </label>
                        <div class="">
                          <input
                            placeholder="Full Name"
                            type="text"
                            onChange={handleInput}
                            value={userData.name}
                            class="flex h-10 w-full rounded-md border border-gray-400 bg-transparent px-3 py-2 text-sm placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-300 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
                            name="name"
                          />
                        </div>
                      </div>
                      <div>
                        <label class="text-base font-medium text-gray-900">
                          Email address
                        </label>
                        <div class="">
                          <input
                            placeholder="Email"
                            type="email"
                            onChange={handleInput}
                            value={userData.email}
                            class="flex h-10 w-full rounded-md border border-gray-400 bg-transparent px-3 py-2 text-sm placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-300 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
                            name="email"
                          />
                        </div>
                      </div>
                      <div>
                        <div class="flex items-center justify-between">
                          <label class="text-base font-medium text-gray-900">
                            Password
                          </label>
                        </div>
                        <div class="">
                          <input
                            autoComplete="current-password"
                            placeholder="Password"
                            type="current-password"
                            onChange={handleInput}
                            value={userData.password}
                            class="flex h-10 w-full rounded-md border border-gray-400 bg-transparent px-3 py-2 text-sm placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-300 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
                            name="password"
                          />
                        </div>
                      </div>
                      <p class="mt-2 text-base text-gray-700">
                        verify your email{" "}
                        <span
                          onClick={() => navigate("verifyEmailPage")}
                          className="text-blue-900 cursor-pointer font-bold"
                        >
                          {" "}
                          Click here
                        </span>
                      </p>
                      <div>
                        <button
                          onClick={handleSignUp}
                          class=" z-20 inline-flex w-full items-center justify-center rounded-md bg-black px-3.5 py-2.5 font-semibold leading-7 text-white hover:bg-black/80   bg-gradient-to-br from-yellow-200 via-orange-600 to-purple-800"
                          type="submit"
                        >
                          Create Account
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </section>
          </div>
        </div>
      ) : (
        <div>
          <div class=" z-30 mt-10">
            <section class="rounded-md bg-transparent">
              <div class="flex items-center justify-center p-2 ">
                <div class="xl:mx-auto  py-2 xl:w-full xl:max-w-sm 2xl:max-w-md">
                  <div class="mb-2"></div>
                  <h2 class="text-2xl font-bold leading-tight  bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">
                    Login to Your account
                  </h2>
                  <p class="mt-2 text-base text-gray-700">
                    Don't have an account?{" "}
                    <span
                      onClick={() => setVisible(true)}
                      className="text-blue-900 font-bold cursor-pointer"
                    >
                      {" "}
                      Sign Up
                    </span>
                  </p>
                  <form class="mt-5">
                    <div class="space-y-4">
                      <div>
                        <label class="text-base font-medium text-gray-900">
                          Email address
                        </label>
                        <div class="mt-2">
                          <input
                            placeholder="Email"
                            type="email"
                            onChange={handleInput}
                            class="flex h-10 w-full rounded-md border border-gray-400 bg-transparent px-3 py-2 text-sm placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-300 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
                            name="email"
                          />
                        </div>
                      </div>
                      <div>
                        <div class="flex items-center justify-between">
                          <label class="text-base font-medium text-gray-900">
                            Password
                          </label>
                        </div>
                        <div class="mt-2">
                          <input
                            autocomplete="current-password"
                            placeholder="Password"
                            type="password"
                            onChange={handleInput}
                            class="flex h-10 w-full rounded-md border border-gray-400 bg-transparent px-3 py-2 text-sm placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-300 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
                            name="password"
                          />
                        </div>
                      </div>
                      <div>
                        <h2 className="text-zinc-700">
                          Forgot Password ?{" "}
                          <span className=" font-bold text-blue-900 cursor-pointer">
                            click here
                          </span>
                        </h2>
                        <button
                          onClick={handleLogin}
                          class=" inline-flex mt-2  w-full items-center justify-center rounded-md bg-black px-3.5 py-2.5 font-semibold leading-7 text-white hover:bg-black/80   bg-gradient-to-br from-yellow-200 via-orange-600 to-purple-800"
                          type="submit"
                        >
                          Sign In
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </section>
          </div>
        </div>
      )}
    </div>
  );
}

export default SignUpAndLogin;
