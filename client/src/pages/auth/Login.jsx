import React, { useState } from "react";
import { toast } from "react-toastify";
import useEcomStore from "../../store/ecom-store";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const actionLogin = useEcomStore((state) => state.actionLogin);
  const user = useEcomStore((state) => state.user);
  console.log("user form zustand", user);
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleOnChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await actionLogin(form);
      const role = res.data.payload.role;
      roleRedirect(role);
      toast.success("Welcome Back");
    } catch (err) {
      console.log(err);
      const errMsg = err.response?.data?.message;
      toast.error(errMsg);
    }
  };

  const roleRedirect = (role) => {
    if (role === "admin") {
      navigate("/admin");
    } else {
      navigate(-1);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 relative overflow-hidden">
      <div className="absolute inset-0 bg-tech-pattern"></div>
      <div className="relative w-full max-w-md p-8 bg-gray-800 bg-opacity-90 shadow-lg rounded-lg border border-blue-500">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="glow-effect"></div>
        </div>
        <h1 className="relative text-3xl text-center my-4 font-bold text-white">LOGIN</h1>
        <form onSubmit={handleSubmit} className="relative space-y-4">
          <div className="relative">
            <input
              placeholder="Email"
              className="w-full px-3 py-2 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              onChange={handleOnChange}
              name="email"
              type="email"
            />
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white">
              <i className="fas fa-user"></i>
            </span>
          </div>
          <div className="relative">
            <input
              placeholder="Password"
              className="w-full px-3 py-2 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              onChange={handleOnChange}
              name="password"
              type="password"
            />
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white">
              <i className="fas fa-lock"></i>
            </span>
          </div>
          <button
            className="w-full py-2 rounded bg-blue-500 text-white font-bold shadow-lg hover:bg-blue-700 transition-all"
          >
            Login
          </button>
        </form>
      </div>
      <style jsx>{`
        .bg-tech-pattern {
          background: linear-gradient(90deg, rgba(0, 255, 255, 0.2) 1px, transparent 1px),
                      linear-gradient(rgba(0, 255, 255, 0.2) 1px, transparent 1px),
                      linear-gradient(90deg, rgba(0, 255, 255, 0.1) 1px, transparent 1px),
                      linear-gradient(rgba(0, 255, 255, 0.1) 1px, transparent 1px);
          background-size: 50px 50px, 50px 50px, 10px 10px, 10px 10px;
          background-position: 0 0, 25px 25px, 0 0, 5px 5px;
          animation: neon-grid 2s linear infinite;
        }

        @keyframes neon-grid {
          0% {
            background-position: 0 0, 25px 25px, 0 0, 5px 5px;
          }
          100% {
            background-position: 50px 50px, 75px 75px, 10px 10px, 15px 15px;
          }
        }

        .glow-effect {
          width: 100%;
          height: 100%;
          border: 2px solid rgba(0, 255, 255, 0.5);
          border-radius: 10px;
          box-shadow: 0 0 20px rgba(0, 255, 255, 0.5), 0 0 40px rgba(0, 255, 255, 0.5), 0 0 60px rgba(0, 255, 255, 0.5);
          animation: glow 1.5s infinite alternate;
        }

        @keyframes glow {
          from {
            box-shadow: 0 0 20px rgba(0, 255, 255, 0.5), 0 0 40px rgba(0, 255, 255, 0.5), 0 0 60px rgba(0, 255, 255, 0.5);
          }
          to {
            box-shadow: 0 0 40px rgba(0, 255, 255, 0.8), 0 0 80px rgba(0, 255, 255, 0.8), 0 0 120px rgba(0, 255, 255, 0.8);
          }
        }
      `}</style>
    </div>
  );
};

export default Login;