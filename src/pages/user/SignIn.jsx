import styles from "../../index";
import { Link, useNavigate } from "react-router-dom";
import {
  loadingEnd,
  signInFailure,
  signInStart,
  signInSuccess,
} from "../../redux/user/userSlice";
import { useDispatch, useSelector } from "react-redux";
import OAuth from "../../components/OAuth";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const schema = z.object({
  email: z
    .string()
    .min(1, { message: "email required" })
    .refine((value) => /\S+@\S+\.\S+/.test(value), {
      message: "Invalid email address",
    }),
  password: z.string().min(1, { message: "password required" }),
});

function SignIn() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(schema) });

  const { isLoading, isError } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // ✅ FIXED: remove `e`, react-hook-form already prevents default
  const onSubmit = async (formData) => {
    const BASE_URL = import.meta.env.VITE_PRODUCTION_BACKEND_URL;

    try {
      dispatch(signInStart());

      const res = await fetch(`${BASE_URL}/api/auth/signin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      // ✅ FIXED: handle failure FIRST and send STRING error
      if (!res.ok) {
        dispatch(signInFailure(data?.message || "Login failed"));
        dispatch(loadingEnd());
        return;
      }

      // token storage (unchanged behavior)
      if (data?.accessToken) {
        localStorage.removeItem("accessToken");
        localStorage.setItem("accessToken", data.accessToken);
      }
      if (data?.refreshToken) {
        localStorage.removeItem("refreshToken");
        localStorage.setItem("refreshToken", data.refreshToken);
      }

      // ✅ FIXED: success flow only once
      dispatch(signInSuccess(data));
      dispatch(loadingEnd());

      if (data.isAdmin) {
        navigate("/adminDashboard");
      } else {
        navigate("/");
      }
    } catch (error) {
      // ✅ FIXED: never dispatch raw error object
      dispatch(signInFailure("Something went wrong"));
      dispatch(loadingEnd());
    }
  };

  return (
    <>
      <div
        className={`max-w-[340px] pb-10 md:max-w-md min-h-[500px] mx-auto mt-[70px] md:mt-[80px] rounded-lg overflow-hidden  shadow-2xl`}
      >
        <div
          className={` green px-6 py-2   rounded-t-lg flex justify-between items-center`}
        >
          <h1 className={`${styles.heading2}  text-normal `}>Sign In</h1>
          <Link to={"/"} onClick={() => dispatch(loadingEnd())}>
            <div className=" px-3  font-bold  hover:bg-green-300 rounded-md  shadow-inner">
              x
            </div>
          </Link>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-5 pt-10 px-5"
        >
          <div>
            <input
              type="text"
              id="email"
              className="text-black bg-slate-100 p-3 rounded-md w-full"
              placeholder="Email"
              {...register("email")}
            />
            {errors.email && (
              <p className="text-red-500 text-[10px]">
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <input
              type="text"
              id="password"
              className="text-black bg-slate-100 p-3 rounded-md w-full"
              placeholder="Password"
              {...register("password")}
            />
            {errors.password && (
              <p className="text-red-500 text-[10px]">
                {errors.password.message}
              </p>
            )}
          </div>

          <button
            className={`${styles.button}  disabled:bg-slate-500 text-black disabled:text-white`}
            disabled={isLoading}
          >
            {isLoading ? "Loading ..." : "Login"}
          </button>

          <div className="flex justify-between">
            <div className="flex justify-between">
              <p className="text-[10px] border-r border-black">
                No account?{" "}
                <span className="text-blue-600 pr-2">
                  <Link to={`/signup`}>Sign Up</Link>
                </span>
              </p>
              <p className="text-[10px] pl-2 text-blue-600">
                forgot password
              </p>
            </div>

            {/* ✅ SAFE RENDER: string only */}
            <p className="text-[10px] text-red-600">
              {isError && (typeof isError === "string"
                ? isError
                : "something went wrong")}
            </p>
          </div>
        </form>

        <div>
          <h3 className="text-center text-slate-700 pt-3 pb-3 text-[10px]">
            OR
          </h3>
          <div className="flex justify-center items-center gap-3 pb-6">
            <span className="bg-green-300 w-20 h-[.1px]"></span>
            <span className="text-[10px] sm:text-[12px] text-slate-500">
              Continue with social login
            </span>
            <span className="bg-green-300 w-20 h-[.1px]"></span>
          </div>

          <OAuth />
        </div>
      </div>
    </>
  );
}

export default SignIn;
