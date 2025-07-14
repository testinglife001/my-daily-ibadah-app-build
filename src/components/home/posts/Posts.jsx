import React from 'react'
import "./Posts.css";
import "./Post.css";
import { Link } from 'react-router-dom';
import FontAwesome from "react-fontawesome";
// import { excerpt } from '../../../utility';


const Posts = () => {

  // const userId = user?.uid;

  return (
    
    <div className="posts">      

            <div className="post" >
                <img
                className="postImg"
                src=""
                alt=""
                />
              <div className="postInfo">
                <div className="postCats">
                    <span className="postCat">
            
                    <Link className="link" to="">
                   category
                    </Link>
                    </span>
                    <span className="postCat">
        
                    <Link className="link" to="">
                        Life
                    </Link>
                    </span>
                </div>
                  <span className="postTitle">
          
                      <Link className="link" to={`/`} >
                      title
                      </Link>

                  </span>                

              
                    <div style={{ float: "right" }}>
                        Delete
                        <FontAwesome
                        name="trash"
                        style={{ margin: "15px", cursor: "pointer" }}
                        size="2x"
                     
                        />                   
                        <Link to={``}>
                        <FontAwesome
                            name="edit"
                            style={{ cursor: "pointer" }}
                            size="2x"
                        />
                        Edit
                        </Link>
                    </div>
                  

                <hr />

                <div className="text-muted small">
                Authorized by Mr. blog creator username  author 
                </div>
                  -&nbsp;
           
                <span className="postDate">@ hour ago</span>
              </div>
                <p className="postDesc">
              
                </p>
            </div>
        
        

    </div>
    
  )
}

export default Posts