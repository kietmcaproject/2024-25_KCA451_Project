import { useLocation, useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import "../HomeMainbar/HomeMainbar.css";
import { useEffect } from "react";
import ChatUserList from "./ChatUserList";

const Chat = () => {

    const user = useSelector((state) => state.currentUserReducer);
    const navigate = useNavigate();

    const checkAuth = () => {
        if (user === null) {
            alert("login or signup to chat");
            navigate("/Auth");
        }
    };

    useEffect(() => {
        checkAuth();
    }, [])

    const users = useSelector((state) => state.usersReducer);
    

    return (
        <>
            
            <div style={styles.container}>
            <h2 style={styles.title}>Select a user to chat with:</h2>
            <ul style={styles.list}>
                {users.map(user => (
                    <li key={user.id} style={styles.listItem}>
                        <Link to={`/ChatPage/${user._id}`} style={styles.link}>
                            <div style={styles.avatar}>{user.name[0]}</div>
                            <span>{user.name}</span>
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
        </>
    );
}

const styles = {
    container: {
        padding: '30px 20px',
        maxWidth: 400,
        margin: '40px auto',
        backgroundColor: '#f9f9f9',
        borderRadius: 10,
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        fontFamily: 'Arial, sans-serif'
    },
    title: {
        marginBottom: 20,
        fontSize: 20,
        fontWeight: '600',
        color: '#333',
    },
    list: {
        listStyle: 'none',
        padding: 0,
        margin: 0,
        display: 'flex',
        flexDirection: 'column',
        gap: 12
    },
    listItem: {
        borderRadius: 8,
        overflow: 'hidden',
        backgroundColor: '#fff',
        transition: 'background 0.3s',
        boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
    },
    link: {
        display: 'flex',
        alignItems: 'center',
        padding: '12px 16px',
        color: '#333',
        textDecoration: 'none',
        gap: 12,
        fontSize: 16,
        fontWeight: 500,
    },
    avatar: {
        width: 36,
        height: 36,
        borderRadius: '50%',
        backgroundColor: '#0084FF',
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: 'bold',
        fontSize: 14,
        textTransform: 'uppercase'
    }
};

export default Chat;