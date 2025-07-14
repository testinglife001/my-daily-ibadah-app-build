import React, { useState } from 'react';
import { Editor } from 'react-draft-wysiwyg';
import { EditorState, convertFromRaw, convertToRaw } from 'draft-js';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import './DraftEditor.css'; // 👈 custom styles

const DraftEditor = ({ initialRawContent, onChange }) => {
  const [editorState, setEditorState] = useState(() => {
    if (initialRawContent) {
      try {
        const raw = typeof initialRawContent === 'string'
          ? JSON.parse(initialRawContent)
          : initialRawContent;
        const contentState = convertFromRaw(raw);
        return EditorState.createWithContent(contentState);
      } catch (e) {
        console.error('Invalid raw content:', e);
        return EditorState.createEmpty();
      }
    }
    return EditorState.createEmpty();
  });


  const onEditorStateChange = (newState) => {
    setEditorState(newState);
    const content = convertToRaw(newState.getCurrentContent());
   // console.log('Raw Content:', content);
    // if (onChange) onChange(content); // pass content to parent if needed
    if (onChange) onChange(JSON.stringify(content));

  };

  return (
    <div className="editor-container mb-4 shadow-sm rounded">
      <Editor
        editorState={editorState}
        onEditorStateChange={onEditorStateChange}
        wrapperClassName="editor-wrapper"
        editorClassName="editor-main"
        toolbarClassName="editor-toolbar"
        placeholder="বাংলা এবং English টাইপ করুন..."
      />
    </div>
  );
};

export default DraftEditor;
