import toast from 'react-hot-toast';
import { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import Carousel from 'react-bootstrap/Carousel';
import 'bootstrap/dist/css/bootstrap.min.css';
import { MutatingDots } from 'react-loader-spinner'

const HotelBookingPage = ({ isFilterVisible, setFilterVisibility }) => {

    const [roomss, setRoomss] = useState([]);

    const Availableroom = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_HOST}/api/v1/room/roomdetails`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
            });
            const parseRes = await response.json();
            setRoomss(parseRes);
        } catch (error) {
            console.error(error.message);
        }
    };

    useEffect(() => {
        Availableroom();
    }
        , []);


    return (
        <div className="bg-gray-100 min-h-screen flex">
            {/* Leftside Filters */}
            <aside className={`md:w-1/4 p-4  bg-white shadow-md h-full right-0 overflow-y-auto ${isFilterVisible ? 'block' : 'hidden'} md:block fixed md:relative top-0`}>
                <h2 className="text-2xl font-bold mb-4">Filters</h2>
                <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-2">Popular Locations</h3>
                    <input type="text" placeholder="Search.." className="w-full p-2 border border-gray-300 rounded mb-4" />
                    <ul>
                        <li className="mb-2"><a href="#" className="text-blue-600 hover:underline">Muradnagar</a></li>
                        <li className="mb-2"><a href="#" className="text-blue-600 hover:underline">Modinagar</a></li>
                        <li className="mb-2"><a href="#" className="text-blue-600 hover:underline">Paharganj</a></li>
                        <li className="mb-2"><a href="#" className="text-blue-600 hover:underline">Karol Bagh</a></li>
                        <li className="mb-2"><a href="#" className="text-blue-600 hover:underline">Dwarka, New Delhi</a></li>
                        <li className="mb-2"><a href="#" className="text-blue-600 hover:underline">+ View More</a></li>
                    </ul>
                </div>

                <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-2">Price Range</h3>
                    <input type="range" min="500" max="5000" step="100" className="w-full" />
                </div>

                <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-2">Room Type</h3>
                    <div className="flex items-center mb-4">
                        <input type="checkbox" id="boys" checked className="mr-2" />
                        <label htmlFor="boys">Boys</label>
                    </div>
                    <div className="flex items-center mb-4">
                        <input type="checkbox" id="girls" checked className="mr-2" />
                        <label htmlFor="girls">Girls</label>
                    </div>
                    <div className="flex items-center mb-4">
                        <input type="checkbox" id="private" checked className="mr-2" />
                        <label htmlFor="private">Private Room</label>
                    </div>
                    <div className="flex items-center mb-4">
                        <input type="checkbox" id="sharing" checked className="mr-2" />
                        <label htmlFor="sharing">Sharing Room</label>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className=" p-8 md:w-3/4">
                <h1 className="text-3xl font-bold mb-6">Currently Available</h1>
                <div className="flex items-center justify-between mb-6">
                    <button onClick={() => toast.success('features comming soon')} className="bg-blue-500 text-white px-4 py-2 rounded shadow">Map View</button>
                    <div>
                        <label htmlFor="sort" className="mr-2">Sort By</label>
                        <select id="sort" className="p-2 border border-gray-300 rounded">
                            <option value="popularity">Popularity</option>
                            <option value="Latest-listed">Lastest listed</option>
                        </select>
                    </div>
                </div>

                {/* Hotel Listing */}
                {roomss.length == 0 ? <MutatingDots className="text-center"
                    visible={true}
                    height="100"
                    width="100"
                    color="#4fa94d"
                    secondaryColor="#4fa94d"
                    radius="12.5"
                    ariaLabel="mutating-dots-loading"
                    wrapperStyle={{}}
                    wrapperClass=""
                /> : roomss.map((rooms) => {
                    return <div key={rooms._id} className="bg-white p-6 rounded shadow-md mb-6">
                        <div className="flex md:flex-row flex-col">
                            <div className="md:w-1/3 w-full mb-4 md:mb-0">
                                <Carousel>
                                    {rooms.roomPic.map((image, index) => (
                                        <Carousel.Item key={index}>
                                            <img className="d-block w-100 rounded" src={image} alt={`Slide ${index}`} />
                                        </Carousel.Item>
                                    ))}
                                </Carousel>
                            </div>
                            <div className="w-2/3 pl-6">
                                <h2 className="text-2xl font-bold mb-2">{rooms.pgname} {rooms.city}</h2>
                                <div className="flex items-center mb-2">
                                    <span className="text-green-500 font-bold text-lg">{rooms.ratings}.0</span>
                                    <span className="ml-2 text-gray-600">(00{rooms.totalRatings}) - Very Good</span>
                                </div>
                                <div className="flex items-center mb-2 flex-wrap">
                                    <span className="bg-gray-200 text-gray-800 px-2 py-1 rounded mr-2 mb-2">{rooms?.facilities[0]}</span>
                                    {rooms.facilities[1] ? <span className="bg-gray-200 text-gray-800 px-2 py-1 rounded mr-2 mb-2">{rooms?.facilities[1]}</span> : null}
                                    {rooms.facilities[2] ? <span className="bg-gray-200 text-gray-800 px-2 py-1 rounded mr-2 mb-2">{rooms?.facilities[2]}</span> : null}
                                    <span className="bg-gray-200 text-gray-800 px-2 py-1 rounded mb-2">+ {(rooms?.facilities.length) + ' more'}</span>
                                </div>
                                <div className="flex items-center mb-2">
                                    <span className="text-red-500 font-bold">{Math.floor(Math.random() * 5)} people booked this PG recently</span>
                                </div>
                                <div className="flex items-center mb-2">
                                    <span className="text-2xl font-bold text-gray-800">₹{rooms.price}</span>
                                </div>
                                <div className="flex space-x-4 mt-4">
                                    <NavLink to={`/checkout?roomid=${rooms._id}`} className="bg-green-500 text-white px-4 py-2 rounded shadow">Book Now</NavLink>
                                    <NavLink to={`/room/${rooms._id}`} className="bg-gray-500 text-white px-4 py-2 rounded shadow">View Details</NavLink>
                                </div>
                            </div>
                        </div>
                    </div>
                })}
            </main>
        </div>
    );
};

export default HotelBookingPage;