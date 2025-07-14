// src/components/Dashboard/MyBlogPosts.jsx
import React, { useEffect, useState } from "react";
import { collection, query, where, orderBy, onSnapshot, deleteDoc, doc } from "firebase/firestore";
import { db } from "../../firebase";
import { Button, Card, Modal } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const MyBlogPosts = ({ user }) => {
  const [myPosts, setMyPosts] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [postToDelete, setPostToDelete] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user?.uid) return;

    const q = query(
        collection(db, "blogposts"),
        where("userId", "==", user.uid)
    );

    const unsub = onSnapshot(q, (snapshot) => {
        setMyPosts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    return () => unsub();
  }, [user]);

  const handleDelete = async () => {
  if (!postToDelete?.id) return;

  try {
        await deleteDoc(doc(db, "blogposts", postToDelete.id));
        toast.success("Post deleted successfully!");
        setShowDeleteModal(false);
        setPostToDelete(null);
    } catch (error) {
        toast.error("Failed to delete post.");
        console.error("Delete error:", error);
    }
  };

  return (
    <div className="mt-3">
      <h4>My Blog Posts</h4>
      <div className="row">
        {myPosts.map(post => (
          <div className="col-md-6 mb-3" key={post.id}>
            <Card>
              {post.imgUrl && <Card.Img src={post.imgUrl} height="200" />}
              <Card.Body>
                <Card.Title>{post.title}</Card.Title>
                <Card.Text>{post.description?.slice(0, 100)}...</Card.Text>
                <div className="d-flex justify-content-between">
                  <Button variant="primary" onClick={() => navigate(`/edit-blog-post/${post.id}`)}>Edit</Button>
                  <Button
                    variant="danger"
                    onClick={() => { setPostToDelete(post); setShowDeleteModal(true); }}
                  >Delete</Button>
                </div>
              </Card.Body>
            </Card>
          </div>
        ))}
      </div>

      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton><Modal.Title>Delete Post</Modal.Title></Modal.Header>
        <Modal.Body>Are you sure you want to delete "{postToDelete?.title}"?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>Cancel</Button>
          <Button variant="danger" onClick={handleDelete}>Confirm Delete</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default MyBlogPosts;
