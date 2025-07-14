import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  addDoc,
  collection,
  getDocs,
  query,
  serverTimestamp,
} from "firebase/firestore";
import {
  getDownloadURL,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { db, storage } from "../../firebase";
import DraftEditor from "./DraftEditor";
import { Badge } from "react-bootstrap";



const initialState = {
  title: "",
  trending: "no",
  description: null,
   imgUrl: "",
  comments: [],
  likes: []
};

const AddBlog = ({ user }) => {

  const [form, setForm] = useState(initialState);
  const [file, setFile] = useState(null);
  const [progress, setProgress] = useState(null);

  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState('');
  const [tagSuggestions, setTagSuggestions] = useState([]);

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
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [selectedCategoryOption, setSelectedCategoryOption] = useState('');

  const [imgPreviewUrl, setImgPreviewUrl] = useState("");
  const [showPreview, setShowPreview] = useState(false);

  const navigate = useNavigate();
  const { title, segment, trending, categoryType, description } = form;

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

  // Tag handling
  const handleTagAdd = () => {
    const trimmed = tagInput.trim();
    if (trimmed && !tags.includes(trimmed)) {
      setTags([...tags, trimmed]);
      toast.success(`Tag added: ${trimmed}`);
      setTagInput("");
    }
  };

  const handleTagRemove = (tagToRemove) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  useEffect(() => {
    const fetchTagsFromPosts = async () => {
      const snap = await getDocs(collection(db, 'blogs'));
      const allTags = snap.docs.flatMap(doc => doc.data().tags || []);
      const uniqueTags = [...new Set(allTags)];
      setTagSuggestions(uniqueTags);
    };
    fetchTagsFromPosts();
  }, []);


  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !tags.length || !category || !description) {
      return toast.error("All fields are required");
    }

    let uploadedImgUrl = "";

    if (file) {
      const storageRef = ref(storage, `blogImages/${Date.now()}_${file.name}`);
      const uploadTask = uploadBytesResumable(storageRef, file);

      toast.info("Uploading image...");

      await new Promise((resolve, reject) => {
        uploadTask.on(
          "state_changed",
          (snapshot) => {
            const percent = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            setProgress(percent);
          },
          (err) => {
            toast.error("Image upload failed");
            reject(err);
          },
          async () => {
            uploadedImgUrl = await getDownloadURL(uploadTask.snapshot.ref);
            toast.success("Image uploaded successfully");
            resolve();
          }
        );
      });
    }


    try {

      const catTitle = categories.find(c => c.id === category)?.name || '';
      const subcatTitle = categories.find(s => s.id === subcategory)?.name || '';

      await addDoc(collection(db, "blogs"), {
        ...form,
        tags,
        categoryId: category,
        categoryTitle: catTitle,
        subcategoryId: subcategory,
        subcategoryTitle: subcatTitle,
        categoryType: selectedCategoryType,
        segment: selectedsegment,
        imgUrl: uploadedImgUrl, // ⬅️ overwrite previous url
        timestamp: serverTimestamp(),
        author: user.displayName,
        userId: user.uid,
      });
      console.log("Blog created");
      toast.success("Blog created");
      navigate("/all-blogs");
    } catch (err) {
      console.error(err);
      toast.error("Failed to save blog");
    }
  };

  

  return (
    <div className="container mt-5">
      <h2>Create Blog</h2>
      <form onSubmit={handleSubmit}>
        {/* Title */}
        <input
          className="form-control my-3"
          type="text"
          value={title}
          placeholder="Blog Title"
          onChange={(e) => setForm({ ...form, title: e.target.value })}
        />

        {/* Category Type */}
        <select
          className="form-control my-3"
          value={selectedCategoryType}
          onChange={(e) => setSelectedCategoryType(e.target.value)}
        >
          <option value="">Select Category Type</option>
          {categoryTypes.map((type, i) => (
            <option key={i} value={type}>
              {type}
            </option>
          ))}
        </select>

        {/* Segment */}
        <select
          className="form-control my-3"
          value={selectedsegment} 
          onChange={(e) => setSelectedSegment(e.target.value)} 
        >
          <option value="">Select Segment</option>
          {segments.map((seg, i) => (
            <option key={i} value={seg}>
              {seg}
            </option>
          ))}
        </select>

        {/* Tags */}
        <label>Tags</label>
        <input
          type="text"
          className="form-control my-2"
          placeholder="Add tag"
          value={tagInput}
          onChange={(e) => setTagInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === ",") {
              e.preventDefault();
              handleTagAdd();
            }
          }}
        />
        <button
          type="button"
          className="btn btn-primary mb-2"
          onClick={handleTagAdd}
        >
          Add
        </button>

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

        <div className="d-flex flex-wrap gap-2">
          {tags.map((tag) => (
            <Badge key={tag} bg="secondary" className="d-flex align-items-center">
              {tag}
              <button
                type="button"
                onClick={() => handleTagRemove(tag)}
                className="btn btn-sm text-white ms-2 p-0"
                style={{ textDecoration: "none" }}
              >
                ×
              </button>
            </Badge>
          ))}
        </div>

        { // Category Select 
        <div className="row my-3">
          <div className="col-md-6">
            <label>Main Category</label>
            <select
              className="form-control"
              value={category}
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
              value={subcategory}
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
        </div> }

        {/* Trending */}
        <div className="my-3">
          <strong>Trending:</strong>
          <div>
            <label className="me-3">
              <input
                type="radio"
                value="yes"
                name="trending"
                checked={trending === "yes"}
                onChange={(e) => setForm({ ...form, trending: e.target.value })}
              />{" "}
              Yes
            </label>
            <label>
              <input
                type="radio"
                value="no"
                name="trending"
                checked={trending === "no"}
                onChange={(e) => setForm({ ...form, trending: e.target.value })}
              />{" "}
              No
            </label>
          </div>
        </div>

        {/* Description Editor */}
        <label><strong>Description</strong></label>
        <DraftEditor
          initialRawContent={description}
          onChange={(value) => setForm({ ...form, description: value })}
        />

        {/* Image Upload 
        {imgUrl && (
          <div className="text-center my-3">
            <img src={imgUrl} alt="Preview" height={200} className="rounded shadow" />
          </div>
        )}
          */}
        {imgPreviewUrl && <img src={imgPreviewUrl} alt="Preview" className="img-fluid mb-3" />}
        <input
          type="file"
          className="form-control my-3"
          // onChange={(e) => setFile(e.target.files[0])}
          onChange={(e) => {
            const selected = e.target.files[0];
            setFile(selected);
            setImgPreviewUrl(URL.createObjectURL(selected));
          }}
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

        {/* Submit */}
        {/* Preview Toggle Button */}
        <button
          type="button"
          className="btn btn-outline-secondary me-2"
          onClick={() => setShowPreview(!showPreview)}
        >
          {showPreview ? "Hide Blog" : "Preview Blog"}
        </button>
        <button
          className="btn btn-primary"
          type="submit"
          disabled={progress !== null && progress < 100}
        >
          Publish Blog
        </button>

      </form>

      {/* Preview Modal */}
      {showPreview && (
        <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}>
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Blog Preview</h5>
                <button type="button" className="btn-close" onClick={() => setShowPreview(false)}></button>
              </div>
              <div className="modal-body">
                <h3>{form.title}</h3>
                <p><strong>Tags:</strong> {tags.join(", ")}</p>
                {imgPreviewUrl && <img src={imgPreviewUrl} alt="Preview" className="img-fluid mb-3" />}
                <div><strong>Description:</strong></div>
                <div dangerouslySetInnerHTML={{ __html: form.description }} />
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default AddBlog;
