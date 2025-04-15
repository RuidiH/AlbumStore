import React, { useState } from 'react';

function CreateAlbum({ onClose, onAlbumCreated }) {
  const [title, setTitle] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title) {
      alert("Please enter a title.");
      return;
    }
    try {
      const response = await fetch('http://localhost:3001/albums', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, thumbnail_url: null }),
      });
      if (!response.ok) {
        throw new Error('Failed to create album');
      }
      const newAlbum = await response.json();
      onAlbumCreated(newAlbum);
      onClose();
    } catch (error) {
      console.error(error);
      alert("Error creating album.");
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      backgroundColor: 'white',
      padding: '20px',
      border: '1px solid #ccc',
      zIndex: 1000,
    }}>
      <h2>Create Album</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="title">Title: </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div style={{ marginTop: '10px' }}>
          <button type="submit">Create</button>
          <button type="button" onClick={onClose} style={{ marginLeft: '10px' }}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default CreateAlbum;