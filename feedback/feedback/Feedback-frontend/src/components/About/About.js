import React from 'react';
import './About.css';

const About = () => {
  return (
    <div className="about-wrapper">
      <section className="about-hero">
        <h1>Welcome to Feedback Loop</h1>
        <p>Your space to share ideas and receive expert suggestions in a collaborative environment.</p>
      </section>

      <section className="about-section">
        <h2>What is Feedback Loop?</h2>
        <p>
          Feedback Loop is an open platform designed for ideators, developers, and problem solvers to share their thoughts
          and receive actionable feedback from experienced professionals. Whether you're building a product, solving a challenge, 
          or just looking for input, this is your go-to community.
        </p>
      </section>

      <section className="about-section">
        <h2>How It Works</h2>
        <ul>
          <li>Create a profile and log in securely.</li>
          <li>Post your idea, issue, or question.</li>
          <li>Experts and users provide suggestions and feedback.</li>
          <li>Engage in real-time discussions and refine your ideas.</li>
        </ul>
      </section>

      <section className="about-section">
        <h2>Our Vision</h2>
        <p>
          To create a thriving ecosystem where knowledge flows freely and every idea gets the support it deserves. 
          We believe in learning through collaboration, and that great things happen when people connect.
        </p>
      </section>

      <section className="about-section tech-stack">
        <h2>Tech Stack</h2>
        <p>
          Built using the MERN stack — <strong>MongoDB</strong>, <strong>Express.js</strong>, <strong>React.js</strong>, and <strong>Node.js</strong> — 
          with secure JWT-based authentication and responsive design principles.
        </p>
      </section>
    </div>
  );
};

export default About;
