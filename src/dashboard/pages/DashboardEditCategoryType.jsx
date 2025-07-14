import React, { useEffect, useState } from 'react';
import { Modal, Button, Form, Card, Col, Alert, Image } from 'react-bootstrap';
// import { Form, Button, Alert, Image } from 'react-bootstrap';
import { Image as RBImage } from 'react-bootstrap';
import { db, storage } from '../../firebase';
import { collection, doc, getDocs, updateDoc } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';


const DashboardEditCategoryType = ({ categoryType, onClose }) => {

  const [categoryTypes, setCategoryTypes] = useState([]);

  const [title, setTitle] = useState(categoryType.title);
  const [description, setDescription] = useState(categoryType.description);


  const fetchCategoryTypes = async () => {
      const snapshot = await getDocs(collection(db, 'category-types'));
      setCategoryTypes(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  };

  useEffect(() => {
      fetchCategoryTypes();
  }, []);

  const handleUpdate = async (e) => {
    e.preventDefault();
    const docRef = doc(db, 'category-types', categoryType.id);
    let updateData = { title, description };


    await updateDoc(docRef, updateData);
    onClose();
  };

  return (
    <Modal show onHide={onClose} style={{height:'100%',bottom:'0', marginBottom:'0px'}}>
      <Modal.Header closeButton><Modal.Title>Edit Category Type</Modal.Title></Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleUpdate}>
          <Form.Group className="mb-3">
            <Form.Label>Title</Form.Label>
            <Form.Control value={title} onChange={(e) => setTitle(e.target.value)} required />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Description</Form.Label>
            <Form.Control as="textarea" value={description} onChange={(e) => setDescription(e.target.value)} required />
          </Form.Group>
          
          
          <Button type="submit">Update</Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default DashboardEditCategoryType;
