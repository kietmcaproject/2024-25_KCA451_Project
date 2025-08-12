// import React, { useState } from 'react';
// import { IoClose } from "react-icons/io5";
// import { Link, useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import toast from 'react-hot-toast';
// import './RegisterPage.css'; // Make sure to import the CSS

// const RegisterPage = () => {
//   const [data, setData] = useState({
//     name: "",
//     email: "",
//     password: "",
//     profile_pic: ""
//   });
//   const [uploadPhoto, setUploadPhoto] = useState(null);
//   const navigate = useNavigate();

//   const handleOnChange = (e) => {
//     const { name, value } = e.target;
//     setData((prev) => ({
//       ...prev,
//       [name]: value
//     }));
//   };

//   const handleUploadPhoto = async (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       setUploadPhoto(file); // Display file name in UI
//     }
//   };

//   const handleClearUploadPhoto = (e) => {
//     e.stopPropagation();
//     e.preventDefault();
//     setUploadPhoto(null);
//     setData((prev) => ({
//       ...prev,
//       profile_pic: ""
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     const formData = new FormData();
//     formData.append("name", data.name);
//     formData.append("email", data.email);
//     formData.append("password", data.password);
//     if (uploadPhoto) {
//       formData.append("profile_pic", uploadPhoto);
//     }

//     const URL = `${process.env.REACT_APP_BACKEND_URL}/api/register`;

//     try {
//       const response = await axios.post(URL, formData, {
//         headers: {
//           "Content-Type": "multipart/form-data"
//         }
//       });

//       if (response.data.success) {
//         toast.success(response.data.message);
//         setData({
//           name: "",
//           email: "",
//           password: "",
//           profile_pic: ""
//         });
//         setUploadPhoto(null);
//         navigate('/email');
//       } else {
//         toast.error(response.data.message);
//       }
//     } catch (error) {
//       toast.error(error.response?.data?.message || "Error registering user");
//     }
//   };

//   return (
//     <div className='register-container'>
//       <div className='bg-card w-full max-w-md rounded overflow-hidden p-4 mx-auto'>
//         <h3 className='text-center text-2xl mb-4'>Welcome to Chat App!</h3>
//         <form className='grid gap-4 mt-5' onSubmit={handleSubmit}>
//           <div className='flex flex-col gap-1'>
//             <label htmlFor='name'>Name :</label>
//             <input
//               type='text'
//               id='name'
//               name='name'
//               placeholder='Enter your name'
//               className='input-field'
//               value={data.name}
//               onChange={handleOnChange}
//               required
//             />
//           </div>
//           <div className='flex flex-col gap-1'>
//             <label htmlFor='email'>Email :</label>
//             <input
//               type='email'
//               id='email'
//               name='email'
//               placeholder='Enter your email'
//               className='input-field'
//               value={data.email}
//               onChange={handleOnChange}
//               required
//             />
//           </div>
//           <div className='flex flex-col gap-1'>
//             <label htmlFor='password'>Password :</label>
//             <input
//               type='password'
//               id='password'
//               name='password'
//               placeholder='Enter your password'
//               className='input-field'
//               value={data.password}
//               onChange={handleOnChange}
//               required
//             />
//           </div>

//           <div className='flex flex-col gap-1'>
//             <label htmlFor='profile_pic'>Photo:</label>
//             <div
//               onClick={() => document.getElementById('profile_pic').click()}
//               className='h-14 bg-slate-200 flex justify-center items-center border rounded hover:border-primary cursor-pointer profile-upload'
//             >
//               <p className='text-sm max-w-[300px] text-ellipsis line-clamp-1'>
//                 {uploadPhoto?.name || "Upload profile photo"}
//               </p>
//               {uploadPhoto && (
//                 <button className='text-lg ml-2 hover:text-red-600' onClick={handleClearUploadPhoto}>
//                   <IoClose />
//                 </button>
//               )}
//             </div>
//             <input
//               type='file'
//               id='profile_pic'
//               name='profile_pic'
//               className='hidden'
//               onChange={handleUploadPhoto}
//             />
//           </div>

//           <button className='btn-submit'>Register</button>
//         </form>
//         <p className='my-3 text-center'>
//           Already have an account? <Link to={"/email"} className='link-login'>Login</Link>
//         </p>
//       </div>
//     </div>
//   );
// };

// export default RegisterPage;


import React, { useState } from 'react';
import { IoClose } from "react-icons/io5";
import { FcGoogle } from "react-icons/fc";
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import './RegisterPage.css'; // Make sure this exists for styling

const RegisterPage = () => {
  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
    profile_pic: ""
  });
  const [uploadPhoto, setUploadPhoto] = useState(null);
  const navigate = useNavigate();

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleUploadPhoto = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploadPhoto(file);
    }
  };

  const handleClearUploadPhoto = (e) => {
    e.stopPropagation();
    e.preventDefault();
    setUploadPhoto(null);
    setData((prev) => ({
      ...prev,
      profile_pic: ""
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("email", data.email);
    formData.append("password", data.password);
    if (uploadPhoto) {
      formData.append("profile_pic", uploadPhoto);
    }

    const URL = `${process.env.REACT_APP_BACKEND_URL}/api/register`;

    try {
      const response = await axios.post(URL, formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });

      if (response.data.success) {
        toast.success(response.data.message);
        setData({
          name: "",
          email: "",
          password: "",
          profile_pic: ""
        });
        setUploadPhoto(null);
        navigate('/dashboard');
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Error registering user");
    }
  };

  return (
    <div className='register-container'>
      <div className='bg-white w-full max-w-md rounded-lg shadow-md overflow-hidden p-6 mx-auto mt-8'>
        <h3 className='text-center text-2xl font-semibold mb-4'>Welcome to Chat App!</h3>
        <form className='grid gap-4 mt-5' onSubmit={handleSubmit}>
          <div className='flex flex-col gap-1'>
            <label htmlFor='name'>Name :</label>
            <input
              type='text'
              id='name'
              name='name'
              placeholder='Enter your name'
              className='input-field'
              value={data.name}
              onChange={handleOnChange}
              required
            />
          </div>
          <div className='flex flex-col gap-1'>
            <label htmlFor='email'>Email :</label>
            <input
              type='email'
              id='email'
              name='email'
              placeholder='Enter your email'
              className='input-field'
              value={data.email}
              onChange={handleOnChange}
              required
            />
          </div>
          <div className='flex flex-col gap-1'>
            <label htmlFor='password'>Password :</label>
            <input
              type='password'
              id='password'
              name='password'
              placeholder='Enter your password'
              className='input-field'
              value={data.password}
              onChange={handleOnChange}
              required
            />
          </div>

          <div className='flex flex-col gap-1'>
            <label htmlFor='profile_pic'>Photo:</label>
            <div
              onClick={() => document.getElementById('profile_pic').click()}
              className='h-14 bg-gray-100 flex justify-center items-center border rounded hover:border-blue-500 cursor-pointer px-2'
            >
              <p className='text-sm max-w-[250px] truncate'>
                {uploadPhoto?.name || "Upload profile photo"}
              </p>
              {uploadPhoto && (
                <button className='text-lg ml-2 hover:text-red-600' onClick={handleClearUploadPhoto}>
                  <IoClose />
                </button>
              )}
            </div>
            <input
              type='file'
              id='profile_pic'
              name='profile_pic'
              className='hidden'
              accept="image/*"
              onChange={handleUploadPhoto}
            />
          </div>

          <button type="submit" className='btn-submit'>Register</button>
        </form>

        {/* Divider */}
        <div className='google-oauth-wrapper mt-5 text-center'>
          <p className='text-gray-500 mb-2'>or</p>
          <a
            href={`${process.env.REACT_APP_BACKEND_URL}/auth/google`}
            className='flex items-center justify-center gap-2 border px-4 py-2 rounded hover:bg-gray-100 transition-all'
          >
            <FcGoogle size={20} />
            Sign up with Google
          </a>
        </div>

        <p className='my-4 text-center text-sm'>
          Already have an account? <Link to={"/email"} className='text-blue-500 hover:underline'>Login</Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
