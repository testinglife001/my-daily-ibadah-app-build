import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar = () => {
  return (
    <div className="sidebar">

      
      <div className="sidebarItem">
        <span className="sidebarTitle">ABOUT ME</span>
        <img
          src="https://png.pngtree.com/background/20230611/original/pngtree-islamic-calligraphy-wallpaper-in-hd-picture-image_3170909.jpg"
          alt=""
          width={200}
        />
        <p>
          Laboris sunt aute cupidatat velit magna velit ullamco dolore mollit
          amet ex esse.Sunt eu ut nostrud id quis proident.
        </p>
      </div>

      
      <div className="sidebarItem">
        <span className="sidebarTitle">CATEGORIES</span>
        Category 
      </div>

      <div className="sidebarItem">
        <span className="sidebarTitle">Most Popular </span>
        MostPopular 
      </div>

      <div className="sidebarItem">
        <span className="sidebarTitle">CATEGORIES</span>
        <ul className="sidebarList">
          <li className="sidebarListItem">
            <Link className="link" to="">
              Life
            </Link>
          </li>
          <li className="sidebarListItem">
          <Link className="link" to="">
              Music
            </Link>
          </li>
          <li className="sidebarListItem">
            <Link className="link" to="">
              Sport
            </Link>
          </li>
          <li className="sidebarListItem">
            <Link className="link" to="">
              Style
            </Link>
          </li>
          <li className="sidebarListItem">
            <Link className="link" to="">
              Tech
            </Link>
          </li>
          <li className="sidebarListItem">
            <Link className="link" to="">
              Cinema
            </Link>
          </li>
        </ul>
      </div>

      <div className="sidebarItem">
        <span className="sidebarTitle">TAGS</span>
        Tags 
      </div> 
      <br/>

      <div className="sidebarItem">
        <span className="sidebarTitle">FOLLOW US</span>
        <div className="sidebarSocial">
          <i className="sidebarIcon fab fa-facebook-square"></i>facebook
          <i className="sidebarIcon fab fa-instagram-square"></i>instagram
          <i className="sidebarIcon fab fa-pinterest-square"></i>pinterest
          <i className="sidebarIcon fab fa-twitter-square"></i>twitter
        </div>
      </div>  
      

   </div>
  );
};

export default Sidebar;