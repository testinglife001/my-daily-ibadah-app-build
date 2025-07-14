import React, { useState } from 'react'
import { Form, Button, Alert, Image } from 'react-bootstrap';
import { Image as RBImage } from 'react-bootstrap';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { addDoc, collection, Timestamp } from 'firebase/firestore';
import { db } from '../../firebase';


const DashboardAddCategoryType = () => {


    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');

    const [success, setSuccess] = useState('');



    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!title || !description) return;


        await addDoc(collection(db, 'category-types'), {
        title,
        description,
        createdAt: Timestamp.now()
        });

        setSuccess('Category Type added successfully!');
        setTitle('');
        setDescription('');
    };

    

  return (
    <div>
    <div>

        <div >
        <h1>Add Category Type</h1>

        <Form 
            onSubmit={handleSubmit}  
            >
        <h3>Create Category Type</h3>
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
                    required 
                />
            </Form.Group>

            {/* <Form.Group className="mb-3">
                <Form.Label>Image</Form.Label>
                <Form.Control type="file" onChange={(e) => setImage(e.target.files[0])} required /> 
            </Form.Group> */}
            <Button type="submit">Add Category Type</Button>
        </Form>

        </div>
      
    </div>
    </div>
  )
}

export default DashboardAddCategoryType