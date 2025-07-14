// File: src/components/Footer.jsx
const Footer = () => (
  <footer style={{ background: '#333', color: '#fff', textAlign: 'center', padding: '1rem' }}>
    <p>&copy; {new Date().getFullYear()} Task Manager App</p>
  </footer>
);
export default Footer;