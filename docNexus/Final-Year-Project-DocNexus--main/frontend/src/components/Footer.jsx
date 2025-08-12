/* eslint-disable no-unused-vars */
import React from 'react'
import { assets } from '../assets/assets'

const Footer = () => {
  return (
    <div className='md:mx-10'>
        <div className='flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-40 text-sm '>
                {/* Left section */}

                <div>
                    <img className='mb-5 w-40 ' src={assets.logo} alt=''/>
                    <p className='w-full md:w-2/3 text-gray-600 leading-6'>lorejncjb cjhkhfbrc cndbcdc chgbfchcsbhcefgv chfgcdsbchjdfvbc djxensjhe hjkkvhgiutr cefhjkchdjkerh fejkherucbd verkhcghds jbef hfvghcad fkuchduxbdw cdxhgdc w cdxhcgchjkwjhcx duiuregfe xdcuiedwgdusbx diudgcdw</p>
                </div>

                {/* Center section */}

                <div>
                    <p className='text-xl font-medium mb-5 '>COMPANY</p>
                    <ul className='flex flex-col gap-2 text-gray-600 '>
                        <li>Home</li>
                        <li>About us</li>
                        <li>Contact us</li>
                        <li>Privacy policy</li>
                    </ul>
                </div>

                {/* Right section */}

                <div>
                    <p className='text-xl font-medium mb-5 '>GET IN TOUCH</p>
                    <ul className='flex flex-col gap-2 text-gray-600 '>
                        <li>+91-7830468748</li>
                        <li>hg70509@gmail.com</li>
                    </ul>
                </div>
        </div>
        {/* -----  copyright text  -----*/}
        <div>
            <hr/>
            <p className='py-5 text-sm text-center'>Copyright 2025@ DocNexus - All Rights Reserved.</p>
        </div>
    </div>
  )
}

export default Footer