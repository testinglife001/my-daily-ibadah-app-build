import React from 'react'
import { Link } from 'react-router-dom'

const Apps = () => {
  return (
    <div>
      <ul>
        <li>notes</li>
        <Link to='/dashboard/noteapp' />
        <li>task manager</li>
        <Link to='/dashboard/taskmanagerapp' />
        <li>todoslist</li>
        <Link to='/dashboard/todolistapp' />
        <li>todolistapp</li>
        <Link to='/dashboard/todoslistapp' />
      </ul>
    </div>
  )
}

export default Apps