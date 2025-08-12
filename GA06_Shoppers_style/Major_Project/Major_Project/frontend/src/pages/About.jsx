import React from 'react'
import Title from '../components/Title'
import { assets } from '../assets/assets'
import NewsletterBox from '../components/NewsletterBox'

const About = () => {
  return (
    <div>

      <div className='text-2xl text-center pt-8 border-t'>
        <Title text1={'ABOUT'} text2={'US'} />
      </div>

      <div className='my-10 flex flex-col md:flex-row gap-16'>
        <img className='w-full md:max-w-[450px]' src={assets.about_img} alt="" />
        <div className='flex flex-col justify-center gap-6 md:w-2/4 text-gray-600'>
          <p>Shoppers Style is an e-commerce clothing platform founded with a simple mission: to make shopping for clothes online easy, enjoyable, and accessible. We envisioned a space where people could effortlessly discover and purchase their favorite styles—from the comfort of their own homes.</p>
          <p>Since our launch, we’ve been committed to offering a diverse selection of high-quality clothing to suit every style and occasion. Whether you're drawn to everyday casuals, eye-catching trends, or timeless wardrobe staples, Shoppers Style has something for everyone. Our focus is simple: fashion you can trust—stylish, comfortable, and always on point.</p>
          <b className='text-gray-800'>Our Mission</b>
          <p>At Shoppers Style, our mission is to empower customers with choice, convenience, and confidence. We strive to make every shopping experience smooth, enjoyable, and hassle-free—from browsing to checkout. With a curated selection of stylish clothing and a user-friendly platform, we’re here to help you look and feel your best, effortlessly.</p>
        </div>
      </div>

      <div className=' text-xl py-4'>
        <Title text1={'WHY'} text2={'CHOOSE US'} />
      </div>

      <div className='flex flex-col md:flex-row text-sm mb-20'>
        <div className='border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5'>
          <b>Quality Assurance:</b>
          <p className=' text-gray-600'>We carefully choose and check each product to meet high quality standards.</p>
        </div>
        <div className='border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5'>
          <b>Convenience:</b>
          <p className=' text-gray-600'>With our easy-to-use site and smooth ordering, shopping is easier than ever.</p>
        </div>
        <div className='border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5'>
          <b>Exceptional Customer Service:</b>
          <p className=' text-gray-600'>Our friendly team is here to help every step of the way, making sure you’re satisfied.</p>
        </div>
      </div>

      <NewsletterBox />

    </div>
  )
}

export default About
