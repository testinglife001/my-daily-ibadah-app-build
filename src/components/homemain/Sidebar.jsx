// src/components/Sidebar.jsx
import React, { useState } from "react";
import "./Sidebar.css";
import { Link } from "react-router-dom";
import Tags from "./Tags";
import FeatureBlogs from "./FeatureBlogs";
import Category from "./Category";
import CategorySidebar from "./CategorySidebar";



 function Sidebar({tags,blogs,categories,catCount,subcategories,subcatCount,counts}) {

  const [openIds, setOpenIds] = useState([]);

  const toggle = (id) => {
    setOpenIds(prev => (prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]));
  };


  return (
    <aside className="position-sticky sidebar-sticky bg-secondary p-3">
      <section className="sidebar-box  mb-4">
        <h5 className="sidebar-title">📌 About</h5>
     
        <img
          src="https://png.pngtree.com/background/20230611/original/pngtree-islamic-calligraphy-wallpaper-in-hd-picture-image_3170909.jpg"
          alt=""
          width={200}
        />
    
        <br/>
        <p className="sidebar-text">
          Welcome to our blog! We share tech insights, tutorials, and trending topics weekly.
        </p>
      </section>

      <section className="sidebar-box mb-4">
        <h5 className="sidebar-title">📚 Archives</h5>
        <ul className="list-unstyled sidebar-list">
          <li><a href="#">March 2025</a></li>
          <li><a href="#">February 2025</a></li>
          <li><a href="#">January 2025</a></li>
        </ul>
      </section>

      <section className="sidebar-box  mb-4">
        <h5 className="sidebar-title">🌐 Elsewhere</h5>
        <ul className="list-unstyled sidebar-list">
          <li><a href="#">GitHub</a></li>
          <li><a href="#">Twitter</a></li>
          <li><a href="#">Facebook</a></li>
        </ul>
      </section>

      <section className="sidebar-box  mb-4">
        <h5 className="sidebar-title">🌐 Most Popular</h5>
        <ul className="list-unstyled sidebar-list">
          <li><a href="#">GitHub</a></li>
          <li><a href="#">Twitter</a></li>
          <li><a href="#">Facebook</a></li>
        </ul>
      </section>

      <section className="sidebar-box  mb-4">
        <h5 className="sidebar-title">🌐 CATEGORIES</h5>
        <ul className="list-unstyled sidebar-list">
          <li><a href="#">GitHub</a></li>
          <li><a href="#">Twitter</a></li>
          <li><a href="#">Facebook</a></li>
        </ul>
      </section>

      <section className="sidebar-box  mb-4">
        <h5 className="sidebar-title">🌐 TAGS</h5>
        <ul className="list-unstyled sidebar-list">
          <li><a href="#">GitHub</a></li>
          <li><a href="#">Twitter</a></li>
          <li><a href="#">Facebook</a></li>
        </ul>
      </section>

     
        <div className="sidebar-section">
          <h5 className="sidebar-heading">🏷️ Tags</h5>
          <Tags tags={tags} />
        </div>

        <div className="sidebar-section mt-4">
          <h5 className="sidebar-heading">🔥 {`Most Popular`}</h5>
          <FeatureBlogs title="Most Popular" blogs={blogs} />
        </div>

     
      {/* <CategorySidebar
            categories={categories}
            subcategories={subcategories}
            counts={counts}
          /> */}

   
       
       <div className="sidebar-section mt-4">
          <h5 className="sidebar-heading">📂 Categories</h5>
          <ul className="bg-light" style={{ listStyle: "none", paddingLeft: 0 }}>
          {categories.map(cat => (
            <li key={cat.id} style={{ marginBottom: 10 }}>
              <div style={{ display: "flex", alignItems: "center" }}>
                <button
                  aria-label={openIds.includes(cat.id) ? "Collapse" : "Expand"}
                  onClick={() => toggle(cat.id)}
                  style={{
                    marginRight: 8,
                    cursor: "pointer",
                    fontWeight: "bold",
                    fontSize: 18,
                    border: "none",
                    background: "none"
                  }}
                >
                  {openIds.includes(cat.id) ? "−" : "+"}
                </button>
                <Link to={`/category/${cat.id}`} style={{ flexGrow: 1, textDecoration: "none", color: "black" }}>
                  {cat.name} <small>({counts[cat.id] || 0})</small>
                </Link>
              </div>
              {openIds.includes(cat.id) && (
                <ul style={{ listStyle: "none", paddingLeft: 20, marginTop: 4 }}>
                  {subcategories
                    .filter(sub => sub.parentId === cat.id)
                    .map(subcat => (
                      <li key={subcat.id} style={{ marginBottom: 6 }}>
                        <Link
                          to={`/category/${subcat.id}`}
                          style={{ textDecoration: "none", color: "#555" }}
                        >
                          {subcat.name} <small>({counts[subcat.id] || 0})</small>
                        </Link>
                      </li>
                    ))}
                </ul>
              )}
            </li>
          ))}
          </ul>
        </div>
        

      <br/><br/><br/><br/><br/>


    </aside>
  );
}


export default  Sidebar;
