import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { db } from '../../firebase';
import { collection, query, where, getDocs, deleteDoc, doc } from 'firebase/firestore';
// import { useAuth } from '../../auth'; // Your custom hook/context for auth
import { Container, Spinner, Alert, Badge, Card, Button, Breadcrumb } from 'react-bootstrap';
import parseEditorJS from './parseEditorJS.jsx';
// import parseEditorJS from '../../utils/parseEditorJS'; // Utility to parse EditorJS blocks (defined below)

const DashboardPostDetailUI = () => {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [docId, setDocId] = useState('');
  const [loading, setLoading] = useState(true);
  // const { currentUser, role } = useAuth(); // You need to implement this hook/context
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const q = query(collection(db, 'posts'), where('slug', '==', slug));
        const snapshot = await getDocs(q);
        if (!snapshot.empty) {
          setDocId(snapshot.docs[0].id);
          setPost(snapshot.docs[0].data());
        }
      } catch (err) {
        console.error('Error fetching post:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [slug]);

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        await deleteDoc(doc(db, 'posts', docId));
        navigate('/dashboard/posts');
      } catch (err) {
        alert('Failed to delete post');
      }
    }
  };

  if (loading) return <Spinner animation="border" />;
  if (!post) return <Alert variant="danger">Post not found</Alert>;

  // const isAdminOrAuthor = currentUser && (role === 'admin' || post.authorId === currentUser.uid);

  return (
    <Container className="mt-4">
      {/* Breadcrumb / Back */}
      <Breadcrumb>
        <Breadcrumb.Item as={Link} to="/dashboard">Dashboard</Breadcrumb.Item>
        <Breadcrumb.Item as={Link} to="/dashboard/posts">Posts</Breadcrumb.Item>
        <Breadcrumb.Item active>{post.title}</Breadcrumb.Item>
      </Breadcrumb>

      <h2>{post.title}</h2>
      <p className="text-muted">{post.subtitle}</p>

      <div className="mb-2">
        <Badge bg="info" className="me-1">{post.categoryTitle}</Badge>
        {post.subcategoryTitle && <Badge bg="secondary">{post.subcategoryTitle}</Badge>}
        <span className="ms-2 text-muted">
          <span className="ms-2 text-muted">
            {post.createdAt
              ? (post.createdAt.toDate?.() || new Date(post.createdAt)).toLocaleDateString()
              : "No Date"}
          </span>          
          - {post.status}
        </span>
      </div>

      <div className="mb-3">
        {post.tags?.map(tag => (
          <Badge bg="light" text="dark" key={tag} className="me-1">{tag}</Badge>
        ))}
      </div>

      {post.imageUrl && (
        <Card className="mb-3">
          <Card.Img variant="top" src={post.imageUrl} />
        </Card>
      )}

      {/* EditorJS or Tiptap Content Rendering */}
      <div className="post-body">
        {post.description?.blocks
          ? parseEditorJS(post.description.blocks)
          : <div dangerouslySetInnerHTML={{ __html: post.description }} />}
      </div>

      {/* Edit/Delete Buttons */}
      {
        /*isAdminOrAuthor && ( */
        <div className="mt-4 d-flex gap-2">
          <Link to={`/dashboard/posts/edit/${docId}`}>
            <Button variant="warning">Edit</Button>
          </Link>
          <Button variant="danger" onClick={handleDelete}>Delete</Button>
        </div>
       /*)*/
      }
    </Container>
  );
};

export default DashboardPostDetailUI;
