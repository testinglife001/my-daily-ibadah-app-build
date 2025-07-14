import { Card } from 'react-bootstrap';

const NewsCard = ({ title, excerpt, image }) => (
  <Card className="mb-3">
    <Card.Img variant="top" src={image} />
    <Card.Body>
      <Card.Title>{title}</Card.Title>
      <Card.Text>{excerpt}</Card.Text>
    </Card.Body>
  </Card>
);

export default NewsCard;
