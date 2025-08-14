import React from 'react';

const About = () => {
  return (
    <div className="bg-gray-100 py-12 px-6">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-4xl font-bold text-blue-600 mb-4">About CodeCom</h1>
        <p className="text-lg text-gray-700 mb-6">
          CodeCom is more than just a platform—it's a growing community for developers, students,
          and tech enthusiasts to connect, collaborate, and grow together.
        </p>
      </div>

      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 mt-10">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold text-blue-500 mb-2">👥 Join or Create Communities</h2>
          <p className="text-gray-700">
            Whether you're into frontend, backend, AI, or just starting out—CodeCom lets you find
            like-minded learners and pros. Or kick off your own community around a topic you love.
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold text-blue-500 mb-2">💬 Chat & Collaborate</h2>
          <p className="text-gray-700">
            Dive into real-time discussions, ask questions, share resources, or just vibe with
            your squad. CodeCom keeps the dev convo flowing 24/7.
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold text-blue-500 mb-2">🧠 Learn by Doing</h2>
          <p className="text-gray-700">
            Coding is better together. Use our collaborative coding environment to practice, build,
            or debug with others—live.
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold text-blue-500 mb-2">🌍 Built for All Skill Levels</h2>
          <p className="text-gray-700">
            From total beginners to code wizards—CodeCom welcomes everyone. Learn from others, share
            your journey, and level up together.
          </p>
        </div>
      </div>

      <div className="text-center mt-12">
        <p className="text-gray-600">Let’s build, learn, and grow—together.</p>
        <h3 className="text-xl font-semibold text-blue-600 mt-2">Welcome to CodeCom 💻✨</h3>
      </div>
    </div>
  );
};

export default About;
