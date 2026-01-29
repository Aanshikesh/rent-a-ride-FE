import { useState } from "react";
import styles from "../../index";
import { Link, useNavigate } from "react-router-dom";
import OAuth from "../../components/OAuth";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

/* ========================= ZOD SCHEMA ========================= */
const schema = z.object({
  username: z.string().min(3, {
    message: "Minimum 3 characters required",
  }),
  email: z
    .string()
    .min(1, { message: "Email is required" })
    .email({ message: "Invalid email address" }),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters",
  }),
});

function SignUp() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  });

  const [isError, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setLoading] = useState(false);
  const navigate = useNavigate();

  /* ========================= SUBMIT HANDLER ========================= */
  const onSubmit = async (formData) => {
    setLoading(true);
    setError(false);
    setErrorMessage("");

    try {
      const BASE_URL = import.meta.env.VITE_PRODUCTION_BACKEND_URL || "";
      const res = await fetch(`${BASE_URL}/api/auth/signup`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      setLoading(false);

      if (!res.ok) {
        setError(true);
        setErrorMessage(data.message || "Registration failed");
        return;
      }

      navigate("/signin");
    } catch (error) {
      setLoading(false);
      setError(true);
      setErrorMessage("Network error. Please try again.");
    }
  };

  return (
    <div className="pb-10 max-w-lg mx-auto mt-16 rounded-lg overflow-hidden shadow-2xl">
      <div className="green px-6 py-2 rounded-t-lg flex justify-between items-center">
        <h1 className={`${styles.heading2} text-[28px]`}>Sign Up</h1>
        <Link to="/">
          <div className="px-3 font-bold hover:bg-green-300 rounded-md shadow-inner">
            x
          </div>
        </Link>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-5 pt-10 px-5"
      >
        {/* USERNAME */}
        <div>
          <input
            type="text"
            className="text-black bg-slate-100 p-3 rounded-md w-full"
            placeholder="Username"
            {...register("username")}
          />
          {errors.username && (
            <p className="text-red-500 text-[10px] pt-1">
              {errors.username.message}
            </p>
          )}
        </div>

        {/* EMAIL */}
        <div>
          <input
            type="email"
            className="text-black bg-slate-100 p-3 rounded-md w-full"
            placeholder="Email"
            {...register("email")}
          />
          {errors.email && (
            <p className="text-red-500 text-[10px] pt-1">
              {errors.email.message}
            </p>
          )}
        </div>

        {/* PASSWORD */}
        <div>
          <input
            type="password"
            className="text-black bg-slate-100 p-3 rounded-md w-full"
            placeholder="Password"
            {...register("password")}
          />
          {errors.password && (
            <p className="text-red-500 text-[10px] pt-1">
              {errors.password.message}
            </p>
          )}
        </div>

        {/* SUBMIT BUTTON */}
        <button
          className={`${styles.button} disabled:bg-slate-500 disabled:text-white`}
          disabled={isLoading}
        >
          {isLoading ? "Registering..." : "Register"}
        </button>

        <div className="flex flex-col gap-2">
          <p className="text-[10px]">
            Have an account?{" "}
            <Link to="/signin" className="text-blue-600">
              Sign in
            </Link>
          </p>
          {isError && (
            <p className="text-[10px] text-red-600 font-semibold">
              ❌ {errorMessage}
            </p>
          )}
        </div>
      </form>

      {/* SOCIAL LOGIN */}
      <div>
        <h3 className="text-center text-slate-700 pt-3 pb-3 text-[10px]">
          OR
        </h3>
        <div className="flex justify-center items-center gap-3 pb-6">
          <span className="bg-green-300 w-20 h-[1px]" />
          <span className="text-[10px] sm:text-[12px] text-slate-500">
            Continue with social login
          </span>
          <span className="bg-green-300 w-20 h-[1px]" />
        </div>

        <OAuth />
      </div>
    </div>
  );
}

export default SignUp;
