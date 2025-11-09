import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../api/auth.api";
import { useNavigate } from "react-router-dom";
import { organization } from "../constant/organization";

import backgroundImage from "../assets/pexels-pixabay-40568.jpg";
import crystalImg from "../assets/Untitled.jpg";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoggedIn, loading } = useSelector((state) => state.auth);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isLoggedIn) {
      navigate("/dashboard");
    }
  }, [isLoggedIn, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
const res =await dispatch(loginUser({ username, password })).unwrap();

      console.log(res);
      
      // Redirect handled by useEffect when isLoggedIn changes
    } catch (err) {
      setError(err?.message || "Login failed. Try again!");
    }
  };

  return (
    <div
      className="w-screen h-screen bg-cover bg-center flex items-center justify-center p-4"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div className="w-full max-w-5xl bg-transparent rounded-3xl overflow-hidden shadow-2xl backdrop-blur-md bg-opacity-10">
        <div className="flex flex-col lg:flex-row">
          {/* Left Side - Image */}
          <div className="lg:w-1/2 flex items-center justify-center p-8">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="w-full h-64 lg:h-[500px] flex items-center justify-center"
            >
              <img
                src={crystalImg}
                alt="Medi Solution"
                className="object-cover w-full h-full rounded-2xl"
              />
            </motion.div>
          </div>

          {/* Right Side - Login Form */}
          <div className="lg:w-1/2 flex items-center justify-center p-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="w-full max-w-md"
            >
              <div className="text-center mb-8">
                <h1 className="text-3xl font-extrabold text-gray-900 mb-2">
                  {organization.name}
                </h1>
              </div>

              <form onSubmit={handleLogin}>
                {error && (
                  <p className="text-red-500 text-sm mb-4 text-center">{error}</p>
                )}

                {/* Username */}
                <div className="mb-6">
                  <label className="block text-gray-700 mb-3 font-medium">Username</label>
                  <div className="relative">
                    <FaEnvelope className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Enter your username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all bg-white"
                      required
                    />
                  </div>
                </div>

                {/* Password */}
                <div className="mb-8">
                  <label className="block text-gray-700 mb-3 font-medium">Password</label>
                  <div className="relative">
                    <FaLock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-12 pr-12 py-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all bg-white"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                </div>

                {/* Login Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full py-3 mb-4 rounded-lg font-semibold transition-all shadow-md ${
                    loading
                      ? "bg-gray-400 cursor-not-allowed text-white"
                      : "bg-[#3279a8] hover:bg-[#28648a] transform hover:scale-[1.02] text-white"
                  }`}
                >
                  {loading ? "Signing In..." : "Log in"}
                </button>
              </form>

              {/* Footer */}
              <div className="text-center">
                <p className="text-gray-600 text-sm pt-4 mb-2">Contact us: 9840670342</p>
                <div className="flex justify-center space-x-4 text-sm">
                  <p className="text-gray-600">© Medi Solution 2025</p>
                  <a href="#" className="text-gray-600 hover:text-gray-800 transition-colors">
                    Terms of Use
                  </a>
                  <a href="#" className="text-gray-600 hover:text-gray-800 transition-colors">
                    Privacy Policy
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
