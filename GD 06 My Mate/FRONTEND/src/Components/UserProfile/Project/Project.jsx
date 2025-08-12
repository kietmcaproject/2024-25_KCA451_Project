import React, { useState, useEffect } from 'react';
import './Projects.css';

const Project = () => {
  const [formData, setFormData] = useState({
    name: '',
    url: '',
    technologies: '',
    teamMembers: '',
    description: '',
  });

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const authToken = localStorage.getItem("authToken");
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/user/get-projects/${userId}`, {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });

        const data = await response.json();

        if (response.ok) {
          setProjects(data.projects || []);
        } else {
          setError(data.message || "Failed to fetch projects");
        }
      } catch (error) {
        setError("Error fetching projects");
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [userId, authToken]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newProject = {
      ...formData,
      technologies: formData.technologies.split(',').map((t) => t.trim()),
      teamMembers: formData.teamMembers.split(',').map((m) => m.trim()),
    };

    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/user/add-project`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify(newProject),
      });

      const data = await response.json();

      if (response.ok) {
        setProjects((prev) => [...prev, data.project]);
        setFormData({
          name: '',
          url: '',
          technologies: '',
          teamMembers: '',
          description: '',
        });
      } else {
        alert(data.message || "Failed to add project");
      }
    } catch (error) {
      alert("Error adding project");
    }
  };

  return (
    <div className="projects-container">
      <h2>Projects</h2>

      <form onSubmit={handleSubmit} className="project-form">
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Project Name"
          className="project-input"
          required
        />
        <input
          type="url"
          name="url"
          value={formData.url}
          onChange={handleChange}
          placeholder="Project URL"
          className="project-input"
        />
        <input
          type="text"
          name="technologies"
          value={formData.technologies}
          onChange={handleChange}
          placeholder="Technologies (comma separated)"
          className="project-input"
        />
        <input
          type="text"
          name="teamMembers"
          value={formData.teamMembers}
          onChange={handleChange}
          placeholder="Team Members (comma separated)"
          className="project-input"
        />
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Project Description"
          className="project-textarea"
        />
        <button type="submit" className="project-button">
          Add Project
        </button>
      </form>

      {loading ? (
        <p>Loading projects...</p>
      ) : error ? (
        <p className="error">{error}</p>
      ) : (
        <div className="project-list">
          {projects.length > 0 ? (
            projects.map((project) => (
              <div key={project._id || project.name} className="project">
                <h3>{project.name}</h3>
                {project.url && (
                  <p>
                    <strong>URL:</strong>{' '}
                    <a href={project.url} target="_blank" rel="noopener noreferrer">
                      {project.url}
                    </a>
                  </p>
                )}
                <p>
                  <strong>Technologies:</strong> {(project.technologies || []).join(', ')}
                </p>
                <p>
                  <strong>Team Members:</strong> {(project.teamMembers || []).join(', ')}
                </p>
                <p>
                  <strong>Description:</strong> {project.description}
                </p>
              </div>
            ))
          ) : (
            <p>No projects available.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Project;
