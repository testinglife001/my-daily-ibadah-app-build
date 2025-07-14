// src/components/Dashboard/CommentSection.jsx
import React, { useEffect, useRef, useState } from "react";
import {
  collection,
  addDoc,
  serverTimestamp,
  deleteDoc,
  doc,
  updateDoc,
  onSnapshot, 
  query, 
  where
} from "firebase/firestore";
import { Badge, Button } from "react-bootstrap";
import { useRealtimeCollection } from "./useRealtimeCollection";
import { db } from "../../firebase";
import CommentItem from "./CommentItem";

export default function CommentSection({ postId, user }) {
  const allComments = useRealtimeCollection("comments");
  const comments = allComments.filter((c) => c.postId === postId);

  const [text, setText] = useState("");
  const [editing, setEditing] = useState(null); // id of comment being edited
  const [replyingTo, setReplyingTo] = useState(null); // id of comment being replied to
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

  const handleSubmit = async (parentId = null) => {
    const content = parentId ? replyText : text;
    if (!user || !content.trim()) return;

    await addDoc(collection(db, "comments"), {
      postId,
      userId: user.uid,
      author: user.displayName,
      text: content.trim(),
      parentId,
      timestamp: serverTimestamp(),
    });

    parentId ? setReplyText("") : setText("");
    setReplyingTo(null);
  };

  const handleDelete = async (id) => {
    await deleteDoc(doc(db, "comments", id));
  };

  const handleEdit = async (id) => {
    if (!editText.trim()) return;
    await updateDoc(doc(db, "comments", id), {
      text: editText.trim(),
    });
    setEditing(null);
  };

    useEffect(() => {
        commentsEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [allComments.length]); // scrolls whenever a new comment appears
    

  const renderReplies = (parentId, level = 1) => {
    const replies = comments.filter((c) => c.parentId === parentId);
    return replies.map((r) => (
      <div key={r.id} className={`ms-${level * 5} m-2 mt-2`}>
        <CommentItem
          comment={r}
          replyCount={comments.filter((c) => c.parentId === r.id).length}
          level={level}
          onReply={() => {
            setReplyingTo(r.id);
            setReplyText("");
          }}
          onEdit={() => {
            setEditing(r.id);
            setEditText(r.text);
          }}
          onDelete={() => handleDelete(r.id)}
          onEditSubmit={() => handleEdit(r.id)}
          editing={editing === r.id}
          replying={replyingTo === r.id}
          replyText={replyText}
          setReplyText={setReplyText}
          editText={editText}
          setEditText={setEditText}
          handleSubmit={() => handleSubmit(r.id)}
          user={user}
          renderReplies={() => renderReplies(r.id, level + 1)}
        />
      </div>
    ));
  };

  const topComments = comments.filter((c) => !c.parentId);

  return (
    <div className="mt-4">
      <h5>Comments</h5>
      <Badge bg="secondary">{commentCounts[postId] || 0} Comments</Badge>

      <div style={{ maxHeight: "400px", overflowY: "auto" }}>
      {topComments.map((comment) => {
        const replyCount = comments.filter(c => c.parentId === comment.id).length;
        return (
            <div key={comment.id} className="mb-3">
            <CommentItem
                comment={comment}
                level={0}
                onReply={() => {
                setReplyingTo(comment.id);
                setReplyText("");
                }}
                onEdit={() => {
                setEditing(comment.id);
                setEditText(comment.text);
                }}
                onDelete={() => handleDelete(comment.id)}
                onEditSubmit={() => handleEdit(comment.id)}
                editing={editing === comment.id}
                replying={replyingTo === comment.id}
                replyText={replyText}
                setReplyText={setReplyText}
                editText={editText}
                setEditText={setEditText}
                handleSubmit={() => handleSubmit(comment.id)}
                user={user}
                 replyCount={replyCount}
                renderReplies={() => renderReplies(comment.id, 1)}
            />
            </div>
        );
        <div ref={commentsEndRef} />
      })}
        
      </div>

   

      {user && (
        <div className="mt-4">
          <textarea
            className="form-control"
            value={text}
            rows={2}
            onChange={(e) => setText(e.target.value)}
            placeholder="Write a comment..."
          />
          <Button variant="success" size="sm" className="mt-2" onClick={() => handleSubmit(null)}>
            Post Comment
          </Button>
        </div>
      )}
    </div>
  );
}

/*
function CommentItem({
  comment,
  replyCount = 0,
  level,
  onReply,
  onEdit,
  onDelete,
  onEditSubmit,
  editing,
  replying,
  replyText,
  setReplyText,
  editText,
  setEditText,
  handleSubmit,
  user,
  renderReplies,
}) {
  return (
    <div>
      <strong>{comment.author}</strong>:
      {editing ? (
        <>
          <textarea
            className="form-control"
            rows={2}
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
          />
          <Button variant="primary" size="sm" className="me-2 mt-1" onClick={onEditSubmit}>
            Save
          </Button>
          <Button variant="secondary" size="sm" className="mt-1" onClick={() => setEditText("")}>
            Cancel
          </Button>
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

      {user?.uid === comment.userId && !editing && (
        <div className="mt-1">
          <Button size="sm" variant="outline-primary" className="me-2" onClick={onEdit}>
            Edit
          </Button>
          <Button size="sm" variant="outline-danger" onClick={onDelete}>
            Delete
          </Button>
        </div>
      )}

      {user && !editing && (
        <>
          <div className="mt-2">
            <Button variant="link" size="sm" onClick={onReply}>
              {replying ? "Cancel Reply" : "Reply"}
            </Button>
          </div>

          {replying && (
            <div className="mt-2">
              <textarea
                className="form-control"
                rows={2}
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Write your reply..."
              />
              <Button
                variant="success"
                size="sm"
                className="mt-2"
                onClick={handleSubmit}
              >
                Submit Reply
              </Button>
            </div>
          )}
        </>
      )}

      {renderReplies && <div className="mt-2">{renderReplies()}</div>}
    </div>
  );
}
*/
