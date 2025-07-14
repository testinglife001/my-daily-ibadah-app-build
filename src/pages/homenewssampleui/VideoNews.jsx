import { Card, Row, Col, Modal, Button } from 'react-bootstrap';
import { useState } from 'react';

const videos = [
  {
    title: 'Live: Climate Change Conference',
    thumbnail: '/video-thumb1.jpg',
    url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
  },
  {
    title: 'Exclusive Interview with PM',
    thumbnail: '/video-thumb2.jpg',
    url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
  },
];

const VideoNews = () => {
  const [show, setShow] = useState(false);
  const [currentVideo, setCurrentVideo] = useState('');

  const handleShow = (url) => {
    setCurrentVideo(url);
    setShow(true);
  };

  const handleClose = () => {
    setShow(false);
    setCurrentVideo('');
  };

  return (
    <>
      <h4 className="fw-bold my-3">🎥 Video News</h4>
      <Row>
        {videos.map((video, i) => (
          <Col md={6} key={i} className="mb-3">
            <Card className="shadow-sm border-0" onClick={() => handleShow(video.url)} style={{ cursor: 'pointer' }}>
              <Card.Img variant="top" src={video.thumbnail} style={{ height: '200px', objectFit: 'cover' }} />
              <Card.Body>
                <Card.Title>{video.title}</Card.Title>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      <Modal show={show} onHide={handleClose} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>Video News</Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-0">
          {currentVideo && (
            <div className="ratio ratio-16x9">
              <iframe
                src={currentVideo}
                title="Video News"
                allowFullScreen
              />
            </div>
          )}
        </Modal.Body>
      </Modal>
    </>
  );
};

export default VideoNews;
