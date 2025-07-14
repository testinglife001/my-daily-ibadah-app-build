import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from "react-router-dom";
// import "./Home.css";
import './HomePageUi.css';
import Topbar from '../../components/home/topbar/Topbar';
import HeaderImg from '../../components/home/headerimg/HeaderImg';
import Posts from '../../components/home/posts/Posts';
import Sidebar from '../../components/home/sidebar/Sidebar';


const Home = ({ setActive, user, active }) => {



  return (
    <div>
      <Topbar />
      <HeaderImg />
      <div className="home">
        <div className="homeMain">
          {
          
          <Posts  />
          
          }
        </div>
        {<Sidebar />}
      </div>
    </div>
    
  )
}

export default Home