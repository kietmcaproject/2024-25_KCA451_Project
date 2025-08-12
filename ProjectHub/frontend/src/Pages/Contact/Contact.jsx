import React from 'react'
  import  { useState } from 'react';  
  import { Mail, Linkedin, ChevronLeft, ChevronRight } from 'lucide-react';
  
  const ProfileCard = () => {
    const [isHovered, setIsHovered] = useState(false);
    
    return (
      <div
        className="relative min-w-[280px] bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 mx-4 
          border border-white/10 transform transition-all duration-300 hover:scale-105"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Glowing effect */}
        <div
          className="absolute inset-0 rounded-xl opacity-0 transition-opacity duration-300 -z-10"
          style={{
            background: 'radial-gradient(circle at center, #4F46E5, #2563EB)',
            filter: 'blur(20px)',
            opacity: isHovered ? 0.15 : 0
          }}
        />
        
        {/* Profile Image */}
        <div className="relative w-24 h-24 mx-auto mb-4">
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 animate-gradient p-0.5">
            <div className="rounded-full p-0.5 bg-slate-800 h-full w-full">
              <img
                src={imageUrl || "/api/placeholder/96/96"}
                alt={name}
                className="rounded-full w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
        
        {/* Profile Info */}
        <div className="text-center">
          <h3 className="text-xl font-semibold text-white mb-1">{name}</h3>
          <p className="text-gray-400 mb-4">{role}</p>
          
          {/* Social Links */}
          <div className="flex justify-center space-x-4">
            <a
              href={`mailto:${email}`}
              className="p-2 rounded-full hover:bg-white/10 transition-colors"
            >
              <Mail className="w-5 h-5 text-gray-400 hover:text-blue-400" />
            </a>
            <a
              href={linkedIn}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-full hover:bg-white/10 transition-colors"
            >
              <Linkedin className="w-5 h-5 text-gray-400 hover:text-blue-400" />
            </a>
          </div>
        </div>
      </div>
    );
  };
  
  const Contact = () => {
    const scrollContainer = React.useRef(null);
  
    const scroll = (direction) => {
      const container = scrollContainer.current;
      if (container) {
        const scrollAmount = direction === 'left' ? -300 : 300;
        container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      }
    };
  
    const profiles = [
      {
        name: "Alex Thompson",
        role: "Full Stack Developer",
        email: "alex@example.com",
        linkedIn: "https://linkedin.com/in/alex-thompson"
      },
      {
        name: "Sarah Chen",
        role: "UX Designer",
        email: "sarah@example.com",
        linkedIn: "https://linkedin.com/in/sarah-chen"
      },
      {
        name: "Michael Rodriguez",
        role: "Product Manager",
        email: "michael@example.com",
        linkedIn: "https://linkedin.com/in/michael-rodriguez"
      },
      {
        name: "Emma Wilson",
        role: "DevOps Engineer",
        email: "emma@example.com",
        linkedIn: "https://linkedin.com/in/emma-wilson"
      }
    ];
  
    return (
      <div className="relative max-w-6xl mx-auto px-4 py-12">
        {/* Scroll Buttons */}
        <button
          onClick={() => scroll('left')}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-slate-800/50 
            backdrop-blur-sm border border-white/10 hover:bg-slate-700/50 transition-colors"
        >
          <ChevronLeft className="w-6 h-6 text-white" />
        </button>
        
        <button
          onClick={() => scroll('right')}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-slate-800/50 
            backdrop-blur-sm border border-white/10 hover:bg-slate-700/50 transition-colors"
        >
          <ChevronRight className="w-6 h-6 text-white" />
        </button>
  
        {/* Cards Container */}
        <div
          ref={scrollContainer}
          className="flex overflow-x-auto scrollbar-hide snap-x snap-mandatory gap-4 px-8"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {profiles.map((profile, index) => (
            <div key={index} className="snap-center">
              <ProfileCard {...profile} />
            </div>
          ))}
        </div>
      </div>
    );
  };


export default Contact
