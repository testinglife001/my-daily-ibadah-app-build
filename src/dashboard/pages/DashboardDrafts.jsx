import React, { useEffect, useState } from 'react';
import { collection, query, where, getDocs, orderBy, Timestamp } from 'firebase/firestore';
import { db } from '../../firebase';
import { Table, Container, Button, Spinner, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const DashboardDrafts = ({ user }) => {
  const [drafts, setDrafts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (!user?.uid) return;

    const fetchDrafts = async () => {
      setLoading(true);
      try {
        const q = query(
          collection(db, 'posts'),
          where('status', '==', 'draft'),
          where('userId', '==', user.uid),
          orderBy('updatedAt', 'desc')
        );
        const snapshot = await getDocs(q);
        const draftPosts = snapshot.docs.map(doc => ({
          id: doc.id,
          slug: doc.data().slug,
          title: doc.data().title,
          categoryTitle: doc.data().categoryTitle || '',
          updatedAt: doc.data().updatedAt?.toDate().toLocaleString() || '',
        }));
        setDrafts(draftPosts);
      } catch (err) {
        console.error('Error fetching drafts:', err);
        setError('Failed to load drafts.');
      } finally {
        setLoading(false);
      }
    };

    fetchDrafts();
  }, [user || user?.uid]);

  const handleEdit = (slug) => {
    navigate(`/dashboard/posts/edit/${slug}`);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this draft?')) {
      try {
        await deleteDoc(doc(db, 'posts', id));
        setDrafts(prev => prev.filter(post => post.id !== id));
      } catch (err) {
        console.error(err);
        setError('Delete failed');
      }
    }
  };

  if (loading) return <Spinner animation="border" className="mt-4" />;
  if (error) return <Alert variant="danger">{error}</Alert>;


  return (
    <Container className="my-4">
      <h3>📝 Your Drafts</h3>

      {drafts.length === 0 ? (
        <p className="text-muted">No drafts available.</p>
      ) : (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>Title</th>
              <th>Category</th>
              <th>Created</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {drafts.map((post) => (
              <tr key={post.id}>
                <td>{post.title || 'Untitled'}</td>
                <td>{post.categoryTitle || '-'}</td>
                <td>{post.createdAt instanceof Timestamp
                        ? post.createdAt.toDate().toLocaleDateString()
                        : new Date(post.createdAt).toLocaleDateString()}
                </td>
                <td><strong className="text-warning">{post.status}</strong></td>
                <td>
                  <Button variant="primary" size="sm" onClick={() => handleEdit(post.slug)}>
                    Edit
                  </Button>{' '}
                  <Button variant="danger" size="sm" onClick={() => handleDelete(post.id)}>
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </Container>
  );
};

export default DashboardDrafts;
