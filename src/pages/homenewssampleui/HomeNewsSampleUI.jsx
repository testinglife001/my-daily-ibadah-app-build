import { Container, Row, Col } from 'react-bootstrap';
import NavbarComponent from './NavbarComponent';
import MarqueeHeadlines from './MarqueeHeadlines';
import NewsSlider from './NewsSlider';
import TrendingNews from './TrendingNews';
import NewsRow from './NewsRow';
import NewsColumns from './NewsColumns';
import Sidebar from './Sidebar';
import './index.css';

const HomeNewsSampleUI = () => (
  <div className='newssampleui' >
    <NavbarComponent />
    <MarqueeHeadlines />
    <Container fluid className="px-4">
      <NewsSlider />

      <Row className="my-4">
        <Col lg={8}>
          <TrendingNews />
          <NewsRow />
          <NewsColumns />
        </Col>
        <Col lg={4}>
          <Sidebar />
        </Col>
      </Row>
    </Container>
  </div>
);

export default HomeNewsSampleUI;
