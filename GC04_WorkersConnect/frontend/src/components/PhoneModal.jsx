import React from 'react'

const PhoneModal = ({ onClose }) => {
  return (
    <div className='h-screen w-screen fixed top-0 left-0 flex items-center justify-center  bg-opacity-50 z-50'>
      <div className='h-1/2 w-1/2 bg-blue-500 rounded-xl shadow-lg p-4 relative'>
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-white bg-red-500 rounded-full px-3 py-1"
        >
          Close
        </button>
        <h1 className="text-white text-xl">This is my Phone Number : +917986757993 </h1>
      </div>
    </div>
  );
};


export default PhoneModal 
