import { Link } from 'react-router-dom';

const TaskCard = ({ task }) => (
  <div style={{ border: '1px solid #ccc', padding: '1rem', marginBottom: '1rem' }}>
    <h4>{task.title}</h4>
    <p>{task.description}</p>
    <Link to={`/task/${task.id}`}>View</Link>
  </div>
);

export default TaskCard;
