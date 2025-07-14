// src/components/PostCreator.jsx
/*
import React, { useState } from "react";
import axios from "axios";
import { db, storage } from "../../firebase";
import {
  addDoc,
  collection,
  serverTimestamp
} from "firebase/firestore";
import {
  ref,
  uploadBytes,
  getDownloadURL
} from "firebase/storage";

const platforms = ["Instagram", "Facebook", "LinkedIn", "Twitter"];

const PostCreator = () => {
  const [topic, setTopic] = useState("");
  const [caption, setCaption] = useState("");
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [platform, setPlatform] = useState("Instagram");

  

  const generateCaption = async () => {
    if (!topic.trim()) return alert("Enter a topic first");
    setLoading(true);
    setCaption("");
    const openaiKey = import.meta.env.VITE_OPENAI_API_KEY;

    if (!openaiKey) {
    alert("Missing OpenAI API Key");
    return;
    }

    try {
        const res = await axios.post(
            "https://api.openai.com/v1/chat/completions",
            {
            model: "gpt-3.5-turbo",
            messages: [
                {
                role: "user",
                content: `Write a catchy, creative social media caption about: ${topic}`,
                },
            ],
            temperature: 0.7,
            max_tokens: 100,
            },
            {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${openaiKey}`,
            },
            }
        );

        setCaption(res.data.choices[0].message.content.trim());
        } catch (error) {
        console.error("OpenAI Error:", error);
        alert("Failed to generate. Check console.");
        }

    // setLoading(false);
    setTimeout(() => setLoading(false), 2000);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const savePost = async () => {
    if (!caption.trim()) return alert("Generate or write a caption first");

    let imageUrl = "";

    try {
      if (image) {
        const storageRef = ref(storage, `posts/${Date.now()}_${image.name}`);
        await uploadBytes(storageRef, image);
        imageUrl = await getDownloadURL(storageRef);
      }

      await addDoc(collection(db, "ai-posts"), {
        topic,
        caption,
        platform,
        imageUrl,
        createdAt: serverTimestamp(),
      });

      alert("Post saved as draft!");
      console.log("Post saved as draft!");
      // Reset fields
      setTopic("");
      setCaption("");
      setImage(null);
      setPreview(null);
      setPlatform("Instagram");
    } catch (err) {
      console.error("Error saving post:", err);
      alert("Failed to save post.");
    }
  };

  return (
    <div style={styles.container}>
      <h2>Create Social Media Post</h2>

      <textarea
        placeholder="Enter a topic"
        rows={3}
        value={topic}
        onChange={(e) => setTopic(e.target.value)}
        style={styles.textarea}
      />

      <button onClick={generateCaption} style={styles.button} disabled={loading}>
        {loading ? "Generating..." : "Generate Caption"}
      </button>

      {caption && (
        <>
          <h4 style={{ marginTop: "1rem" }}>Generated Caption:</h4>
          <textarea
            rows={3}
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            style={styles.textarea}
          />
        </>
      )}

      <div style={styles.selectGroup}>
        <label>Platform:</label>
        <select value={platform} onChange={(e) => setPlatform(e.target.value)} style={styles.select}>
          {platforms.map((p) => (
            <option key={p}>{p}</option>
          ))}
        </select>
      </div>

      <input type="file" onChange={handleImageChange} accept="image/*" />

      {preview && (
        <div style={{ marginTop: "1rem" }}>
          <strong>Image Preview:</strong><br />
          <img src={preview} alt="Preview" style={{ width: "100%", maxWidth: "300px", marginTop: "10px" }} />
        </div>
      )}

      <button onClick={savePost} style={styles.saveButton}>
        Save as Draft
      </button>
    </div>
  );
};

const styles = {
  container: { padding: "2rem", maxWidth: "600px", margin: "auto", fontFamily: "Arial" },
  textarea: { width: "100%", padding: "10px", fontSize: "1rem", margin: "10px 0" },
  button: { padding: "10px 20px", fontSize: "1rem", marginBottom: "1rem" },
  saveButton: { padding: "10px 20px", fontSize: "1rem", marginTop: "2rem", background: "green", color: "white", border: "none" },
  selectGroup: { marginTop: "1rem" },
  select: { marginLeft: "10px", padding: "6px" },
};

export default PostCreator;
*/

import React, { useState } from "react";
import { db, storage } from "../../firebase";
import {
  addDoc,
  collection,
  serverTimestamp,
} from "firebase/firestore";
import {
  ref,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";

const platforms = ["Instagram", "Facebook", "LinkedIn", "Twitter"];

const PostCreator = () => {
  const [topic, setTopic] = useState("");
  const [caption, setCaption] = useState("");
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [platform, setPlatform] = useState("Instagram");

  // ✅ Smart caption generator (no OpenAI)
  const generateCaption = () => {
    if (!topic.trim()) return alert("Enter a topic first");

    setLoading(true);

    const emojis = ["🔥", "✨", "🚀", "💡", "🎯", "📢", "📸", "🧠"];
    const verbs = ["Boost", "Explore", "Learn", "Grow", "Discover", "Master"];
    const endings = [
      `your knowledge of ${topic}!`,
      `why ${topic} matters today.`,
      `the future of ${topic}.`,
      `${topic} tips that work.`,
      `the secrets of ${topic}.`,
      `creative ideas about ${topic}.`,
    ];

    const rand = (arr) => arr[Math.floor(Math.random() * arr.length)];
    const caption = `${rand(emojis)} ${rand(verbs)} ${rand(endings)}`;

    setTimeout(() => {
      setCaption(caption);
      setLoading(false);
    }, 800); // mimic async delay
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const savePost = async () => {
    if (!caption.trim()) return alert("Generate or write a caption first");

    let imageUrl = "";

    try {
      if (image) {
        const storageRef = ref(storage, `posts/${Date.now()}_${image.name}`);
        await uploadBytes(storageRef, image);
        imageUrl = await getDownloadURL(storageRef);
      }

      await addDoc(collection(db, "ai-posts"), {
        topic,
        caption,
        platform,
        imageUrl,
        createdAt: serverTimestamp(),
      });

      alert("✅ Post saved as draft!");
      // Reset form
      setTopic("");
      setCaption("");
      setImage(null);
      setPreview(null);
      setPlatform("Instagram");
    } catch (err) {
      console.error("❌ Error saving post:", err);
      alert("Failed to save post.");
    }
  };

  return (
    <div style={styles.container}>
      <h2>Create Social Media Post</h2>

      <textarea
        placeholder="Enter a topic"
        rows={3}
        value={topic}
        onChange={(e) => setTopic(e.target.value)}
        style={styles.textarea}
      />

      <button onClick={generateCaption} style={styles.button} disabled={loading}>
        {loading ? "Generating..." : "Generate Caption"}
      </button>

      {caption && (
        <>
          <h4 style={{ marginTop: "1rem" }}>Generated Caption:</h4>
          <textarea
            rows={3}
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            style={styles.textarea}
          />
        </>
      )}

      <div style={styles.selectGroup}>
        <label>Platform:</label>
        <select
          value={platform}
          onChange={(e) => setPlatform(e.target.value)}
          style={styles.select}
        >
          {platforms.map((p) => (
            <option key={p}>{p}</option>
          ))}
        </select>
      </div>

      <input type="file" onChange={handleImageChange} accept="image/*" />

      {preview && (
        <div style={{ marginTop: "1rem" }}>
          <strong>Image Preview:</strong>
          <br />
          <img
            src={preview}
            alt="Preview"
            style={{ width: "100%", maxWidth: "300px", marginTop: "10px" }}
          />
        </div>
      )}

      <button onClick={savePost} style={styles.saveButton}>
        Save as Draft
      </button>
    </div>
  );
};

const styles = {
  container: {
    padding: "2rem",
    maxWidth: "600px",
    margin: "auto",
    fontFamily: "Arial",
  },
  textarea: {
    width: "100%",
    padding: "10px",
    fontSize: "1rem",
    margin: "10px 0",
  },
  button: {
    padding: "10px 20px",
    fontSize: "1rem",
    marginBottom: "1rem",
  },
  saveButton: {
    padding: "10px 20px",
    fontSize: "1rem",
    marginTop: "2rem",
    background: "green",
    color: "white",
    border: "none",
    cursor: "pointer",
  },
  selectGroup: {
    marginTop: "1rem",
  },
  select: {
    marginLeft: "10px",
    padding: "6px",
  },
};

export default PostCreator;

