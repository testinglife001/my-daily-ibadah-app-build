import React, { useEffect, useState } from 'react';


import { Card, Row, Col } from 'react-bootstrap';


const DisplayNotes = () => {
  const [notes, setNotes] = useState([]);



  return (
    <Row xs={1} md={2} lg={3} className="g-4">
  
        <Col >
          <Card>
            <Card.Body>
              <Card.Title>note.title</Card.Title>
              <Card.Subtitle className="mb-2 text-muted">
                note.category / note.listTitle
              </Card.Subtitle>
              dangerouslySetInnerHTML __html: note.content 
            </Card.Body>
          </Card>
        </Col>
    </Row>
  );
};

export default DisplayNotes;
