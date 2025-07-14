// src/components/BannerEditor.jsx
import React, { useEffect, useRef, useState } from "react";
import { Stage, Layer, Text, Rect, Group, Image as KonvaImage, Transformer } from "react-konva";
import useImage from "../../hooks/useImage"; // your custom hook for loading images
import { db, storage, auth } from "../../firebase"; // your firebase setup
import { collection, addDoc, getDocs, query, where } from "firebase/firestore";
import { ref, uploadString, getDownloadURL } from "firebase/storage";
import { ChromePicker } from "react-color";
import { Modal, Button } from "react-bootstrap";

// Safe sticker/emoji CDN links (jsDelivr fallback for Twemoji)
const stickers = [
  "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f389.png",
  "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f600.png",
  "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f680.png",
];
const fonts = ["Arial", "Georgia", "Times New Roman", "Courier New", "Verdana"];

const Sticker = ({ id, src, x, y, width = 50, height = 50, setSelectedId }) => {
  const [image] = useImage(src);
  return (
    <KonvaImage
      id={id}
      image={image}
      x={x}
      y={y}
      width={width}
      height={height}
      draggable
      onClick={() => setSelectedId(id)}
    />
  );
};

const CanvasImage = ({ src }) => {
  const [image] = useImage(src);
  return image ? <KonvaImage image={image} width={800} height={400} /> : null;
};

const btn = {
  marginLeft: "10px",
  padding: "8px 16px",
  fontSize: "14px",
  backgroundColor: "#2a9d8f",
  color: "#fff",
  border: "none",
  borderRadius: "4px",
  cursor: "pointer",
};

const BannerEditor = () => {
  const stageRef = useRef();
  const transformerRef = useRef();

  const [bgImage, setBgImage] = useState(null);
  const [texts, setTexts] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [selectedType, setSelectedType] = useState(null);
  const [images, setImages] = useState([]);
  const [newText, setNewText] = useState("New Text");
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState("");
  const [editTarget, setEditTarget] = useState(null);
  const [textProps, setTextProps] = useState({
    text: "New Text",
    fontSize: 28,
    fontFamily: "Arial",
    fill: "#ffffff",
    align: "left",
    background: "#000000",
    shadowColor: "#000000",
    shadowBlur: 2,
    shadowOffsetX: 1,
    shadowOffsetY: 1,
    stroke: "#000000",
    strokeWidth: 0
  });
  
  useEffect(() => {
    if (transformerRef.current) {
      const selected = [...texts, ...images].find((item) => item.id === selectedId);
      if (selected) {
        const stage = stageRef.current;
        const node = stage.findOne(`#${selectedId}`);
        if (node) {
          transformerRef.current.nodes([node]);
          transformerRef.current.getLayer().batchDraw();
        }
      }
    }
  }, [selectedId, texts, images]);

  // Add new text box to canvas
  const handleAddText = () => {
    const newId = `text-${Date.now()}`;
    setTexts([
      ...texts,
      {
        id: newId,
        text: newText || "New Text",
        x: 50,
        y: 50,
        fontSize: textProps.fontSize,
        fill: textProps.fill,
        fontFamily: textProps.fontFamily,
        align: textProps.align,
        padding: 6,
        draggable: true,
        background: "rgba(0,0,0,0.5)",
        ...textProps 
      },
    ]);
    setSelectedId(newId);
    setSelectedType("text");
    setNewText("");
  };

  const addText = () => {
    const newId = `text-${Date.now()}`;
    setTexts([...texts, { id: newId, x: 50, y: 50, draggable: true, ...textProps }]);
    setSelectedId(newId);
    setSelectedType("text");
  };

  // Update selected text properties
  const updateTextProp = (prop, value) => {
    setTextProps({ ...textProps, [prop]: value });
    setTexts(
      texts.map((t) => (t.id === selectedId ? { ...t, [prop]: value } : t))
    );
  };

  // Drag move handler for text
  const handleDrag = (id, x, y) => {
    setTexts(texts.map((t) => (t.id === id ? { ...t, x, y } : t)));
    setImages(images.map((img) => (img.id === id ? { ...img, x, y } : img)));
  };

  const handleDblClick = (t) => {
    setEditText(t.text);
    setEditTarget(t.id);
    setIsEditing(true);
  };

  const applyEdit = () => {
    setTexts(texts.map((t) => (t.id === editTarget ? { ...t, text: editText } : t)));
    setIsEditing(false);
    setEditTarget(null);
    setEditText("");
  };

  const handleSticker = (src) => {
    const newId = `img-${Date.now()}`;
    setImages([...images, { id: newId, src, x: 100, y: 100, width: 50, height: 50, draggable: true }]);
    setSelectedId(newId);
    setSelectedType("image");
  };

  const saveAsImage = () => {
    const uri = stageRef.current.toDataURL({ pixelRatio: 2 });
    const link = document.createElement("a");
    link.download = "banner.png";
    link.href = uri;
    link.click();
  };

  const saveTemplate = async () => {
    await addDoc(collection(db, "bannerTemplates"), { texts, images });
    alert("Template saved to Firestore!");
  };

  const loadTemplates = async () => {
    const snap = await getDocs(collection(db, "bannerTemplates"));
    if (!snap.empty) {
      const data = snap.docs[0].data();
      setTexts(data.texts || []);
      setImages(data.images || []);
    }
  };


  // Transform handler for resize/scale text
  const handleTransform = (node, id) => {
    setTexts((prev) =>
      prev.map((t) =>
        t.id === id
          ? {
              ...t,
              x: node.x(),
              y: node.y(),
              fontSize: t.fontSize * node.scaleY(),
            }
          : t
      )
    );
    node.scaleX(1);
    node.scaleY(1);
  };

  // Upload canvas image to Firebase Storage
  const handleUpload = async () => {
    const dataUrl = stageRef.current.toDataURL({ pixelRatio: 2 });
    const imageRef = ref(storage, `banners/banner_${Date.now()}.png`);
    await uploadString(imageRef, dataUrl, "data_url");
    const url = await getDownloadURL(imageRef);
    alert("✅ Uploaded to Firebase\n" + url);
  };

  // Add sticker image to canvas
 {/* const handleSticker = (url) => {
    setImages((prev) => [...prev, { id: `img-${Date.now()}`, src: url, x: 100, y: 100, draggable: true }]);
  }; */}

  // Load a sample template with text and emoji
  const handleTemplate = () => {
    setTexts([
      {
        id: "title",
        text: "🚀 Launch Your Product",
        x: 40,
        y: 300,
        fontSize: 32,
        fill: "white",
        background: "rgba(0,0,0,0.5)",
        padding: 8,
        draggable: true,
        fontFamily: "Arial",
        align: "left",
      },
    ]);
    setImages([
      {
        id: "emoji-rocket",
        src: "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f680.png",
        x: 250,
        y: 100,
        draggable: true,
      },
    ]);
  };

  // Background image upload handler
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setBgImage(reader.result);
    reader.readAsDataURL(file);
  };

  return (
    <div style={{ padding: "2rem", maxWidth: 900, margin: "auto" }}>
      <h2>🎨 Banner Editor (Drag, Text, Emoji, Upload)</h2>

      <div style={{ marginBottom: "1rem" }}>
        <input
          type="text"
          placeholder="Enter text"
          value={newText}
          onChange={(e) => setNewText(e.target.value)}
          style={{ padding: "8px", width: "250px", marginRight: 10 }}
        />
        <button onClick={handleAddText} style={btn}>
          Add Text
        </button>
        <input type="file" onChange={handleImageUpload} accept="image/*" style={{ marginLeft: 20 }} />
      </div>

      <div style={{ display: "flex", gap: 10, marginBottom: 20, alignItems: "center" }}>
        <select
          value={textProps.fontFamily}
          onChange={(e) => updateTextProp("fontFamily", e.target.value)}
        >
          {fonts.map((font) => (
            <option key={font} value={font}>
              {font}
            </option>
          ))}
        </select>

        <input
          type="number"
          value={textProps.fontSize}
          onChange={(e) => updateTextProp("fontSize", parseInt(e.target.value))}
          style={{ width: 60 }}
          min={8}
          max={150}
        />

        <select value={textProps.align} onChange={(e) => updateTextProp("align", e.target.value)}>
          <option value="left">Left</option>
          <option value="center">Center</option>
          <option value="right">Right</option>
        </select>
        
        <div>
          <label>Text Color</label>
          <ChromePicker
            color={textProps.fill}
            onChangeComplete={(color) => updateTextProp("fill", color.hex)}
            disableAlpha={true}
          />
        </div>

        <div>
          <label>Background</label>
          <ChromePicker
            color={textProps.background}
            onChangeComplete={(color) => updateTextProp("background", color.hex)}
          />
        </div>

      </div>
      
      <div style={{ display: "flex", gap: 10, marginBottom: 10, flexWrap: "wrap" }}>
        <input
          type="text"
          placeholder="Text"
          value={textProps.text}
          onChange={(e) => updateTextProp("text", e.target.value)}
        />

        <select
          value={textProps.fontFamily}
          onChange={(e) => updateTextProp("fontFamily", e.target.value)}
        >
          {fonts.map((font) => (
            <option key={font}>{font}</option>
          ))}
        </select>

        <input
          type="number"
          value={textProps.fontSize}
          onChange={(e) => updateTextProp("fontSize", parseInt(e.target.value))}
        />

        <input
          type="color"
          value={textProps.fill}
          onChange={(e) => updateTextProp("fill", e.target.value)}
        />

        <input
          type="color"
          value={textProps.background}
          onChange={(e) => updateTextProp("background", e.target.value)}
        />

        <input
          type="color"
          value={textProps.stroke}
          onChange={(e) => updateTextProp("stroke", e.target.value)}
        />

        <input
          type="number"
          value={textProps.strokeWidth}
          onChange={(e) => updateTextProp("strokeWidth", parseInt(e.target.value))}
        />

        <button onClick={addText}>Add Text</button>
        {stickers.map((s, i) => (
          <img
            key={i}
            src={s}
            onClick={() => handleSticker(s)}
            style={{ cursor: "pointer", width: 32 }}
            alt="sticker"
          />
        ))}
        <button onClick={saveAsImage}>📷 Export PNG</button>
        <button onClick={saveTemplate}>💾 Save Template</button>
        <button onClick={loadTemplates}>📂 Load Template</button>
      </div>

      <div style={{ marginBottom: "1rem" }}>
        {stickers.map((url, i) => (
          <img
            key={i}
            src={url}
            alt="sticker"
            onClick={() => handleSticker(url)}
            style={{ width: 32, margin: "0 5px", cursor: "pointer" }}
          />
        ))}
        <button onClick={handleTemplate} style={btn}>
          🎯 Load Template
        </button>
      </div>



      <Stage width={800} height={400} ref={stageRef} style={{ border: "1px solid #ccc" }}>
        <Layer>
          {bgImage && <CanvasImage src={bgImage} />}
          {texts.map((t) => (
            <Group
              key={t.id}
              x={t.x}
              y={t.y}
              draggable
              onDragEnd={(e) => handleDrag(t.id, e.target.x(), e.target.y())}
              onClick={() => setSelectedId(t.id)}
              onDblClick={() => handleDblClick(t)}
              ref={(node) => {
                if (node && selectedId === t.id) {
                  transformerRef.current?.nodes([node]);
                  transformerRef.current?.getLayer()?.batchDraw();
                }
              }}
            >
              <Rect
                width={t.text.length * t.fontSize * 0.6}
                height={t.fontSize + 10}
                fill={t.background || "transparent"}
              />
              <Text
                {...t}
                x={5}
                y={5}
              />
            </Group>

          ))}
          {images.map((img) => (
            <Sticker key={img.id} src={img.src} x={img.x} y={img.y} />
          ))}
          <Transformer
            ref={transformerRef}
            rotateEnabled={false}
            enabledAnchors={["top-left", "top-right", "bottom-left", "bottom-right"]}
          />
        </Layer>
      </Stage>

      {isEditing && (
        <div style={{ marginTop: 20 }}>
          <h4>Edit Text</h4>
          <input
            type="text"
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            style={{ padding: "6px", width: "300px" }}
          />
          <button onClick={applyEdit} style={{ marginLeft: "10px" }}>Apply</button>
        </div>
      )}

      <div style={{ marginTop: "1rem" }}>
        <button
          onClick={() => {
            const link = document.createElement("a");
            link.download = "banner.png";
            link.href = stageRef.current.toDataURL();
            link.click();
          }}
          style={btn}
        >
          ⬇️ Download PNG
        </button>

        <button onClick={handleUpload} style={{ ...btn, backgroundColor: "#0077b6" }}>
          ☁️ Upload to Firebase
        </button>
      </div>
    </div>
  );
};




export default BannerEditor;


/*
// src/components/BannerEditor.jsx
import React, { useEffect, useRef, useState } from "react";
import { Stage, Layer, Text, Rect, Group, Image as KonvaImage, Transformer } from "react-konva";
import useImage from "../../hooks/useImage"; // your custom hook for loading images
import { db, storage, auth } from "../../firebase"; // your firebase setup
import { collection, addDoc, getDocs, query, where } from "firebase/firestore";
import { ref, uploadString, getDownloadURL } from "firebase/storage";
import { ChromePicker } from "react-color";
import { Modal, Button } from "react-bootstrap";

// Safe sticker/emoji CDN links (jsDelivr fallback for Twemoji)
const stickers = [
  "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f389.png",
  "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f600.png",
  "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f680.png",
];
const fonts = ["Arial", "Georgia", "Times New Roman", "Courier New", "Verdana"];

const Sticker = ({ id, src, x, y, width = 50, height = 50, setSelectedId }) => {
  const [image] = useImage(src);
  return (
    <KonvaImage
      id={id}
      image={image}
      x={x}
      y={y}
      width={width}
      height={height}
      draggable
      onClick={() => setSelectedId(id)}
    />
  );
};

const CanvasImage = ({ src }) => {
  const [image] = useImage(src);
  return image ? <KonvaImage image={image} width={800} height={400} /> : null;
};

const btn = {
  marginLeft: "10px",
  padding: "8px 16px",
  fontSize: "14px",
  backgroundColor: "#2a9d8f",
  color: "#fff",
  border: "none",
  borderRadius: "4px",
  cursor: "pointer",
};

const BannerEditor = () => {
  const stageRef = useRef();
  const transformerRef = useRef();

  const [bgImage, setBgImage] = useState(null);
  const [texts, setTexts] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [selectedType, setSelectedType] = useState(null);
  const [images, setImages] = useState([]);
  const [templateName, setTemplateName] = useState("");
  const [templateFilter, setTemplateFilter] = useState("");
  const [templates, setTemplates] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingTemplateId, setEditingTemplateId] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [newText, setNewText] = useState("New Text");
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState("");
  const [editTarget, setEditTarget] = useState(null);
  const [textProps, setTextProps] = useState({
    text: "New Text",
    fontSize: 28,
    fontFamily: "Arial",
    fill: "#ffffff",
    align: "left",
    background: "#000000",
    shadowColor: "#000000",
    shadowBlur: 2,
    shadowOffsetX: 1,
    shadowOffsetY: 1,
    stroke: "#000000",
    strokeWidth: 0
  });
  
  useEffect(() => {
    if (transformerRef.current && selectedId) {
      const node = stageRef.current.findOne(#${selectedId});
      if (node) {
        transformerRef.current.nodes([node]);
        transformerRef.current.getLayer().batchDraw();
      }
    }
  }, [selectedId, texts, images]);

  // Add new text box to canvas
  const handleAddText = () => {
    const newId = text-${Date.now()};
    setTexts([
      ...texts,
      {
        id: newId,
        text: newText || "New Text",
        x: 50,
        y: 50,
        fontSize: textProps.fontSize,
        fill: textProps.fill,
        fontFamily: textProps.fontFamily,
        align: textProps.align,
        padding: 6,
        draggable: true,
        background: "rgba(0,0,0,0.5)",
        ...textProps 
      },
    ]);
    setSelectedId(newId);
    setSelectedType("text");
    setNewText("");
  };

  const addText = () => {
    const newId = text-${Date.now()};
    setTexts([...texts, { id: newId, x: 50, y: 50, draggable: true, ...textProps }]);
    setSelectedId(newId);
    setSelectedType("text");
  };

  // Update selected text properties
  const updateTextProp = (prop, value) => {
    setTextProps({ ...textProps, [prop]: value });
    setTexts(
      texts.map((t) => (t.id === selectedId ? { ...t, [prop]: value } : t))
    );
  };

  // Drag move handler for text
  const handleDrag = (id, x, y) => {
    setTexts(texts.map((t) => (t.id === id ? { ...t, x, y } : t)));
    setImages(images.map((img) => (img.id === id ? { ...img, x, y } : img)));
  };

  const handleDblClick = (t) => {
    setEditText(t.text);
    setEditTarget(t.id);
    setIsEditing(true);
  };

  const applyEdit = () => {
    setTexts(texts.map((t) => (t.id === editTarget ? { ...t, text: editText } : t)));
    setIsEditing(false);
    setEditTarget(null);
    setEditText("");
  };

  const handleSticker = (src) => {
    const newId = img-${Date.now()};
    setImages([...images, { id: newId, src, x: 100, y: 100, width: 50, height: 50, draggable: true }]);
    setSelectedId(newId);
    setSelectedType("image");
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async () => {
      const imageDataUrl = reader.result;
      const imageRef = ref(storage, bgImages/bg_${Date.now()}.png);
      await uploadString(imageRef, imageDataUrl, "data_url");
      const downloadURL = await getDownloadURL(imageRef);
      setBgImage(downloadURL);
    };
    reader.readAsDataURL(file);
  };

  const saveTemplate = async () => {
    const userId = auth.currentUser?.uid || "guest";
    const data = {
      userId,
      name: templateName,
      texts,
      images,
      bgImage,
      updatedAt: Date.now(),
    };

    if (editingTemplateId) {
      await updateDoc(doc(db, "bannerTemplates", editingTemplateId), data);
      alert("✅ Template updated");
    } else {
      await addDoc(collection(db, "bannerTemplates"), {
        ...data,
        createdAt: Date.now(),
      });
      alert("✅ Template saved");
    }

    setEditingTemplateId(null);
    setTemplateName("");
  };

  const fetchTemplates = async () => {
    const q = query(
      collection(db, "bannerTemplates"),
      where("userId", "==", auth.currentUser?.uid || "guest")
    );
    const snap = await getDocs(q);
    const results = snap.docs
      .filter((doc) => doc.data().name?.toLowerCase().includes(templateFilter.toLowerCase()))
      .map((doc) => ({ id: doc.id, ...doc.data() }));
    setTemplates(results);
    setShowModal(true);
  };

  const applyTemplate = (template) => {
    setPreviewUrl(null);
    setTexts(template.texts || []);
    setImages(template.images || []);
    setBgImage(template.bgImage || null);
    setShowModal(false);
  };

  const handleEditTemplate = (template) => {
    setTemplateName(template.name);
    setTexts(template.texts || []);
    setImages(template.images || []);
    setBgImage(template.bgImage || null);
    setEditingTemplateId(template.id);
    applyTemplate(template);
    setShowModal(false);
  };

  const handleDeleteTemplate = async (templateId) => {
    if (window.confirm("Delete this template?")) {
      await deleteDoc(doc(db, "bannerTemplates", templateId));
      setTemplates(templates.filter((tpl) => tpl.id !== templateId));
    }
  };


  const saveAsImage = () => {
    const uri = stageRef.current.toDataURL({ pixelRatio: 2 });
    const link = document.createElement("a");
    link.download = "banner.png";
    link.href = uri;
    link.click();
  };

  const handleUpload = async () => {
    const uri = stageRef.current.toDataURL({ pixelRatio: 2 });
    const imageRef = ref(storage, banners/banner_${Date.now()}.png);
    await uploadString(imageRef, uri, "data_url");
    const url = await getDownloadURL(imageRef);
    alert("✅ Uploaded to Firebase\n" + url);
  };

  const generatePreview = () => {
    const uri = stageRef.current.toDataURL({ pixelRatio: 0.3 });
    setPreviewUrl(uri);
  };

  const loadTemplates = async () => {
    const snap = await getDocs(collection(db, "bannerTemplates"));
    if (!snap.empty) {
      const data = snap.docs[0].data();
      setTexts(data.texts || []);
      setImages(data.images || []);
    }
  };


  // Transform handler for resize/scale text
  const handleTransform = (node, id) => {
    setTexts((prev) =>
      prev.map((t) =>
        t.id === id
          ? {
              ...t,
              x: node.x(),
              y: node.y(),
              fontSize: t.fontSize * node.scaleY(),
            }
          : t
      )
    );
    node.scaleX(1);
    node.scaleY(1);
  };


  // Add sticker image to canvas
  const handleSticker = (url) => {
    setImages((prev) => [...prev, { id: img-${Date.now()}, src: url, x: 100, y: 100, draggable: true }]);
  }; 

  // Load a sample template with text and emoji
  const handleTemplate = () => {
    setTexts([
      {
        id: "title",
        text: "🚀 Launch Your Product",
        x: 40,
        y: 300,
        fontSize: 32,
        fill: "white",
        background: "rgba(0,0,0,0.5)",
        padding: 8,
        draggable: true,
        fontFamily: "Arial",
        align: "left",
      },
    ]);
    setImages([
      {
        id: "emoji-rocket",
        src: "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f680.png",
        x: 250,
        y: 100,
        draggable: true,
      },
    ]);
  };

  

  return (
    <div style={{ padding: "2rem", maxWidth: 900, margin: "auto" }}>
      <h2>🎨 Banner Editor (Drag, Text, Emoji, Upload)</h2>
      <input value={templateName} onChange={(e) => setTemplateName(e.target.value)} placeholder="Template Name" />
      <button onClick={saveTemplate}>{editingTemplateId ? "✏️ Update Template" : "💾 Save Template"}</button>
      <button onClick={fetchTemplates}>📂 Load Template</button>
      <input value={templateFilter} onChange={(e) => setTemplateFilter(e.target.value)} placeholder="Filter" />


      <div style={{ marginBottom: "1rem" }}>
        <input
          type="text"
          placeholder="Enter text"
          value={newText}
          onChange={(e) => setNewText(e.target.value)}
          style={{ padding: "8px", width: "250px", marginRight: 10 }}
        />
        <button onClick={handleAddText} style={btn}>
          Add Text
        </button>
        <input type="file" onChange={handleImageUpload} accept="image/*" style={{ marginLeft: 20 }} />
      </div>

      <div style={{ display: "flex", gap: 10, marginBottom: 20, alignItems: "center" }}>
        <select
          value={textProps.fontFamily}
          onChange={(e) => updateTextProp("fontFamily", e.target.value)}
        >
          {fonts.map((font) => (
            <option key={font} value={font}>
              {font}
            </option>
          ))}
        </select>

        <input
          type="number"
          value={textProps.fontSize}
          onChange={(e) => updateTextProp("fontSize", parseInt(e.target.value))}
          style={{ width: 60 }}
          min={8}
          max={150}
        />

        <select value={textProps.align} onChange={(e) => updateTextProp("align", e.target.value)}>
          <option value="left">Left</option>
          <option value="center">Center</option>
          <option value="right">Right</option>
        </select>
        
        <div>
          <label>Text Color</label>
          <ChromePicker
            color={textProps.fill}
            onChangeComplete={(color) => updateTextProp("fill", color.hex)}
            disableAlpha={true}
          />
        </div>

        <div>
          <label>Background</label>
          <ChromePicker
            color={textProps.background}
            onChangeComplete={(color) => updateTextProp("background", color.hex)}
          />
        </div>

      </div>
      
      <div style={{ display: "flex", gap: 10, marginBottom: 10, flexWrap: "wrap" }}>
        <input
          type="text"
          placeholder="Text"
          value={textProps.text}
          onChange={(e) => updateTextProp("text", e.target.value)}
        />

        <select
          value={textProps.fontFamily}
          onChange={(e) => updateTextProp("fontFamily", e.target.value)}
        >
          {fonts.map((font) => (
            <option key={font}>{font}</option>
          ))}
        </select>

        <input
          type="number"
          value={textProps.fontSize}
          onChange={(e) => updateTextProp("fontSize", parseInt(e.target.value))}
        />

        <input
          type="color"
          value={textProps.fill}
          onChange={(e) => updateTextProp("fill", e.target.value)}
        />

        <input
          type="color"
          value={textProps.background}
          onChange={(e) => updateTextProp("background", e.target.value)}
        />

        <input
          type="color"
          value={textProps.stroke}
          onChange={(e) => updateTextProp("stroke", e.target.value)}
        />

        <input
          type="number"
          value={textProps.strokeWidth}
          onChange={(e) => updateTextProp("strokeWidth", parseInt(e.target.value))}
        />

        <button onClick={addText}>Add Text</button>
        {stickers.map((s, i) => (
          <img
            key={i}
            src={s}
            onClick={() => handleSticker(s)}
            style={{ cursor: "pointer", width: 32 }}
            alt="sticker"
          />
        ))}
        <button onClick={saveAsImage}>📷 Export PNG</button>
        <button onClick={saveTemplate}>💾 Save Template</button>
        <button onClick={loadTemplates}>📂 Load Template</button>
        <button onClick={generatePreview}>👁️ Preview</button>
      </div>

      {previewUrl && (
        <div style={{ marginTop: 10 }}>
          <h5>Preview:</h5>
          <img src={previewUrl} alt="preview" style={{ border: "1px solid #ccc", maxWidth: 300 }} />
        </div>
      )}

      <div style={{ marginBottom: "1rem" }}>
        {stickers.map((url, i) => (
          <img
            key={i}
            src={url}
            alt="sticker"
            onClick={() => handleSticker(url)}
            style={{ width: 32, margin: "0 5px", cursor: "pointer" }}
          />
        ))}
        <button onClick={handleTemplate} style={btn}>
          🎯 Load Template
        </button>
      </div>



      <Stage width={800} height={400} ref={stageRef} style={{ border: "1px solid #ccc" }}>
        <Layer>
          {bgImage && <CanvasImage src={bgImage} />}
          {texts.map((t) => (
            <Group
              key={t.id}
              x={t.x}
              y={t.y}
              draggable
              onDragEnd={(e) => handleDrag(t.id, e.target.x(), e.target.y())}
              onClick={() => setSelectedId(t.id)}
              onDblClick={() => handleDblClick(t)}
              ref={(node) => {
                if (node && selectedId === t.id) {
                  transformerRef.current?.nodes([node]);
                  transformerRef.current?.getLayer()?.batchDraw();
                }
              }}
            >
              <Rect
                width={t.text.length * t.fontSize * 0.6}
                height={t.fontSize + 10}
                fill={t.background || "transparent"}
              />
              <Text
                {...t}
                x={5}
                y={5}
              />
            </Group>

          ))}
          {images.map((img) => (
            <Sticker key={img.id} id={img.id} src={img.src} x={img.x} y={img.y} width={img.width} height={img.height} setSelectedId={setSelectedId} />
          ))}
          <Transformer
            ref={transformerRef}
            rotateEnabled={false}
            enabledAnchors={["top-left", "top-right", "bottom-left", "bottom-right"]}
          />
        </Layer>
      </Stage>
      

      {isEditing && (
        <div style={{ marginTop: 20 }}>
          <h4>Edit Text</h4>
          <input
            type="text"
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            style={{ padding: "6px", width: "300px" }}
          />
          <button onClick={applyEdit} style={{ marginLeft: "10px" }}>Apply</button>
        </div>
      )}

      <div style={{ marginTop: "1rem" }}>
        <button
          onClick={() => {
            const link = document.createElement("a");
            link.download = "banner.png";
            link.href = stageRef.current.toDataURL();
            link.click();
          }}
          style={btn}
        >
          ⬇️ Download PNG
        </button>

        <button onClick={handleUpload} style={{ ...btn, backgroundColor: "#0077b6" }}>
          ☁️ Upload to Firebase
        </button>
      </div>

      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Select Template</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="d-flex flex-wrap gap-3">
            {templates.map((tpl) => (
              <div key={tpl.id} style={{ border: "1px solid #ccc", padding: 10, width: 200 }}>
                <strong>{tpl.name}</strong>
                {tpl.bgImage && <img src={tpl.bgImage} alt="thumb" style={{ width: "100%", marginTop: 5 }} />}
                <div className="mt-2 d-flex justify-content-between">
                  <Button variant="success" size="sm" onClick={() => applyTemplate(tpl)}>Apply</Button>
                  <Button variant="primary" size="sm" onClick={() => handleEditTemplate(tpl)}>Edit</Button>
                  <Button variant="danger" size="sm" onClick={() => handleDeleteTemplate(tpl.id)}>🗑️</Button>
                </div>
              </div>
            ))}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

    </div>
  );
};
export default BannerEditor;
*/


