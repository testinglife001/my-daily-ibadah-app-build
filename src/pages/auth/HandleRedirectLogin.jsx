import React, { useEffect, useState } from "react";
import { getRedirectResult } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { auth } from "../../firebase";
import { saveUserToFirestore } from "../../utils/saveUserToFirestore";

const HandleRedirectLogin = () => {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    getRedirectResult(auth)
      .then(async (result) => {
        if (result?.user) {
          console.log("✅ Facebook Redirect Login:", result.user);
          await saveUserToFirestore(result.user);
        }
        navigate("/"); // always go home after redirect result (even if no user)
      })
      .catch((error) => {
        console.error("❌ Redirect Login Error:", error);
        navigate("/"); // optionally redirect even on error
      })
      .finally(() => setLoading(false));
  }, [navigate]);

  return (
    loading && (
      <div style={{ textAlign: "center", marginTop: "2rem" }}>
        <p>🔄 Logging you in via Facebook...</p>
      </div>
    )
  );
};

export default HandleRedirectLogin;
