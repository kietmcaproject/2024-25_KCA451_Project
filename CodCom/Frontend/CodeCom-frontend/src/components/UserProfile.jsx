import React, { useEffect, useState } from "react";
import userBack from "../images/userBack.png";
import axios from "axios";
import UserEditCard from "./UserEditCard";
import UserProfileCardd from "./UserProfileCardd";
import JoinedCommunity from "./JoinedCommunity";
import CreatedCommunity from "./CreatedCommunity";

function UserProfile() {
  const [visible, setVisible] = useState(true);
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    number: "",
    communityList: [],
  });

  const fetchedData = async () => {
    try {
      const resp = await axios.get("http://localhost:2024/api/user/userProfile", {
        withCredentials: true,
      });
      console.log(resp.data);
      setUserData({
        name: resp.data.name,
        email: resp.data.email,
        number: resp.data.number,
        communityList: resp.data.communityList,
      });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchedData();
  }, []);

  const handleUpdate = () => {
    fetchedData();
  };

  return (
    <div className="">
      <img
        src={userBack}
        className="w-full h-full fixed -z-10 opacity-80 "
        alt=""
      />

      <div className="w-full h-11/12  p-4 sm:p-6 md:p-1 flex items-center justify-center">
        <div className="rounded-3xl w-full max-w-7xl mt-12 sm:mt-10 md:mt-1 bg-opacity-10 bg-black h-auto md:h-[85%] flex flex-col md:flex-row gap-4 sm:gap-6 md:gap-8 p-4 sm:p-6 md:p-8">
          {visible ? (
            <UserProfileCardd
              userName={userData.name}
              userEmail={userData.email}
              userNumber={userData.number}
              userImage=""
              visibleValue={() => setVisible(false)}
            />
          ) : (
            <UserEditCard
              userInputEmail={userData.email}
              onUpdate={handleUpdate}
              visibility={() => setVisible(true)}
            />
          )}
          
          <div className="flex flex-col justify-center gap-8 sm:gap-8 md:gap-8 w-full">
            <div className="bg-white shadow-lg p-4 w-full rounded-xl h-[250px] md:h-58 overflow-y-auto">
              <h1 className="font-bold text-center text-lg sm:text-xl bg-gradient-to-r from-orange-500 to-purple-500 bg-clip-text text-transparent  top-0 bg-white pb-2">
                Created Community
              </h1>
              <div className="mt-4 sm:mt-6">
                <CreatedCommunity />
              </div>
            </div>
            
            <div className="bg-white shadow-lg p-4 w-full rounded-xl h-[250px] md:h-58 overflow-y-auto">
              <h1 className="font-bold text-center text-lg sm:text-xl bg-gradient-to-r from-orange-500 to-purple-500 bg-clip-text text-transparent top-0 bg-white pb-2">
                Joined Community
              </h1>
              <div className="mt-4 sm:mt-6">
                <JoinedCommunity />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserProfile;