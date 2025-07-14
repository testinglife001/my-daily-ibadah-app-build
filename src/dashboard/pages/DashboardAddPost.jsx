
import React, { useContext, useEffect, useRef, useState } from 'react';
import ReactTagInput from "@pathofdev/react-tag-input";
// import "@pathofdev/react-tag-input/build/index.css";
import { TagsInput } from "react-tag-input-component";
// import MDEditor, { EditorContext, commands } from "@uiw/react-md-editor";
 import MDEditor, { commands } from '@uiw/react-md-editor';
import { Container, Row, Col, Card, Button, Form, InputGroup, Badge, Image, Alert, Spinner, Modal } from 'react-bootstrap';
import JoditEditor from 'jodit-react';
import './DashboardAddPost.css';
import { addDoc, collection, doc, getDoc, getDocs, query, setDoc, Timestamp, updateDoc, where } from 'firebase/firestore';
import { db, storage, auth } from '../../firebase';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
// import Dropdown from 'react-bootstrap/Dropdown';
// import DropdownButton from 'react-bootstrap/DropdownButton';
// import ButtonGroup from 'react-bootstrap/ButtonGroup';
import { DropdownButton, Dropdown, ButtonGroup } from 'react-bootstrap';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { EditorContext } from '../../apps/notesapp/notesappcomponents/EditorContext.jsx';
import edjsHTML from 'editorjs-html';



// const AUTO_SAVE_INTERVAL = 10000;

const DashboardAddPost = ({user}) => {

    //const draftDocId = `draft-${user?.uid}`;
    // const { draftId } = useParams();
    // const draftDocId = draftId || `draft-${user?.uid}`;
    const navigate = useNavigate();

    const [title, setTitle] = useState('');
    const [subtitle, setSubtitle] = useState('');
    const [description, setDescription] = useState('');
    const [content, setContent] = useState("");
    const [editorData, setEditorData] = useState(null);
    const [image, setImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [categoryId, setCategoryId] = useState('');
    const [categoryTitle, setCategoryTitle] = useState('');
    const [subcategoryId, setSubcategoryId] = useState('');
    const [subcategoryTitle, setSubcategoryTitle] = useState('');
    const [category, setCategory] = useState('');
    const [subcategory, setSubcategory] = useState('');
    const [categories, setCategories] = useState([]);
    // const [subcategories, setSubcategories] = useState([]);

    const [tags, setTags] = useState([]);
    const [tagInput, setTagInput] = useState('');
    const [tagSuggestions, setTagSuggestions] = useState([]);
    const [hashtags, setHashtags] = useState([]);
     const [hashtagInput, setHashtagInput] = useState('');
    // const [hashtagInput, setHashTagInput] = useState('');
    const [selected, setSelected] = useState([]);

    const [photo, setPhoto] = useState(null);
    const [imageShow, setImageShow] = useState("");

    const [categoryTypes, setCategoryTypes] = useState([]); // This is the array of types
    const [selectedCategoryType, setSelectedCategoryType] = useState(''); // This is the selected value
    const [segments, setSegments] = useState([]);
    const [selectedSegment, setSelectedSegment] = useState('');
    const [categoryOptions, setCategoryOptions] = useState([]);
    const [selectedCategoryOption, setSelectedCategoryOption] = useState('');
    // const [categories, setCategories] = useState([]);

    const [uploadProgress, setUploadProgress] = useState(0);
    const [message, setMessage] = useState("");
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    const [slug, setSlug] = useState('');
    const [isSlugUnique, setIsSlugUnique] = useState(true);
    const [checkingSlug, setCheckingSlug] = useState(false);
    const [slugEdited, setSlugEdited] = useState(false);

    const [previewMode, setPreviewMode] = useState(false);
    const [showPreviewModal, setShowPreviewModal] = useState(false);
    const [editorPreviewHTML, setEditorPreviewHTML] = useState('');

    const [text, setText] = useState('');
    
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
            const snapshot = await getDocs(collection(db, col)); // ✅ define snapshot here
            const data = snapshot.docs
                .map(doc => doc.data().name || doc.data().title)
                .filter(val => typeof val === 'string'); // ✅ Ensure valid strings only
            setter(data);
        };

        await Promise.all([
            fetch("segments", setSegments),
            fetch("category-types", setCategoryTypes),
            fetch("category-options", setCategoryOptions),
            // fetch("categories", setCategories),
        ]);
        };
        fetchAll();
    }, []);


    useEffect(() => {
        if (!editorRef.current) {
        const interval = setInterval(() => {
            const editorElement = document.getElementById('editorjs');
            if (editorElement && !editorRef.current) {
            initEditor();
            editorRef.current = true;
            clearInterval(interval);
            }
        }, 100);

        return () => clearInterval(interval);
        }
    }, [initEditor]);


    // Inside useEffect
    useEffect(() => {
    const fetchCategories = async () => {
        const snapshot = await getDocs(collection(db, 'categories'));
        const categoryList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
        }));
        setCategories(categoryList);
    };
    fetchCategories();
    }, []);

    // Category filters
    const mainCategories = categories.filter(cat => !cat.parentId || cat.parentId === null);
    const subcategories = categories.filter(cat => cat.parentId === category);

   
   // slug chenge
    // const generateSlug = (text) =>
    // text.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
   const generateSlug = (text) =>
        text.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');
    
    

    useEffect(() => {
        if (!slug) return;

        const delayDebounceFn = setTimeout(async () => {
            setCheckingSlug(true);
            const querySnapshot = await getDocs(collection(db, 'posts'));
            const exists = querySnapshot.docs.some(doc => doc.data().slug === slug);
            setIsSlugUnique(!exists);
            setCheckingSlug(false);
        }, 500);

        return () => clearTimeout(delayDebounceFn);
    }, [slug]);

    const generateUniqueSlug = async (base) => {
        let slug = base;
        let counter = 1;
        while (true) {
        const q = query(collection(db, "posts"), where("slug", "==", slug));
        const snap = await getDocs(q);
        if (snap.empty) break;
        slug = `${base}-${counter++}`;
        }
        return slug;
    };

    // title change
    const handleTitleChange = (e) => {
        const value = e.target.value;
        setTitle(value);

        if (!slugEdited) {
            const newSlug = generateSlug(value);
            // setSlug(newSlug);
            generateUniqueSlug(newSlug).then(setSlug);
        }
    };

    // Auto-unique slug when user edits slug field manually
    const handleSlugChange = async (e) => {
        const base = generateSlug(e.target.value);
        const unique = await generateUniqueSlug(base);
        setSlug(unique);
        setSlugEdited(true);
    };

    /*
    const autoSaveToDraft = async () => {
        if (!user?.uid) {
            console.warn("Skipping draft save: user.uid not ready");
            return;
        }
        try {
            if (!editorInstanceRef.current || !editorInstanceRef.current?.save) return;
            const editorContent = await editorInstanceRef.current.save();
            const draft = {
            title,
            subtitle,
            description,
            content,
            editorjs: editorContent,
            slug,
            tags,
            hashtags,
            imagePreview,
            categoryType: selectedCategoryType,
            categoryOption: selectedCategoryOption,
            segment: selectedSegment,
            category,
            categoryId,
            subcategory,
            subcategoryId,
            categoryTitle,
            subcategoryTitle,
            updatedAt: Timestamp.now(),
            createdAt: Timestamp.now(), // added for sorting support
            status: 'draft',
            author: user?.displayName,
            userId: user?.uid,
            };
            await setDoc(doc(db, 'posts', draftDocId), draft);
            // If it was a new draft, redirect once
            if (!draftId) {
                navigate(`/dashboard/add-post/${draftDocId}`);
            }
            console.log("Auto-saved draft");
        } catch (error) {
            console.error("Auto-save failed:", error);
        }
    };


    useEffect(() => {
        const interval = setInterval(autoSaveToDraft, AUTO_SAVE_INTERVAL);
        return () => clearInterval(interval);
    }, [title, subtitle, description, content, tags, selected, slug, hashtags, imagePreview, 
        category, subcategory, draftDocId, user,  selectedCategoryType, selectedSegment, 
        selectedCategoryOption, editorInstanceRef]);

    useEffect(() => {
        if (!draftId) return;
        const fetchDraft = async () => {
        const docRef = doc(db, 'posts', draftId);
        const draftSnap = await getDoc(docRef);
        if (draftSnap.exists()) {
            const data = draftSnap.data();
            setTitle(data.title || '');
            setSubtitle(data.subtitle || '');
            setDescription(data.description || '');
            setContent(data.content || '');
            setSlug(data.slug || '');
            setTags(data.tags || []);
            setSelected(data.selected || []);
            setHashtags(data.hashtags || '');
            setImagePreview(data.imagePreview || null);
            setEditorData(data.editorjs || null);
            setCategoryId(data.categoryId || '');
            setCategoryTitle(data.categoryTitle || '');
            setSubcategoryId(data.subcategoryId || '');
            setSubcategoryTitle(data.subcategoryTitle || '');
            setCategory(data.category || '');
            setSubcategory(data.subcategory || '');
            setSelectedCategoryType(data.categoryType || '');
            setSelectedSegment(data.segment || '');
            setSelectedCategoryOption(data.categoryOption || '');
            }
        };
        fetchDraft();
    }, []);
    */

    const edjsParser = edjsHTML(); // returns { parse: fn }

    const renderEditorPreview = async () => {
        if (!editorInstanceRef.current) return;

        try {
            await editorInstanceRef.current.isReady; // ensure editor is ready

            const savedData = await editorInstanceRef.current.save();

            if (!savedData || !savedData.blocks || !savedData?.blocks?.length || savedData.blocks.length === 0) {
            setEditorPreviewHTML('<p>No content in editor.</p>');
            return;
            }

            // const edjsParser = edjsHTML();
            const htmlArray = edjsParser.parse(savedData.blocks); // ✅ pass savedData.blocks
            // const htmlBlocks = edjsParser.parse(savedData);
            // const html = htmlBlocks.join('');
             const html = htmlArray.join('');
            setEditorPreviewHTML(html);
            setPreviewMode(true);
            console.log('Saved EditorJS data:', savedData);
            console.log('EditorJS saved blocks:', savedData.blocks);
            console.log('Parsed HTML output:', htmlArray);

        } catch (err) {
            console.error("EditorJS Preview Error:", err);
            setEditorPreviewHTML('<p style="color:red;">Error loading preview</p>');
        }
    };



    // image and photo change
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setImage(file);
        if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
            setImagePreview(reader.result);
        };
        reader.readAsDataURL(file);
        }
    };

  const handleImageShow = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhoto(file);
      setImageShow(URL.createObjectURL(file));
    }
  }; 

  // tag
    const handleTagAdd = () => {
    const trimmedTag = tagInput.trim();
    if (trimmedTag && !tags.includes(trimmedTag)) {
        setTags([...tags, trimmedTag]);
        setTagInput('');
    }
    };

    const handleTagRemove = (tagToRemove) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
    };

    const handleTagKeyDown = (e) => {
        if (e.key === 'Enter' && tagInput.trim()) {
        e.preventDefault();
        if (!tags.includes(tagInput.trim())) {
            setTags([...tags, tagInput.trim()]);
        }
        setTagInput('');
        }
    };

     // Hashtag input add (similar logic, can adjust if needed)
    const handleHashtagAdd = () => {
        const trimmed = hashtagInput.trim();
        if (trimmed && !hashtags.includes(trimmed)) {
            setHashtags([...hashtags, trimmed]);
            setHashtagInput('');
        }
    };

    // Hashtag remove
    const handleHashtagRemove = (tag) => {
        setHashtags(hashtags.filter(t => t !== tag));
    };

    useEffect(() => {
        const fetchTagsFromPosts = async () => {
        const snap = await getDocs(collection(db, 'posts'));
        const allTags = snap.docs.flatMap(doc => doc.data().tags || []);
        const uniqueTags = [...new Set(allTags)];
        setTagSuggestions(uniqueTags);
        };
        fetchTagsFromPosts();
    }, []);


    // const handleSubmit = async (e, publish = false)  => {
    // const handleSubmit = async (e)  => {
    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setSuccess('');
        
        if (!editorInstanceRef.current?.save) {
        setMessage("Editor not ready");
        setLoading(false);
        return;
        }
        const data = await editorInstanceRef.current.save();
        
        if (!title || !category || !image || data.blocks?.length === 0) {
            setMessage("Please fill all required fields");
            setLoading(false);
            return;
        }
        if (!isSlugUnique) {
            setMessage('Slug is already used by another post');
            return;
        }
        setLoading(true);

        try {
            const catTitle = categories.find(c => c.id === category)?.name || '';
            const subcatTitle = categories.find(s => s.id === subcategory)?.name || '';

            let imageUrl = imagePreview;
            if (image) {
                const imageRef = ref(storage, `posts/${Date.now()}_${image.name}`);
                await uploadBytes(imageRef, image);
                imageUrl = await getDownloadURL(imageRef);
            }

            const baseSlug = generateSlug(title);
            const slug = await generateUniqueSlug(baseSlug);
            const editorContent = await editorInstanceRef.current?.save?.() || {};

            const postData = {
            title,
            subtitle,
            description,
            content: text,
            // editorjs: data,
            editorjs: editorContent,
            categoryId: category,
            categoryTitle: catTitle,
            subcategoryId: subcategory,
            subcategoryTitle: subcatTitle,
            categoryType: selectedCategoryType,
            segment: selectedSegment,
            categoryOption: selectedCategoryOption,
            tags,
            // hashtags: selected,
            hashtags,
            // imageUrl: imageUrl || '',                          // real URL when published
            // imagePreview: imagePreview || '', // base64 for draft only
            imageUrl,
            slug,
            author: user?.displayName,
            userId: user?.uid,
            status: 'published',
            createdAt: new Date().toISOString(),
            };

            console.log(postData)
            await addDoc(collection(db, 'posts'), postData);
            setSuccess('Post published!');
            // navigate('/all-posts');

            // 🔥 Try writing to Firestore
            // await addDoc(collection(db, 'posts'), postData);
            // if (draftId) {
            //    await updateDoc(doc(db, 'posts', draftId), postData);
            // } else {
            //    await addDoc(collection(db, 'posts'), postData);
            // }
            // setSuccess(publish ? 'Posted!' : 'Draft saved!');
            // if (publish) navigate('/dashboard/all-post-list'); // adjust as needed
            setMessage('');
            setLoading(false);
            // setSuccess(`Post ${!publish ? 'saved as draft' : 'published'} successfully!`);
             setSuccess('Post published successfully!');
            setTitle('');
            setSubtitle('');
            setDescription('');
            setCategoryId('');
            setCategoryTitle('');
            setSubcategoryId('');
            setSubcategoryTitle('');
            setTags([]);
            setTagInput('');
            setHashtags([]);
            setHashtagInput('');
            setCategoryTypes('');
            setSegments('');
            setCategoryOptions('');
            setImage(null);
            setImagePreview(null);
            setSlug('');
            setText('');
            console.log('Post successful!')
            // console.log(`Post ${!publish ? 'saved as draft' : 'published'} successfully!`)
            navigate('/dashboard/all-post-list');
        } catch (error) {
            console.error("Error submitting post:", error);
            setMessage("Failed to submit post. Please check console.");
        }
        setLoading(false);
    };

    const clonePost = () => {
        setSlugEdited(false);
        generateUniqueSlug(generateSlug(title)).then(setSlug);
    };


  return (
    <div className='container-fluid'  >

    <div>

        <div  >
        <h1>Add Post</h1>
        
        <div className='d-flex' >
            <DropdownButton
                as='ButtonGroup'
                // key={variant}
                // id={dropdown-variants-Primary}
                variant='info'
                title='Note'
            >
                <Dropdown.Item eventKey="1">
                    <Link to='/add-note/post/id' >Add Note</Link>
                </Dropdown.Item>
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
            
        <div style={{margin: '2% -10% 2% -4%'}} >
    
            <Card className="shadow-sm" style={{ transition: 'none', transform: 'none' }}>
                <Card.Header>
                <h2>'New Post'</h2>
                {message && <Alert variant="danger">{message}</Alert>}
                {success && <Alert variant="success">{success}</Alert>}
                <h4 className="mb-0">Create Post</h4>
                <h3>Add New Post</h3>
                </Card.Header>

                <div className="mb-3 d-flex gap-2">
                    <Button variant="info" onClick={() => setShowPreviewModal(true)}>Overlay Preview</Button>
                    <Button variant="warning" onClick={() => setPreviewMode(!previewMode)}>
                    {previewMode ? 'Back to Edit' : 'Preview Inline'}
                    </Button>
                    {/*draftId && <Button variant="secondary" onClick={clonePost}>Clone (new draft)</Button>*/}
                    <Button variant="secondary" onClick={clonePost}>Clone (new draft)</Button>
                </div>

              
                 <Modal show={showPreviewModal} onHide={() => setShowPreviewModal(false)} size="lg">
                    <Modal.Header closeButton><Modal.Title>Preview</Modal.Title></Modal.Header>
                    <Modal.Body>
                    <h3>{title}</h3>
                    {imagePreview && <Image src={imagePreview} fluid className="mb-3" />}
                    <h5>{subtitle}</h5>
                    <MDEditor.Markdown source={description} />
                    <div dangerouslySetInnerHTML={{ __html: text }} className="mt-3" />
                    <div dangerouslySetInnerHTML={{ __html: editorPreviewHTML }} className="mt-3" />
                    </Modal.Body>
                </Modal>

                {previewMode && (
                <Card className="mt-5">
                    <Card.Header><strong>Preview Mode</strong></Card.Header>
                    <Card.Body>
                    <h2>{title}</h2>
                    <h5 className="text-muted">{subtitle}</h5>
                    <p><strong>Slug:</strong> {slug}</p>
                    <p><strong>Category:</strong> {categoryTypes}</p>
                    <p><strong>Segment:</strong> {segments}</p>
                    <p><strong>Option:</strong> {categoryOptions}</p>
                    <p><strong>Tags:</strong> {tags.join(', ')}</p>
                    <p><strong>Hashtags:</strong> {selected.join(', ')}</p>
                    {imagePreview && <img src={imagePreview} alt="preview" className="img-fluid my-3" />}
                    <h4 className="mt-4">Description</h4>
                    <MDEditor.Markdown source={description} />
                    <h4 className="mt-4">EditorJS Content</h4>
                    <div dangerouslySetInnerHTML={{ __html: editorPreviewHTML }} />
                    <h4 className="mt-4">Jodit Content</h4>
                    <div dangerouslySetInnerHTML={{ __html: text }} />
                    </Card.Body>
                </Card>
                )}


                <Card.Body>

                {previewMode ? (
                    <div className="preview-mode mt-4">
                        <h2>{title}</h2>
                        <h5 className="text-muted">{subtitle}</h5>
                        <p><strong>Slug:</strong> {slug}</p>
                        <p><strong>Category:</strong> {selectedCategoryType}</p>
                        <p><strong>Segment:</strong> {selectedSegment}</p>
                        <p><strong>Category Option:</strong> {selectedCategoryOption}</p>
                        <hr />
                        <h4>Description</h4>
                        <div className="border p-3" dangerouslySetInnerHTML={{ __html: description }} />
                        <hr />
                        <h4>Tags</h4>
                        <div>
                        {tags.map(tag => (
                            <Badge bg="info" key={tag} className="me-2">{tag}</Badge>
                        ))}
                        </div>
                        <h4 className="mt-3">Hashtags</h4>
                        <div>
                        {selected.map(tag => (
                            <Badge bg="dark" key={tag} className="me-2">#{tag}</Badge>
                        ))}
                        </div>
                        <hr />
                        <h4>Jodit Content</h4>
                        <div className="border p-3" dangerouslySetInnerHTML={{ __html: text }} />
                        <hr />
                        <h4>Image Preview</h4>
                        {imagePreview && <Image src={imagePreview} fluid style={{ maxHeight: 300 }} />}
                        <MDEditor.Markdown source={description} />
                        <div dangerouslySetInnerHTML={{ __html: editorPreviewHTML }} />
                        <div className="mt-3">
                            <h6>Tags:</h6>
                            {tags.map(t => <Badge bg="primary" key={t} className="me-1">#{t}</Badge>)}
                        </div>
                    </div>
                    ) : (

                <Form className="mt-4"
                   // onSubmit={e => handleSubmit(e, true)} 
                   // onSubmit={e => handleSubmit(e)} 
                   onSubmit={handleSubmit}
                  >
                    
                    <div>
                    
                    {imagePreview && (
                        <div className='text-center mb-4' > 
                        <img className='img-fluid mb-4'  src={imagePreview} alt="..."  style={{width:'300px', minHeight:'200px'}}  />
                        </div>
                    )}
                    </div>                    

                    <div 
                        className="dropzone mt-4  border-dashed rounded-2 min-h-0"
                        >
                        <Form.Label>Image</Form.Label>
                        <Form.Control type="file" onChange={handleImageChange} required />
                    </div>
                    <Row>
                    <Col md={6}>
                        <Form.Group className="mb-3">
                        <Form.Label>Date</Form.Label>
                        <Form.Control type="date" placeholder="Select Date" />
                        </Form.Group>
                    </Col>
                    <Col md={6}>
                        <Form.Group className="mb-3">
                        <Form.Label>Time</Form.Label>
                        <Form.Control type="time" placeholder="Select Date" />
                        </Form.Group>
                    </Col>
                    <Col md={12}>
                    <Form.Group className="mb-3">
                        <Form.Label>Title</Form.Label>
                        <Form.Control
                            placeholder="Post Title"
                            value={title}
                            // onChange={(e) => {
                            //    setTitle(e.target.value);
                            //     setSlug(generateSlug(e.target.value));
                                // setSlug(generateUniqueSlug(e.target.value))
                            // }}
                            onChange={handleTitleChange}
                            required
                        />
                        <Form.Text>
                            Keep your post titles under 60 characters...
                        </Form.Text>
                    </Form.Group>
                        <Form.Group className="mb-3">
                        <Form.Label>Subtitle</Form.Label>
                        <Form.Control
                            placeholder="Post Sub Title"
                            value={subtitle}
                            onChange={(e) => setSubtitle(e.target.value)}
                        />
                        </Form.Group>
                    </Col>

                    <Col md={12}>
                        
                        <Form.Group className="mb-3">
                        <Form.Label>Slug</Form.Label>
                        <Form.Control
                            type="text"
                            value={slug}
                            onChange={handleSlugChange}
                            isInvalid={!isSlugUnique}
                        />
                        {checkingSlug ? (
                            <Form.Text className="text-muted">Checking slug...</Form.Text>
                        ) : isSlugUnique ? (
                            <Form.Text className="text-success">Slug is available</Form.Text>
                        ) : (
                            <Form.Text className="text-danger">Slug is already taken</Form.Text>
                        )}
                        </Form.Group>

                        <Form.Text>Field must contain a unique value</Form.Text>
                        
                    </Col>

                    <div className="col-md-4">
                        <select 
                            name="categoryType" 
                            value={selectedCategoryType} 
                            // onChange={handleChange} 
                            onChange={(e) => setSelectedCategoryType(e.target.value)}
                            className="form-control"
                          >
                        <option value="">Select Category Type</option>
                        {(Array.isArray(categoryTypes) ? categoryTypes : []).map((ct, i) => (
                            <option key={i} value={ct}>{ct}</option>
                        ))}
                        </select>
                    </div>
                    <div className="col-md-4">
                        <select 
                            name="segment" 
                            value={selectedSegment} 
                            onChange={(e) => setSelectedSegment(e.target.value)} 
                            className="form-control"
                          >
                        <option value="">Select Segment</option>
                        {(Array.isArray(segments) ? segments : []).map((s, i) => (
                            <option key={i} value={s}>{s}</option>
                        ))}
                        </select>
                    </div>

                    <div className="col-md-4">
                        <select 
                            name="categoryOption" 
                            value={selectedCategoryOption} 
                            onChange={(e) => setSelectedCategoryOption(e.target.value)} 
                            className="form-control"
                          >
                        <option value="">Select Category Option</option>
                        {(Array.isArray(categoryOptions) ? categoryOptions : []).map((opt, i) => (
                            <option key={i} value={opt}>{opt}</option>
                        ))}
                        </select>
                    </div>
                    <br/><br/><br/>

                    <Col md={12}>
                        <Form.Group className="mb-3">
                        <Form.Label>Description</Form.Label>
                            
                        <div style={{width:'100%', height:'100%'}} >
                            <MDEditor
                                value={description}
                                // onChange={(val) => setForm({ ...form, description: val })}
                                onChange={setDescription}
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
                        <Form.Text>A short extract from writing.</Form.Text>
                        </Form.Group>
                    </Col>

                    <Col md={6}>
                        <Form.Group className="mb-3">
                        <Form.Label>Category</Form.Label>
                        <Form.Select
                            value={category}
                            onChange={(e) => {
                            setCategory(e.target.value);
                            setSubcategory('');
                            }}
                            required
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
                            value={subcategory}
                            onChange={(e) => setSubcategory(e.target.value)}
                            disabled={!category}
                        >
                            <option value="">Select Subcategory</option>
                            {subcategories.map(sub => (
                                <option key={sub.id} value={sub.id}>{sub.name}</option>
                            ))}
                        </Form.Select>
                        </Form.Group>
                    </Col>

                    <Col md={12}>
                        <Form.Group className="mb-3">
                        <Form.Label>Hash Tags (comma separated)</Form.Label>
                        
                        </Form.Group>
                        <div className="col-12 py-3">
                        <div>
                            <h6>Add Hash Tags</h6>
                            <pre>{JSON.stringify(selected)}</pre>
                            <TagsInput
                            value={selected}
                            onChange={setSelected}
                            name="hashtags"
                            placeHolder="enter fruits"
                            />
                            <em>press enter or comma to add new tag</em>
                        </div>
                        </div>
                    </Col>


                    <Col md={12}>
                    <Form.Group className="mb-3">
                        <Form.Label>Tags</Form.Label>
                        <InputGroup>
                        <Form.Control
                            type="text"
                            placeholder="Add tag"
                            value={tagInput}
                            onChange={(e) => setTagInput(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' || e.key === ',') {
                                    e.preventDefault();
                                    handleTagAdd();
                                    // handleTagKeyDown();
                                }
                            }}
                        />
                        
                        

                        <Button variant="outline-secondary" onClick={handleTagAdd}>
                            Add
                        </Button>
                        </InputGroup>

                        {tagInput && (
                            <div className="border mt-1 p-2 bg-light">
                                {tagSuggestions
                                .filter(s => s.toLowerCase().includes(tagInput.toLowerCase()) && !tags.includes(s))
                                .slice(0, 5)
                                .map((s, i) => (
                                    <div key={i} style={{ cursor: 'pointer' }} onClick={() => {
                                    setTags([...tags, s]);
                                    setTagInput('');
                                    }}>{s}</div>
                                ))}
                            </div>
                        )}

                        <Form.Text className="text-muted">Press enter or click "Add" to add tag</Form.Text>
                    </Form.Group>

                    <div className="d-flex flex-wrap gap-2 mt-2">
                        {tags.map((tag) => (
                        <Badge
                            key={tag}
                            bg="secondary"
                            className="d-flex align-items-center"
                            style={{ padding: '0.5em' }}
                        >
                            {tag}
                            <Button
                            variant="link"
                            size="sm"
                            onClick={() => handleTagRemove(tag)}
                            className="ms-2 p-0 text-white"
                            style={{ textDecoration: 'none' }}
                            >
                            ×
                            </Button>
                        </Badge>
                        ))}
                    </div>
                    </Col>


                    <Form.Group className="mb-3" controlId="postHashtags">
                        <Form.Label>Hashtags</Form.Label>
                        <Form.Control
                        type="text"
                        value={hashtagInput}
                        onChange={e => setHashtagInput(e.target.value)}
                        onKeyDown={e => {
                            if (e.key === 'Enter') {
                            e.preventDefault();
                            handleHashtagAdd();
                            }
                        }}
                        placeholder="Type hashtag (without #) and press Enter"
                        />
                        <div className="mt-2">
                        {hashtags.map(tag => (
                            <Badge key={tag} bg="secondary" className="me-2" style={{ cursor: 'pointer' }} onClick={() => handleHashtagRemove(tag)}>
                            #{tag} &times;
                            </Badge>
                        ))}
                        </div>
                    </Form.Group>    
                    

                    <div style={{marginTop:'30px'}} >
                        
                    <div className="col-md-12">
                        <label><strong>Blog Content (EditorJS)</strong></label>
                      
                        <div id="editorjs" 
                            style={{ border: '1px solid #ccc', borderRadius: 4, minHeight: 300, padding: 10 }} 
                            className="border p-3 rounded" 
                        />
                    </div>

                    <div 
                        // className="mt-2 mb-4 p-3 bg-light border rounded editor-box"
                        style={{width:'100%', minHeight:'100%',marginTop:'30px'}}
                      >
                        <div className="mb-3 "  >
                        <JoditEditor
                            value={text}
                            tabIndex = {1}
                            ref = {editor}
                            config={config}
                            onBlur={newText => setText(newText)}
                            onChange={newText => {}}
                        />
                        </div>
                    </div>
                    </div>

                    </Row>

                 
                    <div className="mt-4 d-flex gap-3">
                        <Button type="submit" variant="success" disabled={!isSlugUnique || checkingSlug || loading}>
                        {loading ? <Spinner animation="border" size="sm" /> : 'Publish'}
                        </Button>
                        {/*<Button variant="outline-secondary" onClick={e => handleSubmit(e, false)}>Save Draft</Button>*/}
                    </div>


                </Form>

                )}

                </Card.Body>
            </Card>

        </div>

        </div>
      
    </div>

    
    </div>
  )
}
export default DashboardAddPost


// DashboardAddPost.jsx
/*
import React, { useEffect, useRef, useState } from 'react';
import { TagsInput } from 'react-tag-input-component';
import MDEditor, { commands } from '@uiw/react-md-editor';
import { Container, Row, Col, Card, Button, Form, InputGroup, Badge, Image, Alert, Spinner, Modal } from 'react-bootstrap';
import JoditEditor from 'jodit-react';
import { useNavigate } from 'react-router-dom';
import { db, storage } from '../../firebase';
import { collection, addDoc, getDocs, doc, query, where } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const DashboardAddPost = () => {
  const navigate = useNavigate();
  const editor = useRef();
  const config = { readonly: false };

  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [description, setDescription] = useState('');
  const [slug, setSlug] = useState('');
  const [isSlugUnique, setIsSlugUnique] = useState(true);
  const [checkingSlug, setCheckingSlug] = useState(false);
  const [slugEdited, setSlugEdited] = useState(false);
  const [text, setText] = useState('');
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [mainCategories, setMainCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [category, setCategory] = useState('');
  const [subcategory, setSubcategory] = useState('');
  const [selected, setSelected] = useState([]);
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState('');
  const [hashtags, setHashtags] = useState([]);
  const [message, setMessage] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      const catSnap = await getDocs(collection(db, 'categories'));
      const cats = catSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setMainCategories(cats.filter(cat => !cat.parentId));
      setSubcategories(cats.filter(cat => cat.parentId));
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const checkSlugUniqueness = async () => {
      if (!slug) return;
      setCheckingSlug(true);
      const q = query(collection(db, 'posts'), where('slug', '==', slug));
      const querySnapshot = await getDocs(q);
      setIsSlugUnique(querySnapshot.empty);
      setCheckingSlug(false);
    };
    checkSlugUniqueness();
  }, [slug]);

  const handleTitleChange = (e) => {
    const val = e.target.value;
    setTitle(val);
    if (!slugEdited) setSlug(val.toLowerCase().replace(/\s+/g, '-'));
  };

  const handleSlugChange = (e) => {
    setSlug(e.target.value.toLowerCase().replace(/\s+/g, '-'));
    setSlugEdited(true);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setSuccess('');

    if (!title || !slug || (!image && !imagePreview)) {
      setMessage('Please fill all required fields');
      return;
    }

    setLoading(true);
    try {
      let imageUrl = imagePreview;
      if (image) {
        const imageRef = ref(storage, `posts/${Date.now()}_${image.name}`);
        await uploadBytes(imageRef, image);
        imageUrl = await getDownloadURL(imageRef);
      }

      const post = {
        title,
        subtitle,
        description,
        slug,
        content: text,
        imageUrl,
        tags,
        hashtags,
        category,
        subcategory,
        createdAt: new Date().toISOString(),
        published: true
      };

      await addDoc(collection(db, 'posts'), post);
      setSuccess('Post published!');
      navigate('/all-posts');
    } catch (err) {
      console.error(err);
      setMessage('Failed to save post');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container fluid>
      <div style={{ margin: '2% -10% 2% -4%' }}>
        <Card className="shadow-sm">
          <Card.Header>
            <h2>New Post</h2>
            {message && <Alert variant="danger">{message}</Alert>}
            {success && <Alert variant="success">{success}</Alert>}
            <Button variant="info" onClick={() => setShowPreviewModal(true)}>Preview</Button>
          </Card.Header>

          <Modal show={showPreviewModal} onHide={() => setShowPreviewModal(false)} size="lg">
            <Modal.Header closeButton><Modal.Title>Post Preview</Modal.Title></Modal.Header>
            <Modal.Body>
              <h3>{title}</h3>
              <p><strong>Subtitle:</strong> {subtitle}</p>
              {imagePreview && <Image src={imagePreview} fluid className="mb-3" />}
              <MDEditor.Markdown source={description} />
              <div dangerouslySetInnerHTML={{ __html: text }} />
            </Modal.Body>
          </Modal>

          <Card.Body>
            <Form onSubmit={handleSubmit}>
              {imagePreview && (
                <div className='text-center mb-4'>
                  <img className='img-fluid mb-4' src={imagePreview} alt="..." style={{ width: '300px', minHeight: '200px' }} />
                </div>
              )}

              <Form.Group className="mb-3">
                <Form.Label>Image</Form.Label>
                <Form.Control type="file" onChange={handleImageChange} />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Title</Form.Label>
                <Form.Control
                  placeholder="Post Title"
                  value={title}
                  onChange={handleTitleChange}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Subtitle</Form.Label>
                <Form.Control
                  placeholder="Post Subtitle"
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Slug</Form.Label>
                <Form.Control
                  type="text"
                  value={slug}
                  onChange={handleSlugChange}
                  isInvalid={!isSlugUnique}
                />
                {checkingSlug ? (
                  <Form.Text className="text-muted">Checking slug...</Form.Text>
                ) : isSlugUnique ? (
                  <Form.Text className="text-success">Slug is available</Form.Text>
                ) : (
                  <Form.Text className="text-danger">Slug is already taken</Form.Text>
                )}
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Description</Form.Label>
                <MDEditor
                  value={description}
                  onChange={setDescription}
                  commands={[commands.bold, commands.italic, commands.strikethrough]}
                  hideMenu={true}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Full Content (Jodit Editor)</Form.Label>
                <JoditEditor
                  ref={editor}
                  value={text}
                  config={config}
                  onBlur={(newContent) => setText(newContent)}
                />
              </Form.Group>

              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Category</Form.Label>
                    <Form.Select
                      value={category}
                      onChange={(e) => {
                        setCategory(e.target.value);
                        setSubcategory('');
                      }}
                      required
                    >
                      <option value="">Select Category</option>
                      {mainCategories.map((cat) => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Subcategory</Form.Label>
                    <Form.Select
                      value={subcategory}
                      onChange={(e) => setSubcategory(e.target.value)}
                      disabled={!category}
                    >
                      <option value="">Select Subcategory</option>
                      {subcategories.filter(sub => sub.parentId === category).map((sub) => (
                        <option key={sub.id} value={sub.id}>{sub.name}</option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>

              <Form.Group className="mb-3">
                <Form.Label>Tags</Form.Label>
                <TagsInput value={tags} onChange={setTags} name="tags" placeHolder="Add tags" />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Hashtags</Form.Label>
                <TagsInput value={selected} onChange={setSelected} name="hashtags" placeHolder="Add hashtags" />
              </Form.Group>

              <div className="d-flex gap-2">
                <Button type="submit" variant="success" disabled={loading || !isSlugUnique || checkingSlug}>
                  {loading ? <Spinner animation="border" size="sm" /> : 'Publish'}
                </Button>
              </div>
            </Form>
          </Card.Body>
        </Card>
      </div>
    </Container>
  );
};

export default DashboardAddPost;
*/


