// src/pages/EditBlogPost.jsx
import React, { useState, useEffect, useContext, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { doc, getDoc, updateDoc, serverTimestamp, getDocs, collection } from "firebase/firestore";
import { db, storage } from "../../firebase";
import { toast } from "react-toastify";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import MDEditor, { commands } from '@uiw/react-md-editor';
import { TagsInput } from "react-tag-input-component";
import EditorJS from "./Editor";
import "./AddBlogPost.css";
import { EditorContext } from "../../apps/notesapp/notesappcomponents/EditorContext";
import { Badge, Button, Form, InputGroup } from "react-bootstrap";

const EditBlogPost = ({ user }) => {
  const [form, setForm] = useState({
    title: "",
  //  category: "",
    trending: "no",
    description: "",
  //  imgUrl: "",
    content: {},
    categoryType: "", 
    segment: "", 
    categoryOption: "",
    status: "published",
    scheduledDate: ""
  });
  const [file, setFile] = useState(null);
  const [progress, setProgress] = useState(null);
  const [editorData, setEditorData] = useState(null);
  const [preview, setPreview] = useState(false);
  const [loading, setLoading] = useState(true);
  const [previewMode, setPreviewMode] = useState(false);

  const [segments, setSegments] = useState([]);
  const [categoryTypes, setCategoryTypes] = useState([]);
  const [categoryOptions, setCategoryOptions] = useState([]);
  
  const [categoryId, setCategoryId] = useState('');
  const [categoryTitle, setCategoryTitle] = useState('');
  const [subcategoryId, setSubcategoryId] = useState('');
  const [subcategoryTitle, setSubcategoryTitle] = useState('');
  const [category, setCategory] = useState('');
  const [subcategory, setSubcategory] = useState('');
  const [categories, setCategories] = useState([]);

  const [audioUrl, setAudioUrl] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [audioFile, setAudioFile] = useState(null);
  const [videoFile, setVideoFile] = useState(null);

  const [files, setFiles] = useState([]);
  const [imgUrls, setImgUrls] = useState([]);
  const [uploadProgress, setUploadProgress] = useState({});

  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState("");
  const [hashtags, setHashtags] = useState([]);
  const [hashtagInput, setHashtagInput] = useState("");
  const [tagSuggestions, setTagSuggestions] = useState([]);
  const [hashtagSuggestions, setHashtagSuggestions] = useState([]);

  const [imgPreviews, setImgPreviews] = useState([]);

  const { id } = useParams();
  const navigate = useNavigate();

  const editorRef = useRef(null);
  const { initEditor, editorInstanceRef } = useContext(EditorContext);

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
          fetch("categories", setCategories),
        ]);
      };
      fetchAll();
    }, []);

    // Category filters
    const mainCategories = categories.filter(cat => !cat.parentId || cat.parentId === null);
    const subcategories = categories.filter(cat => cat.parentId === categoryId);

  // Initialize EditorJS
  useEffect(() => {
    if (!editorRef.current) {
      const interval = setInterval(() => {
        const editorElement = document.getElementById("editorjs");
        if (editorElement) {
          initEditor();
          editorRef.current = true;
          clearInterval(interval);
        }
      }, 100);
      return () => clearInterval(interval);
    }
  }, [initEditor]);


  useEffect(() => {
    const fetchBlog = async () => {
      const docRef = doc(db, "blogposts", id);
      const snapshot = await getDoc(docRef);
      if (snapshot.exists()) {
        const data = snapshot.data();
        setForm({ ...data });
        // setEditorData(data.content || {});
        setLoading(false);

        setTimeout(() => {
          if (editorInstanceRef?.current && data.content) {
            editorInstanceRef?.current.render(data.content);
          }
        }, 500); // Wait until EditorJS is ready
      } else {
        toast.error("Blog not found");
        setLoading(false);
      }
    };
    fetchBlog();
  }, [id,editorInstanceRef]);

  useEffect(() => {
    const getPost = async () => {
      const docSnap = await getDoc(doc(db, "blogposts", id));
      if (docSnap.exists()) {
        const data = docSnap.data();
       // setForm(data);
       // setEditorData(data.content || {});
       // setSelectedTags(data.tags || []);
        setAudioUrl(data.audioUrl || "");
        setVideoUrl(data.videoUrl || "");
      }
    };
    getPost();
  }, [id]);

  const handleTagAdd = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput("");
    }
  };

  const handleTagRemove = (tag) => setTags(tags.filter((t) => t !== tag));

  const handleHashtagAdd = () => {
    if (hashtagInput.trim() && !hashtags.includes(hashtagInput.trim())) {
      setHashtags([...hashtags, hashtagInput.trim()]);
      setHashtagInput("");
    }
  };

  const handleHashtagRemove = (tag) => setHashtags(hashtags.filter((t) => t !== tag));

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


  // Image upload
  useEffect(() => {
    if (!file) return;
    const upload = async () => {
      const storageRef = ref(storage, file.name);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        "state_changed",
        null,
        () => toast.error("Image upload failed"),
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((url) => {
            toast.success("Image uploaded");
            setForm((prev) => ({ ...prev, imgUrl: url }));
          });
        }
      );
    };
    upload();
  }, [file]);

  const handleMultipleFileUpload = async (selectedFiles) => {
    const previews = Array.from(selectedFiles).map((file) => ({
      name: file.name,
      url: null,
      isPrimary: false,
      progress: 0,
    }));

    setImgPreviews((prev) => [...prev, ...previews]);

    Array.from(selectedFiles).forEach((file, index) => {
      const fileRef = ref(storage, `blogImages/${Date.now()}_${file.name}`);
      const uploadTask = uploadBytesResumable(fileRef, file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const prog = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setImgPreviews((prev) =>
            prev.map((img) =>
              img.name === file.name ? { ...img, progress: prog } : img
            )
          );
        },
        (error) => toast.error(error.message),
        async () => {
          const url = await getDownloadURL(uploadTask.snapshot.ref);
          setImgPreviews((prev) =>
            prev.map((img) =>
              img.name === file.name ? { ...img, url, progress: 100 } : img
            )
          );
        }
      );
    });
  };
  
  
  const handleImageDelete = (index) => {
    setImgPreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleMove = (index, direction) => {
    const newOrder = [...imgPreviews];
    const swapIndex = direction === 'up' ? index - 1 : index + 1;
    [newOrder[index], newOrder[swapIndex]] = [newOrder[swapIndex], newOrder[index]];
    setImgPreviews(newOrder);
  };

  const handlePrimarySelect = (index) => {
    setImgPreviews(prev =>
      prev.map((img, i) => ({
        ...img,
        isPrimary: i === index,
      }))
    );
  };


  const uploadMedia = async (file, folder) => {
    const storageRef = ref(storage, `blogMedia/${folder}/${file.name}`);
    const uploadTask = await uploadBytesResumable(storageRef, file);
    const downloadURL = await getDownloadURL(uploadTask.ref);
    return downloadURL;
  };


  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const data = await editorInstanceRef.current?.save();
    if (!data || data.blocks.length === 0) {
      toast.warning("Editor content is empty");
      return;
    }
    if (!form.title || !form.category || !form.description) {
      return toast.error("Required fields missing");
    }
   // console.log(form);
   // console.log(data);
    try {

      const primaryImg = imgPreviews.find(img => img.isPrimary)?.url || imgPreviews[0]?.url || '';
      let updatedAudioUrl = audioUrl;
      let updatedVideoUrl = videoUrl;

      if (audioFile) updatedAudioUrl = await uploadMedia(audioFile, "audio");
      if (videoFile) updatedVideoUrl = await uploadMedia(videoFile, "video");

      await updateDoc(doc(db, "blogposts", id), {
        ...form,
        tags,
        // hashtags: selected,
        hashtags,
        content: data,
        updatedAt: serverTimestamp(),
        author: user.displayName,
        userId: user.uid,
        audioUrl: updatedAudioUrl,
        videoUrl: updatedVideoUrl,
        imgUrls, // Store multiple image URLs
        images: imgPreviews.map(img => img.url),
        primaryImg,
      });
      toast.success("Blog updated successfully");
      navigate("/blog-posts");
    } catch (err) {
      toast.error("Error updating blog");
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="container mt-4">
      <h3>{previewMode ? "Preview Blog Post" : "Edit Blog Post"}</h3>


      <div className="d-flex justify-content-between mb-3">
       
        <Link to={`/add-note/blog-post/${id}`} className="btn btn-outline-info btn-sm"  >
            Add Notes
        </Link>
        <button className="btn btn-outline-danger" onClick={() => setPreviewMode(!previewMode)}>
          {previewMode ? "Back to Edit" : "Preview Post"}
        </button>
        
        <Link to={`/view-notes/blog-post/${id}`} className="btn btn-outline-info btn-sm"  >
            View Notes
        </Link>
      </div>
    <div className="blog-post-container">
      <h2>Edit Blog Post</h2>

      {previewMode ? (
        <div className="p-4 border bg-light rounded">
          <h2>{form.title}</h2>
          <p><strong>Category:</strong> {form.category}</p>
          <p><strong>Tags:</strong> {selectedTags.join(", ")}</p>
          <p><strong>Description:</strong></p>
          <MDEditor.Markdown source={form.description} style={{ background: "#fff", padding: "1rem" }} />

          {form.imgUrl && (
            <div className="text-center my-3">
              <img src={form.imgUrl} alt="Preview" height={200} className="rounded shadow" />
            </div>
          )}

          {audioUrl && (
            <div className="my-3">
              <h6>🎧 Audio Preview</h6>
              <audio controls style={{ width: "100%" }}>
                <source src={audioUrl} />
              </audio>
            </div>
          )}

          {videoUrl && (
            <div className="my-3">
              <h6>🎥 Video Preview</h6>
              <video controls style={{ width: "100%" }} height={250}>
                <source src={videoUrl} />
              </video>
            </div>
          )}

          {editorData && (
            <div className="mt-4">
              <h5>Full Content:</h5>
              <EditorJSRenderer data={editorData} />
            </div>
          )}

          <button className="btn btn-success mt-3" onClick={handleUpdate}>
            Update Blog Post
          </button>
        </div>
      ) : (
        // editing form ...
      

      <form className="row g-3"  onSubmit={handleUpdate}>
        <div className="col-md-12">
          <input
            type="text"
            className="form-control"
            placeholder="Title"
            name="title"
            value={form.title}
            onChange={handleChange}
          />
        </div>

        <div className="col-md-6">
          <select name="categoryType" value={form.categoryType} onChange={handleChange} className="form-control">
            <option value="">Select Category Type</option>
            {categoryTypes.map((ct,i) => <option key={i} value={ct}>{ct}</option>)}
          </select>
        </div>

        <div className="col-md-6">
          <select name="segment" value={form.segment} onChange={handleChange} className="form-control">
            <option value="">Select Segment</option>
            {segments.map((s,i) => <option key={i} value={s}>{s}</option>)}
          </select>
        </div>

        <div className="col-md-12">
        <TagsInput
          value={form.tags}
          onChange={(tags) => setForm((prev) => ({ ...prev, tags }))}
          name="tags"
          placeHolder="Enter tags"
        />
        </div>

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

              </InputGroup>
              <Form.Text className="text-muted">Press enter or click "Add" to add tag</Form.Text>
          </Form.Group>

          <div className="d-flex flex-wrap gap-2 mt-2">
              {form.tags.map((tag) => (
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

              <div className="mt-2">
              {form.hashtags.map(tag => (
                  <Badge key={tag} bg="secondary" className="me-2" style={{ cursor: 'pointer' }} onClick={() => handleHashtagRemove(tag)}>
                  #{tag} &times;
                  </Badge>
              ))}
              </div>
          </Form.Group>
        </div>

        <div className="col-md-6">
          <select name="categoryOption" value={form.categoryOption} onChange={handleChange} className="form-control">
            <option value="">Select Category Option</option>
            {categoryOptions.map((opt,i) => <option key={i} value={opt}>{opt}</option>)}
          </select>
        </div>
        <div className="col-md-6">
          <select name="category" value={form.category} onChange={handleChange} className="form-control">
            <option value="">Select Category</option>
            {mainCategories.map((cat,i) => <option key={i} value={cat}>{cat}</option>)}
          </select>
        </div>

        <div className="mt-3">
          <label>Status:</label>
          <select
            value={form.status}
            className="form-control"
            onChange={(e) => setForm({ ...form, status: e.target.value })}
          >
            <option value="published">Published</option>
            <option value="draft">Draft</option>
            <option value="scheduled">Scheduled</option>
          </select>
        </div>

         {form.status === "scheduled" && (
            <input
              type="datetime-local"
              name="scheduledDate"
              className="form-control mt-2"
              value={form.scheduledDate}
              onChange={handleChange}
            />
          )}

        <div className="col-md-12">
            <label><strong>Description (MDEditor - Bangla Supported)</strong></label>
            <MDEditor
                value={form.description}
                onChange={(val) => setForm((prev) => ({ ...prev, description: val }))}
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

        <div className="editor-container mt-3">
          <label><strong>Content:</strong></label>
          <div id="editorjs" className="border p-3 rounded" />
        </div>

        {/*<input
          type="file"
          className="form-control mt-3"
          onChange={(e) => setFile(e.target.files[0])}
        />*/}
        <input
          type="file"
          className="form-control"
          multiple
          accept="image/*"
          onChange={(e) => handleMultipleFileUpload(e.target.files)}
        />


        {form.imgUrl && (
          <img src={form.imgUrl} alt="preview" className="img-fluid mt-3" />
        )}

        {imgUrls.length > 0 && (
          <div className="row mt-3">
            {imgUrls.map((url, idx) => (
              <div className="col-md-3 mb-2" key={idx}>
                <img src={url} alt={`Uploaded ${idx}`} className="img-fluid rounded shadow-sm" />
                {uploadProgress[url] && (
                  <div className="progress mt-1">
                    <div className="progress-bar" style={{ width: `${uploadProgress[url]}%` }}>
                      {Math.round(uploadProgress[url])}%
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}


        <div className="col-md-6">
            <label>Replace Audio</label><br/>
            <input
              type="file"
              accept="audio/*"
              onChange={(e) => setAudioFile(e.target.files[0])}
          />
            {audioUrl && (
              <audio controls style={{ width: "100%", marginTop: "8px" }}>
                <source src={audioUrl} />
              </audio>
            )}
        </div>

        <div className="col-md-6 " style={{marginLeft:'0%', marginRight:'0%'}} >
            <label>Replace Video</label><br/>
            <input
              type="file"
              accept="video/*"
              onChange={(e) => setVideoFile(e.target.files[0])}
          />
            {videoUrl && (
              <video controls style={{ width: "100%", marginTop: "8px" }} height={200}>
                <source src={videoUrl} />
              </video>
            )}
        </div>

        <button className="btn btn-primary mt-3" type="submit">
          Update Blog
        </button>
      </form>

      )}      

      
    </div>
    </div>
  );
};

export default EditBlogPost;
