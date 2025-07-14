import React, { useEffect, useState } from 'react'
import { Button, Card, Row, Col, Table, Image } from 'react-bootstrap';
import DashboardEditCategory from './DashboardEditOption';
import { collection, deleteDoc, doc, getDocs } from 'firebase/firestore';
import { db } from '../../firebase';
import DashboardEditOption from './DashboardEditOption';


const DashboardAllOption = () => {



    const [options, setOptions] = useState([]);
    const [editOptions, setEditOptions] = useState(null);

    const fetchOptions = async () => {
        const snapshot = await getDocs(collection(db, 'options'));
        setOptions(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };

    useEffect(() => {
        fetchOptions();
    }, []);

    const handleDelete = async (id) => {
        await deleteDoc(doc(db, 'options', id));
        fetchOptions();
    };

  return (
    <div>
    <div>

        <div >
            
        <h1>All Options</h1>

        <div>
        <h3>All Options</h3>
        <Row  > 
            {options.map(option => (
                <Col md={3} key={option.id} className="mb-3"  >
                   <Card style={{minHeight:'220px', maxHeight:'220px'}} >  
                   <Card.Body style={{margin:'2% -20%'}} > 
                        <Card.Title>{option.title}</Card.Title>
                        <Card.Text>
                            {/*catOption.description*/}
                            {/* {catOption.description.substring(0, 20)}... */}
                            {
                            option.description.length > 20
                                ? option.description
                                    .substring(0, option.description.lastIndexOf(' ', 20)) + '...'
                                : option.description
                            }
                        </Card.Text>
                        
                    </Card.Body>
                    <div className='d-flex' >
                        <Button variant="warning" size="sm" onClick={() => setEditOptions(option)}>Edit</Button>{' '}
                        &nbsp;&nbsp;&nbsp;
                        <Button variant="danger" size="sm" onClick={() => handleDelete(option.id)}>Delete</Button>
                    </div>
                    </Card>
                </Col>
            ))}
        </Row>
        {editOptions && (
            <DashboardEditOption
                option={editOptions} 
                onClose={() => { 
                    setEditOptions(null); 
                    fetchOptions(); 
                }} 
            />
        )}
        </div>

            
        <div>
        <h3>All Options</h3>
        <Table striped bordered hover responsive>
            <thead>
            <tr>
                <th>#</th>
                <th>Title</th>
                <th>Description</th>
                <th>Actions</th>
            </tr>
            </thead>
            <tbody>
            {options.map((option, index) => (
                <tr key={option.id}>
                <td>{index + 1}</td>
                <td>{option.title}</td>
                <td>
                    {/*catOption.description*/} {/*{catOption.description.substring(0, 20)}...*/}
                    {
                    option.description.length > 20
                        ? option.description
                            .substring(0, option.description.lastIndexOf(' ', 20)) + '...'
                        : option.description
                    }
                </td>
                <td>
                    <Button
                    variant="warning"
                    size="sm"
                    className="me-2"
                    onClick={() => setEditOptions(option)}
                    >
                    Edit
                    </Button>
                    <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDelete(option.id)}
                    >
                    Delete
                    </Button>
                </td>
                </tr>
            ))}
            </tbody>
        </Table>
        {editOptions && (
            <DashboardEditOption
                categoryOption={editOptions}
                onClose={() => {
                    setEditOptions(null);
                    fetchOptions();
                }}
            />
        )} 
        </div>

        </div>
      
    </div>
    </div>
  )
}

export default DashboardAllOption