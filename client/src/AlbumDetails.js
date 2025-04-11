import React, { useState, useEffect } from 'react';

function AlbumDetails({ album, onClose, onUpdateAlbum }) {
  const [tracks, setTracks] = useState([]);
  const [newTrack, setNewTrack] = useState('');
  const [likes, setLikes] = useState(album.like_count || 0);
  const [dislikes, setDislikes] = useState(album.dislike_count || 0);

  useEffect(() => {
    fetch(`http://localhost:3001/tracks/${album.album_id}`)
      .then((response) => response.json())
      .then((data) => setTracks(data))
      .catch((err) => console.error(err));
  }, [album.album_id]);

  const handleAddTrack = () => {
    fetch(`http://localhost:3001/tracks/${album.album_id}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ youtube_link: newTrack }),
    })
      .then((response) => response.json())
      .then((data) => setTracks((prev) => [...prev, data]))
      .catch((err) => console.error(err));
    setNewTrack('');
  };

  const handleDeleteTrack = (trackId) => {
    fetch(`http://localhost:3001/tracks/${album.album_id}/${trackId}`, {
      method: 'DELETE',
    })
      .then(() => setTracks((prev) => prev.filter((track) => track.track_id !== trackId)))
      .catch((err) => console.error(err));
  };

  const handleLike = () => {
    fetch(`http://localhost:3001/albums/${album.album_id}/like`, { method: 'POST' })
      .then((response) => response.json())
      .then((data) => {
        setLikes(data.like_count);
        onUpdateAlbum({ ...album, likes: data.like_count }); // Update parent state
      })
      .catch((err) => console.error(err));
  };

  const handleDislike = () => {
    fetch(`http://localhost:3001/albums/${album.album_id}/dislike`, { method: 'POST' })
      .then((response) => response.json())
      .then((data) => {
        setDislikes(data.dislike_count);
        onUpdateAlbum({ ...album, dislikes: data.dislike_count}); // Update parent state
      })
      .catch((err) => console.error(err));
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        backgroundColor: 'white',
        padding: '20px',
        border: '1px solid #ccc',
        zIndex: 1000,
      }}
    >
      <h2>{album.title}</h2>
      <p>Likes: {likes}</p>
      <p>Dislikes: {dislikes}</p>
      <button onClick={handleLike}>Like</button>
      <button onClick={handleDislike}>Dislike</button>
      <h3>Tracks</h3>
      <ul>
        {tracks.map((track) => (
          <li key={track.track_id}>
            <a href={track.youtube_link} target="_blank" rel="noopener noreferrer">
              {track.youtube_link}
            </a>
            <button onClick={() => handleDeleteTrack(track.track_id)}>Delete</button>
          </li>
        ))}
      </ul>
      <input
        type="text"
        value={newTrack}
        onChange={(e) => setNewTrack(e.target.value)}
        placeholder="Add YouTube link"
      />
      <button onClick={handleAddTrack}>Add Track</button>
      <button onClick={onClose}>Close</button>
    </div>
  );
}

export default AlbumDetails;