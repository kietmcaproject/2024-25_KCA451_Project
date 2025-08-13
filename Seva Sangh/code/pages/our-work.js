import styles from '../styles/OurWork.module.css';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useEffect, useState } from 'react';



export default function OurWork() {
  return (
    <div className="bg-gradient-to-br from-blue-50 to-white min-h-screen font-sans text-gray-900">
      <header className="bg-blue-800 text-white py-5 shadow-lg">
        <Navbar />
      </header>

      <main className="container mx-auto py-16 px-8">
        <h2 className={`${styles.sectionTitle}`}>Our Work</h2>

        <section className="bg-white p-10 rounded-xl shadow-2xl">
          <h3 className={`${styles.subTitle}`}>How We Help</h3>
          <p className={`${styles.description}`}>
            At Seva Sangh, we are committed to making a real difference...
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
            <div className={styles.foodCard}>
              <img src="OurWorkImages/food.jpg" alt="Food Donation"
               style={{ 
                width: '50%', 
                height: 'auto', 
                borderRadius: '1rem', 
                objectFit: 'contain' 
                }}  
                className={styles.cardImage} />
              <h4 className={styles.cardTitle}>Food Distribution</h4>
              <p className={styles.cardText}>We provide essential food items...</p>
            </div>

            <div className={styles.clothesCard}>
              <img src="OurWorkImages/clothes.jpg" alt="Clothes Donation"
              style={{ 
                width: '50%', 
                height: 'auto', 
                borderRadius: '1rem', 
                objectFit: 'contain' 
                }}  
              className={styles.cardImage} />
              <h4 className={styles.cardTitle}>Clothes for the Homeless</h4>
              <p className={styles.cardText}>Warm clothes are distributed...</p>
            </div>

            <div className={styles.toysCard}>
              <img src="OurWorkImages/toys.jpg" alt="Toys Donation"
              style={{ 
                width: '50%', 
                height: 'auto', 
                borderRadius: '1rem', 
                objectFit: 'contain' 
                }}  
              className={styles.cardImage} />
              <h4 className={styles.cardTitle}>Toys for Children</h4>
              <p className={styles.cardText}>We also provide toys...</p>
            </div>
          </div>

          {/* <section className="mt-16">
            <h3 className={`${styles.subTitle}`}>Photo Gallery</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {['/OurWorkImages/blanket.jpeg', '/OurWorkImages/food.jpg', '/OurWorkImages/footwear.jpg', '/OurWorkImages/stationery.jpeg'].map((image, index) => (
                <div key={index} className={styles.galleryCard}>
                  <img src={image} alt="Donation" className={styles.galleryImage} />
                </div>
              ))}
            </div>
          </section> */}
        </section>
      </main>

      <Footer />
    </div>
  );
}
