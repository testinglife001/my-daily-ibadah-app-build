import { Card } from 'react-bootstrap';

const NewsCard = ({ title, excerpt, image }) => (
  <Card className="mb-3 shadow-sm border-0" style={{ minHeight: '100%' }}>
    <Card.Img variant="top" src={image} style={{ height: '180px', objectFit: 'cover' }} />
    <Card.Body className="px-2 py-3">
      <Card.Title className="text-dark">{title}</Card.Title>
      <Card.Text>{excerpt}</Card.Text>
    </Card.Body>
  </Card>
);

export default NewsCard;
