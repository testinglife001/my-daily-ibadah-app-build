import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import { addCategory, deleteCategory, getCategories, updateCategory } from '../../services/CategoryService';
// import { buildCategoryTreeUI } from './buildCategoryTreeUI';
import CategoryNodeUI from './CategoryNodeUI';
import { buildCategoryTree } from './buildCategoryTree';
import { Link } from 'react-router-dom';





const CategoryManagerUI = () => {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState('');

  const fetch = async () => {
    const flat = await getCategories();
    setCategories(buildCategoryTree(flat));
  };

  useEffect(() => { fetch(); }, []);

  const handleAddMain = async () => {
    if (!name.trim()) return;
    await addCategory(name);
    setName('');
    fetch();
  };

  const handleAddSub = async (subName, parentId) => {
    await addCategory(subName, parentId);
    fetch();
  };

  const handleUpdate = async (id, name) => {
    await updateCategory(id, name);
    fetch();
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this category and all its subcategories?')) {
      await deleteCategory(id); // simple delete; you'd need recursive delete for subcategories
      fetch();
    }
  };

  return (
    <Container>
      <Row>
        <Col>
          <h2>Category Manager UI</h2>
          <br/>
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
          <br/>
          <Form inline="true" className="d-flex gap-2 my-2" onSubmit={(e) => { e.preventDefault(); handleAddMain(); }}>
            <Form.Control
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="New main category"
            />
            <Button type="submit" variant="primary">Add Category</Button>
          </Form>

          <div className="mt-3">
            {categories.map(cat => (
              <CategoryNodeUI
                key={cat.id}
                node={cat}
                onAddSub={handleAddSub}
                onUpdate={handleUpdate}
                onDelete={handleDelete}
              />
            ))}
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default CategoryManagerUI;
