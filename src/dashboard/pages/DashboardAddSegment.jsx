import React, { useEffect, useRef, useState } from 'react'
import { Form, Button, Alert } from 'react-bootstrap';
import { addDoc, collection, Timestamp } from 'firebase/firestore';
import { db } from '../../firebase';
import './DashboardAddSegment.css';


const DashboardAddSegment = () => {


    const [title, setTitle] = useState('');
    const [bangla, setBangla] = useState('');
    const [description, setDescription] = useState('');

    const [success, setSuccess] = useState('');

    


    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!title || !bangla) return;


        await addDoc(collection(db, 'segments'), {
        title,
        bangla,
        description,
        createdAt: Timestamp.now()
        });

        setSuccess('Segment added successfully!');
        setTitle('');
        setBangla('');
        setDescription('');
    };
    
  return (
    <div>
        <div >
        <h1>Add Segment</h1>

        <Form 
            onSubmit={handleSubmit}  
            >
        <h3>Create Segment</h3>
            {success && <Alert variant="success">{success}</Alert>}
            <Form.Group className="mb-3">
                <Form.Label>Title </Form.Label>
                <Form.Control
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder='Write Title'
                />
            </Form.Group>

            <Form.Group className="mb-3">
                <Form.Label>Content (Bangla Typing Enabled)</Form.Label>
                <Form.Control 
                    as="textarea" 
                    value={bangla} 
                    onChange={(e) => setBangla(e.target.value)} 
                    placeholder="শিরোনাম লিখুন"
                    className="bangla-font"
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
            
            <Button type="submit">Add Segment</Button>
        </Form>

        </div>
    </div>
  )
}

export default DashboardAddSegment