import { Link } from "react-router-dom";
export default  function ChatUserList({ user }){
    return (
        <Link to={`/ChatPage`} className="user-profile-link">
          <h3>{user.name.charAt(0).toUpperCase()}</h3>
          <h5>{user.name}</h5>
        </Link>
      );
}