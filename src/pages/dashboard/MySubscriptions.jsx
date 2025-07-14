import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase";

const MySubscriptions = ({ user }) => {
  const [subs, setSubs] = useState([]);

  useEffect(() => {
    const fetch = async () => {
      if (!user?.uid) return;
      const subRef = collection(db, "users", user.uid, "subscriptions");
      const snap = await getDocs(subRef);

      const allSubs = snap.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          type: data.type,
          categoryName: data.categoryName || null,
          authorId: data.authorId || null,
        };
      });

      setSubs(allSubs);
    };

    fetch();
  }, [user]);

  return (
    <div>
      <h4>My Subscriptions</h4>
      <ul>
        {subs.length === 0 ? (
          <li>No subscriptions found</li>
        ) : (
          subs.map((sub, i) => (
            <li key={i}>
              {sub.type === "category"
                ? `📁 Category: ${sub.categoryName}`
                : `👤 Author ID: ${sub.authorId}`}
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default MySubscriptions;
