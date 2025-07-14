import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  doc,
  getDoc,
  updateDoc,
  collection,
  getDocs,
  query,
  where,
  serverTimestamp,
} from "firebase/firestore";
import {
  getDownloadURL,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { db, storage } from "../../firebase";
import { toast } from "react-toastify";
import DraftEditor from "./DraftEditor";
import { Badge } from "react-bootstrap";

import { Editor } from "react-draft-wysiwyg";
import {
  EditorState,
  convertToRaw,
  convertFromRaw,
  ContentState
} from "draft-js";
import draftToHtml from "draftjs-to-html";
import htmlToDraft from "html-to-draftjs";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

const EditBlog = ({ user }) => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    // category: '',
    trending: "no",
    description: null,
    imgUrl: "",
    comments: [],
    likes: []
  });

  const [categoryId, setCategoryId] = useState('');
  const [categoryTitle, setCategoryTitle] = useState('');
  const [subcategoryId, setSubcategoryId] = useState('');
  const [subcategoryTitle, setSubcategoryTitle] = useState('');
  const [category, setCategory] = useState('');
  const [subcategory, setSubcategory] = useState('');
  const [categories, setCategories] = useState([]);
  
  const [segments, setSegments] = useState([]);
  const [selectedsegment, setSelectedSegment] = useState('');
  const [categoryTypes, setCategoryTypes] = useState([]);
  const [selectedCategoryType, setSelectedCategoryType] = useState('')

  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState("");
  const [file, setFile] = useState(null);
  const [progress, setProgress] = useState(null);

  const [editorState, setEditorState] = useState(() =>
    EditorState.createEmpty()
  );

  const handleEditorChange = (state) => {
    setEditorState(state);
    const rawContent = convertToRaw(state.getCurrentContent());
    setForm((prev) => ({
      ...prev,
      description: JSON.stringify(rawContent) // or save as HTML if you prefer
    }));
  };

  // Fetch dropdown options
 // Fetch dropdown data
   useEffect(() => {
     const fetchData = async () => {
       const segSnap = await getDocs(collection(db, "segments"));
       setSegments(segSnap.docs.map(doc => doc.data().title));
 
       const typeSnap = await getDocs(collection(db, "category-types"));
       setCategoryTypes(typeSnap.docs.map(doc => doc.data().title));
 
       const catSnap = await getDocs(collection(db, "categories"));
       const catList = catSnap.docs.map(doc => ({
         id: doc.id,
         ...doc.data()
       }));
       setCategories(catList);
     };
     fetchData();
   }, []);
 
   // Filter main categories and subcategories
   const mainCategories = categories.filter(cat => !cat.parentId);
   const subcategories = categories.filter(cat => cat.parentId === category);

  // Fetch blog to edit
  useEffect(() => {
    const getBlog = async () => {
      const docRef = doc(db, "blogs", id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setForm({
          title: data.title || "",
          segment: data.segment || "",
          trending: data.trending || "no",
          categoryType: data.categoryType || "",
          categoryId: data.categoryId || "",
          subcategoryId: data.subcategoryId || "",
          description: data.description || null,
          imgUrl: data.imgUrl || "",
        });
        setTags(data.tags || []);

        if (data.description) {
          try {
            const raw = JSON.parse(data.description);
            const contentState = convertFromRaw(raw);
            setEditorState(EditorState.createWithContent(contentState));
          } catch (err) {
            const blocksFromHtml = htmlToDraft(data.description);
            const contentState = ContentState.createFromBlockArray(
              blocksFromHtml.contentBlocks,
              blocksFromHtml.entityMap
            );
            setEditorState(EditorState.createWithContent(contentState));
          }
        }

      } else {
        toast.error("Blog not found");
        navigate("/all-blogs");
      }
    };

    getBlog();
  }, [id, navigate]);

  // console.log(form);
  // console.log(tags);

  // Upload updated image
  useEffect(() => {
    if (file) {
      const storageRef = ref(storage, file.name);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        (snap) => {
          const prog = (snap.bytesTransferred / snap.totalBytes) * 100;
          setProgress(prog);
        },
        (error) => console.error(error),
        () =>
          getDownloadURL(uploadTask.snapshot.ref).then((url) => {
            toast.success("Image uploaded");
            setForm((prev) => ({ ...prev, imgUrl: url }));
          })
      );
    }
  }, [file]);

  const handleUpdate = async (e) => {
    e.preventDefault();

    try {

      const catTitle = categories.find(c => c.id === category)?.name || '';
      const subcatTitle = categories.find(s => s.id === subcategory)?.name || '';

      
      await updateDoc(doc(db, "blogs", id), {
        ...form,
        tags,
        categoryId: category,
        categoryTitle: catTitle,
        subcategoryId: subcategory,
        subcategoryTitle: subcatTitle,
        categoryType: selectedCategoryType,
        segment: selectedsegment,
        // updatedAt: new Date()
        updatedAt: serverTimestamp()
      });
      toast.success("Blog updated");
      navigate("/all-blogs");
    } catch (err) {
      console.error(err);
      toast.error("Update failed");
    }
  };

  const handleTagAdd = () => {
    const trimmed = tagInput.trim();
    if (trimmed && !tags.includes(trimmed)) {
      setTags([...tags, trimmed]);
      setTagInput("");
    }
  };

  const handleTagRemove = (tag) => {
    setTags(tags.filter((t) => t !== tag));
  };

  return (
    <div className="container mt-5">
      <h2>Edit Blog</h2>
      <form onSubmit={handleUpdate}>
        <input
          className="form-control my-3"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          placeholder="Blog Title"
        />

        <select
          className="form-control my-3"
          value={form.categoryType}
          onChange={(e) => setForm({ ...form, categoryType: e.target.value })}
        >
          <option value="">Select Category Type</option>
          {categoryTypes.map((ct, i) => (
            <option key={i} value={ct}>{ct}</option>
          ))}
        </select>

        <select
          className="form-control my-3"
          value={form.segment}
          onChange={(e) => setForm({ ...form, segment: e.target.value })}
        >
          <option value="">Select Segment</option>
          {segments.map((s, i) => (
            <option key={i} value={s}>{s}</option>
          ))}
        </select>

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
          {tags.map((tag) => (
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


        <div className="row my-3">
          <div className="col-md-6">
            <label>Main Category</label>
            <select
              className="form-control"
              value={categoryId}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="">Select Category</option>
              {mainCategories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {typeof cat.name === "string"
                    ? cat.name
                    : JSON.stringify(cat.name)}
                </option>

              ))}
            </select>
          </div>

          <div className="col-md-6">
            <label>Subcategory</label>
            <select
              className="form-control"
              value={form.subcategoryId}
              onChange={(e) => setSubcategory(e.target.value)}
               disabled={!category}
            >
              <option value="">Select Subcategory</option>
              {subcategories.map((sub) => (
                <option key={sub.id} value={sub.id}>
                  {typeof sub.name === "string"
                    ? sub.name
                    : JSON.stringify(sub.name)}
                </option>

              ))}
            </select>
          </div>
        </div>

        <div className="my-3">
          <strong>Trending:</strong>
          <div>
            <label className="me-3">
              <input
                type="radio"
                value="yes"
                checked={form.trending === "yes"}
                onChange={(e) => setForm({ ...form, trending: e.target.value })}
              /> Yes
            </label>
            <label>
              <input
                type="radio"
                value="no"
                checked={form.trending === "no"}
                onChange={(e) => setForm({ ...form, trending: e.target.value })}
              /> No
            </label>
          </div>
        </div>

        {/*<label><strong>Description</strong></label>
        <DraftEditor
          initialRawContent={form.description}
          onChange={(value) => setForm({ ...form, description: value })}
        />*/}
        <br/>

        <div className="mb-3">
          <label>Description</label>
          <Editor
            editorState={editorState}
            onEditorStateChange={handleEditorChange}
            wrapperClassName="editor-wrapper"
            editorClassName="editor"
            toolbarClassName="toolbar"
          />
        </div>

        {form.imgUrl && (
          <div className="text-center my-3">
            <img src={form.imgUrl} alt="Preview" height="200" className="rounded shadow" />
          </div>
        )}

        <input
          type="file"
          className="form-control my-3"
          onChange={(e) => setFile(e.target.files[0])}
        />

        {progress !== null && (
          <div className="progress mb-3">
            <div
              className="progress-bar"
              role="progressbar"
              style={{ width: `${progress}%` }}
            >
              {Math.round(progress)}%
            </div>
          </div>
        )}

        <button
          className="btn btn-success"
          type="submit"
          disabled={progress !== null && progress < 100}
        >
          Update Blog
        </button>
      </form>
    </div>
  );
};

export default EditBlog;


