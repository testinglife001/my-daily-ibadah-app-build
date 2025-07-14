import React, { useState } from 'react';
import { Button, Collapse, Form } from 'react-bootstrap';

const CategoryNodeUI = ({ node, onAddSub, onUpdate, onDelete }) => {
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editName, setEditName] = useState(node.name);
  const [subName, setSubName] = useState('');

  const handleEdit = () => {
    if (editing && editName.trim()) onUpdate(node.id, editName);
    setEditing(!editing);
  };

  return (
    <div className="ms-3 my-2 border-start ps-2">
      <div className="d-flex align-items-center gap-2">
        {editing ? (
          <Form.Control
            size="sm"
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
          />
        ) : (
          <strong>{node.name}</strong>
        )}
        <Button variant="link" size="sm" onClick={() => setOpen(!open)}>
          {open ? '[-]' : '[+]'}
        </Button>
        <Button variant="outline-primary" size="sm" onClick={handleEdit}>
          {editing ? 'Save' : 'Edit'}
        </Button>
        <Button variant="outline-danger" size="sm" onClick={() => onDelete(node.id)}>
          Delete
        </Button>
      </div>

      <Collapse in={open}>
        <div>
          <Form
            inline="true"
            className="my-2 d-flex gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              if (subName.trim()) {
                onAddSub(subName, node.id);
                setSubName('');
              }
            }}
          >
            <Form.Control
              size="sm"
              value={subName}
              onChange={(e) => setSubName(e.target.value)}
              placeholder="Add subcategory"
            />
            <Button size="sm" type="submit" variant="success">Add</Button>
          </Form>

          {node.children?.map(child => (
            <CategoryNodeUI
              key={child.id}
              node={child}
              onAddSub={onAddSub}
              onUpdate={onUpdate}
              onDelete={onDelete}
            />
          ))}
        </div>
      </Collapse>
    </div>
  );
};

export default CategoryNodeUI;
