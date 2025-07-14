import React from 'react';
import { Row, Col } from 'react-bootstrap';
import Title from './Title';
import SimpleDetailsNewsCard from './SimpleDetailsNewsCard';
import NewsCard from './NewsCard';

const DetailsNewsRow = ({ category, type }) => {
  return (
    <div className="w-100 d-flex flex-column gap-3 pe-2">
      <Title title={category} />

      <Row className="g-3">
        <Col md={6}>
          <SimpleDetailsNewsCard type={type} />
        </Col>
        <Col md={6}>
          <div className="d-grid gap-2">
            {[1, 2, 3, 4].map((_, i) => (
              <NewsCard key={i} />
            ))}
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default DetailsNewsRow;
