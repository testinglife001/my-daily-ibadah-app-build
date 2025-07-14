import React, { useState } from 'react'
import { Button, Card, Row, Col, Table, Image } from 'react-bootstrap';


const DashboardAllPostsView = () => {

    
  return (
    <div>
    <div>

        <div >
        <h1>All Post</h1>

        <div>
        <h3>All PostsView</h3>
        <Row>
            
            <Col md={4}  className="mb-3">
                <Card>
                <Card.Img variant="top" src={""} />
                <Card.Body>
                    <Card.Title>title</Card.Title>
                    <Card.Text>description</Card.Text>
                    <Button variant="warning" >Edit</Button>{' '}
                    <Button variant="danger" >Delete</Button>
                </Card.Body>
                </Card>
            </Col>
            
        </Row>
        
            EditCategory 
        </div>

        </div>
      
    </div>
    </div>
  )
}

export default DashboardAllPostsView