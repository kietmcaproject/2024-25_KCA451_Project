import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

const OAuthRedirectHandler = () => {
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_BACKEND_URL}/auth/user`, { withCredentials: true })
      .then((res) => {
        if (res.data?.email) {
          toast.success("Login successful via Google!");
          navigate("/"); // Redirect to your desired page (like Home or Dashboard)
        } else {
          navigate("/login");
        }
      })
      .catch((err) => {
        toast.error("Failed to authenticate via Google");
        navigate("/login");
      });
  }, []);

  return <div>Authenticating with Google, please wait...</div>;
};

export default OAuthRedirectHandler;
