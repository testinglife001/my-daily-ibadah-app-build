// src/components/AddNote.js
import { addDoc, collection, Timestamp } from 'firebase/firestore';
import React, { useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import { db } from '../../firebase';
// import ReactQuill from "react-quill";
// import "react-quill/dist/quill.snow.css";
import { Textarea } from 'react-bootstrap-icons';




const AddNote = () => {

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [listTitle, setListTitle] = useState("");
  const [content, setContent] = useState("");

  const handleAddNote = async () => {
    await addDoc(collection(db, "notes"), {
      title,
      category,
      listTitle,
      content,
      createdAt: Timestamp.now(),
    });

    setTitle(""); setCategory(""); setListTitle(""); setContent("");
  };


  
  return (
    <div>
      <h4 className="mb-3">Add New Note</h4>
        <Form>
          <Form.Group>
            <Form.Label>Title</Form.Label>
            <Form.Control value={title} onChange={e => setTitle(e.target.value)} />
          </Form.Group>
          <Form.Group className="mt-2">
            <Form.Label>Category</Form.Label>
            <Form.Control value={category} onChange={e => setCategory(e.target.value)} />
          </Form.Group>
          <Form.Group className="mt-2">
            <Form.Label>List Title</Form.Label>
            <Form.Control value={listTitle} onChange={e => setListTitle(e.target.value)} />
          </Form.Group>
          <Form.Group className="mt-3">
            <Form.Label>Content</Form.Label>
            {/*<ReactQuill theme="snow" value={content} onChange={setContent} />*/}
            <Textarea />
            <Form.Control value={content} onChange={e => setContent(e.target.value)} />
          </Form.Group>
        </Form>
        <Button onClick={handleAddNote}>Save Note</Button>
    </div>
  );
};

export default AddNote;
