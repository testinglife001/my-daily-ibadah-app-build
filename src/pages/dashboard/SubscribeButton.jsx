import React, { useEffect, useState } from "react";
import { doc, getDoc, setDoc, deleteDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../../firebase";
import { Button } from "react-bootstrap";

const SubscribeButton = ({ user, categoryName = null, authorId = null }) => {
  const [subscribed, setSubscribed] = useState(false);

  // Always define the ID and ref, even if not valid
  const subId = categoryName
    ? `category_${categoryName}`
    : authorId
    ? `author_${authorId}`
    : null;

  const subRef =
    user?.uid && subId
      ? doc(db, "users", user.uid, "subscriptions", subId)
      : null;

  useEffect(() => {
    const checkSub = async () => {
      if (!subRef) return;
      const snap = await getDoc(subRef);
      setSubscribed(snap.exists());
    };
    checkSub();
  }, [subRef]);

  const toggleSubscription = async () => {
    if (!subRef) return;
    try {
      if (subscribed) {
        await deleteDoc(subRef);
      } else {
        await setDoc(subRef, {
          type: categoryName ? "category" : "author",
          categoryName: categoryName || null,
          authorId: authorId || null,
          subscribedAt: serverTimestamp(),
        });
      }
      setSubscribed(!subscribed);
    } catch (error) {
      console.error("Error toggling subscription:", error);
    }
  };

  // ✅ Conditionally render only AFTER hooks
  if (!user?.uid || !subRef) return null;

  return (
    <Button
      variant={subscribed ? "danger" : "success"}
      onClick={toggleSubscription}
    >
      {subscribed ? "Unsubscribe" : "Subscribe"}
    </Button>
  );
};

export default SubscribeButton;
