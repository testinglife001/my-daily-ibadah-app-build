import React from 'react'
import EditorContextProvider from './notesappcomponents/EditorContext'
import Notes from './notesappcomponents/Notes'
import NotesAlt from './notesappcomponents/NotesAlt'

const NotesAppAlt = ({user}) => {
  return (
    <>
        <EditorContextProvider>
            <NotesAlt user={user} />
        </EditorContextProvider> 
    </>
  )
}

export default NotesAppAlt