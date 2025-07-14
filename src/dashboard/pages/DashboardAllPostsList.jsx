import { collection, doc, getDocs } from 'firebase/firestore';
import React, { useEffect, useState } from 'react'
import { Button, Card, Row, Col, Table, Image } from 'react-bootstrap';
import { db } from '../../firebase';

const DashboardAllPostsList = () => {

    const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      const snapshot = await getDocs(collection(db, 'posts'));
      const postList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setPosts(postList);
    };

    fetchPosts();
  }, []);

  return (
    <div>
    <div>

        <div  >
        <h1>All Post</h1>
            
        <div>
        <h3>All Posts List</h3>
        <Table striped bordered hover responsive>
            <thead>
            <tr>
                <th>#</th>
                <th>Image</th>
                <th>Title</th>
                <th>Description</th>
                <th>Actions</th>
            </tr>
            </thead>
            <tbody>
                {posts.map(post => (
                <tr  key={post.id} >
                <td>index +</td>
                <td>
                    <Image src={""} thumbnail style={{ width: '80px', height: '80px', objectFit: 'cover' }} />
                </td>
                <td>{post.title}</td>
                <td>description</td>
                <td>
                    <Button
                    variant="warning"
                    size="sm"
                    className="me-2"
                    
                    >
                    Edit
                    </Button>
                    <Button
                    variant="danger"
                    size="sm"
                    
                    >
                    Delete
                    </Button>
                </td>
                </tr>
              ))}
            </tbody>
        </Table>
            EditCategory 
        </div>

        </div>
      
    </div>
    </div>
  )
}

export default DashboardAllPostsList