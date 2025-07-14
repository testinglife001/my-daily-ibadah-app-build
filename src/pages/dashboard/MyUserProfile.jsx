//src/components/Dashboard/MyUserProfile.jsx
import React from "react";

const MyUserProfile = ({ user }) => (
  <div className="p-3 border rounded">
    <h4>{user?.displayName}</h4>
    <p><strong>Email:</strong> {user?.email}</p>
    {user?.photoURL && <img src={user?.photoURL} alt="Profile" height="100" />}
  </div>
);

export default MyUserProfile;
