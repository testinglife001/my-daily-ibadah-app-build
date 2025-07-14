import React from 'react'
import { Link } from "react-router-dom";
import "./Topbar.css";

export default function Topbar() {
  
   const user = true;
  // const userId = user?.uid;
  // console.log(user);
  // console.log(userId);
  
  return (
    <div className="top">
      <div className="topLeft">
        fb
        i 
        pi
        tw
      </div>
      <div className="topCenter">
        <ul className="topList">
          <li className="topListItem">
            <a >
              HOME
            </a>
          </li>
          <li className="topListItem">ABOUT</li>
          <li className="topListItem">CONTACT</li>
          <li className="topListItem">
            <a >
              WRITE
            </a>
          </li>
          
          <li className="topListItem">LOGOUT</li>
        </ul>
      </div>
      <div className="topRight">
        
          
          <a >
            <img
              className="topImg"
              src="https://images.pexels.com/photos/1858175/pexels-photo-1858175.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500"
              alt=""
            />
          </a>
          <li className="topListItem">
            <a  >
              username
            </a>
          </li>
          <li className="topListItem"  >LOGOUT</li>
          

          <ul className="topList">
            <li className="topListItem">
              <a >
                LOGIN
              </a>
            </li>
            <li className="topListItem">
              <a >
                REGISTER
              </a>
            </li>
          </ul>
   
        <i className="topSearchIcon fas fa-search"></i>
      </div>
    </div>
  );
}
