// ChatWindow.js
import React from 'react';

const ChatWindow = ({ selectedUser, messages, userInfo }) => {
    return (
        <div className='flex-1 p-4 bg-black'>
            <div className='flex items-center mb-4'>
                <img src={selectedUser?.pic} alt='' className='w-10 h-10 mr-2 rounded-full' />
                <h2 className='text-lg font-semibold'>{selectedUser?.name}</h2>
            </div>
            <div className='mb-4 overflow-y-auto max-h-screen-3/4'>
                {messages.map((message, index) => (
                    <div
                        key={index}
                        className={`flex justify-${message.sender === userInfo._id ? 'end' : 'start'} mb-2`}
                    >
                        <div
                            className={`max-w-xs px-4 py-2 break-words rounded-lg ${message.sender === userInfo._id ? 'bg-blue-500 text-white rounded-br-none' : 'bg-gray-300 rounded-bl-none'}`}
                        >
                            {message.content}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ChatWindow;
