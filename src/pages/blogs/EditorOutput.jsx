import React from "react";

const EditorOutput = ({ data }) => {
  if (!data || !data.blocks) return null;

  return (
    <div>
      {data.blocks.map((block, index) => {
        switch (block.type) {
          case "header":
            const Tag = `h${block.data.level}`;
            return <Tag key={index}>{block.data.text}</Tag>;
          case "paragraph":
            return <p key={index}>{block.data.text}</p>;
          case "list":
            if (block.data.style === "ordered") {
              return (
                <ol key={index}>
                  {block.data.items.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ol>
              );
            } else {
              return (
                <ul key={index}>
                  {block.data.items.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              );
            }
          case "quote":
            return (
              <blockquote key={index}>
                <p>{block.data.text}</p>
                <footer>— {block.data.caption}</footer>
              </blockquote>
            );
          case "delimiter":
            return <hr key={index} />;
          case "image":
            return (
              <div key={index} className="my-3">
                <img src={block.data.file?.url} alt={block.data.caption || "Image"} className="img-fluid" />
                {block.data.caption && <p className="text-muted">{block.data.caption}</p>}
              </div>
            );
          case "checklist":
            return (
              <div key={index}>
                {block.data.items.map((item, i) => (
                  <div key={i}>
                    <input type="checkbox" disabled checked={item.checked} /> {item.text}
                  </div>
                ))}
              </div>
            );
          case "warning":
            return (
              <div key={index} className="alert alert-warning">
                <strong>Warning:</strong> {block.data.message}
              </div>
            );
          case "inlineCode":
            return (
              <code key={index} style={{ background: "#f1f1f1", padding: "2px 6px", borderRadius: "4px" }}>
                {block.data.text}
              </code>
            );
          case "marker":
            return (
              <span key={index} style={{ backgroundColor: "yellow" }}>
                {block.data.text}
              </span>
            );
          default:
            return null;
        }
      })}
    </div>
  );
};

export default EditorOutput;
