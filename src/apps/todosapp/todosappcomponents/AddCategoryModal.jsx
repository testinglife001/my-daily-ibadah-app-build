import React, { useState } from 'react';
import { Modal, Button, Form, Alert } from 'react-bootstrap';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { db } from '../../../firebase';

function AddCategoryModal({ show, onHide, user }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [success, setSuccess] = useState('');

  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!title || !user?.uid) return;

    await addDoc(collection(db, 'category-todos'), {
      title,
      description,
      createdAt: Timestamp.now(),
      createdBy: user.uid,
    });

    setSuccess('Category Type added successfully!');
    setTitle('');
    setDescription('');
    onHide();
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Add Category</Modal.Title>
        {success && <Alert variant="success">{success}</Alert>}
      </Modal.Header>
      <Form onSubmit={handleAddCategory}>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>Title</Form.Label>
            <Form.Control
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onHide}>Cancel</Button>
          <Button type="submit" variant="primary">Add</Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}

export default AddCategoryModal;
