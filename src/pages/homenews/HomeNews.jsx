import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import './HomeNews.css';
import Headlines from '../../components/homenews/Headlines';
import LatestNews from '../../components/homenews/LatestNews';
import Title from '../../components/homenews/Title';
import SimpleNewsCard from '../../components/homenews/SimpleNewsCard';
import PopularNews from '../../components/homenews/PopularNews';
import DetailsNewsRow from '../../components/homenews/DetailsNewsRow';
import DetailsNews from '../../components/homenews/DetailsNews';
import DetailsNewsCol from '../../components/homenews/DetailsNewsCol';
import NewsCard from '../../components/homenews/NewsCard';


const HomeNews = () => {
  return (
    <div>
      {/* Headlines at the top */}
      <Headlines />

      {/* Main Content Section */}
      <div className="news-section-bg py-5 px-3 px-md-5">
        <Container fluid>
          {/* First Row: Latest News + Technology */}
          <Row className="gx-4 gy-4">
            <Col xs={12} lg={6}>
              <LatestNews />
            </Col>
            <Col xs={12} lg={6}>
              <div className="d-flex flex-column gap-3 ps-lg-2">
                <Title title="Technology" />
                <Row className="g-1">
                  {[1, 2, 3, 4].map((item, i) => (
                    <Col xs={12} sm={6} key={i}>
                      <SimpleNewsCard item={item} />
                    </Col>
                  ))}
                </Row>
              </div>
            </Col>
          </Row>

          {/* Second Row: Popular News */}
          <PopularNews type="Popular News" />

          {/* Third Row: Sports + Sidebar */}
          <Row className="gx-4 gy-4">
            <Col xs={12} lg={8}>
              <DetailsNewsRow category="Sports" type="details-news" />
              <DetailsNews />
            </Col>
            <Col xs={12} lg={4}>
              <DetailsNewsCol />
            </Col>
          </Row>

          {/* Fourth Row: Sidebar first, then content */}
          <Row className="gx-4 gy-4">
            <Col xs={12} lg={4}>
              <DetailsNewsCol />
            </Col>
            <Col xs={12} lg={8}>
              <DetailsNewsRow category="Sports" type="details-news" />
              <DetailsNews />
            </Col>
          </Row>

          {/* Fifth Row: Content then sidebar with Recent News */}
          <Row className="gx-4 gy-4">
            <Col xs={12} lg={8}>
              <DetailsNewsRow category="Sports" type="details-news" />
            </Col>
            <Col xs={12} lg={4}>
              <Title title="Recent News" />
              <div className="d-grid gap-3 mt-4">
                {[1, 2, 3, 4].map((_, i) => (
                  <NewsCard key={i} />
                ))}
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </div>
  );
};

export default HomeNews;
