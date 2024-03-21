import React, { useEffect, useMemo, useState } from 'react';
import { io } from 'socket.io-client';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Messaging = () => {
    const socket = useMemo(() => io('http://localhost:3000'), []);
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [messages, setMessages] = useState([]);
    const [typingUsers, setTypingUsers] = useState([]);
    const [messageInput, setMessageInput] = useState('');
    const [userInfo, setUserInfo] = useState(null);

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

            socket.on('connected setup', () => {
                console.log('Connected to socket.io');
            });

            socket.on('typing', (room) => {
                setTypingUsers((prevTypingUsers) => [...prevTypingUsers, room]);
            });

            socket.on('stop typing', (room) => {
                setTypingUsers((prevTypingUsers) => prevTypingUsers.filter((user) => user !== room));
            });

            return () => {
                socket.off('connected setup');
                socket.off('typing');
                socket.off('stop typing');
            };
        }
    }, [navigate, socket]);

    useEffect(() => {
        if (selectedUser) {
            const handleMessages = (fetchedMessages) => {
                setMessages(fetchedMessages);
            };

            socket.on('messages', handleMessages);

            return () => {
                socket.off('messages', handleMessages);
            };
        }
    }, [selectedUser, socket]);

    const handleSelection = (user) => {
        setSelectedUser(user);
        if (user && userInfo) {
            socket.emit('join chat', { senderId: userInfo._id, receiverId: user._id });
        }
    };

    const handleMessageInputChange = (e) => {
        setMessageInput(e.target.value);
        if (selectedUser) {
            socket.emit('typing', selectedUser._id);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!messageInput.trim() || !selectedUser) return;
        const newMessage = {
            content: messageInput,
            senderId: userInfo._id,
            receiverId: selectedUser._id
        };
        socket.emit('new message', newMessage);
        setMessageInput('');
    };

    return (
        <div className='flex min-h-screen'>
            <div className='w-1/5 p-4 bg-gray-200'>
                <h1 className='mb-4 text-lg font-semibold'>Users</h1>
                <div className='space-y-2'>
                    {users.map((user) => (
                        <div
                            key={user._id}
                            className={`flex items-center py-2 px-4 cursor-pointer ${selectedUser && selectedUser._id === user._id ? 'bg-blue-200' : ''
                                }`}
                            onClick={() => handleSelection(user)}
                        >
                            <img src={user.pic} alt='' className='w-8 h-8 mr-2 rounded-full' />
                            <span>{user.name}</span>
                            {typingUsers.includes(user._id) && <span className='ml-2 text-sm'>Typing...</span>}
                        </div>
                    ))}
                </div>
            </div>
            <div className='flex-1 p-4 bg-gray-100'>
                <div className='flex items-center mb-4'>
                    <img src={selectedUser?.pic} alt='' className='w-10 h-10 mr-2 rounded-full' />
                    <h2 className='text-lg font-semibold'>{selectedUser?.name}</h2>
                </div>
                <div className='mb-4 overflow-y-auto max-h-screen-3/4'>
                    {messages.map((message, index) => (
                        <div
                            key={index}
                            className={`flex justify-end ${message.senderId === userInfo._id ? 'items-end' : 'items-start'} mb-2`}
                        >
                            <div
                                className={`max-w-xs px-4 py-2 break-words rounded-lg ${message.senderId === userInfo._id ? 'bg-blue-500 text-white rounded-br-none' : 'bg-gray-300 rounded-bl-none'
                                    }`}
                            >
                                {message.content}
                            </div>
                        </div>
                    ))}
                </div>

                <form onSubmit={handleSubmit} className='flex items-center'>
                    <input
                        type='text'
                        className='flex-1 px-4 py-2 bg-gray-300 rounded-full focus:outline-none'
                        value={messageInput}
                        onChange={handleMessageInputChange}
                        placeholder='Type a message...'
                    />
                    <button
                        type='submit'
                        className='px-4 py-2 ml-4 text-white bg-blue-500 rounded-full hover:bg-blue-600'
                    >
                        Send
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Messaging;
