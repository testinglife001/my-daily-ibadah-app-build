import React, { useEffect, useState } from 'react';
import {
  Card,
  Form,
  Button,
  ListGroup,
  Row,
  Col,
  Badge,
  InputGroup,
  Collapse,
  Modal
} from 'react-bootstrap';
import {
  addCategory,
  deleteCategory,
  getCategories,
  updateCategory
} from '../../services/CategoryService';
import { Link } from 'react-router-dom';

const SingleSubcategoryManager = () => {
  const [categories, setCategories] = useState([]);
   const [allcategories, setAllCategories] = useState([]);
   const [subcategories, setSubcategories] = useState([]);
  const [selectedCat, setSelectedCat] = useState('');
  const [subName, setSubName] = useState('');

  const [newCategoryName, setNewCategoryName] = useState('');
  const [expanded, setExpanded] = useState({});
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentEdit, setCurrentEdit] = useState({ id: '', name: '' });

  const fetch = async () => {
    const all = await getCategories();
    setCategories(all.filter(c => !c.parentId));
    if (selectedCat) {
      // setSubcategories(all.filter(c => c.parentId === selectedCat));
       const subcategories = all.filter(c => c.parentId === selectedCat);
    }
  };

  
  useEffect(() => {
    fetch();
  }, [selectedCat]);
  

   const selectedSubcategories = allcategories.filter(c => c.parentId === selectedCat); // 🟢 PUT THIS HERE

  const handleAddSub = async () => {
    if (subName && selectedCat) {
      await addCategory(subName, selectedCat);
      setSubName('');
      fetch();
    }
  };

  const handleDelete = async (id) => {
    await deleteCategory(id);
    fetch();
  };

  const fetchCats = async () => {
    const all = await getCategories();
    setAllCategories(all);
    const subcategories = allcategories.filter(c => c.parentId === selectedCat);
  };

  useEffect(() => { fetchCats(); }, []);

  const handleAdd = async () => {
    if (!newCategoryName.trim()) return;
    await addCategory({ name: newCategoryName });
    setNewCategoryName('');
    fetchCats();
  };

  const handleDeleteCat = async (id) => {
    await deleteCategory(id);
    fetchCats();
  };

  const handleEdit = async () => {
    if (!currentEdit.name.trim()) return;
    await updateCategory(currentEdit.id, { name: currentEdit.name });
    setShowEditModal(false);
    fetchCats();
  };

  const toggleExpand = (id) => {
     setExpanded(prev => ({ ...prev, [id]: !prev[id] }));
    // setExpanded(prev => ({ ...prev, [id]: true }));
  };

  const renderSubcategories = (parentId) => {
    // const subs = categories.filter(cat => cat.parentId === parentId);
    const subs = allcategories.filter(cat => cat.parentId === parentId);

    if (!subs.length) return null;

    return (
      <Collapse in={expanded[parentId]}>
        <div>
          <ListGroup className="ms-4 mt-2">
            {subs.map(sub => (
              <ListGroup.Item
                key={sub.id}
                className="d-flex justify-content-between align-items-center"
              >
                <span>{sub.name}</span>
                <div>
                  <Button
                    variant="outline-primary"
                    size="sm"
                    onClick={() => {
                      setCurrentEdit({ id: sub.id, name: sub.name });
                      setShowEditModal(true);
                    }}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="outline-danger"
                    size="sm"
                    onClick={() => handleDeleteCat(sub.id)}
                  >
                    Delete
                  </Button>
                </div>
              </ListGroup.Item>
            ))}
          </ListGroup>
        </div>
      </Collapse>
    );
  };



  return (
    <>
    <Card className="p-4 shadow-sm border-0 rounded-4">
      <h4 className="mb-4">Manage Subcategories</h4>

      <div className="d-flex flex-wrap gap-2 mb-4">
        <Link to="/dashboard/category-manager" className="btn btn-info text-white">
          Category
        </Link>
        <Link to="/dashboard/category-manager-alt" className="btn btn-warning text-white">
          Category Alternative
        </Link>
        <Link to="/dashboard/category-manager-ui" className="btn btn-secondary text-white">
          Category UI
        </Link>
        <Link to="/dashboard/single-category-manager" className="btn btn-danger text-white">
          Single Category
        </Link>
        <Link to="/dashboard/single-subcategory-manager" className="btn btn-dark text-white">
          Single Subcategory
        </Link>
      </div>

      <Form.Group className="mb-3">
        <Form.Label>Select Category</Form.Label>
        <Form.Select
          value={selectedCat}
          onChange={e => setSelectedCat(e.target.value)}
        >
          <option value="">-- Select Category --</option>
          {categories.map(c => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </Form.Select>
      </Form.Group>

      {selectedCat && (
        <>
          <Form.Group as={Row} className="align-items-end mb-4">
            <Form.Label column sm={4}>New Subcategory</Form.Label>
            <Col sm={8}>
              <InputGroup>
                <Form.Control
                  placeholder="Enter subcategory name"
                  value={subName}
                  onChange={e => setSubName(e.target.value)}
                />
                <Button variant="primary" onClick={handleAddSub}>
                  Add
                </Button>
              </InputGroup>
            </Col>
          </Form.Group>

          <h5>Subcategories</h5>
          <ListGroup variant="flush">
            {subcategories.length === 0 && (
              <ListGroup.Item>No subcategories found.</ListGroup.Item>
            )}
            {selectedSubcategories.map((sc) => (
            //subcategories.map(sc => (
              <ListGroup.Item
                key={sc.id}
                className="d-flex justify-content-between align-items-center"
              >
                <Badge bg="secondary" className="me-2">{sc.name}</Badge>
                <Button
                  variant="outline-danger"
                  size="sm"
                  onClick={() => handleDelete(sc.id)}
                >
                  Delete
                </Button>
              </ListGroup.Item>
            ))}
          </ListGroup>
        </>
      )}
    </Card>

    <div className="container py-4">
      <h4 className="mb-3">Category Manager</h4>

      <Form className="d-flex mb-3" onSubmit={e => e.preventDefault()}>
        <Form.Control
          type="text"
          placeholder="Add new category"
          value={newCategoryName}
          onChange={(e) => setNewCategoryName(e.target.value)}
        />
        <Button className="ms-2" onClick={handleAdd}>Add</Button>
      </Form>

      <ListGroup>
        {allcategories.filter(cat => !cat.parentId).map(cat => (
          <ListGroup.Item key={cat.id} className="d-flex flex-column">
            <Row className="align-items-center">
              <Col xs={8}>
                <span
                  role="button"
                  className="fw-bold text-primary"
                  onClick={() => toggleExpand(cat.id)}
                >
                  {expanded[cat.id] ? '▼' : '▶'} {cat.name}
                </span>
              </Col>
              <Col xs="auto">
                <Button
                  variant="outline-primary"
                  size="sm"
                  onClick={() => {
                    setCurrentEdit({ id: cat.id, name: cat.name });
                    setShowEditModal(true);
                  }}
                >
                  Edit
                </Button>{' '}
                <Button variant="outline-danger" size="sm" onClick={() => handleDeleteCat(cat.id)}>
                  Delete
                </Button>
              </Col>
            </Row>
            {renderSubcategories(cat.id)}
          </ListGroup.Item>
        ))}
      </ListGroup>


      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Category</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Control
            type="text"
            value={currentEdit.name}
            onChange={(e) => setCurrentEdit(prev => ({ ...prev, name: e.target.value }))}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>Cancel</Button>
          <Button variant="primary" onClick={handleEdit}>Save Changes</Button>
        </Modal.Footer>
      </Modal>
    </div>

    </>
  );
};

export default SingleSubcategoryManager;
