import React from 'react'


const ListPage = () => {
  return (
    <div className="container-fluid" 
       // style={{ marginTop: '-1000px', marginLeft: '20px', marginRight: '20px' }} 
      >

        {/*<!-- Navigation -->*/}
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <div className="container">
                <a className="navbar-brand" href="#">My Blog</a>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav"
                     aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav ms-auto">
                        <li className="nav-item">
                            <a className="nav-link active" href="#">Home</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="#">About</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="#">Contact</a>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>

        {/*<!-- Blog Header -->*/}
        <header className="blog-header">
            <div className="container">
                <h1 className="display-4">Welcome to My Blog</h1>
                <p className="lead">A place for thoughts, ideas, and inspiration.</p>
            </div>
        </header>

        {/*<!-- Main Content -->*/}
        <main className="container">
            <div className="row">
                
                {/*<!-- Blog Posts -->*/}
                <div className="col-md-8">
                   
                    {/*<!-- Blog Post 1 -->*/}
                    <article className="blog-post mb-4">
                        <h2 className="blog-post-title">Sample Blog Post 1</h2>
                        <p className="blog-post-meta">January 1, 2024 by <a href="#">John Doe</a></p>
                        <img src="https://via.placeholder.com/800x400" alt="Blog Post Image" 
                            className="img-fluid mb-3" />
                        <p>This is a sample blog post. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam id dolor
                            id nibh ultricies vehicula ut id elit. Morbi leo risus, porta ac consectetur ac, vestibulum at eros.
                        </p>
                        <a href="#" className="btn btn-primary">Read More</a>
                    </article>

                    {/*<!-- Blog Post 2 -->*/}
                    <article className="blog-post mb-4">
                        <h2 className="blog-post-title">Sample Blog Post 2</h2>
                        <p className="blog-post-meta">January 15, 2024 by <a href="#">Jane Smith</a></p>
                        <img src="https://via.placeholder.com/800x400" alt="Blog Post Image" 
                            className="img-fluid mb-3" />
                        <p>Another sample blog post. Maecenas sed diam eget risus varius blandit sit amet non magna. Cras mattis
                            consectetur purus sit amet fermentum.</p>
                        <a href="#" className="btn btn-primary">Read More</a>
                    </article>
                </div>

                {/*<!-- Sidebar -->*/}
                <div className="col-md-4">
                    <div className="card mb-4">
                        <div className="card-header">Search</div>
                        <div className="card-body">
                            <form>
                                <div className="input-group">
                                    <input type="text" className="form-control" placeholder="Search for..." />
                                    <button className="btn btn-outline-secondary" type="button"><i className="fas fa-search"></i></button>
                                </div>
                            </form>
                        </div>
                    </div>

                    <div className="card mb-4">
                        <div className="card-header">Categories</div>
                        <div className="card-body">
                            <ul className="list-unstyled mb-0">
                                <li><a href="#">Technology</a></li>
                                <li><a href="#">Design</a></li>
                                <li><a href="#">Culture</a></li>
                                <li><a href="#">Business</a></li>
                            </ul>
                        </div>
                    </div>

                    <div className="card">
                        <div className="card-header">About</div>
                        <div className="card-body">
                            <p>Etiam porta sem malesuada magna mollis euismod. Cras mattis consectetur purus sit amet fermentum.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </main>

        {/*<!-- Footer -->*/}
        <footer className="bg-light text-center text-lg-start mt-4">
            <div className="container p-4">
                <div className="row">
                    <div className="col-lg-6 col-md-12 mb-4 mb-md-0">
                        <h5 className="text-uppercase">About My Blog</h5>
                        <p>
                            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Iste atque ea quis molestias.
                        </p>
                    </div>
                    <div className="col-lg-3 col-md-6 mb-4 mb-md-0">
                        <h5 className="text-uppercase">Links</h5>
                        <ul className="list-unstyled mb-0">
                            <li><a href="#!" className="text-dark">Link 1</a></li>
                            <li><a href="#!" className="text-dark">Link 2</a></li>
                            <li><a href="#!" className="text-dark">Link 3</a></li>
                            <li><a href="#!" className="text-dark">Link 4</a></li>
                        </ul>
                    </div>
                    <div className="col-lg-3 col-md-6 mb-4 mb-md-0">
                        <h5 className="text-uppercase mb-0">Follow Us</h5>
                        <ul className="list-unstyled">
                            <li><a href="#!" className="text-dark"><i className="fab fa-facebook"></i> Facebook</a></li>
                            <li><a href="#!" className="text-dark"><i className="fab fa-twitter"></i> Twitter</a></li>
                            <li><a href="#!" className="text-dark"><i className="fab fa-instagram"></i> Instagram</a></li>
                        </ul>
                    </div>
                </div>
            </div>
            <div className="text-center p-3" style={{backgroundColor : 'rgba(0, 0, 0, 0.2)'}}>
                © 2024 My Blog. All rights reserved.
            </div>
        </footer>

    </div>
  )
}

export default ListPage