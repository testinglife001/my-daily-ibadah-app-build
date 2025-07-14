import React, { useEffect, useRef } from "react";
import EditorJS from "@editorjs/editorjs";
import Paragraph from "@editorjs/paragraph";
import Header from "@editorjs/header";
import List from "@editorjs/list";

const EditorJSRenderer = ({ data }) => {
  const editorRef = useRef();

  useEffect(() => {
    if (!data || !editorRef.current) return;

    const editor = new EditorJS({
      holder: editorRef.current,
      readOnly: true,
      tools: {
        header: Header,
        paragraph: Paragraph,
        list: List,
      },
      data,
    });

    return () => editor.destroy();
  }, [data]);

  return <div id="editorjs-render" ref={editorRef} />;
};

export default EditorJSRenderer;
