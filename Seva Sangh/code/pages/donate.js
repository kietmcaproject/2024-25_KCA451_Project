import { useState } from 'react';
import CategoryCard from '../components/CategoryCard';
import styles from '../styles/DonationPage.module.css';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const categories = [
  { title: 'Stationary', img: 'stationary.jpg' },
  { title: 'Clothes', img: 'clothes.jpg' },
  { title: 'Food', img: 'food.jpg' },
  { title: 'Footwear', img: 'footwears.jpg' },
  { title: 'Toys', img: 'toys.jpg' },
  { title: 'Blankets', img: 'blankets.jpg' },
];

export default function DonationPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [donationData, setDonationData] = useState({ item: '', quantity: 0, amount: 0 });
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [address, setAddress] = useState('');
  const [pincode, setPincode] = useState('');
  const [location, setLocation] = useState(null);
  const [error, setError] = useState('');

  const fetchLocation = () => {
    setError('');
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          setLocation({ latitude: lat, longitude: lng });

          try {
            const res = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
            );
            const data = await res.json();

            const fetchedAddress = data.display_name || '';
            const pinMatch = fetchedAddress.match(/\b\d{6}\b/);

            setAddress(fetchedAddress);
            setPincode(pinMatch ? pinMatch[0] : '');
          } catch (err) {
            console.error('Error fetching address:', err);
            setError('Could not fetch address from coordinates.');
          }
        },
        (err) => {
          console.error(err);
          setError('Failed to fetch your location.');
        }
      );
    } else {
      setError('Geolocation is not supported by your browser.');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDonationData({ ...donationData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !donationData.item ||
      !donationData.quantity ||
      !name ||
      !phone ||
      !location ||
      !address ||
      !pincode
    ) {
      setError('Please fill all the fields properly.');
      return;
    }

    const payload = {
      ...donationData,
      name,
      phone,
      message,
      address,
      pincode,
      location,
      amount: donationData.amount || null, // Ensure amount is included or null
    };

    try {
      const response = await fetch('/api/donations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        alert('Donation Successful!');
        setModalOpen(false);
        setDonationData({ item: '', quantity: 0, amount: 0 }); // Reset amount as well
        setName('');
        setPhone('');
        setMessage('');
        setAddress('');
        setPincode('');
        setLocation(null);
        setError('');
      } else {
        const errorData = await response.json();
        alert(errorData.error || 'Failed to Donate');
      }
    } catch (err) {
      console.error(err);
      setError('Something went wrong. Please try again later.');
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen font-sans text-gray-900">
      <header className="bg-blue-600 text-white py-6 shadow-md">
        <Navbar />
      </header>

      <main className={styles.main}>
        <h2 className={styles.heading}>Donate Items</h2>
        <div className={styles.grid}>
          {categories.map((category, index) => (
            <div
              key={index}
              className={styles.card}
              onClick={() => {
                setModalOpen(true);
                setDonationData({ ...donationData, item: category.title });
              }}
            >
              <CategoryCard title={category.title} img={category.img} />
            </div>
          ))}
        </div>

        {modalOpen && (
          <div className={styles['modal-overlay']}>
            <div
              className={`${styles['modal-content']} bg-white p-6 rounded-lg shadow-lg max-w-2xl w-full`}
            >
              <h3 className="text-2xl font-semibold mb-6">
                Donate: {donationData.item}
              </h3>

              <form
                onSubmit={handleSubmit}
                className="grid grid-cols-1 md:grid-cols-2 gap-4"
              >
                <input
                  type="number"
                  name="quantity"
                  value={donationData.quantity}
                  onChange={handleChange}
                  placeholder="Quantity"
                  className="p-2 border rounded w-full"
                  required
                />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your Name"
                  className="p-2 border rounded w-full"
                  required
                />
                <input
                  type="tel"
                  pattern="[0-9]{10}"
                  maxLength={10}
                  placeholder="Phone Number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="p-2 border rounded w-full"
                  required
                />
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Message (optional)"
                  className="p-2 border rounded w-full col-span-1 md:col-span-2 h-20"
                />

                <div className="col-span-1 md:col-span-2">
                  <h4 className="text-lg font-semibold mb-2">
                    Address Details
                  </h4>
                </div>

                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Address"
                  className="p-2 border rounded w-full"
                  required
                />
                <input
                  type="text"
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  placeholder="Pincode"
                  className="p-2 border rounded w-full"
                  required
                />

                <input
                  type="number"
                  name="amount"
                  value={donationData.amount || ''}
                  onChange={handleChange}
                  placeholder="Amount (optional)"
                  className="p-2 border rounded w-full"
                />

                <button
                  type="button"
                  onClick={fetchLocation}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded w-full col-span-1 md:col-span-2 flex items-center justify-center gap-2"
                >
                  📍 Fetch My Location
                </button>

                {error && (
                  <p className="text-red-500 text-sm col-span-2">{error}</p>
                )}

                <div className="flex justify-end space-x-4 col-span-2 mt-4">
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="bg-gray-500 text-white px-4 py-2 rounded"
                  >
                    Close
                  </button>
                  <button
                    type="submit"
                    className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
                  >
                    Donate
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
