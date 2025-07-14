import React from 'react'


const GridPage = () => {
  return (
    <div className="container-fluid" 
       // style={{ marginTop: '-1000px', marginLeft: '20px', marginRight: '20px' }} 
      >
    
    {/*<!-- Blog Header -->*/}
    <header className="blog-header py-5">
        <h1>Welcome to My Blog</h1>
        <p>Sharing insights and ideas on technology, design, and development.</p>
    </header>


    {/*<!-- Featured Post Section -->*/}
    <div className="container mb-5">
        <div className="row">
            <div className="col-lg-12">
            <div className="featured-post">
                <div className="row">
                <div className="col-md-6">
                    <img src="https://via.placeholder.com/600x400" alt="Featured Post" />
                </div>
                <div className="col-md-6">
                    <h2>Featured Post Title</h2>
                    <p className="mt-3">This is a brief description of the featured post. It highlights the main points and draws
                    readers in to click and read more about the topic. Learn about the latest trends in technology, design,
                    and more.</p>
                    <a href="#" className="btn btn-primary mt-4">Read More</a>
                </div>
                </div>
            </div>
            </div>
        </div>
    </div>


    {/*<!--  Blog Post Grid -->*/}
    <div className="container">
    <div className="row g-4">

        <div className="col-md-6 col-lg-4">
        <div className="card">
            <img src="https://via.placeholder.com/400x300" className="card-img-top" alt="Post 1" />
            <div className="card-body">
            <h5 className="card-title">Blog Post 1</h5>
            <p className="card-text">A short description of this blog post to capture the reader's attention and give them a
                quick preview.</p>
            <a href="#" className="btn btn-primary">Read More</a>
            </div>
        </div>
        </div>

        <div className="col-md-6 col-lg-4">
        <div className="card">
            <img src="https://via.placeholder.com/400x300" className="card-img-top" alt="Post 2" />
            <div className="card-body">
            <h5 className="card-title">Blog Post 2</h5>
            <p className="card-text">This is another exciting blog post. It provides value and insights on various topics.</p>
            <a href="#" className="btn btn-primary">Read More</a>
            </div>
        </div>
        </div>

        <div className="col-md-6 col-lg-4">
        <div className="card">
            <img src="https://via.placeholder.com/400x300" className="card-img-top" alt="Post 3" />
            <div className="card-body">
            <h5 className="card-title">Blog Post 3</h5>
            <p className="card-text">A brief description of this blog post. Keep your readers engaged with interesting
                content.</p>
            <a href="#" className="btn btn-primary">Read More</a>
            </div>
        </div>
        </div>
    </div>
    </div>

    </div>
  )
}

export default GridPage