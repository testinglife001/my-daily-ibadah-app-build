import React from 'react';
import { Row, Col } from 'react-bootstrap';
import Title from './Title';
import SimpleDetailsNewsCard from './SimpleDetailsNewsCard';

const DetailsNews = () => {
  return (
    <div className="w-100 d-flex flex-column gap-3 pe-2 py-4">
      <Title title="Health" />

      <Row className="g-3">
        <Col sm={6}>
          <SimpleDetailsNewsCard type="details-news" />
        </Col>
        <Col sm={6}>
          <SimpleDetailsNewsCard type="details-news" />
        </Col>
      </Row>
    </div>
  );
};

export default DetailsNews;
