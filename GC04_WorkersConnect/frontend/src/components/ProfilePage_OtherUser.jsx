import { useLocation, useParams } from "react-router-dom";

const ProfilePage_OtherUser = () => {
  const { state } = useLocation();
  const { id } = useParams();

  const user = state?.user;

  if (!user) return <div>Loading...</div>;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">{user.name}'s Profile</h1>
      <p>Email: {user.email}</p>
      <p>Phone: {user.phone_number}</p>
      <p>Location: {user.location}</p>
      {/* Add whatever else you want here */}
    </div>
  );
};
export default ProfilePage_OtherUser;
