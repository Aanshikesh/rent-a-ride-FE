import {
  GoogleAuthProvider,
  signInWithPopup,
  getAuth,
} from "@firebase/auth";
import { app } from "../firebase";
import {
  signInFailure,
  signInSuccess,
  signInStart,
  loadingEnd,
} from "../redux/user/userSlice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

function OAuth() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleGoogleClick = async () => {
    const BASE_URL = (import.meta.env.VITE_PRODUCTION_BACKEND_URL || "").replace(/\/$/, "");

    try {
      dispatch(signInStart());

      const provider = new GoogleAuthProvider();
      const auth = getAuth(app);

      const result = await signInWithPopup(auth, provider);

      const res = await fetch(`${BASE_URL}/api/auth/google`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: result.user.displayName,
          email: result.user.email,
          photo: result.user.photoURL,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        // ✅ DISPATCH STRING ONLY
        dispatch(signInFailure(data?.message || "Google sign-in failed"));
        dispatch(loadingEnd());
        return;
      }

      dispatch(signInSuccess(data));
      dispatch(loadingEnd());
      navigate("/");
    } catch (error) {
      dispatch(signInFailure("Could not login with Google"));
      dispatch(loadingEnd());
    }
  };

  return (
    <div className="px-5">
      <button
        className="flex w-full gap-3 justify-center border py-3 rounded-md items-center border-black mb-4"
        type="button"
        onClick={handleGoogleClick}
      >
        <span className="icon-[devicon--google]"></span>
        <span>Continue with Google</span>
      </button>

      <button
        className="flex w-full gap-3 justify-center pl-4 border py-3 rounded-md items-center border-black"
        type="button"
        disabled
      >
        <span className="icon-[logos--facebook]"></span>
        <span>Continue with Facebook</span>
      </button>
    </div>
  );
}

export default OAuth;
