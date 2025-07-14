import React from 'react'
import AddNote from './AddNote';
import DisplayNotes from './DisplayNotes';
import { Link } from 'react-router-dom';
import { Button } from 'react-bootstrap';

const DashboardNote = () => {


  return (
    <div>
       <h3> Dashboard Notes</h3>
       <div className="container mt-4">
            
            <div className="d-flex justify-content-between align-items-center mb-3">
            <h3>My Notes App</h3>
            <Link to="/dashboard/add-note">
                <Button variant="primary">+ Add Note</Button>
            </Link>
            </div>
            
       </div>
    </div>
  )
}

export default DashboardNote