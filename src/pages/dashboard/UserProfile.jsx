import React from "react";
import { Card } from "react-bootstrap";

const UserProfile = ({ user }) => {
  return (
    <Card>
      <Card.Body>
        <h4>{user?.displayName}</h4>
        <p><strong>Email:</strong> {user?.email}</p>
        <p><strong>UID:</strong> {user?.uid}</p>
        <p><strong>Photo:</strong></p>
        {user?.photoURL && <img src={user?.photoURL} height="100" alt="User" />}
      </Card.Body>
    </Card>
  );
};

export default UserProfile;
