import React, { useState, useEffect, useContext, useRef } from "react";
// import MDEditor from "@uiw/react-md-editor";
import MDEditor, { commands } from '@uiw/react-md-editor';
import { TagsInput } from "react-tag-input-component";
import { toast } from "react-toastify";
import { db, storage } from "../../firebase";
import { addDoc, collection, doc, getDocs, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import EditorJSRenderer from "./EditorJSRenderer"; // ⬅️ for preview
// import EditorJS from "./Editor"; // ⬅️ for editing
import EditorJS from "./Editor.jsx"; // or just "./Editor" if using proper extension
import './AddBlogPost.css';
import EditorContextProvider, { EditorContext } from "../../apps/notesapp/notesappcomponents/EditorContext.jsx";
import { Modal, Badge, Button, Form, InputGroup } from "react-bootstrap";



const initialState = {
  title: "",
  // category: "",
  trending: "no",
  description: "",
  // imgUrl: "",
  content: {},
  status: "published",
    scheduledDate: ""
};


const AddBlogPost = ({ user }) => {

  const [form, setForm] = useState(initialState);
  const [selectedTags, setSelectedTags] = useState([]);
   const [file, setFile] = useState(null);
  const [progress, setProgress] = useState(null);
  const [editorData, setEditorData] = useState(null);
  // const [previewMode, setPreviewMode] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [previewData, setPreviewData] = useState(null);

  const [categoryId, setCategoryId] = useState('');
  const [categoryTitle, setCategoryTitle] = useState('');
  const [subcategoryId, setSubcategoryId] = useState('');
  const [subcategoryTitle, setSubcategoryTitle] = useState('');
  const [category, setCategory] = useState('');
  const [subcategory, setSubcategory] = useState('');
  const [categories, setCategories] = useState([]);

  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState('');
  const [tagSuggestions, setTagSuggestions] = useState([]);
  const [hashtags, setHashtags] = useState([]);
  const [hashtagInput, setHashTagInput] = useState('');
  const [hashtagSuggestions, setHashtagSuggestions] = useState([]);

  const [categoryTypes, setCategoryTypes] = useState([]); // This is the array of types
  const [selectedCategoryType, setSelectedCategoryType] = useState(''); // This is the selected value
  const [segments, setSegments] = useState([]);
  const [selectedSegment, setSelectedSegment] = useState('');
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [selectedCategoryOption, setSelectedCategoryOption] = useState('');

  const [showAudioInput, setShowAudioInput] = useState(false);
  const [showVideoInput, setShowVideoInput] = useState(false);

  const [audioFile, setAudioFile] = useState(null);
  const [videoFile, setVideoFile] = useState(null);

  const [audioPreviewUrl, setAudioPreviewUrl] = useState(null);
  const [videoPreviewUrl, setVideoPreviewUrl] = useState(null);

  const [audioUrl, setAudioUrl] = useState('')
  const [videoUrl, setVideoUrl] = useState('')

  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const handlePreviewToggle = () => {
    handlePreview();
    setShowPreviewModal(!showPreviewModal);
    toast.info(showPreviewModal ? "Preview closed" : "Preview opened");
  }

  const [imgPreviews, setImgPreviews] = useState([]);
  // Each item: { url: string, name: string, isPrimary: boolean }
   const [files, setFiles] = useState([]);
  const [imgUrls, setImgUrls] = useState([]);
  const [uploadProgress, setUploadProgress] = useState({});  

  const { initEditor, editorInstanceRef } = useContext(EditorContext);
  const editorRef = useRef(false);

  const { title, trending, description, imgUrl } = form;

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

  // Initialize EditorJS when DOM is ready
  useEffect(() => {
    if (!editorRef.current) {
      const interval = setInterval(() => {
        if (document.getElementById("editorjs")) {
          initEditor();
          editorRef.current = true;
          clearInterval(interval);
        }
      }, 100);
      return () => clearInterval(interval);
    }
  }, [initEditor]);

  // tag
  const handleTagAdd = () => {
  const trimmedTag = tagInput.trim();
  if (trimmedTag && !tags.includes(trimmedTag)) {
      setTags([...tags, trimmedTag]);
      setTagInput('');
      toast.info(`Tag "${trimmedTag}" added`);
    } else {
      toast.warning("Duplicate or empty tag");
    }
  };

  const handleTagRemove = (tagToRemove) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
    toast.info(`Removed tag "${tagToRemove}"`);
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
          setHashTagInput('');
          toast.info(`Hashtag "#${trimmed}" added`);
      } else {
        toast.warning("Duplicate or empty hashtag");
      }
  };

  // Hashtag remove
  const handleHashtagRemove = (tag) => {
      setHashtags(hashtags.filter(t => t !== tag));
      toast.info(`Removed hashtag "#${tag}"`);
  };

  useEffect(() => {
    const fetchTagsFromPosts = async () => {
      const snap = await getDocs(collection(db, 'blogposts'));
      const allTags = snap.docs.flatMap(doc => doc.data().tags || []);
      const uniqueTags = [...new Set(allTags)];
      setTagSuggestions(uniqueTags);
    };
    fetchTagsFromPosts();
  }, []);

  useEffect(() => {
    const fetchHashTagsFromPosts = async () => {
      const snap = await getDocs(collection(db, 'blogposts'));
      const allTags = snap.docs.flatMap(doc => doc.data().hashtags || []);
      const uniqueTags = [...new Set(allTags)];
      setHashtagSuggestions(uniqueTags);
    };
    fetchHashTagsFromPosts();
  }, []);

  useEffect(() => {
    if (!file) return;
    const uploadTask = uploadBytesResumable(ref(storage, `blogImages/${file.name}`), file);
    uploadTask.on("state_changed", snapshot => {
      setProgress((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
    }, err => toast.error(err.message),
    async () => {
      const url = await getDownloadURL(uploadTask.snapshot.ref);
      setForm(prev => ({ ...prev, imgUrl: url }));
      toast.success("Image uploaded");
    });
  }, [file]); 


  const handlePrimarySelect = (index) => {
    setImgPreviews(prev =>
      prev.map((img, i) => ({
        ...img,
        isPrimary: i === index,
      }))
    );
  };

  const handleImageSelection = (files) => {
    const previews = Array.from(files).map((file) => ({
      file,
      url: URL.createObjectURL(file),
      isPrimary: false,
    }));

    setImgPreviews(previews);
  };


  const handleSingleFileUpload = (file, idx) => {
    if (!file) return;

    const localUrl = URL.createObjectURL(file); // Show temporary thumbnail while uploading

    const updatedPreviews = [...imgPreviews];
    updatedPreviews[idx] = {
      name: file.name,
      url: localUrl,     // Temporary local preview
      isPrimary: imgPreviews[idx]?.isPrimary || false,
      progress: 0,
      uploading: true
    };
    setImgPreviews(updatedPreviews);

    const fileRef = ref(storage, `blogImages/${Date.now()}_${file.name}`);
    const uploadTask = uploadBytesResumable(fileRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const prog = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setImgPreviews((prev) => {
          const newPreviews = [...prev];
          newPreviews[idx].progress = prog;
          return newPreviews;
        });
      },
      (error) => toast.error(error.message),
      async () => {
        const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
        setImgPreviews((prev) => {
          const newPreviews = [...prev];
          newPreviews[idx] = {
            ...newPreviews[idx],
            url: downloadUrl,
            uploading: false,
            progress: 100,
          };
          return newPreviews;
        });
      }
    );
  };


  const handleMoveSingle = (index, direction) => {
    const newPreviews = [...imgPreviews];
    const newFiles = [...files];

    const swapIdx = direction === "up" ? index - 1 : index + 1;

    [newPreviews[index], newPreviews[swapIdx]] = [newPreviews[swapIdx], newPreviews[index]];
    [newFiles[index], newFiles[swapIdx]] = [newFiles[swapIdx], newFiles[index]];

    setImgPreviews(newPreviews);
    setFiles(newFiles);
  };

  const handleImageDeleteSingle = (index) => {
    const newPreviews = imgPreviews.filter((_, i) => i !== index);
    const newFiles = files.filter((_, i) => i !== index);
    setImgPreviews(newPreviews);
    setFiles(newFiles);
  };

  const handlePrimarySelectSingle = (index) => {
    setImgPreviews((prev) =>
      prev.map((img, i) => ({
        ...img,
        isPrimary: i === index,
      }))
    );
  };


  useEffect(() => {
    const uploadMedia = async (file, path, setUrl) => {
      const refPath = ref(storage, `blogMedia/${file.name}`);
      const uploadTask = uploadBytesResumable(refPath, file);
      uploadTask.on(
        "state_changed",
        null,
        (error) => toast.error(error.message),
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then(setUrl);
        }
      );
    };

    if (audioFile) uploadMedia(audioFile, "audio", setAudioUrl);
    if (videoFile) uploadMedia(videoFile, "video", setVideoUrl);
  }, [audioFile, videoFile]);


  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // ⬅️ Prevent full-page reload
    console.log("Submitting blog post..."); // ✅ This should now appear

    // const data = await editorInstanceRef.current?.save?.();
    let data;
    try {
      data = await editorInstanceRef.current?.save?.();
      console.log("Editor saved data:", data);
    } catch (err) {
      console.error("EditorJS failed:", err);
      return;
    }

    if (!title || !category || !description || !imgPreviews.length || data?.blocks?.length === 0) {
      console.log("All required fields must be filled!");
      return toast.error("All required fields must be filled!");        
    }
    if (!title) toast.error("Title is required");
    if (!description) toast.error("Description is required");
    if (!imgPreviews.length) toast.error("Please upload at least one image");


    let uploadedAudioUrl = '';
    let uploadedVideoUrl = '';

    try {
      // 🔁 Upload images to Firebase Storage
    const uploadedUrls = [];

    for (let i = 0; i < imgPreviews.length; i++) {
      const img = imgPreviews[i];
      const storageRef = ref(storage, `blogImages/${Date.now()}_${img.file.name}`);
      const snapshot = await uploadBytesResumable(storageRef, img.file);
      const downloadUrl = await getDownloadURL(snapshot.ref);
      uploadedUrls.push({
        url: downloadUrl,
        isPrimary: img.isPrimary,
      });
    }

    if (audioFile) {
      const audioRef = ref(storage, `blogMedia/audio_${Date.now()}_${audioFile.name}`);
      const audioSnap = await uploadBytesResumable(audioRef, audioFile);
      uploadedAudioUrl = await getDownloadURL(audioSnap.ref);
    }

    if (videoFile) {
      const videoRef = ref(storage, `blogMedia/video_${Date.now()}_${videoFile.name}`);
      const videoSnap = await uploadBytesResumable(videoRef, videoFile);
      uploadedVideoUrl = await getDownloadURL(videoSnap.ref);
    }

    // const primaryImg = imgPreviews.find(img => img.isPrimary)?.url || imgPreviews[0]?.url || '';
    const primaryImg = uploadedUrls.find(img => img.isPrimary)?.url || uploadedUrls[0]?.url || '';
    const catTitle = categories.find(c => c.id === category)?.name || '';
    const subcatTitle = categories.find(s => s.id === subcategory)?.name || '';

    await addDoc(collection(db, "blogposts"), {
      ...form,
      content: data,
      categoryId: category,
      categoryTitle: catTitle,
      subcategoryId: subcategory,
      subcategoryTitle: subcatTitle,
      categoryType: selectedCategoryType,
      segment: selectedSegment,
      categoryOption: selectedCategoryOption,
      tags,
      hashtags,
      audioUrl: uploadedAudioUrl,
      videoUrl: uploadedVideoUrl,
      // imgUrl,
      images: uploadedUrls.map(img => img.url),
      primaryImg,
      userId: user.uid,
      author: user.displayName,
      timestamp: serverTimestamp(),
    });

      toast.success("Blog post published successfully!");
      console.log("Blog post published!");

      // Reset
      setForm(initialState);
      setSelectedTags([]);
      setEditorData(null);
      setShowPreview(false);
      setImgPreviews([]);
      setAudioFile('');
      setVideoFile('');
      setFiles([]);
    } catch (err) {
      toast.error("Failed to publish blog post");
      console.log(err);
    }
  };


  const handlePreview = async () => {
    // Toggle off if already showing
    if (showPreview) {
      setShowPreview(false);
      return;
    }

    const data = await editorInstanceRef.current?.save?.();
    if (!title || !category || !description || data?.blocks?.length === 0) {
      return toast.error("All required fields must be filled!");
    }

    setPreviewData({
      ...form,
      tags,
      hashtags,
      categoryTitle: categories.find(c => c.id === category)?.name || '',
      subcategoryTitle: categories.find(s => s.id === subcategory)?.name || '',
      content: data,
      images: imgPreviews,
      audioUrl,
      videoUrl
    });

    setShowPreview(true);
  };


  return (
    
    <div className="container mt-4">
      <h3>"Create Blog Post"</h3>
        
      <form className="row g-3" 
        // onSubmit={e => e.preventDefault()}
        onSubmit={handleSubmit}
        >
        <div className="col-md-12">
          <input type="text" name="title" value={title} onChange={handleChange} placeholder="Blog Title" className="form-control" required />
        </div>

        <div className="col-md-6">
          <select name="trending" value={trending} onChange={handleChange} className="form-control form-select">
            <option value="no">Not Trending</option>
            <option value="yes">Trending</option>
          </select>
        </div>
        
        <div className="col-md-6">
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
        <div className="col-md-6">
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
        <div className="col-md-6">
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

        <div className="col-md-6">
          <select name="category" value={category}
            onChange={(e) => {
            setCategory(e.target.value);
            setSubcategory('');
            }}
            required
              className="form-control"
          >
            <option value="">Select Category</option>
            {mainCategories.map(cat => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>
        <div className="col-md-6">
          <select name="category" value={subcategory}
            onChange={(e) => setSubcategory(e.target.value)}
            disabled={!category} 
            className="form-control"
          >
            <option value="">Select Subcategory</option>
            {subcategories.map(sub => (
                <option key={sub.id} value={sub.id}>{sub.name}</option>
            ))}
          </select>
        </div>
        
        {/* <div className="col-md-12">
          <pre>{JSON.stringify(selectedTags)}</pre>
          <TagsInput value={selectedTags} onChange={setSelectedTags} placeHolder="Add tags" />
        </div> */}
        
        <div className="col-md-12" >
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
        </div>

        <div className="col-md-12" >
          <Form.Group className="mb-3" controlId="postHashtags">
              <Form.Label>Hashtags</Form.Label>
              <Form.Control
              type="text"
              value={hashtagInput}
              onChange={e => setHashTagInput(e.target.value)}
              onKeyDown={e => {
                  if (e.key === 'Enter') {
                  e.preventDefault();
                  handleHashtagAdd();
                  }
              }}
              placeholder="Type hashtag (without #) and press Enter"
              />
              {hashtagInput && (
                <div className="border mt-1 p-2 bg-light">
                  {hashtagSuggestions
                    .filter(s => s.toLowerCase().includes(hashtagInput.toLowerCase()) && !hashtags.includes(s))
                    .slice(0, 5)
                    .map((s, i) => (
                      <div key={i} style={{ cursor: 'pointer' }} onClick={() => {
                        setHashtags([...hashtags, s]);
                        setHashTagInput('');
                      }}>{s}</div>
                    ))}
                </div>
              )}
              <div className="pull-right" >
              <Button variant="outline-secondary" onClick={handleHashtagAdd}>
                  Add
              </Button>
              </div>

              <div className="mt-2">
              {hashtags.map(tag => (
                  <Badge key={tag} bg="secondary" className="me-2" style={{ cursor: 'pointer' }} onClick={() => handleHashtagRemove(tag)}>
                  #{tag} &times;
                  </Badge>
              ))}
              </div>
          </Form.Group>
        </div>

        
        <div className="col-md-12">
          <label><strong>Description (MDEditor - Bangla Supported)</strong></label>
          <MDEditor 
              value={description} 
              onChange={val => setForm(prev => ({ ...prev, description: val }))} 
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
              hidemenu={true}
            />
        </div>
        <div className="col-md-12">
          <label><strong>Content Editor:</strong></label>
          <div id="editorjs"></div>
        </div>


        <div className="col-md-12">

          <div className="col-md-12 mb-3">
            <Button variant="outline-primary" onClick={() => setFiles([...files, null])}>
              + Add Image
            </Button>
          </div>

          {files.map((_, idx) => (
            <div key={idx} className="row g-2 align-items-center mb-3">
              {/* Input field */}
              <div className="col-md-6">
                <input
                  type="file"
                  accept="image/*"
                  // onChange={(e) => handleSingleFileUpload(e.target.files[0], idx)}
                  onChange={(e) => handleImageSelection(e.target.files)}
                  className="form-control"
                />
              </div>

              {/* Thumbnail + progress bar */}
              <div className="col-md-3">
                {imgPreviews[idx]?.url ? (
                  <>
                    <img
                      src={imgPreviews[idx].url}
                      alt={`Preview-${idx}`}
                      className="img-fluid rounded border"
                      style={{ maxHeight: 100 }}
                    />
                    {imgPreviews[idx]?.uploading && (
                      <div className="progress mt-2">
                        <div
                          className="progress-bar"
                          role="progressbar"
                          style={{ width: `${imgPreviews[idx].progress || 0}%` }}
                          aria-valuenow={imgPreviews[idx].progress || 0}
                          aria-valuemin="0"
                          aria-valuemax="100"
                        >
                          {Math.round(imgPreviews[idx].progress || 0)}%
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <span className="text-muted">No preview</span>
                )}
              </div>

              {/* Action buttons */}
              <div className="col-md-3 d-flex gap-1">
                <Button variant="danger" size="sm" onClick={() => handleImageDeleteSingle(idx)}>🗑</Button>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => handleMoveSingle(idx, 'up')}
                  disabled={idx === 0}
                >
                  ⬆
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => handleMoveSingle(idx, 'down')}
                  disabled={idx === imgPreviews.length - 1}
                >
                  ⬇
                </Button>
                <Button
                  variant="outline-primary"
                  size="sm"
                  onClick={() => handlePrimarySelectSingle(idx)}
                  active={imgPreviews[idx]?.isPrimary}
                >
                  ★
                </Button>
              </div>

              {imgPreviews[idx]?.isPrimary && (
                <span className="badge bg-primary position-absolute top-0 end-0 m-2">
                  Primary
                </span>
              )}

            </div>

          ))}



        </div>

        <div className="col-md-12 d-flex gap-2 mb-3">
          <Button variant="outline-secondary" onClick={() => setShowAudioInput(prev => !prev)}>
            {showAudioInput ? "Hide Audio" : "Add Audio"}
          </Button>

          {showAudioInput && (
          <div className="col-md-6">
            <label>Upload Audio</label>
            <input
              type="file"
              accept="audio/*"
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) {
                  setAudioFile(file);
                  setAudioPreviewUrl(URL.createObjectURL(file));
                  toast.info("Audio file selected for upload");
                }
              }}
            />
            
          </div>
          )}

        </div>

        <div className="col-md-12 d-flex gap-2 mb-3">
          <Button variant="outline-secondary" onClick={() => setShowVideoInput(prev => !prev)}>
            {showVideoInput ? "Hide Video" : "Add Video"}
          </Button>
        
          {showVideoInput && (
            <div className="col-md-6">
              <label>Upload Video</label>
              <input
                type="file"
                accept="video/*"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    setVideoFile(file);
                    setVideoPreviewUrl(URL.createObjectURL(file));
                    toast.info("Video file selected for upload");
                  }
                }}
              />
              
            </div>
          )}
        </div>


        {/* Add these buttons at the bottom */}
        <div className="col-md-12 text-end d-flex justify-content-center gap-2">
          <Button variant="info" onClick={handlePreviewToggle}>
            {showPreviewModal ? "Hide Preview" : "Show Preview"}
          </Button>

          <Button variant="secondary" onClick={handlePreview}>
            {showPreview ? "Preview" : "Preview"}
          </Button>
          <Button type="submit" variant="success"  >Publish</Button>
        </div>

      </form>

      {showPreview && previewData && (
        <div className="mt-5 p-4 border rounded bg-light">
          <h4>🔍 Blog Preview</h4>

          <h2>{previewData.title}</h2>
          <p><strong>Category:</strong> {previewData.categoryTitle}</p>
          <p><strong>Subcategory:</strong> {previewData.subcategoryTitle}</p>
          <p><strong>Trending:</strong> {previewData.trending}</p>
          <p><strong>Tags:</strong> {previewData.tags.join(", ")}</p>
          <p><strong>Hashtags:</strong> {previewData.hashtags.map(tag => `#${tag}`).join(" ")}</p>
          <p><strong>Description:</strong></p>
          <MDEditor.Markdown source={previewData.description} style={{ background: "#fff", padding: "1rem" }} />

          {previewData.images.length > 0 && (
            <>
              <h5 className="mt-4">Images:</h5>
              <div className="d-flex flex-wrap gap-3">
                {previewData.images.map((img, i) => (
                  <div key={i}>
                    <img
                      src={img.url}
                      alt={`Preview-${i}`}
                      className={`rounded shadow ${img.isPrimary ? 'border border-3 border-primary' : ''}`}
                      style={{ height: 150 }}
                    />
                    {img.isPrimary && <div className="text-center mt-1"><small className="text-primary">Primary</small></div>}
                  </div>
                ))}
              </div>
            </>
          )}

          {previewData.audioUrl && (
            <div className="mt-3">
              <h5>Audio:</h5>
              <audio controls src={previewData.audioUrl}></audio>
            </div>
          )}
          {audioPreviewUrl && (
              <audio controls src={audioPreviewUrl} className="mt-2 w-100">
                Your browser does not support audio preview.
              </audio>
            )}

          {previewData.videoUrl && (
            <div className="mt-3">
              <h5>Video:</h5>
              <video controls src={previewData.videoUrl} style={{ maxWidth: "100%", height: "auto" }}></video>
            </div>
          )}
          {videoPreviewUrl && (
                <video
                  controls
                  src={videoPreviewUrl}
                  className="mt-2 w-100"
                  style={{ maxHeight: 200 }}
                >
                  Your browser does not support video preview.
                </video>
              )}

          <div className="mt-4">
            <h5>Full Content:</h5>
            <EditorJSRenderer data={previewData.content} />
          </div>
        </div>
      )}

      <Modal
        show={showPreviewModal}
        onHide={handlePreviewToggle}
        size="lg"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Post Preview</Modal.Title>
        </Modal.Header>
        <Modal.Body>
         {showPreview && previewData && (
            <div className="mt-5 p-4 border rounded bg-light">
              <h4>🔍 Blog Preview</h4>

              <h2>{previewData.title}</h2>
              <p><strong>Category:</strong> {previewData.categoryTitle}</p>
              <p><strong>Subcategory:</strong> {previewData.subcategoryTitle}</p>
              <p><strong>Trending:</strong> {previewData.trending}</p>
              <p><strong>Tags:</strong> {previewData.tags.join(", ")}</p>
              <p><strong>Hashtags:</strong> {previewData.hashtags.map(tag => `#${tag}`).join(" ")}</p>
              <p><strong>Description:</strong></p>
              <MDEditor.Markdown source={previewData.description} style={{ background: "#fff", padding: "1rem" }} />

              {previewData.images.length > 0 && (
                <>
                  <h5 className="mt-4">Images:</h5>
                  <div className="d-flex flex-wrap gap-3">
                    {previewData.images.map((img, i) => (
                      <div key={i}>
                        <img
                          src={img.url}
                          alt={`Preview-${i}`}
                          className={`rounded shadow ${img.isPrimary ? 'border border-3 border-primary' : ''}`}
                          style={{ height: 150 }}
                        />
                        {img.isPrimary && <div className="text-center mt-1"><small className="text-primary">Primary</small></div>}
                      </div>
                    ))}
                  </div>
                </>
              )}

              {previewData.audioUrl && (
                <div className="mt-3">
                  <h5>Audio:</h5>
                  <audio controls src={previewData.audioUrl}></audio>
                </div>
              )}
              {audioPreviewUrl && (
                  <audio controls src={audioPreviewUrl} className="mt-2 w-100">
                    Your browser does not support audio preview.
                  </audio>
                )}

              {previewData.videoUrl && (
                <div className="mt-3">
                  <h5>Video:</h5>
                  <video controls src={previewData.videoUrl} style={{ maxWidth: "100%", height: "auto" }}></video>
                </div>
              )}
              {videoPreviewUrl && (
                    <video
                      controls
                      src={videoPreviewUrl}
                      className="mt-2 w-100"
                      style={{ maxHeight: 200 }}
                    >
                      Your browser does not support video preview.
                    </video>
                  )}

              <div className="mt-4">
                <h5>Full Content:</h5>
                <EditorJSRenderer data={previewData.content} />
              </div>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handlePreviewToggle}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      {/*<ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />*/}
          

    </div>
   
  );
};

export default AddBlogPost;
