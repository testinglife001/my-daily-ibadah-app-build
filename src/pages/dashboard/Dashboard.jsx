// src/components/Dashboard/Dashboard.jsx
import React, { useState, useEffect } from "react";
import { Tab, Nav, Row, Col, Accordion } from "react-bootstrap";
import MyBlogPosts from "./MyBlogPosts";
import NotificationCenter from "./NotificationCenter";
import MyUserProfile from "./MyUserProfile";
import AllBlogsPosts from "./AllBlogsPosts";
import MyBlogs from "./MyBlogs";

const Dashboard = ({ user }) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);

  const sections = [
    { key: "profile", label: "Profile", comp: <MyUserProfile user={user} /> },
    { key: "myBlogs", label: "My Blogs", comp: <MyBlogs user={user} /> }, 
    { key: "myPosts", label: "My Posts", comp: <MyBlogPosts user={user} /> },
    { key: "allPosts", label: "All Posts", comp: <AllBlogsPosts user={user} /> },
    { /* key: "notifications", label: "Notifications", comp: <NotificationCenter user={user} /> */ },
  ];

  return isMobile ? (
    <Accordion defaultActiveKey="0">
      {sections.map((sec, i) => (
        <Accordion.Item eventKey={String(i)} key={sec.key}>
          <Accordion.Header>{sec.label}</Accordion.Header>
          <Accordion.Body>{sec.comp}</Accordion.Body>
        </Accordion.Item>
      ))}
    </Accordion>
  ) : (
    <Tab.Container defaultActiveKey="profile">
      <Row>
        <Col sm={3}>
          <Nav variant="pills" className="flex-column">
            {sections.map(sec => (
              <Nav.Item key={sec.key}>
                <Nav.Link eventKey={sec.key}>{sec.label}</Nav.Link>
              </Nav.Item>
            ))}
          </Nav>
        </Col>
        <Col sm={9}>
          <Tab.Content>
            {sections.map(sec => (
              <Tab.Pane eventKey={sec.key} key={sec.key}>{sec.comp}</Tab.Pane>
            ))}
          </Tab.Content>
        </Col>
      </Row>
    </Tab.Container>
  );
};

export default Dashboard;
