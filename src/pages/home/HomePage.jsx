import React from 'react';
//import './HomePageUi.css'; // ✅ using this for layout
import 'bootstrap/dist/css/bootstrap.min.css';
import Topbar from '../../components/home/topbar/Topbar';
import HeaderImg from '../../components/home/headerimg/HeaderImg';
import Posts from '../../components/home/posts/Posts';
import Sidebar from '../../components/home/sidebar/Sidebar';

const HomePage = ({ setActive, active, user }) => {
  return (
    <div>
      <Topbar />
      <HeaderImg />

      <div className="homepage">
        {/* Main content left */}
        <div className="main-content">
          <h1>Welcome to the Home Page</h1>
          <Posts />
        </div>

        {/* Sidebar on the right */}
        <Sidebar />
      </div>
    </div>
  );
};

export default HomePage;
