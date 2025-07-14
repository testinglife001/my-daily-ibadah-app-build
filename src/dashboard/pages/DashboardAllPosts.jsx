import { collection, getDocs } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { Card, Container, Row, Col, Button } from 'react-bootstrap';

import { Link } from 'react-router-dom';
import { db } from '../../firebase';

const DashboardAllPosts = () => {

  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      const snapshot = await getDocs(collection(db, 'posts'));
      const postList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setPosts(postList);
    };

    fetchPosts();
  }, []);

  return (
    <div>
      <Container className="mt-4">
      <Row>
        {posts.map(post => (
          <Col md={4} key={post.id} className="mb-4">
            <Card>
              <Card.Img variant="top" src={post.imageUrl} />
              <Card.Body>
                <Card.Title>{post.title}</Card.Title>
                <Card.Text>{post.subtitle}</Card.Text>
                <Link to={`/posts/${post.slug}`} className="btn btn-primary">Read More</Link>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
    </div>
  )
}

export default DashboardAllPosts