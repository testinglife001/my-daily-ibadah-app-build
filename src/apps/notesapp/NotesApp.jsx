import React from 'react'
import EditorContextProvider from './notesappcomponents/EditorContext'
import Notes from './notesappcomponents/Notes'

const NotesApp = ({user}) => {
  return (
    <>
        <EditorContextProvider>
            <Notes user={user} />
        </EditorContextProvider> 
    </>
  )
}

export default NotesApp