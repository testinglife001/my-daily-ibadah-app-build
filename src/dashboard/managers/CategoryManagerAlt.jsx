import React, { useEffect, useState } from "react";
import {
  addCategoryAlt,
  deleteCategoryAlt,
  getCategoriesAlt,
  updateCategoryAlt,
} from "../../services/CategoryService";
import { buildCategoryTree } from "./buildCategoryTree";
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  Card,
  Modal,
  Stack,
  InputGroup
} from "react-bootstrap";
import { Link } from "react-router-dom";

const CategoryNode = ({ node, onAddSub, onDelete, onRename }) => {
  const [newName, setNewName] = useState(node.name);
  const [isEditing, setIsEditing] = useState(false);
  const [editableName, setEditableName] = useState(node.name);
  const editableRef = React.useRef(null);

  const handleBlur = () => {
    setIsEditing(false);
    if (editableName.trim() && editableName !== node.name) {
      onRename(node.id, editableName);
    }
  };

  return (
    <Card className="mb-2 ms-3">
      <Card.Body className="py-2">
        <Stack direction="horizontal" gap={2} className="align-items-center">
          <div
            ref={editableRef}
            contentEditable={isEditing}
            suppressContentEditableWarning
            className={`flex-grow-1 px-2 rounded ${
              isEditing ? "bg-light border" : ""
            }`}
            onBlur={handleBlur}
            onInput={(e) => setEditableName(e.currentTarget.textContent)}
          >
            {editableName}
          </div>
          <Button size="sm" variant="outline-primary" onClick={() => onAddSub(node.id)}>
            + Sub
          </Button>
          <Button
            size="sm"
            variant="outline-secondary"
            onClick={() => setIsEditing(true)}
          >
            ✏️
          </Button>
          <Button size="sm" variant="outline-danger" onClick={() => onDelete(node.id)}>
            🗑
          </Button>
        </Stack>
        {node.children &&
          node.children.map((child) => (
            <CategoryNode
              key={child.id}
              node={child}
              onAddSub={onAddSub}
              onDelete={onDelete}
              onRename={onRename}
            />
          ))}
      </Card.Body>
    </Card>
  );
};

const CategoryManagerAlt = () => {
  const [categories, setCategories] = useState([]);
  const [rootName, setRootName] = useState("");
  const [deleteId, setDeleteId] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [parentIdForSub, setParentIdForSub] = useState(null);
  const [newSubName, setNewSubName] = useState('');

  const fetchCategories = async () => {
    const all = await getCategoriesAlt();
    setCategories(all);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleAddRoot = async () => {
    if (!rootName.trim()) return;
    await addCategoryAlt(rootName.trim());
    setRootName("");
    fetchCategories();
  };

  const handleAddSub = async (parentId) => {
    const name = prompt("Enter subcategory name:");
    if (!name?.trim()) return;
    await addCategoryAlt(name.trim(), parentId);
    // setParentIdForSub(parentId);
    // setNewSubName('');
    // setShowAddModal(true);
    fetchCategories();
  };

  const openAddSubModal = (parentId) => {
    setParentIdForSub(parentId);
    setNewSubName('');
    setShowAddModal(true);
  };

  const confirmAddSub = async () => {
    if (!newSubName.trim()) return;
    await addCategoryAlt(newSubName, parentIdForSub);
    setShowAddModal(false);
    fetchCategories();
  };

  const handleRename = async (id, newName) => {
    if (!newName.trim()) return;
    await updateCategoryAlt(id, newName);
    fetchCategories();
  };

  const openDeleteModal = (id) => {
    setDeleteId(id);
    setShowDeleteModal(true);
  };


  const handleDelete = async () => {
    if (deleteId) {
      await deleteCategoryAlt(deleteId);
      setDeleteId(null);
      setShowModal(false);
      setShowDeleteModal(false);
      fetchCategories();
    }
  };

  const tree = buildCategoryTree(categories);

  return (
    <Container className="py-4">
      <h3 className="mb-4">📂 Category Manager Alternative</h3>
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
      

      <Row className="mb-3">
        <Col md={12}>
          <Form className="d-flex gap-2">
            <Form.Control
              value={rootName}
              onChange={(e) => setRootName(e.target.value)}
              placeholder="Add new root category"
            />
            <Button onClick={handleAddRoot} variant="success">
              ➕ Add
            </Button>
          </Form>
        </Col>
      </Row>

      <div>
        {tree.map((cat) => (
          <CategoryNode
            key={cat.id}
            node={cat}
            // onAddSub={handleAddSub}
             onAddSub={openAddSubModal}
            // onDelete={(id) => {
            //  setDeleteId(id);
            //  setShowModal(true);
            // }}
             onDelete={openDeleteModal}
            onRename={handleRename}
          />
        ))}
      </div>


      {/* Add Subcategory Modal */}
      <Modal show={showAddModal} onHide={() => setShowAddModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Add Subcategory</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Control
            placeholder="Subcategory name"
            value={newSubName}
            onChange={(e) => setNewSubName(e.target.value)}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowAddModal(false)}>
            Cancel
          </Button>
          <Button variant="success" onClick={confirmAddSub}>
            Add
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Delete Category</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete this category?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
      {/* Delete Confirm Modal 
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete this category?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal> */}
    </Container>
  );
};

export default CategoryManagerAlt;
