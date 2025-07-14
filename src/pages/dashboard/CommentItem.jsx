import React, { useState } from "react";
import { Button } from "react-bootstrap";

function CommentItem({
  comment,
  replyCount = 0,
  user,
  replying,
  editing,
  replyText,
  setReplyText,
  editText,
  setEditText,
  onReply,
  onEdit,
  onDelete,
  onEditSubmit,
  handleSubmit,
  renderReplies,
}) {
  const [showReplies, setShowReplies] = useState(true); // 🔁 Toggle state

  return (
    <div>
      <strong>{comment.author}</strong>:
      <span> {comment.text}</span>

    <div className="mt-1">
        <button className="btn btn-link btn-sm p-0" onClick={onReply}>
        Reply
        </button>
    </div>

    {/* ✅ This must be inside the return */}
    {replying && (
        <div className="mt-2">
        <textarea
            className="form-control"
            rows={2}
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            placeholder="Write your reply..."
        />
        <button className="btn btn-sm btn-success mt-2" onClick={handleSubmit}>
            Submit Reply
        </button>
        </div>
    )}

      {/* Replies count and toggle */}
      {replyCount > 0 && (
        <div className="mt-1">
          <button
            className="btn btn-link btn-sm p-0"
            onClick={() => setShowReplies(!showReplies)}
          >
            {showReplies ? "Hide Replies" : `Show ${replyCount} Reply${replyCount > 1 ? "ies" : ""}`}
          </button>
        </div>
      )}



    {/* ✅ This must be inside the return */}
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

      {/* Edit/Delete buttons */}
      {user?.uid === comment.userId && !editing && (
        <div className="mt-1">
          <button className="btn btn-sm btn-outline-primary me-2" onClick={onEdit}>
            Edit
          </button>
          <button className="btn btn-sm btn-outline-danger" onClick={onDelete}>
            Delete
          </button>
        </div>
      )}


      {/* Edit textarea */}
      {editing && (
        <div className="mt-2">
          <textarea
            className="form-control"
            rows={2}
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
          />
          <button className="btn btn-sm btn-primary me-2 mt-2" onClick={onEditSubmit}>
            Save
          </button>
          <button
            className="btn btn-sm btn-secondary mt-2"
            onClick={() => setEditText("")}
          >
            Cancel
          </button>
        </div>
      )}

      {/* Render replies only if visible */}
      {showReplies && renderReplies && (
        <div className="mt-2">{renderReplies()}</div>
      )}
    </div>
  );
}

export default CommentItem;
