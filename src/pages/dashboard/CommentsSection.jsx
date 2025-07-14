// src/components/CommentsSection.jsx
import React, { useEffect, useState, useRef } from "react";
import {
  collection,
  addDoc,
  doc,
  deleteDoc,
  updateDoc,
  onSnapshot,
  query,
  where,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../../firebase";
import { Badge } from "react-bootstrap";

const CommentsSection = ({ postId, user }) => {
  const [comments, setComments] = useState([]);
  const [replyingTo, setReplyingTo] = useState(null);
  const [editing, setEditing] = useState(null);
  const [text, setText] = useState("");
  const [replyText, setReplyText] = useState("");
  const [editText, setEditText] = useState("");
  const [commentCounts, setCommentCounts] = useState({});

  const commentsEndRef = useRef(null);
  
  useEffect(() => {
      const unsub = onSnapshot(collection(db, "comments"), (snapshot) => {
          const counts = {};
          snapshot.docs.forEach(doc => {
          const { postId } = doc.data();
          if (!counts[postId]) counts[postId] = 0;
          counts[postId]++;
          });
          setCommentCounts(counts);
      });
  
      return () => unsub();
  }, []);

  useEffect(() => {
    const q = query(
      collection(db, "comments"),
      where("postId", "==", postId),
      orderBy("timestamp", "asc")
    );
    const unsub = onSnapshot(q, (snap) => {
      setComments(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    });
    return () => unsub();
  }, [postId]);

  /*
  useEffect(() => {
    commentsEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [comments.length]);
  */

  useEffect(() => {
    const scrollEl = commentsEndRef.current?.parentElement;
    if (scrollEl) {
        scrollEl.scrollTop = scrollEl.scrollHeight;
    }
  }, [comments.length]);

  // console.log(user);

  const handleSubmit = async (parentId = null) => {
    const content = parentId ? replyText : text;
    if (!content.trim()) return;

    await addDoc(collection(db, "comments"), {
      postId,
      userId: user?.uid,
      author: user?.displayName,
      text: content.trim(),
      parentId,
      timestamp: serverTimestamp(),
    });

    if (parentId) {
      setReplyingTo(null);
      setReplyText("");
    } else {
      setText("");
    }
  };

  const handleDelete = async (id) => {
    await deleteDoc(doc(db, "comments", id));
  };

  const handleEdit = async (id) => {
    await updateDoc(doc(db, "comments", id), { text: editText.trim() });
    setEditing(null);
    setEditText("");
  };

  const renderReplies = (parentId, level = 1) => {
    return comments
      .filter((c) => c.parentId === parentId)
      .map((r) => (
        <div key={r.id} className={`ms-${level * 5} m-2 mt-2`}>
        <CommentItem
          key={r.id}
          comment={r}
          user={user}
          level={level}
          isReplying={replyingTo === r.id}
          isEditing={editing === r.id}
          replyText={replyText}
          editText={editText}
          onReply={() => {
            setReplyingTo(r.id);
            setReplyText("");
          }}
          onEdit={() => {
            setEditing(r.id);
            setEditText(r.text);
          }}
          onDelete={() => handleDelete(r.id)}
          onSubmitReply={() => handleSubmit(r.id)}
          onSubmitEdit={() => handleEdit(r.id)}
          onCancelEdit={() => setEditing(null)}
          setReplyText={setReplyText}
          setEditText={setEditText}
          replies={renderReplies(r.id, level + 1)}
          setReplyingTo={setReplyingTo}
        />
        </div>
      ));
  };

  const topLevel = comments.filter((c) => !c.parentId);

  return (
    <div className="mt-4">
      <h5>Comments</h5>
      <Badge bg="secondary">{commentCounts[postId] || 0} Comments</Badge>


    <div style={{ maxHeight: "400px", overflowY: "auto" }}>
      {topLevel.map((comment) => {
        const replyCount = comments.filter(c => c.parentId === comment.id).length;
        return (
        <CommentItem
          key={comment.id}
          comment={comment}
          user={user}
          replyCount={replyCount}
          level={0}
          isReplying={replyingTo === comment.id}
          isEditing={editing === comment.id}
          replyText={replyText}
          editText={editText}
          onReply={() => {
            setReplyingTo(comment.id);
            setReplyText("");
          }}
          onEdit={() => {
            setEditing(comment.id);
            setEditText(comment.text);
          }}
          onDelete={() => handleDelete(comment.id)}
          onSubmitReply={() => handleSubmit(comment.id)}
          onSubmitEdit={() => handleEdit(comment.id)}
          onCancelEdit={() => setEditing(null)}
          setReplyText={setReplyText}
          setEditText={setEditText}
          replies={renderReplies(comment.id, 1)}
          setReplyingTo={setReplyingTo}
        />
        );
      })}  
        <div ref={commentsEndRef} ></div>
      </div>

      {/* Add new comment */}
      <div className="mt-3">
        <textarea
          className="form-control"
          placeholder="Write a comment..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button className="btn btn-success btn-sm mt-2" onClick={() => handleSubmit(null)}>
          Post Comment
        </button>
      </div>

      <div ref={commentsEndRef}></div>
    </div>
  );
};

const CommentItem = ({
  comment,
  user,
  replyCount = 0,
  level,
  isReplying,
  setReplyingTo,
  isEditing,
  replyText,
  editText,
  onReply,
  onEdit,
  onDelete,
  onSubmitReply,
  onSubmitEdit,
  onCancelEdit,
  setReplyText,
  setEditText,
  replies,
}) => {
  const [showReplies, setShowReplies] = useState(true);

  return (
    <div className={`mt-3 ms-${level * 6}`}>
      <strong>{comment.author}</strong>:{" "}
      {isEditing ? (
        <>
          <textarea
            className="form-control"
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
          />
          <button className="btn btn-sm btn-primary mt-1 me-2" onClick={onSubmitEdit}>
            Save
          </button>
          <button className="btn btn-sm btn-secondary mt-1" onClick={onCancelEdit}>
            Cancel
          </button>
        </>
      ) : (
         <>
        <span> {comment.text}</span>
        {replyCount > 0 && (
            <span className="ms-2 text-muted small">
            ({replyCount} {replyCount === 1 ? "reply" : "replies"})
            </span>
        )}
        </>
      )}

      {!isEditing && (
        <div className="mt-1">
          {/*<button className="btn btn-sm btn-link" onClick={onReply}>
            {isReplying ? "Cancel Reply" : "Reply"}
          </button>*/}
          {user.uid === comment.userId && (
            <>
              <button className="btn btn-sm btn-outline-primary me-2" onClick={onEdit}>
                Edit
              </button>
              <button className="btn btn-sm btn-outline-danger" onClick={onDelete}>
                Delete
              </button>
            </>
          )}
        </div>
      )}
        
      {!isReplying ? (
        <button className="btn btn-sm mt-2  btn-secondary" onClick={onReply}>
            Reply
        </button>
        ) : (
        <button className="btn btn-sm mt-2  btn-warning" onClick={() => setReplyingTo(null)}>
            Cancel Reply
        </button>
      )}


      {isReplying && (
        <div className="mt-2">
          <textarea
            className="form-control"
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            placeholder="Write your reply..."
          />
          <button className="btn btn-sm btn-success mt-2" onClick={onSubmitReply}>
            Submit Reply
          </button>
        </div>
      )}

      {replies?.length > 0 && (
        <div className="mt-2">
          <button
            className="btn btn-sm btn-link"
            onClick={() => setShowReplies(!showReplies)}
          >
            {showReplies ? "Hide Replies" : `Show ${replies.length} Replies`}
          </button>
          {showReplies && replies}
        </div>
      )}
    </div>
  );
};

export default CommentsSection;
