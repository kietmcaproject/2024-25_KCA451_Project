import React from 'react';

const Testemonials = () => {
  // Mock testimonial data
  const testimonials = [
    {
      id: 1,
      name: "Sarah Johnson",
      role: "Marketing Director",
      company: "TechVision Inc.",
      image: "/api/placeholder/80/80",
      content: "Working with this team has transformed our digital presence completely. The attention to detail and creative solutions they provided exceeded our expectations.",
      rating: 5
    },
    {
      id: 2,
      name: "Michael Chen",
      role: "CEO",
      company: "Innovate Solutions",
      image: "/api/placeholder/80/80",
      content: "I've worked with many agencies over the years, but none have delivered results like this team. Their strategic approach and technical expertise are unmatched in the industry.",
      rating: 5
    },
    {
      id: 3,
      name: "Priya Patel",
      role: "Product Manager",
      company: "NextGen Apps",
      image: "/api/placeholder/80/80",
      content: "The level of communication and transparency throughout our project was refreshing. They didn't just meet our requirements - they helped us refine and improve our vision.",
      rating: 4
    },
    {
      id: 4,
      name: "James Wilson",
      role: "E-commerce Director",
      company: "StyleHub",
      image: "/api/placeholder/80/80",
      content: "Our conversion rates increased by 45% after implementing the recommendations and designs from this amazing team. Worth every penny!",
      rating: 5
    },
    {
      id: 5,
      name: "Elena Rodriguez",
      role: "Startup Founder",
      company: "GreenTech",
      image: "/api/placeholder/80/80",
      content: "As a startup with limited resources, we needed a partner who could maximize our impact. This team delivered beyond our expectations while respecting our budget constraints.",
      rating: 5
    },
    {
      id: 6,
      name: "David Kim",
      role: "CTO",
      company: "DataFlow Systems",
      image: "/api/placeholder/80/80",
      content: "Their technical knowledge is impressive, but what really sets them apart is how they translate complex concepts into practical solutions that drive business growth.",
      rating: 4
    }
  ];

  // Generate stars for ratings
  const renderStars = (rating) => {
    return Array(5).fill(0).map((_, index) => (
      <svg 
        key={index} 
        className={`w-5 h-5 ${index < rating ? 'text-yellow-400' : 'text-gray-400'}`} 
        fill="currentColor" 
        viewBox="0 0 20 20"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ));
  };

  // Wavy divider component
  const WavyDivider = () => (
    <div className="w-full overflow-hidden">
      <svg className="w-full h-16 text-blue-900" viewBox="0 0 1200 120" preserveAspectRatio="none">
        <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" fill="currentColor"></path>
      </svg>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-600 via-slate-700 to-slate-900 text-white">
      {/* Hero Section */}
      <div className="pt-16 pb-24 px-4 md:px-8 text-center">
        <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-teal-300">
          Client Testimonials
        </h1>
        <p className="text-xl md:text-2xl max-w-3xl mx-auto text-blue-200 mb-12">
          Don't just take our word for it. See what our clients have to say about their experience working with us.
        </p>
        <div className="flex justify-center space-x-6">
          <button className="px-8 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 font-medium transition duration-300 shadow-lg hover:shadow-xl">
            Contact Us
          </button>
          <button className="px-8 py-3 rounded-lg bg-transparent border-2 border-blue-400 hover:bg-blue-800 font-medium transition duration-300">
            Our Services
          </button>
        </div>
      </div>

      <WavyDivider />

      {/* Featured Testimonial */}
      <div className="py-16 px-4 md:px-8 bg-slate-700 bg-opacity-70">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-blue-300 mb-4">Featured Testimonial</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-400 to-teal-300 mx-auto"></div>
          </div>
          
          <div className="bg-blue-900 bg-opacity-70 p-8 md:p-12 rounded-2xl shadow-2xl border border-blue-700 backdrop-blur-sm">
            <div className="flex flex-col md:flex-row items-center">
              <div className="md:w-1/3 mb-6 md:mb-0 flex justify-center">
                <div className="relative">
                  <img 
                    src="/api/placeholder/240/240" 
                    alt="CEO Testimonial" 
                    className="rounded-full w-48 h-48 object-cover border-4 border-blue-400"
                  />
                  <div className="absolute -bottom-2 -right-2 bg-blue-600 text-white p-2 rounded-full shadow-lg">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd"></path>
                    </svg>
                  </div>
                </div>
              </div>
              <div className="md:w-2/3 md:pl-8">
                <div className="flex mb-4">
                  {renderStars(5)}
                </div>
                <p className="text-xl md:text-2xl italic mb-6 text-blue-100">
                  "The strategic vision and execution capabilities of this team are extraordinary. They didn't just deliver a website; they delivered a complete digital transformation that has measurably improved our business outcomes across all metrics."
                </p>
                <div>
                  <h4 className="text-xl font-bold text-blue-300">Amanda Torres</h4>
                  <p className="text-blue-400">Chief Digital Officer, Enterprise Solutions Group</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Testimonial Grid */}
      <div className="py-20 px-4 md:px-8 bg-slate-800 bg-opacity-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-blue-300 mb-4">What Our Clients Say</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-400 to-teal-300 mx-auto mb-6"></div>
            <p className="text-lg text-blue-200 max-w-2xl mx-auto">
              We're proud to have worked with amazing clients across various industries. Here's some feedback from our partnerships.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial) => (
              <div 
                key={testimonial.id} 
                className="bg-blue-800 bg-opacity-40 p-6 rounded-xl shadow-lg border border-blue-700 backdrop-blur-sm hover:transform hover:-translate-y-2 transition duration-300"
              >
                <div className="flex items-center mb-4">
                  <img 
                    src={testimonial.image} 
                    alt={testimonial.name} 
                    className="w-12 h-12 rounded-full mr-4 border-2 border-blue-400"
                  />
                  <div>
                    <h4 className="font-bold text-blue-300">{testimonial.name}</h4>
                    <p className="text-sm text-blue-400">{testimonial.role}, {testimonial.company}</p>
                  </div>
                </div>
                <div className="flex mb-4">
                  {renderStars(testimonial.rating)}
                </div>
                <p className="text-blue-100">{testimonial.content}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="py-16 px-4 md:px-8 bg-blue-900 bg-opacity-70 text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-blue-300">Ready to Transform Your Business?</h2>
          <p className="text-xl text-blue-200 mb-8">
            Join our growing list of satisfied clients and experience the difference our services can make for your business.
          </p>
          <button className="px-8 py-4 rounded-lg bg-gradient-to-r from-blue-600 to-teal-500 hover:from-blue-700 hover:to-teal-600 font-bold text-lg transition duration-300 shadow-lg hover:shadow-xl">
            Schedule a Free Consultation
          </button>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-8 px-4 md:px-8 bg-blue-950 text-blue-400">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p className="font-bold text-xl text-blue-300">Company Name</p>
            <p>© 2025 All Rights Reserved</p>
          </div>
          <div className="flex space-x-6">
            <a href="#" className="hover:text-blue-300 transition">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"></path>
              </svg>
            </a>
            <a href="#" className="hover:text-blue-300 transition">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"></path>
              </svg>
            </a>
            <a href="#" className="hover:text-blue-300 transition">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"></path>
              </svg>
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Testemonials;
