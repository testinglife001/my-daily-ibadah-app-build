import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import CardExample from '../../components/allposts/CardExample';




const PostsPage = () => {
  return (
    <div>
    <Container>
      {/* Stack the columns on mobile by making one full-width and the other half-width */}
      <Row>
        <Col xs={12} md={8}>
          xs=12 md=8
        </Col>
        <Col xs={6} md={4}>
          xs=6 md=4
        </Col>
      </Row>

      {/* Columns start at 50% wide on mobile and bump up to 33.3% wide on desktop */}
      <Row>
        <Col xs={6} md={4}>
          xs=6 md=4
        </Col>
        <Col xs={6} md={4}>
          xs=6 md=4
        </Col>
        <Col xs={6} md={4}>
          xs=6 md=4
        </Col>
      </Row>

      {/* Columns are always 50% wide, on mobile and desktop */}
      <Row>
        <Col xs={6}>xs=6</Col>
        <Col xs={6}>xs=6</Col>
      </Row>
    </Container>
    <Container>
      <Row>
        <Col sm={8}>sm=8
          <CardExample   />
        </Col>
        <Col sm={4}>sm=4
        <CardExample />
        </Col>
      </Row>

      <Row>    
        <Col sm>
          sm=true
          <CardExample />
        </Col>
        <Col sm>
          sm=true
          <CardExample />
        </Col>
        <Col sm>
          sm=true
          <CardExample />
        </Col>
      </Row>

    </Container>
    </div>
  )
}

export default PostsPage;



