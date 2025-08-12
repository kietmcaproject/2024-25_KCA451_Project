import React, { useEffect } from "react";
import { Briefcase, Users, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const LandingPage = () => {

  const navigate = useNavigate();
  useEffect(()=>{
    const user = localStorage.getItem("user");
    if(user){
      navigate("/");
    }
  },[])


  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      {/* Header */}
      <header className="container mx-auto px-4 py-6 flex justify-between items-center">
        <div className="text-2xl font-bold">Workers Connect</div>
        <nav>
          <ul className="flex space-x-4">
            <li>
              <Link to="/signup" className="hover:text-blue-400">
                Register
              </Link>
            </li>
            <li>
              <Link to="/auth/login" className="hover:text-blue-400">
                Login
              </Link>
            </li>
            <li>
              <a href="#" className="hover:text-blue-400">
                About
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-blue-400">
                Contact
              </a>
            </li>
          </ul>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-5xl font-bold mb-6">
          Connect with Skilled Professionals
        </h1>
        <p className="text-xl mb-8">
          Find reliable blue-collar workers for your projects or offer your
          services to those in need.
        </p>
        <div className="space-x-4">
          <button className="bg-blue-500 text-white py-2 px-4 rounded">
            <Link to="/signup">Hire a Professional</Link>
          </button>
          <button className="bg-blue-500 text-white py-2 px-4 rounded">
            <Link to="/signup">Hire a Professional</Link>
          </button>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <Briefcase className="mx-auto h-12 w-12 text-blue-400 mb-4" />
            <h2 className="text-2xl font-semibold mb-2">
              Wide Range of Services
            </h2>
            <p>From plumbing to carpentry, find professionals for any job.</p>
          </div>
          <div className="text-center">
            <Users className="mx-auto h-12 w-12 text-blue-400 mb-4" />
            <h2 className="text-2xl font-semibold mb-2">
              Verified Professionals
            </h2>
            <p>All workers are vetted and verified for your peace of mind.</p>
          </div>
          <div className="text-center">
            <Star className="mx-auto h-12 w-12 text-blue-400 mb-4" />
            <h2 className="text-2xl font-semibold mb-2">Quality Assurance</h2>
            <p>Rate and review services to maintain high standards.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
