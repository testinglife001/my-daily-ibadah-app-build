// AllBlogs.jsx
import React, { useEffect, useState } from 'react';
import { collection, getDocs, query, orderBy, deleteDoc, doc } from 'firebase/firestore';
import Select from 'react-select';
import { Link, useNavigate } from 'react-router-dom';
import {
  Container, Row, Col, Form, Button, Card, Badge, ToggleButtonGroup, ToggleButton,
} from 'react-bootstrap';
import './AllBlogsList.css';
import { db } from '../../firebase';

export default function AllBlogsList({ user }) {

  const navigate = useNavigate();
  const [allBlogs, setAllBlogs] = useState([]);
  const [blogs, setBlogs] = useState([]);

  const [authors, setAuthors] = useState([]);
  const [tags, setTags] = useState([]);
  const [categories, setCategories] = useState([]);

  const [selectedAuthor, setSelectedAuthor] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [onlyMine, setOnlyMine] = useState(false);

  const [view, setView] = useState('grid'); // 'grid' or 'list'

  useEffect(() => {
    (async () => {
      const q = query(collection(db, 'blogs'), orderBy('timestamp', 'desc'));
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
      setAllBlogs(data);
      setBlogs(data);
      
      // … inside useEffect:
      const authorsArr = [...new Set(data.map(blog => blog.author || ""))].filter(a => a);
      setAuthors(authorsArr);
      // setAuthors([...new Set(data.map(b => b.author))]);
      setTags([...new Set(data.flatMap(b => b.tags || []))]);
      setCategories([...new Set(data.map(b => b.category))]);
    })();
  }, []);

  useEffect(() => {
    let filtered = [...allBlogs];
    if (selectedAuthor) filtered = filtered.filter(b => b.author === selectedAuthor);
    if (selectedTags.length > 0) filtered = filtered.filter(b => b.tags?.some(t => selectedTags.includes(t)));
    if (selectedCategories.length > 0) filtered = filtered.filter(b => selectedCategories.includes(b.category));
    if (onlyMine && user?.uid) filtered = filtered.filter(b => b.userId === user.uid);
    setBlogs(filtered);
  }, [selectedAuthor, selectedTags, selectedCategories, onlyMine, allBlogs, user]);

  const resetFilters = () => {
    setSelectedAuthor('');
    setSelectedTags([]);
    setSelectedCategories([]);
    setOnlyMine(false);
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this blog?');
    if (!confirmDelete) return;

    try {
      await deleteDoc(doc(db, 'blogs', id));
      alert('Blog deleted successfully!');
      navigate('/all-blogs'); // Adjust as needed
    } catch (error) {
      console.error('Error deleting blog:', error);
      alert('Failed to delete blog. Please try again.');
    }
  };

  return (
    <Container fluid className="m-2 mt-4 my-4">
      <Row className="m-2 mb-4">
        <Col md={10}>
          <Form>
            <Row>
              <Col md>
                {/*<Form.Label>Author</Form.Label>
                <Form.Control 
                as="select" 
                value={selectedAuthor} 
                onChange={e => setSelectedAuthor(e.target.value)}
                >
                <option value="">All Authors</option>
                {authors.map(a => (
                    <option key={a} value={a}>
                    {a}
                    </option>
                ))}
                </Form.Control>*/}
                <label>Author</label>
                <Select
                  options={[{ value: '', label: 'All Authors' }, ...authors.map(a => ({ value: a, label: a }))]}
                  value={{ value: selectedAuthor, label: selectedAuthor || 'All Authors' }}
                  onChange={opt => setSelectedAuthor(opt.value)}
                />
              </Col>
              <Col md>
                {/*<Form.Label>Tags</Form.Label>
                <Form.Control as="select" multiple value={selectedTags} onChange={e => setSelectedTags([...e.target.selectedOptions].map(o => o.value))}>
                  {tags.map(t => <option key={t}>{t}</option>)}
                </Form.Control>*/}
                <label>Tags</label>
                <Select
                  isMulti
                  options={tags.map(tag => ({ value: tag, label: tag }))}
                  value={selectedTags.map(tag => ({ value: tag, label: tag }))}
                  onChange={opts => setSelectedTags(opts.map(o => o.value))}
                />
              </Col>
              <Col md>
                {/*<Form.Label>Categories</Form.Label>
                <Form.Control as="select" multiple value={selectedCategories} onChange={e => setSelectedCategories([...e.target.selectedOptions].map(o => o.value))}>
                  {categories.map(c => <option key={c}>{c}</option>)}
                </Form.Control>*/}
                <label>Categories</label>
                <Select
                  isMulti
                  options={categories.map(cat => ({ value: cat, label: cat }))}
                  value={selectedCategories.map(cat => ({ value: cat, label: cat }))}
                  onChange={opts => setSelectedCategories(opts.map(o => o.value))}
                />
              </Col>
              <Col md="auto">
                <Form.Check
                  className="mt-4"
                  type="checkbox"
                  label="Only My Blogs"
                  checked={onlyMine}
                  onChange={e => setOnlyMine(e.target.checked)}
                />
              </Col>
              <Col md="auto">
                <Button variant="outline-secondary" className="mt-3" onClick={resetFilters}>Reset Filters</Button>
              </Col>
            </Row>
          </Form>
        </Col>
        <Col md={2} className="text-md-end mt-3 mt-md-0">
          <ToggleButtonGroup type="radio" name="viewToggle" defaultValue={view} onChange={val => setView(val)}>
            <ToggleButton id="grid" value="grid" variant={view === 'grid' ? "primary" : "outline-primary"}>Grid</ToggleButton>
            <ToggleButton id="list" value="list" variant={view === 'list' ? "primary" : "outline-primary"}>List</ToggleButton>
          </ToggleButtonGroup>
        </Col>
      </Row>

      <Row className="mb-3">
        <Col>
          <strong>Authors:</strong>{" "}
          {authors.map(author => (
            <Button
              key={author}
              variant={selectedAuthor === author ? "primary" : "outline-primary"}
              size="sm"
              className="me-2 mb-2"
              onClick={() => setSelectedAuthor(selectedAuthor === author ? '' : author)}
            >
              {author}
            </Button>
          ))}
        </Col>
      </Row>

      <Row className="mb-3">
        <Col>
          <strong>Categories:</strong>{" "}
          {categories.map((category,i) => (
            <Button
              key={i}
              variant={selectedCategories.includes(category) ? "success" : "outline-success"}
              size="sm"
              className="me-2 mb-2"
              onClick={() =>
                setSelectedCategories(prev =>
                  prev.includes(category)
                    ? prev.filter(c => c !== category)
                    : [...prev, category]
                )
              }
            >
              {category}
            </Button>
          ))}
        </Col>
      </Row>

      <Row className="mb-3">
        <Col>
          <strong>Tags:</strong>{" "}
          {tags.map(tag => (
            <Button
              key={tag}
              variant={selectedTags.includes(tag) ? "warning" : "outline-warning"}
              size="sm"
              className="me-2 mb-2"
              onClick={() =>
                setSelectedTags(prev =>
                  prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
                )
              }
            >
              #{tag}
            </Button>
          ))}
        </Col>
      </Row>

      
                  

      {view === 'grid' ? (
        <Row xs={1} md={2} lg={3} className='m-2' >
          {blogs.map(b => (
            <Col key={b.id} className='mb-4'>
              <Card className="blog-card h-100 ">
                {b.imgUrl && <Card.Img variant="top" src={b.imgUrl} className="blog-image" />}
                <Card.Body className="d-flex flex-column">
                  <Card.Title className="blog-title">{b.title}</Card.Title>
                  <Card.Text className="blog-meta">By {b.author} • <small>{b.category}</small></Card.Text>
                  <div className="blog-tags mb-2">
                    {b.tags?.map(t => <Badge key={t} bg="primary" className="me-1">{t}</Badge>)}
                  </div>
                  <Link to={`/view-blog/${b.id}`} className="btn btn-sm btn-outline-primary mt-auto">Read More</Link>
                  <br/>
                  {user?.uid === b.userId && (
                    <>
                      <Button variant="warning" size="sm"  >
                      <Link to={`/edit-blog/${b.id}`} className="text-white" style={{textDecoration:'none'}} >
                        Edit
                      </Link>
                      </Button>
                      &nbsp;
                      <Button variant="danger" size="sm" onClick={handleDelete} 
                          //onClick={() => handleDelete(post.id)}
                        >
                        Delete
                      </Button>
                    </>
                  )}
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      ) : (
        <div className="list-view">
          {blogs.map(b => (
            <Card key={b.id} className="mb-3">
              <Card.Body className="d-flex align-items-center gap-3">
                {b.imgUrl && (
                  <img
                    src={b.imgUrl}
                    alt="Thumbnail"
                    style={{ width: '200px', minHeight: '180px', borderRadius: '8px', objectFit: 'cover' }}
                  />
                )}
                <div className="flex-grow-1">
                  <Card.Title className="mb-1">{b.title}</Card.Title>
                  <Card.Text className="mb-2">
                    <small className="text-muted">By {b.author} • {b.category}</small>
                  </Card.Text>
                  <div className="mb-2">
                    {b.tags?.map(tag => (
                      <Badge bg="secondary" key={tag} className="me-1">{tag}</Badge>
                    ))}
                  </div>
                </div>
                <Link to={`/view-blog/${b.id}`} className="btn btn-sm btn-outline-primary">Read More</Link>
                {user?.uid === b.userId && (
                    <>
                      <Button variant="warning" size="sm"  >
                      <Link to={`/edit-blog/${b.id}`} className="text-white" style={{textDecoration:'none'}} >
                        Edit
                      </Link>
                      </Button>
                     
                      <Button variant="danger" size="sm" onClick={handleDelete} 
                          //onClick={() => handleDelete(post.id)}
                        >
                        Delete
                      </Button>
                    </>
                  )}
              </Card.Body>
            </Card>
          ))}
        </div>
      )}

      <Link to="/add-blog" className="add-blog-button">+</Link>
    </Container>
  );
}
