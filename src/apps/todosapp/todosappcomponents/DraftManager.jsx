import React, { useState, useEffect } from 'react';
import { Button, Modal } from 'react-bootstrap';

export default function DraftManager({ draftPrefix }) {
  const [keys, setKeys] = useState([]);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const all = [];
    for (let key in localStorage) {
      if (key.startsWith(draftPrefix)) all.push(key);
    }
    setKeys(all);
  }, [show]);

  const exportDrafts = () => {
    const data = {};
    keys.forEach(k => data[k] = localStorage.getItem(k));
    const blob = new Blob([JSON.stringify(data)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'drafts.json';
    a.click();
  };

  const importDrafts = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const obj = JSON.parse(reader.result);
      Object.entries(obj).forEach(([k,v]) => localStorage.setItem(k,v));
      setKeys(Object.keys(obj));
      alert('Drafts imported!');
    };
    reader.readAsText(file);
  };

  return (
    <>
      <Button variant="outline-secondary" size="sm" onClick={() => setShow(true)}>
        Manage Drafts
      </Button>

      <Modal show={show} onHide={() => setShow(false)}>
        <Modal.Header closeButton><Modal.Title>Draft Manager</Modal.Title></Modal.Header>
        <Modal.Body>
          <div>
            <strong>Available Drafts:</strong>
            <ul>
              {keys.map(k => <li key={k}>{k}</li>)}
            </ul>
          </div>

          <div className="mt-3">
            <Button variant="primary" onClick={exportDrafts}>Export Drafts</Button>{' '}
            <input type="file" accept="application/json" onChange={importDrafts} />
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}
