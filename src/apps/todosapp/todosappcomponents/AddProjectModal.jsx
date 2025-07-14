import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { db } from '../../../firebase';

function AddProjectModal({ show, onHide, categories, user }) {
  const [projectName, setProjectName] = useState('');
  const [categoryId, setCategoryId] = useState('');

  const handleAddProject = async (e) => {
    e.preventDefault();
    if (!projectName.trim() || !categoryId || !user?.uid) return;

    await addDoc(collection(db, "projects"), {
      name: projectName.trim(),
      categoryId,
      createdAt: Timestamp.now(),
      createdBy: user.uid,
    });

    setProjectName('');
    setCategoryId('');
    onHide();
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Add Project</Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleAddProject}>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>Project Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter project name"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Category</Form.Label>
            <Form.Select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              required
            >
              <option value="">Select a category</option>
              {categories?.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.title}</option>
              ))}
            </Form.Select>
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

export default AddProjectModal;
