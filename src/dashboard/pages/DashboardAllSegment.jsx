import React, { useEffect, useState } from 'react'
import { Button, Card, Row, Col, Table, Image } from 'react-bootstrap';
import DashboardEditSegment from './DashboardEditSegment';
import { collection, deleteDoc, doc, getDocs, orderBy, query } from 'firebase/firestore';
import { db } from '../../firebase';


const DashboardAllSegment = () => {

    const [segments, setSegments] = useState([]);
    const [editSegment, setEditSegment] = useState(null);

    const fetchSegments = async () => {
        const q = query(collection(db, 'segments'), orderBy('createdAt', 'asc'));
        const snapshot = await getDocs(q);
        // const snapshot = await getDocs(collection(db, 'segments'));
        setSegments(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };

    useEffect(() => {
        fetchSegments();
    }, []);

    const handleDelete = async (id) => {
        await deleteDoc(doc(db, 'segments', id));
        fetchSegments();
    };

  return (
    <div>
        <div >
                    
        <h1>All Segments</h1>

        <div>
        <h3>All Segments</h3>
        <Row>
            {segments.map(segment => (
                <Col md={3} key={segment.id} className="mb-3">
                    <Card style={{height:'250px'}} >
                    <Card.Body style={{margin:'-25% -20%'}} >
                        <Card.Title style={{margin:'2% 3%'}} >{segment.title}</Card.Title>
                        <Card.Header style={{margin:'5% 2%'}} ><div dangerouslySetInnerHTML={{ __html: segment.bangla }}></div></Card.Header>
                        <Card.Text>
                            {/*catOption.description*/}
                            {/* {catOption.description.substring(0, 20)}... */}
                            {
                            segment.description.length > 20
                                ? segment.description
                                    .substring(0, segment.description.lastIndexOf(' ', 20)) + '...'
                                : segment.description
                            }
                        </Card.Text>
                        
                    </Card.Body>
                    <div className='d-flex' >
                        <Button variant="warning" size="sm" onClick={() => setEditSegment(segment)}>Edit</Button>{' '}
                        &nbsp;&nbsp;&nbsp;
                        <Button variant="danger" size="sm" onClick={() => handleDelete(segment.id)}>Delete</Button>
                    </div>
                    </Card>
                </Col>
            ))}
        </Row>
 
        {editSegment && (
            <DashboardEditSegment
                segment={editSegment} 
                onClose={() => { 
                    setEditSegment(null); 
                    fetchSegments(); 
                }} 
            />
        )}
        
        </div>

            
        <div>
        <h3>All Segments</h3>
        <Table striped bordered hover responsive>
            <thead>
            <tr>
                <th>#</th>
                <th>Title</th>
                <th>Title (Bangla)</th>
                <th>Actions</th>
            </tr>
            </thead>
            <tbody>
            {segments.map((segment, index) => (
                <tr key={segment.id}>
                <td>{index + 1}</td>
                
                <td>{segment.title}</td>
                <td>
                    {/*catOption.description*/} {/*{catOption.description.substring(0, 20)}...*/}
                    {/*
                    segment.description.length > 20
                        ? segment.description
                            .substring(0, segment.description.lastIndexOf(' ', 20)) + '...'
                        : segment.description
                    */}
                    {segment.bangla}
                </td>
                <td>
                    <Button
                    variant="warning"
                    size="sm"
                    className="me-2"
                    onClick={() => setEditSegment(segment)}
                    >
                    Edit
                    </Button>
                    <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDelete(segment.id)}
                    >
                    Delete
                    </Button>
                </td>
                </tr>
            ))}
            </tbody>
        </Table>

        {editSegment && (
            <DashboardEditSegment
                segment={editSegment}
                onClose={() => {
                    setEditSegment(null);
                    fetchSegments();
                }}
            />
        )} 
        
        </div>

        </div>
    </div>
  )
}

export default DashboardAllSegment