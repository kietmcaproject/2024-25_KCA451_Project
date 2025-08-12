import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import './Education.css';

const Education = () => {
  const { userId: profileUserId } = useParams();
  const loggedInUserId = localStorage.getItem("userId");
  const authToken = localStorage.getItem("authToken");

  const [education, setEducation] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    institution: "",
    degree: "",
    duration: "",
    grade: "",
    skills: "",
  });

  const isEditable = profileUserId === loggedInUserId || !profileUserId;

  const fetchEducation = async () => {
    try {
      const targetUserId = profileUserId || loggedInUserId;
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/user/get-education/${targetUserId}`,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      setEducation(response.data.education || []);
    } catch (error) {
      console.error("Error fetching education:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEducation();
  }, [profileUserId]);

  const handleAddEducation = async () => {
    const payload = {
      ...form,
      skills: form.skills.split(",").map((skill) => skill.trim()),
    };

    try {
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/user/add-education/${loggedInUserId}`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      setForm({ institution: "", degree: "", duration: "", grade: "", skills: "" });
      setShowForm(false);
      fetchEducation();
    } catch (error) {
      console.error("Error adding education:", error);
    }
  };

  if (loading) return <p className="pf-loading">Loading education...</p>;

  return (
    <div className="pf-user-posts">
      <h2 className="pf-h2">Education Details</h2>

      {education.length > 0 ? (
        education.map((edu) => (
          <div key={edu._id} className="pf-post">
            <div className="pf-post-row">
              <p><strong>Institution:</strong> {edu.institution}</p>
              <p><strong>Course:</strong> {edu.degree}</p>
              <p><strong>Duration:</strong> {edu.duration}</p>
              <p><strong>Grade:</strong> {edu.grade}</p>
              <p><strong>Skills:</strong> {edu.skills?.join(", ")}</p>
            </div>
          </div>
        ))
      ) : (
        <p>No education details available.</p>
      )}

      {showForm && (
        <div className="pf-post">
          <div className="pf-post-content">
            <input
              type="text"
              value={form.institution}
              onChange={(e) => setForm({ ...form, institution: e.target.value })}
              placeholder="Institution"
            />
            <input
              type="text"
              value={form.degree}
              onChange={(e) => setForm({ ...form, degree: e.target.value })}
              placeholder="Degree"
            />
            <input
              type="text"
              value={form.duration}
              onChange={(e) => setForm({ ...form, duration: e.target.value })}
              placeholder="Duration"
            />
            <input
              type="text"
              value={form.grade}
              onChange={(e) => setForm({ ...form, grade: e.target.value })}
              placeholder="Grade"
            />
            <input
              type="text"
              value={form.skills}
              onChange={(e) => setForm({ ...form, skills: e.target.value })}
              placeholder="Skills (comma-separated)"
            />
            <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
              <button onClick={handleAddEducation} className="pf-delete-btn">Save</button>
              <button onClick={() => setShowForm(false)} className="pf-delete-btn" style={{ backgroundColor: "#ccc" }}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {isEditable && !showForm && (
        <div style={{ marginTop: "20px", textAlign: "center" }}>
          <button onClick={() => setShowForm(true)} className="pf-delete-btn">
            Add Education
          </button>
        </div>
      )}
    </div>
  );
};

export default Education;
