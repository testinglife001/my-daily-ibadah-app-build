import React, { useEffect, useState } from "react";
import { collection, getDocs, getDoc, doc } from "firebase/firestore";
import { db } from "../../firebase";

const MyFavorites = ({ user }) => {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const fetch = async () => {
      if (!user?.uid) return;
      const favRef = collection(db, "users", user.uid, "favorites");
      const snap = await getDocs(favRef);

      const postDocs = await Promise.all(
        snap.docs.map(d => getDoc(doc(db, "blogposts", d.id)))
      );

      const posts = postDocs
        .filter(p => p.exists())
        .map(p => ({ id: p.id, ...p.data() }));

      setFavorites(posts);
    };

    fetch();
  }, [user]);

  return (
    <div>
      <h4>Favorited Posts</h4>
      {favorites.length === 0 ? <p>No favorited posts yet.</p> :
        favorites.map(post => (
          <div key={post.id} className="mb-2 p-2 border rounded bg-light">
            <strong>{post.title}</strong>
          </div>
        ))
      }
    </div>
  );
};

export default MyFavorites;
