const Sidebar = () => (
  <div>
    <h5>📂 Categories</h5>
    <ul className="list-unstyled">
      <li>Politics</li>
      <li>Sports</li>
      <li>Technology</li>
      <li>Business</li>
    </ul>
    <hr />
    <h5>📎 Tags</h5>
    <span className="badge bg-primary me-1">#breaking</span>
    <span className="badge bg-secondary me-1">#tech</span>
    <span className="badge bg-success">#world</span>
  </div>
);

export default Sidebar;
