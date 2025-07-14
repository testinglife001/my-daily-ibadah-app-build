// src/components/FacebookRedirectLogin.js
import React from "react";
import { signInWithRedirect } from "firebase/auth";
import { auth, facebookProvider } from "../../firebase";

const FacebookRedirectLogin = () => {
  const loginWithFacebook = () => {
    signInWithRedirect(auth, facebookProvider);
  };

  return <button onClick={loginWithFacebook}>Login with Facebook</button>;
};

export default FacebookRedirectLogin;
