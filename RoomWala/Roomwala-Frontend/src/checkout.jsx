import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { NavLink, useSearchParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [pincode, setPincode] = useState('');
  const [amount, setAmount] = useState('');
  const [pgName, setPgName] = useState('');
  const [userid, setUserid] = useState('');
  const [loading, setLoading] = useState(false);
  const [orderplaced, setOrderplaced] = useState(false);
  const [qrcodeurl, setQrcodeurl] = useState(null);

  const [searchParams, setSearchParams] = useSearchParams();
  const roomid = searchParams.get('roomid');

  const getUserDetails = async () => {
    if (!localStorage.getItem('token')) {
      toast.error('Please login to continue');
      navigate(`/login?roomid=${roomid}&checkout=true&redirect=checkout`);
      return;
    }
    try {
      const response = await fetch(`${import.meta.env.VITE_HOST}/api/v1/user/userinfo`, {
        method: 'POST',
        headers: { authorization: localStorage.getItem('token') },
      });
      const parseRes = await response.json();
      setEmail(parseRes.email);
      setName(parseRes.name);
      setAddress(parseRes.address);
      setPhone(parseRes.contactNo);
      setPincode(parseRes.pincode);
      setUserid(parseRes._id);
    } catch (error) {
      console.error(error.message);
    }
  };

  const getRoomDetails = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_HOST}/api/v1/room/roomdetails/${roomid}`,
        {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' }
        }
      );
      const parshdata = await response.json();
      setAmount(parshdata.price);
      setPgName(parshdata.pgname + '-' + parshdata.city);
    }
    catch (error) {
      console.error(error.message);
    }
  };

  const generateQr = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_QRSERVER}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ amount: amount,upi_id: "nitishkumar0914@ybl" }),
      });
      const result = await response.json();
      setQrcodeurl(result.qrurl);
      if (result.success) {
        toast.success('QR Generated');
      }
    } catch (error) {
      toast.error('Error during QR generation');
      console.error(error.message);
      setQrcodeurl(`https://roomwala.vercel.app/logo/gpaynitish.jpg`)
    }
  };


  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();
    const formData = { username: name, userid: userid, shippingAddress: address, phoneNumber: phone, totalPrice: amount, orderItems: roomid, orderid: Date.now() };
    try {
      const response = await fetch(`${import.meta.env.VITE_HOST}/api/v1/order/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const result = await response.json();
      if (result.success) {
        setOrderplaced(true);
        toast.success('Checkout successful');
        generateQr();
      }
    } catch (error) {
      toast.error('Error during checkout');
      console.error(error.message);
    }
    setLoading(false);
  };


  useEffect(() => {
    getUserDetails();
    getRoomDetails();
  }, []);

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col items-center justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-2xl">
        <h2 className="text-center text-3xl font-extrabold text-gray-900">Checkout</h2>
      </div>
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-2xl">
        <div className="bg-white py-8 px-6 shadow rounded-lg sm:px-10">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:space-x-6">
              <div className="flex-1 space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700">Address</label>
                  <textarea
                    id="address"
                    name="address"
                    rows="3"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  ></textarea>
                </div>
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone</label>
                  <input
                    id="phone"
                    name="phone"
                    type="text"
                    placeholder="Enter Your 10 Digit Mobile Number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label htmlFor="pincode" className="block text-sm font-medium text-gray-700">Pincode</label>
                  <input
                    id="pincode"
                    name="pincode"
                    type="text"
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>
              </div>
              <div className="flex-1 space-y-6">
                <div>
                  <div className="block text-sm font-medium text-gray-700">Payment Amount:</div>
                  <div className="mt-1 relative rounded-md shadow-sm"><span className='font-bold text-orange-400'>{amount}</span>/- Rupees</div>
                </div>
                <div>
                  <div className="block text-sm font-medium text-gray-700">P.G. Name</div>
                  <div className="mt-1 relative rounded-md shadow-sm"><span className='font-bold text-orange-400'>{pgName}</span></div>
                </div>
                {orderplaced && qrcodeurl && <div>
                  <img src={qrcodeurl} alt='Payment QR Code' />
                  <div className="block text-sm font-medium text-gray-700">Scan this QR to make payment</div>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <span className='font-bold text-orange-400'>Amount: {amount}</span>/- Rupees
                    <img src="/logo/upi-apps.jpg"  className='shadow-sm'/>
                  </div>
                </div>}
              </div>
            </div>
            <div>
              {!loading && !orderplaced && <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Place Order and Generate QR
              </button>}
              {orderplaced && <NavLink to='/orders'
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Mark my Payment as Success
              </NavLink>}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
