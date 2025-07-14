import React, { useState, useEffect } from 'react';
import {
  Button,
  Form,
  Card,
  InputGroup,
  ListGroup,
  Collapse,
  Modal,
} from 'react-bootstrap';
import { Trash, Pencil, ChevronDown, ChevronRight } from 'react-bootstrap-icons';
import { addCategory, deleteCategory, getCategories } from '../../services/CategoryService';
import { Link } from 'react-router-dom';


const SingleCategoryManager = () => {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState('');
  const [parentId, setParentId] = useState(null);
  const [expanded, setExpanded] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [editData, setEditData] = useState({ id: '', name: '' });

  const fetch = async () => {
    const all = await getCategories();
    setCategories(all);
  };

  useEffect(() => { fetch(); }, []);

  const handleAdd = async () => {
    if (!name.trim()) return;
    await addCategory(name, parentId);
    setName('');
    setParentId(null);
    fetch();
  };

  const handleDelete = async (id) => {
    await deleteCategory(id);
    fetch();
  };

  const handleUpdate = async () => {
    if (!editData.name.trim()) return;
    await updateCategory(editData.id, editData.name);
    setShowModal(false);
    fetch();
  };

  const buildTree = (parentId = null) => {
    return categories
      .filter(cat => cat.parentId === parentId)
      .map(cat => (
        <ListGroup.Item key={cat.id}>
          <div className="d-flex justify-content-between align-items-center">
            <div>
              {categories.some(c => c.parentId === cat.id) && (
                <Button
                  variant="link"
                  size="sm"
                  onClick={() => setExpanded(prev => ({ ...prev, [cat.id]: !prev[cat.id] }))}
                  className="p-0 me-2"
                >
                  {expanded[cat.id] ? <ChevronDown /> : <ChevronRight />}
                </Button>
              )}
              {cat.name}
            </div>
            <div>
              <Button
                variant="outline-primary"
                size="sm"
                className="me-2"
                onClick={() => {
                  setEditData({ id: cat.id, name: cat.name });
                  setShowModal(true);
                }}
              >
                <Pencil />
              </Button>
              <Button
                variant="outline-danger"
                size="sm"
                onClick={() => handleDelete(cat.id)}
              >
                <Trash />
              </Button>
            </div>
          </div>
          <Collapse in={expanded[cat.id]}>
            <div className="ms-4 mt-2">
              <ListGroup>{buildTree(cat.id)}</ListGroup>
            </div>
          </Collapse>
        </ListGroup.Item>
      ));
  };

  return (
    <>
    <Card className="p-3 shadow-sm rounded-3">
      <h4 className="mb-3 text-primary">Manage Main Categories</h4>
    </Card>

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

    <Card className="p-3 shadow-sm rounded-3">
      <h4 className="mb-3 text-primary">Single Category Manager</h4>

      <Form onSubmit={(e) => { e.preventDefault(); handleAdd(); }}>
        <InputGroup className="mb-3">
          <Form.Control
            type="text"
            value={name}
            placeholder="Enter category name"
            onChange={(e) => setName(e.target.value)}
          />
          <Form.Select
            value={parentId || ''}
            onChange={e => setParentId(e.target.value || null)}
            className="w-auto"
          >
            <option value="">Top Level</option>
            {categories.filter(c => !c.parentId).map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </Form.Select>
          <Button variant="primary" type="submit">Add</Button>
        </InputGroup>
      </Form>

      <ListGroup>{buildTree()}</ListGroup>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Category</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Category Name</Form.Label>
              <Form.Control
                type="text"
                value={editData.name}
                onChange={(e) => setEditData(prev => ({ ...prev, name: e.target.value }))}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
          <Button variant="primary" onClick={handleUpdate}>Save Changes</Button>
        </Modal.Footer>
      </Modal>
    </Card>
    </>
  );
};

export default SingleCategoryManager;
