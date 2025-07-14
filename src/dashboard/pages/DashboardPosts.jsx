import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button, ButtonGroup, Form, ListGroup, Pagination } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../firebase';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';


const POSTS_PER_PAGE = 6;

const DashboardPosts = () => {

    const [posts, setPosts] = useState([]);
    const [filtered, setFiltered] = useState([]);
    const [categories, setCategories] = useState([]);
    const [subcategories, setSubcategories] = useState([]);
    const [tags, setTags] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [filteredSubcategories, setFilteredSubcategories] = useState([]);
    const [selectedSubcategory, setSelectedSubcategory] = useState('');
    const [selectedTag, setSelectedTag] = useState('');
    const [sortBy, setSortBy] = useState('date-desc');
    const [view, setView] = useState('grid');
    const [currentPage, setCurrentPage] = useState(1);

    /*
    useEffect(() => {
        const fetchPosts = async () => {
            const querySnapshot = await getDocs(collection(db, 'posts'));
            const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setPosts(data);
            setFiltered(data);

            // Gather unique categories and tags
            // const catSet = new Set();
            const tagSet = new Set();
            data.forEach(post => {
                // if (post.category) catSet.add(post.category);
                if (Array.isArray(post.tags)) post.tags.forEach(tag => tagSet.add(tag));
            });
            // setCategories([...catSet]);
            // console.log(categories);
            setTags([...tagSet]);
            // Now fetch categories collection
            // const catSnapshot = await getDocs(collection(db, 'categories'));
            // Fetch all categories (both parent and subcategories)
            const categorySnapshot = await getDocs(collection(db, 'categories'));
            const allCategories = categorySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            }));

            // Separate categories and subcategories based on parentId
            const mainCategories = allCategories.filter(cat => cat.parentId === null);
            const subCats = allCategories.filter(cat => cat.parentId !== null);

            setCategories(mainCategories);
            setSubcategories(subCats);
        fetchPosts();
    }, []);
    */

    useEffect(() => {
    if (selectedCategory) {
        const filteredSubs = subcategories.filter(sub => sub.parentId === selectedCategory);
        setFilteredSubcategories(filteredSubs);
        setSelectedSubcategory('');
    } else {
        setFilteredSubcategories([]);
        setSelectedSubcategory('');
    }
    }, [selectedCategory, subcategories]);


    useEffect(() => {
        const fetchData = async () => {
            // Fetch posts
            const postsSnapshot = await getDocs(collection(db, 'posts'));
            const postsData = postsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setPosts(postsData);
            setFiltered(postsData);

            // Extract tags
            const tagSet = new Set();
            postsData.forEach(post => {
            if (Array.isArray(post.tags)) post.tags.forEach(tag => tagSet.add(tag));
            });
            setTags([...tagSet]);

            // Fetch all categories (both parent and subcategories)
            const categorySnapshot = await getDocs(collection(db, 'categories'));
            const allCategories = categorySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            }));

            // Separate categories and subcategories based on parentId
            const mainCategories = allCategories.filter(cat => cat.parentId === null);
            const subCats = allCategories.filter(cat => cat.parentId !== null);

            setCategories(mainCategories);
            setSubcategories(subCats);
        };

        fetchData();
        }, []);


    /*
    useEffect(() => {
        let filteredPosts = [...posts];

        // Filtering
        if (selectedCategory) {
        filteredPosts = filteredPosts.filter(post => post.category === selectedCategory);
        }
        if (selectedTag) {
        filteredPosts = filteredPosts.filter(post => post.tags?.includes(selectedTag));
        }

        // Sorting
        switch (sortBy) {
        case 'date-asc':
            filteredPosts.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
            break;
        case 'date-desc':
            filteredPosts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            break;
        case 'title-asc':
            filteredPosts.sort((a, b) => a.title.localeCompare(b.title));
            break;
        case 'title-desc':
            filteredPosts.sort((a, b) => b.title.localeCompare(a.title));
            break;
        default:
            break;
        }

        setFiltered(filteredPosts);
        setCurrentPage(1); // reset page on filter/sort change
    }, [posts, selectedCategory, selectedTag, sortBy]);
    */

    useEffect(() => {
    let filteredPosts = [...posts];

    if (selectedCategory) {
        filteredPosts = filteredPosts.filter(post => post.categoryId === selectedCategory);
    }

    if (selectedSubcategory) {
        filteredPosts = filteredPosts.filter(post => post.subcategoryId === selectedSubcategory);
    }

    if (selectedTag) {
        filteredPosts = filteredPosts.filter(post => post.tags?.includes(selectedTag));
    }

    switch (sortBy) {
        case 'date-asc':
        filteredPosts.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        break;
        case 'date-desc':
        filteredPosts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
        case 'title-asc':
        filteredPosts.sort((a, b) => a.title.localeCompare(b.title));
        break;
        case 'title-desc':
        filteredPosts.sort((a, b) => b.title.localeCompare(a.title));
        break;
    }

    setFiltered(filteredPosts);
    setCurrentPage(1);
    }, [posts, selectedCategory, selectedSubcategory, selectedTag, sortBy]);


    // Pagination
    const indexOfLastPost = currentPage * POSTS_PER_PAGE;
    const indexOfFirstPost = indexOfLastPost - POSTS_PER_PAGE;
    const currentPosts = filtered.slice(indexOfFirstPost, indexOfLastPost);
    const totalPages = Math.ceil(filtered.length / POSTS_PER_PAGE);

    const paginate = (pageNum) => setCurrentPage(pageNum);

    return (
        <div>
        <Container className="my-4">
            <Row className="mb-3">

                <Col md={3}>
                    <Form.Select value={selectedCategory} onChange={e => setSelectedCategory(e.target.value)}>
                        <option value="">All Categories</option>
                        {categories.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                    </Form.Select>
                </Col>

                <Col md={3}>
                    <Form.Select value={selectedSubcategory} onChange={e => setSelectedSubcategory(e.target.value)} disabled={!filteredSubcategories.length}>
                        <option value="">All Subcategories</option>
                        {filteredSubcategories.map(sub => (
                        <option key={sub.id} value={sub.id}>{sub.name}</option>
                        ))}
                    </Form.Select>
                </Col>

                <Col md={3}>
                    <Form.Select value={selectedTag} onChange={e => setSelectedTag(e.target.value)}>
                        <option value="">All Tags</option>
                        {tags.map(tag => (
                        <option key={tag} value={tag}>{tag}</option>
                        ))}
                    </Form.Select>
                </Col>

                <Col md={3}>
                    <Form.Select value={sortBy} onChange={e => setSortBy(e.target.value)}>
                        <option value="date-desc">Newest First</option>
                        <option value="date-asc">Oldest First</option>
                        <option value="title-asc">Title A-Z</option>
                        <option value="title-desc">Title Z-A</option>
                    </Form.Select>
                </Col>


            </Row>

            <ButtonGroup className='pull-right' >
                    <Button  variant={view === 'grid' ? 'primary' : 'outline-primary'} onClick={() => setView('grid')}>Grid</Button>
                    <Button variant={view === 'list' ? 'primary' : 'outline-primary'} onClick={() => setView('list')}>List</Button>
                </ButtonGroup>

            <div className='d-flex' >
                <DropdownButton
                    as='ButtonGroup'
                    // key={variant}
                    // id={dropdown-variants-Primary}
                    variant='info'
                    title='Note'
                >
                    <Dropdown.Item eventKey="1">
                        <Link to='/add-note/post/id' >Add Note</Link>
                    </Dropdown.Item>
                    <Dropdown.Item eventKey="2">Another action</Dropdown.Item>
                    <Dropdown.Item eventKey="3" active>
                    Active Item
                    </Dropdown.Item>
                    <Dropdown.Divider />
                    <Dropdown.Item eventKey="4">Separated link</Dropdown.Item>
                </DropdownButton>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <DropdownButton
                    as='ButtonGroup'
                    // key={variant}
                    // id={dropdown-variants-Primary}
                    variant='danger'
                    title='Todo'
                >
                    <Dropdown.Item eventKey="1">Action</Dropdown.Item>
                    <Dropdown.Item eventKey="2">Another action</Dropdown.Item>
                    <Dropdown.Item eventKey="3" active>
                    Active Item
                    </Dropdown.Item>
                    <Dropdown.Divider />
                    <Dropdown.Item eventKey="4">Separated link</Dropdown.Item>
                </DropdownButton>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <DropdownButton
                    as='ButtonGroup'
                    // key={variant}
                    // id={dropdown-variants-Primary}
                    variant='success'
                    title='Task'
                >
                    <Dropdown.Item eventKey="1">Action</Dropdown.Item>
                    <Dropdown.Item eventKey="2">Another action</Dropdown.Item>
                    <Dropdown.Item eventKey="3" active>
                    Active Item
                    </Dropdown.Item>
                    <Dropdown.Divider />
                    <Dropdown.Item eventKey="4">Separated link</Dropdown.Item>
                </DropdownButton>
                
            </div>

            {view === 'grid' ? (
                <Row>
                {currentPosts.map(post => (
                    <Col key={post.id} md={4} className="m-2">
                    <Card>
                        {post.imageUrl && <Card.Img variant="top" src={post.imageUrl} />}
                        <Card.Body>
                        <Card.Title>{post.title}</Card.Title>
                        <Card.Subtitle className="mb-2 text-muted">{post.category}</Card.Subtitle>
                        {/*<Card.Text>{post.subtitle}</Card.Text>*/}
                        <Link to={`/dashboard/posts/${post.slug || post.id}`}>Read More</Link>
                        <br/>
                        <Link to={`/dashboard/posts/edit/${post.slug || post.id}`}>Edit</Link>
                        </Card.Body>
                    </Card>
                    </Col>
                ))}
                </Row>
            ) : (
                <ListGroup>
                {currentPosts.map(post => (
                    <ListGroup.Item key={post.id}>
                    <h5>{post.title}</h5>
                    <p className="mb-1">{post.subtitle}</p>
                    <small>{post.category} | {post.tags?.join(', ')}</small><br />
                    <Link to={`/dashboard/posts/${post.slug || post.id}`}>Read More</Link>
                    <br/>
                    <Link to={`/dashboard/posts/edit/${post.slug || post.id}`}>Edit</Link>
                    </ListGroup.Item>
                ))}
                </ListGroup>
            )}

            <div className="d-flex justify-content-center mt-4">
                <Pagination>
                {[...Array(totalPages).keys()].map(num => (
                    <Pagination.Item
                    key={num + 1}
                    active={num + 1 === currentPage}
                    onClick={() => paginate(num + 1)}
                    >
                    {num + 1}
                    </Pagination.Item>
                ))}
                </Pagination>
            </div>
        </Container>
        </div>
    )
    }

    export default DashboardPosts