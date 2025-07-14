// src/notesappcomponent/EditorContext.jsx

import { createContext, useEffect, useRef } from "react";
import EditorJS from "@editorjs/editorjs";
import Paragraph from "@editorjs/paragraph";
import Header from "@editorjs/header";
import Alert from "editorjs-alert";
import List from "@editorjs/list";
import Embed from "@editorjs/embed";
import Underline from "@editorjs/underline";
import ChangeCase from "editorjs-change-case";
import Strikethrough from "@sotaproject/strikethrough";
import Checklist from "@editorjs/checklist";
import SimpleImage from "@editorjs/simple-image";
import Marker from "@editorjs/marker";
import InlineCode from "@editorjs/inline-code";
import ColorPlugin from "editorjs-text-color-plugin";
import AlignmentBlockTune from "editorjs-text-alignment-blocktune";
import ImageTool from "@editorjs/image";



// Firebase storage

import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../../../firebase";


export const EditorContext = createContext();

function EditorContextProvider(props) {
  

  const editorInstanceRef = useRef(null);

  const initEditor = () => {
     if (editorInstanceRef.current) return; // Prevent multiple instances

     if (!editorInstanceRef.current) {
      const editor = new EditorJS({
        holder: "editorjs",
        placeholder: "Let's take a note!",
        autofocus: true,
        tools: {
          
          textAlignment: {
            class: AlignmentBlockTune,
            config: {
              default: "left",
              blocks: {
                header: "center",
              },
            },
          },
          
          paragraph: {
            class: Paragraph,
            tunes: ["textAlignment"],
          },
          
          header: {
            class: Header,
            inlineToolbar: true,
            tunes: ["textAlignment"],
            config: {
              placeholder: "Enter a Header",
              levels: [1, 2, 3, 4, 5],
              defaultLevel: 2,
            },
          },
          alert: {
            class: Alert,
            config: {
              defaultType: "primary",
              messagePlaceholder: "Enter something",
            },
          },
          list: {
            class: List,
            config: {
              defaultStyle: "unordered",
            },
          },
          checklist: {
            class: Checklist,
          },
          /*
          photo: {
            class: SimpleImage,
            config: {
              uploader: {
                async uploadByFile(file) {
                  const storageRef = ref(storage, `editor_images/${Date.now()}_${file.name}`);
                  await uploadBytes(storageRef, file);
                  const url = await getDownloadURL(storageRef);
                  return {
                    success: 1,
                    file: {
                      url,
                    },
                  };
                },
              },
            },
          },
          */
          // Inside tools
          // photo
          image: {
          class: ImageTool,
          config: {
              uploader: {
              async uploadByFile(file) {
                  const storageRef = ref(storage, `editor_images/${Date.now()}_${file.name}`);
                  await uploadBytes(storageRef, file);
                  const url = await getDownloadURL(storageRef);
                  return {
                  success: 1,
                  file: {
                      url,
                  },
                  };
              },
              async uploadByUrl(url) {
                  return {
                  success: 1,
                  file: {
                      url,
                  },
                  };
              },
              },
          },
          },
          embed: {
            class: Embed,
            config: {
              services: {
                youtube: true,
                codepen: true,
              },
            },
          },
          underline: {
            class: Underline,
          },
          strikethrough: {
            class: Strikethrough,
          },
          Marker: {
            class: Marker,
          },
          inlineCode: {
            class: InlineCode,
          },
          changeCase: {
            class: ChangeCase,
          },
          Color: {
            class: ColorPlugin,
            config: {
              colorCollections: [
                "#EC7878",
                "#9C27B0",
                "#673AB7",
                "#3F51B5",
                "#0070FF",
                "#03A9F4",
                "#00BCD4",
                "#4CAF50",
                "#8BC34A",
                "#CDDC39",
                "#FFF",
              ],
              defaultColor: "#FF1300",
              customPicker: true,
            },
          },
          
        },
      });

      editorInstanceRef.current = editor;
     }
  };

  useEffect(() => {
    
    // initEditor();
    // useEffect(() => {
      if (document.getElementById('editorjs')) {
      initEditor();
     }

    // Cleanup on unmount
    return () => {
      if (editorInstanceRef.current && typeof editorInstanceRef.current.destroy === 'function') {
      //if (editorInstanceRef.current) {
        editorInstanceRef.current.destroy();
        editorInstanceRef.current = null;
      }
    };
  }, []);

  return (
    <EditorContext.Provider value={{ initEditor, editorInstanceRef }}>
      {props.children}
    </EditorContext.Provider>
  );
}

export default EditorContextProvider;
