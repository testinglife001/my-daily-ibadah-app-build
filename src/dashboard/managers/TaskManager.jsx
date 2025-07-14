import { addDoc, collection, deleteDoc, doc, getDocs, updateDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import {
    Container,
    Row,
    Col,
    Form,
    Button,
    Card,
    ListGroup,
    Badge,
    ButtonGroup,
  } from "react-bootstrap";
import { db } from "../../firebase";



const TaskManager = () => {

  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [subtasks, setSubtasks] = useState([""]);
  const [editId, setEditId] = useState(null);

  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [filter, setFilter] = useState("all");

  const [viewMode, setViewMode] = useState("list"); // NEW

  const tasksRef = collection(db, "tasks");

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    const snapshot = await getDocs(tasksRef);
    const taskList = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    setTasks(taskList);
  };

  const handleSubtaskChange = (index, value) => {
    const updated = [...subtasks];
    updated[index] = value;
    setSubtasks(updated);
  };

  const addSubtaskField = () => setSubtasks([...subtasks, ""]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newTask = {
        title,
        subtasks,
        completed: false,
        subtaskStatus: subtasks.map(() => false),
        dueDate,
        priority,
    };

    if (editId) {
      const taskDoc = doc(db, "tasks", editId);
      await updateDoc(taskDoc, newTask);
      setEditId(null);
    } else {
      await addDoc(tasksRef, newTask);
    }
    setTitle("");
    setSubtasks([""]);

    setDueDate("");
    setPriority("Medium");
    fetchTasks();
  };

  const handleEdit = (task) => {
    setEditId(task.id);
    setTitle(task.title);
    setSubtasks(task.subtasks);

    setDueDate(task.dueDate || "");
    setPriority(task.priority || "Medium");
  };

  const handleDelete = async (id) => {
    await deleteDoc(doc(db, "tasks", id));
    fetchTasks();
  };

  const toggleTaskCompletion = async (task) => {
    const taskDoc = doc(db, "tasks", task.id);
    await updateDoc(taskDoc, { completed: !task.completed });
    fetchTasks();
  };

  const toggleSubtaskCompletion = async (task, index) => {
    const updatedStatus = [...task.subtaskStatus];
    updatedStatus[index] = !updatedStatus[index];
    const taskDoc = doc(db, "tasks", task.id);
    await updateDoc(taskDoc, { subtaskStatus: updatedStatus });
    fetchTasks();
  };

  const getFilteredTasks = () => {
    switch (filter) {
      case "completed":
        return tasks.filter((t) => t.completed);
      case "incomplete":
        return tasks.filter((t) => !t.completed);
      case "high":
        return tasks.filter((t) => t.priority === "High");
      default:
        return tasks;
    }
  };

  const priorityColor = {
    High: "danger",
    Medium: "warning",
    Low: "info",
  };

  return (
    <div>

      <div className="d-flex">
      

          <div className="flex-grow-1 p-3">

          <div style={{marginTop:'2%',marginLeft:'5%', marginRight:'5%'}} >

              Task Manager
              <div style={{ padding: 20 }}>

              <Container className="my-5">
                {/* Task Form */}
                <Row>
                  <Col md={6} className="mx-auto">
                    <Card className="shadow border-primary">
                      <Card.Body>
                        <Card.Title className="text-primary">
                          {editId ? "Edit Task" : "Add New Task"}
                        </Card.Title>
                        <Form onSubmit={handleSubmit}>
                          <Form.Group className="mb-3">
                            <Form.Label>Task Title</Form.Label>
                            <Form.Control
                              type="text"
                              value={title}
                              onChange={(e) => setTitle(e.target.value)}
                              required
                            />
                          </Form.Group>

                          {subtasks.map((sub, i) => (
                            <Form.Group className="mb-2" key={i}>
                              <Form.Label>Subtask {i + 1}</Form.Label>
                              <Form.Control
                                type="text"
                                value={sub}
                                onChange={(e) => handleSubtaskChange(i, e.target.value)}
                              />
                            </Form.Group>
                          ))}

                          <Button
                            variant="outline-primary"
                            size="sm"
                            onClick={addSubtaskField}
                            className="mb-3"
                          >
                            + Add Subtask
                          </Button>

                          <Form.Group className="mb-3">
                            <Form.Label>Due Date</Form.Label>
                            <Form.Control
                              type="date"
                              value={dueDate}
                              onChange={(e) => setDueDate(e.target.value)}
                            />
                          </Form.Group>

                          <Form.Group className="mb-3">
                            <Form.Label>Priority</Form.Label>
                            <Form.Select
                              value={priority}
                              onChange={(e) => setPriority(e.target.value)}
                            >
                              <option value="Low">Low</option>
                              <option value="Medium">Medium</option>
                              <option value="High">High</option>
                            </Form.Select>
                          </Form.Group>

                          <Button type="submit" variant="success">
                            {editId ? "Update Task" : "Add Task"}
                          </Button>
                        </Form>
                      </Card.Body>
                    </Card>
                  </Col>
                </Row>

                {/* Task Filters + View Toggle */}
                <Row className="mt-5">
                  <Col md={8} className="mx-auto">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <Form.Select
                        style={{ maxWidth: "250px" }}
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                      >
                        <option value="all">All Tasks</option>
                        <option value="completed">Completed</option>
                        <option value="incomplete">Incomplete</option>
                        <option value="high">High Priority</option>
                      </Form.Select>

                      <ButtonGroup>
                        <Button
                          variant={viewMode === "list" ? "primary" : "outline-primary"}
                          onClick={() => setViewMode("list")}
                        >
                          📋
                        </Button>
                        <Button
                          variant={viewMode === "grid" ? "primary" : "outline-primary"}
                          onClick={() => setViewMode("grid")}
                        >
                          🗂️
                        </Button>
                      </ButtonGroup>
                    </div>

                    <Row xs={viewMode === "grid" ? 1 : 1} md={viewMode === "grid" ? 2 : 1} className="g-3">
                      {getFilteredTasks().map((task) => (
                        <Col key={task.id}>
                          <Card className="shadow-sm h-100 border-start border-4 border-primary">
                            <Card.Body>
                              <div className="d-flex justify-content-between align-items-start">
                                <div>
                                  <Form.Check
                                    type="checkbox"
                                    label={
                                      <span
                                        style={{
                                          textDecoration: task.completed
                                            ? "line-through"
                                            : "none",
                                        }}
                                      >
                                        <strong>{task.title}</strong>
                                      </span>
                                    }
                                    checked={task.completed}
                                    onChange={() => toggleTaskCompletion(task)}
                                  />
                                  <div className="mt-1">
                                    <Badge bg={priorityColor[task.priority]} className="me-2">
                                      {task.priority}
                                    </Badge>
                                    {task.dueDate && (
                                      <Badge bg="secondary">Due: {task.dueDate}</Badge>
                                    )}
                                    {task.completed && (
                                      <Badge bg="success" className="ms-2">
                                        Done
                                      </Badge>
                                    )}
                                  </div>
                                </div>
                                <div>
                                  <Button
                                    variant="outline-secondary"
                                    size="sm"
                                    onClick={() => handleEdit(task)}
                                    className="me-2"
                                  >
                                    ✏️
                                  </Button>
                                  <Button
                                    variant="outline-danger"
                                    size="sm"
                                    onClick={() => handleDelete(task.id)}
                                  >
                                    🗑️
                                  </Button>
                                </div>
                              </div>

                              <ListGroup variant="flush" className="mt-3">
                                {task.subtasks?.map((sub, i) => (
                                  <ListGroup.Item
                                    key={i}
                                    className="d-flex align-items-center justify-content-between"
                                  >
                                    <Form.Check
                                      type="checkbox"
                                      label={
                                        <span
                                          style={{
                                            textDecoration:
                                              task.subtaskStatus?.[i] ? "line-through" : "none",
                                          }}
                                        >
                                          {sub}
                                        </span>
                                      }
                                      checked={task.subtaskStatus?.[i]}
                                      onChange={() => toggleSubtaskCompletion(task, i)}
                                    />
                                  </ListGroup.Item>
                                ))}
                              </ListGroup>
                            </Card.Body>
                          </Card>
                        </Col>
                      ))}
                    </Row>
                  </Col>
                </Row>
              </Container>

              </div>

          </div>
          
          </div>

      </div>


    </div>
  );
};

export default TaskManager;
