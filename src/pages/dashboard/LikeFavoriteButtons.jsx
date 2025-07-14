// src/components/LikeFavoriteButtons.jsx
import React, { useEffect, useState } from "react";
import { doc, setDoc, deleteDoc, getDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../../firebase";
import { FaThumbsUp, FaRegThumbsUp, FaHeart, FaRegHeart } from "react-icons/fa";

export function LikeButton({ postId, user }) {
  const [liked, setLiked] = useState(false);
  const ref = doc(db, "blogposts", postId, "likes", user.uid);

  useEffect(() => {
    getDoc(ref).then((snap) => setLiked(snap.exists()));
  }, [postId, user.uid]);

  const toggle = async () => {
    try {
      liked
        ? await deleteDoc(ref)
        : await setDoc(ref, { userId: user.uid, likedAt: serverTimestamp() });
      setLiked(!liked);
    } catch (error) {
      console.error("Error toggling like:", error);
    }
  };

  return (
    <span
      onClick={toggle}
      style={{ cursor: "pointer", fontSize: "1.5rem", marginRight: "1rem" }}
      title={liked ? "Unlike" : "Like"}
    >
      {liked ? <FaThumbsUp color="green" /> : <FaRegThumbsUp color="gray" />}
    </span>
  );
}

export function FavoriteButton({ postId, user }) {
  const [fav, setFav] = useState(false);
  const ref = doc(db, "users", user.uid, "favorites", postId);

  useEffect(() => {
    getDoc(ref).then((snap) => setFav(snap.exists()));
  }, [postId, user.uid]);

  const toggle = async () => {
    try {
      fav
        ? await deleteDoc(ref)
        : await setDoc(ref, { postId, favoritedAt: serverTimestamp() });
      setFav(!fav);
    } catch (error) {
      console.error("Error toggling favorite:", error);
    }
  };

  return (
    <span
      onClick={toggle}
      style={{ cursor: "pointer", fontSize: "1.5rem" }}
      title={fav ? "Remove from favorites" : "Add to favorites"}
    >
      {fav ? <FaHeart color="red" /> : <FaRegHeart color="gray" />}
    </span>
  );
}
