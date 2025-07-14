import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import './BackgroundSilderApp.css';
import Hero from '../../components/allposts/Hero';
import BackgroundSilder from '../../components/allposts/BackgroundSilder';
import TrendingList from '../../components/allposts/TrendingList';


function AllPostsPage() {
  return (
    <div style={{ marginTop: "60px", marginBottom: "20px" }} >
    <div className='bg-white text-primary container mx-auto mt-8 p-8' >
        <div>
            Hero
            <Hero /> 
        </div>
        <hr/>
        <div>Blogs</div>
    </div>
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


    <div className="backgroundsilderapp" >
        BackgroundSilder 
        <BackgroundSilder />
    </div>

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

    <div>
      TrendingList 
      <TrendingList /> 
    </div>

      {/* Columns are always 50% wide, on mobile and desktop */}
      <Row>
        <Col xs={6}>xs=6</Col>
        <Col xs={6}>xs=6</Col>
      </Row>
    </Container>
    </div>
  );
}

export default AllPostsPage;