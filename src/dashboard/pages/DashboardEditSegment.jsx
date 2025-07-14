import { collection, doc, getDocs, updateDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { Modal, Button, Form, Card, Col, Alert, Image } from 'react-bootstrap';
import { db } from '../../firebase';
// import { Form, Button, Alert, Image } from 'react-bootstrap';



const DashboardEditSegment = ({segment,onClose}) => {

  const [segments, setSegments] = useState([]);

  const [title, setTitle] = useState(segment.title);
  const [bangla, setBangla] = useState(segment.bangla);
  const [description, setDescription] = useState(segment.description);


  const fetchSegments = async () => {
      const snapshot = await getDocs(collection(db, 'segments'));
      setSegments(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  };

  useEffect(() => {
      fetchSegments();
  }, []);

  const handleUpdate = async (e) => {
    e.preventDefault();
    const docRef = doc(db, 'segments', segment.id);
    let updateData = { title, bangla, description };


    await updateDoc(docRef, updateData);
    onClose();
  };

  return (
    <div>
    <Modal show onHide={onClose} style={{height:'100%',bottom:'0', marginBottom:'0px'}}>
      <Modal.Header closeButton><Modal.Title>Edit Segment</Modal.Title></Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleUpdate}>
          <Form.Group className="mb-3">
            <Form.Label>Title</Form.Label>
            <Form.Control value={title} onChange={(e) => setTitle(e.target.value)} required />
          </Form.Group>
          <Form.Group className="mb-3">
              <Form.Label>Content (Bangla Typing Enabled)</Form.Label>
              <Form.Control 
                  as="textarea" 
                  value={bangla} 
                  onChange={(e) => setBangla(e.target.value)} 
                  required 
              />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Description</Form.Label>
            <Form.Control as="textarea" value={description} onChange={(e) => setDescription(e.target.value)} required />
          </Form.Group>
          
          
          <Button type="submit">Update</Button>
        </Form>
      </Modal.Body>
    </Modal>
    </div>
  )
}

export default DashboardEditSegment