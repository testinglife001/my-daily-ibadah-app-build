import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { db } from '../../firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { Container, Spinner, Alert, Badge, Card } from 'react-bootstrap';

const DashboardPostsDetail = () => {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const q = query(collection(db, 'posts'), where('slug', '==', slug));
        const snapshot = await getDocs(q);
        if (!snapshot.empty) {
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

  if (loading) return <Spinner animation="border" />;
  if (!post) return <Alert variant="danger">Post not found</Alert>;

  return (
    <Container className="mt-4">
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
        </span>
      </div>
      {post.tags?.map(tag => (
        <Badge bg="light" text="dark" key={tag} className="me-1">{tag}</Badge>
      ))}

      <Card className="mt-3">
        <Card.Img variant="top" src={post.imageUrl} />
        <Card.Body>
          <div dangerouslySetInnerHTML={{ __html: post.description }} />
        </Card.Body>
      </Card>
    </Container>
  );
};

export default DashboardPostsDetail;



/*
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { db } from '../../firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { Container, Row, Col, Card, Badge, Image, Spinner, Alert } from 'react-bootstrap';

const DashboardPostsDetail = () => {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const q = query(collection(db, 'posts'), where('slug', '==', slug));
        const snapshot = await getDocs(q);
        if (!snapshot.empty) {
          setPost(snapshot.docs[0].data());
        } else {
          setError('Post not found.');
        }
      } catch (err) {
        setError('Failed to load post.');
        console.error(err);
      }
      setLoading(false);
    };

    fetchPost();
  }, [slug]);

  if (loading) return <div className="text-center my-5"><Spinner animation="border" /></div>;
  if (error) return <Alert variant="danger">{error}</Alert>;

  return (
    <Container className="my-4">
      <Card className="shadow-sm">
        <Card.Header>
          <h3>{post.title}</h3>
          <h6 className="text-muted">{post.subtitle}</h6>
          <Badge bg="info" className="me-2">{post.categoryTitle}</Badge>
          {post.subcategoryTitle && <Badge bg="secondary">{post.subcategoryTitle}</Badge>}
        </Card.Header>
        <Card.Body>
          <Image src={post.imageUrl} alt={post.title} fluid  className="mb-4" />

          <p><strong>Description:</strong> {post.description}</p>
          <hr />
          <div>
            <h5>Post Content:</h5>
            <div dangerouslySetInnerHTML={{ __html: post.content }} />
          </div>
          <hr />
          <div>
            <h6>Tags:</h6>
            {post.tags?.map((tag, index) => (
              <Badge key={index} bg="dark" className="me-1">{tag}</Badge>
            ))}
          </div>
          <div className="mt-2">
            <h6>Hashtags:</h6>
            {post.hashtags?.map((tag, index) => (
              <Badge key={index} bg="primary" className="me-1">{tag}</Badge>
            ))}
          </div>
        </Card.Body>
        <Card.Footer className="text-muted">
          Status: {post.status} | Created: {post.createdAt?.toDate().toLocaleString()}
        </Card.Footer>
      </Card>
    </Container>
  );
};

export default DashboardPostsDetail;
*/


