import EditorJS from "@editorjs/editorjs";
import { useEffect, useRef } from "react";
import { doc, updateDoc, arrayRemove } from "firebase/firestore";
import { db, auth } from "../../../firebase";

function NewCard({
  title, blocks, categoryType,
  createdBy, createdUsername,
  isPublic, sharedWith, idx
}) {
  const editorRef = useRef(null);
  const holder = useRef(`editorjs-${Math.random()}`);

  useEffect(() => {
    if (!blocks || !holder.current) return;
    const editor = new EditorJS({
      holder: holder.current,
      data: { blocks },
      readOnly: true,
      tools: {}
    });
    editorRef.current = editor;

    return () => editorRef.current?.destroy();
  }, [blocks]);

  const currentUser = auth.currentUser;
  const handleRevoke = async (uid) => {
    const noteRef = doc(db, "notes", idx);
    await updateDoc(noteRef, {
      sharedWith: arrayRemove(uid)
    });
    window.location.reload();
  };

  return (
    <div className="card mb-3">
      <div className="card-header">
        <small>
          {createdUsername} ({createdBy}) —{" "}
          <span className={isPublic ? "text-success" : "text-secondary"}>
            {isPublic ? "Public" : "Private"}
          </span>
        </small>
        {createdBy === currentUser?.uid && (
          <button className="btn btn-sm btn-outline-primary" onClick={() => onShare(idx)}>
            Share
          </button>
        )}
      </div>
      <div className="card-body">
        <h5>{title}</h5>
        <p><em>{categoryType}</em></p>
        <div id={holder.current}></div>
        {sharedWith?.length > 0 && (
          <div className="mt-2">
            <small>Shared with: {sharedWith.join(", ")}</small>
          </div>
        )}
        <div id={`editorjs-${idx}`}></div>
        <button className="btn btn-sm btn-warning me-2" onClick={() => onEdit(idx)}>Edit</button>
        <button className="btn btn-sm btn-danger" onClick={() => onDelete(idx)}>Delete</button>
      </div>

      {sharedWith?.map(uid => (
        <button
            key={uid}
            onClick={() => handleRevoke(uid)}
            hidden={createdBy !== currentUser.uid}
            className="btn btn-sm btn-outline-danger m-1"
        >
            Revoke {uid}
        </button>
      ))}

    </div>

    

  );
}

export default NewCard;
