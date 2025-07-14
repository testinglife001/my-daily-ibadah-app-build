import NewsCard from './NewsCard';
import { Row, Col } from 'react-bootstrap';

const NewsColumns = () => {
  const categories = {
    World: [
      { title: 'World Economy Trends', excerpt: 'Global inflation slows...', image: '/news4.jpg' },
    ],
    Politics: [
      { title: 'Senate Approves Bill', excerpt: 'The new bill focuses on...', image: '/news5.jpg' },
    ],
    Technology: [
      { title: 'Quantum Leap in Computing', excerpt: 'Scientists unveil...', image: '/news6.jpg' },
    ],
  };

  return (
    <>
      <h4 className="fw-bold mb-3">🌐 News by Category</h4>
      <Row>
        {Object.entries(categories).map(([category, articles], i) => (
          <Col md={4} key={i}>
            <h6 className="text-primary fw-bold">{category}</h6>
            {articles.map((news, j) => (
              <NewsCard key={j} {...news} />
            ))}
          </Col>
        ))}
      </Row>
    </>
  );
};

export default NewsColumns;
