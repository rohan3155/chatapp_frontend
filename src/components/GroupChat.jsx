import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const GroupChat = ({ groupId, token, currentUserId, handleSubmit, messageInput, setMessageInput, handleMessageInputChange, messages }) => {

    const [members, setMembers] = useState([]);
    const fetchMembers = async () => {
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };
            console.log(groupId)
            console.log(config)
            const response = await axios.get(`http://localhost:3000/api/groups/${groupId}/members`,config);
            setMembers(response.data);
        } catch (error) {
            console.error('Error fetching group members:', error.response.data.message);
        }
    };
    useEffect(() => {
        
        fetchMembers();

    }, [groupId]);
console.log(members)
    // console.log(messages);
const navigate =  useNavigate()
    const handleLeaveGroup = async() =>{
                try {
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };
            console.log(groupId)
            console.log(config)
            const response = await axios.delete(`http://localhost:3000/api/groups/${groupId}/removeUser/${currentUserId}`,config);
            console.log(response.data)
            if (response.status === 200) {
                navigate('/')
            }
        } catch (error) {
            console.error('Error fetching group members:', error.response.data.message);
        }
    }

    return (
        <div className="flex flex-col h-screen">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-4 text-white bg-black">
                <h1 className="text-lg font-bold">Group Chat</h1>
                <button className="px-4 py-2 text-white bg-red-500 rounded hover:bg-blue-600"
                onClick={handleLeaveGroup}
                >Leave Group</button>
            </div>
            {/* Member list */}
            <div className="flex items-start justify-between px-4 py-4 text-white bg-slate-900">
            <h1 className="text-lg font-bold">Group Members</h1>
                {members.map((member) => (
                    <div key={member._id} className="flex items-center space-x-2">
                        <img src={member.pic} className="w-8 h-8 rounded-full" alt="" />
                        <span className="text-sm">{member._id === currentUserId ? 'You' : member.name}</span>
                    </div>
                ))}
            </div>
            {/* Message list */}
            <div className="flex-1 px-4 py-2 overflow-y-auto bg-gray-100 message-list">
                {messages ? messages.map((message, index) => (
                    <div
                    key={index}
                    className={`flex justify-${message.senderId._id === currentUserId ? 'end' : 'start'} mb-2`}
                    >
                        {/* {console.log(message)} */}
                        {/* <img src={members.senderId.pic} className='w-8 h-8 mx-2 rounded-full' alt="" /> */}
                        <div
                            className={`max-w-xs px-4 py-2 break-words rounded-lg ${message.senderId._id === currentUserId ? 'bg-blue-400 text-white rounded-br-none' : 'bg-gray-400 rounded-bl-none'
                                }`}
                        >
                        <h1 className='w-full text-sm font-bold text-white'> {message.senderId._id === currentUserId ? 'You' : message.senderId.name}</h1>
                           <h1> {message.content}</h1>
                        </div>
                    </div>
                )) : null}
            </div>
            {/* Message input */}
            <form onSubmit={handleSubmit} className="px-4 py-2 bg-gray-200 message-input">
                <input
                    type="text"
                    placeholder="Type your message..."
                    value={messageInput}
                    onChange={handleMessageInputChange}
                    className="w-full px-3 py-2 text-black border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                />
                <button type="submit" className="px-4 py-2 ml-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600 focus:outline-none focus:bg-blue-600">Send</button>
            </form>
        </div>
    );
};

export default GroupChat;
