import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";

export const sendNotification = async ({
  toUserId,
  fromUserId,
  fromUserName,
  postId,
  type,
  message,
}) => {
  if (toUserId === fromUserId) return; // avoid self-notification

  try {
    await addDoc(collection(db, "notifications"), {
      userId: toUserId,
      fromUserId,
      fromUserName,
      postId,
      type,
      message,
      timestamp: serverTimestamp(),
      read: false,
    });
  } catch (err) {
    console.error("Notification Error:", err);
  }
};
