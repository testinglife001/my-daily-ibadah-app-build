// src/components/TodoCard.jsx
import React, { useState } from 'react';
import { Button, Card, Form, Collapse } from 'react-bootstrap';

export default function TodoCard({
  todo,
  onToggleCompleted,
  onDelete,
  onEdit,
  onAddSubtodo,
  onDragStart,
  onDragOver,
  onDrop,
  onSubtodoToggleCompleted,
  onSubtodoDelete,
  currentUser,
}) {
  const [showSubtasks, setShowSubtasks] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [editTitle, setEditTitle] = useState(todo.title);
  const [newSubtaskTitle, setNewSubtaskTitle] = useState('');

  const isOwner = currentUser?.uid === todo.createdBy;

  const handleEditSave = () => {
    if (!editTitle.trim()) return;
    onEdit(todo.id, editTitle.trim());
    setEditMode(false);
  };

  const handleAddSubtask = () => {
    if (!newSubtaskTitle.trim()) return;
    onAddSubtodo(todo.id, newSubtaskTitle.trim());
    setNewSubtaskTitle('');
  };

  return (
    <Card
      className="mb-2"
      draggable={isOwner}
      onDragStart={(e) => isOwner && onDragStart(e, todo)}
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => isOwner && onDrop(e, todo)}
    >
      <Card.Body>
        <Form.Check
          type="checkbox"
          id={`check-${todo.id}`}
          checked={todo.isCompleted}
          disabled={!isOwner}
          onChange={() => isOwner && onToggleCompleted(todo.id, todo.isCompleted)}
          label={
            editMode ? (
              <Form.Control
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleEditSave()}
              />
            ) : (
              <span className={todo.isCompleted ? 'text-muted text-decoration-line-through' : ''}>
                {todo.title}
              </span>
            )
          }
        />

        <div className="mt-2 d-flex justify-content-between align-items-center">
          <Button
            variant="link"
            size="sm"
            onClick={() => setShowSubtasks(!showSubtasks)}
          >
            {showSubtasks ? 'Hide Subtasks' : 'Show Subtasks'}
          </Button>

          {isOwner && (
            editMode ? (
              <>
                <Button variant="success" size="sm" onClick={handleEditSave}>Save</Button>{' '}
                <Button variant="secondary" size="sm" onClick={() => setEditMode(false)}>Cancel</Button>
              </>
            ) : (
              <>
                <Button variant="outline-primary" size="sm" onClick={() => setEditMode(true)}>Edit</Button>{' '}
                <Button variant="outline-danger" size="sm" onClick={() => onDelete(todo.id)}>Delete</Button>
              </>
            )
          )}
        </div>

        {/* Subtasks */}
        <Collapse in={showSubtasks}>
          <div className="mt-3">
            {todo.subtasks?.length > 0 ? (
              todo.subtasks.map(st => (
                <div key={st.id} className="d-flex align-items-center ms-3 mb-1">
                  <Form.Check
                    type="checkbox"
                    id={`subcheck-${st.id}`}
                    checked={st.isCompleted}
                    label={
                      <span className={st.isCompleted ? 'text-muted text-decoration-line-through' : ''}>
                        {st.title}
                      </span>
                    }
                    onChange={() => isOwner && onSubtodoToggleCompleted(todo.id, st.id, st.isCompleted)}
                    className="flex-grow-1"
                  />
                  {isOwner && (
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => onSubtodoDelete(todo.id, st.id)}
                      className="ms-2"
                    >
                      ×
                    </Button>
                  )}
                </div>
              ))
            ) : (
              <div className="ms-3 fst-italic text-muted">No subtasks</div>
            )}

            {isOwner && (
              <>
                <Form.Control
                  size="sm"
                  placeholder="Add new subtask"
                  value={newSubtaskTitle}
                  onChange={e => setNewSubtaskTitle(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleAddSubtask()}
                  className="mt-2"
                />
                <Button size="sm" onClick={handleAddSubtask} className="mt-1">Add Subtask</Button>
              </>
            )}
          </div>
        </Collapse>
      </Card.Body>
    </Card>
  );
}
