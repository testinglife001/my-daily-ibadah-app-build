import React from 'react';

import './NewsHomePage.css'

import { Container, Row, Col } from 'react-bootstrap';
import MarqueeNews from './MarqueeNews';
import NewsSlider from './NewsSlider';
import NewsSection from './NewsSection';
import VideoNews from './VideoNews';
import Sidebar from './Sidebar';

const NewsHomePage = () => {
  return (
    <div className='newshomepage' >
    <Container fluid className="bg-light newspaper-font">
      <MarqueeNews />
      <NewsSlider />

      <Container className="my-4">
        <h3 className="section-header">📰 Latest News</h3>
        <NewsSection viewType="grid" category="latest" />
      </Container>

      <Container className="my-4 bg-white p-4 border newspaper-section">
        <h3 className="section-header">🏛️ Politics</h3>
        <NewsSection viewType="list" category="politics" />
      </Container>

      <Container className="my-4">
        <Row>
          <Col lg={8}>
            <h3 className="section-header">🎥 Video News</h3>
            <VideoNews />
          </Col>
          <Col lg={4}>
            <Sidebar />
          </Col>
        </Row>
      </Container>
    </Container>
    </div>
  );
};

export default NewsHomePage;

