import React from 'react';

const parseEditorJS = (blocks) => {
  return blocks.map((block, i) => {
    switch (block.type) {
      case 'paragraph':
        return <p key={i}>{block.data.text}</p>;
      case 'header':
        const Tag = `h${block.data.level}`;
        return <Tag key={i}>{block.data.text}</Tag>;
      case 'list':
        const ListTag = block.data.style === 'ordered' ? 'ol' : 'ul';
        return (
          <ListTag key={i}>
            {block.data.items.map((item, j) => <li key={j}>{item}</li>)}
          </ListTag>
        );
      case 'image':
        return (
          <img
            key={i}
            src={block.data.file?.url}
            alt={block.data.caption || ''}
            className="img-fluid mb-3"
          />
        );
      case 'quote':
        return <blockquote key={i}>{block.data.text}</blockquote>;
      default:
        return null;
    }
  });
};

export default parseEditorJS;
