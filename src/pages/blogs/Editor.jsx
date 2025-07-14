import React, { useEffect, useRef } from "react";
import EditorJS from "@editorjs/editorjs";
import Header from "@editorjs/header";
import List from "@editorjs/list";
import Checklist from "@editorjs/checklist";
import ImageTool from "@editorjs/image";
import Quote from "@editorjs/quote";
import Warning from "@editorjs/warning";
import Marker from "@editorjs/marker";
import Delimiter from "@editorjs/delimiter";
import InlineCode from "@editorjs/inline-code";

const Editor = ({ data, onChange, editorBlock }) => {
  const ejInstance = useRef();

  useEffect(() => {
    if (!ejInstance.current) {
      initEditor();
    }
    return () => {
      ejInstance.current?.destroy();
      ejInstance.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const initEditor = () => {
    const editor = new EditorJS({
      holder: editorBlock || "editorjs",
      onReady: () => {
        ejInstance.current = editor;
      },
      onChange: async () => {
        let content = await editor.saver.save();
        onChange(content);
      },
      data,
      autofocus: true,
      tools: {
        header: Header,
        list: List,
        checklist: Checklist,
        quote: Quote,
        warning: Warning,
        marker: Marker,
        delimiter: Delimiter,
        inlineCode: InlineCode,
        image: {
          class: ImageTool,
          config: {
            endpoints: {
              byFile: "http://localhost:8008/uploadFile", // your file upload endpoint
              byUrl: "http://localhost:8008/fetchUrl", // your URL upload endpoint
            },
          },
        },
      },
    });
  };

  return <div id={editorBlock || "editorjs"}></div>;
};

export default Editor;
