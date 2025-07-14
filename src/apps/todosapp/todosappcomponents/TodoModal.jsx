// src/components/TodoModal.jsx
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Modal, Button, Form, Row, Toast, ToastContainer } from 'react-bootstrap';
import { collection, addDoc, Timestamp, query, where, onSnapshot, updateDoc, doc, deleteDoc } from 'firebase/firestore';
import moment from 'moment';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../../../firebase';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import { Markdown } from 'tiptap-markdown';
import ReactMarkdown from 'react-markdown';
import './TodoModal.css';

function TodoRichTextRenderer({ content }) {
  let plainText = '';
  try {
    const json = content ? JSON.parse(content) : null;
    if (json?.content?.length) {
      plainText = json.content
        .map(block => {
          if (block.content) {
            return block.content.map(inner => inner.text || '').join('');
          }
          return '';
        })
        .join('\n');
    }
  } catch {
    plainText = content || '';
  }
  return <div style={{ whiteSpace: 'pre-wrap' }}>{plainText}</div>;
}

function TodoModal({
  show,
  onHide,
  categories,
  allProjects,
  refreshTodos,
  mode = 'add',
  existingTodo = null,
  user
}) {
  const draftKey = existingTodo?.id ? `todo-draft-${existingTodo.id}` : 'todo-draft-new';
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState('');
  const [text, setText] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [categoryName, setCategoryName] = useState('');
  const [projectId, setProjectId] = useState('');
  const [projectName, setProjectName] = useState('');
  const [inbox, setInbox] = useState(false);
  const [projects, setProjects] = useState([]);
  const [previewImage, setPreviewImage] = useState('');
  const [toast, setToast] = useState({ show: false, message: '', variant: 'success' });
  const [isPreview, setIsPreview] = useState(false);
  const [isDarkTheme, setIsDarkTheme] = useState(false);

  const editor = useEditor({
    extensions: [StarterKit, Markdown, Image],
    editorProps: {
      attributes: {
        class: 'form-control',
        style: 'min-height: 150px; background: transparent; color: inherit;',
      },
    },
    content: useMemo(() => {
      try {
        return text ? JSON.parse(text) : '';
      } catch {
        return '';
      }
    }, [text]),
    autofocus: false
  });

  const saveDraft = useCallback(() => {
    if (!editor) return;
    const draft = {
      title,
      priority,
      date,
      time,
      categoryId,
      projectId,
      text
    };
    localStorage.setItem(draftKey, JSON.stringify(draft));
  }, [title, priority, date, time, categoryId, projectId, text, editor]);

  useEffect(() => {
    if (existingTodo && mode === 'edit') {
      setTitle(existingTodo.title || '');
      setPriority(existingTodo.priority || '');
      setText(existingTodo.text || '');
      setCategoryId(existingTodo.categoryId || '');
      setCategoryName(existingTodo.categoryName || '');
      setProjectId(existingTodo.projectId || '');
      setProjectName(existingTodo.projectName || '');
      setDate(existingTodo.date || moment().format('YYYY-MM-DD'));
      setTime(existingTodo.time || moment().format('HH:mm'));
      setInbox(existingTodo.inbox || false);
      if (editor && existingTodo.text) {
        try {
          editor.commands.setContent(JSON.parse(existingTodo.text));
        } catch {
          editor.commands.setContent('');
        }
      }
    } else {
      const d = localStorage.getItem(draftKey);
      if (d) {
        const obj = JSON.parse(d);
        setTitle(obj.title || '');
        setPriority(obj.priority || '');
        setDate(obj.date || '');
        setTime(obj.time || '');
        setCategoryId(obj.categoryId || '');
        setProjectId(obj.projectId || '');
        setText(obj.text || '');
        if (editor && obj.text) {
          try {
            editor.commands.setContent(JSON.parse(obj.text));
          } catch {
            editor.commands.setContent('');
          }
        }
      } else {
        setTitle('');
        setPriority('');
        setText('');
        setCategoryId('');
        setCategoryName('');
        setProjectId('');
        setProjectName('');
        setDate(moment().format('YYYY-MM-DD'));
        setTime(moment().format('HH:mm'));
        setInbox(false);
        if (editor) editor.commands.setContent('');
      }
    }
  }, [existingTodo, mode, show, editor]);

  useEffect(() => {
    if (categoryId) {
      const selectedCat = categories.find(c => c.id === categoryId);
      setCategoryName(selectedCat?.title || '');
    } else {
      setCategoryName('');
    }
  }, [categoryId, categories]);

  useEffect(() => {
    if (!categoryId) return;
    const q = query(collection(db, "projects"), where("categoryId", "==", categoryId));
    const unsub = onSnapshot(q, (snapshot) => {
      const projList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setProjects(projList);
    });
    return () => unsub();
  }, [categoryId]);

  useEffect(() => {
    if (projectId) {
      const selectedProj = projects.find(p => p.id === projectId);
      setProjectName(selectedProj?.name || '');
    } else {
      setProjectName('');
    }
  }, [projectId, projects]);

  const showToast = (message, variant = 'success') => {
    setToast({ show: true, message, variant });
    setTimeout(() => setToast({ show: false, message: '', variant: 'success' }), 3000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !categoryId) {
      showToast('Title and Category are required.', 'danger');
      return;
    }

    const todoData = {
      title,
      priority,
      text: JSON.stringify(editor?.getJSON() || {}),
      categoryId,
      categoryName,
      projectId,
      projectName,
      date,
      time,
      inbox,
      updatedAt: Timestamp.now(),
    };

    try {
      if (mode === 'edit' && existingTodo?.id) {
        await updateDoc(doc(db, 'todos', existingTodo.id), todoData);
        localStorage.removeItem(draftKey);
        showToast('Todo updated successfully!', 'success');
      } else {
        await addDoc(collection(db, 'todos'), {
          ...todoData,
          createdAt: Timestamp.now(),
          createdBy: user?.uid || '',
          isCompleted: false,
          order: Date.now(),
        });
        localStorage.removeItem(draftKey);
        showToast('Todo added successfully!', 'success');
      }
      refreshTodos?.();
      onHide();
    } catch (err) {
      console.error('Error saving todo:', err);
      showToast('Something went wrong!', 'danger');
    }
  };

  const handleKeyDown = (e) => {
    if (e.ctrlKey && e.key === 's') {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleDelete = async () => {
    if (!existingTodo?.id) return;
    const confirm = window.confirm('Are you sure you want to delete this todo?');
    if (!confirm) return;

    try {
      await deleteDoc(doc(db, 'todos', existingTodo.id));
      showToast('Todo deleted successfully!', 'success');
      refreshTodos?.();
      onHide();
    } catch (err) {
      console.error('Delete error:', err);
      showToast('Failed to delete.', 'danger');
    }
  };

  const addImage = useCallback(() => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = async () => {
      if (!input.files?.length) return;
      const file = input.files[0];
      try {
        const storageRef = ref(storage, `todo-images/${file.name}-${Date.now()}`);
        await uploadBytes(storageRef, file);
        const url = await getDownloadURL(storageRef);
        setPreviewImage(url);
        editor.chain().focus().setImage({ src: url }).run();
        showToast('Image uploaded');
      } catch (err) {
        console.error('Upload error:', err);
        showToast('Image upload failed', 'danger');
      }
    };
    input.click();
  }, [editor]);

  return (
    <>
      <Modal show={show} onHide={onHide} onKeyDown={handleKeyDown} centered size="lg" className={isDarkTheme ? 'bg-dark text-light' : ''}>
        <Form onSubmit={handleSubmit}>
          <Modal.Header closeButton className={isDarkTheme ? 'bg-secondary text-light' : ''}>
            <Modal.Title>{mode === 'edit' ? 'Edit Todo' : 'Add Todo'}</Modal.Title>
            <Button variant={isDarkTheme ? 'light' : 'secondary'} size="sm" onClick={() => setIsDarkTheme(!isDarkTheme)} className="ms-2">
              {isDarkTheme ? 'Light Theme' : 'Dark Theme'}
            </Button>
            <Button variant={isDarkTheme ? 'light' : 'secondary'} size="sm" onClick={() => setIsPreview(!isPreview)} className="ms-2">
              {isPreview ? 'Edit Mode' : 'Preview'}
            </Button>
            {!isPreview && (
              <Button variant={isDarkTheme ? 'light' : 'secondary'} size="sm" onClick={addImage} className="ms-2">
                Add Image
              </Button>
            )}
          </Modal.Header>

          <Modal.Body className={isDarkTheme ? 'bg-dark text-light' : ''}>
            <Form.Group className="mb-3">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  saveDraft();
                }}
                className={isDarkTheme ? 'bg-secondary text-light border-0' : ''}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Priority</Form.Label>
              <Form.Select
                value={priority}
                onChange={(e) => {
                  setPriority(e.target.value);
                  saveDraft();
                }}
                className={isDarkTheme ? 'bg-secondary text-light border-0' : ''}
              >
                <option value="">Select priority</option>
                <option value="High">🔥 High</option>
                <option value="Medium">⚠️ Medium</option>
                <option value="Low">✅ Low</option>
              </Form.Select>
            </Form.Group>

            <Row className="mb-3">
              <Form.Group as={Form.Col}>
                <Form.Label>Date</Form.Label>
                <Form.Control
                  type="date"
                  value={date}
                  onChange={(e) => {
                    setDate(e.target.value);
                    saveDraft();
                  }}
                  className={isDarkTheme ? 'bg-secondary text-light border-0' : ''}
                />
              </Form.Group>
              <Form.Group as={Form.Col}>
                <Form.Label>Time</Form.Label>
                <Form.Control
                  type="time"
                  value={time}
                  onChange={(e) => {
                    setTime(e.target.value);
                    saveDraft();
                  }}
                  className={isDarkTheme ? 'bg-secondary text-light border-0' : ''}
                />
              </Form.Group>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Category</Form.Label>
              <Form.Select
                value={categoryId}
                onChange={(e) => {
                  setCategoryId(e.target.value);
                  saveDraft();
                }}
                required
                className={isDarkTheme ? 'bg-secondary text-light border-0' : ''}
              >
                <option value="">Select category</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.title}</option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Project</Form.Label>
              <Form.Select
                value={projectId}
                onChange={(e) => {
                  setProjectId(e.target.value);
                  saveDraft();
                }}
                className={isDarkTheme ? 'bg-secondary text-light border-0' : ''}
              >
                <option value="">Select project</option>
                {projects.map(proj => (
                  <option key={proj.id} value={proj.id}>{proj.name}</option>
                ))}
              </Form.Select>
            </Form.Group>

            {previewImage && (
              <div className="mb-3">
                <p>Image Preview:</p>
                <img src={previewImage} alt="Preview" style={{ maxWidth: '100%', maxHeight: 200 }} />
              </div>
            )}

            <Form.Group className="mb-3">
              <Form.Label>Notes</Form.Label>
              {isPreview ? (
                <div className={`border rounded p-3 ${isDarkTheme ? 'bg-secondary text-light' : ''}`}>
                  <ReactMarkdown>{editor ? editor.getText() : ''}</ReactMarkdown>
                </div>
              ) : (
                editor && <EditorContent editor={editor} />
              )}
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Check
                type="checkbox"
                label="Send to Inbox"
                checked={inbox}
                onChange={(e) => {
                  setInbox(e.target.checked);
                  saveDraft();
                }}
              />
            </Form.Group>
          </Modal.Body>

          <Modal.Footer className={isDarkTheme ? 'bg-secondary text-light' : ''}>
            {mode === 'edit' && (
              <Button variant="danger" onClick={handleDelete}>Delete</Button>
            )}
            <Button variant="secondary" onClick={onHide}>Cancel</Button>
            <Button type="submit" variant="primary">{mode === 'edit' ? 'Update' : 'Add'}</Button>
          </Modal.Footer>
        </Form>
      </Modal>

      <ToastContainer position="top-center" className="p-3">
        <Toast show={toast.show} bg={toast.variant} onClose={() => setToast({ ...toast, show: false })} delay={3000} autohide>
          <Toast.Body className="text-white">{toast.message}</Toast.Body>
        </Toast>
      </ToastContainer>
    </>
  );
}

export default TodoModal;
