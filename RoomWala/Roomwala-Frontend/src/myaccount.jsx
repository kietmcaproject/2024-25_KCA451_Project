import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

const UserProfile = () => {
    const [selectedImage, setSelectedImage] = useState('');
    const [email, setEmail] = useState('');
    const [fullname, setFullname] = useState('');
    const [address, setAddress] = useState('');
    const [phone, setPhone] = useState('');
    const [pincode, setPincode] = useState('');
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const getUserDetails = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_HOST}/api/v1/user/userinfo`, {
                method: 'POST',
                headers: { authorization: localStorage.getItem('token') },
            });
            const parseRes = await response.json();
            // console.log(parseRes);
            setEmail(parseRes.email);
            setFullname(parseRes.name);
            setSelectedImage(parseRes.prfilepic);  // Need to implement this
            setAddress(parseRes.address);
            setPhone(parseRes.contactNo);
            setPincode(parseRes.pincode);
        } catch (error) {
            console.error(error.message);
        }
    };

    const updateUserDetails = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_HOST}/api/v1/user/update`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', authorization: localStorage.getItem('token') },
                body: JSON.stringify({ name: fullname, address, contactNo:phone, pincode }),
            });
            const parseRes = await response.json();
            if (parseRes.success) {
                toast.success('User details updated successfully');
            } else {
                toast.error(parseRes.message);
            }
        } catch (error) {
            console.error(error.message);
        }
    };


    useEffect(() => {
        getUserDetails();
    }, []);

    const updateUserPassword = async (e) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            toast.error('Password does not match');
            return;
        }
        try {
            const response = await fetch(`${import.meta.env.VITE_HOST}/api/v1/user/updatepassword`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', authorization: localStorage.getItem('token') },
                body: JSON.stringify({ currentPassword, newPassword }),
            });
            const parseRes = await response.json();
            if (parseRes.success) {
                toast.success('Password updated successfully');
                setCurrentPassword('');
                setNewPassword('');
                setConfirmPassword('');
            } else {
                toast.error(parseRes.message);
            }
        } catch (error) {
            console.error(error.message);
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        if (!file.name.match(/\.(jpg|jpeg|png)$/) || file.size > 200000) {
            toast.error('Please select valid image file (jpg, jpeg, png) and size should be less than 200KB');
            return;
        }
        const reader = new FileReader();
        reader.onloadend = () => { setSelectedImage(reader.result); };
        if (file && file.size <= 200000) 
            { reader.readAsDataURL(file); }
        else { setSelectedImage(null); 
            alert('Image size should be less than 200KB');
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-100 to-blue-300 flex items-center justify-center p-4">
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
                <h2 className="text-2xl font-bold mb-6 text-center">My Account</h2>
                <div className="flex flex-col items-center mb-6">
                    <img src={selectedImage} alt="Profile" className="w-24 h-24 rounded-full shadow-md mb-4" />
                    <label className="block">
                        <span className="sr-only">Choose Profile Photo</span>
                        <input type="file" onChange={handleImageChange} className="block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-full file:border-0
              file:text-sm file:font-semibold
              file:bg-cyan-50 file:text-cyan-700
              hover:file:bg-cyan-100
            " />
                    </label>
                </div>
                <p className="text-center text-orange-500 mb-4">welcome {email}</p>
                <form>
                    <div className="mb-4">
                        <label className="block text-gray-700">Name</label>
                        <input type="text" className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500" placeholder="Full Name" value={fullname} onChange={(e)=>{setFullname(e.target.value)}}/>
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700">Email</label>
                        <input type="email" className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500" disabled value={email} />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700">Address</label>
                        <textarea className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500" placeholder="Full Adderess" value={address} onChange={(e)=>{setAddress(e.target.value)}}></textarea>
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700">Phone</label>
                        <input type="number" className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500" placeholder="Contact Number" value={phone} onChange={(e)=>{setPhone(e.target.value)}} />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700">Pincode</label>
                        <input type="number" className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500" placeholder="Postal Pin code" value={pincode} onChange={(e)=>{setPincode(e.target.value)}}/>
                    </div>
                    <button onClick={updateUserDetails} type="button" className="w-full bg-cyan-500 text-white py-2 rounded-lg hover:bg-cyan-600 transition duration-300">Update Details</button>
                </form>
                <h3 className="text-xl font-bold mt-8 mb-4">Change Password</h3>
                <form>
                    <div className="mb-4">
                        <label className="block text-gray-700">Current Password</label>
                        <input type="password" className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500" placeholder="Enter Your Current Password" value={currentPassword} onChange={e=>setCurrentPassword(e.target.value)}/>
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700">New Password</label>
                        <input type="password" className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500" placeholder="Enter New Password" value={newPassword} onChange={e=>setNewPassword(e.target.value)} />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700">Confirm New Password</label>
                        <input type="password" className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500" placeholder="Confirm New Password" value={confirmPassword} onChange={e=>setConfirmPassword(e.target.value)} />
                    </div>
                    <button onClick={updateUserPassword} type="submit" className="w-full bg-cyan-500 text-white py-2 rounded-lg hover:bg-cyan-600 transition duration-300">Submit</button>
                </form>
            </div>
        </div>
    );
};

export default UserProfile;
