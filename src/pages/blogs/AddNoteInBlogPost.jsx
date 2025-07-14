import React from 'react'
import EditorContextProvider from '../../apps/notesapp/notesappcomponents/EditorContext'
import AddNoteBlogPost from './AddNoteBlogPost'
import { useParams } from 'react-router-dom';
import EditNoteInBlogPost from './EditNoteInBlogPost';

const AddNoteInBlogPost = ({user}) => {
    const { id } = useParams();
    // console.log(id);
  return (
    <div>
        <EditorContextProvider>
            <AddNoteBlogPost blogpostId={id} user={user} />
            {/*<EditNoteInBlogPost id={id} user={user} />*/}
        </EditorContextProvider>
    </div>
  )
}

export default AddNoteInBlogPost