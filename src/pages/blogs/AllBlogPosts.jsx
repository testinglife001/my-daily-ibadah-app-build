import React, { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  query,
  orderBy,
  where,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db } from "../../firebase";
import { Link } from "react-router-dom";
import {
  Card,
  Button,
  Row,
  Col,
  Form,
  InputGroup,
  Table,
} from "react-bootstrap";

const AllBlogPosts = ({ user }) => {
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedTag, setSelectedTag] = useState("");

  const [onlyMine, setOnlyMine] = useState(false);

  const [viewMode, setViewMode] = useState("grid"); // "grid" or "list"

  const fetchPosts = async () => {
    const q = query(collection(db, "blogposts"), orderBy("timestamp", "desc"));
    const querySnapshot = await getDocs(q);
    const data = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    setPosts(data);
    setFilteredPosts(data);

    // Auto-extract unique categories and tags
    const uniqueCategories = [...new Set(data.map(post => post.category).filter(Boolean))];
    const uniqueTags = [...new Set(data.flatMap(post => post.tags || []))];
    setCategories(uniqueCategories);
    setTags(uniqueTags);
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  // Filter handler
  useEffect(() => {
    let filtered = [...posts];

    if (search.trim() !== "") {
      filtered = filtered.filter(post =>
        post.title.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (selectedCategory) {
      filtered = filtered.filter(post => post.category === selectedCategory);
    }

    if (selectedTag) {
      filtered = filtered.filter(post =>
        post.tags?.includes(selectedTag)
      );
    }

    if (onlyMine && user?.uid) filtered = filtered.filter(post => post.userId === user.uid);

    setFilteredPosts(filtered);
  }, [search, selectedCategory, selectedTag, posts, onlyMine, user]);

  const handleDelete = async (postId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this post?");
    if (!confirmDelete) return;

    try {
      await deleteDoc(doc(db, "blogposts", postId));
      const updatedPosts = posts.filter((post) => post.id !== postId);
      setPosts(updatedPosts);
    } catch (error) {
      console.error("Error deleting post:", error);
      alert("Error deleting post");
    }
  };


  return (
    <div className="container-fluid ml-3 mr-3 mb-3 my-4">
      <h3 className="mb-4 text-center">All Blog Posts</h3>

      {/* Filters */}
      <Row className="mb-4">
        <Col md={4}>
          <InputGroup>
            <Form.Control
              placeholder="Search by title..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </InputGroup>
        </Col>
        <Col md={3}>
          <Form.Select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="">All Categories</option>
            {categories.map((cat, i) => (
              <option key={i} value={cat}>
                {cat}
              </option>
            ))}
          </Form.Select>
        </Col>
        <Col md="auto">
          <Form.Select
            value={selectedTag}
            onChange={(e) => setSelectedTag(e.target.value)}
          >
            <option value="">All Tags</option>
            {tags.map((tag, i) => (
              <option key={i} value={tag}>
                {tag}
              </option>
            ))}
          </Form.Select>
        </Col>

        <Col md="auto">
          <Form.Check
            className="mt-2"
            type="checkbox"
            label="My BlogPosts"
            checked={onlyMine}
            onChange={e => setOnlyMine(e.target.checked)}
          />
        </Col>
        
        <Col md={2}>
          <Button
            variant={viewMode === "grid" ? "outline-secondary" : "secondary"}
            onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")}
          >
            Toggle {viewMode === "grid" ? "List" : "Grid"} View
          </Button>
        </Col>
        

      </Row>

      
      <Row>
        <Col md={12} className="mb-2">
          <div>
            <strong>Categories:</strong>{" "}
            {categories.map((cat, i) => (
              <Button
                key={i}
                variant={selectedCategory === cat ? "primary" : "outline-primary"}
                size="sm"
                className="me-2 mb-2"
                onClick={() => setSelectedCategory(cat === selectedCategory ? "" : cat)}
              >
                {cat}
              </Button>
            ))}
          </div>
        </Col>

        <Col md={12} className="mb-2">
          <div>
            <strong>Tags:</strong>{" "}
            {tags.map((tag, i) => (
              <Button
                key={i}
                variant={selectedTag === tag ? "success" : "outline-success"}
                size="sm"
                className="me-2 mb-2"
                onClick={() => setSelectedTag(tag === selectedTag ? "" : tag)}
              >
                {tag}
              </Button>
            ))}
          </div>
        </Col>

      </Row>
   

      {viewMode === "grid" ? (
        <Row>
          {filteredPosts.length === 0 ? (
            <p>No matching blog posts found.</p>
          ) : (
            filteredPosts.map((post) => (
            <Col md={4} lg={3} className="mb-4" key={post.id}>
              <Card >
                <Card.Img variant="top" src={post.primaryImg} height="200" />
                <Card.Body style={{height:'250px', marginBottom:'-10%'}} >
               
                  <Card.Title>{post.title.substring(0, 30)}{post.title.length > 30 && '...'}</Card.Title>
                  <Card.Text>
                    <strong>Author:</strong> {post.author} <br />
                    <strong>Category:</strong> {post.category}
                  </Card.Text>
                  <Button variant="success" size="sm"  >
                    <Link to={`/blog-posts/${post.id}`}  className="text-white" style={{textDecoration:'none'}}  >
                      View
                    </Link>
                  </Button>
                  &nbsp;
                  {user?.uid === post.userId && (
                    <>
                      <Button variant="warning" size="sm"  >
                      <Link to={`/edit-blog-post/${post.id}`} className="text-white" style={{textDecoration:'none'}} >
                        Edit
                      </Link>
                      </Button>
                      &nbsp;
                      <Button variant="danger" size="sm"  onClick={() => handleDelete(post.id)}>
                        Delete
                      </Button>
                    </>
                  )}
                </Card.Body>
              </Card>
            </Col>
          ))
        )}
        </Row>
      ) : (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>Image</th>
              <th>Title</th>
              <th>Author</th>
              <th>Category</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredPosts.length === 0 ? (
              <p>No matching blog posts found.</p>
            ) : (
            filteredPosts.map((post) => (
              <tr key={post.id}>
                <td>
                  <img src={post.imgUrl} alt={post.title} width="100" />
                </td>
                <td>{post.title}</td>
                <td>{post.author}</td>
                <td>{post.category}</td>
                <td>
                  <Button variant="success" size="sm"  >
                    <Link to={`/blog-posts/${post.id}`}  className="text-white" style={{textDecoration:'none'}}  >
                      View
                    </Link>
                  </Button>
                  &nbsp;
                  {user?.uid === post.userId && (
                    <>
                      <Button variant="warning" size="sm"  >
                      <Link to={`/edit-blog-post/${post.id}`} className="text-white" style={{textDecoration:'none'}} >
                        Edit
                      </Link>
                      </Button>
                      &nbsp;
                      <Button variant="danger" size="sm" onClick={() => handleDelete(post.id)}>
                        Delete
                      </Button>
                    </>
                  )}
                </td>
              </tr>
            ))
          )}
          </tbody>
        </Table>
      )}

    </div>
  );
};

export default AllBlogPosts;
