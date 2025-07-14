import React from 'react';
import './SinglePostDetail.css';

const SinglePostDetail = (props) => {
  return (
    <div>
        <div className="blogPostContainer">
            <div className="card" style={{ width: props.width ? props.width: '100%' }}  >
                <div className="blogHeader">
                    <span className="blogCategory">Category</span>
                    <h1 className="postTitle">Title</h1>
                    <span className="postedBy">posted on postedOn by author</span>
                </div>

                <div className="postImageContainer">
                    <img src="https://cdn.pixabay.com/photo/2024/10/02/04/25/muslim-9089853_1280.jpg" 
                            alt="Post Image" 
                        />
                    
                </div>

                <div className="postContent">
                    <h3>Title</h3>
                    <p>Text</p>
                </div>
                
            </div>
        </div>
    </div>
  )
}

export default SinglePostDetail