import React from 'react';

const MessageList = ({ messages, userInfo }) => {
    return (
        <div className='mb-4 overflow-y-auto max-h-screen-3/4'>
            {messages && messages.map((message, index) => (
                <div
                    key={index}
                    className={`flex justify-${message.sender === userInfo._id ? 'end' : 'start'} mb-2`}
                >
                    <div
                        className={`max-w-xs px-4 py-2 break-words rounded-lg ${message.sender === userInfo._id ? 'bg-blue-500 text-white rounded-br-none' : 'bg-gray-300 rounded-bl-none'
                            }`}
                    >
                        {message.content}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default MessageList;
