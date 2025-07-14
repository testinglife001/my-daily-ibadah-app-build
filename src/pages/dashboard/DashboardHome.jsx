import React, { useState } from "react";
import { Container, Tab, Nav, Row, Col } from "react-bootstrap";
import UserProfile from "./UserProfile";
import DisplayUserBlogs from "./DisplayUserBlogs";
import AllBlogPosts from "./AllBlogPosts";
import CommentsOnMyPosts from "./CommentsOnMyPosts";
import MyLikes from "./MyLikes";
import MyFavorites from "./MyFavorites";
import MySubscriptions from "./MySubscriptions";
import AllCategories from "./AllCategories";
import MyBlogs from "./MyBlogs";
import MyNotifications from "./MyNotifications";
import AllBlogsPosts from "./AllBlogsPosts";
import CommentsOnMyBlogs from "./CommentsOnMyBlogs";
import MyLikedBlogs from "./MyLikedBlogs";

const DashboardHome = ({ user }) => {
  return (
    <Container className="mt-4">
      <h2>User Dashboard</h2>
      <Tab.Container defaultActiveKey="profile">
        <Row>
          <Col sm={3}>
            <Nav variant="pills" className="flex-column mt-3">
              <Nav.Item><Nav.Link eventKey="profile">User Profile</Nav.Link></Nav.Item>
              <Nav.Item><Nav.Link eventKey="allCategories">All Categories Posts</Nav.Link></Nav.Item>
              <Nav.Item><Nav.Link eventKey="myBlogs">My Blogs</Nav.Link></Nav.Item>
              <Nav.Item><Nav.Link eventKey="myPosts">My Blog Posts</Nav.Link></Nav.Item>
              <Nav.Item><Nav.Link eventKey="allPosts">All Blog Posts</Nav.Link></Nav.Item>
              <Nav.Item><Nav.Link eventKey="comments">Comments on My Posts</Nav.Link></Nav.Item>
              <Nav.Item><Nav.Link eventKey="blogcomments">Comments on My Blogs</Nav.Link></Nav.Item>
              <Nav.Item><Nav.Link eventKey="likes">My Likes</Nav.Link></Nav.Item>
              <Nav.Item><Nav.Link eventKey="blogsliked">My Liked Blogs</Nav.Link></Nav.Item>
              <Nav.Item><Nav.Link eventKey="favorites">Favorited Posts</Nav.Link></Nav.Item>
              <Nav.Item><Nav.Link eventKey="subscriptions">Subscribed Categories</Nav.Link></Nav.Item>
               <Nav.Item><Nav.Link eventKey="notifications">Notifications</Nav.Link></Nav.Item>
            </Nav>
          </Col>
          <Col sm={9}>
            <Tab.Content>
              <Tab.Pane eventKey="profile"><UserProfile user={user} /></Tab.Pane>
              <Tab.Pane eventKey="allCategories"><AllCategories user={user} /></Tab.Pane>
              <Tab.Pane eventKey="myBlogs"><MyBlogs user={user} /></Tab.Pane>
              <Tab.Pane eventKey="myPosts"><DisplayUserBlogs user={user} /></Tab.Pane>
              <Tab.Pane eventKey="allPosts"><AllBlogsPosts user={user} /></Tab.Pane>
              <Tab.Pane eventKey="comments"><CommentsOnMyPosts user={user} /></Tab.Pane>
              <Tab.Pane eventKey="blogcomments"><CommentsOnMyBlogs user={user} /></Tab.Pane>
              <Tab.Pane eventKey="likes"><MyLikes user={user} /></Tab.Pane>
              <Tab.Pane eventKey="blogsliked"><MyLikedBlogs user={user} /></Tab.Pane>
              <Tab.Pane eventKey="favorites"><MyFavorites user={user} /></Tab.Pane>
              <Tab.Pane eventKey="subscriptions"><MySubscriptions user={user} /></Tab.Pane>
              <Tab.Pane eventKey="notifications"><MyNotifications user={user} /></Tab.Pane>
            </Tab.Content>
          </Col>
        </Row>
      </Tab.Container>
    </Container>
  );
};

export default DashboardHome;
