import React, { useState } from 'react';
import { Container, ButtonGroup, Button, Card, Row, Col } from 'react-bootstrap';
import { List, Grid3x3 } from 'react-bootstrap-icons';
import './ViewToggleUI.css'; // Custom CSS


const dummyData = [
  { id: 1, title: 'Task One', description: 'Description of task one' },
  { id: 2, title: 'Task Two', description: 'Description of task two' },
  { id: 3, title: 'Task Three', description: 'Description of task three' },
];


const DashboardMain = () => {

  const [isGridView, setIsGridView] = useState(true);

  return (
    <div>
    <Container className="mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="fw-bold">My Tasks</h4>

        <ButtonGroup>
          <Button
            variant={isGridView ? 'outline-secondary' : 'primary'}
            onClick={() => setIsGridView(false)}
            className="view-toggle-btn"
          >
            <List size={20} />
          </Button>
          <Button
            variant={isGridView ? 'primary' : 'outline-secondary'}
            onClick={() => setIsGridView(true)}
            className="view-toggle-btn"
          >
            <Grid3x3 size={20} />
          </Button>
        </ButtonGroup>
      </div>

      {isGridView ? (
        <Row>
          {dummyData.map(item => (
            <Col md={4} key={item.id} className="mb-3">
              <Card className="custom-card">
                <Card.Body>
                  <Card.Title>{item.title}</Card.Title>
                  <Card.Text>{item.description}</Card.Text>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      ) : (
        <div>
          {dummyData.map(item => (
            <Card key={item.id} className="mb-3 custom-card">
              <Card.Body>
                <Card.Title>{item.title}</Card.Title>
                <Card.Text>{item.description}</Card.Text>
              </Card.Body>
            </Card>
          ))}
        </div>
      )}
    </Container>
    </div>
  )
}

export default DashboardMain