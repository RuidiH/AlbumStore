import React, { useState, useEffect } from 'react';
import AlbumDetails from './AlbumDetails';

function App() {
  const [albums, setAlbums] = useState([]);
  const [selectedAlbum, setSelectedAlbum] = useState(null);

  useEffect(() => {
    fetch('http://localhost:3001/albums')
      .then((response) => response.json())
      .then((data) => {
        // Ensure the response is an array
        setAlbums(Array.isArray(data) ? data : []);
      })
      .catch((err) => {
        console.error(err);
        setAlbums([]); // Fallback to an empty array on error
      });
  }, []);

  const handleAlbumClick = (album) => {
    setSelectedAlbum(album);
  };

  const handleCloseDetails = () => {
    setSelectedAlbum(null);
  };

  const handleUpdateAlbum = (updatedAlbum) => {
    setAlbums((prevAlbums) =>
      prevAlbums.map((album) =>
        album.album_id === updatedAlbum.album_id ? updatedAlbum : album
      )
    );
  };

  return (
    <div>
      <h1>Album Store</h1>
      <button onClick={() => alert('Create Album functionality not implemented yet')}>
        Create Album
      </button>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
        {Array.isArray(albums) && albums.map((album) => (
          <div
            key={album.album_id}
            style={{
              border: '1px solid #ccc',
              padding: '10px',
              width: '200px',
              textAlign: 'center',
            }}
          >
            <img
              src={album.thumbnail_url || 'https://via.placeholder.com/150'}
              alt={album.title}
              style={{ width: '100%', height: '150px', objectFit: 'cover' }}
            />
            <h3>{album.title}</h3>
            <p>Tracks: {album.track_count || 0}</p>
            <button onClick={() => handleAlbumClick(album)}>View Details</button>
          </div>
        ))}
      </div>
      {selectedAlbum && (
        <AlbumDetails
          album={selectedAlbum}
          onClose={handleCloseDetails}
          onUpdateAlbum={handleUpdateAlbum}
        />
      )}
    </div>
  );
}

export default App;
