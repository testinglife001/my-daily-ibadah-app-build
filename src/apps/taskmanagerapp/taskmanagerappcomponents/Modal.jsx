const Modal = ({ show, onClose, children }) => {
  if (!show) return null;
  return (
    <div style={{ position: 'fixed', top: 0, left: 0, background: '#000000aa', width: '100%', height: '100%' }}>
      <div style={{ background: '#fff', margin: '10% auto', padding: '1rem', maxWidth: '500px' }}>
        <button onClick={onClose}>Close</button>
        {children}
      </div>
    </div>
  );
};

export default Modal;
