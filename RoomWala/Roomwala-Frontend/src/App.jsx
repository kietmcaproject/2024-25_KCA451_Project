import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Home from './Home.jsx';
import Choice from './choice.jsx';
import Login from './login.jsx';
import Signup from './Signup.jsx';
import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';
import Rooms from './rooms.jsx';
import Temp from './temp.jsx';
import toast from 'react-hot-toast';
import UserProfile from './myaccount.jsx';
import Forgotpassword from './forgetpassword.jsx';
import RoomDetails from './roomdetails.jsx';
import Checkout from './checkout.jsx';
import MyOrdersPage from './myorder.jsx';
import AboutUs from './about_us.jsx';
import PrivacyPolicy from './privacy_policy.jsx';
import TermsAndConditions from './term_conditions.jsx';
import Addrooms from './Addrooms.jsx';
// import { useNavigate  } from 'react-router-dom';

const App = () => {

    const [token, setToken] = useState(null);
    const [isFilterVisible, setFilterVisibility] = useState(false);
    // const navigate = useNavigate();

    useEffect(() => {
        let localtoken = localStorage.getItem('token');
        setToken(localtoken);
    }, []);

    const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
        Math.random();
        toast.success('Logged out successfully');
        // navigate('/');
        window.location.href = '/';
    };    

    return (
        <Router>
            <Routes>
                <Route path="/" element={<><Header token={token} logout={logout} isFilterVisible={isFilterVisible} setFilterVisibility={setFilterVisibility}/><Home token={token} isFilterVisible={isFilterVisible} /><Footer /></>} />
                <Route path="/choice" element={<><Header token={token} logout={logout}/><Choice token={token} /><Footer /></>} />
                <Route path="/login" element={<><Header token={token} logout={logout}/><Login token={token} settoken={setToken} /><Footer /></>} />
                <Route path="/signup" element={<><Header token={token} logout={logout}/><Signup token={token} /><Footer /></>} />
                <Route path="/rooms" element={<><Header token={token} logout={logout} isFilterVisible={isFilterVisible} setFilterVisibility={setFilterVisibility}/><Rooms token={token} isFilterVisible={isFilterVisible} setFilterVisibility={setFilterVisibility}/><Footer /></>} />
                <Route path="/temp" element={<><Header token={token} logout={logout}/><Temp token={token} /><Footer /></>} />
                <Route path="/account" element={<><Header token={token} logout={logout}/><UserProfile token={token} /><Footer /></>} />
                <Route path="/forgotpassword" element={<><Header token={token} logout={logout} /><Forgotpassword token={token} /><Footer /></>} />
                <Route path="/room/:roomid" element={<><Header token={token} logout={logout} /><RoomDetails token={token} /><Footer /></>} />
                <Route path="/checkout" element={<><Header token={token} logout={logout} /><Checkout token={token} /><Footer /></>} />
                <Route path="/orders" element={<><Header token={token} logout={logout} /><MyOrdersPage token={token} /><Footer /></>} />
                <Route path="/about" element={<><Header token={token} logout={logout} /><AboutUs token={token} /><Footer /></>} />
                <Route path="/privacy_policy" element={<><Header token={token} logout={logout} /><PrivacyPolicy token={token} /><Footer /></>} />
                <Route path="/term_conditions" element={<><Header token={token} logout={logout} /><TermsAndConditions token={token} /><Footer /></>} />
                <Route path="/addrooms" element={<><Header token={token} logout={logout} /><Addrooms token={token} /><Footer /></>} />
            </Routes>
        </Router>
    )
}

export default App