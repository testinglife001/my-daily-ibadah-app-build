import React, { useEffect, useState } from 'react';
import { db } from '../../firebase';
import {
  collection,
  getDocs,
  query,
  orderBy,
  deleteDoc,
  doc,
  Timestamp
} from 'firebase/firestore';
import {
  Container, Row, Col, Card, Button, Form, Badge, Spinner, ToggleButtonGroup, ToggleButton
} from 'react-bootstrap';
import { FaTh, FaList, FaEdit, FaTrash } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const DashboardAllPostList = () => {
  const [posts, setPosts] = useState([]);
  const [viewMode, setViewMode] = useState('grid');
  const [loading, setLoading] = useState(true);
  const [filterCategory, setFilterCategory] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterTag, setFilterTag] = useState('');

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    setLoading(true);
    const q = query(collection(db, 'posts'), orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    const postData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setPosts(postData);
    setLoading(false);
  };

  const handleDelete = async (postId) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      await deleteDoc(doc(db, 'posts', postId));
      setPosts(prev => prev.filter(post => post.id !== postId));
    }
  };

  const handleEdit = (post) => {
    // Implement your modal open logic here, or navigate to edit page
    alert(`Edit post: ${post.title}`);
  };

  const filteredPosts = posts.filter(post => {
    const matchCategory = filterCategory ? post.categoryTitle === filterCategory : true;
    const matchStatus = filterStatus ? post.status === filterStatus : true;
    const matchTag = filterTag ? post.tags?.includes(filterTag) : true;
    return matchCategory && matchStatus && matchTag;
  });

  const categories = [...new Set(posts.map(post => post.categoryTitle).filter(Boolean))];
  const allTags = [...new Set(posts.flatMap(post => post.tags || []))];

  return (
    <Container className="mt-4">
      <Row className="align-items-center mb-3">
        <Col><h2>All Posts</h2></Col>
        <Col md="auto">
          <ToggleButtonGroup type="radio" name="viewMode" value={viewMode} onChange={setViewMode}>
            <ToggleButton id="grid" variant="outline-secondary" value="grid"><FaTh /></ToggleButton>
            <ToggleButton id="list" variant="outline-secondary" value="list"><FaList /></ToggleButton>
          </ToggleButtonGroup>
        </Col>
      </Row>

      <Row className="mb-3">
        <Col md={3}>
          <Form.Select onChange={(e) => setFilterCategory(e.target.value)} value={filterCategory}>
            <option value="">Filter by Category</option>
            {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
          </Form.Select>
        </Col>
        <Col md={3}>
          <Form.Select onChange={(e) => setFilterStatus(e.target.value)} value={filterStatus}>
            <option value="">Filter by Status</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
          </Form.Select>
        </Col>
        <Col md={3}>
          <Form.Select onChange={(e) => setFilterTag(e.target.value)} value={filterTag}>
            <option value="">Filter by Tag</option>
            {allTags.map(tag => <option key={tag} value={tag}>{tag}</option>)}
          </Form.Select>
        </Col>
        <Col md={3}>
          <Button variant="outline-secondary" onClick={() => {
            setFilterCategory('');
            setFilterStatus('');
            setFilterTag('');
          }}>
            Clear Filters
          </Button>
        </Col>
      </Row>

      {loading ? (
        <Spinner animation="border" />
      ) : filteredPosts.length === 0 ? (
        <p>No posts found.</p>
      ) : viewMode === 'grid' ? (
        <Row>
          {filteredPosts.map(post => (
            <Col md={4} key={post.id} className="mb-4">
              <Card style={{margin:'10% 2% 5% -1%'}} >
                <Card.Img variant="top" src={post.imageUrl} height="200" />
                <Card.Body style={{height:'400px'}} >
                  <Card.Title>{post.title}</Card.Title>
                  {/*<Card.Subtitle className="mb-2 text-muted">{post.subtitle}</Card.Subtitle>*/}
                  <Badge bg="info" className="me-1">{post.categoryTitle}</Badge>
                  {post.subcategoryTitle && <Badge bg="secondary">{post.subcategoryTitle}</Badge>}
                  <div className="mt-2">
                    {post.tags?.map(tag => <Badge bg="light" text="dark" key={tag} className="me-1">{tag}</Badge>)}
                  </div>
                  <div className="text-muted mt-2">
                    {/* post.createdAt?.toDate().toLocaleDateString() */} 
                    {post.createdAt instanceof Timestamp
                      ? post.createdAt.toDate().toLocaleDateString()
                      : new Date(post.createdAt).toLocaleDateString()}
                    - {post.status}
                  </div>
                    {/* View Button */}
                    <div className="mt-3 d-flex gap-2">
                        <Link to={`/dashboard/posts/${post.slug}`}>
                        <Button variant="info" size="sm">View</Button>
                        </Link>
                        <Link to={`/dashboard/postsui/${post.slug}`}>
                        <Button variant="outline-default" size="sm" style={{outline: '2px', backgroundColor:'gray', color:'white' }} >Show</Button>
                        </Link>
                        {/* You can add Edit/Delete buttons here too */}
                    </div>
                  <div className="mt-3 d-flex justify-content-between">
                    <Button variant="outline-primary" size="sm" >
                        <Link to={`/dashboard/posts-edit/${post.slug}`}>
                        <FaEdit />
                        </Link>
                    </Button>
                    <Link to={`/dashboard/posts/edit/${post.slug}`} className="btn btn-sm btn-warning me-2">Edit</Link>
                    <Button variant="outline-danger" size="sm" onClick={() => handleDelete(post.id)}><FaTrash /></Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      ) : (
        <ListView posts={filteredPosts} onEdit={handleEdit} onDelete={handleDelete} />
      )}
    </Container>
  );
};

// Updated ListView to support edit/delete buttons
const ListView = ({ posts, onEdit, onDelete }) => (
  <div>
    {posts.map(post => (
      <Card className="mb-3" key={post.id}>
        <Card.Body>
          <Row>
            <Col md={2}>
              <img src={post.imageUrl} alt={post.title} className="img-fluid rounded" />
            </Col>
            <Col md={8}>
              <h5>{post.title}</h5>
              {/*<div className="text-muted">{post.subtitle}</div>*/}
              <div>
                <Badge bg="info" className="me-1">{post.categoryTitle}</Badge>
                {post.subcategoryTitle && <Badge bg="secondary">{post.subcategoryTitle}</Badge>}
              </div>
              <div className="mt-2">
                {post.tags?.map(tag => <Badge bg="light" text="dark" key={tag} className="me-1">{tag}</Badge>)}
              </div>
              <div className="text-muted mt-2">
                {/* post.createdAt?.toDate().toLocaleDateString() */} 
                {post.createdAt instanceof Timestamp
                      ? post.createdAt.toDate().toLocaleDateString()
                      : new Date(post.createdAt).toLocaleDateString()}
                - {post.status}
              </div>
            </Col>
            {/* View Button */}
            <div>
              <div className="pull-right mt-3 d-flex gap-2 text-center">
                
                <Button variant="info" size="sm">
                  <Link to={`/dashboard/posts/${post.slug}`} className='text-white' style={{textDecoration:'none'}} >
                  View
                  </Link>
                </Button>
                
                <Link to={`/dashboard/postsui/${post.slug}`}>
                <Button variant="outline-default" size="sm" style={{outline: '2px', backgroundColor:'gray', color:'white' }} >Show</Button>
                </Link>
                {/* You can add Edit/Delete buttons here too */}
                <Button variant="outline-primary" size="sm" onClick={() => onEdit(post)}>
                  <FaEdit />
                </Button>
                <Link to={`/dashboard/posts/edit/${post.slug}`} className="btn btn-sm btn-warning me-2">Edit</Link>
                <Button variant="outline-danger" size="sm" onClick={() => onDelete(post.id)}><FaTrash /></Button>
            </div>
            </div>
           
          </Row>
        </Card.Body>
      </Card>
    ))}
  </div>
);

export default DashboardAllPostList;
