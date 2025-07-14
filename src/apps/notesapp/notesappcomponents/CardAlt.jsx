// Card.jsx
import { useState } from "react";
import { Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import Content from "./Content";
import ContentModal from "./ContentModal";
import { auth } from "../../../firebase";

function CardAlt({ title, blocks, categoryType, isPublic, createdBy, createdUsername, idx, onEdit, onDelete, onShare, readonly }) {
  const currentUser = auth.currentUser;
  const isOwner = currentUser?.uid === createdBy;
  const [showModal, setShowModal] = useState(false);

  // Limit preview height/width
  const contentPreviewStyle = {
    maxHeight: "300px",
    maxWidth: "100%",
    overflow: "hidden",
    position: "relative",
  };

  return (
    <>
    <div className="card mb-2 shadow-sm p-2" style={{ minHeight: "300px", maxHeight: "320px" }}>
        <div className="d-flex justify-content-between align-items-center mb-1">
          <small className="text-muted">
            <strong>{createdUsername}</strong> ({createdBy}) •{" "}
            <span className={isPublic ? "text-success" : "text-secondary"}>
              {isPublic ? "Public" : "Private"}
            </span>
          </small>
        </div>

        <h6 className="fw-bold text-truncate" title={title}>
          {title}
        </h6>
        <div className="text-muted small mb-1">Category: {categoryType}</div>

        <div style={contentPreviewStyle}>
          {blocks?.slice(0, 5).map((block, i) => (
            <Content key={i} block={block} />
          ))}
          {blocks?.length > 5 && (
            <div
              className="position-absolute bottom-0 end-0 text-end w-100"
              style={{
                background: "linear-gradient(transparent, white)",
                paddingTop: "20px",
              }}
            >
              <Button
                size="sm"
                variant="link"
                onClick={() => setShowModal(true)}
                className="fw-bold text-primary"
              >
                Read more...
              </Button>
            </div>
          )}
        </div>

        {!readonly && (
          <div className="d-flex flex-wrap mt-2 gap-2">
            {isOwner && (
              <>
                <Button
                  variant="outline-primary"
                  size="sm"
                  onClick={() => onEdit(idx)}
                >
                  <i className="bi bi-pencil me-1"></i>Edit
                </Button>
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
              <button className="btn btn-sm btn-outline-primary" onClick={() => onShare(idx)}>Share</button>
             )}

            <Link
              to={`/view-notes/${idx}`}
              className="btn btn-outline-info btn-sm"
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
         )}

    </div>

    <ContentModal
        show={showModal}
        handleClose={() => setShowModal(false)}
        title={title}
        blocks={blocks}
        idx={idx}
        onEdit={onEdit}
      />
    </>
  );
}

export default CardAlt;

/*
import { useState } from "react";
import { Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import Content from "./Content";
import ContentModal from "./ContentModal";
import { auth } from "../../../firebase";

function CardAlt({
  idx,
  id,
  title,
  blocks,
  categoryType,
  isPublic,
  createdBy,
  createdUsername,
  onEdit,
  onDelete,
  onCopyToDashboard,
}) {
  const [showModal, setShowModal] = useState(false);
  const currentUser = auth.currentUser;
  const isOwner = currentUser?.uid === createdBy;

  // Limit preview height/width
  const contentPreviewStyle = {
    maxHeight: "300px",
    maxWidth: "100%",
    overflow: "hidden",
    position: "relative",
  };

  return (
    <>
      <div className="card mb-2 shadow-sm p-2" style={{ minHeight: "300px", maxHeight: "320px" }}>
        <div className="d-flex justify-content-between align-items-center mb-1">
          <small className="text-muted">
            <strong>{createdUsername}</strong> ({createdBy}) •{" "}
            <span className={isPublic ? "text-success" : "text-secondary"}>
              {isPublic ? "Public" : "Private"}
            </span>
          </small>
        </div>

        <h6 className="fw-bold text-truncate" title={title}>
          {title}
        </h6>
        <div className="text-muted small mb-1">Category: {categoryType}</div>

        <div style={contentPreviewStyle}>
          {blocks?.slice(0, 5).map((block, i) => (
            <Content key={i} block={block} />
          ))}
          {blocks?.length > 5 && (
            <div
              className="position-absolute bottom-0 end-0 text-end w-100"
              style={{
                background: "linear-gradient(transparent, white)",
                paddingTop: "20px",
              }}
            >
              <Button
                size="sm"
                variant="link"
                onClick={() => setShowModal(true)}
                className="fw-bold text-primary"
              >
                Read more...
              </Button>
            </div>
          )}
        </div>

        <div className="d-flex flex-wrap mt-2 gap-2">
          {isOwner && (
            <>
              <Button
                variant="outline-primary"
                size="sm"
                onClick={() => onEdit(idx)}
              >
                <i className="bi bi-pencil me-1"></i>Edit
              </Button>
              <Button
                variant="outline-danger"
                size="sm"
                onClick={() => onDelete(idx)}
              >
                <i className="bi bi-trash me-1"></i>Delete
              </Button>
            </>
          )}

          <Link
            to={`/view-notes/${idx}`}
            className="btn btn-outline-info btn-sm"
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

      <ContentModal
        show={showModal}
        handleClose={() => setShowModal(false)}
        title={title}
        blocks={blocks}
        idx={idx}
        onEdit={onEdit}
      />
    </>
  );
}

export default CardAlt;
*/

