import React, { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { doc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db, auth, storage } from '../../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { Container, Form, Button, Spinner, Alert, Row, Col, Image } from 'react-bootstrap';
import EditorJS from '@editorjs/editorjs';
import Header from '@editorjs/header';
import Paragraph from '@editorjs/paragraph';
import List from '@editorjs/list';
import Checklist from '@editorjs/checklist';
import ImageTool from '@editorjs/image';
import { toast } from 'react-toastify';
import uploadImage from './uploadImage'; // Your function to upload to Firebase Storage
import { ref, deleteObject } from 'firebase/storage';

const DashboardPostEdit = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const editorRef = useRef(null);

  const [post, setPost] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [accessDenied, setAccessDenied] = useState(false);

  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [category, setCategory] = useState('');
  const [subcategory, setSubcategory] = useState('');
  const [tags, setTags] = useState('');
  const [imageUrl, setImageUrl] = useState(null);
  const [imageFile, setImageFile] = useState(null);

  // Load current user
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, user => {
      setCurrentUser(user);
    });
    return () => unsubscribe();
  }, []);

  // Fetch post
  useEffect(() => {
    const fetchPost = async () => {
      try {
        const snapshot = await getDoc(doc(db, 'posts', slug));
        if (!snapshot.exists()) {
          setAccessDenied(true);
          setLoading(false);
          return;
        }

        const postData = { id: snapshot.id, ...snapshot.data() };
        setPost(postData);

        // Role check
        if (auth.currentUser?.uid !== postData.authorId) {
          setAccessDenied(true);
        } else {
          setTitle(postData.title || '');
          setSubtitle(postData.subtitle || '');
          setCategory(postData.category || '');
          setSubcategory(postData.subcategory || '');
          setTags(postData.tags?.join(', ') || '');
          setImageUrl(postData.imageUrl || '');
        }

        setLoading(false);
      } catch (err) {
        console.error('Error fetching post:', err);
        setAccessDenied(true);
        setLoading(false);
      }
    };

    fetchPost();
  }, [slug]);

  // Initialize EditorJS
  useEffect(() => {
    if (post && currentUser?.uid === post.authorId && !editorRef.current) {
      editorRef.current = new EditorJS({
        holder: 'editorjs',
        data: post.editorData,
        autofocus: true,
        tools: {
          header: Header,
          paragraph: Paragraph,
          list: List,
          checklist: Checklist,
          image: {
            class: ImageTool,
            config: {
              uploader: {
                uploadByFile: async (file) => {
                  const imageUrl = await uploadImage(file);
                  return { success: 1, file: { url: imageUrl } };
                },
              },
            },
          },
        },
      });
    }
  }, [post, currentUser]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (editorRef.current) {
        editorRef.current.destroy();
        editorRef.current = null;
      }
    };
  }, []);

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!editorRef.current) return;

    try {
      const editorData = await editorRef.current.save();

      let newImageUrl = imageUrl;

      if (imageFile) {
        // Optional: delete old image
        if (imageUrl) {
          const oldRef = ref(storage, imageUrl);
          await deleteObject(oldRef).catch(() => {});
        }

        newImageUrl = await uploadImage(imageFile);
      }

      await updateDoc(doc(db, 'posts', post.id), {
        title,
        subtitle,
        category,
        subcategory,
        tags: tags.split(',').map(tag => tag.trim()),
        imageUrl: newImageUrl,
        editorData,
        updatedAt: new Date(),
      });

      toast.success('Post updated!');
      navigate('/dashboard/posts');
    } catch (err) {
      toast.error('Update failed');
      console.error(err);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;
    try {
      if (imageUrl) {
        const imageRef = ref(storage, imageUrl);
        await deleteObject(imageRef);
      }

      await deleteDoc(doc(db, 'posts', post.id));
      toast.success('Post deleted!');
      navigate('/dashboard/posts');
    } catch (err) {
      toast.error('Delete failed');
      console.error(err);
    }
  };

  if (loading) return <Spinner animation="border" />;

  if (accessDenied) return <Alert variant="danger">Access Denied</Alert>;

  return (
    <Container className="mt-4">
      <Row className="mb-3">
        <Col><h2>Edit Post</h2></Col>
        <Col className="text-end">
          <Link to="/dashboard/posts" className="btn btn-secondary">← Back to All Posts</Link>
        </Col>
      </Row>

      <Form onSubmit={handleUpdate}>
        <Form.Group className="mb-3">
          <Form.Label>Title</Form.Label>
          <Form.Control value={title} onChange={(e) => setTitle(e.target.value)} required />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Subtitle</Form.Label>
          <Form.Control value={subtitle} onChange={(e) => setSubtitle(e.target.value)} />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Category</Form.Label>
          <Form.Control value={category} onChange={(e) => setCategory(e.target.value)} />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Subcategory</Form.Label>
          <Form.Control value={subcategory} onChange={(e) => setSubcategory(e.target.value)} />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Tags (comma-separated)</Form.Label>
          <Form.Control value={tags} onChange={(e) => setTags(e.target.value)} />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Image</Form.Label>
          {imageUrl && (
            <div className="mb-2">
              <Image src={imageUrl} fluid thumbnail />
            </div>
          )}
          <Form.Control type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files[0])} />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Content</Form.Label>
          <div id="editorjs" className="border rounded p-2" />
        </Form.Group>

        <div className="d-flex gap-3">
          <Button type="submit" variant="primary">Update</Button>
          <Button type="button" variant="danger" onClick={handleDelete}>Delete</Button>
        </div>
      </Form>
    </Container>
  );
};

export default DashboardPostEdit;

