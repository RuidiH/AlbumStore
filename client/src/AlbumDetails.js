import React, { useState, useEffect } from 'react';

function AlbumDetails({ album, onClose, onUpdateAlbum }) {
  const [tracks, setTracks] = useState([]);
  const [newTrack, setNewTrack] = useState('');
  const [likes, setLikes] = useState(album.like_count || 0);
  const [dislikes, setDislikes] = useState(album.dislike_count || 0);
  const [thumbnailFile, setThumbnailFile] = useState(null);

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
        onUpdateAlbum({ ...album, like_count: data.like_count });
      })
      .catch((err) => console.error(err));
  };

  const handleDislike = () => {
    fetch(`http://localhost:3001/albums/${album.album_id}/dislike`, { method: 'POST' })
      .then((response) => response.json())
      .then((data) => {
        setDislikes(data.dislike_count);
        onUpdateAlbum({ ...album, dislike_count: data.dislike_count });
      })
      .catch((err) => console.error(err));
  };

  // Handle file selection for thumbnail upload
  const handleThumbnailFileChange = (e) => {
    setThumbnailFile(e.target.files[0]);
  };

  // Upload the selected file to S3 via our /upload endpoint,
  // then update the album's thumbnail_url via the update album endpoint.
  const handleUploadThumbnail = async () => {
    if (!thumbnailFile) {
      alert("Please select a file first.");
      return;
    }
    const formData = new FormData();
    formData.append("image", thumbnailFile);
    
    try {
      // Upload file to S3 using the /upload endpoint
      const uploadResponse = await fetch("http://localhost:3001/upload", {
        method: "POST",
        body: formData,
      });
      const uploadData = await uploadResponse.json();

      // Assume uploadData.data.Location holds the URL of the uploaded image.
      const newThumbnailUrl = uploadData.data.Location;
      
      // Update the album's record (thumbnail_url) via the PUT endpoint
      const updateResponse = await fetch(`http://localhost:3001/albums/${album.album_id}/thumbnail`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ thumbnail_url: newThumbnailUrl }),
      });
      const updatedAlbum = await updateResponse.json();

      // Propagate the updated album to the parent state
      onUpdateAlbum(updatedAlbum);
      alert("Thumbnail updated successfully!");
    } catch (err) {
      console.error(err);
      alert("Error updating thumbnail.");
    }
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
      <img
        src={album.thumbnail_url || 'https://via.placeholder.com/150'}
        alt={album.title}
        style={{ width: '150px', height: '150px', objectFit: 'cover' }}
      />
      <p>Likes: {likes}</p>
      <p>Dislikes: {dislikes}</p>
      <button onClick={handleLike}>Like</button>
      <button onClick={handleDislike}>Dislike</button>
      
      <h3>Update Thumbnail</h3>
      <input type="file" onChange={handleThumbnailFileChange} />
      <button onClick={handleUploadThumbnail}>Upload Thumbnail</button>

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