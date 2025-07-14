import { Container, Row, Col } from 'react-bootstrap';
import NavbarComponent from './NavbarComponent';
import MarqueeHeadlines from './MarqueeHeadlines';
import NewsSlider from './NewsSlider';
import LatestNews from './LatestNews';
import RecentNews from './RecentNews';
import Sidebar from './Sidebar';


const HomeNewsApp = () => (
  <>
    <NavbarComponent />
    <MarqueeHeadlines />
    <Container className="mt-3">
      <NewsSlider />
      <Row className="mt-4">
        <Col lg={8}>
          <LatestNews />
          <RecentNews />
        </Col>
        <Col lg={4}>
          <Sidebar />
        </Col>
      </Row>
    </Container>
  </>
);

export default HomeNewsApp;
