// PostDetails.js
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../firebase';
import { Container, Image, Alert } from 'react-bootstrap';

const DashboardPostDetails = () => {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPostBySlug = async () => {
      try {
        const q = query(collection(db, 'posts'), where('slug', '==', slug));
        const snapshot = await getDocs(q);
        if (!snapshot.empty) {
          const doc = snapshot.docs[0];
          setPost({ id: doc.id, ...doc.data() });
        } else {
          setError('Post not found');
        }
      } catch (err) {
        setError('Failed to load post');
      }
    };

    fetchPostBySlug();
  }, [slug]);

  if (error) return <Alert variant="danger">{error}</Alert>;
  if (!post) return <div>Loading...</div>;

  return (
    <Container className="mt-4">
      <h1>{post.title}</h1>
      <h4>{post.subtitle}</h4>
      <Image src={post.imageUrl} fluid className="mb-3" />
      <p><strong>Category:</strong> {post.categoryTitle}</p>
      <p><strong>Subcategory:</strong> {post.subcategoryTitle}</p>
      <p>{post.description}</p>
      <div dangerouslySetInnerHTML={{ __html: post.content || '' }}></div>
    </Container>
  );
};

export default DashboardPostDetails;