import React, { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import { adminLogin, register, forgotPassword, resetPassword } from "../Action/action";
import Cookies from "js-cookie";
import config from "../coreFIles/config";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useFormik } from "formik";

const Login = () => {
  const [loading, setLoading] = useState(false);
  const [eyelogin, seteyelogin] = useState(true);
  const [mode, setMode] = useState("login"); 
  // login | register | forgot | reset

  const [resetEmail, setResetEmail] = useState("");

  const loginData = Cookies.get("Code_Maya_Assignment");

  useEffect(() => {
    if (loginData) {
      window.location.href = `${config.baseUrl}user-list`;
    }
  }, [loginData]);

  /* ================= LOGIN ================= */
  const loginFormik = useFormik({
    initialValues: { email: "", password: "" },
    validate: (v) => {
      const e = {};
      if (!v.email) e.email = "Email required";
      if (!v.password) e.password = "Password required";
      return e;
    },
    onSubmit: async (values) => {
      try {
        setLoading(true);
        const res = await adminLogin(values);
        if (res?.success) {
          toast.success(res.message || "Login successful");
          Cookies.set("Code_Maya_Assignment", JSON.stringify(res.data));
          window.location.href = `${config.baseUrl}user-list`;
        }
      } catch {
        toast.error("Invalid credentials");
      } finally {
        setLoading(false);
      }
    },
  });

  /* ================= REGISTER ================= */
  const registerFormik = useFormik({
    initialValues: { name: "", email: "", password: "" },
    validate: (v) => {
      const e = {};
      if (!v.name) e.name = "Name required";
      if (!v.email) e.email = "Email required";
      if (!v.password) e.password = "Password required";
      return e;
    },
    onSubmit: async (values) => {
      try {
        setLoading(true);
        const res = await register(values);
        if (res?.success) {
          toast.success("Registered successfully. Please login.");
          setMode("login");
          registerFormik.resetForm();
        }
      } catch {
        toast.error("Registration failed");
      } finally {
        setLoading(false);
      }
    },
  });

  /* ================= FORGOT PASSWORD ================= */
  const forgotFormik = useFormik({
    initialValues: { email: "" },
    validate: (v) => (!v.email ? { email: "Email required" } : {}),
    onSubmit: async (values) => {
      try {
        setLoading(true);
        const res = await forgotPassword(values);
        if (res?.success) {
          toast.success("OTP generated");
          toast.info(`Reset Token: ${res.resetToken}`); // visible (no email service)
          setResetEmail(values.email);
          setMode("reset");
        }
      } catch {
        toast.error("User not found");
      } finally {
        setLoading(false);
      }
    },
  });

  /* ================= RESET PASSWORD ================= */
  const resetFormik = useFormik({
    initialValues: { resetToken: "", newPassword: "" },
    validate: (v) => {
      const e = {};
      if (!v.resetToken) e.resetToken = "OTP required";
      if (!v.newPassword) e.newPassword = "Password required";
      return e;
    },
    onSubmit: async (values) => {
      try {
        setLoading(true);
        const payload = {
          email: resetEmail,
          resetToken: values.resetToken,
          newPassword: values.newPassword,
        };
        const res = await resetPassword(payload);
        if (res?.success) {
          toast.success("Password reset successfully");
          setMode("login");
        }
      } catch {
        toast.error("Invalid or expired token");
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <>
      <ToastContainer position="top-center" autoClose={2000} hideProgressBar />

      <div className="position-relative bg-img" style={{ height: "100vh" }}>
        <div className="mask"></div>
        <div className="container h-100 d-flex justify-content-center align-items-center">
          <div className="col-lg-5 col-md-6 col-12">
            <div className="shadow-lg admin-login p-4">

              <h2 className="text-white text-center text-capitalize">{mode}</h2>

              {/* LOGIN */}
              {mode === "login" && (
                <>
                  <form onSubmit={loginFormik.handleSubmit}>
                    <input className="form-control mb-2" placeholder="Email" {...loginFormik.getFieldProps("email")} />
                    <input type="password" className="form-control mb-2" placeholder="Password" {...loginFormik.getFieldProps("password")} />
                    <button className="btn btn-primary w-100" disabled={loading}>Login</button>
                  </form>
                  <div className="text-center mt-2">
                    <span className="text-info cursor-pointer" onClick={() => setMode("forgot")}>
                      Forgot Password?
                    </span>
                  </div>
                </>
              )}

              {/* REGISTER */}
              {mode === "register" && (
                <form onSubmit={registerFormik.handleSubmit}>
                  <input className="form-control mb-2" placeholder="Name" {...registerFormik.getFieldProps("name")} />
                  <input className="form-control mb-2" placeholder="Email" {...registerFormik.getFieldProps("email")} />
                  <input type="password" className="form-control mb-2" placeholder="Password" {...registerFormik.getFieldProps("password")} />
                  <button className="btn btn-success w-100" disabled={loading}>Register</button>
                </form>
              )}

              {/* FORGOT */}
              {mode === "forgot" && (
                <form onSubmit={forgotFormik.handleSubmit}>
                  <input className="form-control mb-2" placeholder="Enter Email" {...forgotFormik.getFieldProps("email")} />
                  <button className="btn btn-warning w-100" disabled={loading}>Generate OTP</button>
                </form>
              )}

              {/* RESET */}
              {mode === "reset" && (
                <form onSubmit={resetFormik.handleSubmit}>
                  <input className="form-control mb-2" placeholder="Reset Token (OTP)" {...resetFormik.getFieldProps("resetToken")} />
                  <input type="password" className="form-control mb-2" placeholder="New Password" {...resetFormik.getFieldProps("newPassword")} />
                  <button className="btn btn-success w-100" disabled={loading}>Reset Password</button>
                </form>
              )}

              {/* MODE SWITCH */}
              <div className="text-center mt-3">
                {mode !== "login" && (
                  <button className="btn btn-link text-black" onClick={() => setMode("login")}>
                    Back to Login
                  </button>
                )}
                {mode === "login" && (
                  <button className="btn btn-link text-black" onClick={() => setMode("register")}>
                    Create Account
                  </button>
                )}
              </div>

            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
