import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useParams } from 'react-router-dom';
import axios from 'axios';
import '../src/App.css';

const API_URL = 'https://api.spotify.com/v1';
const CLIENT_ID = "ba3077f8576c44bb8101c8845d59bb07";
const CLIENT_SECRET = "dbe8b4aeada549c6908bd84088a3b60c";

async function getToken() {
  const data = {
    grant_type: 'client_credentials',
    client_id: CLIENT_ID, 
    client_secret: CLIENT_SECRET
  };

  let qsData = [];
  for (let i in data) {
    qsData.push(`${i}=${data[i]}`);
  }
  qsData = qsData.join('&');

  try {
    const resp = await fetch('https://accounts.spotify.com/api/token', {
      method: "POST",
      headers: { "Content-type": "application/x-www-form-urlencoded" },
      body: qsData
    });

    const token = await resp.json();
    return token.access_token;
  } catch (err) {
    console.error(err);
  }
}

const styles = {
  navbar: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    background: '#1DB954',
    padding: '1rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
    zIndex: 1000,
  },
  logo: {
    fontSize: '1.5rem', 
    color: '#fff',
    textDecoration: 'none',
    marginRight: '1rem',
    fontWeight: 'bold',
  },
  searchContainer: {
    display: 'flex',
    alignItems: 'center',
  },
  searchInput: {
    padding: '0.5rem',
    fontSize: '1rem',
    borderRadius: '5px',
    border: 'none',
  },
  button: {
    padding: '0.5rem 1rem',
    fontSize: '1rem',
    background: '#1DB954',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    marginLeft: '0.5rem',
    transition: 'background 0.3s ease',
  },
  
  buttonHover: {
    background: '#177c4b',
  },
  mainContent: {
    textAlign: 'center',
    marginTop: '2rem',
  },
  artistList: {
    listStyle: 'none',
    padding: 0,
    display: 'flex',
    justifyContent: 'center',
    flexWrap: 'wrap',
    margin: 0,
  },
  artistItem: {
    margin: '1rem',
    textAlign: 'center',
    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
    borderRadius: '8px',
    width: '30%',
    overflow: 'hidden',
    transition: 'transform 0.3s ease',
  },
  artistItemHover: {
    transform: 'scale(1.05)',
  },
  artistImage: {
    width: '150px',
    height: '150px',
    objectFit: 'cover',
    borderRadius: '50%',
  },
  albumList: {
    listStyle: 'none',
    padding: 0,
    display: 'flex',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  albumItem: {
    margin: '1rem',
    textAlign: 'center',
    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
    borderRadius: '8px',
    overflow: 'hidden',
    transition: 'transform 0.3s ease',
    width: '30%',
  },
  albumItemHover: {
    transform: 'scale(1.05)',
  },
  albumImage: {
    width: '150px',
    height: '150px',
    objectFit: 'cover',
    borderRadius: '8px',
  },
  trackList: {
    listStyle: 'none',
    padding: 0,
    textAlign: 'left',
    margin: 0,
  },
  trackItem: {
    margin: '0.5rem',
    padding: '1rem',
    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
    borderRadius: '8px',
    overflow: 'hidden',
    transition: 'transform 0.3s ease',
  },
  trackItemHover: {
    transform: 'scale(1.05)',
  },
  imageBelowNavbar: {
    marginTop: '30px',
    textAlign: 'center',
    height: '100%',
    objectFit: 'cover',
  },
  hide: {
    display: 'none',
  },
  image: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  }
};

const Artista = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [artists, setArtists] = useState([]);

  const handleSearch = async () => {
    try {
      const token = await getToken();
      const url = `${API_URL}/search?q=${searchQuery}&type=artist&market=BR`;

      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setArtists(response.data.artists.items);
    } catch (error) {
      console.error('Error searching for artists', error);
    }
  };

  return (
    <div>
      <div style={styles.navbar}>
        <Link to="/" style={styles.logo}>
          Spotify Search
        </Link>
        <div style={styles.searchContainer}>
          <input
            type="text"
            placeholder="Busque o Artista"
            style={styles.searchInput}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button type="button" style={{ ...styles.button, ...styles.buttonHover }} onClick={handleSearch}>
            Buscar
          </button>
        </div>
      </div>

      <div style={artists.length > 0 ? styles.hide : styles.imageBelowNavbar}>
        <img src="https://files.tecnoblog.net/wp-content/uploads/2023/03/spotify-app-feed-edited.jpg" alt="Description" style={styles.image} />
      </div>

      <div style={styles.mainContent}>
        <h2>Artistas</h2>
        <ul style={styles.artistList}>
          {artists.map((artist) => (
            <li key={artist.id} style={styles.artistItem}>
              <Link to={`/artist/${artist.id}`}>
                {artist.images.length > 0 ? (
                  <img
                    src={artist.images[0].url}
                    alt={artist.name}
                    style={styles.artistImage}
                  />
                ) : (
                  <p>No Image Available</p>
                )}
                <p>{artist.name}</p>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

const Infos = () => {
  const { id } = useParams();
  const [albums, setAlbums] = useState([]);

  const fetchAlbums = async () => {
    try {
      const token = await getToken();
      const url = `${API_URL}/artists/${id}/albums`;

      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setAlbums(response.data.items);
    } catch (error) {
      console.error('Error fetching albums', error);
    }
  };

  useEffect(() => {
    fetchAlbums();
  }, [id]);

  return (
    <div style={styles.mainContent}>
      <h2>Álbuns</h2>
      <ul style={styles.albumList}>
        {albums.map((album) => (
          <li key={album.id} style={styles.albumItem}>
            <Link to={`/album/${album.id}`}>
              <img
                src={album.images[0].url}
                alt={album.name}
                style={styles.albumImage}
              />
              <p>{album.name}</p>
              <p>{album.release_date}</p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

const Play = ({ trackUri }) => {
  const handlePlay = () => {
    // Abrir a faixa no aplicativo do Spotify
    window.open(`https://open.spotify.com/track/${trackUri}`, '_blank');
  };

  return (
    <button onClick={handlePlay} style={{ ...styles.button, ...styles.buttonHover }}>
       Ouça no Spotify
    </button>
  );
};

const Infos2 = () => {
  const { id } = useParams();
  const [tracks, setTracks] = useState([]);

  const fetchTracks = async () => {
    try {
      const token = await getToken();
      const url = `${API_URL}/albums/${id}/tracks`;

      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setTracks(response.data.items);
    } catch (error) {
      console.error('Error fetching tracks', error);
    }
  };

  useEffect(() => {
    fetchTracks();
  }, [id]);

  const playPreview = (previewUrl) => {
    const audio = new Audio(previewUrl);
    audio.play();
  };

  return (
    <div style={styles.mainContent}>
      <h2>Músicas</h2>
      <ul style={styles.trackList}>
        {tracks.map((track) => (
          <li key={track.id} style={styles.trackItem}>
            <div>
              <p>{track.track_number}</p>
              <p>{track.name}</p>
              <p>{formatDuration(track.duration_ms)}</p>
              {track.uri && (
                <Play trackUri={track.uri.split(':').pop()} />
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

const App = () => {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<Artista />} />
          <Route path="/artist/:id" element={<Infos />} />
          <Route path="/album/:id" element={<Infos2 />} />
        </Routes>
      </div>
    </Router>
  );
};

const formatDuration = (milliseconds) => {
  const seconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
};

export default App;
