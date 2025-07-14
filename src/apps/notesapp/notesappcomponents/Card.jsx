import { Button } from "react-bootstrap";
import parse from "html-react-parser";
import ContentModal from "./ContentModal";
import Content from "./Content";
import { Link } from "react-router-dom";
import { auth } from "../../../firebase";
import { useState } from "react";

function Card({
  blocks,
  idx,
  title,
  categoryType,
  isPublic,
  createdBy,
  createdUsername,
  onEdit,
  onDelete,
  onShare,
  onCopyToDashboard,
}) {
  // const isOwner = createdBy === currentUser;
  const currentUser = auth.currentUser;
  const isOwner = currentUser && currentUser?.uid === createdBy;
  console.log(idx,title,categoryType,createdBy);
  const [showModal, setShowModal] = useState(false);

    // Limit preview height/width
  const contentPreviewStyle = {
    maxHeight: "300px",
    maxWidth: "70%",
    overflow: "hidden",
    position: "relative",
  };

  return (
    <div className="card mb-3 shadow-sm" style={{ minHeight: "300px", maxHeight: "320px",  }}>
      <div className="card-header py-1 px-2 d-flex justify-content-between align-items-center">
        <small className="text-truncate" style={{ maxWidth: "80%" }}>
          <strong>{createdUsername || "Unknown"}</strong> ({createdBy})
        </small>
        <span className={`badge ${isPublic ? "bg-success" : "bg-secondary"}`}>
          {isPublic ? "Public" : "Private"}
        </span>
      </div>

      <div >
        <h6 className="fw-bold text-truncate" title={title}>
          {title}
        </h6>
        <div className="text-muted small mb-1">Category: {categoryType}</div>

        <div style={contentPreviewStyle} className=" small" >
          {/* blocks && blocks.length > 0 && parse(blocks[0].data.text || "") */}
          <div  style={{ maxHeight: "110px", maxWidth:'90%', overflow: "hidden" }}>
            {blocks?.slice(0, 3).map((block, i) => (
              <Content block={block} key={block.id || i} />
            ))}
            {blocks?.length > 3 && <span className="text-muted">...read more</span>}
          </div>
        </div>

       
          
          <div className="modal-footer">
          
              <div className="d-flex flex-wrap mt-2 gap-2">
                {isOwner && (
                  <>
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-primary"
                      onClick={() => onEdit(idx)}
                      data-bs-toggle="modal"
                      data-bs-target="#editormodal"
                      >
                      <span className="pe-2">Edit</span>
                      <i className="bi bi-pencil"></i>
                    </button>
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => onDelete(idx)}
                    >
                      <i className="bi bi-trash me-1"></i>Delete
                    </Button>
                  </>
                )}
                {isOwner && (
                  <button className="btn btn-sm btn-outline-info" onClick={() => onShare(idx)}>Share</button>
                )}

                <Link
                  to={`/view-notes/${idx}`}
                  className="btn btn-outline-warning btn-sm"
                >
                  <i className="bi bi-eye me-1"></i>View
                </Link>

                {!isOwner && (
                  <Button
                    variant="outline-success"
                    size="sm"
                    onClick={() => onCopyToDashboard?.(idx)}
                  >
                    <i className="bi bi-clipboard-plus me-1"></i>Copy to My Notes
                  </Button>
                )}
              </div>
          
          </div>

      
      </div>
      <ContentModal title={title} blocks={blocks} idx={idx} onEdit={onEdit} />
      

    </div>
  );
}

export default Card;
