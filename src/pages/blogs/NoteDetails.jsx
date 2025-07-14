// src/components/notes/NoteDetails.jsximport React, { useEffect, useRef, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase";
import { useParams, useNavigate } from "react-router-dom";
import EditorJS from "@editorjs/editorjs";
import Header from "@editorjs/header";
import List from "@editorjs/list";
import Paragraph from "@editorjs/paragraph";
import Checklist from "@editorjs/checklist";
import Quote from "@editorjs/quote";
import Warning from "@editorjs/warning";
import Marker from "@editorjs/marker";
import Delimiter from "@editorjs/delimiter";
import Code from "@editorjs/code";
import InlineCode from "@editorjs/inline-code";
import Embed from "@editorjs/embed";
import Table from "@editorjs/table";
import ImageTool from "@editorjs/image";
import { useEffect, useRef, useState } from "react";

const NoteDetails = () => {
  const { noteId } = useParams();
  const editorRef = useRef(null);
  const [note, setNote] = useState(null);
  const navigate = useNavigate();

  // Fetch the note first
  useEffect(() => {
    const fetchNote = async () => {
      try {
        const docRef = doc(db, "notes", noteId);
        const snapshot = await getDoc(docRef);
        if (snapshot.exists()) {
          setNote(snapshot.data());
        } else {
          alert("Note not found");
          navigate(-1);
        }
      } catch (error) {
        console.error("Error fetching note:", error);
      }
    };

    fetchNote();
  }, [noteId]);

  // Now initialize EditorJS AFTER rendering <div id="note-viewer">
  useEffect(() => {
    if (note && document.getElementById("note-viewer") && !editorRef.current) {
      editorRef.current = new EditorJS({
        holder: "note-viewer",
        readOnly: true,
        data: { blocks: note.blocks || [] },
        tools: {
          header: Header,
          list: List,
          paragraph: Paragraph,
          checklist: Checklist,
          quote: Quote,
          warning: Warning,
          marker: Marker,
          delimiter: Delimiter,
          code: Code,
          inlineCode: InlineCode,
          embed: Embed,
          table: Table,
          image: {
            class: ImageTool,
            config: {
              endpoints: {
                byFile: "http://localhost:5000/uploadFile",
                byUrl: "http://localhost:5000/fetchUrl",
              },
            },
          },
        },
      });
    }
  }, [note]);

  return (
    <div className="container mt-4">
      <h3 className="mb-3">📝 Note Details</h3>
      {note ? (
        <>
          <h4>{note.title}</h4>
          <p className="text-muted">Category: {note.category}</p>
          <div id="note-viewer" className="border p-3 rounded bg-light" />
        </>
      ) : (
        <p>Loading note...</p>
      )}
    </div>
  );
};

export default NoteDetails;
