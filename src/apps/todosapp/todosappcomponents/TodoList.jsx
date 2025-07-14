// src/components/TodoList.jsx }
import React, { useEffect, useState } from 'react';
import { Card, Button, Form, Toast, ToastContainer } from 'react-bootstrap';
import { collection, query, where, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { FaClock, FaTrash, FaEdit } from 'react-icons/fa';
import moment from 'moment';
import { db } from '../../../firebase';
import TodoModal from './TodoModal';




function TodoList({ view, categories, projects, selectedCategoryId, selectedProjectId, onEditTodo }) {
  const [todos, setTodos] = useState([]);
  const [isGridView, setIsGridView] = useState(false);

  const [showCompleted, setShowCompleted] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  // const [sortBy, setSortBy] = useState(null); // At the top
  const [sortBy, setSortBy] = useState('order'); // ✅ Correct
  const [selectedTodos, setSelectedTodos] = useState([]);
  const [bulkPriority, setBulkPriority] = useState('');
  const [toast, setToast] = useState({ show: false, message: '', variant: 'success' });

  const [draggedTodoId, setDraggedTodoId] = useState(null);

  const fetchTodos = async () => {
    let q = collection(db, 'todos');

    if (view === 'today') {
      const today = moment().format('YYYY-MM-DD');
      q = query(q, where('date', '==', today));
    } else if (view === 'week') {
      const start = moment().startOf('week').format('YYYY-MM-DD');
      const end = moment().endOf('week').format('YYYY-MM-DD');
      q = query(q, where('date', '>=', start), where('date', '<=', end));
    } else if (view === 'project' && selectedProjectId) {
      q = query(q, where('projectId', '==', selectedProjectId));
    } else if (view === 'category' && selectedCategoryId) {
      q = query(q, where('categoryId', '==', selectedCategoryId));
    }

    const querySnapshot = await getDocs(q);
    let fetchedTodos = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    if (sortBy === 'priority') {
      const priorityOrder = { High: 1, Medium: 2, Low: 3, '': 4 };
      fetchedTodos.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
    } else if (sortBy === 'date') {
      fetchedTodos.sort((a, b) => new Date(a.date) - new Date(b.date));
    } else {
      fetchedTodos.sort((a, b) => a.order - b.order);
    }

    setTodos(fetchedTodos);
  };

  useEffect(() => { 
    fetchTodos(); // ✅ must call the inner function
  }, [view, selectedCategoryId, selectedProjectId, sortBy]);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this todo?')) {
      await deleteDoc(doc(db, 'todos', id));
      fetchTodos();
    }
  };


  const handleToggleCompleted = async (todoId, currentStatus) => {
    setUpdatingId(todoId);
    const todoRef = doc(db, 'todos', todoId);
    await updateDoc(todoRef, {
      isCompleted: !currentStatus,
    });
    setTodos((prev) =>
      prev.map((t) =>
        t.id === todoId ? { ...t, isCompleted: !currentStatus } : t
      )
    );
    setUpdatingId(null);
  };

  const handleSelect = id => {
    setSelectedTodos(s => s.includes(id) ? s.filter(x=>x!==id) : [...s, id]);
  };

  const applyBulkPriority = async () => {
    if (!bulkPriority) return;
    await Promise.all(selectedTodos.map(id =>
      updateDoc(doc(db,'todos',id),{priority:bulkPriority})
    ));
    showToast('Bulk priority updated!');
    setSelectedTodos([]);
    setBulkPriority('');
    fetchTodos();
  };

  const handleDragStart = (id) => {
    setDraggedTodoId(id);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = async (targetId) => {
    if (!draggedTodoId || draggedTodoId === targetId) return;

    const updatedTodos = [...todos];
    const fromIndex = updatedTodos.findIndex(t => t.id === draggedTodoId);
    const toIndex = updatedTodos.findIndex(t => t.id === targetId);

    const [movedTodo] = updatedTodos.splice(fromIndex, 1);
    updatedTodos.splice(toIndex, 0, movedTodo);

    // Update order values
    const reordered = updatedTodos.map((t, i) => ({ ...t, order: i + 1 }));
    setTodos(reordered);

    // Update Firestore
    reordered.forEach(async (t, index) => {
      const todoRef = doc(db, 'todos', t.id);
      await updateDoc(todoRef, { order: index + 1 });
    });

    setDraggedTodoId(null);
  };
  
  const showToast = (msg, variant='success') => {
    setToast({ show: true, message: msg, variant });
    setTimeout(() => setToast({ show: false, message: '', variant: 'success' }), 3000);
  };

  return (
    <div className="p-3">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5 className="text-primary text-capitalize">
            {view === 'inbox' ? 'Inbox' : view === 'today' ? 'Today' : view === 'week' ? 'This Week' : view}
        </h5>
        <Button
            variant={isGridView ? 'outline-dark' : 'outline-primary'}
            size="sm"
            onClick={() => setIsGridView(!isGridView)}
        >
            {isGridView ? 'List View' : 'Grid View'}
        </Button>
        </div>

        <br/>

        <Form.Select
          className="w-auto ms-auto mb-3"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
        >
          <option value="order">Manual</option>
          <option value="priority">Priority</option>
          <option value="date">Due Date</option>
        </Form.Select>

        {selectedTodos.length > 0 && (
          <div className="mb-3 p-2 border rounded d-flex align-items-center gap-2">
            <span>{selectedTodos.length} selected</span>
            <Form.Select
              value={bulkPriority}
              onChange={e=>setBulkPriority(e.target.value)}
              style={{width:150}}
            >
              <option value="">Set Priority</option>
              <option value="High">High 🔥</option>
              <option value="Medium">Medium ⚠️</option>
              <option value="Low">Low ✅</option>
            </Form.Select>
            <Button size="sm" onClick={applyBulkPriority}>Apply</Button>
          </div>
        )}

      {todos.length === 0 ? (
        <p className="text-muted">No todos available.</p>
      ) : (
        <div className={isGridView ? 'row g-3' : 'd-flex flex-column gap-3'}>
        {todos
          .filter((todo) => showCompleted || !todo.isCompleted)
          .map((todo) => (
            <div
            key={todo.id}
            className={isGridView ? 'col-md-4' : ''}
            draggable
            onDragStart={() => handleDragStart(todo.id)}
            onDragOver={handleDragOver}
            onDrop={() => handleDrop(todo.id)}
            >
            <Card className="shadow-sm h-100 todo-item">
                <Card.Body>
                <Card.Title>
                  <div className="d-flex align-items-center justify-content-between mb-3 p-3 border rounded shadow-sm bg-light">
                    
                    <div className="form-check">
                      
                      {/*<Form.Check
                        style={{fontSize:'18px'}}
                        className="form-check-input"
                        type="checkbox"
                        // label={todo.title}
                        checked={todo.completed}
                        onChange={() => handleToggleCompleted(todo.id, todo.completed)}
                      />*/}
                      {<input
                        type="checkbox"
                        className="form-check-input"
                         id={`check-${todo.id}`}
                         disabled={updatingId === todo.id}
                        checked={todo.isCompleted}
                        // onChange={() => handleToggleComplete(todo)}
                         onChange={() => handleToggleCompleted(todo.id, todo.isCompleted)}
                      />}
                      <label
                        className={`form-check-label ${
                          todo.isCompleted ? 'text-muted text-decoration-line-through' : ''
                        }`}
                        htmlFor={`check-${todo.id}`}
                      >
                        {todo.title}
                      </label>
                      &nbsp;&nbsp;
                      <span
                        className={`badge ${
                          todo.priority === 'High' ? 'bg-danger' :
                          todo.priority === 'Medium' ? 'bg-warning text-dark' :
                          'bg-success'
                        }`}
                      >
                        {todo.priority}
                      </span>

                    </div>

                    {/*<Form.Check
                        type="switch"
                        style={{fontSize:'14px'}}
                        id="show-completed-switch"
                        label="Show Completed"
                        checked={showCompleted}
                        onChange={() => setShowCompleted((prev) => !prev)}
                      />*/}
                      

                    {/*<div className="text-muted small">
                    <FaClock className="me-1" />
                    {moment(todo.date).format('ddd, MMM D')} - {todo.time}
                    </div>*/}
                    <div className='d-flex' >
                      <Form.Check style={{marginTop:'-3%'}}
                        checked={selectedTodos.includes(todo.id)}
                        onChange={() => handleSelect(todo.id)}
                      />
                      &nbsp;&nbsp;&nbsp;&nbsp;
                      <FaEdit
                        className="text-warning me-3 cursor-pointer"
                        // onClick={() => openEditModal(todo)}
                        // onClick={() => onEditTodo(todo)}
                        onClick={() => onEditTodo(todo)}
                      />
                      <FaTrash
                        className="text-danger cursor-pointer"
                        onClick={() => handleDelete(todo.id)}
                      />
                    </div>
                  </div>

                </Card.Title>

                <Card.Text>{todo.text}</Card.Text>
                <div className="d-flex justify-content-end align-items-center mt-3">
                    
                    <div className="text-muted small" style={{marginTop:'2%'}} >
                    <FaClock className="me-1" />
                    {moment(todo.date).format('ddd, MMM D')} - {todo.time}
                    </div>
                    
                </div>
                </Card.Body>
            </Card>
            </div>
        ))}
        </div>

      )}

      {/*
      <TodoModal
        show={showAddTodo}
        onHide={() => setShowAddTodo(false)}
        categories={categories}
        allProjects={projects}
         refreshTodos={fetchTodos}
      />
      */}

      {/*<TodoModal
        show={showEditModal}
        onHide={() => setShowEditModal(false)}
        mode="edit"
        existingTodo={editTodo}
        categories={categories}
        allProjects={projects}
        refreshTodos={fetchTodos}
      />*/}

      <ToastContainer position="bottom-center">
        <Toast bg={toast.variant} show={toast.show} onClose={() => setToast({show:false})} autohide delay={3000}>
          <Toast.Body className="text-white">{toast.message}</Toast.Body>
        </Toast>
      </ToastContainer>

    </div>
  );
}

export default TodoList;
