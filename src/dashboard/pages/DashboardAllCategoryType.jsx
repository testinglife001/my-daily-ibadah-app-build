import React, { useEffect, useState } from 'react'
import { Button, Card, Row, Col, Table, Image } from 'react-bootstrap';
import DashboardEditCategoryType from './DashboardEditCategoryType';
import { collection, deleteDoc, doc, getDocs } from 'firebase/firestore';
import { db } from '../../firebase';


const DashboardAllCategoryType = () => {



    const [categoryTypes, setCategoryTypes] = useState([]);
    const [editCategoryTypes, setEditCategoryTypes] = useState(null);

    const fetchCategoryTypes = async () => {
        const snapshot = await getDocs(collection(db, 'category-types'));
        setCategoryTypes(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };

    useEffect(() => {
        fetchCategoryTypes();
    }, []);

    const handleDelete = async (id) => {
        await deleteDoc(doc(db, 'category-types', id));
        fetchCategoryTypes();
    };

  return (
    <div>
    <div>

        <div >
            
        <h1>All Category Types</h1>

        <div>
        <h3>All Categories Types</h3>
        <Row>
            {categoryTypes.map(catType => (
                <Col md={3} key={catType.id} className="mb-3">
                    <Card style={{minHeight:'200px'}} >
                    <Card.Body style={{margin:'-5% -10%'}} >
                        <Card.Title>{catType.title}</Card.Title>
                        <Card.Text>
                            {/*catOption.description*/}
                            {/* {catOption.description.substring(0, 20)}... */}
                            {
                            catType.description.length > 20
                                ? catType.description
                                    .substring(0, catType.description.lastIndexOf(' ', 20)) + '...'
                                : catType.description
                            }
                        </Card.Text>
                        
                    </Card.Body>
                    <div className='d-flex' >
                        <Button variant="warning" size="sm" onClick={() => setEditCategoryTypes(catType)}>Edit</Button>{' '}
                        &nbsp;&nbsp;&nbsp;
                        <Button variant="danger" size="sm" onClick={() => handleDelete(catType.id)}>Delete</Button>
                    </div>
                    </Card>
                </Col>
            ))}
        </Row>
        {editCategoryTypes && (
            <DashboardEditCategoryType
                categoryType={editCategoryTypes} 
                onClose={() => { 
                    setEditCategoryTypes(null); 
                    fetchCategoryTypes(); 
                }} 
            />
        )}
        </div>

            
        <div>
        <h3>All Category Types</h3>
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
            {categoryTypes.map((catType, index) => (
                <tr key={catType.id}>
                <td>{index + 1}</td>
                
                <td>{catType.title}</td>
                <td>
                    {/*catOption.description*/} {/*{catOption.description.substring(0, 20)}...*/}
                    {
                    catType.description.length > 20
                        ? catType.description
                            .substring(0, catType.description.lastIndexOf(' ', 20)) + '...'
                        : catType.description
                    }
                </td>
                <td>
                    <Button
                    variant="warning"
                    size="sm"
                    className="me-2"
                    onClick={() => setEditCategoryTypes(catType)}
                    >
                    Edit
                    </Button>
                    <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDelete(catType.id)}
                    >
                    Delete
                    </Button>
                </td>
                </tr>
            ))}
            </tbody>
        </Table>
        {editCategoryTypes && (
            <DashboardEditCategoryType
                categoryType={editCategoryTypes}
                onClose={() => {
                    setEditCategoryTypes(null);
                    fetchCategoryTypes();
                }}
            />
        )} 
        </div>

        </div>
      
    </div>
    </div>
  )
}

export default DashboardAllCategoryType