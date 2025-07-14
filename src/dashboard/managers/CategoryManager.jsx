import React, { useEffect, useState } from "react";
import {
  addCategoryAlt,
  deleteCategoryAlt,
  getCategoriesAlt,
  updateCategoryAlt,
} from "../../services/CategoryService";
import { buildCategoryTree } from "./buildCategoryTree";
import {
  Button,
  Card,
  Form,
  Modal,
  Collapse,
  Stack,
} from "react-bootstrap";
// import { ChevronDown, ChevronRight, Pencil, Trash, Plus } from "lucide-react";
import { ChevronDown, ChevronRight, Pencil, Plus, Trash } from 'react-bootstrap-icons';
import { Link } from "react-router-dom";


const CatNode = ({ node, onAddSub, onDelete, onRename }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [nameInput, setNameInput] = useState(node.name);
  const [showAddInput, setShowAddInput] = useState(false);
  const [newSubName, setNewSubName] = useState('');

  const handleRename = () => {
    onRename(node.id, nameInput);
    setIsEditing(false);
  };

  return (
    <div className="ms-3 mt-2 border-start ps-3">
      <div className="d-flex align-items-center justify-content-between">
        <div className="d-flex align-items-center gap-2">
          {node.children?.length > 0 && (
            <Button variant="link" size="sm" onClick={() => setIsExpanded(!isExpanded)}>
              {isExpanded ? <ChevronDown /> : <ChevronRight />}
            </Button>
          )}
          {isEditing ? (
            <Form.Control
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              onBlur={handleRename}
              onKeyDown={(e) => e.key === 'Enter' && handleRename()}
              size="sm"
              autoFocus
              className="w-auto"
            />
          ) : (
            <strong>{node.name}</strong>
          )}
        </div>

        <div className="d-flex gap-2">
          <Button variant="outline-primary" size="sm" onClick={() => setShowAddInput(!showAddInput)}>
            <Plus size={14} />
          </Button>
          <Button variant="outline-secondary" size="sm" onClick={() => setIsEditing(true)}>
            <Pencil size={14} />
          </Button>
          <Button variant="outline-danger" size="sm" onClick={() => onDelete(node.id)}>
            <Trash size={14} />
          </Button>
        </div>
      </div>

      {/* Add subcategory input */}
      {showAddInput && (
        <div className="mt-1 d-flex gap-2">
          <Form.Control
            size="sm"
            placeholder="Subcategory name"
            value={newSubName}
            onChange={(e) => setNewSubName(e.target.value)}
          />
          <Button
            size="sm"
            variant="success"
            onClick={() => {
              if (newSubName.trim()) {
                onAddSub(node.id, newSubName.trim());
                setNewSubName('');
                setShowAddInput(false);
              }
            }}
          >
            Add
          </Button>
        </div>
      )}

      {/* Render children recursively */}
      <Collapse in={isExpanded}>
        <div>
          {node.children?.map((child) => (
            <CategoryNode
              key={child.id}
              node={child}
              onAddSub={onAddSub}
              onDelete={onDelete}
              onRename={onRename}
            />
          ))}
        </div>
      </Collapse>
    </div>
  );
};



const CategoryNode = ({ node, onAddSub, onDelete, onRename }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [label, setLabel] = useState(node.name);
  const [showInput, setShowInput] = useState(false);
  const [subName, setSubName] = useState("");
  const [open, setOpen] = useState(true);

  const handleRename = () => {
    if (label.trim() && label !== node.name) {
      onRename(node.id, label);
    }
    setIsEditing(false);
  };

  return (
    <Card body className="mb-2 ms-3">
      <Stack direction="horizontal" gap={2} className="align-items-start">
        {node.children?.length > 0 ? (
          <Button
            variant="link"
            className="p-0"
            onClick={() => setOpen(!open)}
          >
            {open ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          </Button>
        ) : (
          <span style={{ width: 16 }} />
        )}

        <div style={{ flexGrow: 1 }}>
          {isEditing ? (
            <div
              contentEditable
              suppressContentEditableWarning
              className="border rounded p-1"
              onBlur={(e) => {
                setLabel(e.target.innerText);
                handleRename();
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  e.target.blur();
                }
              }}
            >
              {label}
            </div>
          ) : (
            <strong>{label}</strong>
          )}

          <div className="mt-2 d-flex gap-2">
            <Button
              size="sm"
              variant="outline-primary"
              onClick={() => setIsEditing(true)}
            >
              <Pencil size={14} />
            </Button>
            <Button
              size="sm"
              variant="outline-success"
              onClick={() => setShowInput(!showInput)}
            >
              <Plus size={14} />
            </Button>
            <Button
              size="sm"
              variant="outline-danger"
              onClick={() => onDelete(node.id)}
            >
              <Trash size={14} />
            </Button>
          </div>

          {showInput && (
            <Form
              className="mt-2"
              onSubmit={(e) => {
                e.preventDefault();
                if (subName.trim()) {
                  onAddSub(node.id, subName);
                  setSubName("");
                  setShowInput(false);
                }
              }}
            >
              <Form.Control
                size="sm"
                placeholder="Subcategory name"
                value={subName}
                onChange={(e) => setSubName(e.target.value)}
              />
            </Form>
          )}
        </div>
      </Stack>

      {node.children?.length > 0 && (
        <Collapse in={open}>
          <div>
            {node.children.map((child) => (
              <CategoryNode
                key={child.id}
                node={child}
                onAddSub={onAddSub}
                onDelete={onDelete}
                onRename={onRename}
              />
            ))}
          </div>
        </Collapse>
      )}
    </Card>
  );
};

const CategoryManager = () => {
  const [categories, setCategories] = useState([]);
  const [rootName, setRootName] = useState("");
  const [deleteId, setDeleteId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

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

  const handleAddSub = async (parentId, name) => {
    await addCategoryAlt(name, parentId);
    fetchCategories();
  };

  const handleRename = async (id, newName) => {
     if (!newName.trim()) return;
    await updateCategoryAlt(id, newName);
    fetchCategories();
  };

  const confirmDelete = (id) => {
    setDeleteId(id);
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    if (deleteId) {
      await deleteCategoryAlt(deleteId);
      setDeleteId(null);
      setShowDeleteModal(false);
      fetchCategories();
    }
  };

  const tree = buildCategoryTree(categories);

  return (
    <div className="container mt-4">
      <h3 className="mb-4">📂 Category Manager</h3>
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
        <Link to="/dashboard/new-category-manager" className="btn btn-success text-white">
          New Category 
        </Link>
        <Link to="/dashboard/single-category-manager" className="btn btn-danger text-white">
          Single Category
        </Link>
        <Link to="/dashboard/single-subcategory-manager" className="btn btn-dark text-white">
          Single Subcategory
        </Link>
      </div>

      <Form
        className="d-flex gap-2 mb-4"
        onSubmit={(e) => {
          e.preventDefault();
          handleAddRoot();
        }}
      >
        <Form.Control
          placeholder="New root category"
          value={rootName}
          onChange={(e) => setRootName(e.target.value)}
        />
        <Button type="submit" variant="primary">
         + Add Root
        </Button>
      </Form>

      {tree.map((cat) => (
        <CatNode
          key={cat.id}
          node={cat}
          onAddSub={handleAddSub}
          onDelete={(id) => {
            setDeleteId(id);
            setShowDeleteModal(true);
          }}
          onRename={handleRename}
        />
      ))}
      <br/><hr/><br/><hr/><br/>
      {tree.map((cat) => (
        <CategoryNode
          key={cat.id}
          node={cat}
          onAddSub={handleAddSub}
          onDelete={confirmDelete}
          onRename={handleRename}
        />
      ))}

        {/* Bootstrap Delete Confirmation Modal */}
      <Modal
        show={showDeleteModal}
        onHide={() => setShowDeleteModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Confirm Deletion</Modal.Title>
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
    </div>
  );
};

export default CategoryManager;


/* 
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
*/