import React from 'react';
import Title from './Title';
import SimpleDetailsNewsCard from './SimpleDetailsNewsCard';
import { Row, Col } from 'react-bootstrap';

const PopularNews = ({ type }) => {
  return (
    <div className="w-100 py-4">
    {/*<div className="w-100 pb-5 mt-5">*/}
      <div className="d-flex flex-column gap-3">
        <Title title="Popular News" />

        <Row className="g-3">
          {[1, 2, 3, 4].map((item, i) => (
            <Col xs={12} sm={6} lg={3} key={i}>
              <SimpleDetailsNewsCard type={type} item={item} />
            </Col>
          ))}
        </Row>
      </div>
    </div>
  );
};

export default PopularNews;
