import React, { useState } from 'react'
import { Form, Button, Alert, Image } from 'react-bootstrap';
import { Image as RBImage } from 'react-bootstrap';
import { addDoc, collection, Timestamp } from 'firebase/firestore';
import { db } from '../../firebase';


const DashboardAddOption = () => {


    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [success, setSuccess] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!title) return;

        await addDoc(collection(db, 'options'), {
        title,
        description,
        createdAt: Timestamp.now()
        });

        setSuccess('Option added successfully!');
        setTitle('');
        setDescription('');
    };

    

  return (
    <div>
    <div>

        <div >
        <h1>Add Option</h1>

        <Form 
            onSubmit={handleSubmit}  
            >
        <h3>Create Option</h3>
            {success && <Alert variant="success">{success}</Alert>}
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
            <Button type="submit">Add Option</Button>
        </Form>

        </div>
      
    </div>
    </div>
  )
}

export default DashboardAddOption