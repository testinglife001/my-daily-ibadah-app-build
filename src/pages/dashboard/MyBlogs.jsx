// src/components/Dashboard/MyBlogs.jsx
import React, { useEffect, useState } from "react";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { db, storage } from "../../firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { Card, Button, Badge, Modal, Form } from "react-bootstrap";
import { toast } from "react-toastify";
import draftToHtml from "draftjs-to-html";
import { EditorState, convertToRaw, convertFromRaw } from "draft-js";
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
// import { EditorState, convertFromRaw } from "draft-js";
// import draftToHtml from "draftjs-to-html";


const MyBlogs = ({ user }) => {
  const [blogs, setBlogs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editForm, setEditForm] = useState(null);
  const [editTags, setEditTags] = useState([]);
  const [tagInput, setTagInput] = useState("");
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const [file, setFile] = useState(null);
  const [progress, setProgress] = useState(null);
  const [previewImg, setPreviewImg] = useState("");

  useEffect(() => {
    if (!user?.uid) return;
    const q = query(collection(db, "blogs"), where("userId", "==", user.uid), orderBy("timestamp", "desc"));
    const unsub = onSnapshot(q, (snap) => {
      setBlogs(snap.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsub();
  }, [user]);

  useEffect(() => {
    getDocs(collection(db, "categories")).then((snap) => {
      setCategories(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    });
  }, []);


    useEffect(() => {
    if (file) {
      const storageRef = ref(storage, file.name);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        "state_changed",
        (snap) => setProgress((snap.bytesTransferred / snap.totalBytes) * 100),
        (err) => console.error(err),
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((url) => {
            setEditForm((prev) => ({ ...prev, imgUrl: url }));
            setPreviewImg(url);
            toast.success("Image uploaded");
          });
        }
      );
    }
  }, [file]);

  const mainCategories = categories.filter((cat) => !cat.parentId);
  const subcategories = categories.filter((cat) => cat.parentId === editForm?.category);

  const openViewModal = (blog) => {
    setSelectedBlog(blog);
    setShowViewModal(true);
  };

  const htmlDescription = () => {
    try {
      if (selectedBlog?.description && typeof selectedBlog.description === "object" && selectedBlog.description.blocks) {
        return draftToHtml(selectedBlog.description);
      }
      // If description is already HTML or string, return as is
      if (typeof selectedBlog?.description === "string") {
        return selectedBlog.description;
      }
      return "";
    } catch {
      return "";
    }
  };

  const renderHtmlDescription = () => {
    try {
      const raw = typeof selectedBlog.description === 'string'
        ? JSON.parse(selectedBlog.description)
        : selectedBlog.description;

      if (raw && raw.blocks) {
        return draftToHtml(raw);
      }
      return "<p><em>No description available.</em></p>";
    } catch (e) {
      return "<p><em>Error loading description.</em></p>";
    }
  };

  const openEditModal = (blog) => {
    setSelectedBlog(blog);
    setEditForm({
      ...blog,
      // Make sure it's a stringified JSON object
      description: typeof blog.description === 'object'
        ? JSON.stringify(blog.description)
        : blog.description,
    });
    setEditTags(blog.tags || []);
    setPreviewImg(blog.imgUrl);
    setShowEditModal(true);
  };


  const handleUpdate = async () => {
    try {
      await updateDoc(doc(db, "blogs", selectedBlog.id), {
        ...editForm,
        tags: editTags,
        description: convertToRaw(editorState.getCurrentContent()),
      });
      toast.success("Blog updated");
      setShowEditModal(false);
    } catch (err) {
      toast.error("Failed to update blog");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure?")) return;
    await deleteDoc(doc(db, "blogs", id));
    toast.success("Blog deleted");
  };

    return (
    <div className="container mt-3">
      <h4>My Blogs</h4>
      <div className="row">
        {blogs.map((blog) => (
          <div className="col-md-6 col-lg-4" key={blog.id}>
            <Card className="mb-3 shadow-sm">
              {blog.imgUrl && (
                <Card.Img variant="top" src={blog.imgUrl} style={{ height: "200px", objectFit: "cover" }} />
              )}
              <Card.Body>
                <Card.Title>{blog.title}</Card.Title>
                <Card.Text>
                  <strong>Category:</strong> <Badge bg="secondary">{blog.categoryType}</Badge>
                  <br />
                  <strong>Segment:</strong> <Badge bg="info">{blog.segment}</Badge>
                </Card.Text>
                <div className="d-flex flex-wrap gap-2 mb-2">
                  {blog.tags?.map((tag) => (
                    <Badge key={tag} bg="dark">{tag}</Badge>
                  ))}
                </div>
                <div className="d-flex justify-content-between">
                  <Button size="sm" variant="outline-primary" onClick={() => openViewModal(blog)}>View</Button>
                  {user.uid === blog.userId && (
                    <>
                      <Button size="sm" variant="outline-warning" onClick={() => openEditModal(blog)}>Edit</Button>
                      <Button size="sm" variant="outline-danger" onClick={() => handleDelete(blog.id)}>Delete</Button>
                    </>
                  )}
                </div>
              </Card.Body>
            </Card>
          </div>
        ))}
      </div>

      <Modal show={showViewModal} onHide={() => setShowViewModal(false)} size="lg">
        <Modal.Header closeButton><Modal.Title>{selectedBlog?.title}</Modal.Title></Modal.Header>
        <Modal.Body>
          {selectedBlog?.imgUrl && (
            <img src={selectedBlog.imgUrl} alt="" className="img-fluid mb-3 rounded" />
          )}
         {/* <div dangerouslySetInnerHTML={{ __html: draftToHtml(selectedBlog?.description || {}) }} /> 
         <div
            className="border p-3 rounded"
            dangerouslySetInnerHTML={{ __html: renderHtmlDescription() }}
          ></div> */}
          <div
            className="border p-3 rounded"
            dangerouslySetInnerHTML={{ __html: renderHtmlDescription() }}
          ></div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowViewModal(false)}>Close</Button>
        </Modal.Footer>
      </Modal>

            <Modal show={showEditModal} onHide={() => setShowEditModal(false)} size="lg">
        <Modal.Header closeButton><Modal.Title>Edit Blog</Modal.Title></Modal.Header>
        <Modal.Body>
          {editForm && (
            <>
              <Form.Group className="mb-2">
                <Form.Label>Title</Form.Label>
                <Form.Control value={editForm.title} onChange={(e) => setEditForm({ ...editForm, title: e.target.value })} />
              </Form.Group>

              <Form.Group className="mb-2">
                <Form.Label>Segment</Form.Label>
                <Form.Control value={editForm.segment} onChange={(e) => setEditForm({ ...editForm, segment: e.target.value })} />
              </Form.Group>

              <Form.Group className="mb-2">
                <Form.Label>Category</Form.Label>
                <Form.Select value={editForm.category} onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}>
                  <option value="">Select</option>
                  {mainCategories.map((cat) => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                </Form.Select>
              </Form.Group>

              <Form.Group className="mb-2">
                <Form.Label>Subcategory</Form.Label>
                <Form.Select value={editForm.subcategory} onChange={(e) => setEditForm({ ...editForm, subcategory: e.target.value })}>
                  <option value="">Select</option>
                  {subcategories.map((cat) => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                </Form.Select>
              </Form.Group>

              <Form.Group className="mb-2">
                <Form.Label>Tags</Form.Label>
                <Form.Control
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => {
                    if ((e.key === "Enter" || e.key === ",") && tagInput.trim()) {
                      e.preventDefault();
                      setEditTags([...editTags, tagInput.trim()]);
                      setTagInput("");
                    }
                  }}
                />
                <div className="d-flex flex-wrap gap-2 mt-2">
                  {editTags.map((tag) => (
                    <Badge key={tag} bg="dark">{tag} <span style={{ cursor: "pointer" }} onClick={() => setEditTags(editTags.filter(t => t !== tag))}>×</span></Badge>
                  ))}
                </div>
              </Form.Group>

              <Form.Group className="mb-2">
                <Form.Label>Description</Form.Label>
                <Editor
                  editorState={editorState}
                  onEditorStateChange={setEditorState}
                  wrapperClassName="border rounded"
                  editorClassName="p-2"
                />
              </Form.Group>


              <Form.Group className="mb-3">
                <Form.Label>Image</Form.Label>
                <Form.Control type="file" onChange={(e) => setFile(e.target.files[0])} />
                {progress && <div>Uploading: {Math.round(progress)}%</div>}
                {previewImg && <img src={previewImg} alt="Preview" className="img-fluid mt-2" />}
              </Form.Group>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>Cancel</Button>
          <Button variant="primary" onClick={handleUpdate}>Save</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default MyBlogs;


