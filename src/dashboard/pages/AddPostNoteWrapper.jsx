import React from 'react'
import { useParams } from 'react-router-dom';
import EditorContextProvider from '../../apps/notesapp/notesappcomponents/EditorContext';
import AddPostNote from './AddPostNote';

const AddPostNoteWrapper = ({user}) => {
  
  //const { id: postId, noteId } = useParams();
  const { id } = useParams();
  // if (!id) return <div>Loading...</div>;
  //console.log(id);

    return (
    <div>
    
        <EditorContextProvider>
            <AddPostNote postId={id} user={user} />
        </EditorContextProvider>

    </div>
  )
}

export default AddPostNoteWrapper