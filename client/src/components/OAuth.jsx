import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";
import { app } from "../firebase";
import { useDispatch } from "react-redux";
import { signInSuccess } from "../redux/user/userSlice";
import { useNavigate } from "react-router-dom";
import { Button } from "flowbite-react";
import { AiFillGoogleCircle } from "react-icons/ai";

export default function OAuth() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const handleGoogleClick = async () => {
    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({prompt: 'select_account'});
      const auth = getAuth(app);

      const resultsFromGoogle = await signInWithPopup(auth, provider);
      const res = await fetch("/api/auth/google", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: resultsFromGoogle.user.displayName,
          email: resultsFromGoogle.user.email,
          photo: resultsFromGoogle.user.photoURL,
        }),
      });
      const data = await res.json()
      if (res.ok){
        dispatch(signInSuccess(data));
        navigate("/");
      }
    } catch (error) {
      console.log("Could not sign in with Google", error);
    }
  };
  return (
    <Button
      onClick={handleGoogleClick}
      type="button"
      gradientDuoTone="pinkToOrange" 
      outline
      className="" 
    >
      <AiFillGoogleCircle className="w-6 h-6 mr-2"/> 
      Continue with google
    </Button>
  );
}
