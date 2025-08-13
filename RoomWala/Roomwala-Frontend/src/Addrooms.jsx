import { useState } from "react";

const RoomForm = () => {
    const [formData, setFormData] = useState({
        pgname: "",
        address: "",
        city: "",
        state: "",
        pincode: "",
        price: "",
        description: "",
        roomPic: [],
        isVarified: false,
        isAvailable: true,
        facilities: [],
        ratings: 5.0,
        totalRatings: 1,
        booked: 0,
        roomtype: "",
        availablefor: "",
    });
    const [password, setPassword] = useState("");

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        if (name === "facilities") {
            setFormData({
                ...formData,
                [name]: value.split(",").map((item) => item.trim()), // Split and trim values for the facilities array
            });
        }
        else if (name === "roomPic") {
            setFormData({
                ...formData,
                [name]: value.split(",").map((item) => item.trim()), // Split and trim values for the roomPic array
            });
        }

        else {
            setFormData({
                ...formData,
                [name]: type === "checkbox" ? checked : value,
            });
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (password !== "admin@5263") {
            alert("Incorrect password");
            return;
        }
        fetch(`${import.meta.env.VITE_HOST}/api/v1/room/roomdetails`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
        })
            .then((res) => res.json())
            .then((data) => {
                // console.log(data);
                alert("Room added successfully");
            })
            .catch((err) => {
                console.error("Error:", err);
            });

        // console.log("Form Data Submitted:", formData);
        // Add API call logic here
    };

    return (
        <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-4">Add Room</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block font-medium mb-2">PG Name</label>
                    <input
                        type="text"
                        name="pgname"
                        value={formData.pgname}
                        onChange={handleChange}
                        className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        required
                    />
                </div>

                <div>
                    <label className="block font-medium mb-2">Address</label>
                    <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        required
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block font-medium mb-2">City</label>
                        <input
                            type="text"
                            name="city"
                            value={formData.city}
                            onChange={handleChange}
                            className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            required
                        />
                    </div>
                    <div>
                        <label className="block font-medium mb-2">State</label>
                        <input
                            type="text"
                            name="state"
                            value={formData.state}
                            onChange={handleChange}
                            className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            required
                        />
                    </div>
                </div>

                <div>
                    <label className="block font-medium mb-2">Pincode</label>
                    <input
                        type="text"
                        name="pincode"
                        value={formData.pincode}
                        onChange={handleChange}
                        className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>

                <div>
                    <label className="block font-medium mb-2">Price</label>
                    <input
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={handleChange}
                        className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        required
                    />
                </div>

                <div>
                    <label className="block font-medium mb-2">Description</label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        required
                    />
                </div>

                <div>
                    <label className="block font-medium mb-2">Room Pictures (URLs) (comma-separated)</label>
                    <input
                        type="text"
                        name="roomPic"
                        value={formData.roomPic.join(", ")}
                        onChange={handleChange}
                        className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>

                <div>
                    <label className="block font-medium mb-2">Facilities (comma-separated)</label>
                    <input
                        type="text"
                        name="facilities"
                        value={formData.facilities.join(", ")}
                        onChange={handleChange}
                        className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        {/* <label className="block font-medium mb-2">Room Type</label>
                        <input
                            type="text"
                            name="roomtype"
                            value={formData.roomtype}
                            onChange={handleChange}
                            className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            required
                        /> */}
                        <div>
                            <label className="block font-medium mb-2">Room Type</label>
                            <select
                                name="roomtype"
                                value={formData.roomtype}
                                onChange={handleChange}
                                className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                required
                            >
                                <option value="" disabled>
                                    Select an option
                                </option>
                                <option value="Private">Private</option>
                                <option value="Sharing">Sharing</option>
                            </select>
                        </div>

                    </div>
                    <div>
                        {/* <label className="block font-medium mb-2">Available For</label> */}
                        {/* <input
              type="text"
              name="availablefor"
              value={formData.availablefor}
              onChange={handleChange}
              className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
              required
            /> */}
                        <label className="block font-medium mb-2">Available For</label>
                        <select
                            name="availablefor"
                            value={formData.availablefor}
                            onChange={handleChange}
                            className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            required
                        >
                            <option value="" disabled>
                                Select an option
                            </option>
                            <option value="Boys">Boys</option>
                            <option value="Girls">Girls</option>
                            <option value="Both">Both</option>
                        </select>

                    </div>
                </div>

                <div className="flex items-center space-x-4">
                    <label className="flex items-center">
                        <input
                            type="checkbox"
                            name="isVarified"
                            checked={formData.isVarified}
                            onChange={handleChange}
                            className="rounded text-blue-500 focus:ring-blue-500"
                        />
                        <span className="ml-2">Is Verified</span>
                    </label>
                    <label className="flex items-center">
                        <input
                            type="checkbox"
                            name="isAvailable"
                            checked={formData.isAvailable}
                            onChange={handleChange}
                            className="rounded text-blue-500 focus:ring-blue-500"
                        />
                        <span className="ml-2">Is Available</span>
                    </label>
                </div>
                <div>
                    <label className="block font-medium mb-2">enter admin password</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        // value={e.}
                        // onChange={handleChange}
                        className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        required
                    />
                    </div>

                <button
                    type="submit"
                    className="w-full bg-blue-500 text-white font-medium py-2 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                    Submit
                </button>
            </form>
        </div>
    );
};

export default RoomForm;
