// MessageInput.js
import React from 'react';

const MessageInput = ({ messageInput, handleMessageInputChange, handleSubmit }) => {
    return (
        <form onSubmit={handleSubmit} className='flex items-center justify-center'>
            <input
                type='text'
                className='flex-1 px-4 py-2 bg-gray-300 rounded-full focus:outline-none'
                value={messageInput}
                onChange={handleMessageInputChange}
                placeholder='Type a message...'
            />
            <button
                type='submit'
                className='px-4 py-2 ml-4 text-white rounded-full bg-emerald-500 hover:bg-emerald-600'
            >
                Send
            </button>
        </form>
    );
};

export default MessageInput;
