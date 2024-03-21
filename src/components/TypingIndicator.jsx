// TypingIndicator.js
import React from 'react';
import LottieAnimation from './LottieAnimation'; // Assuming you have a component for animation

const TypingIndicator = () => {
    return (
        <div className='flex justify-start text-sm text-gray-500 '>
            <LottieAnimation /> {/* Add your animation component here */}
        </div>
    );
};

export default TypingIndicator;
