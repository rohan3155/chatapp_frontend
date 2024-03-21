import React, { useEffect, useMemo, useState } from 'react';
import { io } from 'socket.io-client';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import UserList from './components/UsersList';
import MessageList from './components/MessageList';
import MessageInput from './components/MessageInput';
import TypingIndicator from './components/TypingIndicator';
import GroupChat from './components/GroupChat';

const Messaging = () => {
    const socket = useMemo(() => io('http://localhost:3000'), []);
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [messages, setMessages] = useState([]);
    const [messageInput, setMessageInput] = useState('');
    const [typingTimeout, setTypingTimeout] = useState(null);
    const [userInfo, setUserInfo] = useState(null);
    const [isTyping, setIsTyping] = useState(false);
    const [utoken, setutoken] = useState(null)
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
            setutoken(userInfo.token)
            setUserInfo(userInfo);

            socket.on('connected setup', () => {
                console.log('Connected to socket.io');
            });

            socket.on('messages', (fetchedMessages) => {
                setMessages(fetchedMessages);
            });

            socket.on('typing', () => {
                setIsTyping(true);
            });

            socket.on('stop typing', () => {
                setIsTyping(false);
            });

            return () => {
                socket.off('connected setup');
                socket.off('messages');
                socket.off('typing');
                socket.off('stop typing');
            };
        }
    }, [navigate, socket]);

    const handleSelection = (user) => {
        setSelectedUser(user);
        if (user && userInfo) {
            socket.emit('join chat', { senderId: userInfo._id, receiverId: user._id });
        }
    };


    const handleMessageInputChange = (e) => {
        const value = e.target.value;
        setMessageInput(value);
        if (selectedUser && value.length > 0) {
            clearTimeout(typingTimeout);
            socket.emit('typing', `${selectedUser._id}_${userInfo._id}`);
            setTypingTimeout(setTimeout(() => {
                socket.emit('stop typing', `${selectedUser._id}_${userInfo._id}`);
            }, 3000));
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

    const [selectedGroup, setselectedGroup] = useState(null)
    const [selectedUserForGroup, setselectedUserForGroup] = useState(null)
    const [groupMessages, setGroupMessages] = useState([])
    useEffect(() => {
        if (selectedGroup) {
            socket.emit('join group', selectedGroup);

            socket.on('group message', (message) => {
                setGroupMessages(prevMessages => [...prevMessages, message]);
            });

            return () => {
                socket.off('group message');
            };
        }
    }, [selectedGroup]);


    const [groupmessageInput, setGroupMessageInput] = useState('');
    const handleGroupMessageInputChange = (e) => {
        setGroupMessageInput(e.target.value);
    };

    const handleGroupMessageSubmit = (e) => {
        e.preventDefault();
        if (!groupmessageInput.trim() || !selectedGroup) return;
        console.log(userInfo._id, selectedGroup, groupmessageInput);
        const data = {
            senderId: userInfo._id, // Add the senderId to the data object
            groupId: selectedGroup,
            content: groupmessageInput,
        };
        console.log(data)
        socket.emit('group message', data); // Emit the message data to the server socket

        socket.on('group newmessage', (message) => {
            // Update the message state with the new group message
            console.log(message)
            setGroupMessages(message);
        });

        setGroupMessageInput(''); // Clear the message input field
    };

    return (
        <div className='flex min-h-screen'>
            <UserList
                users={users}
                selectedUser={selectedUser}
                handleSelection={handleSelection}
                selectedGroup={selectedGroup}
                selectedUserForGroup={selectedUserForGroup}
                setselectedGroup={setselectedGroup}
                setselectedUserForGroup={setselectedUserForGroup}
            />
            <div className='flex-1 p-4 bg-gray-100'>
                {(selectedGroup && groupMessages) ? (
                    <GroupChat groupId={selectedGroup} token={utoken} currentUserId={userInfo._id} handleSubmit={handleGroupMessageSubmit}
                        handleMessageInputChange={handleGroupMessageInputChange}
                        messageInput={groupmessageInput}
                        setMessageInput={setGroupMessageInput}
                        messages={groupMessages}
                    />
                ) : (
                    <div className='flex-1 p-4 bg-gray-100'>
                        <div className='flex items-center mb-4'>
                            <img src={selectedUser?.pic} alt='' className='w-10 h-10 mr-2 rounded-full' />
                            <h2 className='text-lg font-semibold'>{selectedUser?.name}</h2>
                        </div>
                        {
                            (messages && selectedUser) && (
                                <MessageList
                                    messages={messages}
                                    userInfo={userInfo}
                                />
                            )
                        }
                        {isTyping && <TypingIndicator />}
                        <MessageInput
                            messageInput={messageInput}
                            handleMessageInputChange={handleMessageInputChange}
                            handleSubmit={handleSubmit}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default Messaging;
