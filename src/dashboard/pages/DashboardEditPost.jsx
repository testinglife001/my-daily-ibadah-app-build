import React, { useEffect, useState, useRef, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Container, Form, Button, Row, Col, Spinner, Alert, Badge, Toast, ToastContainer, Tabs, Tab
} from 'react-bootstrap';
import { db, storage } from '../../firebase';
import {
  doc, getDoc, updateDoc, serverTimestamp, collection, query, where, getDocs
} from 'firebase/firestore';
import {
  ref, uploadBytesResumable, getDownloadURL
} from 'firebase/storage';
import MDEditor, { commands } from '@uiw/react-md-editor';
import JoditEditor from 'jodit-react';
// import Dropdown from 'react-bootstrap/Dropdown';
// import DropdownButton from 'react-bootstrap/DropdownButton';
// import ButtonGroup from 'react-bootstrap/ButtonGroup';
import { DropdownButton, Dropdown, ButtonGroup } from 'react-bootstrap';
import { EditorContext } from '../../apps/notesapp/notesappcomponents/EditorContext';
import './DashboardEditPost.css';


const DashboardEditPost = ({user}) => {
  const { slug } = useParams();
  const navigate = useNavigate();
  // const editorRef = useRef(null);
  const [post, setPost] = useState(null);
  const [postId, setPostId] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    description: '',
    content: {},
    categoryTitle: '',
    subcategoryTitle: '',
     tags: [],
     hashtags: [],
    status: 'draft',
    imageUrl: '',
     editorjs: {},
  });

  const [categoryId, setCategoryId] = useState('');
  const [subcategoryId, setSubcategoryId] = useState('');
  const [categories, setCategories] = useState([]);
  //const [categoryId, setCategoryId] = useState('');
  //const [subcategoryId, setSubcategoryId] = useState('');
  const [category, setCategory] = useState('');
  const [subcategory, setSubcategory] = useState('');
  // const [categories, setCategories] = useState([]);
  // const [subcategories, setSubcategories] = useState([]);
  const [categoryTree, setCategoryTree] = useState([]);
  // const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState("");
  const [tagSuggestions, setTagSuggestions] = useState([]);
  const [categoryTypes, setCategoryTypes] = useState([]); // This is the array of types
  const [selectedCategoryType, setSelectedCategoryType] = useState(''); // This is the selected value
  const [segments, setSegments] = useState([]);
  const [selectedSegment, setSelectedSegment] = useState([]);
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [selectedCategoryOption, setSelectedCategoryOption] = useState([]);
  const [imagePreview, setImagePreview] = useState(null);
  const [newImage, setNewImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [autoSaveTimer, setAutoSaveTimer] = useState(null);
  const [lastSavedData, setLastSavedData] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const [tabKey, setTabKey] = useState('edit');

  const editor = useRef();
  const config = {
      readonly : false
  }

  const { initEditor, editorInstanceRef } = useContext(EditorContext);
  const editorRef = useRef(null);

  // Fetch dropdown data from Firestore
  useEffect(() => {
    const fetchAll = async () => {
      const fetch = async (col, setter) => {
        const snapshot = await getDocs(collection(db, col));
        setter(snapshot.docs.map(doc => doc.data().name || doc.data().title));
      };

      await Promise.all([
        fetch("segments", setSegments),
        fetch("category-types", setCategoryTypes),
        fetch("options", setCategoryOptions),
        // fetch("categories", setCategories),
      ]);
    };
    fetchAll();
  }, []);

  
  useEffect(() => {
     if (!editorRef.current) {
      const interval = setInterval(() => {
        const editorElement = document.getElementById('editorjs');
        if (editorElement) {
          initEditor();         // ✅ Safe: DOM is ready
           editorRef.current = true;
          clearInterval(interval);
        }
      }, 100);

      return () => clearInterval(interval);
     }
    
  }, [initEditor]);


  useEffect(() => {
    const fetchPost = async () => {
      try {
          const q = query(collection(db, 'posts'), where('slug', '==', slug));
          const querySnap = await getDocs(q);
          if (!querySnap.empty) {
          const docSnap = querySnap.docs[0];
          const data = docSnap.data();
          setPost(data);
          setFormData({
              title: data.title,
              subtitle: data.subtitle || '',
              description: data.description || '',     // ✅ Add this
              content: data.content || {},             // ✅ Add this
              categoryTitle: data.categoryTitle || '',
              subcategoryTitle: data.subcategoryTitle || '',
              tags: data.tags || [],
              hashtags: data.hashtags || [],
              status: data.status || 'draft',
              imageUrl: data.imageUrl || '',
               editorjs: data.editorjs || { blocks: [] }, // ✅ Ensure blocks array exists
               categoryType: data.categoryType || '',
               categoryOption: data.categoryOption || '',
               segment: data.segment || ''
          });
          // Set selected IDs so dropdowns are pre-filled
          setCategoryId(data.categoryId || '');
          setSubcategoryId(data.subcategoryId || '');
          // Save the doc ID so we can use it for update
          setPostId(docSnap.id);
        } else {
        setError('Post not found');
        }
      } catch (err) {
        console.error(err);
        setError('Error loading post');
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [slug]);

  console.log(post);

  // Auto-update formData.editorData every 2 seconds to refresh preview
  useEffect(() => {
    const interval = setInterval(async () => {
      if (editorInstanceRef.current?.save) {
        try {
          const data = await editorInstanceRef.current.save();
          setFormData(prev => ({ ...prev, editorjs: data }));
        } catch (err) {
          console.log("EditorJS save failed", err);
        }
      }
    }, 2000);
    return () => clearInterval(interval);
  }, []);


  // Inside useEffect
  useEffect(() => {
    const fetchCategories = async () => {
      const snapshot = await getDocs(collection(db, 'categories'));
      const categoryList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setCategories(categoryList);
      const tree = categoryList.filter(cat => !cat.parentId).map(parent => ({
        ...parent,
        children: categoryList.filter(child => child.parentId === parent.id)
      }));
      setCategoryTree(tree);
    };
    fetchCategories();
  }, []);

  const mainCategories = categories.filter(cat => !cat.parentId || cat.parentId === null);
  const subcategories = categories.filter(cat => cat.parentId === categoryId);

  useEffect(() => {
    const fetchTagsFromPosts = async () => {
      const snap = await getDocs(collection(db, 'posts'));
      const allTags = snap.docs.flatMap(doc => doc.data().tags || []);
      const uniqueTags = [...new Set(allTags)];
      setTagSuggestions(uniqueTags);
    };
    fetchTagsFromPosts();
  }, []);


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));  
    triggerAutoSave();
  };


  const handleTagAdd = () => {
    const trimmed = tagInput.trim();
    if (trimmed && !formData.tags.includes(trimmed)) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, trimmed]
      }));
      setTagInput("");
      triggerAutoSave();
    }
  };


  const handleTagRemove = (tag) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(t => t !== tag)
    }));
    triggerAutoSave();
  };

  // Add a new tag
  const handleHashTagAdd = () => {
    if (tagInput && !formData.hashtags.includes(tagInput)) {
      setFormData(prev => ({ ...prev, hashtags: [...prev.hashtags, tagInput] }));
      setTagInput('');
    }
  };


  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewImage(file);
      // setImagePreview(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };
  /*
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    const storageRef = ref(storage, `PostImages/${Date.now()}-${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on('state_changed', null, (err) => {
      console.error(err);
      setUploading(false);
    }, async () => {
      const url = await getDownloadURL(uploadTask.snapshot.ref);
      setFormData(prev => ({ ...prev, imageUrl: url }));
      setUploading(false);
    });
  };
  */
  const handleSave = async () => {
    setSaving(true);
    try {
      const editorData = await editorInstanceRef.current.save();
      if (!editorData || editorData.blocks.length === 0) {
        setError("Editor content cannot be empty");
        setSaving(false);
        return;
      }
      let imageUrl = post.imageUrl;
      if (newImage) {
        const storageRef = ref(storage, `posts/${Date.now()}_${newImage.name}`);
        const snapshot = await uploadBytes(storageRef, newImage);
        imageUrl = await getDownloadURL(snapshot.ref);
      }
      await updateDoc(doc(db, 'posts', postId), {
        ...formData,
        categoryId,
        subcategoryId,
        categoryType: selectedCategoryType,
        segment: selectedSegment,
        categoryOption: selectedCategoryOption,
        editorjs: editorData,
        status: status,
        updatedAt: serverTimestamp(),
      });
      navigate('/dashboard/all-post-list');
    } catch (err) {
      console.error(err);
      setError('Error saving post');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveAsDraft = async () => {
    setSaving(true);
    try {
      const editorData = await editorInstanceRef.current.save();
      await updateDoc(doc(db, 'posts', postId), {
        ...formData,
        categoryId,
        subcategoryId,
        categoryType: selectedCategoryType,
        segment: selectedSegment,
        categoryOption: selectedCategoryOption,
        editorjs: editorData,
        status: 'draft',
        updatedAt: serverTimestamp(),
        author: user?.displayName,
        userId: user?.uid,
      });
      setShowToast(true);
      navigate('/dashboard/post/drafts');
    } catch (err) {
      console.error('Draft save failed:', err);
    } finally {
      setSaving(false);
    }
  };

  // Simple renderer for EditorJS content preview
  const renderEditorJsContent = (editorjs) => {
    if (!editorjs?.blocks?.length) return <p className="text-muted">No content yet.</p>;
    return editorjs.blocks.map((block, idx) => {
      const { type, data } = block;
      switch (type) {
        case 'paragraph': return <p key={idx} dangerouslySetInnerHTML={{ __html: data.text }} />;
        case 'header': return React.createElement(`h${data.level}`, { key: idx, dangerouslySetInnerHTML: { __html: data.text } });
        case 'list': return data.style === 'ordered' ? (
          <ol key={idx}>{data.items.map((item, i) => <li key={i} dangerouslySetInnerHTML={{ __html: item }} />)}</ol>
        ) : (
          <ul key={idx}>{data.items.map((item, i) => <li key={i} dangerouslySetInnerHTML={{ __html: item }} />)}</ul>
        );
        case 'image': return <img key={idx} src={data.file.url} alt={data.caption || 'Image'} style={{ maxWidth: '100%' }} />;
        case 'embed': return <div key={idx} dangerouslySetInnerHTML={{ __html: data.embed }} />;
        case 'checklist': return (
          <ul key={idx} style={{ listStyleType: 'none', paddingLeft: 0 }}>
            {data.items.map((item, i) => (
              <li key={i}><input type="checkbox" checked={item.checked} readOnly /> {item.text}</li>
            ))}
          </ul>
        );
        default: return <p key={idx}>[{type} block not supported in preview]</p>;
      }
    });
  };

  if (loading) return <Spinner animation="border" className="mt-4" />;
  if (error) return <Alert variant="danger" className="mt-4">{error}</Alert>;

  return (
    <Container className="my-4">
      <h2>Edit Post</h2>

      <div className='d-flex' >
          <DropdownButton
              as='ButtonGroup'
              // key={variant}
              // id={dropdown-variants-Primary}
              variant='info'
              title='Note'
          >
              <Dropdown.Item eventKey="1">
                  <Link to={`/add-note/post/${postId}`} >Add Note</Link>
              </Dropdown.Item>
              <Dropdown.Item eventKey="2">
                <Link to={`/view-notes/post/${postId}`} >View Note</Link>
              </Dropdown.Item>
              <Dropdown.Item eventKey="3" active>
              Active Item
              </Dropdown.Item>
              <Dropdown.Divider />
              <Dropdown.Item eventKey="4">Separated link</Dropdown.Item>
          </DropdownButton>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          <DropdownButton
              as='ButtonGroup'
              // key={variant}
              // id={dropdown-variants-Primary}
              variant='danger'
              title='Todo'
          >
              <Dropdown.Item eventKey="1">Action</Dropdown.Item>
              <Dropdown.Item eventKey="2">Another action</Dropdown.Item>
              <Dropdown.Item eventKey="3" active>
              Active Item
              </Dropdown.Item>
              <Dropdown.Divider />
              <Dropdown.Item eventKey="4">Separated link</Dropdown.Item>
          </DropdownButton>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          <DropdownButton
              as='ButtonGroup'
              // key={variant}
              // id={dropdown-variants-Primary}
              variant='success'
              title='Task'
          >
              <Dropdown.Item eventKey="1">Action</Dropdown.Item>  
              <Dropdown.Item eventKey="2">Another action</Dropdown.Item>
              <Dropdown.Item eventKey="3" active>
              Active Item
              </Dropdown.Item>
              <Dropdown.Divider />
              <Dropdown.Item eventKey="4">Separated link</Dropdown.Item>
          </DropdownButton>
      </div>

      <Form>
        <Row>
          <Col md={12}>
             {imagePreview && <img src={imagePreview} alt="Preview" className="img-fluid mb-3" style={{ maxWidth: '300px' }} />}
            <Form.Group className="mb-3">
              <Form.Label>Change Image</Form.Label>
              <Form.Control type="file" onChange={handleImageChange} />
            </Form.Group>
          </Col>

          <Col md={12}>
            <Form.Group className="mb-3">
              <Form.Label>Title</Form.Label>
              <Form.Control name="title" value={formData.title} onChange={handleInputChange} required />
            </Form.Group>
          </Col>
          <Col md={12}>
            <Form.Group className="mb-3">
              <Form.Label>Subtitle</Form.Label>
              <Form.Control name="subtitle" value={formData.subtitle} onChange={handleInputChange} />
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Category</Form.Label>
              <Form.Control name="categoryTitle" value={formData.categoryTitle} onChange={handleInputChange} />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Subcategory</Form.Label>
              <Form.Control name="subcategoryTitle" value={formData.subcategoryTitle} onChange={handleInputChange} />
            </Form.Group>
          </Col>
          

        </Row>

        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Category</Form.Label>
              <Form.Select
                value={categoryId}
                onChange={(e) => {
                  setCategoryId(e.target.value);
                  setSubcategoryId(""); // reset subcategory when category changes
                }}
              >
                <option value="">Select Category</option>
                {mainCategories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>

          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Subcategory</Form.Label>
              <Form.Select
                value={subcategoryId}
                onChange={(e) => setSubcategoryId(e.target.value)}
              >
                <option value="">Select Subcategory</option>
                {subcategories.map(sub => (
                  <option key={sub.id} value={sub.id}>{sub.name}</option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <Col>
            <h5>📁 Categories</h5>
            {categoryTree.map(cat => (
              <div key={cat.id}>
                <div>
                  <strong>{cat.name}</strong>
                </div>
                <ul>
                  {cat.children.map(child => (
                    <li key={child.id}>
                      <Form.Check
                        type="radio"
                        id={child.id}
                        label={child.name}
                        checked={subcategoryId === child.id}
                        onChange={() => {
                          setCategoryId(cat.id);
                          setSubcategoryId(child.id);
                          triggerAutoSave();
                        }}
                      />
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </Col>
        </Row>        

        <div className='row' >
        <div className="col-md-4">
          <select 
            name="categoryType" 
            value={formData.categoryType} 
            onChange={(e) => setSelectedCategoryType(e.target.value)}
            className="form-control"
          >
            <option value="">Select Category Type</option>
            {categoryTypes?.map((ct, i) => (
              <option key={i} value={ct}>{ct}</option>
            ))}
          </select>
        </div>

        <div className="col-md-4">
            <select 
                name="segment" 
                value={formData.segment} 
                onChange={(e) => setSelectedSegment(e.target.value)} 
                className="form-control"
              >
            <option value="">Select Segment</option>
            {segments?.map((s,i) => (
                <option key={i} value={s}>{s}</option>
             ))}
            </select>
        </div>

        <div className="col-md-4">
            <select 
                name="categoryOption" 
                value={formData.categoryOption} 
                onChange={(e) => setSelectedCategoryOption(e.target.value)} 
                className="form-control"
              >
            <option value="">Select Category Option</option>
            {categoryOptions?.map((opt,i) => (
                <option key={i} value={opt}>{opt}</option>)
            )}
            </select>
        </div>
        </div>

        <Form.Group className="mb-3">
          <Form.Label>Tags</Form.Label>
          <div className="d-flex">
            <Form.Control value={tagInput} onChange={(e) => setTagInput(e.target.value)} />
            <Button variant="secondary" onClick={handleTagAdd} className="ms-2">Add</Button>
          </div>
          <div className="mt-2">
            {formData.tags.map((tag, idx) => (
              <Badge key={`${tag}-${idx}`} bg="dark" className="me-1">{tag}</Badge>
            ))}
          </div>
        </Form.Group>

        <br/>

        <label>Tags</label>
        <input
          className="form-control my-2"
          value={tagInput}
          onChange={(e) => setTagInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === ",") {
              e.preventDefault();
              handleTagAdd();
            }
          }}
        />
        <button type="button" className="btn btn-primary mb-2 pull-right" onClick={handleTagAdd}>Add</button>
        <div className="d-flex flex-wrap gap-2">
          {formData.tags.map((tag) => (
            <Badge key={tag} bg="secondary">
              {tag}
              <button
                className="btn btn-sm text-white ms-2 p-0"
                onClick={() => handleTagRemove(tag)}
              >
                ×
              </button>
            </Badge>
          ))}
        </div>
        <br/><br/>

        <Row className="mt-4">
          <Col>
            <h5>🏷️ Tags</h5>
            <Form.Control
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ',') {
                  e.preventDefault();
                  handleTagAdd();
                }
              }}
            />
            {tagInput && (
              <div className="border mt-1 p-2 bg-light">
                {tagSuggestions
                  .filter(s => s.toLowerCase().includes(tagInput.toLowerCase()) && !formData.tags.includes(s))
                  .slice(0, 5)
                  .map((s, i) => (
                    <div key={i} style={{ cursor: 'pointer' }} onClick={() => {
                      setFormData(prev => ({ ...prev, tags: [...prev.tags, s] }));
                      setTagInput('');
                    }}>{s}</div>
                  ))}
              </div>
            )}
            <div className="d-flex flex-wrap gap-2 mt-2">
              {formData.tags.map(tag => (
                <Badge key={tag} bg="secondary">
                  {tag}
                  <span onClick={() => handleTagRemove(tag)} style={{ cursor: 'pointer', marginLeft: 8 }}>×</span>
                </Badge>
              ))}
            </div>
          </Col>
        </Row>  

        <Form.Group className="mb-3">
          <Form.Label>Hashtags</Form.Label>
          <div className="d-flex">
            <Form.Control value={tagInput} onChange={(e) => setTagInput(e.target.value)} />
            <Button variant="secondary" onClick={handleHashTagAdd} className="ms-2">Add</Button>
          </div>
          <div className="mt-2">
            {formData.hashtags.map((tag, idx) => (
              <Badge
                key={`${tag}-${idx}`}
                bg="dark"
                className="me-1"
                style={{ cursor: 'pointer' }}
                onClick={() =>
                  setFormData(prev => ({
                    ...prev,
                    hashtags: prev.tags.filter(t => t !== tag),
                  }))
                }
                title="Click to remove tag"
              >
                {tag} &times;
              </Badge>
            ))}
          </div>
        </Form.Group>
        
        <br/><br/>

        <div className="col-md-12">
            <label><strong>Description (MDEditor - Bangla Supported)</strong></label>
            <MDEditor
                value={formData.description}
                onChange={(val) => setFormData((prev) => ({ ...prev, description: val }))}
                commands={[
                  commands.bold,
                  commands.italic,
                  commands.strikethrough,
                  commands.hr,
                  commands.title,
                  commands.divider,
                  commands.link,
                  commands.code,
                  commands.image,
                  commands.unorderedListCommand,
                  commands.orderedListCommand,
                  commands.checkedListCommand,
                ]}    
                hideMenu={true}
              />
        </div>
        <br/><br/>

        {imagePreview && 
          <img src={imagePreview} alt="Preview" className="img-fluid mb-3" style={{ maxWidth: '300px' }} />
        }
        <Form.Group className="mb-3">
          <Form.Label>Change Image</Form.Label>
          <Form.Control type="file" onChange={handleImageChange} />
        </Form.Group>

        { 
        //!previewMode && (
          <Form.Group className="mt-3">
            <Form.Label>EditorJS Content</Form.Label>
            <div id="editorjs" 
              className="border mt-3 p-3 rounded" 
              style={{ minHeight: '300px', border: '1px solid #ced4da', borderRadius: '.25rem', 
                        padding: '10px', backgroundColor: 'white' }}    
            />
          </Form.Group>
        //) 
        }

        {/*<Tabs id="editor-tabs" activeKey={tabKey} onSelect={(k) => setTabKey(k)} className="mb-3">
          <Tab eventKey="edit" title="Edit">
            {tabKey === 'edit' && 
              <div id="editorjs" 
                style={{ minHeight: '300px', border: '1px solid #ced4da', borderRadius: '.25rem', 
                  padding: '10px', backgroundColor: 'white' }} />}
          </Tab>
          <Tab eventKey="preview" title="Preview">
            <div className="preview-content" 
              style={{ minHeight: '300px', border: '1px solid #ced4da', borderRadius: '.25rem', 
                padding: '10px', backgroundColor: '#fff' }}>
              {!formData.editorjs?.blocks?.length ? 
                <p className="text-muted">No content to preview.</p> 
                : renderEditorJsContent(formData.editorjs)
              }
            </div>
          </Tab>
        </Tabs>*/}

        <Form.Group className="mb-3">
          <Form.Label>Content</Form.Label>
          <JoditEditor
            value={formData.content}
            config={config}
            tabIndex={1}
            ref={editor}
            // onBlur={newText => handleChange('content', newText)}
            onBlur={newContent =>
              setFormData(prev => ({ ...prev, content: newContent }))
            }
            // onChange={(newText) => {}}
            onChange={(newContent) =>
              setFormData(prev => ({ ...prev, content: newContent }))
            }

          />
        </Form.Group>

        
        <Button variant="primary" onClick={handleSave} disabled={saving}>
          {saving ? 'Saving...' : 'Update & Publish'}
        </Button>
        <Button variant="warning" className="ms-2" onClick={handleSaveAsDraft}>
          Save as Draft
        </Button>
        
        <Col md={4} style={{marginTop:'-30px', marginLeft:'350px'}} >
          <Form.Group className="mb-3">
            
            <Form.Select name="status" value={formData.status} onChange={handleInputChange}>
              <option value="">Status</option>
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </Form.Select>
          </Form.Group>
        </Col>

      </Form>
      
      <ToastContainer position="top-end">
        <Toast bg="success" onClose={() => setShowToast(false)} show={showToast} delay={2000} autohide>
          <Toast.Body className="text-white">Draft saved ✅</Toast.Body>
        </Toast>
      </ToastContainer>

    </Container>
  );
};

export default DashboardEditPost;
