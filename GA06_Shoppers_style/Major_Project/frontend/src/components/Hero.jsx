// import React from 'react'
// import { assets } from '../assets/assets'
// import ChatBot from './ChatBot';

// const Hero = () => {
//   return (
//     <div className='flex flex-col sm:flex-row border border-gray-400'>
//       {/* Hero Left Side */}
//       <div className='w-full sm:w-1/2 flex items-center justify-center py-10 sm:py-0'>
//             <div className='text-[#414141]'>
//                 <div className='flex items-center gap-2'>
//                     <p className='w-8 md:w-11 h-[2px] bg-[#414141]'></p>
//                     <p className=' font-medium text-sm md:text-base'>OUR BESTSELLERS</p>
//                 </div>
//                 <h1 className='prata-regular text-3xl sm:py-3 lg:text-5xl leading-relaxed'>Latest Arrivals</h1>
//                 <div className='flex items-center gap-2'>
//                     <p className='font-semibold text-sm md:text-base'>SHOP NOW</p>
//                     <p className='w-8 md:w-11 h-[1px] bg-[#414141]'></p>
//                 </div>
//             </div>
//       </div>
//       {/* Hero Right Side */}
//       <img className='w-full sm:w-1/2' src={assets.hero_img} alt="" />
//       {/* Chat Icon - Fixed on screen */}
//       <img
//         src={assets.chat_bot}
//         alt="Chat Icon"
//         className='fixed bottom-6 right-6 w-14 h-14 cursor-pointer hover:scale-110 transition-transform duration-300 z-50'
        
//       />
//     </div>
//   )
// }

// export default Hero



import React, { useState } from 'react';
import { assets } from '../assets/assets';
import ChatBot from './ChatBot';

const Hero = () => {
  const [showChat, setShowChat] = useState(false);

  return (
    <div className='flex flex-col sm:flex-row border border-gray-400 relative'>
      {/* Hero Left Side */}
      <div className='w-full sm:w-1/2 flex items-center justify-center py-10 sm:py-0'>
        <div className='text-[#414141]'>
          <div className='flex items-center gap-2'>
            <p className='w-8 md:w-11 h-[2px] bg-[#414141]'></p>
            <p className='font-medium text-sm md:text-base'>OUR BESTSELLERS</p>
          </div>
          <h1 className='prata-regular text-3xl sm:py-3 lg:text-5xl leading-relaxed'>Latest Arrivals</h1>
          <div className='flex items-center gap-2'>
            <p className='font-semibold text-sm md:text-base'>SHOP NOW</p>
            <p className='w-8 md:w-11 h-[1px] bg-[#414141]'></p>
          </div>
        </div>
      </div>

      {/* Hero Right Side */}
      <img className='w-full sm:w-1/2' src={assets.hero_img} alt="" />

      {/* Chat Icon */}
      <img
        src={assets.chat_bot}
        alt="Chat Icon"
        className='fixed bottom-6 right-6 w-14 h-14 cursor-pointer hover:scale-110 transition-transform duration-300 z-50'
        onClick={() => setShowChat(!showChat)}
      />

      {/* Chat Bot Component */}
      {showChat && <ChatBot onClose={() => setShowChat(false)} />}
    </div>
  );
};

export default Hero;
