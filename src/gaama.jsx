// App.js
import axios from 'axios';
import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useRoutes } from 'react-router-dom';
import { io } from "socket.io-client";



const Messaging = () => {

    const socket = useMemo(() => io('http://localhost:3000'), []);
    const navigate = useNavigate();
    const [message, setMessage] = useState('');
    const [socketId, setSocketId] = useState('');
    const [messages, setMessages] = useState([]);
    const [pvtmessages, setPvtMessages] = useState([]);
    const [groupmessages, setGroupMessages] = useState([]);
    const [receiverId, setReceiverId] = useState('');
    const [senderId, setSenderId] = useState('');
    const [groupname, setGroupName] = useState('');
    const [userRooms, setUserRooms] = useState([]);
    const [userInfo, setUserInfo] = useState(null);
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const fetchUsers = async (token) => {
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };
            const response = await axios.get('http://localhost:3000/api/user', config);
            setUsers(response.data);
        } catch (error) {
            console.log(error);
        }
    };
    useEffect(() => {
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        if (!userInfo) {
            navigate('/login');
        } else {
            fetchUsers(userInfo.token);
            setUserInfo(userInfo);
            socket.on("connect", () => {
                console.log("connected", socket.id);
                setSocketId(socket.id);
                // Get the list of rooms joined by the user
                socket.emit('getRooms');
            });

            socket.on("message", (msg) => {
                setMessages(prevMessages => [...prevMessages, { content: msg, type: "public" }]);
            });

            socket.on("private_message", (msg) => {
                setPvtMessages(prevMessages => [...prevMessages, { content: msg, type: "private" }]);
            });

            socket.on("sendMessageToRoom", (msg) => {
                setGroupMessages(prevMessages => [...prevMessages, { content: msg, type: "group" }]);
            });

            socket.on("userRooms", (rooms) => {
                // Update the list of user rooms
                setUserRooms(rooms);
            });
        }
        return () => {
            socket.off("message");
            socket.off("private_message");
            socket.off("sendMessageToRoom");
            socket.off("userRooms");
        };
    }, [socket]);

    const sendMessage = () => {
        socket.emit("message", message);
        setMessage('');
    };

    const sendPrivateMessage = () => {
        if (receiverId) {
            socket.emit("private_message", receiverId, message);
            setPvtMessages(prevMessages => [...prevMessages, { content: message, type: "private" }]);
            setMessage('');
        } else {
            alert("Please enter receiver id");
        }
    };

    const sendGroupMessage = () => {
        if (groupname) {
            socket.emit("sendMessageToRoom", groupname, message);
            setMessage('');
        } else {
            alert("Please enter group name");
        }
    };

    const joinGroup = () => {
        if (groupname) {
            socket.emit("joinRoom", groupname);
        } else {
            alert("Please enter group name");
        }
    };

    const leaveGroup = (groupName) => {
        socket.emit("leaveRoom", groupName);
    };

    const createGroup = () => {
        if (groupname) {
            socket.emit("createRoom", groupname);
            setMessage('');
        } else {
            alert("Please enter group name");
        }
    };

    const deleteGroup = (groupName) => {
        if (window.confirm(`Are you sure you want to delete the group "${groupName}"?`)) {
            socket.emit("deleteRoom", groupName);
        }
    };
    return (
        <div>
            <h1>Socket ID: {socketId}</h1>
            <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
            />
            <input
                type="text"
                placeholder='ID of receiver'
                value={receiverId}
                onChange={(e) => setReceiverId(e.target.value)}
            />
            <input
                type="text"
                placeholder='group name'
                value={groupname}
                onChange={(e) => setGroupName(e.target.value)}
            />
            <button onClick={sendMessage}>Send</button>
            <button onClick={joinGroup}>Join Group</button>
            <button onClick={sendGroupMessage}>Send Group Message</button>
            <button onClick={sendPrivateMessage}>Send Private Message</button>
            <button onClick={createGroup}>Create Group</button>
            <button onClick={() => deleteGroup(groupname)}>Delete Group</button>
            <p>Socket ID: {socketId}</p>
            <h2>Public Messages:</h2>
            {messages.map((item, index) => (
                <p key={index}>{item.content}</p>
            ))}
            <h2>Private Messages:</h2>
            {pvtmessages.map((item, index) => (
                <p key={index}>{item.content}</p>
            ))}
            <h2>Group Messages:</h2>
            {groupmessages.map((item, index) => (
                <p key={index}>{item.content}</p>
            ))}
            <h2>Groups List:</h2>
            <ul>
                {userRooms.map((groupName, index) => (
                    <li key={index}>
                        {groupName}
                        <button onClick={() => leaveGroup(groupName)}>Leave</button>
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default Messaging