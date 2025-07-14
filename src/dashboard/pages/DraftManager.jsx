import React, { useEffect, useState } from 'react';
import { Container, Button, ListGroup, Row, Col, Spinner, Alert } from 'react-bootstrap';
import { collection, query, where, onSnapshot, doc, deleteDoc, orderBy } from 'firebase/firestore';
import { db } from '../../firebase';
import { useNavigate } from 'react-router-dom';

const DraftManager = ({ user }) => {
  const [drafts, setDrafts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (!user?.uid) {
      setDrafts([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError('');

    const q = query(
      collection(db, 'posts'),
      where('userId', '==', user.uid),
      where('status', '==', 'draft'),
      orderBy('updatedAt', 'desc')  // may require Firestore composite index
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const draftList = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        console.log('Loaded drafts:', draftList);
        setDrafts(draftList);
        setLoading(false);
      },
      (err) => {
        console.error('Error fetching drafts:', err);
        setError('Failed to fetch drafts: ' + err.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user]);

  console.log(drafts);

  const handleEdit = (draftId) => navigate(`/dashboard/add-post/${draftId}`);

  const handleDelete = async (draftId) => {
    if (!window.confirm('Delete this draft?')) return;
    try {
      await deleteDoc(doc(db, 'posts', draftId));
    } catch (err) {
      alert('Delete failed: ' + err.message);
    }
  };

  const handleNewDraft = () => navigate('/dashboard/add-post');

  return (
    <Container className="my-4">
      <Row className="mb-3">
        <Col><h2>Your Drafts</h2></Col>
        <Col className="text-end">
          <Button variant="primary" onClick={handleNewDraft}>+ New Draft</Button>
        </Col>
      </Row>

      {loading && (
        <div className="text-center">
          <Spinner animation="border" />
        </div>
      )}

      {error && <Alert variant="danger">{error}</Alert>}

      {!loading && drafts.length === 0 && (
        <Alert variant="info">No drafts found.</Alert>
      )}

      <ListGroup>
        {drafts.map(draft => (
          <ListGroup.Item key={draft.id} className="d-flex justify-content-between align-items-center">
            <div onClick={() => handleEdit(draft.id)} style={{ cursor: 'pointer', flex: 1 }}>
              <strong>{draft.title || '(Untitled Draft)'}</strong><br />
              <small className="text-muted">
                Last updated:{' '}
                {draft.updatedAt?.toDate
                  ? draft.updatedAt.toDate().toLocaleString()
                  : 'N/A'}
              </small>
            </div>
            <Button variant="danger" size="sm" onClick={() => handleDelete(draft.id)}>
              Delete
            </Button>
          </ListGroup.Item>
        ))}
      </ListGroup>
    </Container>
  );
};

export default DraftManager;
