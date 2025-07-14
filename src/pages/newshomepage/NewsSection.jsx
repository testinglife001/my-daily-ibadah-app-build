import React, { useState } from 'react';
import { Card, Row, Col, ListGroup, ButtonGroup, Button } from 'react-bootstrap';

const mockNews = [
  { title: 'Election Results 2025', summary: 'Major upset in key states...', category: 'politics', image: '/images/news1.jpg' },
  { title: 'Tech IPOs Soar', summary: 'Startups raise billions...', category: 'latest', image: '/images/news2.jpg' },
  { title: 'UN Summit on AI', summary: 'Global leaders meet...', category: 'politics', image: '/images/news3.jpg' }
];

const NewsSection = ({ category, viewType }) => {
  const [view, setView] = useState(viewType || 'grid');
  const filtered = mockNews.filter(item => item.category === category);

  return (
    <>
      <ButtonGroup className="mb-3">
        <Button onClick={() => setView('grid')} variant={view === 'grid' ? 'dark' : 'outline-dark'}>Grid</Button>
        <Button onClick={() => setView('list')} variant={view === 'list' ? 'dark' : 'outline-dark'}>List</Button>
      </ButtonGroup>

      {view === 'grid' ? (
        <Row>
          {filtered.map((news, idx) => (
            <Col md={4} key={idx}>
              <Card className="mb-3">
                <Card.Img variant="top" src={news.image} />
                <Card.Body>
                  <Card.Title>{news.title}</Card.Title>
                  <Card.Text>{news.summary}</Card.Text>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      ) : (
        <ListGroup>
          {filtered.map((news, idx) => (
            <ListGroup.Item key={idx}>
              <h5>{news.title}</h5>
              <p>{news.summary}</p>
            </ListGroup.Item>
          ))}
        </ListGroup>
      )}
    </>
  );
};

export default NewsSection;
