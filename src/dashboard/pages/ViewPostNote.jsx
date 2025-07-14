import { collection, doc, getDoc, getDocs, query, where } from 'firebase/firestore';
import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom';
import { db } from '../../firebase';

const ViewPostNote = ({user}) => {
    
    const { id } = useParams();
    const [title, setTitle] = useState("");
    const [notes, setNotes] = useState([]);
    const navigate = useNavigate();
    console.log(id);

    // Step 1: Fetch blog title by blog ID
    useEffect(() => {
        const fetchNotesInPost = async () => {
        try {
            const docRef = doc(db, "posts", id);
            const snapshot = await getDoc(docRef);

            if (snapshot.exists()) {
            const postTitle = snapshot.data().title;
            setTitle(postTitle);

            // Step 2: Fetch notes where title == blogTitle and category == "blogpost"
            const notesRef = collection(db, "notes");
            const q = query(
                notesRef,
                 where("title", "==", postTitle),
                 where("category", "==", "post")
            );

            const notesSnapshot = await getDocs(q);
            const fetchedNotes = notesSnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            // setNotes(fetchedNotes); // newest first
             setNotes(fetchedNotes.reverse()); // newest first
            } else {
            alert("Post not found");
            }
        } catch (err) {
            console.error("Error fetching posts/notes:", err);
        }
        };

        fetchNotesInPost();
    }, [id]);

    const handleDelete = async (noteId) => {
        if (window.confirm("Are you sure you want to delete this note?")) {
        await deleteDoc(doc(db, "notes", noteId));
        setNotes((prev) => prev.filter((note) => note.id !== noteId));
        }
    };

    const handleEdit = (noteId) => {
        navigate(`/edit-note/post/${noteId}`);
    };
    


  return (
    <div>
        <div className="container mt-4">
            <h4>Notes for Post: <strong>{title}</strong></h4>
            {notes.length === 0 ? (
            <p>No notes found.</p>
            ) : (
            <div className="list-group">
                {notes.map(note => (
                <div
                    key={note.id}
                    className="list-group-item d-flex justify-content-between align-items-start"
                >
                    <div>
                    <h5>{note.title}</h5>
                    <p className="text-muted mb-1">Category: {note.category}</p>
                    </div>
                    <div>
                    <Link
                        to={`/note-details/${note.id}`}
                        className="btn btn-sm btn-outline-primary me-2"
                    >
                        View
                    </Link>
                    <button
                        onClick={() => handleEdit(note.id)}
                        className="btn btn-sm btn-outline-secondary me-2"
                    >
                        Edit
                    </button>
                    <button
                        onClick={() => handleDelete(note.id)}
                        className="btn btn-sm btn-outline-danger"
                    >
                        Delete
                    </button>
                    </div>
                </div>
                ))}
            </div>
            )}
        </div>
    </div>
  )
}

export default ViewPostNote