import React, { useEffect, useState } from 'react';
import { Button, Card, Col, Collapse, Form, Modal, Row } from 'react-bootstrap';
import { FaFolder, FaFolderOpen, FaEdit, FaPlus, FaTrash } from 'react-icons/fa';
import {
  addCategory,
  addCategoryNew,
  deleteCategory,
  getCategories,
  updateCategory
} from '../../services/CategoryService';

const NewCategoryManager = () => {
  const [categories, setCategories] = useState([]);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [ catId, setCatId ] = useState('');
  const [search, setSearch] = useState('');
  const [editingCategory, setEditingCategory] = useState(null);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editCategoryName, setEditCategoryName] = useState('');
  const [expandedCategories, setExpandedCategories] = useState(() => {
    const saved = localStorage.getItem('expandedCategories');
    return saved ? JSON.parse(saved) : {};
  });
  const [selectedParentId, setSelectedParentId] = useState(null);
  const [subCategoryName, setSubCategoryName] = useState('');

  const fetchCategories = async () => {
    const all = await getCategories();
    setCategories(all);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    localStorage.setItem('expandedCategories', JSON.stringify(expandedCategories));
  }, [expandedCategories]);

  /*
  const handleAddCategory = async () => {
    if (newCategoryName.trim()) {
      await addCategory({ name: newCategoryName });
      setNewCategoryName('');
      fetchCategories();
    }
  };
  */

  const handleAddCategory = async () => {
    const trimmedName = newCategoryName.trim();
    if (trimmedName) {
        await addCategoryNew({
        name: trimmedName,
        parentId: null,
        // tag: '',       // Optional: add tag/color support here
        // color: ''      // Optional: add default color
        });
        setNewCategoryName('');
        fetchCategories();
    }
  };


  /*
  const handleAddSubcategory = async () => {
    if (subCategoryName.trim() && selectedParentId) {
      await addCategory({ name: subCategoryName, parentId: selectedParentId });
      setSubCategoryName('');
      setSelectedParentId(null);
      fetchCategories();
    }
  };
  */

  const handleAddSubcategory = async () => {
    if (!selectedParentId || !subCategoryName.trim()) return;

    const newSubcategory = {
        name: subCategoryName.trim(),
        parentId: selectedParentId, // this should be ID string, not object
        // tag,
        // color
    };

    await addCategoryNew(newSubcategory); // pass only the required data
    setSubCategoryName('');
    setSelectedParentId(null);
    fetchCategories();
  };


  const handleEdit = (cat) => {
    setEditingCategory(cat);
    setCatId(cat.id);
    setEditCategoryName(cat.name);
    setEditModalVisible(true);
  };

  const handleUpdate = async () => {
    if (editingCategory && editCategoryName.trim()) {
      await updateCategory(editingCategory.id, { name: editCategoryName, parentId: null });
      setEditModalVisible(false);
      fetchCategories();
    }
  };

  const handleToggle = (id) => {
    setExpandedCategories((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      await deleteCategory(id);
      fetchCategories();
    }
  };

  // const filteredCategories = categories.filter(cat =>
  //   !cat.parentId && cat.name.toLowerCase().includes(search.toLowerCase())
  // );

  const filteredCategories = categories.filter(cat =>
    !cat.parentId && typeof cat.name === 'string' && cat.name.toLowerCase().includes(search.toLowerCase())
  );


  const getSubcategories = (parentId) =>
    categories.filter(cat => cat.parentId === parentId);

  return (
    <Card className="p-4">
      <h4 className="mb-3">New Category Manager</h4>

      <Form className="mb-4">
        <Row>
          <Col md={6}>
            <Form.Control
              placeholder="Search categories..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </Col>
          <Col md={6} className="d-flex gap-2">
            <Form.Control
              placeholder="New main category"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
            />
            <Button onClick={handleAddCategory} size='sm' variant="primary">
              <FaPlus /> {/*Add*/}
            </Button>
          </Col>
        </Row>
      </Form>

      <ul className="list-unstyled">
        {filteredCategories.map((cat) => {
          const subcats = getSubcategories(cat.id);
          return (
            <li key={cat.id} className="mb-3">
              <div className="d-flex align-items-center gap-2">
                <Button
                  variant="link"
                  className="p-0"
                  onClick={() => handleToggle(cat.id)}
                >
                  {expandedCategories[cat.id] ? <FaFolderOpen /> : <FaFolder />}
                </Button>
                <strong>{cat.name}</strong>
                <small className="text-muted">({subcats.length} subcategories)</small>
                <Button variant="outline-secondary" size="sm" onClick={() => handleEdit(cat)}>
                  <FaEdit />
                </Button>
                <Button variant="outline-danger" size="sm" onClick={() => handleDelete(cat.id)}>
                  <FaTrash />
                </Button>
                {selectedParentId === cat.id ? (
                  <>
                    <Form.Control
                      size="sm"
                      placeholder="Subcategory name"
                      value={subCategoryName}
                      onChange={(e) => setSubCategoryName(e.target.value)}
                      className="w-25 ms-2"
                    />
                    <Button size="sm" onClick={handleAddSubcategory} variant="success">
                      Add Sub
                    </Button>
                  </>
                ) : (
                  <Button
                    size="sm"
                    variant="outline-primary"
                    onClick={() => setSelectedParentId(cat.id)}
                  >
                    + Subcategory
                  </Button>
                )}
              </div>
              <Collapse in={expandedCategories[cat.id]}>
                <ul className="list-unstyled ps-4 mt-2">
                  {subcats.map((sub) => (
                    <li key={sub.id} className="d-flex align-items-center gap-2">
                      <FaFolder className="text-secondary" />
                      {sub.name}
                      <Button
                        variant="outline-secondary"
                        size="sm"
                        onClick={() => handleEdit(sub)}
                      >
                        <FaEdit />
                      </Button>
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => handleDelete(sub.id)}
                      >
                        <FaTrash />
                      </Button>
                    </li>
                  ))}
                </ul>
              </Collapse>
            </li>
          );
        })}
      </ul>

      <Modal show={editModalVisible} onHide={() => setEditModalVisible(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Category</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Control
            value={editCategoryName}
            onChange={(e) => setEditCategoryName(e.target.value)}
            placeholder="Category name"
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setEditModalVisible(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleUpdate}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </Card>
  );
};

export default NewCategoryManager;
