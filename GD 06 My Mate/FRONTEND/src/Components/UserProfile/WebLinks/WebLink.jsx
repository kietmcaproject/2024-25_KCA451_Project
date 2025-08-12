import React, { useState } from 'react';
import axios from 'axios';
import './WebLinks.css';

const WebLinks = ({ weblinks = [], userId }) => {
  const [name, setName] = useState('');
  const [url, setUrl] = useState('');
  const [links, setLinks] = useState(weblinks);

  const handleAddLink = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('authToken'); // or from cookies if using cookies
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/user/add-web-links`,
        { name, url },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );
      setLinks(res.data.updatedUser.weblinks);
      setName('');
      setUrl('');
    } catch (error) {
      console.error('Error adding link:', error);
    }
  };

  return (
    <div className="weblinks">
      <h2>Web Links</h2>

      <form onSubmit={handleAddLink} className="weblinks-form">
        <input
          type="text"
          placeholder="Resource Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="weblinks-input"
        />
        <input
          type="url"
          placeholder="https://example.com"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          required
          className="weblinks-input"
        />
        <button type="submit" className="weblinks-button">Add Link</button>
      </form>

      {links.length > 0 ? (
        <div className="links-container">
          {links.map((link) => (
            <div key={link._id} className="weblink">
              <a href={link.url} target="_blank" rel="noopener noreferrer">
                {link.name}
              </a>
            </div>
          ))}
        </div>
      ) : (
        <p>No web links available.</p>
      )}
    </div>
  );
};

export default WebLinks;
